<script lang="ts">
	import { onMount } from "svelte";
	import LoginButton from "./LoginButton.svelte";

	onMount(() => {
		// Code a exécuter lorsque SPA est chargée
	});
</script>

<div>
	<h1>Welcome To</h1>
	<img src="/images/logo-42.jpg" alt="Nein" />
	<!-- <h1 class="42">4 2</h1> -->
	<h2>Transcendence</h2>
	<LoginButton />
</div>

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
