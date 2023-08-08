<script lang="ts">
	// -[🔴 A FAIRE ]- Button close de la modal => Button a cree a part et a integrer a chaque Page en haut a droite avec uniquement le signe 'x'
	import { closeModal } from "$lib/store/ModalValues";
</script>

<main>
	<div class="modal-backdrop" on:click={() => closeModal()}>
		<div class="modal-content" on:click={(e) => e.stopPropagation()}>
			<button class="top-close-button" on:click={() => closeModal()}
				>x</button
			>
			<slot />
			<button class="close-button" on:click={() => closeModal()}
				>x *** Close *** X</button
			>
		</div>
	</div>
</main>

<!-- <main>
	<div>
		{#if mod}
			<div class="backdrop" on:click={() => closeModal()}>
				<div class="modal" on:click={(e) => e.stopPropagation()}>
					<img src={`images/${selectedImage}`} alt="Image" />
					<button on:click={() => closeModal()}>Fermer</button>
				</div>
			</div>
		{/if}
	</div>
</main> -->
<style>
	.top-close-button {
		align-items: right;
	}
	/* Style pour le modal */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* .modal-content {
	  background-color: white;
	  padding: 20px;
	  border-radius: 8px;
	} */
	.modal-content {
		width: 90%;
		max-width: 600px;
		max-height: 90%;
		background-color: white;
		border-radius: 8px;
		padding: 20px;
		overflow-y: auto;
	}
</style>
