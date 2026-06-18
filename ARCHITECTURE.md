# Architecture

## Overview

A Backstage monorepo containing three plugins: Visual Qontract (App Interface data), WebRCA
Frontend (incident viewing), and WebRCA Backend (API). Uses Yarn workspaces with the Backstage CLI.

## Module Structure

```text
plugins/
  visual-qontract/    # Frontend plugin — entity cards and page components
  webrca-frontend/    # Frontend plugin — WebRCA incident viewer
  webrca-backend/     # Backend plugin — WebRCA API integration
packages/
  app/                # Backstage app shell for local development
  backend/            # Backstage backend for local development
examples/             # Example catalog entities
build/                # Build scripts and configuration
Makefile              # Dynamic plugin build targets
```

## Key Design Decisions

- **Multi-plugin monorepo.** Three related plugins share one dev environment. This simplifies
  cross-plugin development (e.g., WebRCA frontend depends on WebRCA backend) while allowing
  independent dynamic plugin packaging.
- **Entity card architecture.** Visual Qontract components are designed as entity page cards that
  mount on catalog entry pages via annotations. Each card is independently mountable.
- **External data dependency.** The homepage components require the `inscope-resources` pod
  (a separate container providing news stories and other resources via HTTP on port 8000).
- **Make-based dynamic builds.** A Makefile wraps the Backstage CLI's dynamic plugin export for
  all three plugins, producing separate tarballs for each.

## Dependencies

- **Backstage CLI** (`@backstage/cli` ^0.35.4) — build and dev tooling
- **Playwright** — E2E testing
- **ESLint** — linting
- **inscope-resources** — external data provider container
