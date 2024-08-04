import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/dashboard/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {

    },
  },
  plugins: [
    require('daisyui'), require("@tailwindcss/forms")({
      strategy: "class",
    })
  ],
  daisyui: {
    themes: ["light"],
  },
};
export default config;
