import { Schema, type } from '@colyseus/schema';
// Dimensions of the game area
export const GameDimensions = {
	width: 1280,
	height: 720,
}
// Calculate the center of the game area
const center = {
	x: Math.round(GameDimensions.width / 2),
	y: Math.round(GameDimensions.height / 2),
}
// Define which side a paddle can be on
enum PaddleSide {
	LEFT = 0,
	RIGHT,
}

export class Paddle extends Schema {
	// Constants for the paddle dimensions and offsets
	public static readonly offset = 50;
	public static readonly width = 50;
	public static readonly height = 300;
	// x and y coordinates of the paddle
	@type('int32')
	public x: number;
	// Initialize to the center y-coordinate
	@type('int32')
	public y = center.y;

	constructor(private side: PaddleSide) {
		super();
		this.initialize();
	}

	// Reset method
	public reset() {
		this.initialize();
	}

	private initialize() {
		const actualOffset = Paddle.width / 2 + Paddle.offset;

		switch (this.side) {
			case PaddleSide.LEFT:
				this.x = actualOffset;
				break;

			case PaddleSide.RIGHT:
				this.x = GameDimensions.width - actualOffset;
				break;
		}
		this.y = center.y; // Reset to center position
	}
	// constructor(side: PaddleSide) {
	//   super();
	//   const actualOffset = Paddle.width / 2 + Paddle.offset;

	//   switch (side) {
	//     case PaddleSide.LEFT:
	//       this.x = actualOffset;
	//       break;

	//     case PaddleSide.RIGHT:
	//       this.x = GameDimensions.width - actualOffset;
	//       break;
	//   }
	// }
}

export class Ball extends Schema {
	public static readonly radius = 25;

	@type('int32')
	public x = center.x;

	@type('int32')
	public y = center.y;

	public reset() {
		this.center();
	}

	public center() {
		this.x = center.x;
		this.y = center.y;
	}
}

export class Scoreboard extends Schema {
	@type('int8')
	public left = 0;

	@type('int8')
	public right = 0;

	public reset() {
		this.left = 0;
		this.right = 0;
	}
}

export enum GameStatus {
	WAITING = 0,
	PLAYING,
	FINISHED,
	INTERRUPTED, // a player has left the match
}

export class GameState extends Schema {
	@type('int8')
	public gameStatus = GameStatus.WAITING;

	@type(Scoreboard)
	public scoreboard = new Scoreboard();

	@type(Paddle)
	public leftPaddle = new Paddle(PaddleSide.LEFT);

	@type(Paddle)
	public rightPaddle = new Paddle(PaddleSide.RIGHT);

	@type(Ball)
	public ball = new Ball();
}

// RoomManager Code
// export class RoomManager {
//   private availableRooms: string[] = [];

//   addAvailableRoom(roomId: string) {
//     this.availableRooms.push(roomId);
//   }

//   removeAvailableRoom(roomId: string) {
//     const index = this.availableRooms.indexOf(roomId);
//     if (index !== -1) {
//       this.availableRooms.splice(index, 1);
//     }
//   }

//   getAvailableRoom(): string | null {
//     if (this.availableRooms.length > 0) {
//       return this.availableRooms.pop();
//     }
//     return null;
//   }
// }

// Exporting a singleton instance of RoomManager
// export const roomManager = new RoomManager();