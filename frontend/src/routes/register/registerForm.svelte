<script lang="ts">
	import ButtonRegister from "./ButtonRegister.svelte";

	let username: String = "";
	let email: String = "";
	let password: String = "";
</script>

<nav>
	<a href="/">Home</a>
</nav>
<div>
	<form class="registration-form">
		<div class="inputName">User name:</div>
		<div class="input-registration">
			<input required bind:value={username} />
		</div>
		<div />
		<div class="inputName">Email address:</div>
		<div class="input-registration">
			<input required bind:value={email} />
		</div>
		<div class="inputName">Password:</div>
		<div class="input-registration">
			<input autocomplete="off" required bind:value={password} />
		</div>
		<!-- <p>u: {username}, e: {email}, p: {password}</p> -->
		<div>
			<ButtonRegister />
		</div>
	</form>
</div>

<style>
	input {
		transition: color 4.2s;
		align-items: center;
	}
	.inputName {
		size: 3px;
		align-items: center;
	}

	.registration-form {
		margin-top: 5px;
	}

	.input-registration {
		margin-left: 8%;
		margin-bottom: 2px;
		border-radius: 20px;
		border-color: gray;
	}
</style>
