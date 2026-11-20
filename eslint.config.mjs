import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // One-off Node setup scripts (CommonJS)
    "create-*.js",
    "setup-db.js",
    "scripts/**",
  ]),
  {
    // Landing is synced 1:1 from Lovable (scripts/sync-lovable.mjs). Its effects read
    // browser-only state (localStorage, matchMedia) on mount, which is intentional.
    files: ["src/components/landing/**"],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
]);

export default eslintConfig;
