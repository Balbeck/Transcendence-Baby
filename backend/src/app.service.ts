import { Injectable } from '@nestjs/common';
import { UserService } from './users/user.service';

@Injectable()
export class AppService {
  constructor(private userService: UserService) { }













  // addUsersTest() {
  //   const user1: any = {
  //     id42: 79333,
  //     login: "balbecke",
  //     userName: "balbecke",
  //     firstName: "Benjamin",
  //     lastName: "Albecker",
  //     email: "balbecke@student.42nice.fr",
  //     avatar: "https://cdn.intra.42.fr/users/75ecc020e16ebd135ed82edd7aaf02b7/balbecke.jog",
  //   }
  //   const user2: any = {
  //     id42: 79336,
  //     login: "chchao",
  //     userName: "chchao",
  //     firstName: "Chia yen",
  //     lastName: "Chao",
  //     email: "chchao@student.42nice.fr",
  //     avatar: "https://cdn.intra.42.fr/users/76a75eef453ad4a765f5b33e4af21063/chchao",
  //   }
  //   this.userService.add_new_user(user1);
  //   this.userService.add_new_user(user2);
  // }
}
