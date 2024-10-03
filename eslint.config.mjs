import globals from "globals";
import pluginJs from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tseslint from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: [
      "node_modules",
      "dist"
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      parser: tsParser
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Core recommended rules from ESLint
      ...pluginJs.configs.recommended.rules,
      // TypeScript recommended rules
      ...tseslint.configs.recommended.rules,

      // Custom rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_", // Ignore unused function arguments starting with "_"
          "varsIgnorePattern": "^_"  // Ignore unused variables starting with "_"
        }
      ],
      "@typescript-eslint/no-explicit-any": "warn", // Change this to "error" if you want stricter rules
    },
  }
];

