import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";

export default defineConfig({
  output: "server",
  // 1. Ensure the adapter is configured correctly for Vercel's image optimization
  adapter: vercel({
    imagesConfig: {
      sizes: [320, 640, 1280],
      formats: ["image/avif", "image/webp"],
    },
  }),

  integrations: [svelte()],

  // 2. Explicitly tell Astro to use the Sharp service
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  vite: {
    plugins: [tailwindcss()],
  },
});