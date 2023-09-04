
import { Injectable, UnauthorizedException, BadRequestException, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as argon2 from 'argon2';
import * as otplib from 'otplib';
import { toDataURL } from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from './jwt/jwt.service';
import { UserEntity } from 'src/users/orm/user.entity';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  private onlineUsersMap = new Map<number, UserEntity>();
  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private configService: ConfigService,
    private jwtAuthService: JwtAuthService,
    private jwtService: JwtService,
  ) { }

  // * - - - [  OnLine Users - MAP< number, User > -  ] - - - *
  add_Online_User_inMap(jwt: string, user: UserEntity) {
    const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
    console.log(" -[ add MAP ]-  Id: {", decoded.id, "}")
    console.log(" -[ add MAP ]-  is user alreadyin Map: {", this.onlineUsersMap.has(decoded.id), "}")
    if (!this.onlineUsersMap.has(decoded.id)) {
      this.onlineUsersMap.set(decoded.id, user);
    }
  }

  remove_Online_User_inMap(jwt: string) {
    const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
    this.onlineUsersMap.delete(decoded.id);
  }

  async get_Online_Usernames(id: number) {
    console.log(" -[ GET Online ]- requette de user.id: {", id, "}")
    let loginList: string[] = [];
    let usernameList: string[] = [];
    //console.log(" -[ GET Online ]- init mapInside: ", loginList)
    const mapSize = this.onlineUsersMap.size;
    console.log(" -[ GET Online ]- mapSize: ", mapSize)
    if (mapSize === 1) { return [] }
    else {
      this.onlineUsersMap.forEach((user) => {
        console.log(" -[ GET Online ]- Map -> username: [", user.userName, "]  id: {", user.id, "}")
        if (user.id !== id) {
          loginList.push(user.login);
        }
      });
      for (const userLogin of loginList) {
        const user = await this.userService.find_user_by_login(userLogin);
        usernameList.push(user.userName);
      }
      return usernameList;
    }
  }

  isUserOnline(login: string) {
    this.onlineUsersMap.forEach((user) => {
      console.log(" -[ GET Online ]- Map -> username: [", user.userName, "]  id: {", user.id, "}")
      if (user.login === login) {
        return true;
      }
    });
    return false;
  }
  //////////////////////////////////////////////////////////////////



  // * - - - [  Authentification  { 42 } User  ] - - - *
  async authentification_42(req: Request) {

    // Vérifiez si le paramètre "code" est présent dans l'URL
    const url = new URL(req.url, 'http://localhost:5173');
    if (url.searchParams.has('code')) {
      const code = url.searchParams.get('code');
      //console.log("Code: ", code);
      if (!code) {
        //console.log("Pb retour de \'Code\' ");
        //throw new UnauthorizedException();
        return null;
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
        let jwt_payload = {
          "id": newCreatedUser.id,
          "login": newCreatedUser.login,
          "username": newCreatedUser.userName,
        }
        const jwt = await this.jwtAuthService.createToken(jwt_payload);
        this.add_Online_User_inMap(await jwt, newCreatedUser);
        return jwt;
      }

      catch (error) {
        console.log(" *{ Erreur }* -[ Auth42 ]-   -> error: ", error);
        // return new UnauthorizedException;
        return null;
      }
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////


  // * - -[  GOOGLE  AUTHentificator  ]- - *
  isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, fa2Secret: string) {
    return otplib.authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: fa2Secret,
    });
  }
  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  //  -[ VERIFY  2 FA - Google Auth ]-
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
        let jwt_payload = {
          "id": newAuthUser.id,
          "login": newAuthUser.login,
          "username": newAuthUser.userName,
        }
        console.log("Creation du Token avec payload ... payload: ", jwt_payload);
        const jwt = await this.jwtAuthService.createToken(jwt_payload);
        this.onlineUsersMap.set(newAuthUser.id, newAuthUser);
        return jwt;
      }
    }
    console.log("-[ Verify_2Fa ]- Code INVALIDE");
    return null;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////


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
  async logout(login: string, jwt: string) {
    this.remove_Online_User_inMap(jwt);

    //
    const mapSize = this.onlineUsersMap.size;
    console.log("mapSize: ", mapSize)
    //

  }
  /////////////////////////////////////////////////////////////////


  // * - - - [ Password - H A S H ] - - - *
  hashData(data: string) {
    return argon2.hash(data);
  }
  ///////////////////////////////////////////

}