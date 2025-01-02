import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.browser },
    overrides: [
      {
        files: ["*.js"],
        excludedFiles: "*.index.js",
      },
    ],
  },
  pluginJs.configs.recommended,
];