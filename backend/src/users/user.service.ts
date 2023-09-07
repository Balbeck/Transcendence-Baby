import { BadRequestException, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './orm/user.entity';
import * as otplib from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
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
		console.log(" -[ User Service ]- {new_user_added_in DB} :  ", bob.userName);
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
	//		 ********************				   //
	// 		*** [ Friendship ] ***				  //
	//		 ********************				 //
	//////////////////////////////////////////////


	async sendFriendRequest(login: string, friendUsername: string) {
		let requester = await this.find_user_by_login(login);
		let receiver = await this.find_user_by_userName(friendUsername);
		if (!requester || !receiver) {
			throw new BadRequestException('User not found');
		}

		if (!requester.friendRequestsSent.includes(receiver.login)) {
			requester.friendRequestsSent.push(receiver.login);
			console.log("4  -[ RequestFriend ]- Ajout de [", receiver.login, "] a la friendRequestSent list de [", requester.login, "]");
			await this.userRepository.save(requester);
		}

		if (!receiver.pendindFriendRequests.includes(requester.login)) {
			receiver.pendindFriendRequests.push(requester.login);
			console.log("4  -[ RequestFriend ]- Ajout de [", requester.login, "] a la pending list de [", receiver.login, "]");
			await this.userRepository.save(receiver);
		}

		//////// console.log
		const user1test = await this.find_user_by_login(requester.login);
		const user2test = await this.find_user_by_login(receiver.login);
		console.log("7  -[ RequestFriend ]- ", user1test.login, "  friendRequestSent list: ", user1test.friendRequestsSent);
		console.log("8  -[ RequestFriend ]- ", user2test.login, "  Pending list: ", user2test.pendindFriendRequests);
		/////////////////////
	}


	async addFriend(login: string, friendUsername: string) {
		console.log("1  -[ addFriends ]- login: [", login, "]    friendUsername [", friendUsername, "]");
		let user1 = await this.find_user_by_login(login);
		let user2 = await this.find_user_by_userName(friendUsername);
		//console.log("2  -[ Friends ]- user1.login [", user1.login, "] user2.login [", user2.login, "]");
		if (!user1 || !user2) {
			throw new BadRequestException('User not found');
		}

		//console.log("3  -[ Friends ]- User 1... > 4 ?");
		if (!user1.friends.includes(user2.login)) {
			user1.friends.push(user2.login);
			console.log("4  -[ addFriends ]- Ajout de [", user2.login, "] a la friend list de [", user1.login, "]");
			await this.userRepository
				.createQueryBuilder()
				.update()
				.set({ friends: user1.friends }) // Mettez à jour le champ friends avec la nouvelle liste d'amis
				.where("id = :id", { id: user1.id })
				.execute();
			//await this.userRepository.save(user1);
		}

		user1 = await this.find_user_by_login(login);
		user2 = await this.find_user_by_userName(friendUsername);
		if (!user2.friends.includes(user1.login)) {
			user2.friends.push(user1.login);
			await this.userRepository
				.createQueryBuilder()
				.update()
				.set({ friends: user2.friends }) // Mettez à jour le champ friends avec la nouvelle liste d'amis
				.where("id = :id", { id: user2.id })
				.execute();
			//await this.userRepository.save(user2);
		}


		//////// console.log / Debug
		const user1test = await this.find_user_by_login(user1.login);
		const user2test = await this.find_user_by_login(user2.login);
		console.log("7  -[ addFriends ]- ", user1test.login, "  friendList: ", user1test.friends);
		console.log("8  -[ addFriends ]- ", user2test.login, "  friendList: ", user2test.friends);
		/////////////////////
	}

	async clearUpdatePendingAndRequestList(receiver: string, sender: string) {
		let accepter = await this.find_user_by_userName(receiver);
		let requester = await this.find_user_by_login(sender);
		console.log("1  -[ clear Friend ]- ", accepter.login, "  pendindFriendRequests: ", accepter.pendindFriendRequests);
		console.log("1  -[ clear Friend ]- ", requester.login, "  friendRequestsSent: ", requester.friendRequestsSent);
		if (!requester || !accepter) {
			throw new BadRequestException('User not found');
		}
		// clear la pending list de celui qui receive/accepte
		const pendingFriendIndex = accepter.pendindFriendRequests.indexOf(requester.login);
		if (pendingFriendIndex !== -1) {
			accepter.pendindFriendRequests.splice(pendingFriendIndex, 1);
			await this.userRepository.save(accepter);
		}

		// clear la SendRequest list de celui qui send/request
		const senderFriendIndex = requester.friendRequestsSent.indexOf(accepter.login);
		if (senderFriendIndex !== -1) {
			requester.friendRequestsSent.splice(senderFriendIndex, 1);
			await this.userRepository.save(requester);
		}

		// debug
		const user1test = await this.find_user_by_login(accepter.login);
		const user2test = await this.find_user_by_login(requester.login);
		console.log("2  -[ clear Friend ]- ", user1test.login, "  pendindFriendRequests: ", user1test.pendindFriendRequests);
		console.log("2  -[ clear Friend ]- ", user2test.login, "  friendRequestsSent: ", user2test.friendRequestsSent);
	}

	async removeFriend(login: string, friendUsername: string) {
		let user1 = await this.find_user_by_login(login);
		let user2 = await this.find_user_by_userName(friendUsername);
		if (!user1 || !user2) {
			throw new BadRequestException('User not found');
		}

		const friendIndex = user1.friends.indexOf(user2.login);
		if (friendIndex !== -1) {
			user1.friends.splice(friendIndex, 1);
			await this.userRepository.save(user1);
		}

		// Debug :
		const user1test = await this.find_user_by_login(user1.login);
		console.log("7  -[ removeFriends ]- ", user1test.login, "  friendList: ", user1test.friends);
	}


	async getPendingList(id: number) {
		const user = await this.find_user_by_id(id);
		console.log(" -[ Get Pending ]- userRecup: [", user.userName, "] -> PendingList: ", user.pendindFriendRequests);
		const loginPendingList: string[] = user.pendindFriendRequests;
		// tranformation des login en usernames
		let usernamePendingList: string[] = [];
		for (const login of loginPendingList) {
			const user = await this.find_user_by_login(login);
			const username: string = user.userName;
			usernamePendingList.push(username);
		}
		return usernamePendingList;
	}

	async getFriendsList(id: number) {
		const user = await this.find_user_by_id(id);
		console.log(" -[ Get Friends ]- userRecup: [", user.userName, "] -> friendsList: ", user.friends);
		const loginFriendsList: string[] = user.friends;
		// tranformation des login en usernames
		let usernameFriendsList: string[] = [];
		for (const login of loginFriendsList) {
			const user = await this.find_user_by_login(login);
			const username: string = user.userName;
			usernameFriendsList.push(username);
		}
		return usernameFriendsList;
	}

	async getSentRequestsList(id: number) {
		const user = await this.find_user_by_id(id);
		console.log(" -[ Get SendRequests ]- user: [", user.userName, "] -> RequestsList: ", user.friendRequestsSent);
		const loginSentRequestsList: string[] = user.friendRequestsSent;
		// tranformation des login en usernames
		let usernameSentRequestsList: string[] = [];
		for (const login of loginSentRequestsList) {
			const user = await this.find_user_by_login(login);
			const username: string = user.userName;
			usernameSentRequestsList.push(username);
		}
		return usernameSentRequestsList;
	}


	//////////////////////////////////////////////////
	//		 ********************				   //
	// 		***    [ GAME ]    ***				  //
	//		 ********************				 //
	//////////////////////////////////////////////


	async incrementRankAndTitle(id: number) {
		let rank: number;
		let title: string;
		const user = await this.find_user_by_id(id);
		console.log(" -[ Game Ranking ]- user: [", user.userName, "] -> formerRank: (", user.rank, ") -> Title: { ", user.title, " }");
		rank = user.rank;
		if (rank < 100) {
			rank += 1;
			user.rank = rank;
		}
		if (rank === 2) {
			user.title = "Confirmed";
		}
		else if (rank > 2) {
			user.title = "God of War";
		}
		await this.userRepository.save(user);

	}

	///////////////////////////////////////////////////////////////////////////
	//																		//
	//																	   //
	////////////////////////////////////////////////////////////////////////




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




	///////////////////////////////////////////////////////////////////////////
	//																		//
	//																	   //
	////////////////////////////////////////////////////////////////////////







	async remove(id: number): Promise<UserEntity> {
		const removedUser = await this.userRepository.findOne({ where: { id: id } })
		if (!removedUser) { return null; }
		await this.userRepository.remove(removedUser);
		return removedUser;
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