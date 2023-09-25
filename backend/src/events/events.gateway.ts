import { Injectable } from '@nestjs/common';
import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { DirectMessageService } from 'src/direct_message/direct_message.service';
import { UserService } from 'src/users/user.service';

@Injectable()
@WebSocketGateway(
	// 	3001, {
	// 	cors: {
	// 		origin: 'http://localhost:5173',
	// 		methods: ['GET', 'POST'],
	// 		credentials: true
	// 	}
	// }
) // WebSocket server will run on http://localhost:3001
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	constructor(
		private directMessageService: DirectMessageService,
		private userService: UserService,
	) { }

	private socketsByUserID: Map<any, Socket> = new Map(); // id42 -> socket
	private userIdFindHelper: Map<string, any> = new Map(); // socket id -> id42

	afterInit(server: Server) {
		console.log('initialized')
	}

	handleConnection(client: Socket, ...args: any[]) {
		const connected = this.socketsByUserID.get(client.handshake.query.id42); // check if user already connected
		if (connected) {
			this.socketsByUserID.delete(connected.id); // remove old connection from helper map
			connected.disconnect(); // disconnect old connection
		}
		this.socketsByUserID.set(client.handshake.query.id42, client);
		this.userIdFindHelper.set(client.id, client.handshake.query.id42);
		console.log('connected', client.id)
	}

	handleDisconnect(client: Socket) {
		this.socketsByUserID.delete(this.userIdFindHelper.get(client.id));
		this.userIdFindHelper.delete(client.id);

		console.log('a clietn jsut disconnected', client.id)
	}

	@SubscribeMessage('sendMessageN')
	async sendMessageN(client: Socket, data: any) {
		//console.log("------------data-------------", data)
		let a = await this.userService.find_user_by_login(data.sendTo);
		data.sendTo = a.id42;
		let b = await this.directMessageService.sendMessage(data.sendBy, data.sendTo, data.message)
		const userOne = this.socketsByUserID.get(data.sendBy.toString());
		const userTwo = this.socketsByUserID.get(data.sendTo.toString());
		if (userOne)
			userOne.emit('newMessage', b)
		if (userTwo)
			userTwo.emit('newMessage', b)
		//  console.log(a)
		//  client.emit('repMessagesInDmRooms', {
		//    messages: a
		//  })
	}




	@SubscribeMessage('getDmRooms')
	async getDmRooms(client: Socket) {
		console.log('test', client.id, this.userIdFindHelper.get(client.id))
		let str = this.userIdFindHelper.get(client.id);
		let num = +str;
		let a = await this.directMessageService.findAllRoomsForUser(num)
		console.log(a)
		client.emit('repDmRooms', {
			rooms: a
		})
	}


	@SubscribeMessage('getMessagesInDmRoom')
	async getDmRoomMessages(client: Socket, roomId: any) {
		let a = await this.directMessageService.findAllMessagesForRoom(roomId)
		console.log(a)
		client.emit('repMessagesInDmRooms', {
			messages: a
		})
	}

	@SubscribeMessage('sendMessage')
	async sendMessage(client: Socket, data: any) {
		//console.log("------------data-------------", data)
		let a = await this.directMessageService.sendMessage(data.sendBy, data.sendTo, data.message)

		const userOne = this.socketsByUserID.get(data.sendBy.toString());
		const userTwo = this.socketsByUserID.get(data.sendTo.toString());
		if (userOne)
			userOne.emit('newMessage', a)
		if (userTwo)
			userTwo.emit('newMessage', a)
		//  console.log(a)
		//  client.emit('repMessagesInDmRooms', {
		//    messages: a
		//  })
	}



}
