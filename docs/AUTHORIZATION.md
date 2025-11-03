# KobKlein — Full Authorization & Ops Pack for Copilot

Use this pack to explicitly grant authority to GitHub Copilot Chat/Agents and to wire the repo, CI/CD, secrets, and rules so it can finish the build end‑to‑end.

---

## 1) AUTHORIZATION MEMO (place at `/docs/AUTHORIZATION.md`)

**Project:** KobKlein
**Owner:** Erickharlein Pierre (TechKlein LLC)
**Date:** 11/1/2025

### Grant of Authority

I, **Erickharlein Pierre**, as the authorized owner of the KobKlein codebase and related cloud resources, hereby grant **GitHub Copilot Chat/Agents** and any configured CI bots in this repository the authority to:

1. **Read/Write/Refactor Code** across all directories, create/delete/move files, and standardize structure.
2. **Create Issues/Projects/PRs**, assign labels/milestones, and update project boards.
3. **Run & Modify CI/CD**, including GitHub Actions workflows and environment configs.
4. **Create & Apply DB Migrations** (Supabase/Postgres), including RLS policies/tests.
5. **Integrate Secrets** via GitHub Environments/Secrets (never commit plaintext secrets).
6. **Provision & Configure Deployments** to the defined targets (Vercel, Render/Fly/Cloud Run, Supabase), respecting environment protections.
7. **Remove Mock/Demo Code** and replace with production‑grade implementations.
8. **Enforce Security Controls** (rate limits, headers, audits, tests) and fix failing checks.

### Constraints & Rules

* **Data protection:** Use only test data in non‑production environments unless explicitly allowed.
* **Secrets hygiene:** All keys/credentials **must** be stored in **GitHub Environments/Secrets** or provider vaults; never in code or PR descriptions.
* **Change control:** Copilot/agents **MUST** open PRs with checklists, tests, migration notes, and rollback steps. Auto‑merge allowed only after CI green and environment checks pass.
* **RLS first:** No endpoint or dashboard may ship without confirmed Row‑Level Security for relevant tables.
* **Minimal scope in prod:** Write access to **production** is gated by environment protection rules (see below).

**Signed:**
`/s/ Erickharlein Pierre`
**Contact:** [admin@techklein.com](mailto:admin@techklein.com)

---

## 2) RULES OF ENGAGEMENT (place at `/docs/ROE.md`)

