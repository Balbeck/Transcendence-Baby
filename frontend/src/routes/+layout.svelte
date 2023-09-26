<script lang="ts">
	import "../app.css";
	import Navigation from "$lib/nav/Navigation.svelte";
	// import { errorMsg, openModal, showModal } from "$lib/store/ModalValues";
	// import checkJWT from "$lib/auth/auth.svelte";

	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	// Connexion websocket + socket.io + user info globale
	import { io } from "socket.io-client";
	import { session, user } from "$lib/store/store";

	console.log("On arrive dans le Layout");

	import {
		isGoogleAuthActivated,
		qrGoogle,
		userLogin,
		userId,
		actualUsername,
	} from "$lib/store/store";
	import { authentificated } from "$lib/store/store";

	let login: any;
	$: qrCode = "";

	// import -[ Value ]- Authentification : Condition Acces Espace User
	import Modal from "$lib/modals/Modal.svelte";
	import GoogleAuth from "$lib/auth/GoogleAuth.svelte";
	import LoginFortyTwo from "$lib/Login/LoginFortyTwo.svelte";

	let auth: boolean = false;
	authentificated.subscribe((a) => {
		auth = a;
	});

	let ImgQrCode: string = "";
	qrGoogle.subscribe((a) => {
		ImgQrCode = a;
	});

	let googleActivated = false;
	isGoogleAuthActivated.subscribe((a) => {
		googleActivated = a;
	});

	function connectSocket(id42: number) {
		const socket = io("http://localhost:3001", {
			withCredentials: true,
			extraHeaders: {
				Accept: "abcd",
			},
			query: {
				id42: id42,
			},
		});
		$session = socket;
	}

	async function getUserInfo(jwt: string): Promise<number> {
		try {
			const response = await fetch("http://localhost:3000/user/profile", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
			});
			console.log(" -[ Profile ]- response: ", response);
			if (response.ok) {
				const user = await response.json(); // Convertit la réponse JSON en objet JavaScript
				$user = user;
				userLogin.set(user.login);
				userId.set(user.id);
				actualUsername.set(user.userName);

				console.log("2fa Value from user: [ ", user.fa2, " ]");
				return user.id;
			} else {
				localStorage.clear();
				authentificated.set(false);
				return -1;
			}
		} catch (e) {
			console.log("err");
			return -1;
		}
	}

	if (auth === false) {
		//  *- [ Authentification ] -* { Local Storage }  via  URL
		onMount(async () => {
			// [ 1 ] Check si un Jwt est deja present Dans le LocalStorage du Browser
			const token = localStorage.getItem("jwt");
			if (token) {
				console.log("On a bien un JWT present dans le localStorage !");
				try {
					// TEST   ( debut )
					// TEST   ( fin )

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

						let id = await getUserInfo(token);
						if (id == -1) return;
						// Créer une connexion websocket si auth est ok
						connectSocket(id);

						goto("/");
					}
					// [ 1 - 3 ] Si Jwt non Valide par le Back, effacement
					else {
						console.log(
							"reponse du Backend ***[ BAD ]*** pour le JWT"
						);
						authentificated.set(false);
						localStorage.clear();
						goto("/");
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

					// [ 2 - 3 ] Si param 'JwT' Stockez le JWT dans le Local Storage et Donner Acces a Espace User
					if (jwt) {
						console.log("jwt: ", jwt);
						localStorage.setItem("jwt", jwt);
						authentificated.set(true);

						let id = await getUserInfo(jwt);
						if (id === -1) return;
						// Connexion socket
						connectSocket(id);
					}
					// [ 2 - 4 ] Cas ou Jwt Non present dans l'Url
					else {
						console.log("Paramètre URL 'jwt' non trouvé.");
					}
					// [ 2 - 5 ] Redirection Vers Le Home afin de relancer Verification
					goto("/");
				}
				// Verification si presence PARAM -[ QRCode ]- dans URL pour Auth Google
				// if (urlParams.has("qrcode")) {
				// 	qrCode = urlParams.get("qrcode");
				// 	login = await urlParams.get("login");
				// 	// const loginPromise = urlParams.get("login");
				// 	// login = await loginPromise;
				// 	console.log("-[ Verif QR Layout ]-   login: ", login);
				// 	console.log("-[ Verif QR Layout ]-   QrCode: ", qrCode);
				// 	//set a modal value to on
				// 	isGoogleAuthActivated.set(true);
				// 	qrGoogle.set(qrCode);
				// 	userLogin.set(login);
				// 	goto("/");
				// 	// la modal va afficher le QR et on submit du code POST Recupere le JWT
				// }
				if (urlParams.has("login")) {
					const loginPromise = urlParams.get("login");
					login = await loginPromise;
					userLogin.set(login);
					console.log("-[ Verif QR Layout ]-   login: ", login);
					const response = await fetch(
						`http://localhost:3000/auth/get_google_2fa/?login=${login}&qr=google`,
						{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
							},
						}
					);

					if (response.ok) {
						console.log("-[ Layout Get QR ]- OK");
						let res = await response.json();
						//console.log("-[ Enable 2fa ]-Response: ", res);
						isGoogleAuthActivated.set(true);
						// displayQr = true;
						qrGoogle.set(res.url);
						//console.log("-[ Enable 2fa]- qrSource: ", QrSource);
					} else {
						console.log("-[ Layout Get QR ]-  PROBLEME pas OK");
					}
				}
			}
		});
	}
