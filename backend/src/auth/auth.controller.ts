
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Redirect, Request, Response, UseGuards } from "@nestjs/common";
import * as dotenv from 'dotenv';
import { AuthService } from "./auth.service";
import { AuthGuard } from './auth.guard';
dotenv.config();

const api_uid = 'u-s4t2ud-a7cd0971a7ed6d84018903f343a3da6756624febce7000fb81d58f50e35e76aa';
const redirect_uri = encodeURIComponent('http://localhost:3000/auth/42api-return');
//const redirect_uri = encodeURIComponent('http://localhost:5173');
//const code_uri = encodeURIComponent('http://localhost:5173');

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /////////////////////////////////   [ 4 2   A u t h ]        //////////////////////////////////
    // --> [ ** Etape 1 **   -> Rediriger le User vers l'Api de 42 afin d'avoir un GET 'code' ] <--
    @Get('/42')
    @HttpCode(302)
    @Redirect(`https://api.intra.42.fr/oauth/authorize?client_id=${api_uid}&redirect_uri=${redirect_uri}&response_type=code`)
    //@Redirect(`https://api.intra.42.fr/oauth/authorize?client_id=${api_uid}&redirect_uri=${code_uri}&response_type=code`)
    redirect() { }

    //--> [ ** Etape 2 **  -> Get le retour de 42Api pour extraire le 'code', verif Auth make requests a 42Api ] <--
    @Get('/42api-return')
    async authentificate_42_User(@Request() req, @Response() res) {
        const jwt = await this.authService.authentification_42(req);
        console.log("le jwt Controller:", jwt);

        // // redirection vers le front avec le Jwt dans le Header
        // res.setHeader('Authorization', `Bearer ${jwt}`);
        // res.redirect('http://localhost:5173');

        // redirection vers le front avec le Jwt en Url
        const frontendUrl = `http://localhost:5173/?jwt=${jwt}`;
        res.redirect(frontendUrl);
    }

    //--> [ ** Etape 3 **  -> Verifie si le Jwt est valide  ] <--
    @UseGuards(AuthGuard)
    @Post('verifier_jwt')
    checkJwt() {
        return true
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////


    // /////////////////////////////////   [ L o c a l   A u t h ]      //////////////////////////////////
    // // --> [  ** Register **  'Local' new user - Non 42 User -  ] <--
    // @HttpCode(HttpStatus.OK)
    // @Post('register')
    // register_new_local_user(@Request() req: Request) {
    //     return this.authService.register(req);
    // }

    // // --> [  ** Authentification **  'Local users' - Non 42 User -  ] <--
    // @HttpCode(HttpStatus.OK)
    // @Get('local')
    // authentificate_Local_User(@Body() ) {
    //     return this.authService.local_authentification(userName: string, pass: string);
    // }

    // @HttpCode(HttpStatus.OK)
    // @Post('login')
    // signIn(@Body() signInDto: Record<string, any>) {
    //     return this.authService.signIn(signInDto.username, signInDto.password);
    // }
    // /////////////////////////////////////////////////////////////////////////////////////////////////////


}