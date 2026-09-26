import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(
  readFileSync(resolve(projectRoot, "package.json"), "utf8"),
);

const expectedExports = [
  ".",
  "./core",
  "./default",
  "./persistence",
  "./styles.css",
];

for (const exportName of expectedExports) {
  assert.ok(
    packageJson.exports[exportName],
    `Missing package export: ${exportName}`,
  );
}

const exportTargets = Object.values(packageJson.exports).flatMap((entry) =>
  typeof entry === "string" ? [entry] : Object.values(entry),
);

for (const target of new Set(exportTargets)) {
  assert.ok(
    existsSync(resolve(projectRoot, target)),
    `Package export target does not exist: ${target}`,
  );
}

const runtimeEntries = ["index.js", "core.js", "default.js", "persistence.js"];

const collectFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });

for (const declaration of collectFiles(resolve(projectRoot, "dist")).filter(
  (file) => file.endsWith(".d.ts"),
)) {
  const source = readFileSync(declaration, "utf8");
  assert.doesNotMatch(
    source,
    /(?<!React\.)\bJSX\./,
    `${declaration} uses the React 19-incompatible global JSX namespace`,
  );
  assert.doesNotMatch(
    source,
    /(?:from|import) ["']\.\.?\/(?![^"']+\.js["'])/,
    `${declaration} contains an extensionless ESM import`,
  );
}

await Promise.all(
  runtimeEntries.map((entry) =>
    import(pathToFileURL(resolve(projectRoot, "dist", entry)).href),
  ),
);

for (const entry of runtimeEntries) {
  const source = readFileSync(resolve(projectRoot, "dist", entry), "utf8");
  assert.doesNotMatch(
    source,
    /\.css(?:["'])/,
    `${entry} must not import CSS implicitly`,
  );
}

const aggregateStyles = readFileSync(
  resolve(projectRoot, "dist/styles.css"),
  "utf8",
);
assert.match(aggregateStyles, /\.\/stepper\/styles\.css/);
assert.match(aggregateStyles, /\.\/style\.css/);

const javascriptFiles = [
  ...runtimeEntries.map((entry) => resolve(projectRoot, "dist", entry)),
  ...readdirSync(resolve(projectRoot, "dist/chunks"), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
    .map((entry) => resolve(projectRoot, "dist/chunks", entry.name)),
];
const runtimeBytes = javascriptFiles.reduce(
  (total, file) => total + statSync(file).size,
  0,
);
const coreBytes = statSync(resolve(projectRoot, "dist/core.js")).size;

assert.ok(
  runtimeBytes <= 32_000,
  `Runtime JavaScript size ${runtimeBytes} B exceeds the 32,000 B budget`,
);
assert.ok(
  coreBytes <= 512,
  `Core entry size ${coreBytes} B exceeds the 512 B budget`,
);

console.log(
  `Package smoke passed (${runtimeBytes} B runtime JavaScript, ${coreBytes} B core entry).`,
);
