<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	let username: string;
	let pictureLink: string;
	onMount(async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				goto("/");
			} else {
				const response = await fetch(
					"http://localhost:3000/user/profile",
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					}
				);
				console.log(" -[ Profile ]- response: ", response);
				if (response.ok) {
					const user = await response.json(); // Convertit la réponse JSON en objet JavaScript
					console.log(" -[ Profile ]- User: ", user);
					username = user.userName;
					pictureLink = user.avatar;
				}
				//let user = await response();
			}
		} catch (e) {}
	});
	// src="images/backgroundImg.jpg"
</script>

<div class="profil-Page">
	<h1>That is * {username} * Profil Bro !</h1>
	<h3>You will get a Cookie if you are a Good Boy</h3>
	<div>
		<img src={pictureLink} alt="Images d'illustration : 🤖 👨🏻‍🌾 🍪 🤣" />
	</div>
</div>

<style>
	.profile-Page {
		/* height: 2500px;
		width: 2500px; */
		align-items: center;
	}
	img {
		align-items: center;
		position: relative;
	}
	h1 {
		align-items: center;
		color: black;
	}

	h3 {
		align-items: center;
		color: rgb(30, 30, 255);
	}
</style>
