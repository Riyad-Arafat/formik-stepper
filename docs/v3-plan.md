# Formik Stepper v3 Plan

## Purpose

This document is the working reference for Formik Stepper v3. It defines the product direction, delivery order, technical contracts, quality gates, and release criteria for a deliberate breaking release.

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

- [ ] React 18 and React 19 consumer fixtures pass.
- [ ] Default, headless, themed, conditional, and asynchronous examples pass.
- [ ] Keyboard and screen-reader smoke checks pass.
- [ ] Responsive visual checks pass.
- [ ] Published package tarball installs cleanly.
- [ ] Bundle-size budget passes.
- [ ] v2 migration guide and breaking-change matrix are complete.
