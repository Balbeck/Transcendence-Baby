<script lang="ts">
	let email: string = "";
	let name: string = "";
	let password: string = "";

	function handleRegister() {}
</script>

<div class="form-container">
	<form action="register">
		<div>
			<div class="input-form">
				<span class="input-names">Email: </span>
				<input class="input-field" type="text" name="email" value="" />
			</div>
		</div>
		<div class="input-form">
			<span class="input-names">Name: </span>
			<input class="input-field" type="text" name="name" value="" />
		</div>
		<div class="input-form">
			<span class="input-names">Pass: </span>
			<input class="input-field" type="text" name="password" value="" />
		</div>
		<div class="register-button">
			<button on:click={handleRegister}>Register</button>
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
