<script lang="ts">
	// Imports -[ SvelteKit Fct ]-
	import { goto } from "$app/navigation";

	// Imports -[ Functions ]-
	import { openModal } from "$lib/store/ModalValues";

	// Imports -[ Writable - Values ]-
	import {
		authentificated,
		isGoogleAuthActivated,
		isGoogleAuthEnabled,
	} from "../store/store";

	async function handleLoggout() {
		const token = localStorage.getItem("jwt");
		if (token) {
			const logout_url = "http://localhost:3000/auth/logout";
			const response = await fetch(logout_url, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({}),
			});
		}
		localStorage.clear();
		isGoogleAuthEnabled.set(false);
		authentificated.set(false);
		//isGoogleAuthActivated.set(false);
		goto("/");
	}

	function handleProfile() {
		goto("/Profile");
	}
	function handleFriends() {
		goto("/Friends");
	}
	function handleGame() {
		goto("/game");
	}
</script>

<nav class="w-full flex gap-10 p-2 justify-center items-center h-full">
	<button on:click={() => goto("/")}>Home</button>
	<!-- <button on:click={() => openModal("profile")}>Profile</button> -->
	<button on:click={handleProfile}>Profile</button>
	<button on:click={handleGame}>Game</button>

	<button
		on:click={() => {
			goto("/");
			openModal("chat");
		}}>Chat</button
	>
	<!-- <button on:click={() => { goto("/"); openModal("findFriends"); }}>Find Friends</button> -->
	<button on:click={handleFriends}>Friends</button>
	<button on:click={() => goto("/DM")}>DM</button>
	<button on:click={handleLoggout}>Logout</button>
</nav>

<!-- <div>
	<nav class="w-full flex gap-10 p-2 justify-center items-center h-full">
		<button on:click={() => openModalProfil()}>Profil</button>
		<button on:click={() => openModal("imgT1.jpg")}>Jeu</button>
		<button on:click={() => openModal("imgT2.jpg")}>Chat</button>
		<button on:click={() => openModal("imgT3.jpg")}>Find Friends</button>
		<button on:click={handleLoggout}>Logout</button>
	</nav>
</div> -->
