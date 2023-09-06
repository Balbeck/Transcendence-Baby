<script>
	import { createEventDispatcher } from "svelte";
	import "../../global.css";

	const dispatch = createEventDispatcher();

	// Props from parent
	export let isOpen = false;

	const closeModal = () => {
		dispatch("close");
	};
</script>

{#if isOpen}
	<div class="modal">
		<div class="modal-content">
			<span class="close-btn" on:click={closeModal}>&times;</span>
			<slot />
		</div>
	</div>
{/if}

<style>
	/* Your modal styles here */
</style>
