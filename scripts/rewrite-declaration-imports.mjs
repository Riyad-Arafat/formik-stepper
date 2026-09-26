import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const declarationRoot = resolve(import.meta.dirname, "../dist");

const collectDeclarations = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory()
      ? collectDeclarations(path)
      : path.endsWith(".d.ts")
        ? [path]
        : [];
  });

const outputExtensions = {
  ".cts": ".cjs",
  ".mts": ".mjs",
  ".ts": ".js",
  ".tsx": ".js",
};

for (const declaration of collectDeclarations(declarationRoot)) {
  const source = readFileSync(declaration, "utf8");
  const rewritten = source.replace(
    /(["'])(\.\.?\/[^"']+)\.(cts|mts|tsx|ts)\1/g,
    (_, quote, path, extension) =>
      `${quote}${path}${outputExtensions[`.${extension}`]}${quote}`,
  );

  if (rewritten !== source) {
    writeFileSync(declaration, rewritten);
  }
}
