import { defineConfig } from 'astro/config';
import syntaxTheme from "./src/assets/syntax.json";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    syntaxHighlight: "prism"
  },
  site: "https://www.fishersun.com"
});