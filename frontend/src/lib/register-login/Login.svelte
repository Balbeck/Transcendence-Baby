<script lang="ts">
	import { goto } from "$app/navigation";
	import { authentificated } from "$lib/store/store";

	let name: string = "";
	let password: string = "";

	const handleLogin = async () => {
		const response = await fetch("http://localhost:3000/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, password }),
		});
		console.log("jsonStringified(): ", JSON.stringify({ name, password }));
		//const data = await response.json();
		//console.log("data: ", data);

		// Extraire le paramètre JWT de l'URL de la réponse
		const jwtParam = new URLSearchParams(response.url.split("?")[1]).get(
			"jwt"
		);

		console.log("JWT Paramètre: ", jwtParam);
		if (jwtParam) {
			localStorage.setItem("jwt", jwtParam);
			authentificated.set(true);
		}
		goto("/");
	};
</script>

<div class="form-container">
	<h2>Login Form</h2>
	<form on:submit|preventDefault={handleLogin}>
		<div class="input-form">
			<span class="input-names">Name: </span>
			<input
				class="input-field"
				type="text"
				name="name"
				bind:value={name}
			/>
		</div>
		<div class="input-form">
			<span class="input-names">Pass: </span>
			<input
				class="input-field"
				type="text"
				name="password"
				bind:value={password}
			/>
		</div>
		<div class="register-button">
			<button type="submit">Login</button>
		</div>
	</form>
</div>

<style>
	input {
		align-items: flex-end;
	}
	.form-container {
		width: 320px;
		height: auto;
		align-items: center;
		border-width: 2px;
		border-radius: 6px;
		border-color: gray;
		background-color: cornflowerblue;
	}
	.input-form {
		border-width: 1px;
		border-radius: 12px;
		border-color: aqua;
		margin-top: 5px;
		margin-left: 10px;
		margin-right: 10px;
		background-color: white;
		align-items: flex-end;
	}
	.input-names {
		width: max-content;
		border-radius: 2px;
		border-width: 2px;
		border-color: brown;
		align-items: flex-start;
	}
	.input-field {
		align-items: end;
	}
	.register-button {
		text-align: center;
		font-family: "Comic Sans MS", cursive;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-left: 10px;
		margin-right: 10px;
		border-radius: 12px;
		border-width: 2px;
		border-color: black;
		background-color: whitesmoke;
	}
</style>
