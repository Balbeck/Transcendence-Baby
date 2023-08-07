<script lang="ts">
	import "../app.css";
	import Navigation from "$lib/nav/Navigation.svelte";
	import Login42 from "$lib/login/Login42.svelte";

	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import checkJWT from "$lib/auth/auth.svelte";

	console.log("On arrive dans le Layout");

	//  *- [ Authentification ] -* { Local Storage }  via  Header 🎩
	// if (auth === false) {
	// 	onMount(() => {
	// 		const jwtHeader = response.headers.get("X-JWT");

	// 		// Vérifiez si le JWT est présent dans l'en-tête de réponse
	// 		if (document.cookie.startsWith("Authorization=Bearer ")) {
	// 			// Récupérez le JWT en supprimant le préfixe 'Authorization' de l'en-tête de réponse
	// 			const jwt = document.cookie.substring(
	// 				"Authorization=Bearer ".length
	// 			);
	// 			console.log("JWT:", jwt);

	// 			// Stockez le JWT dans le Local Storage
	// 			localStorage.setItem("jwt", jwt);
	// 			authentificated.set(true);
	// 			console.log("Tudo Bem Muchacho");
	// 		} else {
	// 			console.log("Hey Non Encore Rate Caramba !!!! 😭 ");
	// 		}
	// 		return {
	// 			redirect: "/",
	// 		};
	// 	});
	// }

	$: if (auth === false) {
		//  *- [ Authentification ] -* { Local Storage }  via  URL
		onMount(async () => {
			// [ 1 ] Check si un Jwt est deja present Dans le LocalStorage du Browser
			const token = localStorage.getItem("jwt");
			if (token) {
				console.log("On a bien un JWT present dans le localStorage !");
				try {
					// [ 1 - 1 ] Verification validite du Jwt aupres du Backend
					const jwt_verifier_url =
						"http://localhost:3000/auth/verifier_jwt";
					const response = await fetch(jwt_verifier_url, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({}),
					});

					// [ 1 - 2 ] Authorisation Acces si reponse Positive du Back !
					if (response.ok) {
						console.log(
							"reponse du Backend ***[ Ok ]*** pour le JWT"
						);
						authentificated.set(true);
						goto("/");
					}
					// [ 1 - 3 ] Si Jwt non Valide par le Back, effacement
					else {
						console.log(
							"reponse du Backend ***[ BAD ]*** pour le JWT"
						);
						authentificated.set(false);
						localStorage.clear();
					}
				} catch (error) {}
			}
			// [ 2 ] Si Aucun Jwt dans localStorage du Browser Verification si Jwt present Dans Url
			else {
				console.log("Pas de Jwt dans le Local storage");

				// [ 2 - 1 ] Recupere Parametre l'UrL
				const queryString = window.location.search;
				const urlParams = new URLSearchParams(queryString);
				let jwt: any;

				// [ 2 - 2 ] Recuperation JWT avec 'await' pour résoudre la Promise
				if (urlParams.has("jwt")) {
					const jwtPromise = urlParams.get("jwt");
					jwt = await jwtPromise;
					console.log("JWT:", jwt);
				}

				// [ 2 - 3 ] Si param 'JwT' Stockez le JWT dans le Local Storage et Donner Acces a Espace User
				if (jwt) {
					console.log("jwt: ", jwt);
					localStorage.setItem("jwt", jwt);
					authentificated.set(true);
				}
				// [ 2 - 4 ] Cas ou Jwt Non present dans l'Url
				else {
					console.log("Paramètre URL 'jwt' non trouvé.");
				}
				// [ 2 - 5 ] Redirection Vers Le Home afin de relancer Verification
				goto("/");
			}
		});
	}

	// import -[ Value ]- Authentification : Condition Acces Espace User
	import { authentificated } from "$lib/store/store";
	let auth: boolean = false;
	authentificated.subscribe((a) => {
		auth = a;
	});
</script>

<div>
	{#if !auth}
		<main>
			<Login42 />
		</main>
	{:else}
		<header class="h-24 w-full bg-red-500">
			<Navigation />
		</header>
		<div class="background">
			<main>
				<slot />
			</main>
		</div>
	{/if}
</div>

<style>
	.background {
		background-image: url("/images/backgroundImg.jpg");
		background-repeat: no-repeat;
		background-size: cover;
	}
</style>
