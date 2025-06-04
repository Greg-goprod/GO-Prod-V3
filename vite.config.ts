import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Génération de rapport de bundle pour l'analyse
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    // Configuration PWA pour le offline et l'installation
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'GO-PROD v3',
        short_name: 'GO-PROD',
        description: 'Application de gestion d\'événements',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimisations pour la production
    target: 'esnext',
    minify: 'terser',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Stratégie de chunking pour optimiser le cache
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['./src/components/ui'],
          utils: ['./src/lib/utils.ts'],
          supabase: ['@supabase/supabase-js'],
          zustand: ['zustand'],
        },
      },
    },
    // Compression Brotli pour réduire la taille des fichiers
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    // Optimisation du serveur de développement
    hmr: {
      overlay: true,
    },
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
  },
});
