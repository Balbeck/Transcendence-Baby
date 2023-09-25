import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/users/user.service';
import { JwtAuthService } from '../jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,

		// private jwtAuthService: JwtAuthService,
		// pour resoudre probleme de dependance 
		@Inject(forwardRef(() => JwtAuthService))
		private jwtAuthService: JwtAuthService,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// console.log("[ AuthGuard ] - canActivate");
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			console.log("[ AuthGuard ] - Pas de token avec la request");
			throw new UnauthorizedException();
		}
		try {
			// console.log("[ AuthGuard ] - Token present avec la request");
			// console.log("[ AuthGuard ] - Token: ", token);
			const res = this.jwtService.decode(token) as { [key: string]: any };
			// console.log("[ AuthGuard ] - res.username: ", res.username);
			if (!res.id) {
				throw new UnauthorizedException();
			}

			// Verif si present dans la DB
			let is_user_in_db = await this.userService.find_user_by_id(res.id);
			if (is_user_in_db) {
				// console.log("[ AuthGuard ] - User is in Db: { ", is_user_in_db.userName, " }");
			}
			else {
				console.log("[ AuthGuard ] - User **NOT** in Db: { ", res.username, " }");
				throw new UnauthorizedException();
			}

			// // Verif supplementaire:  si le User est Online
			// if (this.authService.isUserOnline(is_user_in_db.login)) {
			// 	console.log("[ AuthGuard ] - User { ", is_user_in_db.userName, " } is ONLINE");
			// }
			// else {
			// 	console.log("[ AuthGuard ] - User { ", is_user_in_db.userName, " } is OFFLINE --[REFUSE]--");
			// 	throw new UnauthorizedException();
			// }

			// Verif Validity du Jwt
			try {
				// Si validity expired jwt throw exception ELSE return le payload decoded 
				const payload = await this.jwtAuthService.verifyToken(token);
				// console.log('[ AuthGuard ] - { Valid } JwT ');
			} catch (error) {
				console.log('[ AuthGuard ] - X { INVALID } X JwT :', error.message);
				throw new UnauthorizedException();
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