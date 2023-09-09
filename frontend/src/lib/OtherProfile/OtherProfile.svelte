<script lang="ts">
	import { goto } from "$app/navigation";
	import { closeModal } from "$lib/store/ModalValues";
	import { onMount } from "svelte";

	export let username: string;

	let login: string;
	let pictureLink: string;
	let rank: string;
	let title: string;
	let win: number;
	let loose: number;

	let isFriend: boolean;
	let isPending: boolean;
	let isRequested: boolean;
	let hasBlocked: boolean;
	let isBlockedBy: boolean;

	// faire Fct import de Game History Dans onMount
	let games: any = [
		{
			player1: { userName: "Bob" },
			player2: { userName: "John" },
			player1Score: 3,
			player2Score: 2,
		},
		{
			player1: { userName: "Donald" },
			player2: { userName: "Bob" },
			player1Score: 3,
			player2Score: 2,
		},
		// ... Ajoutez d'autres parties au besoin
	];

	onMount(async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				goto("/");
			} else {
				console.log("-[ OtherProfile ]-  - username: ", username);
				const url = `http://localhost:3000/user/profileOther?username=${username}`;
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
					rank = user.rank;
					title = user.title;
					win = user.win;
					loose = user.loose;

					isFriend = user.isMyFriend;
					isPending = user.isInPending;
					isRequested = user.isInSentRequest;
					hasBlocked = user.isInBlockList;
					isBlockedBy = user.isInBlockedByList;
				}
			}
		} catch (e) {}
	});

	async function handleRefuseFriendRequest() {
		const jwt = localStorage.getItem("jwt");
		const data = { username: username };
		const response = await fetch(
			"http://localhost:3000/user/refuseFriendRequest",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data }),
			}
		);
		if (response.ok) {
			console.log("response { OK } du [ Add Friend ]");
		} else {
			console.log("response { NOT OK } du [ Add Friend ]");
		}
		closeModal();
		goto("/");
	}

	async function handleSendFriendRequest() {
		const jwt = localStorage.getItem("jwt");
		const data = { username: username };
		const response = await fetch(
			"http://localhost:3000/user/sendFriendRequest",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data }),
			}
		);
		if (response.ok) {
			console.log("response { OK } du [ Add Friend ]");
		} else {
			console.log("response { NOT OK } du [ Add Friend ]");
		}
		closeModal();
		goto("/");
	}

	async function handleAcceptFriend() {
		const jwt = localStorage.getItem("jwt");
		const data = { username: username };
		//console.log("-[ Add Friend ]- username sent: ", username);
		const response = await fetch("http://localhost:3000/user/addFriend", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});
		if (response.ok) {
			console.log("response { OK } du [ Add Friend ]");
		} else {
			console.log("response { NOT OK } du [ Add Friend ]");
		}
		closeModal();
		goto("/");
	}

	async function handleRemoveFriend() {
		const jwt = localStorage.getItem("jwt");
		const data = { username: username };
		//console.log("-[ Remove Friend ]- username sent: ", username);
		const response = await fetch(
			"http://localhost:3000/user/removeFriend",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data }),
			}
		);
		if (response.ok) {
			console.log("response { OK } du [ Remove Friend ]");
		} else {
			console.log("response { NOT OK } du [ Remove Friend ]");
		}
		closeModal();
		goto("/");
	}

	async function handleBlockUser() {
		const jwt = localStorage.getItem("jwt");
		const data = { username: username };
		//console.log("-[ Remove Friend ]- username sent: ", username);
		const response = await fetch("http://localhost:3000/user/blockUser", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});
		if (response.ok) {
			console.log("response { OK } du [ Block User ]");
		} else {
			console.log("response { NOT OK } du [ Block User ]");
		}
		closeModal();
		goto("/");
	}

	async function handleUnblockUser() {
		const jwt = localStorage.getItem("jwt");
		const data = { username: username };
		//console.log("-[ Remove Friend ]- username sent: ", username);
		const response = await fetch("http://localhost:3000/user/unblockUser", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});
		if (response.ok) {
			console.log("response { OK } du [ Unblock User ]");
		} else {
			console.log("response { NOT OK } du [ Unblock User ]");
		}
		closeModal();
		goto("/");
	}
</script>

<div class="profile-Page">
	<h1>That is * {username} * Profile Bro !</h1>
	<div>
		<img class="profile-pic" src={pictureLink} alt=": 🤖 👨🏻‍🌾 🍪 🤣 :" />
	</div>
	<div>
		<p>Login : {login}</p>
		<p>Name : {username}</p>
		<p>Total Won: {win} - {loose} :Lost</p>
		<p>Rank : {rank}</p>
		<p>Title: {title}</p>
	</div>
	{#if isFriend === true}
		<button
			on:click={() => {
				handleRemoveFriend();
			}}>undo Friendship</button
		>
	{:else if isPending === true}
		<button
			on:click={() => {
				handleAcceptFriend();
			}}>accept Friend</button
		>
		<button
			on:click={() => {
				handleRefuseFriendRequest();
			}}>Refuse Friendship</button
		>
	{:else if isRequested === false}
		<button
			on:click={() => {
				handleSendFriendRequest();
			}}>Send friend Request</button
		>
	{/if}
</div>
<div>
	{#if isBlockedBy === true}
		<p>You have been blocked By {username} !</p>
	{/if}
</div>
<div>
	{#if hasBlocked === true}
		<button
			on:click={() => {
				handleUnblockUser();
			}}>Unblock</button
		>
	{:else if hasBlocked === false}
		<button
			on:click={() => {
				handleBlockUser();
			}}>Block</button
		>
	{/if}
</div>
<div>
	<h1>Game History</h1>
	{#if games.length > 0}
		{#each games as game, i}
			<p>
				{game.player1.userName}
				{game.player1Score} vs {game.player2Score}
				{game.player2.userName}
			</p>
		{/each}
	{:else}
		<p>Aucune partie trouvée.</p>
	{/if}
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
