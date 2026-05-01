# Git Workflow

This repo uses a lightweight Git workflow while Teleseer is still MVP-first. The goal is to keep `main` usable, keep future-scope work easy to move later, and make each commit understandable without requiring a large process.

## Current Branch Policy

- Use `main` for MVP-facing work while the repo is early.
- Do not mix unrelated features, fixes, documentation, or experiments in one commit.
- Keep future-scope work documented and easy to move to a branch later.
- Treat uncommitted changes from other work as user-owned unless explicitly told otherwise.
- Before committing, check the full worktree and avoid staging unrelated files.

## Future Branch Policy

Use branches when feature scope becomes clearer or when work may not ship in the MVP.

- `feature/<area>-<capability>` for active feature work intended for the product path.
- `future/<area>-<capability>` for built-ahead work that may not ship in the MVP.
- `fix/<area>-<issue>` for targeted fixes.

Examples:

- `feature/viewer-sidebar-collapse`
- `future/alerts-federated-rule-sync`
- `fix/launcher-project-filtering`

## Commit Format

Use a conventional commit style:

```text
feat(scope): short description
fix(scope): short description
docs(scope): short description
refactor(scope): short description
chore(scope): short description
```

Recommended scopes:

- `viewer`
- `launcher`
- `alerting-modal`
- `sidebar`
- `timeline`
- `shared`
- `docs`
- `icons`

Examples:

```text
feat(sidebar): add collapsed viewer flyout behavior
fix(alerting-modal): prevent readonly madlib tooltip overlap
docs(docs): add git workflow guide
refactor(shared): reuse sidebar row helper in launcher
chore(icons): normalize protocol asset names
```

## Documentation Requirements

- Any shared component, styling contract, naming rule, or source-of-truth interaction change must update `Codex.md`.
- Any feature behavior or product source-of-truth change must update the relevant file under `docs/`.
- Any Figma-derived behavior must reference the exact Figma file and node when applicable.
- Any MVP versus future-scope split must be documented where the feature behavior is described.

## Pre-Commit Checklist

Run this checklist before making a commit:

1. Run `git status --short`.
2. Inspect changed files before staging.
3. Confirm no unrelated local edits are included.
4. Separate MVP-facing work from future-scope work when they are not the same deliverable.
5. Update `Codex.md` if a shared component or interaction contract changed.
6. Update the relevant `docs/` file if feature behavior changed.
7. Summarize tests or manual verification.
8. Write a conventional commit message.

If the worktree contains existing edits that are not part of the current task, leave them unstaged. For example, if `alerting-modal/style.css` is already modified for unrelated work, do not include it in a documentation commit.

## Commit Preparation For Codex

When Codex prepares a commit, it should:

- summarize changed files before staging;
- classify the work as MVP-facing, future-scope, fix, documentation, or maintenance;
- confirm required documentation updates;
- state what verification was run;
- stage only files that belong to the requested change.

Codex should not fully automate commits without human review because Teleseer work often involves Figma-derived behavior, dense UI state, and MVP/future-scope ambiguity.
