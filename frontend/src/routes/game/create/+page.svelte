<script lang="ts">
	import { onMount } from "svelte";
	import { PaddleDirection } from "../../../../../backend/src/game/game.physics";
	import { Client, Room } from "colyseus.js";
	import {
		GameState,
		GameDimensions,
	} from "../../../../../backend/src/game/game.schema";
	import { render } from "$lib/game/gameRender";

	let state: GameState;
	let room: Room<GameState>;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let isDisconnected = false;
	let isGamePaused = false;

	onMount(() => {
		const context = canvas.getContext("2d");
		if (!context) {
			throw new Error("Failed to get 2D context.");
		}
		ctx = context;

		(async () => {
			// Initialize game and state
			await initializeGame();

			// First render
			render(ctx, state);
			//render();

			// Additional setup
			resizeCanvas();

			// Start rendering loop
			renderLoop();
		})();

		room.onLeave((code) => {
			if (code === 1000) {
				// Normal closure, not a disconnection
				return;
			}
			handleDisconnection();
		});

		// Add event listeners for key events
		window.addEventListener("resize", resizeCanvas);
		window.addEventListener("keydown", handleKeydown);
		window.addEventListener("keyup", handleKeyup);

		return () => {
			// Cleanup when the component is destroyed
			window.removeEventListener("resize", resizeCanvas);
			window.removeEventListener("keydown", handleKeydown);
			window.removeEventListener("keyup", handleKeyup);
		};
	});

	async function initializeGame() {
		const client = new Client("ws://localhost:3000");
		try {
			room = await client.joinOrCreate("pong");
			state = room.state;

			room.onStateChange((newState) => {
				state = newState;
				render(ctx, state);
				// Optionally, render whenever the state changes
			});
		} catch (e) {
			console.error("Failed to connect to the game server:", e);
		}
	}
	function handleDisconnection() {
		// if (isDisconnected = true)
		// {
		//   state = INTERRUPTE;
		// }
		isDisconnected = true;
		isGamePaused = true; // Pause the game on disconnection
	}
	function handleReconnection() {
		isDisconnected = false;
		isGamePaused = false; // Resume the game on reconnection
	}

	// ... [Handle key events]
	function handleKeydown(e: KeyboardEvent) {
		if (isGamePaused) {
			return; // Don't handle key events when the game is paused
		}
		switch (e.key) {
			case "ArrowUp":
				//room.send({ newDirection: PaddleDirection.UP } as PaddleMoveMessage);
				room.send("paddleMove", { newDirection: PaddleDirection.UP });

				break;
			case "ArrowDown":
				//room.send({ newDirection: PaddleDirection.DOWN } as PaddleMoveMessage);
				room.send("paddleMove", { newDirection: PaddleDirection.DOWN });
				break;
		}
	}

	function handleKeyup(e: KeyboardEvent) {
		if (isGamePaused) {
			return; // Don't handle key events when the game is paused
		}

		switch (e.key) {
			case "ArrowUp":
			case "ArrowDown":
				//room.send({ newDirection: PaddleDirection.STOP } as PaddleMoveMessage);
				room.send("paddleMove", { newDirection: PaddleDirection.STOP });
				break;
		}
	}

	function resizeCanvas() {
		const scale = Math.min(
			window.innerWidth / GameDimensions.width,
			window.innerHeight / GameDimensions.height
		);
		ctx.canvas.width = GameDimensions.width * scale;
		ctx.canvas.height = GameDimensions.height * scale;
		ctx.scale(scale, scale);
	}
	function renderLoop() {
		requestAnimationFrame(renderLoop);
		//render();
		render(ctx, state);
	}
</script>

{#if isDisconnected}
	<div class="disconnected-message">
		<h2>Opponent Left</h2>
		<button on:click={handleReconnection}>Reconnect</button>
	</div>
{/if}
<svelte:window
	on:resize={resizeCanvas}
	on:keydown={handleKeydown}
	on:keyup={handleKeyup}
/>
<canvas bind:this={canvas} id="rendering-canvas" />

<style>
	canvas#rendering-canvas {
		width: 1000px;
		height: 800px;
		border: 1px solid pink;
	}
</style>
