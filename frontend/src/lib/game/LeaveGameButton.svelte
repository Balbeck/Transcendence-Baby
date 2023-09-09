<script lang="ts">
	import { goto } from "$app/navigation";

	async function LeaveGame() {
		const jwt = localStorage.getItem("jwt");
		const response = await fetch("http://localhost:3000/user/leaveGame", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			console.log("-[ Leave Game Button ]- ");
		}
		goto("/Friends");
	}
</script>

<div>
	<button on:click={LeaveGame}>Leave Game</button>
</div>

<style>
	button {
		color: blue;
		border-width: 1px;
		border-radius: 25%;
		border-color: blue;
		margin-left: 2px;
		margin-right: 2px;
	}
</style>
