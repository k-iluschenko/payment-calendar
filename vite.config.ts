import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      mode: "development",
      base: "/",
      srcDir: "src",
      filename: "sw.ts",
      includeAssets: ["/favicon.png"],
      strategies: "injectManifest",
      manifest: {
        name: "pwa-payment-calendar",
        short_name: "pwa-ps",
        theme_color: "#4DBA87",
        icons: [
          {
            src: "./img/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "./img/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "./img/icons/android-chrome-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "./img/icons/android-chrome-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        start_url: ".",
        display: "standalone",
        background_color: "#000000"
      }
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
