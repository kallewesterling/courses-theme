import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  { ignores: ["dist/**", "test/**"] },
  { files: ["**/*.{js,mjs,cjs}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },

  // Node.js config files need Node globals (module, require, process, …)
  {
    files: ["*.config.js", "*.config.mjs", "*.config.cjs"],
    languageOptions: { globals: globals.node },
  },

  // Skilljar runtime globals injected into the page at runtime.
  // courseDetails  – injected by the course description script block
  // resources      – injected on lesson pages
  {
    files: ["production/**/*.{js,mjs}"],
    languageOptions: {
      globals: {
        courseDetails: "readonly",
        resources: "readonly",
      },
    },
  },
]);
