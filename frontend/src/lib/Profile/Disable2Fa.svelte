<script lang="ts">
	import { goto } from "$app/navigation";
	import { closeModal } from "$lib/store/ModalValues";
	import {
		googleAuth,
		isGoogleAuthActivated,
		isGoogleAuthEnabled,
	} from "$lib/store/store";

	export let login: string;

	async function handleDisable_2fa() {
		const jwt = localStorage.getItem("jwt");
		const data = { login: login };
		const response = await fetch("http://localhost:3000/auth/disable_2fa", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});

		if (response.ok) {
			console.log("-[ Disable 2fa ]- OK ");
		}
		isGoogleAuthEnabled.set(false);
		isGoogleAuthActivated.set(false);
		googleAuth.set(false);
		closeModal();
		goto("/");
	}
</script>

<div>Desabling Google Authentificator</div>
<div>Confirm your choice :</div>

<div>
	<button on:click={handleDisable_2fa}>Confirm</button>
	<button
		on:click={() => {
			closeModal();
			goto("/Profile");
		}}>No</button
	>
</div>

<style>
	button {
		margin-left: 5px;
		border-width: 1px;
		border-color: brown;
		border-radius: 42%;
	}
	button:hover {
		color: brown;
	}
</style>
