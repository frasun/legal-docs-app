import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import critters from "astro-critters";
import compress from "astro-compress";
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({ config: { applyBaseStyles: false } }),
    image(),
    critters(),
    compress({
      img: false,
      svg: false,
    }),
  ],
  output: 'server',
  adapter: vercel(),
});
