import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  root: resolve(import.meta.dirname, "docs/playground"),
  build: {
    emptyOutDir: true,
    outDir: resolve(import.meta.dirname, "docs-dist"),
  },
});
