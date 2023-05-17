import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import critters from "astro-critters";
import compress from "astro-compress";
import vercel from '@astrojs/vercel/serverless';
import { loadEnv } from "vite";

// populate env vars to process.env *astro hack
import mdx from "@astrojs/mdx";
const localEnv = loadEnv(import.meta.env.MODE, process.cwd(), "");
for (let [key, value] of Object.entries(localEnv)) {
  process.env[key] = value;
}


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
    // }), image(), critters(), compress({
  }), image(), compress({
    img: false,
    svg: false
  }), mdx()],
  output: 'server',
  adapter: vercel()
});