</script>

<div class="w-full h-full">
	{#if !auth}
		<main class="w-full h-full">
			{#if googleActivated}
				<Modal>
					<GoogleAuth {login} QrCode={ImgQrCode} />
				</Modal>
			{:else}
				<LoginFortyTwo />
			{/if}
		</main>
	{:else}
		<header class="h-24 w-full bg-red-500">
			<Navigation />
		</header>
		<slot />
	{/if}
</div>

<!-- 
<script lang="ts">
	import "../app.css";
	import Navigation from "$lib/nav/Navigation.svelte";
	import Login42 from "$lib/login/Login42.svelte";
	import { errorMsg, openModal, showModal } from "$lib/store/ModalValues";
	import checkJWT from "$lib/auth/auth.svelte";

	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	// Connexion websocket + socket.io + user info globale
	import { io } from "socket.io-client";
	import { session, user } from "$lib/store/store";

	console.log("On arrive dans le Layout");

	import {
		isGoogleAuthActivated,
		qrGoogle,
		userLogin,
	} from "$lib/store/store";

	let login: any;
	$: qrCode = "";

	// import -[ Value ]- Authentification : Condition Acces Espace User
	import { authentificated } from "$lib/store/store";
	import Modal from "$lib/modals/Modal.svelte";
	import GoogleAuth from "$lib/auth/GoogleAuth.svelte";

	let auth: boolean = false;
	authentificated.subscribe((a) => {
		auth = a;
	});

	let ImgQrCode: string = "";
	qrGoogle.subscribe((a) => {
		ImgQrCode = a;
	});

	let googleActivated = false;
	isGoogleAuthActivated.subscribe((a) => {
		googleActivated = a;
	});

	function connectSocket(id42: number) {
		const socket = io("http://localhost:3001", {
			withCredentials: true,
			extraHeaders: {
				Accept: "abcd",
			},
			query: {
				id42: id42,
			},
		});
		$session = socket;
	}

	async function getUserInfo(jwt: string): Promise<number> {
		try {
			const response = await fetch("http://localhost:3000/user/profile", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
			});
			console.log(" -[ Profile ]- response: ", response);
			if (response.ok) {
				const user = await response.json(); // Convertit la réponse JSON en objet JavaScript
				$user = user;

				console.log("2fa Value from user: [ ", user.fa2, " ]");
				return user.id42;
			} else {
				localStorage.clear();
				authentificated.set(false);
				return -1;
			}
		} catch (e) {
			console.log("err");
			return -1;
		}
	}

	if (auth === false) {
		//  *- [ Authentification ] -* { Local Storage }  via  URL
		onMount(async () => {
			// [ 1 ] Check si un Jwt est deja present Dans le LocalStorage du Browser
			const token = localStorage.getItem("jwt");
			if (token) {
				console.log("On a bien un JWT present dans le localStorage !");
				try {
					// TEST   ( debut )
					// TEST   ( fin )

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
						goto("/");
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
				// Verification si presence PARAM -[ QRCode ]- dans URL pour Auth Google
				// if (urlParams.has("qrcode")) {
				// 	qrCode = urlParams.get("qrcode");
				// 	login = await urlParams.get("login");
				// 	// const loginPromise = urlParams.get("login");
				// 	// login = await loginPromise;
				// 	console.log("-[ Verif QR Layout ]-   login: ", login);
				// 	console.log("-[ Verif QR Layout ]-   QrCode: ", qrCode);
				// 	//set a modal value to on
				// 	isGoogleAuthActivated.set(true);
				// 	qrGoogle.set(qrCode);
				// 	userLogin.set(login);
				// 	goto("/");
				// 	// la modal va afficher le QR et on submit du code POST Recupere le JWT
				// }
				if (urlParams.has("login")) {
					const loginPromise = urlParams.get("login");
					login = await loginPromise;
					console.log("-[ Verif QR Layout ]-   login: ", login);
					const response = await fetch(
						`http://localhost:3000/auth/get_google_2fa/?login=${login}&qr=google`,
						{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
							},
						}
					);

					if (response.ok) {
						console.log("-[ Layout Get QR ]- OK");
						let res = await response.json();
						//console.log("-[ Enable 2fa ]-Response: ", res);
						isGoogleAuthActivated.set(true);
						// displayQr = true;
						qrGoogle.set(res.url);
						//console.log("-[ Enable 2fa]- qrSource: ", QrSource);
					} else {
						console.log("-[ Layout Get QR ]-  PROBLEME pas OK");
					}
				}
			}
		});
	}
</script>

<div>
	{#if !auth}
		<main>
			{#if googleActivated}
				<Modal>
					<GoogleAuth {login} QrCode={ImgQrCode} />
				</Modal>
			{:else}
				<Login42 />
			{/if}
		</main>
	{:else}
		<header class="h-24 w-full bg-red-500">
			<Navigation />
		</header>
		<slot />
	{/if}
</div>

<style>
</style> -->

<style>
	:global(body) {
		width: 100vw;
		height: 100vh;
	}
</style>
