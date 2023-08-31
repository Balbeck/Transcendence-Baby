import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { FriendshipEntity } from './orm/friendship.entity';
import { UserEntity } from './orm/user.entity';
import { RefreshTokenStrategy } from 'src/auth/strategies/refreshToken.strategy';
import * as otplib from 'otplib';
import * as argon2 from 'argon2';
import * as qrcode from 'qrcode';
import { toDataURL } from "qrcode";
// import { bcrypt } from '';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(FriendshipEntity)
		private friendshipRepository: Repository<FriendshipEntity>,
	) { }

	async find_all_users(): Promise<UserEntity[]> {
		return await this.userRepository.find();
	}

	async find_user_by_id(id: number): Promise<UserEntity> {
		return await this.userRepository.findOne({ where: { id: id } })
	}
	async find_user_by_login(login: string): Promise<UserEntity> {
		return await this.userRepository.findOne({ where: { login: login } })
	}
	async find_user_by_userName(userName: string): Promise<UserEntity> {
		return await this.userRepository.findOne({ where: { userName: userName } })
	}

	async find_user_ID_by_userName(userName: string): Promise<number> {
		const user = await this.userRepository.findOne({ where: { userName: userName } });
		return user.id;
	}

	async add_new_user(payload: any) {
		let user = new UserEntity();
		user.login = payload.login;
		user.userName = payload.userName;
		user.email = payload.email;

		// 42 [ Users ]
		if (payload.is42) {
			user.is42 = payload.is42;
			user.id42 = payload.id42;
			user.lastName = payload.lastName;
			user.firstName = payload.firstName;
			user.avatar = payload.avatar;
		}
		// Non 42 [ Users ]
		else if (payload.password) {
			user.hash = payload.password;
			user.hasPassword = true;
		}
		if (payload.refreshToken) {
			user.refreshToken = payload.refreshToken;
		}
		await this.userRepository.save(user);
		const bob = await this.find_user_by_userName(user.userName);
		console.log(" -[ User Service ]- {new_user_added} :  ", bob.userName);
	}

	async change_username(login: string, newUserName: string) {
		await this.userRepository.update({ login }, { userName: newUserName });
		return await this.find_user_by_userName(newUserName);
	}

	async change_avatar(login: string, newAvatar: string) {
		await this.userRepository.update({ login }, { avatar: newAvatar });
		return await this.find_user_by_login(login);
	}


	// -[ 2fa Google Authentificator ]-
	async enable_2fa(login: string) {
		// Genere Secret pour QrCode
		const secret = otplib.authenticator.generateSecret();
		// Genere QRCode
		const user = await this.find_user_by_login(login);
		const email = user.email;
		const otpauthUrl = otplib.authenticator.keyuri(email, 'PacPac-Pong_Transcendence', secret);
		const url = await qrcode.toDataURL(otpauthUrl)
		//console.log("-[Usr Enable 2Fa]- code:  ", url);

		await this.userRepository.update({ login }, { fa2Secret: secret });
		await this.userRepository.update({ login }, { fa2QRCode: url });
		return url;
	}

	async turn_2fa_on(login: string) {
		await this.userRepository.update({ login }, { fa2: true });
	}

	async clear2fa(login: string) {
		await this.userRepository.update({ login }, { fa2Secret: null });
		await this.userRepository.update({ login }, { fa2QRCode: null });
	}

	async get_QRCode(login: string) {
		const user = await this.find_user_by_login(login);
		const url = user.fa2QRCode;
		return url;
	}

	async remove_2fa(login: string) {
		await this.userRepository.update({ login }, { fa2: false });
		await this.userRepository.update({ login }, { fa2Secret: null });
		await this.userRepository.update({ login }, { fa2QRCode: null });
	}
	// delete_user(id: number): Observable<any> {
	// 	return from(this.userRepository.delete(id));
	// }


	//////////////////////////////////////////////////
	//		 ********************
	// 		*** [ Friendship ] ***
	//		 ********************
	//////////////////////////////////////////////////

	async send_friend_request(askerLogin: string, RequestedLogin: string) {

	}


	// // Liste des friends(promise -> liste des userNames) avec un  status 'accepted'
	// async get_Accepted_friend_UserNames(userId: number): Promise<string[]> {
	// 	const user = await this.userRepository
	// 		.createQueryBuilder('user')
	// 		.leftJoinAndSelect('user.friendship_relation', 'friendship')
	// 		.leftJoinAndSelect('friendship.friend', 'friend')
	// 		.where('user.id = :userId', { userId })
	// 		.andWhere('friendship.status = :status', { status: 'accepted' })
	// 		.getOne();

	// 	if (!user) { return []; }

	// 	else {
	// 		const acceptedFriendUserNames = user.friendship_relation
	// 			.map((friendship) => friendship.friend.userName);
	// 		return acceptedFriendUserNames;
	// 	}
	// }

	// // Liste des friends(promise -> liste des userNames) avec un  status 'pending'
	// async get_Pending_friend_UserNames(userId: number): Promise<string[]> {
	// 	const user = await this.userRepository
	// 		.createQueryBuilder('user')
	// 		.leftJoinAndSelect('user.friendship_relation', 'friendship')
	// 		.leftJoinAndSelect('friendship.friend', 'friend')
	// 		.where('user.id = :userId', { userId })
	// 		.andWhere('friendship.status = :status', { status: 'accepted' })
	// 		.getOne();

	// 	if (!user) { return []; }

	// 	else {
	// 		const acceptedFriendUserNames = user.friendship_relation
	// 			.map((friendship) => friendship.friend.userName);
	// 		return acceptedFriendUserNames;
	// 	}
	// }

	// // Fct Generique pour accepted, pending et blocked
	// async get_friendUserNames_by_status(userId: number, status: string): Promise<string[]> {
	// 	const user = await this.userRepository
	// 		.createQueryBuilder('user')
	// 		.leftJoinAndSelect('user.friendship_relation', 'friendship')
	// 		.leftJoinAndSelect('friendship.friend', 'friend')
	// 		.where('user.id = :userId', { userId })
	// 		.andWhere('friendship.status = :status', { status: status })
	// 		.getOne();

	// 	if (!user) { return []; }
	// 	else {
	// 		const friendUserNames = user.friendship_relation
	// 			.map((friendship) => friendship.friend.userName);
	// 		return friendUserNames;
	// 	}
	// }












	async remove(id: number): Promise<UserEntity> {
		const userToRemove = await this.userRepository.findOne({ where: { id: id } })
		if (!userToRemove) { return null; }
		await this.userRepository.remove(userToRemove);
		return userToRemove;
	}


	async update_User_RefreshToken(login: string, refreshToken: string) {
		const user = await this.find_user_by_login(login);
		//console.log('-[ Usr S ]- Ancien Token: ', user.refreshToken);

		await this.userRepository.update({ login }, { refreshToken: refreshToken });
		const updatedUser = await this.find_user_by_login(login);
		//console.log('-[ Usr S ]- Refrsh Token: ', updatedUser.refreshToken);
		return updatedUser;
	}

}





	// async setCurrentRefreshToken(refreshToken: string, userId: number) {
	// 	const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
	// 	await this.userRepository.update(userId, {
	// 		currentHashedRefreshToken
	// 	});
	// }
	// async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
	// 	await this.userRepository.update(id, updateUserDto);
	// 	return await this.userRepository.findOne({ where: { id: id } });
	// }
