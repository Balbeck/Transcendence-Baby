export class CreateUserDto {
	login: string;
	username: string;
	email: string;
	avatar: string;
	refreshToken: string;


	hasPassword: boolean;
	hash: string;

	is42: boolean;
	liveStatus: string;

	id42: number;
	lastName: string;
	firstName: string;
}