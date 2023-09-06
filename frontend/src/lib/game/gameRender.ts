import { Ball, Paddle, GameState, GameStatus, GameDimensions, Scoreboard } from "./game.schema";

export function drawTextCenter(ctx: CanvasRenderingContext2D, text: string) {
	ctx.fillText(text, GameDimensions.width / 2, GameDimensions.height / 2);
}

export function drawHalfwayLine(ctx: CanvasRenderingContext2D) {
	ctx.beginPath();
	ctx.setLineDash([17, 30]);
	ctx.moveTo(GameDimensions.width / 2, 0);
	ctx.lineTo(GameDimensions.width / 2, GameDimensions.height);
	ctx.stroke();
	ctx.setLineDash([]);
}

export function renderBall(ctx: CanvasRenderingContext2D, ball: Ball) {
	ctx.beginPath();
	// ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI); // Assuming Ball has a property radius
	ctx.arc(ball.x, ball.y, Ball.radius, 0, 2 * Math.PI); // Assuming Ball has a property radius
	ctx.closePath();
	ctx.fill();
}

export function renderPaddle(ctx: CanvasRenderingContext2D, paddle: Paddle) {
	ctx.fillRect(paddle.x - Paddle.width / 2, paddle.y - Paddle.height / 2, Paddle.width, Paddle.height); // Assuming Paddle has properties width and height
}

export function renderScoreboard(ctx: CanvasRenderingContext2D, scoreboard: Scoreboard) {
	ctx.fillText(scoreboard.left.toString(), GameDimensions.width * (1 / 4), 100);
	ctx.fillText(scoreboard.right.toString(), GameDimensions.width * (3 / 4), 100);
}
export function render(ctx: CanvasRenderingContext2D, state: GameState) {
	// ctx.fillStyle = '#000';
	ctx.fillStyle = 'rgba(0, 0, 77, 0.5)';  // Semi-transparent Blue
	ctx.fillRect(0, 0, GameDimensions.width, GameDimensions.height);

	ctx.fillStyle = 'rgba(1, 99, 255, 0.5)';
	ctx.fillStyle = 'hsla(120, 100%, 50%, 0.5)';  // Semi-transparent Green using HSLA
	// Green using HSL

	ctx.lineWidth = 10;
	ctx.font = '100px Monospace';
	ctx.textAlign = "center";

	switch (state.gameStatus) {
		case GameStatus.WAITING:
			drawTextCenter(ctx, 'Opponent is wanted');
			break;
		case GameStatus.PLAYING:
			drawHalfwayLine(ctx);
			renderBall(ctx, state.ball);
			renderPaddle(ctx, state.leftPaddle);
			renderPaddle(ctx, state.rightPaddle);
			renderScoreboard(ctx, state.scoreboard);
			break;
		case GameStatus.FINISHED:
			renderScoreboard(ctx, state.scoreboard);
			drawTextCenter(ctx, 'Game Over');
			break;
		case GameStatus.INTERRUPTED:
			drawTextCenter(ctx, 'Opponent left');
			break;
	}
}