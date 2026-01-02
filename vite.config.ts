import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import civetVitePlugin from '@danielx/civet/vite';
import { defineConfig } from 'vite';
import svg from '@poppanator/sveltekit-svg';

export default defineConfig({
    plugins: [
        civetVitePlugin({ ts: 'preserve' }),
        tailwindcss(),
        sveltekit(),
        devtoolsJson(),
        svg({
            includePaths: ['./src/lib/svg/'],
            svgoOptions: {
                multipass: true,
                plugins: [
                    { name: 'preset-default' },
                    { name: 'removeAttrs', params: { attrs: '(width|height)' } }
                ]
            }
        })
    ],
    server: { host: '0.0.0.0' }
});
