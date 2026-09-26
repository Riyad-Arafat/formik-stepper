import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  resolve(process.cwd(), "src/stepper/styles.css"),
  "utf8",
);

const token = (name: string) => {
  const match = stylesheet.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Missing color token: ${name}`);
  return match[1];
};

const luminance = (hex: string) => {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4),
    );
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

const contrast = (first: string, second: string) => {
  const [lighter, darker] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
};

describe("default theme contract", () => {
  it.each([
    "--fs-color-text",
    "--fs-color-muted",
    "--fs-step-current",
    "--fs-step-complete",
    "--fs-step-error",
    "--fs-step-blocked",
  ])("keeps %s at WCAG AA text contrast against the surface", (name) => {
    expect(contrast(token(name), token("--fs-color-surface"))).toBeGreaterThanOrEqual(
      4.5,
    );
  });
});
