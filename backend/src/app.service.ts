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
    return this.authService.asign_jtw_token(jwt_payload);
  }

  async loginHector() {
    // Verif si user in Db before creation
    let user: any = await this.userService.find_user_by_login("balbecke");
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
      "username": "balbecke"
    }
    console.log("Creation du Token avec payload pour [ balbecke ]...");
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
      id42: 79333,
      login: "balbecke",
      userName: "balbecke",
      firstName: "Benjamin",
      lastName: "Albecker",
      email: "balbecke@student.42nice.fr",
      avatar: "https://cdn.intra.42.fr/users/75ecc020e16ebd135ed82edd7aaf02b7/balbecke.jpg",
    }
    this.userService.add_new_user(user2);
    return this.userService.find_user_by_login(user2.login);
  }

}
