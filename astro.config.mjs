import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from '@astrojs/vercel/serverless';
import { loadEnv } from "vite";
import mdx from "@astrojs/mdx";
import auth from "auth-astro";
import { sanityIntegration } from "@sanity/astro";
import * as Sentry from "@sentry/node";

// populate env vars to process.env *astro hack
const localEnv = loadEnv(import.meta.env.MODE, process.cwd(), "");
for (let [key, value] of Object.entries(localEnv)) {
  process.env[key] = value;
}

if (import.meta.env.VERCEL_ENV !== 'development') {
  Sentry.init({
    environment: import.meta.env.VERCEL_ENV
  });
}

const {
  SANITY_PROJECT,
  SANITY_DATASET,
  SANITY_TOKEN,
} = loadEnv(import.meta.env.MODE, process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    mdx(),
    auth(),
    sanityIntegration({
      projectId: SANITY_PROJECT,
      dataset: SANITY_DATASET,
      token: SANITY_TOKEN,
      apiVersion: '2023-10-02',
      useCdn: import.meta.env.MODE === 'production'
    })
  ],
  output: 'server',
  adapter: vercel(),
  vite: {
    optimizeDeps: {
      exclude: ["auth:config"]
    }
  }
});