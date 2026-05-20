# Naap Book Website — Security & Demo Audit

**Scope:** `naap-book/website` (Next.js 15, demo/POC mode)  
**Date:** 2026-05-17  
**Method:** Static review of `middleware.ts`, `demo-access` route/page, `mockBaseQuery`, `AppBootstrap`, `baseApi`, `.env.example`, plus route/link inventory. Demo persona: `.env.local` with `NEXT_PUBLIC_DEMO_MODE=true` and `NEXT_PUBLIC_DEMO_SKIP_LOGIN=true` (matches shipped POC defaults).

---

## 1. Demo user walkthrough

### Entry & auth

| Step | Expected | Observed |
|------|----------|----------|
| Open `/` | Redirect to Today when authed | **Works** — `AppBootstrap` sends `/` → `/today` when `accessToken` exists |
| POC without gate | Instant demo session | **Works** — `DEMO_SKIP_LOGIN` auto-writes `demo-access-token` to `localStorage` and Redux |
| `DEMO_GATE_ENABLED=true` | Password wall first | **Works** — middleware redirects to `/demo-access`; POST sets `demo_access` cookie, then `/login` |
| Login flow (`SKIP_LOGIN=false`) | Phone + OTP | **Works in mock** — `1234567890` + OTP `1234`; credentials shown on login page in demo mode |
| Logout | Clears session | **Partial** — mock returns OK; client must call logout mutation (profile does not expose logout in quick scan) |

### Core flows (mock API)

| Area | Status | Notes |
|------|--------|-------|
| **Today** | Works | Lists jobs in date range with `not_delivered`; empty state + FAB |
| **Customers** | Works | List, search, detail, new customer, measurements update |
| **Calendar** | Works | Week grid, job links |
| **New job** (`/job/new`) | Works | Creates job → redirects to `/jobs/[id]` |
| **Job detail** (`/jobs/[id]`) | Works | Status updates, links to receipt |
| **Receipt** (`/jobs/[id]/receipt`) | Works | Print styles in CSS |
| **Profile** | Works | Language, theme, shop name via mock `auth/me` |

### Broken or incomplete flows

| Issue | Severity | Detail |
|-------|----------|--------|
| **Insights page missing** | Broken UX | Today header links to `/insights`; **no** `src/app/.../insights/page.tsx` — 404. Mock API and `insightsApi` exist; UI route never shipped |
| **Insights i18n only** | Incomplete | Strings in `strings.ts` with no page |
| **Double bottom chrome on Today** | UX | Fixed FAB + bottom nav FAB both visible; cramped on small screens |
| **Nested padding** | UX | `(app)` pages add `padding` inside `AppShell.main` which already pads — wide screens OK, mobile feels tight |
| **Live API mode untested here** | Risk | Default POC uses mock; `NEXT_PUBLIC_DEMO_MODE=false` hits real backend — auth/scheduler path parity not verified in this audit |
| **Gate vs skip-login** | Confusing | With gate enabled, user still hits `/login` after password though `SKIP_LOGIN` may auto-auth on first paint — redundant step |

---

## 2. Responsiveness checklist

| Check | Status | Evidence |
|-------|--------|----------|
| Mobile viewport / `100dvh` | Pass | `globals.css`, `AppShell`, login/demo-access pages |
| Safe area (notch) | Pass | `--safe-area-bottom`, bottom nav `padding-bottom` |
| Touch targets ≥ 48px | Pass | `--touch-target-min`, `.touch-target`, buttons |
| Bottom navigation (mobile) | Pass | Fixed bar below 1024px; hidden on desktop |
| Sidebar (desktop ≥1024px) | Pass | `AppShell.module.css` `@media (min-width: 1024px)` |
| Text scaling | Pass | `-webkit-text-size-adjust: 100%` on `html` |
| Max content width | Pass | Login/verify/demo cards `max-width: 420–480px`; main `max-width: 1200px` desktop |
| Print (receipt) | Pass | `@media print` in `receipt.module.css` and `globals.css` |
| Horizontal overflow on tables/charts | Not audited | No insights charts page in tree |
| Keyboard / focus rings | Partial | Relies on browser defaults; no dedicated focus-visible tokens |

