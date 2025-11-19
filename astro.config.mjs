import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

import expressiveCode from "astro-expressive-code";
import syntaxTheme from "./src/assets/syntax.json";

// https://astro.build/config
export default defineConfig({
  integrations: [
    sitemap(),
    expressiveCode({
      themes: [syntaxTheme],
      frames: {
        extractFileNameFromCode: false,
      },
      styleOverrides: {
        borderRadius: "0.15rem",
        borderColor: "transparent",
        frames: {
          frameBoxShadowCssValue: "0 0 0",
        },
        codeLineHeight: "1.4",
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://www.fishersun.com",
});
