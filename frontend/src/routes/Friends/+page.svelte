<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	// Imports -[ MODALS ]- ///////////////////////////
	import Modal from "$lib/modals/Modal.svelte";
	import { openModal, selectedPage } from "$lib/store/ModalValues";
	import { closeModal } from "$lib/store/ModalValues";
	// Est ce que Display une Modal  -[ boolean ]-
	import { showModal } from "$lib/store/ModalValues";
	import OtherProfile from "$lib/OtherProfile/OtherProfile.svelte";
	let show_Modal: boolean;
	showModal.subscribe((a: boolean) => {
		show_Modal = a;
	});

	let selectedModal: string;
	selectedPage.subscribe((b: string) => {
		selectedModal = b;
	});
	///////////////////////////////////////////////////

	// Afficher la liste des user online
	// ajouter un bouton 'send request'

	// Afficher la liste des amis
	// ajouter bouton 'unfriend'

	// afficher la liste des amis en attente acceptation
	// ajouter bouton 'accept'

	//let users: string[];
	let onlineUsers: string[] = [];
	//let users: string[] = ["Henry", "john", "boby"];
	let userToDisplay: string;
	let emptyArray: boolean = false;

	onMount(async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			const onlineUsers_url = "http://localhost:3000/auth/onlineUsers";
			const onlineUserResponse = await fetch(onlineUsers_url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
			});
			if (onlineUserResponse.ok) {
				onlineUsers = await onlineUserResponse.json();
				if (onlineUsers.length === 0) {
					emptyArray = true;
				}
				console.log("onlineUsers: ", onlineUsers);
			}
		} catch (e) {
			console.log("Friend OnMount PB");
		}
	});

	async function handleSeeProfil(username: string) {
		//console.log("+page.Friends - username: ", username);
		userToDisplay = username;
		openModal("OtherProfile");
		goto("/Friends");
	}
</script>

<div>
	<h1>👨🏻‍🌾 Find friends 🕵️‍♂️ 💂‍♀️</h1>

	<div>
		<h2>Online Users</h2>
		{#if show_Modal}
			<div>
				<Modal>
					{#if selectedModal === "OtherProfile"}
						<OtherProfile
							username={userToDisplay}
							on:closeModal={closeModal}
						/>
					{/if}
				</Modal>
			</div>
		{:else}
			<div>
				{#if emptyArray === true}
					<p>Sorry Bro no one is connected !</p>
				{:else}
					{#each onlineUsers as user}
						<div class="user-card">
							<p>{user}</p>
							<button
								on:click={() => {
									handleSeeProfil(user);
								}}>See Profil</button
							>
						</div>
					{/each}
				{/if}
			</div>
		{/if}
	</div>
	<div>
		<!-- svelte-ignore a11y-img-redundant-alt -->
		<img src="images/imgT3.jpg" alt="Image presentation" />
	</div>
</div>

<style>
	.user-card {
		display: flex;
		align-items: center;
		padding: 10px;
		border: 1px solid #ccc;
		margin-bottom: 10px;
	}

	button {
		margin-left: 10px;
		background-color: blue;
		color: aliceblue;
	}
</style>
