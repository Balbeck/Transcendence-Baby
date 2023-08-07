
import { Injectable, Request, Param, UnauthorizedException, } from '@nestjs/common';
import { Url } from 'url';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/users/user.service';
import { UserEntity } from 'src/users/orm/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  // 'sub' option represent Id butnnamed sub according to Jwt Standards
  async asign_jtw_token(payload: any): Promise<any> {

    // const access_token = this.jwtService.sign(payload);

    // // Envoyez le JWT en tant que cookie dans la réponse
    // res.setHeader('Set-Cookie', cookie.serialize('access_token', access_token, {
    //   httpOnly: true,
    //   sameSite: 'strict',
    //   maxAge: 3600,
    //   path: '/',
    // }));

    return this.jwtService.sign(payload);
    //return { access_token: this.jwtService.sign(payload) };
  }

  async authentification_42(req: Request) {

    const url = new URL(req.url, 'http://localhost:5173');
    //const url = new URL(req.url, 'http://localhost:3000');

    // Vérifiez si le paramètre "code" est présent dans l'URL
    if (url.searchParams.has('code')) {
      const code = url.searchParams.get('code');
      console.log("Code: ", code);

      if (!code) {
        console.log("Pb retour de \'Code\' ");
        return null;
      }

      // Echange 'code' vs a 42 'access_token' to get User's datas.
      try {
        const uid: string = 'u-s4t2ud-a7cd0971a7ed6d84018903f343a3da6756624febce7000fb81d58f50e35e76aa';
        const secret: string = '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';
        const redirect_uri = encodeURIComponent('http://localhost:3000/auth/42api-return');
        //const uid = process.env.UID;
        //const secret = process.env.SECRET;

        console.log("Tentative recuperation { Access Token }... ");
        const url = 'https://api.intra.42.fr/oauth/token';
        const param = `grant_type=authorization_code&code=${code}&client_id=${uid}&client_secret=${secret}&redirect_uri=${redirect_uri}`;

        const response$ = this.httpService.post(url, param);
        //console.log("{ Access Token } 'Response recu !' suite...");
        const response = await lastValueFrom(response$)

        const accessToken = response.data.access_token;
        console.log("{ Access Token: ", accessToken, " }");
        console.log("Tentative recuperation { 'https://api.intra.42.fr/v2/me' }  ...");
        const urlMe = 'https://api.intra.42.fr/v2/me';
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        const getMe$ = this.httpService.get(urlMe, { headers });
        const getMe = await lastValueFrom(getMe$);

        //console.log("/v2/me: ", getMe.data)
        //console.log("/v2/me: *** Received -> OK ***")

        const data = getMe.data;

        // Verifier si le login existe deja dans la dataBase sinon create !
        const user: any = {
          id42: data.id,
          login: data.login,
          userName: data.login,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          avatar: data.image.link,
        }
        console.log("user Me: ", user);

        let user_in_db = await this.userService.find_user_by_id42(user.id42);
        if (!user_in_db) {
          console.log("User: [ ", user.login, " ] doesnt exist in DB, So lets create it ! *");
          await this.userService.add_new_user(user);
          //user_in_db = await this.userService.find_user_by_id42(user.id42);
        }
        else {
          console.log("User:  [ ", user_in_db.login, ' ] => Already exist in the Db');
        }

        console.log("la DB est good, on creer le payload pour le JWT...")
        // Create and return Jwt
        let jwt_payload = {
          sub: data.id42,
          username: data.login
        }
        console.log("Creation du Token avec payload ...");
        return this.asign_jtw_token(jwt_payload);


        // const jwt: string = await this.asign_jtw_token(jwt_payload);
        // console.log("jwt: [", jwt, "]");
        // console.log("try now to return Jwt to Frontend ........");

        // return jwt;

        // const redirectUrl = `http://localhost:5173?jwt=${jwt}`;

        // let res: Response;
        // res.redirect(302, redirectUrl);

        //return ('Welcome on Board  * [' + user.login + '] *');
        //return ('<h1>Welcome on Board</h1> <h2>' + user.login + '</h2>');
      }

      catch (error) {
        console.log("Erreur dans le Try app.service => get_code()");
        console.log("Error: ", error);
        return 'Sorry Mate, that is not for U !';
      }
    }
  }


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



  // async register(req: Request) {
  // }


  // async local_authentification(userName: string, pass: string): Promise<any> {
  //   const user: UserEntity = await this.userService.find_user_by_userName(userName);
  //   // ajouter decriptage bcript du hash before comparaison
  //   if (user?.hash !== pass) {
  //     throw new UnauthorizedException();
  //   }

  //   // -->  [  Creation du JwT  ]  <--
  //   const payload = { sub: user.id, username: user.userName };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };

  // }

  async registerNewUser(bodyRequest) {
    console.log("BodyRequest: ", bodyRequest);
    const email = bodyRequest.email;
    const name = bodyRequest.name;
    const password = bodyRequest.password;

    if (!email || !name || !password) {
      return null;
    }
    try {
      const user = await this.userService.find_user_by_userName(name);
      if (user) { return null; }
      return this.addNewRegistredUser(email, name, password);
    }
    catch (e) {
      return null;

    }
  }


  async addNewRegistredUser(email: string, name: string, password: string) {
    let payload = {
      "id42": 0,
      "login": name,
      "userName": name,
      "lastName": "",
      "firstName": "",
      "email": email,
      "password": password,
      "avatar": "default-Avatar.jpg"
    }
    console.log("[ Register ] -> payload: ", payload);
    this.userService.add_new_user(payload);
    // Create and return Jwt
    let jwt_payload = {
      id: payload.id42,
      username: payload.login
    }
    console.log("Creation du Token avec payload pour *[ New Registrer User ]* ...");
    return this.asign_jtw_token(jwt_payload);
  }

  async login(bodyRequest) {
    const name = bodyRequest.name;
    const password = bodyRequest.password;

    if (!name || !password) {
      return null;
    }
    try {
      const user = await this.userService.find_user_by_userName(name);
      if (!user || user.hash !== password) { return null; }
      let jwt_payload = {
        id: user.id42,
        username: user.login
      }
      console.log("Creation du Token avec payload pour *[ LoGiN  User ]* ...");
      return this.asign_jtw_token(jwt_payload);
    }
    catch (e) {
      return null;

    }
  }

}