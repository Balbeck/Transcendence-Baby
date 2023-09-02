import { Controller, Query, Body, Get, Header, HttpCode, HttpStatus, Request, Response, UseGuards, UnauthorizedException, Put, Delete, Param, Patch, Post } from '@nestjs/common';
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

	@HttpCode(HttpStatus.OK)
	//@UseGuards(AuthGuard)
	@Get('profile')
	async profile(@Request() req, @Response() res) {
		try {
			console.log(" -[ Profile UserCtrl ]- ");
			const headers = req.headers;
			const Token = req.headers.authorization;
			const [, jwtToken] = Token.split(' '); // Divise la chaîne en fonction de l'espace et ignore la première partie (Bearer)
			//console.log(" -[ Profile UserCtrl ]- jwtToken: ", jwtToken);
			const jwt = this.jwtService.decode(jwtToken) as { [key: string]: any };
			//console.log(" -[ Profile UserCtrl ]- decode jwt: ", jwt);
			console.log(" -[ Profile UserCtrl ]- jwt id: ", jwt.id);
			const user = await this.userService.find_user_by_id(jwt.id);
			console.log(" -[ Profile UserCtrl ]- User: ", user);

			res.json(user);
		}
		catch (e) {
			console.log("-->  -{ Catch }-  -  [ Profile UserCtrl ] (e): ", e);
			throw new UnauthorizedException;
		}
	}

	@HttpCode(HttpStatus.OK)
	@Get('profileOther')
	async profileOther(@Query('username') username: string, @Request() req, @Response() res) {
		console.log(" -[ ProfileOther User.Ctrl ]- QueryParam: ", username);
		const token = req.headers.authorization;
		if (token) {
			const jwt = token.replace('Bearer', '').trim();
			const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
			const requesterProfile = await this.userService.find_user_by_login(decoded.login);
			try {
				const userProfile = await this.userService.find_user_by_userName(username);
				const user = {
					login: userProfile.login,
					username: userProfile.userName,
					avatar: userProfile.avatar,

					isMyFriend: requesterProfile.friends.includes(userProfile.login),
					isInPending: requesterProfile.pendindFriendRequests.includes(userProfile.login),
					isInSentRequest: requesterProfile.friendRequestsSent.includes(userProfile.login)
				}
				console.log(" -[ ProfileOther ]-  User-json(): ", user);
				res.json(user);
			}
			catch (e) {
				console.log("-->  -{ Catch }-  -  [ Profile UserCtrl ] (e): ", e);
				throw new UnauthorizedException;
			}
		}
	}

	@HttpCode(HttpStatus.OK)
	@Post('sendFriendRequest')
	async sendFriendRequest(@Request() req) {
		console.log(" -[ requestFriends  / UsrCtrl ]- ");
		const token = req.headers.authorization;
		if (token) {
			const jwt = token.replace('Bearer', '').trim();
			const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
			const friendUsername: string = req.body.data.username;

			this.userService.sendFriendRequest(decoded.login, friendUsername);
			//	const user2login = await this.userService.find_user_by_userName(friendUsername);
			//	const user1username = await this.userService.find_user_by_login(decoded.login);
			//	this.userService.sendFriendRequest(user2login.login, user1username.userName);
		}
	}

	@HttpCode(HttpStatus.OK)
	@Post('refuseFriendRequest')
	async refuseFriendRequest(@Request() req) {
		console.log(" -[ refuse Friends  / UsrCtrl ]- ");
		const token = req.headers.authorization;
		if (token) {
			const jwt = token.replace('Bearer', '').trim();
			const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
			const friendUsername: string = req.body.data.username;

			const user2login = await this.userService.find_user_by_userName(friendUsername);
			const user1username = await this.userService.find_user_by_login(decoded.login);
			// clear pending and request List of User
			this.userService.clearUpdatePendingAndRequestList(user1username.userName, user2login.login);
		}
	}

	@HttpCode(HttpStatus.OK)
	@Post('addFriend')
	async addNewFriendship(@Request() req) {
		console.log(" -[ addFriends  / UsrCtrl ]- ");
		const token = req.headers.authorization;
		if (token) {
			const jwt = token.replace('Bearer', '').trim();
			const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
			//console.log('New Jwt encode: ', decoded);

			const friendUsername: string = req.body.data.username;
			//console.log(" -[ addFriends  / UsrCtrl ]-  req.body.data [", req.body.data);
			//console.log(" -[ addFriends  / UsrCtrl ]-  friend Username: [", friendUsername, '] et decoded.login [', decoded.login, "]");

			this.userService.addFriend(decoded.login, friendUsername);

			const user2login = await this.userService.find_user_by_userName(friendUsername);
			const user1username = await this.userService.find_user_by_login(decoded.login);
			//this.userService.addFriend(user2login.login, user1username.userName);
			// clear pending and request List of User
			this.userService.clearUpdatePendingAndRequestList(user1username.userName, user2login.login);
		}
	}

	@HttpCode(HttpStatus.OK)
	@Post('removeFriend')
	async removeFriendship(@Request() req) {
		console.log(" -[ RemoveFriends  / UsrCtrl ]- ");
		const token = req.headers.authorization;
		if (token) {
			const jwt = token.replace('Bearer', '').trim();
			const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
			const friendUsername: string = req.body.data.username;
			this.userService.removeFriend(decoded.login, friendUsername);
			const user2login = await this.userService.find_user_by_userName(friendUsername)
			const user1username = await this.userService.find_user_by_login(decoded.login)
			this.userService.removeFriend(user2login.login, user1username.userName);
		}
	}


	@HttpCode(HttpStatus.OK)
	@Get('pendingList')
	async getPendingList(@Request() req, @Response() res) {
		console.log(" -[ PendingList  / UsrCtrl ]- ");
		const token = req.headers.authorization;
		if (token) {
			const jwt = token.replace('Bearer', '').trim();
			const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
			const pendingList: string[] = await this.userService.getPendingList(decoded.id);
			res.json(pendingList);
		}
	}


	@HttpCode(HttpStatus.OK)
	@Get('friendsList')
	async getfriendList(@Request() req, @Response() res) {
		console.log(" -[ FriendList  / UsrCtrl ]- ");
		const token = req.headers.authorization;
		if (token) {
			const jwt = token.replace('Bearer', '').trim();
			const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
			const friendsList: string[] = await this.userService.getFriendsList(decoded.id);
			res.json(friendsList);
		}
	}

	@HttpCode(HttpStatus.OK)
	@Get('sentRequestsList')
	async getRequestsList(@Request() req, @Response() res) {
		console.log(" -[ RequestsList  / UsrCtrl ]- ");
		const token = req.headers.authorization;
		if (token) {
			const jwt = token.replace('Bearer', '').trim();
			const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
			const sentRequestsList: string[] = await this.userService.getSentRequestsList(decoded.id);
			res.json(sentRequestsList);
		}
	}



	@HttpCode(HttpStatus.OK)
	@Get('/all')
	find_all_users(): Promise<UserEntity[]> {
		return this.userService.find_all_users();
	}
}
