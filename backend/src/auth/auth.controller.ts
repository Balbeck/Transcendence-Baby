
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Redirect, Request, Response, UnauthorizedException, UseGuards, Put } from "@nestjs/common";
import * as dotenv from 'dotenv';
import { AuthService } from "./auth.service";
import { AuthGuard } from './guards/auth.guard';
import { UserService } from "src/users/user.service";
import { JwtService } from "@nestjs/jwt";
dotenv.config();
import { toDataURL } from "qrcode";
import * as otplib from 'otplib';

const frontUrl = 'http://localhost:5173';

const api_uid = 'u-s4t2ud-a7cd0971a7ed6d84018903f343a3da6756624febce7000fb81d58f50e35e76aa';
const redirect_uri = encodeURIComponent('http://localhost:3000/auth/42api-return');
//const redirect_uri = encodeURIComponent('http://localhost:5173');
//const code_uri = encodeURIComponent('http://localhost:5173');

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private userService: UserService,
        private jwtService: JwtService) { }


    /////////////////////////////////   [ 4 2   A u t h ]        //////////////////////////////////
    // --> [ ** Etape 1 **   -> Rediriger le User vers l'Api de 42 afin d'avoir un GET 'code' ] <--
    @Get('42')
    @HttpCode(302)
    @Redirect(`https://api.intra.42.fr/oauth/authorize?client_id=${api_uid}&redirect_uri=${redirect_uri}&response_type=code`)
    //@Redirect(`https://api.intra.42.fr/oauth/authorize?client_id=${api_uid}&redirect_uri=${code_uri}&response_type=code`)
    redirect() { }

    //--> [ ** Etape 2 **  -> Get le retour de 42Api pour extraire le 'code', verif Auth make requests a 42Api ] <--
    @Get('42api-return')
    async authentificate_42_User(@Request() req, @Response() res) {
        const jwt = await this.authService.authentification_42(req);
        //  console.log("le jwt Controller:", jwt);

        const jwtdecoded = await this.jwtService.decode(jwt) as { login: string };;
        //console.log("le jwtdecoded :", jwtdecoded);
        const user = await this.userService.find_user_by_login(jwtdecoded.login);
        if (user.fa2 === true) {
            console.log("-[ Auth 42 ]- 2fa user [ ", user.login, " ] { True }");

            const login: string = user.login;
            //const QrImg = await this.userService.get_QRCode(login);
            //const QrImg = await this.userService.enable_2fa(login);

            //const QrCodePromise = this.authService.generateQrCodeDataURL(user.fa2QRCode);
            //const QrCode = await QrCodePromise;

            // const q = user.fa2QRCode;
            // const qr = await toDataURL(q);
            // console.log("[ QR Code - Auth Controller ] q : ", q);
            const frontUrl = `http://localhost:5173/?login=${login}`;
            //const frontUrl = `http://localhost:5173/?qrcode=${QrImg}&login=${login}`;
            res.redirect(frontUrl);
        }
        else {
            console.log("-[ Auth 42 ]- 2fa user [ ", user.login, " ] { False }");
            // redirection vers le front avec le Jwt en Url
            const frontendUrl = `http://localhost:5173/?jwt=${jwt}`;
            res.redirect(frontendUrl);
        }
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

    // (@Req() request: Request) => Notation exacte used NestJsDocs
    @HttpCode(HttpStatus.OK)
    @Post('register')
    async register(@Body() bodyRequest, @Response() res) {
        const jwt = await this.authService.registerNewUser(bodyRequest);
        const frontendUrl = `http://localhost:5173/?jwt=${jwt}`;
        res.redirect(frontendUrl);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() bodyRequest, @Response() res) {
        let frontendUrl: string = `http://localhost:5173`;
        const jwt = await this.authService.login(bodyRequest);
        if (jwt !== null) {
            frontendUrl = `http://localhost:5173/?jwt=${jwt}`;
        }
        // if (jwt === null) { frontendUrl = `http://localhost:5173`; }
        // else { frontendUrl = `http://localhost:5173/?jwt=${jwt}`; }
        res.redirect(frontendUrl);
    }


    // /////////////////////////////////////////////////////////////////////////////////////////////////////



    // /////////////////////////////////   [ User Modifications ]      //////////////////////////////////


    @HttpCode(HttpStatus.OK)
    @Get('verify_2fa')
    async verify_2fa(@Request() req, @Response() res) {
        console.log("-[ verify_2fa ]-");
        const tokenJwt = await this.authService.verify_2fa(req);
        res.json({ jwt: tokenJwt });
    }

    @HttpCode(HttpStatus.OK)
    @Get('get_google_2fa')
    async get_google_2fa(@Request() req, @Response() res) {
        const url = new URL(req.url, 'http://localhost:5173');

        // Vérifiez si le paramètre "code" est présent dans l'URL
        if (url.searchParams.has('login')) {
            const login = url.searchParams.get('login');
            console.log("-[ get_google-2fa ]- login: ", login);
            if (!login) {
                //console.log("Pb retour de \'Code\' ");
                throw new UnauthorizedException();
            }
            const QrImg = await this.userService.get_QRCode(login);
            //    console.log("QrImg Envoye au front:  ", QrImg)
            res.json({ url: QrImg });
        }
        else {
            throw new UnauthorizedException();
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get('enable_2fa')
    async preview2fa(@Request() req, @Response() res) {
        let login: string;
        const token = req.headers.authorization;
        if (token) {
            const jwt = token.replace('Bearer', '').trim();
            const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
            //  console.log('-[Enable 2Fa ]- Jwt decoded from Header (Get): ', decoded);


            if (decoded && decoded.login) {
                login = decoded.login;
                console.log('-[Enable 2Fa ]- Jwt login', login);
            }
            //return le bon Url a afficher 
            const QrImg = await this.userService.enable_2fa(login);
            //console.log("QrImg Envoye au front:  ", QrImg)

            // const secret = otplib.authenticator.generateSecret();
            // // Genere QRCode
            // const user = await this.userService.find_user_by_login(login);
            // const email = user.email;
            // const otpauthUrl = otplib.authenticator.keyuri(email, 'Pong_Transcendence', secret);
            // const qr = await toDataURL(otpauthUrl);
            res.json({ url: QrImg });

        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('enable_2fa')
    async enable_2fa(@Request() req, @Response() res) {
        console.log("-[ 2fa ]- Enable ");
        const login = req.body.data.login;
        console.log("-[ 2fa ]- login Value:  ", login);
        const QrUrl = await this.userService.enable_2fa(login);
        const data = { urlcode: QrUrl };
        res.json(data);
    }






    @HttpCode(HttpStatus.OK)
    @Post('disable_2fa')
    async disable_2fa(@Request() req) {
        console.log("-[ 2fa ]- Disable ");
        const login = req.body.data.login;
        console.log("-[ 2fa ]- login Value:  ", login);
        await this.userService.remove_2fa(login);
    }

    //@UseGuards(AuthGuard) // BUGGG Compilation ou Import Module a FIX
    @HttpCode(HttpStatus.OK)
    @Post('changeName')
    async changeUserName(@Request() req, @Response() res) {
        console.log(" -[ ChangeName Controller ]- ");
        const data = req.body.data;
        console.log("-[ ChangeName Controller ]- data: ", data);
        if (!data) { console.log("[ error ] -[ ChangeName ]- data inexistantes"); throw new UnauthorizedException() }
        let login: string = data.login;
        let newUsername: string = data.newUsername;

        const newUser = await this.authService.change_userName(login, newUsername);
        // si Changement bien effectue, issue a new Jwt avec new Payload
        if (newUser) {
            const payload = {
                "id": newUser.id,
                "login": newUser.login,
                "username": newUser.userName
            }
            const newJwt = await this.authService.asign_jtw_token(payload);;
            res.header('Authorization', `Bearer ${newJwt}`);
            const frontendUrl = `http://localhost:5173/?jwt=${newJwt}`;
            res.redirect(frontendUrl);

        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('changeImage')
    async changeImage(@Request() req, @Response() res) {
        const img = req.body.data.img;
        const login = req.body.data.login;
        const user = await this.userService.find_user_by_login(login);
        console.log("-[ Img ]-  old Avatar: ", user.avatar);
        if (!user || !img || img === "" || img.length < 5 || img.length > 500) {
            console.log("-[ IMG change ]- { ERROR }");
            throw new UnauthorizedException();
        }
        const updatedUser = await this.userService.change_avatar(login, img);
        console.log("-[ Img ]-  new Avatar: ", updatedUser.avatar);
        res.redirect(frontUrl);
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(@Request() req, @Response() res) {
        // const login = req.body.data.login;
        const token = req.headers.authorization;
        if (token) {
            const jwt = token.replace('Bearer', '').trim();
            const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
            //  console.log('New Jwt encode: ', decoded);


            if (decoded && decoded.login) {
                const login = decoded.login;
                console.log('-[ Logout ]- AuthController: login', login);

                this.authService.logout(login);
                console.log('-[ Logout ]- Updated Logout User: ', await this.userService.find_user_by_login(login))
            }
            res.redirect('http://localhost:5173');
        }
    }
    // /////////////////////////////////////////////////////////////////////////////////////////////////////


}