import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Request } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_REFRESH_SECRET,
			passReqToCallback: true,
		});
	}


	async validate(@Request() req: any, payload: any) {
		const authorizationHeader = req.headers.authorization;
		const refreshToken = authorizationHeader
			? (authorizationHeader as string).replace('Bearer', '').trim()
			: null;

		return { ...payload, refreshToken };
	}
}