<script lang="ts">
	import Navigation from "$lib/Navigation.svelte";
	import { authentificated } from "$lib/store/store";

	let auth = false;
	authentificated.subscribe((a) => {
		auth = a;
	});
</script>

{#if auth}
	<header class="h-24 w-full bg-red-500">
		<Navigation />
	</header>
{/if}
