// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import solidJs from "@astrojs/solid-js";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://muhammadswa.github.io/portfolio/",
  base: "/portfolio/",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [solidJs(), mdx()],
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Inter",
        cssVariable: "--font-inter",
        weights: ["600"],
      },
      {
        provider: fontProviders.google(),
        name: "Playfair Display",
        cssVariable: "--font-playfair-display",
        weights: ["600"],
      },
    ],
  },
});
