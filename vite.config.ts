import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import civetVitePlugin from '@danielx/civet/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [civetVitePlugin({ ts: 'preserve' }), tailwindcss(), sveltekit(), devtoolsJson()],
    server: { host: '0.0.0.0' }
});
