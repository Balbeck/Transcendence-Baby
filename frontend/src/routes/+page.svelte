<script lang="ts">
	//     ********* [ Imports ] *********
	import Modal from "$lib/modals/Modal.svelte";
	import Profilpage from "$lib/profile/Profilepage.svelte";
	import Chat from "$lib/chat/Chat.svelte";
	import Game from "$lib/game/Game.svelte";
	import FindFriends from "../lib/findFriends/FindFriends.svelte";

	// Imports  -[ Functions ]-
	import { closeModal, errorMsg } from "$lib/store/ModalValues";

	// Est ce que Display une Modal  -[ boolean ]-
	import { showModal } from "$lib/store/ModalValues";
	let show_Modal: boolean;
	showModal.subscribe((a: boolean) => {
		show_Modal = a;
	});

	// Nom de la Modal a display  -[ string ]-
	import { selectedPage } from "$lib/store/ModalValues";
	import ErrorModal from "$lib/modals/ErrorModal.svelte";
	let selectedPage_Value: string;
	selectedPage.subscribe((a: string) => {
		selectedPage_Value = a;
	});
	let msgError = "";
	errorMsg.subscribe((a) => {
		msgError = a;
	});
</script>

<main>
	<div class="background-darkVador">
		{#if show_Modal}
			<Modal>
				<!-- Display du Modal demande par le User -->
				<!-- {#if selectedPage_Value === "profile"}
					<Profilpage on:closeModal={closeModal} /> -->
				{#if selectedPage_Value === "chat"}
					<Chat on:closeModal={closeModal} />
				{:else if selectedPage_Value === "game"}
					<Game on:closeModal={closeModal} />
					<!-- {:else if selectedPage_Value === "findFriends"}
					<FindFriends on:closeModal={closeModal} /> -->
				{:else if selectedPage_Value === "errorMsg"}
					<ErrorModal msg={msgError} on:closeModal={closeModal} />
				{/if}
			</Modal>
		{/if}
	</div>
	<div>
		<img src="/images/backgroundImg.jpg" alt="Ici DarK Cookie !" />
	</div>
</main>

<style>
	/* 🔴  🚨  -[ A Faire ]-   N'affiche plus l'image de fond !!! ???   🚒  🔴 */
	.background-darkVador {
		background-image: url("/images/backgroundImg.jpg");
		background-repeat: no-repeat;
		background-size: cover;
	}
</style>
