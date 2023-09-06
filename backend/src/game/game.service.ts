import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from 'colyseus';
import { WebSocketTransport } from "@colyseus/ws-transport"
import { HttpAdapterHost } from '@nestjs/core';
import { PongRoom } from './game.room';

@Injectable()
export class GameService implements OnModuleInit {
	private server: Server;
	constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

	onModuleInit() {
		const httpServer = this.httpAdapterHost.httpAdapter.getHttpServer();

		this.server = new Server({
			transport: new WebSocketTransport({
				server: httpServer,
				// Add other WebSocket-specific options if needed
				pingInterval: 3001, //Number of milliseconds for the server to "ping" the clients.
				pingMaxRetries: 2, //Maximum allowed number of pings without a response.
				// verifyClient: ... (if you have this logic)
			})
		});
		this.server.define('pong', PongRoom);
	}
}


