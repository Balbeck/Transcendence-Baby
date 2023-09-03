<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	// Imports -[ MODALS ]- ///////////////////////////
	import Modal from "$lib/modals/Modal.svelte";
	import { openModal, selectedPage } from "$lib/store/ModalValues";
	import { closeModal } from "$lib/store/ModalValues";
	// Est ce que Display une Modal  -[ boolean ]-
	import { showModal } from "$lib/store/ModalValues";
	let show_Modal: boolean;
	showModal.subscribe((a: boolean) => {
		show_Modal = a;
	});

	let selectedModal: string;
	selectedPage.subscribe((b: string) => {
		selectedModal = b;
	});
	///////////////////////////////////////////////////

	import { authentificated } from "$lib/store/store";
	import { googleAuth } from "$lib/store/store";
	let Google2fa: boolean = false;

	import ImgPreviewProfile from "./ImgPreviewProfile.svelte";
	import ErrorModal from "$lib/modals/ErrorModal.svelte";
	import Enable2Fa from "./Enable2Fa.svelte";
	import Disable2Fa from "./Disable2Fa.svelte";

	let login: string;
	let pictureLink: string;
	let newUserName: string = "";
	$: newImg = "";
	$: username = "";

	let indication_username: string = "";
	let indication_avatar: string = "";

	onMount(async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				goto("/");
			} else {
				const response = await fetch(
					"http://localhost:3000/user/profile",
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					}
				);
				console.log(" -[ Profile ]- response: ", response);
				if (response.ok) {
					//const user = await response.json(); // Convertit la réponse JSON en objet JavaScript
					const user = await response.json(); // Convertit la réponse JSON en objet JavaScript
					console.log(" -[ Profile ]- User: ", user);
					console.log("Salut du Profile");
					login = user.login;
					pictureLink = user.avatar;
					username = user.userName;

					googleAuth.set(user.fa2);
					console.log("2fa Value from user: [ ", user.fa2, " ]");
				} else {
					localStorage.clear();
					authentificated.set(false);
					goto("/");
				}
				//let user = await response();
			}
		} catch (e) {}
		googleAuth.subscribe((a) => {
			Google2fa = a;
		});
	});

	async function handleChangeName() {
		console.log("login ", login, "    newUserame: ", newUserName);
		const jwt = localStorage.getItem("jwt");
		const data = { login: login, newUsername: newUserName };

		const response = await fetch("http://localhost:3000/auth/changeName", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});

		if (response.ok) {
			console.log("response.ok");
			username = newUserName;
			goto("/");
		} else {
			// show message erreur Modal
			openModal("errorMsg");
			goto("/Profile");
		}
	}

	async function handleChangeImage() {
		const jwt = localStorage.getItem("jwt");
		const data = { login: login, img: newImg };
		const response = await fetch("http://localhost:3000/auth/changeImage", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});

		if (response.ok) {
			console.log("-[ Change Image ]- New Image bien Set");
		}
		goto("/");
	}
</script>

{#if show_Modal}
	<div>
		<Modal>
			{#if selectedModal === "Try Avatar"}
				<ImgPreviewProfile
					image={newImg}
					{login}
					{username}
					on:closeModal={closeModal}
				/>
			{/if}
			{#if selectedModal === "errorMsg"}
				<ErrorModal msg="username [ {username} ] is already used !" />
			{/if}
			{#if selectedModal === "Try Enable 2fa"}
				<Enable2Fa {login} />
			{/if}
			{#if selectedModal === "Try Disable 2fa"}
				<Disable2Fa {login} />
			{/if}
		</Modal>
	</div>
{:else}
	<div class="profile-Page">
		<h1>That is * {username} * Profil Bro !</h1>
		<h3>You will get a Cookie if you are a Good Boy</h3>
		<div>
			<img class="profile-pic" src={pictureLink} alt=": 🤖 👨🏻‍🌾 🍪 🤣 :" />
		</div>
		<div>
			<p>Login : {login}</p>
			<p>Name : {username}</p>
			<p>
				Change username
				<input
					type="text"
					placeholder="new username"
					bind:value={newUserName}
				/>
				<!-- <button on:click={handleChangeName}>Change</button> -->
				<button
					on:click={async () => {
						if (!newUserName.length) {
							indication_username = "Cannot be empty";
						} else if (newUserName.length > 20) {
							indication_username = "20 char Max";
						} else {
							handleChangeName();
						}
					}}>Change</button
				>
			</p>
			{#if indication_username !== ""}
				<div class="indication">{indication_username}</div>
			{/if}
			<p>
				Change Avatar (.jpg only !)
				<input
					type="text"
					placeholder="avatar img link"
					bind:value={newImg}
				/>
				<!-- <button on:click={handleChangeImage}>Change</button> -->
				<button
					on:click={async () => {
						if (!newImg.length) {
							indication_avatar = "Cannot be empty";
						} else if (newImg.length > 200) {
							indication_avatar = "200 char Max";
						} else {
							handleChangeImage();
						}
					}}>Change</button
				>
				<button
					on:click={async () => {
						if (!newImg.length) {
							indication_avatar = "Cannot be empty";
						} else if (newImg.length > 200) {
							indication_avatar = "200 char Max";
						} else {
							openModal("Try Avatar");
							goto("/Profile");
						}
					}}
				>
					Try
				</button>
				{#if indication_avatar !== ""}
					<div class="indication">{indication_avatar}</div>
				{/if}
			</p>
			<div>You could try : images/defaultAvatar.jpg</div>
			<div>You could try : images/backgroundImg.jpg</div>
			<div>
				<span> Google Authentificator : </span>
				{#if Google2fa === true}
					<span>
						<button
							on:click={() => {
								openModal("Try Disable 2fa");
								goto("/Profile");
							}}
						>
							Disable
						</button>
					</span>
				{:else}
					<span>
						<button
							on:click={() => {
								openModal("Try Enable 2fa");
								goto("/Profile");
							}}
						>
							Enable
						</button>
					</span>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.indication {
		color: crimson;
	}
	input {
		border-color: black;
		border-width: 1px;
	}
	button {
		color: red;
		border-width: 1px;
		border-radius: 25%;
		border-color: red;
		margin-left: 2px;
		margin-right: 2px;
	}
	.profile-Page {
		/* height: 2500px;
		width: 2500px; */
		align-items: center;
	}
	.profile-pic {
		max-width: 20%;
		max-height: 20%;
		border-radius: 50%;
	}
	img {
		align-items: center;
		position: relative;
		border-color: black;
		border-width: 2px;
	}
	p {
		margin-top: 2px;
	}
	h1 {
		align-items: center;
		color: black;
	}

	h3 {
		align-items: center;
		color: rgb(30, 30, 255);
	}
</style>
