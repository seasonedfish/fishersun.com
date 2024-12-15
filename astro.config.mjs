import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import expressiveCode from "astro-expressive-code";
import nushu from "./src/assets/syntax.json"
import zenbones from "./src/assets/zenbones_light_default.json"

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
    expressiveCode({
      themes: [zenbones],
      frames: {
        extractFileNameFromCode: false,
      },
      styleOverrides: {
        borderRadius: "0.15rem",
        borderColor: "transparent",
        frames: {
          frameBoxShadowCssValue: "0 0 0"
        }
      }
    })
  ],
  site: "https://www.fishersun.com"
});