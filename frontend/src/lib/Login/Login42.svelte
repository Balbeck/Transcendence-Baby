<script lang="ts">
	import { onMount } from "svelte";
	import LoginButton from "./LoginButton.svelte";
	import { goto } from "$app/navigation";

	onMount(() => {
		// Code a exécuter lorsque SPA est chargée
	});

	function ConnectChchao() {
		goto("http://localhost:3000/loginChchao");
	}
	function ConnectBalbecke() {
		goto("http://localhost:3000/loginBalbecke");
	}
</script>

<div>
	<h1>Welcome To</h1>
	<img src="/images/logo-42.jpg" alt="Nein" />
	<!-- <h1 class="42">4 2</h1> -->
	<h2>Transcendence</h2>
	<LoginButton />
	<div class="testUsers">
		<span class="buttonUserTest">
			<button on:click={ConnectChchao}>User 1 🤵🏻‍♂️ </button>
		</span>
		<span class="buttonUserTest">
			<button on:click={ConnectBalbecke}>User 2 🕵️‍♂️ </button>
		</span>
	</div>
</div>

<style>
	.testUsers {
		flex-direction: row;
		align-items: center;
		margin-top: 3%;
		margin-bottom: 3%;
	}

	.buttonUserTest {
		margin-right: 10px;
		border-radius: 12%;
		border-color: blue;
		border-width: 1px;
	}
	img {
		max-width: 21%;
	}

	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h1 {
		color: green;
		font-size: 37px;
		margin-top: 21px;
		margin-bottom: 1px;
	}

	h2 {
		color: green;
		font-size: 32px;
		margin-top: 10px;
		margin-bottom: 16px;
	}
</style>
