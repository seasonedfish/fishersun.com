import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";
import type { PluginAPI } from "tailwindcss/types/config";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			// https://tailwindcss.com/docs/typography-plugin#customizing-the-css
			typography: (theme: PluginAPI["theme"]) => ({
				DEFAULT: {
					css: {
						lineHeight: 1.5,
						code: {
							backgroundColor: theme("colors.neutral.100"),
							borderRadius: "3px",
							padding: ".1rem",
							fontWeight: "400",
						},
						// Remove backticks from inline code
						// https://github.com/tailwindlabs/tailwindcss-typography/issues/18
						"code::before": {
							content: '""',
						},
						"code::after": {
							content: '""',
						},
						// Remove quotes from blockquote
						// https://github.com/tailwindlabs/tailwindcss-typography/issues/66#issuecomment-1754429609
						"blockquote p:first-of-type::before": false,
						"blockquote p:first-of-type::after": false,
						"blockquote": {
							fontStyle: "normal",
						},
						maxWidth: "none",
					},
				},
			}),
		},
		fontFamily: {
			sans: ["Inter", "Adwaita Sans", "BlinkMacSystemFont", "Helvetica Neue", "Helvetica", "Arial", "Roboto", "sans-serif"],
			heading: ["Bitter Pro", ...defaultTheme.fontFamily.serif],
			mono: [...defaultTheme.fontFamily.mono]
		},
	},
	plugins: [typography],
};
