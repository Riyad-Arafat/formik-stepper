# Formik Stepper v3 Plan

## Purpose

This document is the working reference for Formik Stepper v3. It defines the product direction, delivery order, technical contracts, quality gates, and release criteria for a deliberate breaking release.

## Implementation boundary

The `demos/` application is a v2 reference and must remain unchanged until the complete v3 plan is implemented and its migration path is ready. During v3 implementation, validate library source with library-level checks only; update demos only in the dedicated documentation and migration phase.

## Progress tracker

- [x] Task 1 — Public API: **complete** (v2 migration fixture deferred to Task 5)
- [x] Task 2 — Validation and recovery: **complete**
- [x] Task 3 — Default UI system: **complete** (visual gallery and browser screenshots deferred to Task 5)
- [x] Task 4 — Accessibility contract: **complete** (manual screen-reader smoke test retained as a release gate)
- [x] Task 5 — Packaging and documentation: **complete** (responsive screenshot verification retained as a release gate)
- [ ] Task 6 — Release: **in progress** (CI, release gates, and playbook implemented; external migration and publishing remain)

### Post-plan enhancement batches

- [x] Shared accessible field feedback, helper text, required, disabled, and read-only states.
- [x] Add `TextAreaField`, `NumberField`, and `SwitchField` with tests, styles, documentation, and packed-consumer coverage.
- [x] Expand the documentation playground with every field, validation behavior, theme and surface controls, and synchronized copyable code.
- [ ] Add dedicated playground scenarios for branching, async guards and recovery, persistence, controlled navigation, headless render slots, and empty/completion states.
- [ ] Split field-level package entry points before adding another bundled field batch; the runtime JavaScript budget currently has 401 B of headroom.

## Product direction

Formik Stepper v3 will be an accessible, themeable workflow component rather than only a styled sequence of buttons. It will retain a fast default integration while giving product teams headless primitives and render slots for custom experiences.

```text
Formik + validation
       |
Headless step workflow
       |
Default accessible UI -- CSS tokens -- Consumer theme / render slots
```

### Principles

- Preserve entered values after validation or asynchronous navigation failures.
- Make the current step, progress, errors, and pending work clear to every user.
- Use stable step identifiers instead of array position as the source of workflow identity.
- Make accessibility a component contract, not consumer cleanup work.
- Support React 18 and 19.
- Keep the default UI polished but unopinionated: no bundled font, no global CSS leakage, and all visual choices exposed as tokens.
- Prefer composition and explicit adapters over hidden persistence, routing, or branching behavior.

### Default UI direction

The default visual language should be compact, technical, and calm: semantic color tokens, clear type hierarchy, visible focus, and motion only when it explains a state change.

```text
[ Account ] --- [ Address ] --- [ Confirm ]
  Complete         Current          Locked

Step 2 of 3
Where should we send your order?

[ Address line 1                         ]
[ City                                   ]

< Back                         Continue >
```

On small screens, replace the full horizontal rail with a concise step counter and progress bar. Do not compress labels until they are unreadable.

## Task 1: Define the v3 public API

**Status: complete.** Stable step IDs, controlled navigation props, the `StepperProvider` / `useStepper` workflow foundation, all planned render slots, the compatibility policy, and Task 1 navigation tests are implemented. The v2 migration fixture remains intentionally deferred to Task 5.

### Goal

Create a composable API that supports the default UI, custom rendering, conditional flows, and React 18/19 without exposing internal state mechanics.

### Implementation steps

1. Replace index-derived step identity with required stable `id` values.
2. Introduce `StepperProvider` and `useStepper` for workflow state.
3. Keep a simple default composition:

   ```tsx
   <FormikStepper initialStepId="account" onComplete={submit}>
     <FormikStep id="account" title="Account">...</FormikStep>
     <FormikStep id="address" title="Address">...</FormikStep>
   </FormikStepper>
   ```

4. Provide render slots for `StepIndicator`, `Navigation`, `ErrorSummary`, and `Progress`.
5. Support controlled navigation through `activeStepId` and `onStepChange`.
6. Publish a compatibility policy for React and Formik versions.

### Tests

1. Controlled and uncontrolled navigation.
2. Stable behavior when conditional steps appear or disappear.
3. Equivalent simple-form behavior for the supported v2 migration path.

### Acceptance criteria

- Consumers can use a complete default stepper with minimal configuration.
- Consumers can replace visual parts without forking the library.
- No consumer-facing workflow behavior depends on array position alone.

## Task 2: Build validation, navigation, and recovery primitives

