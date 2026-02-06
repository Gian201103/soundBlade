import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'soundBlade',
                short_name: 'soundBlade',
                description: 'Chirurgia audio nel browser',
                theme_color: '#121212',
                icons: [
                    { src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f52a.png', sizes: '72x72', type: 'image/png' },
                    { src: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/512x512/1f52a.png', sizes: '512x512', type: 'image/png' }
                ]
            }
        })
    ],
    server: {
        headers: {
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Opener-Policy': 'same-origin',
        }
    }
});