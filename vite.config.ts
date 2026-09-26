import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        core: resolve(import.meta.dirname, "src/core.ts"),
        default: resolve(import.meta.dirname, "src/default.ts"),
        persistence: resolve(import.meta.dirname, "src/persistence.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "classnames",
        "formik",
        "react",
        "react-dom",
        "react-select",
      ],
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
      },
    },
  },
});