**Status: complete.** Implemented behavior includes per-step Yup-compatible schemas, asynchronous forward and backward guards, duplicate-navigation protection, conditional forward branching, opt-in draft persistence with stale-step fallback, accessible validation feedback, visible error/pending step status, and actionable transition failure recovery with Retry and Dismiss controls.

### Goal

Make multi-step validation reliable for synchronous, asynchronous, and server-backed forms.

### Implementation steps

1. Support per-step schemas plus async `beforeNext` and `beforePrevious` guards.
2. Prevent duplicate transitions while validation or submission is pending.
3. Model step status as `upcoming`, `current`, `complete`, `error`, and `blocked`.
4. Show an optional error summary above the current step after failed navigation.
5. Move focus to the error-summary heading after failed Continue actions; link each item to its field.
6. Preserve values and give callers a retry-safe recovery path after failed async guards.
7. Add optional draft persistence through an explicit adapter, not implicit local-storage writes.
8. Support conditional branching with `nextStepId(values)`.

### Tests

1. Async validation races and duplicate Continue clicks.
2. Field errors, error summary, focus movement, and screen-reader announcements.
3. Conditional insertion/removal and back-navigation behavior.
4. Draft restore and corrupted-draft fallback.

### Acceptance criteria

- Failed validation never clears user input.
- Keyboard and screen-reader users get an actionable path to every invalid field.
- A repeated action cannot submit or transition twice.

## Task 3: Deliver the v3 default UI system

**Status: complete.** The default indicator supports numbered, progress, compact, and vertical variants. The tokenized styling foundation covers semantic state colors and surfaces, spacing, radii, motion, focus, control sizing, responsive rail collapse, reduced motion, and forced-colors mode. Pending navigation, validation and transition failures, completion, and empty workflows have customizable default states. Consumers can scope a branded implementation through `formClassName` or set tokens through `formStyle`. Default semantic colors pass automated WCAG AA contrast calculations. The visual gallery and browser screenshot matrix remain intentionally deferred to Task 5 so the `demos/` boundary is preserved.

### Goal

Ship a responsive, polished default experience that works in product forms and remains straightforward to theme.

### Implementation steps

1. Provide `numbered`, `progress`, `compact`, and `vertical` indicator variants.
2. Expose color, spacing, radius, border, shadow, motion, and control sizing through CSS custom properties.
3. Define state tokens such as `--fs-step-current`, `--fs-step-error`, and `--fs-focus-ring`.
4. Put progress context above active-step content on desktop.
5. Collapse the step rail into step context and progress on mobile.
6. Keep Back and Continue consistently positioned with a 44px minimum touch target.
7. Design loading, blocked, error, completion, empty, and reduced-motion states.
8. Publish a visual gallery for onboarding, checkout, application, and profile workflows.

### Tests

1. Visual-regression coverage for every state and variant.
2. Responsive checks at 375px, 768px, 1024px, and 1440px.
3. Contrast and keyboard-focus checks.

### Acceptance criteria

- No horizontal overflow at phone widths.
- Labels remain readable or intentionally collapse to progress context.
- A branded implementation is possible through tokens only.

## Task 4: Make accessibility a first-class contract

**Status: complete.** The default indicator uses navigation and ordered-list semantics, exposes the current step with `aria-current`, and announces complete, current, upcoming, error, and pending states without relying on color. One persistent atomic live region announces step changes, validation outcomes, pending work, and completion without competing status regions. Validation summaries receive focus after failed navigation and each error links back to and focuses its invalid field. Async transition failures focus their actionable alert, while Dismiss restores focus to the triggering action. Built-in controls connect visible and programmatic errors. The custom-renderer contract is documented in `docs/v3-accessibility.md`; keyboard-only flows and axe-core checks cover default, error, and completion states. Manual screen-reader testing remains a release verification gate rather than an implementation blocker.

### Goal

Ensure the default component is accessible and custom renderers have a clear semantic contract.

### Implementation steps

1. Use semantic navigation and ordered step structure.
2. Mark the active step with `aria-current`.
3. Keep future steps non-interactive unless navigation policy allows them.
4. Announce validation and transition outcomes with an `aria-live` status region.
5. Connect inline errors to fields with `aria-describedby`.
6. Retain visible focus and avoid moving focus during blur validation.
7. Respect `prefers-reduced-motion`.
8. Document all required ARIA props and callbacks for custom slots.

### Tests

1. Testing Library role- and label-based tests.
2. Keyboard-only navigation tests.
3. Automated accessibility checks plus manual screen-reader smoke tests.
4. Focus restoration after validation and asynchronous navigation failures.

