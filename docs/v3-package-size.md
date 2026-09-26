# Formik Stepper v3 Package-Size Baseline

This document records the initial v3 package budgets and compares them with the published `formik-stepper@2.2.5` artifact. It is a release reference, not a claim about the final application bundle produced by every consumer toolchain.

## Measurement method

- v2 source: the `formik-stepper@2.2.5` tarball downloaded from npm.
- v3 source: the local tarball produced by `npm pack --dry-run` after `yarn build`.
- Runtime JavaScript: the sum of all shipped `.js` files under `dist`.
- CSS: the sum of the concrete default field and stepper stylesheets. The 55-byte v3 aggregate `styles.css` file only contains two `@import` statements and is included in the displayed v3 CSS total.
- Package sizes: npm's packed and unpacked metadata.
- External peer dependencies such as React, React DOM, and Formik are excluded from both runtime totals.

The JavaScript totals are shipped-file measurements. Consumer bundlers may remove unused exports, combine chunks, and compress output differently.

## Baseline comparison

| Measurement | v2.2.5 | v3 current | Change |
| --- | ---: | ---: | ---: |
| Packed npm tarball | 13,595 B | 17,627 B | +4,032 B (+29.7%) |
| Unpacked npm package | 53,905 B | 64,582 B | +10,677 B (+19.8%) |
| Runtime JavaScript | 32,872 B | 26,507 B | −6,365 B (−19.4%) |
| Default CSS | 5,696 B | 13,142 B | +7,446 B (+130.7%) |
| Package entries | 43 | 37 | −6 |

The packed and unpacked package is larger because v3 publishes more declarations, explicit subpath entry points, richer default UI styles, and accessibility states. Runtime JavaScript is smaller because Vite bundles shared implementation into optimized chunks instead of publishing every TypeScript output module independently.

CSS growth is intentional but should remain visible. The v3 styles cover semantic tokens, four indicator variants, validation and transition states, responsive rail behavior, 44px controls, completion and empty states, reduced motion, and forced-colors support. Consumers using only `formik-stepper/core` load none of this CSS automatically.

## v3 budgets

The repeatable `yarn test:package` check currently enforces:

| Budget | Current | Limit |
| --- | ---: | ---: |
| All shipped runtime JavaScript | 26,507 B | 32,000 B |
| `core.js` entry | 115 B | 512 B |

The aggregate runtime limit leaves 5,493 B (17.2%) headroom. Raising either limit requires updating this document with the reason and reviewing the consumer impact.

The core entry imports only the shared workflow context chunk and does not import the default UI, React Select, persistence implementation, or CSS. This is the primary size-sensitive path for custom interfaces.

## Release interpretation

- The v3 default experience ships more CSS in exchange for the planned state, responsive, theme, and accessibility coverage.
- The v3 runtime JavaScript total remains below the published v2 total and below the automated budget.
- Headless consumers have a dedicated narrow entry and opt into styles explicitly.
- The React 18 and React 19 packed-consumer fixtures verify the measured artifact rather than repository source aliases.

Re-run the measurements immediately before each prerelease because chunk output and npm metadata can change with implementation or dependency updates.
