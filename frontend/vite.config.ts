// // import { sveltekit } from '@sveltejs/kit/vite';
// // import { defineConfig } from 'vite';

// // export default defineConfig({
// // 	plugins: [sveltekit()]
// // });

// import { sveltekit } from '@sveltejs/kit/vite'
// //import { ViteDevServer, defineConfig } from 'vite'
// import { defineConfig } from 'vite'
// import type { ViteDevServer } from 'vite';
// import { Server } from 'socket.io'

// const webSocketServer = {
// 	name: 'webSocketServer',
// 	configureServer(server: ViteDevServer) {
// 		if (!server.httpServer) return

// 		const io = new Server(server.httpServer)

// 		io.on('connection', (socket) => {
// 			socket.emit('eventFromServer', 'Hello, World 👋')
// 		})
// 	}
// }

// export default defineConfig({
// 	plugins: [sveltekit(), webSocketServer],
// 	server: {
// 		fs: {
// 			// Allow serving files from the backend directory
// 			allow: ['./lib/game/game.schema.ts']
// 		}
// 	}
// });

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '0.0.0.0',
		port: 5173,
	},
	clearScreen: false,
});