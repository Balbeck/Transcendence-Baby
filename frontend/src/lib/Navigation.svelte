<script lang="ts">
	// Imports -[ SvelteKit Fct ]-
	import { goto } from "$app/navigation";

	// Imports -[ Functions ]-
	import { openModal } from "$lib/store/ModalValues";

	// Imports -[ Writable - Values ]-
	import { authentificated } from "./store/store";
	function handleLoggout() {
		localStorage.clear();
		authentificated.set(false);
		goto("/");
	}
</script>

<nav class="w-full flex gap-10 p-2 justify-center items-center h-full">
	<button on:click={() => openModal("profile")}>Profile</button>
	<button on:click={() => openModal("game")}>Jeu</button>
	<button on:click={() => openModal("chat")}>Chat</button>
	<button on:click={() => openModal("findFriends")}>Find Friends</button>
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
