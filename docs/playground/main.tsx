import React from "react";
import { createRoot } from "react-dom/client";
import { Playground } from "./Playground.tsx";
// @ts-expect-error CSS imports are handled by the bundler.
import "../../src/styles.css";
// @ts-expect-error CSS imports are handled by the bundler.
import "./playground.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("The documentation playground requires a #root element.");
}

createRoot(root).render(
  <React.StrictMode>
    <Playground />
  </React.StrictMode>,
);
