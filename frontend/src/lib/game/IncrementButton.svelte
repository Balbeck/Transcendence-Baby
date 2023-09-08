<script lang="ts">
	import { goto } from "$app/navigation";

	async function IncrementRank() {
		const jwt = localStorage.getItem("jwt");
		const response = await fetch("http://localhost:3000/user/increment", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			console.log("-[ Increment Rank ]- Rank and Title well Updated !");
		}
		goto("/Profile");
	}
</script>

<div>
	<button on:click={IncrementRank}>increment Winner</button>
</div>

<style>
	button {
		color: red;
		border-width: 1px;
		border-radius: 25%;
		border-color: red;
		margin-left: 2px;
		margin-right: 2px;
	}
</style>
