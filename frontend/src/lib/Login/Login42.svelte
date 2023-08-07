<script lang="ts">
	import { onMount } from "svelte";
	import LoginButton from "./LoginButton.svelte";
	import Register from "$lib/register/Register.svelte";
	import LoginForm from "./LoginForm.svelte";
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
	<div>
		<span class="buttonUserTest">
			<button on:click={ConnectChchao}>User 1 🤵🏻‍♂️ </button>
		</span>
		<span class="buttonUserTest">
			<button on:click={ConnectBalbecke}>User 2 🕵️‍♂️ </button>
		</span>
	</div>
</div>
<Register />
<LoginForm />

<!-- <div>
		<button
			on:click={() => {
				goto("http://localhost:3000/user/1");
			}}>🤵🏻‍♂️ User *1* !</button
		>
		<button
			on:click={() => {
				goto("http://localhost:3000/user/2");
			}}>🤖 User *2* !</button
		>
	</div> -->

<style>
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
		height: 100vh;
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
