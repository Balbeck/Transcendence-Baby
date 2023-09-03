import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
	constructor(private jwtService: JwtService) { }

	async createToken(payload: any): Promise<string> {
		return this.jwtService.signAsync(payload);
	}

	async verifyToken(token: string) {
		try {
			return this.jwtService.verifyAsync(token);
		} catch (error) {
			throw new UnauthorizedException();
		}
	}
}