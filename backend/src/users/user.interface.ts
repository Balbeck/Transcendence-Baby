export interface UserInterface {
	id: number;
	id42?: number;
	login: string;
	userName: string;
	lastName?: string;
	firstName?: string;
	emial?: string;
	avatar: string;
	is42: boolean;
	hasPassword: boolean;
	hash?: string;
	LiveStatus: string;
	refreshToken: string;
}