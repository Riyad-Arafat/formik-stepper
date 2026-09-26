# Formik Stepper v3 Release Playbook

This playbook defines the release sequence for v3. It prepares commands and decision gates but does not authorize publishing. Every npm publish and dist-tag change is a deliberate maintainer action.

## Release channels

| Stage | Version example | npm tag | Entry criteria | Exit criteria |
| --- | --- | --- | --- | --- |
| Alpha | `3.0.0-alpha.0` | `next` | Public API and package artifact are ready for external migration | Representative consumers can install, render, and report actionable API feedback |
| Beta | `3.0.0-beta.0` | `next` | API shape is stable; critical alpha issues are resolved | Accessibility, package, migration, and responsive checks are complete |
| Release candidate | `3.0.0-rc.0` | `next` | Public API is frozen except for critical fixes | No unresolved release blockers; final artifact matches the reviewed candidate |
| Stable | `3.0.0` | `latest` | RC verification passes without artifact changes | npm metadata, docs, and support policy are confirmed after publish |

Do not reuse a published version. Increment the prerelease number for every artifact, even when the previous publish is deprecated.

## Automated verification

Run the complete release gate from a clean checkout:

```bash
yarn install --frozen-lockfile --non-interactive
yarn verify:release
```

`verify:release` performs:

1. ESLint with zero warnings.
2. Unit, workflow, keyboard, and automated accessibility tests.
3. Library build and package smoke checks.
4. Documentation playground production build.
5. Packed-tarball installation, declaration compilation, export resolution, and SSR rendering under React 18 and React 19.

CI repeats the local quality gates and packed-consumer tests in separate jobs on Node.js 22.

## Alpha checklist

### Artifact

- [ ] Set a unique `3.0.0-alpha.N` version without creating a Git tag yet.
- [ ] Run `yarn verify:release` from a clean checkout.
- [ ] Run `npm pack --dry-run --json` and review every included file.
- [ ] Confirm the packed and runtime sizes against [v3-package-size.md](./v3-package-size.md).
- [ ] Install the exact tarball into at least one representative v2 application.
- [ ] Confirm root, core, default, persistence, and stylesheet exports.

### Product behavior

- [ ] Complete a basic two-step form.
- [ ] Trigger field validation and follow every error-summary link.
- [ ] Exercise async success, cancellation, thrown failure, retry, and duplicate-click protection.
- [ ] Exercise conditional branching and removal of the active step.
- [ ] Restore a current draft and a draft containing a removed step ID.
- [ ] Verify completion and empty states.
- [ ] Verify default and token-themed UI.

### Accessibility and responsive behavior

- [ ] Complete keyboard-only forward, backward, error, retry, dismiss, and submit flows.
- [ ] Run manual VoiceOver and NVDA smoke checks, recording browser and version.
- [ ] Check 375px, 768px, 1024px, and 1440px viewport widths.
- [ ] Check 200% text zoom, reduced motion, and forced-colors mode.
- [ ] Store screenshots for each indicator variant and documented state.

### Documentation

- [ ] Review [v3-migration.md](./v3-migration.md) against a real v2 migration.
- [ ] Replace placeholders in [v3-release-notes.md](./v3-release-notes.md).
- [ ] Confirm the React/Formik compatibility table.
- [ ] Confirm every playground snippet compiles when copied into a fresh consumer.

## Publish procedure

Publishing is intentionally manual:

```bash
npm version 3.0.0-alpha.0 --no-git-tag-version
yarn verify:release
npm publish --tag next
```

Immediately after publishing:

1. Inspect `npm view formik-stepper@3.0.0-alpha.0 --json`.
2. Install by exact version into a fresh directory; do not validate only through the `next` tag.
3. Confirm `npm view formik-stepper dist-tags --json` keeps v2 on `latest` throughout alpha, beta, and RC.
4. Create the matching Git commit and annotated tag only after the npm artifact is confirmed.
5. Record verification evidence and known limitations in the GitHub release.

For stable release, publish `3.0.0` with `latest` only after the RC artifact has completed all release gates.

## Representative migration feedback

Recruit at least two v2 consumers with different needs:

- A simple default-styled linear form.
- A customized, conditional, or asynchronous workflow.

For each migration, record:

- Previous and new package versions.
- React, Formik, TypeScript, framework, and bundler versions.
- Time spent and manual changes required.
- Breaking behavior not already documented.
- Accessibility or responsive regressions.
- Whether the root or headless entry was used.

An issue is a release blocker when it can cause data loss, duplicate submission, inaccessible completion, an unresolvable package import, or an undocumented breaking workflow change.

## v2 support window

Recommended policy for approval before stable v3:

- Keep v2 on the npm `latest` tag until v3 stable is published.
- Provide six months of critical compatibility and security fixes after the v3 stable date.
- Do not add new features to v2 during that window.
- Publish the exact end date in the stable v3 release notes and v2 README.
- After the window, accept security reports but handle fixes according to severity and feasibility.

This policy is a draft until the maintainer confirms the stable release date and support commitment.

## Rollback and deprecation

Published npm versions are immutable. If a prerelease is defective:

1. Stop promotion to the next stage.
2. Deprecate the exact broken version with an actionable message and replacement version.
3. Publish a new prerelease number after verification.
4. Move `next` only after the replacement artifact passes the post-publish smoke check.
5. Document the affected versions and failure mode.

Do not unpublish a version except when npm policy, legal requirements, or a confirmed security incident requires it.

If stable v3 has a release-blocking defect, keep the last known-good version on `latest`, publish a patch candidate, and validate it through the same packed-consumer gate before changing dist-tags.
