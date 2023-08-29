<script lang="ts">
	import { goto } from "$app/navigation";
	import GoogleAuth from "$lib/auth/GoogleAuth.svelte";
	import { closeModal } from "$lib/store/ModalValues";
	import { isGoogleAuthEnabled } from "$lib/store/store";
	import { onMount } from "svelte";

	import { showModal } from "$lib/store/ModalValues";
	let show_Modal: boolean;
	showModal.subscribe((a: boolean) => {
		show_Modal = a;
	});

	export let login: string;
	let QrSource: string;

	let google2faEnabled = false;
	isGoogleAuthEnabled.subscribe((a) => {
		google2faEnabled = a;
	});

	async function handleEnable_2fa() {
		const jwt = localStorage.getItem("jwt");
		const response = await fetch("http://localhost:3000/auth/enable_2fa", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			console.log("-[ Enable 2fa ]- OK");
			let res = await response.json();
			//console.log("-[ Enable 2fa ]-Response: ", res);
			QrSource = res.url;
			//console.log("-[ Enable 2fa]- qrSource: ", QrSource);
		} else {
			closeModal();
			goto("/");
		}
	}

	onMount(() => {
		handleEnable_2fa();
	});
</script>

{#if show_Modal}
	<div>Enabling Google Authenticator</div>
	<div>Authenticate Yourself to enable 2fa</div>

	<GoogleAuth QrCode={QrSource} {login} />
{/if}
