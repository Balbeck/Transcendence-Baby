<script>
	import { writable } from "svelte/store";

	export const ballPosition = writable({ x: 0, y: 0 });
	export const paddles = writable({ player1: 0, player2: 0 });
	export const scores = writable({ player1: 0, player2: 0 });
</script>
