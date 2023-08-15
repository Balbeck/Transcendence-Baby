import { Body, Controller, Get, Post, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService) { }

  //  *[ Test without - 42 API - ]*
  // @Get('add')
  // addUsersTest() {
  //   return this.appService.addUsersTest()
  // }

  // @Get('/42api-return')
  // async authentificate_42_User(@Request() req, @Response() res) {
  //   const jwt = await this.authService.authentification_42(req);
  //   console.log("le jwt Controller:", jwt);



  //   // redirection vers le front avec le Jwt en Url
  //   const frontendUrl = `http://localhost:5173/?jwt=${jwt}`;
  //   res.redirect(frontendUrl);
  // }



  @Get('loginChchao')
  async loginChris(@Response() res) {
    const jwt = await this.appService.loginChris();
    const frontendUrl = `http://localhost:5173/?jwt=${jwt}`;
    res.redirect(frontendUrl);
  }

  @Get('loginBalbecke')
  async loginHector(@Response() res) {
    const jwt = await this.appService.loginHector();
    const frontendUrl = `http://localhost:5173/?jwt=${jwt}`;
    res.redirect(frontendUrl);
  }
}