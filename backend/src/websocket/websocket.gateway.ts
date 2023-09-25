// // import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

// // @WebSocketGateway()
// // export class WebsocketGateway {
// //   @SubscribeMessage('message')
// //   handleMessage(client: any, payload: any): string {
// //     return 'Hello world!';
// //   }
// // }


// import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Socket } from 'socket.io';

// @WebSocketGateway()
// export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   handleConnection(client: Socket) {
//     console.log(`Client connecté: ${client.id}`);
//   }

//   handleDisconnect(client: Socket) {
//     console.log(`Client déconnecté: ${client.id}`);
//   }
// }
