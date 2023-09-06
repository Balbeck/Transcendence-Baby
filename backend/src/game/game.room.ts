import { Room, Client } from 'colyseus';
import { PaddleDirection, Physics } from "./game.physics";
import { GameState, GameStatus } from "./game.schema";

export interface PaddleMoveMessage {
	newDirection: PaddleDirection;
}

export class PongRoom extends Room<GameState> {
	maxClients = 2;
	private physics!: Physics;
	private lpId!: string; // <<<=== Left player ID
	private rpId!: string; // <<<=== Right player ID

	onCreate(options: any) {
		console.info('PongRoom created', options);
		this.setState(new GameState());
		this.physics = new Physics(this.state.ball, this.state.leftPaddle, this.state.rightPaddle);
	}

	private update(deltaTime: number) {
		if (this.state.gameStatus !== GameStatus.PLAYING) return;

		if (this.physics.checkLeftWall()) {
			this.state.scoreboard.right += 1;
			this.state.ball.center();
			this.physics.setAngle(0);
		}
		if (this.physics.checkRightWall()) {
			this.state.scoreboard.left += 1;
			this.state.ball.center();
			this.physics.setAngle(Math.PI);
		}

		if (this.state.scoreboard.left >= 3 || this.state.scoreboard.right >= 3) {
			this.state.gameStatus = GameStatus.FINISHED;
			return;
		}

		this.physics.update(deltaTime);

		this.onMessage('paddleMove', (client, message) => {
			// Handle the 'paddleMove' message
			if (client.id === this.rpId) {
				this.physics.setRightPaddleDirection(message.newDirection);
			}
			if (client.id === this.lpId) {
				this.physics.setLeftPaddleDirection(message.newDirection);
			}
		});
	}

	onJoin(client: Client, options: any) {
		if (this.clients.length === 1) {
			this.lpId = client.id;
		} else if (this.clients.length === 2) {
			this.rpId = client.id;
			this.state.gameStatus = GameStatus.PLAYING;
			this.setSimulationInterval(deltaTime => this.update(deltaTime));
		}
	}

	onLeave(client: Client, consented: boolean) {
		if (client.id === this.lpId) {
			this.lpId = undefined;
		} else if (client.id === this.rpId) {
			this.rpId = undefined;
		}
		if (!this.lpId || !this.rpId) {
			this.state.gameStatus = GameStatus.INTERRUPTED;
		}
		if (!this.lpId && !this.rpId) {
			this.disconnect();
		}
	}

	onDispose() {
		console.info('Disposing PongRoom');
	}
}