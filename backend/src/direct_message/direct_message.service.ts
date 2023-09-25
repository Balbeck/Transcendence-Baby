import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectMessage } from './direct_message.entity';
import { DirectMessageRoom } from './direct_message_room.entity';
import { UserService } from 'src/users/user.service';

// TODO try catch

@Injectable()
export class DirectMessageService {
	constructor(
		@InjectRepository(DirectMessage)
		private readonly dmRepository: Repository<DirectMessage>,
		@InjectRepository(DirectMessageRoom)
		private readonly roomRepository: Repository<DirectMessageRoom>,
		private readonly userService: UserService
	) { }

	sayCoucou() {
		console.log("coucoucou")
	}

	async sendMessage(sender: number, receiver: number, messageText: string): Promise<DirectMessage> {
		// Step 1 & 2: Check or create room
		let room = await this.roomRepository.findOne({
			where: [
				{ userOneId: sender, userTwoId: receiver },
				{ userOneId: receiver, userTwoId: sender },
			],
		});
		console.log('room found', room)

		if (!room) {
			room = new DirectMessageRoom();

			room.userOneId = sender;
			room.userTwoId = receiver;

			console.log('bizarre', room)
			await this.roomRepository.save(room);
		}

		// Step 3: Add message to room
		const message = new DirectMessage();
		message.room = room;
		message.sendBy = sender;
		message.sendTo = receiver;
		message.message = messageText;
		message.roomId = room.id;

		await this.dmRepository.save(message);

		return message;
	}

	async findAllRoomsForUser(userId: number): Promise<DirectMessageRoom[]> {
		const rooms = await this.roomRepository.find({
			where: [
				{ userOneId: userId },
				{ userTwoId: userId },
			],
		});

		// temporary solution
		const enhancedRooms = [];

		for (const room of rooms) {
			const userOne = await this.userService.find_user_by_id(room.userOneId);
			//const userOne = await this.userService.find_user_by_id42(room.userOneId);
			const userTwo = await this.userService.find_user_by_id(room.userTwoId);
			//const userTwo = await this.userService.find_user_by_id42(room.userTwoId);

			enhancedRooms.push({
				...room,
				userOne: {
					userName: userOne.userName,
					avatar: userOne.avatar,
				},
				userTwo: {
					userName: userTwo.userName,
					image: userTwo.avatar,
				},
			});
		}

		return enhancedRooms;
	}

	async findAllMessagesForRoom(roomId: number): Promise<DirectMessage[]> {
		const messages = await this.dmRepository.find({
			where: { roomId },
			order: { date: 'ASC' } // Order by date in ascending order, you can also use 'DESC' for descending
		});
		return messages;
	}

	async clearDatabase() {
		await this.roomRepository.clear()
		await this.dmRepository.clear()
	}
}