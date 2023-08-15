import { writable } from "svelte/store";

// Auth -[ Value ] - qui definit l'acces au compte Utilisateur ou LoginPage
export let authentificated = writable(false);

// Google Authentificator Layout Authentification
export let isGoogleAuthActivated = writable(false);
export let isGoogleAuthEnabled = writable(false);
export let qrGoogle = writable("");
export let userLogin = writable("");

// Google Auth Profile Set
export let googleAuth = writable(false);
