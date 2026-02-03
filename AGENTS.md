# Repository Guidelines

## Project Structure & Module Organization

This is a small monorepo with three services:

- `storefront/`: Next.js storefront (App Router) in `storefront/src/`, static assets in `storefront/public/`, E2E tests in `storefront/e2e/`.
- `api/`: Medusa backend in `api/src/`, integration tests in `api/integration-tests/`.
- `cms/`: Strapi CMS in `cms/src/` and configuration in `cms/config/`.

Docs and planning live in `docs/` and `specs/`.

## Build, Test, and Development Commands

Run commands from each service directory:

- Storefront (`storefront/`)
  - `npm run dev` (port `8000`): local dev server
  - `npm run build` / `npm start`: production build/run
  - `npm run lint`: ESLint
  - `npm run test-e2e`: Playwright tests in `storefront/e2e`
- API (`api/`)
  - `yarn dev`: Medusa develop server
  - `yarn build` / `yarn start`: production build/run
  - `yarn test:unit`, `yarn test:integration:modules`: Jest test suites
  - `yarn db:init`: migrate + sync-links + seed (dev convenience)
- CMS (`cms/`)
  - `npm run develop` (port `1337`): Strapi dev server
  - `npm run build` / `npm run start`: build admin / run production

## Coding Style & Naming Conventions

- Use TypeScript in all services; prefer small, feature-focused modules (e.g. `storefront/src/modules/<feature>/`).
- Formatting: Prettier is configured in each service (use `npm run format:write` in `storefront/` when in doubt).
- Naming: components `PascalCase.tsx`, hooks `useThing.ts`, utilities `kebab-case.ts` or `camelCase` exports.

## Testing Guidelines

- Storefront: Playwright E2E tests go in `storefront/e2e/` and should be deterministic (no hard-coded timeouts; prefer `expect().toBeVisible()` + proper waits).
- API: Jest tests are split by script (`yarn test:unit` vs integration). Keep fixtures close to the test or under `api/integration-tests/`.

## Commit & Pull Request Guidelines

- Commit messages follow a Conventional Commits style: `feat(scope): ...`, `fix: ...`, `docs: ...`.
- PRs should include: a short description, linked issue/spec (if applicable), and screenshots/recordings for storefront UI changes. Note any env var changes explicitly.

## Security & Configuration Tips

- Never commit secrets. Use `.env.example` files as templates and keep real values in local `.env*` files.
- If you must add a new env var, update the relevant `.env.example` and document it in the PR.
