# Visual Qontract Dynamic Plugin

## Project Overview

A Backstage monorepo containing three RHDH plugins: Visual Qontract (App Interface data
visualization), WebRCA Frontend (incident viewing), and WebRCA Backend (API). Provides entity
page cards, homepage components, and standalone pages for Red Hat Developer Hub.

## Dependencies

- **Runtime:** Node.js 22+, Backstage CLI ^0.35.4, React, TypeScript
- **Test:** Jest, Playwright (E2E)
- **Lint:** ESLint
- **Build:** Make (dynamic plugin packaging)
- **External:** inscope-resources container (port 8000)
- **CI:** GitHub Actions (release.yml, test.yml)

## Development Commands

```sh
yarn install       # Install dependencies
yarn start         # Start dev server
yarn test          # Unit tests
yarn test:all      # All tests with coverage
yarn test:e2e      # E2E tests (Playwright)
yarn tsc           # Type checking
yarn lint          # Lint changed files
yarn lint:all      # Lint all files
make build-all     # Build all dynamic plugins
```

See [Development Setup][readme-dev] in the README for the inscope-resources pod setup.

## Architecture

Three plugins in `plugins/` (visual-qontract, webrca-frontend, webrca-backend) sharing a
Backstage monorepo. Each plugin is packaged independently as a dynamic plugin tarball. See
[ARCHITECTURE.md][architecture] for design decisions and module structure.

## Code Style

- **Linter:** ESLint (Backstage preset)
- **Language:** TypeScript (strict, via `tsconfig.json`)
- **Node.js:** 22+ required

## Common Mistakes

1. **Forgetting the inscope-resources pod.** The homepage components require the
   `inscope-resources` container running on port 8000. Without it, the homepage renders with
   empty data and no error messages.

2. **Running `yarn lint` expecting full coverage.** The default `lint` command only checks files
   changed since `origin/main`. Use `yarn lint:all` for the complete codebase.

3. **Building plugins individually instead of using Make.** The `make build-all` target handles
   all three plugins with correct dependency ordering. Building them individually may miss
   cross-plugin dependencies.

## Testing

```sh
yarn test          # Unit tests (Jest)
yarn test:all      # All tests with coverage
yarn test:e2e      # E2E tests (Playwright)
```

[readme-dev]: ./README.md#development-setup
[architecture]: ./ARCHITECTURE.md
