import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../jwtSecret';
import { Request } from 'express';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private userService: UserService
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		console.log("[ AuthGuard ] - Bienvenue dans le canActivate");
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			console.log("[ AuthGuard ] - Pas de token avec la request");
			throw new UnauthorizedException();
		}

		try {
			console.log("[ AuthGuard ] - Token present avec la request");
			console.log("[ AuthGuard ] - Token: ", token);
			//const res = { data: (this.jwtService.decode(token)) };
			const res = this.jwtService.decode(token) as { [key: string]: any };
			console.log("[ AuthGuard ] - res.username: ", res.username);
			// if (!res.username) { throw new UnauthorizedException(); }
			// let is_user_in_db = await this.userService.find_user_by_userName(res.username);
			if (!res.id) { throw new UnauthorizedException(); }
			let is_user_in_db = await this.userService.find_user_by_id(res.id);
			if (is_user_in_db) {
				console.log("[ AuthGuard ] - User is in Db: { ", is_user_in_db.userName, " }");
			}
			else {
				console.log("[ AuthGuard ] - User **NOT** in Db: { ", res.username, " }");
				throw new UnauthorizedException;
			}
			return true;
		} catch {
			throw new UnauthorizedException();
		}
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}