1. **PR Protocol**

   * Each PR targets one numbered milestone (PR #1 Audit, #2 Env, …).
   * Include: Summary, Risk, Migration Plan, Rollback, Tests changed/added, and Screenshots for UI.
   * Link issues and update `/docs/CHECKLIST.md`.

2. **Security Requirements**

   * RLS tests for new tables, Zod validation on API, rate limit auth & payments, Helmet headers + CSP doc.
   * Secrets never printed in logs.

3. **Data & Migrations**

   * All schema changes via migration files.
   * Provide `supabase/seed.sql` with safe, realistic seed data (sanitized).

4. **Deployment Gates**

   * **preview**: auto‑deploy on PR.
   * **staging**: manual approval + smoke tests.
   * **production**: require owner approval + green CI + environment checks.

---

## 3) SECRETS & ACCESS CHECKLIST (place at `/docs/SECRETS_CHECKLIST.md`)

Create **GitHub Environments**: `preview`, `staging`, `production` and store secrets there (not at repo root). Suggested names:

**Supabase**

* `SUPABASE_URL`
* `SUPABASE_ANON_KEY` (client use, preview/staging only)
* `SUPABASE_SERVICE_ROLE_KEY` (server only; staging/prod)

**Stripe**

* `STRIPE_SECRET_KEY`
* `STRIPE_WEBHOOK_SECRET` (per environment)

**Twilio**

* `TWILIO_ACCOUNT_SID`
* `TWILIO_AUTH_TOKEN`
* `TWILIO_MESSAGING_SERVICE_SID`

**Firebase (optional – push/analytics only)**

* `FIREBASE_PROJECT_ID`
* `FIREBASE_CLIENT_EMAIL`
* `FIREBASE_PRIVATE_KEY` (multiline, escaped)

**Cloudflare**

* `CLOUDFLARE_API_TOKEN`
* `CLOUDFLARE_ACCOUNT_ID`

**Vercel**

* Add repo via Vercel; map env vars to match above.

**Render/Fly/Cloud Run (choose one)**

* Deployment token/API token per provider
* OIDC/IaC configured if applicable

**Other**

* `ENCRYPTION_KEY` (32‑byte base64) for app crypto
* `JWT_SECRET` if used server‑side (Supabase handles auth, but apps may use their own)

**GitHub Settings**

* Enable **Environments** with required reviewers for `production`.
* Enable **Protected Branches** on `main` (PRs required, CI must pass).
* **Allow auto‑merge** and **required status checks**.
* **Dependabot** security updates on.

---

## 4) CODEOWNERS & TEMPLATES (add under `/.github/`)

**`/.github/CODEOWNERS`**

```
# Core ownership
* @erickharlein @techklein-admin
/apps/web/ @erickharlein @techklein-admin
/apps/api/ @erickharlein @techklein-admin
/supabase/ @erickharlein @techklein-admin
/docs/ @erickharlein @techklein-admin
```

**`/.github/PULL_REQUEST_TEMPLATE.md`**

```
## Summary
- What changed and why

## Migration Plan
- DB migrations? yes/no
- Data backfill? yes/no
- Rollback steps

## Security
- RLS impacted? yes/no (tests updated)
- Secrets/permissions touched? list

## Tests
- Unit/Integration/E2E updated

## Screenshots
- if UI changed
```

**`/.github/ISSUE_TEMPLATE/feature.md`**

```
---
name: Feature Request
about: Propose a feature or improvement
---
**Goal**
**Acceptance Criteria**
**Security Implications**
**Testing Notes**
```

**`/.github/ISSUE_TEMPLATE/bug.md`**

```
---
name: Bug Report
about: Something isn't working
---
**Observed**
**Expected**
**Steps to Reproduce**
**Logs/Screenshots**
**Env (preview/staging/prod)**
```

---

## 5) CI/CD (add `/.github/workflows/ci.yml`)

```
name: CI
on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read
  pull-requests: write
  id-token: write

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 8 }
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm -r build
      - run: pnpm -r test --if-present
```

**`/.github/workflows/deploy-web.yml`** (Vercel example)

```
name: Deploy Web
on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/web
```

**`/.github/workflows/deploy-api.yml`** (Render example)

```
name: Deploy API
on:
  push:
    branches: [main]
    paths:
      - 'apps/api/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Trigger Render Deploy
        run: |
          curl -X POST \
            -H 'accept: application/json' \
            -H 'content-type: application/json' \
            -H 'authorization: Bearer ${{ secrets.RENDER_API_TOKEN }}' \
            https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys
```

---

## 6) ENV FILES (add `/.env.example` at repo root and app‑level)

```
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=

# Firebase (push/analytics only)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# App
ENCRYPTION_KEY=
JWT_SECRET=
NODE_ENV=development
```

Add a short bootstrap guide at `/docs/bootstrap.local.md` with the exact dev commands (pnpm install, migrate, seed, run).

---

## 7) SUPER PROMPT — “Full Authority” (paste into Copilot Chat at repo root)

**Role:** You are the senior full‑stack engineer and release manager for **KobKlein**. You have full authority within this repository as granted by `/docs/AUTHORIZATION.md` to finish the platform end‑to‑end.

**Objectives:**

1. Complete A→Z build: backend, frontend, database (Supabase + RLS), API, Auth, dashboards per role (Client, Merchant, Diaspora, Distributor, Admin, Super‑Admin), payments (Stripe), NFC/QR, offline POS, i18n, security hardening, CI/CD, and deployment.
2. Remove **all mock/demo code** and replace with production pathways.
3. Create numbered PRs with tests, migration notes, and rollback steps; keep `/docs/CHECKLIST.md` up‑to‑date.

**Non‑negotiables:**

* Auth = Supabase; Firebase only for push/analytics.
* RLS enforced + tested.
* Every dashboard shows real data via API/SDK.
* Stripe test mode works end‑to‑end with webhooks.
* CI green; preview/staging/prod deploys configured.

**Start now:**

* Read `/docs/ROE.md` and `/docs/SECRETS_CHECKLIST.md`.
* Generate `/docs/GAPS.md` and `/docs/ARCHITECTURE.md` and open **PR #1 — Audit & Plan**.
* Proceed numerically (#2 Env, #3 DB+RLS, #4 Auth, #5 API, #6 Payments, #7 NFC/QR, #8 Dashboards, #9 Offline POS, #10 Security, #11 i18n, #12 CI/CD, #13 Cleanup & Docs).

When blocked due to missing secrets or provider access, output a red, concise checklist of exactly what you need and which environment to place it in.

---

## 8) TODO MASTER LIST (paste as `/docs/CHECKLIST.md` and mirror as Issues)

* [ ] **PR #1 — Audit & Plan**: GAPS.md, ARCHITECTURE.md, dead code list.
* [ ] **PR #2 — Env & Bootstrap**: .env.example, bootstrap.local.md, secrets map.
* [ ] **PR #3 — DB & RLS**: schema + migrations + SQL tests.
* [ ] **PR #4 — Auth**: Supabase Auth + RBAC guards + SSR session middleware.
* [ ] **PR #5 — API Layer**: wallets, transactions, merchants, products, invoices, remittances, settlements; webhooks; typed SDK.
* [ ] **PR #6 — Payments**: Stripe on/off‑ramp + reconciliation.
* [ ] **PR #7 — NFC/QR**: card activation, QR encode/decode, POS flow.
* [ ] **PR #8 — Dashboards**: Client, Merchant, Diaspora, Distributor, Admin, Super‑Admin (real data).
* [ ] **PR #9 — Offline POS**: PWA SW, IndexedDB queue, background sync, UX.
* [ ] **PR #10 — Security Hardening**: rate limits, headers/CSP, audit logs, secrets scanning.
* [ ] **PR #11 — i18n & a11y**: translations wired, a11y pass.
* [ ] **PR #12 — CI/CD & Deploy**: GH Actions, Vercel+Render wiring, env protections.
* [ ] **PR #13 — Cleanup & Docs**: remove mocks, unused deps; finalize RUNBOOK & USER_GUIDE with screenshots.

---

## 9) OPTIONAL: ENVIRONMENT PROTECTION POLICY (put in repo README)

* `preview`: automatic from PRs; ephemeral.
* `staging`: manual approve (owner), smoke tests.
* `production`: owner approval + CI green + secret review + change window noted.

---

## 10) NOTES FOR PROVIDER ACCESS (copy into a private 1Password/Secrets doc)

* Supabase: Project URL, anon key (client), **service‑role key** (server) — restrict by environment; rotate quarterly.
* Stripe: Create Restricted Keys for read‑only dashboards where possible; keep webhook secrets per env.
* Twilio: Lock messaging service to allowed senders/regions; no credentials in logs.
* Cloudflare: API Token scoped to DNS + Pages/Workers as needed.
* Vercel/Render: least privilege tokens; OIDC where available.
