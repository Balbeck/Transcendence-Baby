<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	// Imports -[ MODALS ]- ///////////////////////////
	import Modal from "$lib/modals/Modal.svelte";
	import { openModal, selectedPage } from "$lib/store/ModalValues";
	import { closeModal } from "$lib/store/ModalValues";
	import { showModal } from "$lib/store/ModalValues";
	import { authentificated } from "$lib/store/store";
	import OtherProfile from "$lib/OtherProfile/OtherProfile.svelte";
	let show_Modal: boolean;
	showModal.subscribe((a: boolean) => {
		show_Modal = a;
	});

	let selectedModal: string;
	selectedPage.subscribe((b: string) => {
		selectedModal = b;
	});
	///////////////////////////////////////////////////

	// Afficher la liste des user online
	// ajouter un bouton 'send request'

	// Afficher la liste des amis
	// ajouter bouton 'unfriend'

	// afficher la liste des amis en attente acceptation
	// ajouter bouton 'accept'

	//let users: string[];
	let onlineUsers: string[] = [];
	let friendsList: string[] = [];
	let onlineFriendsList: string[] = [];

	let inGameFriendsList: string[] = [];
	let inGameUsersList: string[] = [];

	let pendingList: string[] = [];
	let sentRequestsList: string[] = [];
	let usersIBlockedList: string[] = [];
	let usersWhoBlockedMeList: string[] = [];
	//let users: string[] = ["Henry", "john", "boby"];
	let userToDisplay: string;

	let onlineUserEmptyArray: boolean = false;
	let friendsListEmptyArray: boolean = false;
	let onlineFriendsEmptyArray: boolean = false;
	let pendingListEmptyArray: boolean = false;
	let sentRequestListEmptyArray: boolean = false;
	let usersIBlockedEmptyArray: boolean = false;
	let usersWhoBlockedMeEmptyArray: boolean = false;

	onMount(async () => {
		try {
			const jwt = localStorage.getItem("jwt");

			// Online Users
			const onlineUsers_url = "http://localhost:3000/auth/onlineUsers";
			const onlineUserResponse = await fetch(onlineUsers_url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
			});
			if (onlineUserResponse.ok) {
				onlineUsers = await onlineUserResponse.json();
				if (onlineUsers.length === 0) {
					onlineUserEmptyArray = true;
				}
				console.log("onlineUsers: ", onlineUsers);
			}

			// Pending List
			const pendingListResponse = await fetch(
				`http://localhost:3000/user/pendingList`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (pendingListResponse.ok) {
				pendingList = await pendingListResponse.json();
				if (pendingList.length === 0) {
					pendingListEmptyArray = true;
				}
				console.log("pendingList: ", pendingList);
			} else {
				localStorage.clear();
				authentificated.set(false);
				goto("/");
			}

			// Friends List
			const friendsListResponse = await fetch(
				`http://localhost:3000/user/friendsList`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (friendsListResponse.ok) {
				friendsList = await friendsListResponse.json();
				if (friendsList.length === 0) {
					friendsListEmptyArray = true;
				}
				console.log("friendsList: ", friendsList);
			}

			// Sent Requests List
			const sentRequestsListResponse = await fetch(
				`http://localhost:3000/user/sentRequestsList`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (sentRequestsListResponse.ok) {
				sentRequestsList = await sentRequestsListResponse.json();
				if (sentRequestsList.length === 0) {
					sentRequestListEmptyArray = true;
				}
				console.log("sendRequest List: ", sentRequestsList);
			}

			// Users I Blocked List
			const blockedUsersListResponse = await fetch(
				`http://localhost:3000/user/blockUserList`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (blockedUsersListResponse.ok) {
				usersIBlockedList = await blockedUsersListResponse.json();
				if (usersIBlockedList.length === 0) {
					usersIBlockedEmptyArray = true;
				}
				console.log("usersIblockedList: ", usersIBlockedList);
			}

			// Users Who Blocked Me
			const usersWhoBlockedMeListResponse = await fetch(
				`http://localhost:3000/user/blockedByList`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (usersWhoBlockedMeListResponse.ok) {
				usersWhoBlockedMeList =
					await usersWhoBlockedMeListResponse.json();
				if (usersWhoBlockedMeList.length === 0) {
					usersWhoBlockedMeEmptyArray = true;
				}
				console.log("usersWhoBlockedMeList: ", usersWhoBlockedMeList);
			}

			onlineFriendsList = friendsList.filter((friend) =>
				onlineUsers.includes(friend)
			);
			if (onlineFriendsList.length === 0) {
				onlineFriendsEmptyArray = true;
			}
		} catch (e) {
			console.log("Friend OnMount PB");
		}
	});

	async function handleSeeProfil(username: string) {
		//console.log("+page.Friends - username: ", username);
		userToDisplay = username;
		openModal("OtherProfile");
		goto("/Friends");
	}

	async function handleAcceptFriend(username: string) {
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

	async function handleRefuseFriendRequest(username: string) {
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

	async function handleRemoveFriend(username: string) {
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
</script>

<div>
	<h1>👨🏻‍🌾 Find friends 🕵️‍♂️ 💂‍♀️</h1>

	<div>
		{#if show_Modal}
			<div>
				<Modal>
					{#if selectedModal === "OtherProfile"}
						<OtherProfile
							username={userToDisplay}
							on:closeModal={closeModal}
						/>
					{/if}
				</Modal>
			</div>
		{:else}
			<div>
				<h2>Online Users</h2>
				{#if onlineUserEmptyArray === true}
					<p>Sorry Bro no one is connected !</p>
				{:else}
					{#each onlineUsers as user}
						<div class="user-card">
							<p>{user}</p>
							<button
								on:click={() => {
									handleSeeProfil(user);
								}}>See Profile</button
							>
						</div>
					{/each}
				{/if}

				<h2>Online Friends</h2>
				{#if onlineFriendsEmptyArray === true}
					<p>
						Sorry Bro your friends are not connected. Request new
						Friends !
					</p>
				{:else}
					{#each onlineFriendsList as user}
						<div class="user-card">
							<p>{user}</p>
							<button
								on:click={() => {
									handleSeeProfil(user);
								}}>See Profile</button
							>
						</div>
					{/each}
				{/if}

				<h2>Friends List</h2>
				{#if friendsListEmptyArray === true}
					<p>
						Sorry Bro, you are a lone wolf ! Try to make friends,
						request an online user !
					</p>
				{:else}
					{#each friendsList as friendUser}
						<div class="user-card">
							<p>{friendUser}</p>
							<button
								on:click={() => {
									handleSeeProfil(friendUser);
								}}>See Profile</button
							>
							<button
								on:click={() => {
									handleRemoveFriend(friendUser);
								}}>Undo Friendship</button
							>
						</div>
					{/each}
				{/if}

				<h2>Pending friend Request</h2>
				{#if pendingListEmptyArray === true}
					<p>Sorry Bro, no one wants to be your friend !</p>
				{:else}
					{#each pendingList as pendingUser}
						<div class="user-card">
							<p>{pendingUser}</p>
							<button
								on:click={() => {
									handleSeeProfil(pendingUser);
								}}>See Profile</button
							>
							<button
								on:click={() => {
									handleAcceptFriend(pendingUser);
								}}>Accept</button
							>
							<button
								on:click={() => {
									handleRefuseFriendRequest(pendingUser);
								}}>Refuse</button
							>
						</div>
					{/each}
				{/if}

				{#if sentRequestListEmptyArray === false}
					<h2>Waiting an answer from</h2>
					{#each sentRequestsList as requestedUser}
						<div class="user-card">
							<p>{requestedUser}</p>
							<button
								on:click={() => {
									handleSeeProfil(requestedUser);
								}}>See Profile</button
							>
						</div>
					{/each}
				{/if}

				{#if usersIBlockedEmptyArray === false}
					<h2>Users I Blocked</h2>
					{#each usersIBlockedList as blockedUser}
						<div class="user-card">
							<p>{blockedUser}</p>
							<button
								on:click={() => {
									handleSeeProfil(blockedUser);
								}}>See Profile</button
							>
						</div>
					{/each}
				{/if}

				{#if usersWhoBlockedMeEmptyArray === false}
					<h2>Users Who Blocked Me</h2>
					{#each usersWhoBlockedMeList as blockedUser}
						<div class="user-card">
							<p>{blockedUser}</p>
							<button
								on:click={() => {
									handleSeeProfil(blockedUser);
								}}>See Profile</button
							>
						</div>
					{/each}
				{/if}
			</div>
		{/if}
	</div>
	<div>
		<!-- svelte-ignore a11y-img-redundant-alt -->
		<img src="images/imgT3.jpg" alt="Image presentation" />
	</div>
</div>

<style>
	.user-card {
		display: flex;
		align-items: center;
		padding: 10px;
		border: 1px solid #ccc;
		margin-bottom: 10px;
	}

	button {
		margin-left: 10px;
		background-color: blue;
		color: aliceblue;
	}
	h2 {
		color: red;
		align-items: center;
	}
</style>
