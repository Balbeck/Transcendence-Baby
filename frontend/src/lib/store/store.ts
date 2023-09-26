import { writable } from "svelte/store";

// Auth -[ Value ] - qui definit l'acces au compte Utilisateur ou LoginPage
export let authentificated = writable(false);

// Google Authentificator Layout Authentification
export let isGoogleAuthActivated = writable(false);
export let isGoogleAuthEnabled = writable(false);
export let qrGoogle = writable("");

// User Infos (for game & auth)
export let userLogin = writable("");
export let actualUsername = writable("");
export let userId = writable(0);
export let clientColyseus = writable();

// Google Auth Profile Set
export let googleAuth = writable(false);


// DM
export let session: any = writable(null);
export let user: any = writable(null);