import { Body, HttpStatus, Injectable, Req, Response } from '@nestjs/common';
import { UserService } from './users/user.service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppService {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) { }



  //////////// Uniquement Buttons User1 et User2 pour Test ////////////////////////
  // Aucun code normallement present ici

  async loginChris() {
    // Verif si user in Db before creation
    let user: any = await this.userService.find_user_by_login("chchao");
    if (!user) {
      console.log("User: [ chchao ] doesnt exist in DB, So lets create it ! *");
      user = this.addUser1();
    }
    else {
      console.log("User:  [ chchao ] => Already exist in the Db");
    }
    console.log("la DB est good, on creer le payload pour le JWT...")
    // Create and return Jwt
    let jwt_payload = {
      "id": user.id,
      "login": user.login,
      "username": "chchao"
    }
    console.log("Creation du Token avec payload pour [ chchao ]...");
    const jwt = this.authService.asign_jtw_token(jwt_payload);
    this.authService.add_Online_User_inMap(await jwt, user);
    return jwt;
  }

  async loginHector() {
    // Verif si user in Db before creation
    let user: any = await this.userService.find_user_by_login("boby");
    if (!user) {
      console.log("User: [ balbecke ] doesnt exist in DB, So lets create it ! *");
      user = this.addUser2();
    }
    else {
      console.log("User:  [ balbecke ] => Already exist in the Db");
    }
    console.log("la DB est good, on creer le payload pour le JWT...")
    // Create and return Jwt
    let jwt_payload = {
      "id": user.id,
      "login": user.login,
      "username": "boby"
    }
    console.log("Creation du Token avec payload pour [ balbecke ]...");
    const jwt = this.authService.asign_jtw_token(jwt_payload);
    this.authService.add_Online_User_inMap(await jwt, user);
    return this.authService.asign_jtw_token(jwt_payload);
  }



  addUser1() {
    const user1: any = {
      id42: 79336,
      login: "chchao",
      userName: "chchao",
      firstName: "Chia yen",
      lastName: "Chao",
      email: "chchao@student.42nice.fr",
      avatar: 'images/defaultAvatar.jpg',
      //avatar: "https://cdn.intra.42.fr/users/76a75eef453ad4a765f5b33e4af21063/chchao",
    }
    this.userService.add_new_user(user1);
    return this.userService.find_user_by_login(user1.login);
  }



  addUser2() {
    const user2: any = {
      id42: 42,
      login: "boby",
      userName: "boby",
      firstName: "Brutus",
      lastName: "alBrutus",
      email: "kekedu06@gmail.com",
      avatar: 'images/defaultAvatar.jpg'
    }
    this.userService.add_new_user(user2);
    return this.userService.find_user_by_login(user2.login);
  }

}
