// import { Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { AuthDto } from "src/auth/dto";
// import { Repository, Like } from "typeorm";
// import { User } from "./orm/user.entity";

// @Injectable({})
// export class UserService 
// {
//     constructor(@InjectRepository(User)
//     private readonly userRepository:Repository<User>) {}
//     private async getUniquePseudo(login: string): Promise<string> {
//     const found: User = await this.userRepository.findOne({ where: {pseudo: login} });
//     if (!found)
//         return login;
//     const last: User = await this.userRepository.findOne({
//       select: ['id'],
//       where: { pseudo: Like(`${login}%`) },
//       order: {
//         id: 'DESC', //DESC stands for "descending", which means the results will be sorted from highest to lowest based on the id field.
//       },
//     });
//     return `${login}#${last?.id + 1}`;
// }

//   async findOneComplete(user_dto: AuthDto): Promise<User> {
//       return this.userRepository.findOne({where: user_dto});
//     }

//   async signup(user_dto: AuthDto): Promise<User> {
//       user_dto.pseudo = await this.getUniquePseudo(user_dto.pseudo);
//       console.log('new user: ' ,user_dto);
//       user_dto.rank = await this.userRepository.count({}) + 1;
//       const user: User = this.userRepository.create({
//         ...user_dto,
//       });
//       return this.userRepository.save(user);
//     }

//     async setRefreshToken(user: User, token: string): Promise<void> {
//       this.userRepository.update(user.id, {
//         refresh_token: token,
//       });
//     }

//     async setStatus(user: User, status: boolean): Promise<void> {
//       this.userRepository.update(user.id, {
//         connected: status,
//       });
//     }
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { FriendshipEntity } from './orm/friendship.entity';
import { UserEntity } from './orm/user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(FriendshipEntity)
		private friendshipRepository: Repository<FriendshipEntity>
	) { }

	async find_all_users(): Promise<UserEntity[]> {
		return await this.userRepository.find();
	}

	async find_user_by_id42(id42: number): Promise<UserEntity> {
		return await this.userRepository.findOne({ where: { id42: id42 } })
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
		//	user. = payload.;
		user.id42 = payload.id42;
		user.login = payload.login;
		user.userName = payload.login;
		user.lastName = payload.lastName;
		user.firstName = payload.firstName;
		user.email = payload.email;
		user.avatar = payload.avatar;


		await this.userRepository.save(user);
	}

	async change_userName(userName: string, newUserName: string) {
		console.log('ft_change_UserName');
		//check if new userName already exists
		const userCheck = await this.find_user_by_userName(newUserName);
		if (userCheck) {
			console.log('New UserName already in use');
			return 'New UserName already in use';
		}
		await this.userRepository.update({ userName }, { userName: newUserName });
		console.log("userName of [", userName, '] was changed to [', newUserName, '] ! Good Job');

	}
	// async findOne(username: string): Promise<UserEntity> {
	// 	return this.userRepository.findOne({ where: { username: username } });
	// }

	// delete_user(id: number): Observable<any> {
	// 	return from(this.userRepository.delete(id));
	// }

	//		 ********************
	// 		*** [ Friendship ] ***
	//		 ********************

	// Liste des friends(promise -> liste des userNames) avec un  status 'accepted'
	async get_Accepted_friend_UserNames(userId: number): Promise<string[]> {
		const user = await this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.friendship_relation', 'friendship')
			.leftJoinAndSelect('friendship.friend', 'friend')
			.where('user.id = :userId', { userId })
			.andWhere('friendship.status = :status', { status: 'accepted' })
			.getOne();

		if (!user) { return []; }

		else {
			const acceptedFriendUserNames = user.friendship_relation
				.map((friendship) => friendship.friend.userName);
			return acceptedFriendUserNames;
		}
	}

	// Liste des friends(promise -> liste des userNames) avec un  status 'pending'
	async get_Pending_friend_UserNames(userId: number): Promise<string[]> {
		const user = await this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.friendship_relation', 'friendship')
			.leftJoinAndSelect('friendship.friend', 'friend')
			.where('user.id = :userId', { userId })
			.andWhere('friendship.status = :status', { status: 'accepted' })
			.getOne();

		if (!user) { return []; }

		else {
			const acceptedFriendUserNames = user.friendship_relation
				.map((friendship) => friendship.friend.userName);
			return acceptedFriendUserNames;
		}
	}

	// Fct Generique pour accepted, pending et blocked
	async get_friendUserNames_by_status(userId: number, status: string): Promise<string[]> {
		const user = await this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.friendship_relation', 'friendship')
			.leftJoinAndSelect('friendship.friend', 'friend')
			.where('user.id = :userId', { userId })
			.andWhere('friendship.status = :status', { status: status })
			.getOne();

		if (!user) { return []; }
		else {
			const friendUserNames = user.friendship_relation
				.map((friendship) => friendship.friend.userName);
			return friendUserNames;
		}
	}
}
