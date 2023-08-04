import { writable } from "svelte/store";

// Auth -[ Value ] - qui definit l'acces au compte Utilisateur ou LoginPage
export let authentificated = writable(false);

