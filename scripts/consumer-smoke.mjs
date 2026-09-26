import assert from "node:assert/strict";
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const projectRoot = resolve(import.meta.dirname, "..");
const temporaryRoot = mkdtempSync(resolve(tmpdir(), "formik-stepper-consumers-"));
const packageDirectory = resolve(temporaryRoot, "package");
const npmCache = resolve(temporaryRoot, "npm-cache");

const run = (command, args, cwd) => {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    throw new Error(
      [
        `Command failed: ${command} ${args.join(" ")}`,
        result.stdout,
        result.stderr,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }

  return result.stdout;
};

const fixtures = [
  {
    name: "react-18",
    react: "18.3.1",
    reactTypes: "18.3.12",
    reactDomTypes: "18.3.1",
  },
  {
    name: "react-19",
    react: "19.3.0",
    reactTypes: "19.3.0",
    reactDomTypes: "19.3.0",
  },
];

const runtimeFixture = `
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { FormikStep, FormikStepper } from "formik-stepper";
import { StepperProvider, useStepper } from "formik-stepper/core";
import { ErrorSummary } from "formik-stepper/default";
import { DraftPersistence } from "formik-stepper/persistence";

assert.equal(typeof StepperProvider, "function");
assert.equal(typeof useStepper, "function");
assert.equal(typeof ErrorSummary, "function");
assert.equal(typeof DraftPersistence, "function");

const markup = renderToString(
  React.createElement(
    FormikStepper,
    { initialValues: { email: "" }, onSubmit: async () => {} },
    React.createElement(
      FormikStep,
      { id: "account", label: "Account" },
      React.createElement("label", null, "Email", React.createElement("input", { name: "email" })),
    ),
    React.createElement(
      FormikStep,
      { id: "confirm", label: "Confirm" },
      React.createElement("p", null, "Confirm details"),
    ),
  ),
);

assert.match(markup, /Account/);
assert.match(markup, /Email/);
assert.doesNotMatch(markup, /Confirm details/);
console.log("SSR consumer render passed.");
`;

const typeFixture = `
import type { FormikStepperProps } from "formik-stepper/default";
import type { StepperContextValue } from "formik-stepper/core";
import type { StepperDraftAdapter } from "formik-stepper/persistence";

const adapter: StepperDraftAdapter = {
  load: () => ({ activeStepId: "account", values: { email: "" } }),
  save: () => undefined,
};

const initialStep: FormikStepperProps["initialStepId"] = "account";
const goToStep: StepperContextValue["goToStep"] = () => undefined;

void adapter;
void initialStep;
void goToStep;
`;

try {
  mkdirSync(packageDirectory, { recursive: true });
  mkdirSync(npmCache, { recursive: true });

  const packOutput = run(
    "npm",
    [
      "pack",
      "--json",
      "--pack-destination",
      packageDirectory,
      "--cache",
      npmCache,
    ],
    projectRoot,
  );
  const packResult = JSON.parse(packOutput);
  const packMetadata = Array.isArray(packResult)
    ? packResult[0]
    : Object.values(packResult)[0];
  assert.ok(packMetadata?.filename, "npm pack did not report a tarball filename");
  const { filename } = packMetadata;
  const tarball = resolve(packageDirectory, filename);

  for (const fixture of fixtures) {
    const fixtureDirectory = resolve(temporaryRoot, fixture.name);
    mkdirSync(fixtureDirectory, { recursive: true });
    cpSync(tarball, resolve(fixtureDirectory, basename(tarball)));

    writeFileSync(
      resolve(fixtureDirectory, "package.json"),
      JSON.stringify(
        {
          private: true,
          type: "module",
          dependencies: {
            "@types/react": fixture.reactTypes,
            "@types/react-dom": fixture.reactDomTypes,
            "formik-stepper": `file:./${basename(tarball)}`,
            formik: "2.4.6",
            react: fixture.react,
            "react-dom": fixture.react,
            typescript: "6.0.3",
          },
        },
        null,
        2,
      ),
    );
    writeFileSync(resolve(fixtureDirectory, "runtime.mjs"), runtimeFixture);
    writeFileSync(resolve(fixtureDirectory, "types.ts"), typeFixture);
    writeFileSync(
      resolve(fixtureDirectory, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            lib: ["DOM", "ES2022"],
            module: "NodeNext",
            moduleResolution: "NodeNext",
            noEmit: true,
            // Formik 2.4 still references the global JSX namespace removed by
            // React 19 types. Public formik-stepper declarations are checked
            // separately by the package smoke test.
            skipLibCheck: fixture.name === "react-19",
            strict: true,
            target: "ES2022",
          },
          include: ["types.ts"],
        },
        null,
        2,
      ),
    );

    run(
      "npm",
      ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--cache", npmCache],
      fixtureDirectory,
    );
    run("npm", ["exec", "tsc", "--", "--noEmit"], fixtureDirectory);
    run("node", ["runtime.mjs"], fixtureDirectory);

    const installedPackage = JSON.parse(
      readFileSync(
        resolve(fixtureDirectory, "node_modules/formik-stepper/package.json"),
        "utf8",
      ),
    );
    assert.ok(installedPackage.exports["./styles.css"]);
    assert.ok(installedPackage.exports["./core"]);

    console.log(`${fixture.name} packed-consumer fixture passed.`);
  }
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
