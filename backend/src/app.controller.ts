import { Controller, Get, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService) { }

  // //  *[ Test without - 42 API - ]*
  // @Get('add')
  // addUsersTest() {
  //   return this.appService.addUsersTest()
  // }
}