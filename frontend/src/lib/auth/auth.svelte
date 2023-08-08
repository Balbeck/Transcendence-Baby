<script lang="ts">
	import { authentificated } from "$lib/store/store";

	export async function checkJWT() {
		const jwt_verifier_url = "http://localhost:3000/auth/verifier_jwt";
		const token = localStorage.getItem("jwt");

		if (!token) {
			return false; // Pas de JWT trouvé
		}

		// Envoyer le JWT au backend pour validation
		try {
			const response = await fetch(jwt_verifier_url, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({}),
			});

			if (response.ok) {
				console.log(" -[ CheckJWT ]- reponse Backend ( OK )");
				authentificated.set(true);
				return true;
			} else {
				console.log(" -[ CheckJWT ]- reponse Backend ( BAD )");
				authentificated.set(false);
				return false;
			}
		} catch (error) {
			return false;
		}
	}
</script>

<!-- <script>

	// Imports
	import { writable } from "svelte/store";

	// Store pour l'état d'authentification (true si l'utilisateur est authentifié, false sinon)
	export let isAuthenticated = writable(false);

	function handleAuthentication() {
		// Simuler une connexion réussie
		isAuthenticated.set(true);

		// Redirection vers le dashboard si l'authentification réussit
		navigateToDashboard();
	}

	function handleNonAuthentication() {
		// Simuler un échec d'authentification
		isAuthenticated.set(false);

		// Afficher une fenêtre modale d'erreur
		alert("Unauthorized Accès 🏓 🪈 🖕");
	}

	function navigateToDashboard() {
		// Redirection vers le dashboard
		window.location.href = "/dashboard";
	}
</script> -->

<!-- 
<main>
	<h1>Authentication Page</h1>
	<button on:click={handleAuthentication}>Authentifier</button>
	<button on:click={handleNonAuthentication}>NonAuthentifier</button>
</main> -->
