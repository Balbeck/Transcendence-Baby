import { Controller, Body, Get, Header, HttpCode, HttpStatus, Request, Response, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './orm/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) { }



	//  *-[ Test without - Frontend - ]-*
	@HttpCode(HttpStatus.OK)
	@Get('changeName')
	changeUserName() {
		//this.userService.change_userName('balbecke', 'totoTATA');
		this.userService.change_userName('totoTATA', 'balbecke');
	}

	@HttpCode(HttpStatus.OK)
	//@UseGuards(AuthGuard)
	@Get('profile')
	async profile(@Request() req, @Response() res) {
		try {
			console.log(" -[ Profile ]- ");
			const headers = req.headers;
			const Token = req.headers.authorization;
			const [, jwtToken] = Token.split(' '); // Divise la chaîne en fonction de l'espace et ignore la première partie (Bearer)
			console.log(" -[ Profile ]- jwtToken: ", jwtToken);
			const jwt = this.jwtService.decode(jwtToken) as { [key: string]: any };
			console.log(" -[ Profile ]- decode jwt: ", jwt);
			console.log(" -[ Profile ]- jwt username: ", jwt.username);
			const user = await this.userService.find_user_by_userName(jwt.username);
			res.json(user);
		}
		catch (e) {
			console.log("-->  -{ Catch }-  -  [ Profile ]");
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@Get('/all')
	find_all_users(): Promise<UserEntity[]> {
		return this.userService.find_all_users();
	}
}
