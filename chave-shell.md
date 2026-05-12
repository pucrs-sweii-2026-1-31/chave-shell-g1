# chave-shell Specification

## Purpose

Transform `chave-shell` from the shell boilerplate into the host application that loads the authentication microfrontend described in `goal.md`.

## Starting Point

The starting point is the existing cloned shell boilerplate.

Observed local boilerplate role before the P1 work:

- Vite/React shell application.
- Placeholder dashboard or starter app behavior.
- No completed integration with the P1 auth microfrontend.
- No complete CI/release workflow for the final shell build.

## Target State

The repository must provide a lightweight shell host that:

- runs as a Vite React app
- owns the top-level browser router
- loads `chave-mfe-auth` through Module Federation
- routes auth-related paths to the remote auth app
- provides a simple dashboard/root page
- can be built and served in Docker
- has CI for build, Docker build, artifact upload, and release

## Routing Requirements

The shell must provide:

- `/` for a simple dashboard/home page
- `/*` fallback to the auth MFE remote

The dashboard should link to:

- `/login`
- `/register`
- `/profile`

The auth MFE owns the internal auth routes after the shell delegates rendering.

## Module Federation Requirements

The Vite federation configuration must:

- name the host `shell`
- declare a remote named `mfe_auth`
- read the remote URL from `MFE_AUTH_URL`
- default to `http://localhost:4001/assets/remoteEntry.js`
- share `react`, `react-dom`, and `react-router-dom`

The shell code must lazy-load:

```text
mfe_auth/AuthApp
```

## Docker Requirements

The Docker image must:

- install dependencies reproducibly
- build the Vite app
- serve the built `dist` output
- expose port `3000`
- accept the MFE remote URL as a build argument

## CI Requirements

The GitHub Actions workflow must run:

- `npm ci`
- build
- Docker build
- artifact upload
- tag-based release

If lint/typecheck/test scripts are added later, CI should include them.

## Documentation Requirements

The shell README must explain:

- purpose of the shell
- how it loads the auth MFE
- required environment/build variables
- local development commands
- Docker/Compose usage
- default local URLs

## Acceptance Criteria

This repository is ready when:

- Shell runs at `http://localhost:3000`.
- Shell can load `mfe_auth/AuthApp`.
- `/login`, `/register`, and `/profile` render through the auth MFE.
- Docker image builds.
- CI workflow exists and is realistic.
- Shell build passes.

