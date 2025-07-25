import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import { VitePluginRadar } from 'vite-plugin-radar';

dotenv.config();

const APP_PATH = process.env.APP_PATH || '/';

const INJECT_METADATA = {
  appName: '英傑大戦デッキシミュレーター',
  shortAppName: '英傑deck',
  description:
    'アーケードゲーム英傑大戦のデッキシミュレーターです。本ツールは個人が作成した非公式のツールです。',
  shortDescription: 'アーケードゲーム英傑大戦のデッキシミュレーターです。',
  url: `${
    process.env.GH_PAGES_URL || 'https://boushi-bird.github.io'
  }${APP_PATH}`,
  themeColor: '#003cc1',
};

export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
  },
  define: {
    BASE_DATA_URL: JSON.stringify(
      process.env.BASE_DATA_URL ||
        '/eiketsu-taisen-data/eiketsu_deck_data.json',
    ),
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          title: INJECT_METADATA.appName,
          shortTitle: INJECT_METADATA.shortAppName,
          description: INJECT_METADATA.description,
          ogpDescription: INJECT_METADATA.shortDescription,
          ogpImage: `${INJECT_METADATA.url}icons/icon-192.png`,
          url: INJECT_METADATA.url,
          themeColor: INJECT_METADATA.themeColor,
        },
      },
    }),
    VitePluginRadar({
      gtm: process.env.GOOGLE_TAG_MANAGER_CONTAINER_ID
        ? { id: process.env.GOOGLE_TAG_MANAGER_CONTAINER_ID }
        : undefined,
    }),
    VitePWA({
      manifest: {
        name: INJECT_METADATA.appName,
        short_name: INJECT_METADATA.shortAppName,
        description: INJECT_METADATA.shortDescription,
        start_url: `${APP_PATH}?source=pwa`,
        scope: APP_PATH,
        theme_color: INJECT_METADATA.themeColor,
        lang: 'ja',
        orientation: 'any',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        // デフォルトではSPA用に全パスがindex.htmlにルーティングされるのでルーティングされるパスを絞る
        navigateFallbackAllowlist: [
          new RegExp(`^${APP_PATH.replace(/\//g, '\\/')}$`),
          new RegExp(`^${APP_PATH.replace(/\//g, '\\/')}\\?.*$`),
        ],
        globIgnores: ['_includes/**', '_layouts/**', 'updateinfo.html'],
        runtimeCaching: [
          {
            urlPattern: /\.md5$/i,
            handler: 'NetworkFirst',
          },
          {
            urlPattern: /https:\/\/fonts\.googleapis\.com\/.*$/i,
            handler: 'NetworkFirst',
          },
          {
            urlPattern: /https:\/\/fonts\.gstatic\.com\/.*$/i,
            handler: 'NetworkFirst',
          },
          {
            urlPattern:
              /^https:\/\/image\.eiketsu-taisen\.net\/.*\.(:?jpg|png|gif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image.eiketsu-taisen.net',
              expiration: {
                maxAgeSeconds: 3 * 86400,
              },
            },
          },
        ],
      },
    }),
  ],
});