**Manual test suggested:** 320px, 390px, 768px, 1280px — Today FAB vs bottom nav overlap; calendar week strip overflow.

---

## 3. Security findings

### 3.1 Demo gate (`middleware.ts` + `/api/demo-access`)

| Finding | Risk | Detail |
|---------|------|--------|
| **Forgeable cookie** | High (gate only) | Middleware accepts any `demo_access=1` cookie. Value is not signed/HMAC’d. Attacker sets cookie in DevTools → bypasses password without API |
| **Predictable cookie value** | Medium | Literal `"1"` — no rotation or binding to client |
| **No rate limiting** | Medium | Unlimited POST attempts → online password guessing |
| **Timing side-channel (password)** | Low–Medium | Was: `!==` string compare. **Fixed:** `timingSafeEqual` in route (see §5) |
| **CSRF on POST `/api/demo-access`** | Low–Medium | No CSRF token. `SameSite=Strict` on Set-Cookie reduces cross-site cookie *submission* on subsequent requests; a malicious site can still trick a victim into POSTing the password if they know the shared demo password (sets cookie via response) |
| **Static asset bypass** | Info | Regex allows `.js`, `.css`, etc. through gate — normal for Next; ensure no secrets in public files |
| **Gate disabled by default** | Info | `.env.example` comments out `DEMO_GATE_ENABLED` — public deploys are open unless ops enables gate |

### 3.2 `localStorage` session tokens (`AppBootstrap`, `baseApi`, `localStorage.ts`)

| Finding | Risk | Detail |
|---------|------|--------|
| **Tokens in localStorage** | High (if XSS) | `accessToken`, `refreshToken`, `tailor` JSON — any script injection exfiltrates session |
| **Fixed demo tokens** | Info (demo) | Always `demo-access-token` / `demo-refresh-token` — no server validation in mock mode |
| **No httpOnly session** | Architectural | Browser-held bearer tokens; standard SPA tradeoff, unacceptable for high-value production without hardening |
| **Refresh in live mode** | Medium | `baseQueryWithReauth` posts refresh token from storage; stolen refresh = persistence |

### 3.3 Environment & secret leakage

| Finding | Risk | Detail |
|---------|------|--------|
| **`NEXT_PUBLIC_*` in client bundle** | Expected | `NEXT_PUBLIC_DEMO_MODE`, `NEXT_PUBLIC_DEMO_SKIP_LOGIN`, `NEXT_PUBLIC_API_URL` are public by design |
| **`DEMO_GATE_PASSWORD` server-only** | Good | Not prefixed with `NEXT_PUBLIC_` — not embedded in client |
| **`demoCredentials.ts` in client** | High (demo) | `POC_OTP`, phone constants compiled into JS — visible in Sources |
| **Login page exposes POC** | High (demo) | Renders phone + OTP when `IS_DEMO_MODE` |
| **`mockBaseQuery` OTP hint** | High (demo) | `send-otp` returns `otpHint: "POC OTP: 1234"` |
| **`.env.local` in repo status** | Critical if committed | Untracked in snapshot; must stay gitignored — never commit |
| **No security headers** | Medium | `next.config.ts` empty — no CSP, `X-Frame-Options`, etc. |

### 3.4 XSS

| Finding | Risk | Detail |
|---------|------|--------|
| **No `dangerouslySetInnerHTML`** | Good | Grep clean in `src/` |
| **User content rendered as text** | Good | Customer notes, job notes use `{text}` in JSX |
| **URL/query params** | Low | `verify-otp` shows `hint` from query string as text — reflected XSS mitigated by React escaping; avoid `javascript:` in links elsewhere |

### 3.5 CSRF (demo-access & API)