### Acceptance criteria

- The default implementation passes the agreed automated accessibility suite.
- Custom UI renderers have documented semantic requirements.
- Error feedback is never color-only or toast-only.

## Task 5: Modernize package architecture and documentation

**Status: complete.** The package builds bundled ESM with declarations and explicit root, core, default UI, persistence, and CSS entry points. Source imports name their real `.ts` and `.tsx` files for maintainability; TypeScript rewrites JavaScript output and a focused build step rewrites declaration-only output to native-ESM `.js` specifiers. JavaScript imports no longer load CSS implicitly, enabling SSR-safe and headless imports. A repeatable package smoke test verifies every export target, server-side ESM imports, explicit CSS loading, native-ESM declaration specifiers, React 19-compatible `React.JSX` types, and initial runtime/core size budgets. Fresh React 18 and React 19 fixtures install the packed tarball, compile its public declarations, resolve its subpath exports, and server-render the default stepper. The React 19 fixture uses `skipLibCheck` only because Formik 2.4.6 still exposes the removed global `JSX` namespace; formik-stepper declarations are scanned independently and its public usage is compiled in the fixture. The v2-to-v3 migration guide and API matrix document the required stable IDs, CSS entry change, indicator/completion behavior, optional APIs, and why step-ID migration is intentionally manual. Draft release notes enumerate breaking changes and prerelease work. The package-size report compares the current artifact with the published v2.2.5 tarball and records both JavaScript savings and intentional CSS growth. A standalone documentation workbench under `docs/playground` renders the real v3 components with live workflow, indicator, theme, and integration-code controls for onboarding, checkout, application, and profile examples. Its production build is verified independently without modifying `demos/`. Browser screenshot verification remains explicitly open in the release checklist because no browser automation surface was available during this batch.

### Goal

Make v3 easy to adopt, efficient to ship, and practical to migrate to.

### Implementation steps

1. Publish tree-shakeable core, default UI, styles, and optional persistence exports.
2. Provide ESM, declarations, and explicit CSS entry points.
3. Prevent bundled fonts and global CSS leakage.
4. Build a documentation playground with live editable examples.
5. Publish a v2-to-v3 API matrix, migration guide, and release notes.
6. Write codemods only for safe mechanical changes; document manual behavior migrations separately.
7. Add package-size budgets and fresh-consumer smoke tests.

### Tests

1. React 18 and 19 consumer fixtures.
2. ESM import, declarations, CSS import, and SSR-safe import behavior.
3. Packed-tarball installation in a clean consumer fixture.
4. Bundle-size comparison against v2.

### Acceptance criteria

- A fresh consumer can install and render the default stepper from published artifacts.
- Consumers can import headless primitives without default CSS.
- v2 users have a documented migration path before v3 is released.

## Task 6: Release v3 safely

**Status: in progress.** Local and CI release gates now cover lint, tests, package construction, documentation build, and packed React 18/19 consumers. The release playbook defines alpha, beta, release-candidate, stable, rollback, migration-feedback, and draft v2-support procedures. Publishing, manual accessibility/responsive verification, and representative external migrations remain.

### Goal

Validate v3 with real v2 consumers before making it the supported major version.

### Implementation steps

1. Publish an alpha with the new API and default UI.
2. Recruit representative v2 consumers for migration feedback.
3. Publish beta after accessibility, package, and migration fixtures stabilize.
4. Freeze public API for a release candidate, allowing critical fixes only.
5. Release v3 with a maintained v2 migration guide and a stated v2 support window.

### Tests

1. Alpha checklist: basic form, async validation, mobile, keyboard, theming, React 18, and React 19.
2. Regression suite across documented examples.
3. Published-package smoke test in CI.

### Acceptance criteria

- At least two representative v2 apps migrate successfully.
- No unresolved critical accessibility or data-loss issue remains.
- Release notes identify all breaking behavior and migration actions.

## Delivery order

1. Public API and workflow-state contract.
2. Validation, branching, pending state, and recovery behavior.
3. Default UI and token system.
4. Accessibility hardening.
5. Documentation, examples, package architecture, and migration tools.
6. Alpha, beta, release candidate, and v3 release.

## Release verification checklist

- [x] React 18 and React 19 consumer fixtures pass.
- [ ] Default, headless, themed, conditional, and asynchronous examples pass.
- [ ] Keyboard and screen-reader smoke checks pass.
- [ ] Responsive visual checks pass.
- [x] Published package tarball installs cleanly.
- [x] Bundle-size budget passes.
- [x] v2 migration guide and breaking-change matrix are complete.
