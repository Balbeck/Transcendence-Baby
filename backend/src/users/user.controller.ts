import { Controller, Body, Get, Header, HttpCode, HttpStatus, Request, Response, UseGuards, UnauthorizedException, Put, Delete, Param, Patch, Post } from '@nestjs/common';
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



	// @Post()
	// create(@Body() createUserDto: CreateUserDto) {
	// 	return this.userService.create(createUserDto);
	// }

	// @Get()
	// findAll() {
	//   return this.userService.findAll();
	// }

	// @Get(':id')
	// findById(@Param('id') id: string) {
	//   return this.userService.findById(id);
	// }

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
	//   return this.userService.update(id, updateUserDto);
	// }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.userService.remove(id);
	// }








	//  *-[ Test without - Frontend - ]-*



	@HttpCode(HttpStatus.OK)
	//@UseGuards(AuthGuard)
	@Get('profile')
	async profile(@Request() req, @Response() res) {
		try {
			console.log(" -[ Profile UserCtrl ]- ");
			const headers = req.headers;
			const Token = req.headers.authorization;
			const [, jwtToken] = Token.split(' '); // Divise la chaîne en fonction de l'espace et ignore la première partie (Bearer)
			console.log(" -[ Profile UserCtrl ]- jwtToken: ", jwtToken);
			const jwt = this.jwtService.decode(jwtToken) as { [key: string]: any };
			console.log(" -[ Profile UserCtrl ]- decode jwt: ", jwt);
			console.log(" -[ Profile UserCtrl ]- jwt id: ", jwt.id);
			const user = await this.userService.find_user_by_id(jwt.id);
			res.json(user);
		}
		catch (e) {
			console.log("-->  -{ Catch }-  -  [ Profile UserCtrl ] (e): ", e);
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@Get('/all')
	find_all_users(): Promise<UserEntity[]> {
		return this.userService.find_all_users();
	}
}