| Endpoint | CSRF notes |
|----------|------------|
| `POST /api/demo-access` | State-changing cookie set; **Strict** SameSite helps; no Origin check; shared password + malicious form = victim gets demo cookie |
| Mock RTK API | In-memory only — no cross-origin browser calls to backend |
| Live `baseApi` | Bearer header from JS — classic CSRF on cookies N/A; CORS on real API is backend concern |

### 3.6 Other attacker notes

- **Middleware does not protect client-only auth** — gate is page navigation only; API routes except `/api/demo-access` are not separately gated.
- **`DEMO_SKIP_LOGIN`** — Attacker who passes gate (or gate off) gets full app without OTP.
- **No CAPTCHA / lockout** on demo password.

---

## 4. Recommended fixes (prioritized)

### P0 — Before public demo URL

| # | Fix | Effort |
|---|-----|--------|
| P0-1 | **Signed demo cookie** (HMAC `demo_access` with server secret) — middleware verifies signature, not `=== "1"` | Small |
| P0-2 | **Rate limit** `/api/demo-access` (IP + exponential backoff) | Small |
| P0-3 | Constant-time password compare | **Done** in `route.ts` |
| P0-4 | Ensure `DEMO_GATE_ENABLED=true` + strong `DEMO_GATE_PASSWORD` on all public deploys | Ops |
| P0-5 | **Never commit** `.env.local`; rotate password if leaked | Ops |

### P1 — Demo hardening

| # | Fix | Effort |
|---|-----|--------|
| P1-1 | Add `/insights` page or remove Today link until shipped | Small |
| P1-2 | Strip `demoCredentials` / OTP hints from production client builds (`NEXT_PUBLIC_DEMO_MODE=false` tree-shake or separate entry) | Medium |
| P1-3 | CSRF: require `Origin`/`Referer` match host on `POST /api/demo-access`, or double-submit token | Small |
| P1-4 | Security headers in `next.config.ts` (CSP, `frame-ancestors`, etc.) | Medium |
| P1-5 | Move session to **httpOnly Secure cookies** when real API ships | Large |

### P2 — Polish & production

| # | Fix | Effort |
|---|-----|--------|
| P2-1 | httpOnly refresh rotation, short-lived access | Large |
| P2-2 | Logout control in profile | Small |
| P2-3 | Fix Today double-FAB / padding | Small UX |
| P2-4 | Remove dead `AppShell` regex for `/job/[id]` (route is `/jobs/[id]`) | Trivial |

---

## 5. Code changes applied (P0 quick fixes)

**File:** `src/app/api/demo-access/route.ts`

1. **`safePasswordEqual()`** — uses `crypto.timingSafeEqual` on UTF-8 buffers (length-mismatch still performs dummy compare to reduce timing leak).
2. **`sameSite: "strict"`** — tightens cookie so cross-site navigations do not send `demo_access` on unsafe requests.

**Not changed (requires more than one-liner):** signed cookies, rate limits, Origin validation, insights route, localStorage migration.

---

## 6. Files reviewed

| File | Role |
|------|------|
| `src/middleware.ts` | Demo gate redirect |
| `src/app/api/demo-access/route.ts` | Password → cookie |
| `src/app/demo-access/page.tsx` | Password form |
| `src/features/demo/mockBaseQuery.ts` | In-memory API |
| `src/components/AppBootstrap.tsx` | Auth hydration & routing |
| `src/store/baseApi.ts` | Live fetch + reauth |
| `.env.example` | Env contract |

---

## 7. Summary

The POC is **appropriate for local offline demo** but **not safe as a wide-open public site** without the demo gate, signed cookies, and removal of hard-coded OTP/credentials from the client bundle. The largest practical gap for a password-protected deploy is **forgeable `demo_access=1`**, not the password compare. Demo users will hit a **404 on Insights** from Today. Responsiveness foundations (dvh, safe areas, touch targets, responsive nav) are solid.
