<script lang="ts">
	import { goto } from "$app/navigation";
	import { closeModal } from "$lib/store/ModalValues";

	export let image: string;
	export let login: string;
	export let username: string;

	async function handleGarderImg() {
		const jwt = localStorage.getItem("jwt");
		const data = { login: login, img: image };
		const response = await fetch("http://localhost:3000/auth/changeImage", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});

		if (response.ok) {
			console.log("-[ Change Image ]- New Image bien Set");
		}
		closeModal();
		goto("/");
	}

	async function handleNo() {
		closeModal();
		goto("/");
	}
</script>

<div>
	<h3>That is your Cookie Bro, Enjoy !!!</h3>
	<div>
		<img class="profile-pic" src={image} alt=": 🤖 👨🏻‍🌾 🍪 🤣 :" />
	</div>
	<div>
		<p>Login : {login}</p>
		<p>Name : {username}</p>
	</div>
</div>
<div>
	<div>Make a Choice Son !</div>
	<button on:click={handleGarderImg}>Garder</button>
	<button on:click={handleNo}>C'est pas Top !</button>
</div>

<style>
	button {
		margin-left: 5px;
		border-width: 1px;
		border-color: brown;
		border-radius: 42%;
	}
	button:hover {
		color: brown;
	}
	div {
		grid-auto-flow: row;
	}

	.profile-pic {
		max-width: 42%;
		max-height: 42%;
		border-radius: 50%;
		align-items: center;
		position: relative;
		border-color: black;
		border-width: 2px;
	}
</style>
