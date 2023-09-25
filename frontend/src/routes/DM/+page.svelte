<script lang="ts">
	import { onMount } from "svelte";
	import { session, user } from "$lib/store/store";
	import { browser } from "$app/environment";

	let rooms: Array<any> = [];
	let roomSelected: number = -1;
	let messages: Array<any> = [];

	let chatMessage: string = "";

	// TODO 1. send a message to a user with whom you never spoke before
	// TODO 2. search bar to find a user
	// TODO 3. when new message -> if that message room is opened, add it to the list of messages, if not, sort the list of rooms by last message date
	// TODO 4. notifications

	onMount(() => {
		if (!browser || !$session) return;

		// console.log($session.id);
		// console.log($user)

		$session.emit("getDmRooms");

		$session.on("repDmRooms", (data: any) => {
			rooms = data.rooms;
			console.log("repDmRooms:", rooms);
		});

		$session.on("repMessagesInDmRooms", (data: any) => {
			console.log("repMessagesInDmRooms:", data.messages);
			messages = data.messages;
		});

		$session.on("newMessage", (data: any) => {
			console.log(data);
			messages = [...messages, data];
		});

		return () => {
			$session.off("repDmRooms");
			$session.off("repMessagesInDmRooms");
		};
	});
</script>

<div class="w-full h-full flex">
	<div class="room-list">
		{#each rooms as room, i}
			<div
				class="room"
				on:click={() => {
					console.log("click");
					$session.emit("getMessagesInDmRoom", room.id);
					roomSelected = i;
				}}
			>
				<div class="room-name">
					{room.userOne.userName == $user.userName
						? room.userTwo.userName
						: room.userOne.userName}
				</div>
			</div>
		{/each}
	</div>

	{#if roomSelected !== -1}
		<div class="direct-chat">
			<div class="message-list overflow-y-scroll">
				{#each messages as msg}
					<div class="relative w-full h-40 p-2">
						<div
							class="message {msg.sendBy == $user.id42
								? 'right-0'
								: 'left-0'}"
						>
							{msg.message}
						</div>
					</div>
				{/each}
			</div>
			<div class="chat-wrapper">
				<textarea class="w-full h-full" bind:value={chatMessage} />
				<button
					class="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-blue-400"
					on:click={() => {
						$session.emit("sendMessage", {
							message: chatMessage,
							sendBy: $user.id42,
							sendTo:
								rooms[roomSelected].userOneId == $user.id42
									? rooms[roomSelected].userTwoId
									: rooms[roomSelected].userOneId,
						});
						chatMessage = "";
					}}>send</button
				>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.room-list {
		@apply flex flex-col w-1/4 h-full bg-blue-400 select-none;
	}

	.direct-chat {
		@apply flex flex-col w-3/4 h-full bg-green-300;
	}

	.message-list {
		@apply flex flex-col w-full h-4/5 bg-red-300 gap-5;
	}

	.message {
		@apply bg-amber-200 p-3 text-xs absolute top-0 h-full;
		max-width: 50%;
	}

	.chat-wrapper {
		@apply relative text-lg bg-yellow-50 h-1/5;
	}

	.room {
		@apply flex justify-center items-center gap-3 h-24 bg-blue-200 cursor-pointer hover:brightness-90;
	}
</style>
