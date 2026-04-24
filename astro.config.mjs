import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [svelte()],
  
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop' 
    }
  },

  vite: {
    plugins: [tailwindcss()],
  },
});