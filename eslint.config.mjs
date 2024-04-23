import * as queryPlugin from "@tanstack/eslint-plugin-query";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import drizzle from "eslint-plugin-drizzle";
import importPlugin from "eslint-plugin-import";
import solid from "eslint-plugin-solid";
import tailwindcss from "eslint-plugin-tailwindcss";

export default {
  files: ["**/*.ts", "**/*.tsx"],
  parser: {
    filePath: tsParser,
  },
  plugins: {
    "@typescript-eslint": tsPlugin,
    solid,
    tailwindcss,
    import: importPlugin,
    "@tanstack/eslint-plugin-query": queryPlugin,
    drizzle,
  },
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  lintingOptions: {
    rules: {
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/classnames-order": "off",
      "drizzle/enforce-delete-with-where": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:solid/recommended",
    "plugin:tailwindcss/recommended",
    "plugin:import/typescript",
    "plugin:drizzle/recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
};
