import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './orm/user.entity';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) { }


	// //  *-[ Test without - x 42API x - ]-*	
	// @Get('/1')
	// connectUser1() {
	// 	return 'Hello User 1';

	// }
	// @Get('/2')
	// connectUser2() {
	// 	return 'Hello User 2';
	// }


	//  *-[ Test without - Frontend - ]-*	
	@Get('/changeName')
	changeUserName() {
		//this.userService.change_userName('balbecke', 'totoTATA');
		this.userService.change_userName('totoTATA', 'balbecke');
	}


	@Get('/all')
	find_all_users(): Promise<UserEntity[]> {
		return this.userService.find_all_users();
	}
}
