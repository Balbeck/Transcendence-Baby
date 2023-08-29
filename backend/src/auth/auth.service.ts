
import { Injectable, UnauthorizedException, BadRequestException, } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import * as otplib from 'otplib';
import { toDataURL } from 'qrcode';



@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }


  // * - - - [  Authentification  { 42 } User  ] - - - *
  async authentification_42(req: Request) {

    // Vérifiez si le paramètre "code" est présent dans l'URL
    const url = new URL(req.url, 'http://localhost:5173');
    if (url.searchParams.has('code')) {
      const code = url.searchParams.get('code');
      //console.log("Code: ", code);
      if (!code) {
        //console.log("Pb retour de \'Code\' ");
        throw new UnauthorizedException();
      }

      // Echange 'code' vs a 42 'access_token' to get User's datas.
      try {
        const uid: string = this.configService.get<string>('UID');
        const secret: string = this.configService.get<string>('42_SECRET');
        //console.log("uid: ", uid);
        //console.log("secret: ", secret);
        const redirect_uri = encodeURIComponent('http://localhost:3000/auth/42api-return');

        console.log("Tentative recuperation { Access ( 42 ) Token } .. .");
        const url = 'https://api.intra.42.fr/oauth/token';
        const param = `grant_type=authorization_code&code=${code}&client_id=${uid}&client_secret=${secret}&redirect_uri=${redirect_uri}`;
        const response$ = this.httpService.post(url, param);
        //console.log("{ Access Token } 'Response recu !' suite...");
        const response = await lastValueFrom(response$)

        const accessToken = response.data.access_token;
        console.log("Tentative recuperation { 'https://api.intra.42.fr/v2/me' }  ...");
        const urlMe = 'https://api.intra.42.fr/v2/me';
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const getMe$ = this.httpService.get(urlMe, { headers });
        const getMe = await lastValueFrom(getMe$);
        //console.log(" -[ 42 ]- /v2/me: ", getMe.data)

        const data = getMe.data;


        // Verifier si le login existe deja dans la dataBase sinon create !
        //let user_in_db = await this.userService.find_user_by_userName(data.username);
        let user_in_db = await this.userService.find_user_by_login(data.login);
        if (!user_in_db) {
          console.log("User: [ ", data.login, " ] doesnt exist in DB, So lets create it ! *");
          const user = {
            is42: true,
            login: data.login,
            userName: data.login,
            email: data.email,
            avatar: data.image.link,
            id42: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
          }
          console.log("user Me: ", user);
          await this.userService.add_new_user(user);
        }
        else {
          console.log("User:  [ ", user_in_db.login, ' ] => Already exist in the Db');
        }
        const newCreatedUser = await this.userService.find_user_by_login(data.login);
        // Create and return Jwt
        let jwt_refresh_token_payload = {
          "id": newCreatedUser.id,
          "login": newCreatedUser.login,
          "username": newCreatedUser.userName
        }
        const refresh_token = await this.sign_refresh_jwt(jwt_refresh_token_payload);
        //console.log("-[ Auth 42 ]- , Refresh Token :  ", refresh_token);
        const hashed_refresh_token = this.hashData(refresh_token);
        await this.userService.update_User_RefreshToken(newCreatedUser.login, await hashed_refresh_token);
        //console.log("[ After Refresh Update] User: ", await this.userService.find_user_by_login(newCreatedUser.login));

        let jwt_payload = {
          "id": newCreatedUser.id,
          "login": newCreatedUser.login,
          "username": newCreatedUser.userName,
          "refresh_token": hashed_refresh_token
        }
        //console.log("Creation du Token avec payload ... payload: ", jwt_payload);
        return this.asign_jtw_token(jwt_payload);
      }

      catch (error) {
        console.log(" *{ Erreur }* -[ Auth42 ]-   -> error: ", error);
        return new UnauthorizedException;
      }
    }
  }


  /////////////////                VERIFY        2 FA

  async verify_2fa(req: Request) {
    let login: string;
    let code: string;
    const url = new URL(req.url, 'http://localhost:5173');

    if (url.searchParams.has('code')) {
      code = url.searchParams.get('code');
      console.log("-[ Verify_2Fa ]-Code: ", code);
      if (!code) {
        console.log("-[ Verify_2Fa ]- no (code) in Url ");
        throw new UnauthorizedException();
      }
    } else {
      console.log("-[ Verify_2Fa ]-no code in Param URL");
    }

    if (url.searchParams.has('login')) {
      login = url.searchParams.get('login');
      console.log("-[ Verify_2Fa ]-login: ", login);
      if (!login) {
        console.log("-[ Verify_2Fa ]- no (login) in URL");
        throw new UnauthorizedException();
      }
    } else {
      console.log("-[ Verify_2Fa ]-no login in Param URL");
    }
    if (code && login) {
      console.log("-[ Verify_2Fa ]-login & code bien Presents");
      const newAuthUser = await this.userService.find_user_by_login(login);
      const secret = newAuthUser.fa2Secret;
      if (this.isTwoFactorAuthenticationCodeValid(code, secret)) {
        await this.userService.turn_2fa_on(login);
        console.log("-[ Verify_2Fa ]- Code Valide");
        // Create and return Jwt
        let jwt_refresh_token_payload = {
          "id": newAuthUser.id,
          "login": newAuthUser.login,
          "username": newAuthUser.userName
        }
        const refresh_token = await this.sign_refresh_jwt(jwt_refresh_token_payload);
        //console.log("-[ Auth 42 ]- , Refresh Token :  ", refresh_token);
        const hashed_refresh_token = this.hashData(refresh_token);
        await this.userService.update_User_RefreshToken(newAuthUser.login, await hashed_refresh_token);
        //console.log("[ After Refresh Update] User: ", await this.userService.find_user_by_login(newAuthUser.login));

        let jwt_payload = {
          "id": newAuthUser.id,
          "login": newAuthUser.login,
          "username": newAuthUser.userName,
          "refresh_token": hashed_refresh_token
        }
        console.log("Creation du Token avec payload ... payload: ", jwt_payload);
        return this.asign_jtw_token(jwt_payload);
      }
      // else {
      //   await this.userService.clear2fa(login);
      // }
    }
    console.log("-[ Verify_2Fa ]- Code INVALIDE");
    return null;
  }




  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }
  /////////////////////////////////////////////////////////////////////////////////////////////

  // async verifyJWT(token: string) {
  //   let payload: any;
  //   payload = this.jwtService.decode(token);
  //   if (!payload) { return false }
  //   const username: string = payload.data.username;
  //   console.log("username extrait du Jwt", username);
  //   const userInfo: any = this.userService.find_user_by_userName(username);
  //   if (!userInfo) { return false }
  //   return true;
  // }

  // async local_authentification(userName: string, pass: string): Promise<any> {
  //   const user: UserEntity = await this.userService.find_user_by_userName(userName);
  //   // ajouter decriptage bcript du hash before comparaison
  //   if (user?.hash !== pass) {
  //     throw new UnauthorizedException();
  //   }
  //   // -->  [  Creation du JwT  ]  <--
  //   const payload = { sub: user.id, username: user.userName };
  //   return await this.jwtService.signAsync(payload);
  //   }
  // }


  // * - -[  Register New { User }  ]- - *
  async registerNewUser(bodyRequest) {
    console.log("-[ Auth-RegisterNewUser ]- BodyRequest: ", bodyRequest);
    const email = bodyRequest.email;
    const name = bodyRequest.name;
    let password = bodyRequest.password;

    if (!email || !name || !password) {
      return null;
    }
    const user = await this.userService.find_user_by_login(name);
    if (user) {
      return null;
      //throw new BadRequestException('User already exists')
    }
    const hash = await this.hashData(password);
    return this.addNewRegistredUser(email, name, password);
  }

  // * - -[  Add New { User } to DB and send a { JWT } ]- - *
  async addNewRegistredUser(email: string, name: string, password: string) {
    console.log("-[Auth]- NewRegistredUser");
    try {
      let payload = {
        "is42": false,
        "hasPassword": true,
        "login": name,
        "userName": name,
        "email": email,
        "password": password
      }
      console.log("[ Register ] -> payload: ", payload);
      this.userService.add_new_user(payload);
      let user = await this.userService.find_user_by_login(name);
      console.log("-[ Register ]- user: ", user);

      // Create and return Jwt
      let jwt_refresh_token_payload = {
        "id": user.id,
        "login": user.login,
        "username": user.userName
      }
      const refresh_token = await this.sign_refresh_jwt(jwt_refresh_token_payload);
      console.log("-[ Auth 42 ]- , Refresh Token before Has:  ", refresh_token);

      const hashed_refresh_token = await this.hashData(refresh_token);
      await this.userService.update_User_RefreshToken(user.login, hashed_refresh_token);
      console.log("[ After Refresh Update] User: ", await this.userService.find_user_by_login(user.login));

      let jwt_payload = {
        "id": user.id,
        "login": user.login,
        "username": user.userName,
        "refresh_token": hashed_refresh_token
      }



      console.log("Creation du Token avec payload pour *[ New Registrer User ]* ...");
      return this.asign_jtw_token(jwt_payload);
    }
    catch (e) {
      return null;
      //throw new UnauthorizedException();
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////


  // * - -[  Google Authentificator  ]- - *


  // async VerifyGoogleAuth_Code(code: string, dbCode:string) {
  //   return otplib.authenticator.check(code, dbCode); 
  // }


  isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, fa2Secret: string) {
    return otplib.authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: fa2Secret,
    });
  }










  ///////////////////////////////////////////////////////////////////////////////////////////


  // * - -[  Login { User }  ]- - *
  async login(bodyRequest) {
    const name = bodyRequest.name;
    const password = bodyRequest.password;

    if (!name || !password) {
      throw new BadRequestException('User does not exist');;
    }
    try {
      const user = await this.userService.find_user_by_login(name);
      if (!user) {
        throw new BadRequestException('User does not exist');
      }

      const passwordMatches = await argon2.verify(user.hash, password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Password is incorrect');
      }


      let jwtPayload = {
        "id": user.id,
        "login": user.login,
        "username": user.userName
      }
      //const refreshToken = await this.sign_refresh_jwt(jwtPayload);
      //const accessToken = await this.sign_normal_jwt(jwtPayload);
      const tokens = await this.getTokens(jwtPayload);
      await this.updateRefreshToken(user.login, tokens.refreshToken);

      return tokens.accessToken;
      // return await this.asign_jtw_token(jwt_payload);
    }
    catch (e) {
      throw new UnauthorizedException();
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////

  // * - - - [ Password - H A S H ] - - - *
  hashData(data: string) {
    return argon2.hash(data);
  }
  ///////////////////////////////////////////


  // * - - - [  J.W.T  ] - - - *
  async asign_jtw_token(payload: any): Promise<any> {
    let jwt = await this.jwtService.signAsync(payload);
    const res = this.jwtService.decode(jwt) as { [key: string]: any };
    console.log('New Jwt encode: ', res);
    return jwt;
    //return { access_token: this.jwtService.sign(payload) };
  }

  async updateRefreshToken(login: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update_User_RefreshToken(login, hashedRefreshToken);
  }

  async sign_normal_jwt(payload: any) {
    return await this.jwtService.signAsync(
      {
        id: payload.id,
        login: payload.login,
        username: payload.username
      },
      {
        // secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );
  }

  async sign_refresh_jwt(payload: any) {
    return await this.jwtService.signAsync(
      {
        id: payload.id,
        login: payload.login,
        username: payload.username
      },
      {
        // secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
  }

  // * - -[  J.W.T  ]- - * / [ Generate Jwt + Refresh ]
  async getTokens(payload: any) {
    const accessToken = await this.sign_normal_jwt(payload);
    const refreshToken = await this.sign_refresh_jwt(payload);
    return { accessToken, refreshToken };
  }
  //////////////////////////////////////////////////////////////////////////////////////




  // * - - - [  Change UserName  ] - - - *
  async change_userName(login: string, newUsername: string) {
    console.log('-[ Change_UserName ]- login: ', login, ' .  newUsername: ', newUsername);
    if (newUsername === '') {
      console.log('empty username');
      return null;
    }
    // check if user exists
    const user = await this.userService.find_user_by_login(login);
    if (!user) {
      console.log('User does not exist in db -> ', login);
      throw new BadRequestException('User does not exist');;
    }
    //check if new userName already in use
    console.log("-[AuthService]- {Change Name} -- ");
    const userNameCheck = await this.userService.find_user_by_userName(newUsername);
    console.log("userbyUsername: ", userNameCheck);
    const userLoginCheck = await this.userService.find_user_by_login(newUsername);
    console.log("userbyLogin: ", userLoginCheck);
    if (login === newUsername) {
      if (userNameCheck) {
        console.log('UserName already in use');
        throw new BadRequestException('UserName already in use');
      }
    }
    else if (userNameCheck || userLoginCheck) {
      console.log('New UserName already in use');
      throw new BadRequestException('UserName already in use');
    }

    return await this.userService.change_username(login, newUsername);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////


  // * - - - [  L O G O U T  ] - - - *
  async logout(login: string) {
    return this.userService.update_User_RefreshToken(login, null);
    // voir si mise en place  - une map<> pour online Users - une map<> inGame Users
  }
  /////////////////////////////////////////////////////////////////

}