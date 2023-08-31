<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	export let username: string;

	let login: string;
	let pictureLink: string;
	let friendStatus: string;

	onMount(async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				goto("/");
			} else {
				console.log("-[ OtherProfile ]-  - username: ", username);
				const url = `http://localhost:3000/user/profileOther?username=${username}`;
				//const url = `http://localhost:3000/user/profile`;
				const response = await fetch(url, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				});
				if (response.ok) {
					const user = await response.json(); // Convertit la réponse JSON en objet JavaScript
					console.log(" -[ Profile Other ]- User: ", user);
					login = user.login;
					pictureLink = user.avatar;
					username = user.username;

					friendStatus = user.friendStatus;
				}
			}
		} catch (e) {}
	});

	// async function handleRequestFriend(friendUserName: string) {
	// 	const jwt = localStorage.getItem("jwt");
	// 	const data = { requestedUser: friendUserName };
	// 	const response = await fetch(
	// 		"http://localhost:3000/user/requestFriend",
	// 		{
	// 			method: "POST",
	// 			headers: {
	// 				Authorization: `Bearer ${jwt}`,
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({ data }),
	// 		}
	// 	);

	// 	if (response.ok) {
	// 		console.log("-[ Friend Request sent ]- ");
	// 	}
	// 	goto("/");
	// }

	// async function handleSendFriendRequest() {
	// 	const jwt = localStorage.getItem("jwt");
	// 	const data = { login: login };
	// 	const response = await fetch("http://localhost:3000/auth/changeImage", {
	// 		method: "POST",
	// 		headers: {
	// 			Authorization: `Bearer ${jwt}`,
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify({ data }),
	// 	});

	// 	if (response.ok) {
	// 		console.log("-[ Change Image ]- New Image bien Set");
	// 	}
	// 	goto("/");
	// }
</script>

<div class="profile-Page">
	<h1>That is * {username} * Profile Bro !</h1>
	<div>
		<img class="profile-pic" src={pictureLink} alt=": 🤖 👨🏻‍🌾 🍪 🤣 :" />
	</div>
	<div>
		<p>Login : {login}</p>
		<p>Name : {username}</p>
	</div>
</div>

<!-- Faire affichage de differents buttons en fonction du friend status -> sendFriendRequest,
Unfriend -->

<style>
	button {
		color: red;
		border-width: 1px;
		border-radius: 25%;
		border-color: red;
		margin-left: 2px;
		margin-right: 2px;
	}
	.profile-Page {
		/* height: 2500px;
		width: 2500px; */
		align-items: center;
	}
	.profile-pic {
		max-width: 20%;
		max-height: 20%;
		border-radius: 50%;
	}
	img {
		align-items: center;
		position: relative;
		border-color: black;
		border-width: 2px;
	}
	p {
		margin-top: 2px;
	}
	h1 {
		align-items: center;
		color: black;
	}
</style>
