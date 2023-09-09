<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import type { GameState } from "../../../../backend/src/game/game.schema";
	import GameModal from "$lib/game/gameModal.svelte";
	import * as Colyseus from "colyseus.js";
	import IncrementButton from "$lib/game/IncrementButton.svelte";
	import IncrementLooserButton from "$lib/game/IncrementLooserButton.svelte";

	// import backgroundImage from "../../../static/images/playRoom.jpg";

	let playMode: string = "anyone"; //default value 'firend' as private room
	let speed: number = 3; // Default value for speed
	let scoreToWin: string = "3"; // Default value for score to win
	let tableSize: string = "medium"; // Default table size
	let client: Colyseus.Client;
	let room: Colyseus.Room<GameState>;
	// let state: GameState;
	let isModalOpen = false;

	const openModal = () => {
		isModalOpen = true;
	};
	const closeModal = () => {
		isModalOpen = false;
	};

	onMount(() => {
		client = new Colyseus.Client("ws://localhost:3000");

		return () => {
			if (room) room.leave();
		};
	});
	const createRoomWithColyseus = async () => {
		try {
			if (playMode === "anyone") {
				room = await client.joinOrCreate("pong", {
					playMode: playMode,
					speed: speed,
					scoreToWin: scoreToWin,
					tableSize: tableSize,
				});
			}

			room.onMessage("state", (message: any) => {
				console.log("New game state received:", message);
			});
			room.onMessage("startGame", (message: any) => {
				//createRoomWithColyseus();  // This line might actually lead to recursion, be careful
			});
			goto("/game/create");
			// if (playMode === "anyone") {
			// 	goto("/game/create");
			// }
		} catch (error) {
			console.error("Failed to create or join room:", error);
			alert("Failed to create or join room. Please try again later."); // Inform the user
		}
	};

	const onSubmit = () => {
		createRoomWithColyseus();
	};
</script>

<button on:click={openModal}>Create Game</button>

<IncrementButton />
<IncrementLooserButton />

<GameModal bind:isOpen={isModalOpen} on:close={closeModal}>
	<!-- Your form can go here -->
	<form on:submit|preventDefault={onSubmit}>
		<div class="container">
			<h2>Let's PLAY</h2>

			<label>
				Choose your Opponent:
				<select bind:value={playMode}>
					<option value="friend">Play With Friend</option>
					<option value="anyone">Play With Anyone</option>
				</select>
			</label>

			<label>
				Speed:
				<input type="range" min="0" max="10" bind:value={speed} />
				{speed} / 10
			</label>

			<label>
				Table Size:
				<select bind:value={tableSize}>
					<option value="small">Small</option>
					<option value="medium">Medium</option>
					<option value="large">Large</option>
				</select>
			</label>

			<label>
				Score to Win:
				<select bind:value={scoreToWin}>
					<option value="3">3 vs 3</option>
					<option value="5">5 vs 5</option>
				</select>
			</label>
			<button type="submit">+PongRoom</button>
		</div>
	</form>
</GameModal>

<style>
	.container {
		width: 100%; /* Set width as needed */
		height: 100%; /* Set height as needed */
		border: 2px solid black;
		padding: 20px;
		margin: 0 auto;
		box-sizing: border-box;
		background-image: url("/images/playRoom.jpg");
		/* background-image: url("/images/homeRoom.jpeg"); */
		background-position: center;
		background-size: cover;
	}

	label {
		display: block;
		margin-bottom: 10px;
		color: rgb(
			29,
			41,
			131
		); /* Change text color to white for better visibility on ocean background */
	}

	input[type="range"] {
		width: 100%;
	}

	/* Additional styling to make text and inputs more visible on the ocean background */
	input,
	select,
	button {
		background: rgba(
			255,
			255,
			255,
			0.8
		); /* Semi-transparent white background */
		border: none;
		padding: 5px;
	}

	button {
		cursor: pointer;
	}
</style>
