import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter()
  },
  preprocess: vitePreprocess()
};
export default config;


// import adapter from '@sveltejs/adapter-auto';

// const config = {
//   kit: {
//     adapter: adapter(),
//   },
// };

// export default config;