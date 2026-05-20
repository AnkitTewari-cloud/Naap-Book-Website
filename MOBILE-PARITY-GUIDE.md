# Naap Book Website → Mobile Parity Guide

**Audience:** Naap Book **mobile** (Expo/React Native) agent and developers.  
**Source of truth:** Standalone web repo — [Naap-Book-Website](https://github.com/AnkitTewari-cloud/Naap-Book-Website) (`naap-book/website` in the monorepo).  
**Goal:** Implement matching **themes**, **Stitch UI/UX**, **navigation**, and **features** on mobile.

This document lists what was built on web, how it behaves, and what to port. Prefer copying logic from the cited paths rather than re‑inventing.

---

## Table of contents

1. [Architecture overview](#1-architecture-overview)
2. [Navigation & app shell](#2-navigation--app-shell)
3. [Themes (all four)](#3-themes-all-four)
4. [Stitch UI system](#4-stitch-ui-system)
5. [Internationalization (i18n)](#5-internationalization-i18n)
6. [Auth & bootstrap](#6-auth--bootstrap)
7. [Screen-by-screen features](#7-screen-by-screen-features)
8. [New job workflow (critical)](#8-new-job-workflow-critical)
9. [Measurements system](#9-measurements-system)
10. [Job detail & status FSM](#10-job-detail--status-fsm)
11. [Receipt & billing](#11-receipt--billing)
12. [Data models & API](#12-data-models--api)
13. [Demo mode & fixtures](#13-demo-mode--fixtures)
14. [Local storage keys](#14-local-storage-keys)
15. [Mobile parity checklist](#15-mobile-parity-checklist)
16. [Reference file index](#16-reference-file-index)

---

## 1. Architecture overview

| Layer | Web implementation | Mobile should |
|-------|-------------------|---------------|
| UI framework | Next.js 15 App Router, React 19 | Expo Router / React Navigation screens |
| State | Redux Toolkit + RTK Query | Same pattern or existing mobile store |
| Styling | CSS modules + CSS variables on `<html>` | Theme object → StyleSheet / tokens |
| Icons | Google Material Symbols (`MaterialIcon`) | Same font or `@expo/vector-icons` Material |
| API | RTK Query `baseApi` + `mockBaseQuery` in demo | Mirror endpoints; reuse `types/shared` contracts |
| Types | `src/types/shared.ts` (local copy, not npm workspace) | **Keep in sync** with web file |

**Default language:** English (`en`). Demo tailor forces `preferredLanguage: "en"`.

**Default theme:** `minimal_white`. Profile label for dark theme: **“Dark”** (Stitch **Midnight Pro**).

**Home route after login:** `/dashboard` (not `/today`). `/insights` redirects to `/dashboard`.

---

## 2. Navigation & app shell

**Implementation:** `src/components/AppShell.tsx`, `AppShell.module.css`, `AppTopBar.tsx`

### Desktop / tablet (≥ breakpoint)

- **Persistent left sidebar** on all authenticated routes (including `/job/new` and `/jobs/*` — chrome is **not** hidden on job flows).
- **Brand block:** Shop initials in logo circle (from `shopName`, else `"NB"`), app name, subtitle “Management Portal”.
- **Sidebar Search** (blue CTA style) → `/customers` (acts as customer search entry).
- **Primary nav links** (Material icons, filled when active):

| Key | Route | Icon | Active when |
|-----|-------|------|-------------|
| Dashboard | `/dashboard` | `dashboard` | `/dashboard`, `/analytics` |
| Today | `/today` | `event_available` | `/today` |
| Gallery | `/gallery` | `photo_library` | `/gallery` |
| Customers | `/customers` | `group` | `/customers`, `/customers/*` |
| Calendar | `/calendar` | `calendar_month` | `/calendar` |
| Profile | `/profile` | `person` | `/profile` |

- **New Job** button (blue, below nav, above footer) → `/job/new` (`add` icon).
- **Footer:** “System settings” → `/profile` (`settings` icon).

### Mobile

- **Top header:** Logo initials + dynamic title (route-based or shop name on dashboard/analytics).
- **Hamburger:** Opens same sidebar as overlay + backdrop; Escape closes.
- **Bottom nav** (4 items only — **Customers and Calendar are sidebar-only on mobile**):

| Tab | Route | Icon |
|-----|-------|------|
| Dashboard | `/dashboard` | `dashboard` |
| Today | `/today` | `event_available` |
| Gallery | `/gallery` | `gallery_thumbnail` |
| Settings | `/profile` | `settings` |

**Mobile parity decision:** Either add Customers + Calendar to bottom nav on mobile, or document that users open the drawer — web chose drawer-only for those two.

### Page chrome

- `<main>` uses class `stitch-page-pattern` (subtle background pattern from `globals.css` / `stitch-tokens.css`).
- `DemoBanner` when demo mode is on (`src/components/DemoBanner.tsx`).

---

## 3. Themes (all four)

**Implementation:** `src/theme/ThemeProvider.tsx`, `applyTheme.ts`, `themes/*.ts`, `styles/stitch-tokens.css`, `globals.css`

Themes are applied by:

1. Redux `app.theme` (`appSlice.ts`).
2. `ThemeProvider` calls `applyThemeToDocument(theme)`.
3. Sets `document.documentElement` attribute **`data-theme`** = `minimal_white` | `vibrant` | `green` | `dark`.
4. Sets **`color-scheme`** = `light` or `dark` (dark theme only).
5. Injects CSS variables: `--color-*`, `--spacing-*`, `--radius-*`, `--font-size-*`, Stitch surface container vars.

Profile UI: four preview swatches; selecting theme calls `updateMe({ preferredTheme })` + `setTheme` in Redux.

### Theme token table (port to mobile `Theme.colors`)

| Token | Purpose |
|-------|---------|
| `background` | Page canvas |
| `surface` | Cards |
| `surfaceElevated` | Raised cards |
| `surfaceMuted` | Muted panels |
| `primary` / `primaryText` | Primary buttons |
| `secondary` / `secondaryMuted` | Nav accent, active states |
| `text` / `textMuted` | Body copy |
| `border` / `borderVariant` | Dividers |
| `statusReceived` … `statusCancelled` | Job status chips |
| `statusOverdue` | Overdue highlight |
| `success` / `warning` / `danger` | Alerts |
| `whatsappGreen` | WA buttons |

**Job status colors:** Use `getStatusColor(theme, status)` from `ThemeProvider.tsx` — same mapping as web.

### `minimal_white` (default — Stitch “Naap Book Refined”)

| Role | Hex |
|------|-----|
| background | `#FCF8FF` |
| surface | `#FFFFFF` |
| surfaceElevated | `#F5F2FF` |
| primary | `#4F46E5` |
| secondary (nav accent) | `#006D2F` |
| text | `#111827` |
| textMuted | `#464555` |

Radii: sm 6, md 10, lg 14, pill 999.

### `dark` (Stitch **Midnight Pro** — label “Dark” in profile)

| Role | Hex |
|------|-----|
| background | `#0B1326` |
| surface | `#171F33` |
| surfaceElevated | `#222A3D` |
| surfaceMuted | `#131B2E` |
| primary (CTA) | `#4F46E5` |
| secondary (nav/links) | `#C3C0FF` |
| text | `#DAE2FD` |
| textMuted | `#C7C4D8` |

Stitch surface containers (also set as CSS vars): `surfaceContainerLowest` `#060e20`, `surfaceContainerLow` `#131b2e`, `surfaceContainer` `#171f33`, `surfaceContainerHigh` `#222a3d`.

**Mobile:** Many screens use `[data-theme="dark"]` overrides in CSS modules — replicate as theme branch in StyleSheet or nested theme tokens.

### `vibrant`

Warm cream background, primary `#B23A48`, secondary `#2E86AB`, background `#FFF7E6`.

### `green`

Green shop aesthetic: primary `#15803D`, secondary `#22C55E`, background `#F1F8F4`.

### Spacing & typography (shared defaults)

From `tokens.ts`: spacing `xs:4, sm:8, md:12, lg:16, xl:24`; font sizes `xs` through `3xl` (12–32px). Use same scale on mobile for parity.

---

## 4. Stitch UI system

**Folder:** `stitch_naap_book_ui_system/` (HTML + PNG per screen; `SCREENS-MAP.md`, `INTEGRATION-STATUS.md`)

Each integrated screen should be compared to its `screen.png` in light + Midnight Pro variants.

| Stitch folder | App route | Theme variants |
|---------------|-----------|----------------|
| `dashboard_refined_deliveries_swap` / `dashboard_midnight_pro_refined_alignment` | `/dashboard` | Light / dark |
| `today_s_deliveries_list_view` / `today_s_deliveries_midnight_pro_aligned_list` | `/today` | Light / dark |
| `advanced_analytics_perfectly_aligned` / `advanced_analytics_midnight_pro_aligned_with_back_button` | `/analytics` | Light / dark |
| `customer_directory_aligned` | `/customers` | Light |
| `gallery_perfectly_aligned` | `/gallery` | Light |
| `calendar_aligned` | `/calendar` | Light |
| `profile_settings_aligned` / `profile_settings_midnight_pro_aligned` | `/profile` | Light / dark |
| `naap_book_refined/` | (tokens only) | Light spec |
| `midnight_pro/` | (tokens only) | Dark spec |

**No Stitch export yet (functional web UI — highest mobile gap):**

- `/job/new`, `/jobs/[id]`, `/jobs/[id]/receipt`, `/customers/new`, `/customers/[id]`, `/login`, `/verify-otp`

**Design docs:** `WhiteTheme.md`, `MidnightProTheme.md`, `*/DESIGN.md`

---

## 5. Internationalization (i18n)

**Implementation:** `src/i18n/strings.ts`, `I18nProvider.tsx`, `useI18n.ts`

### Supported languages (v1 web)

| Code | Label |
|------|-------|
| `en` | English (default) |
| `hi` | हिन्दी |
| `mr` | मराठी |
| `ta` | தமிழ் |
| `kn` | ಕನ್ನಡ |

- All UI strings go through `t("key")` — **do not hardcode English** on new mobile screens.
- Garment labels: `constants/garments.ts` → `labels[language]` per garment + per measurement field.
- Customer display: `namesByLang[language]` fallback to `name` (`JobCardManifest.getCustomerDisplayName`).
- Profile language radios: bound to Redux `app.language`; saving calls `updateMe({ preferredLanguage })`.
- **CSS note:** Language radio buttons use class `langRadio` excluded from global 44px min-height touch rule in `globals.css`.

### Important string keys (non-exhaustive)

Copy full set from `strings.ts`. Critical groups:

- **Nav:** `dashboard.title`, `today.title`, `gallery.title`, `customers.title`, `calendar.title`, `profile.title`, `profile.systemSettings`
- **Job wizard:** `job.new`, `job.wizard.*`, `job.status.*`
- **Measurements:** `measurements.*`
- **Dashboard urgent:** `dashboard.urgentPin`, `dashboard.urgentUnpin`, `dashboard.urgentCollapse`, `dashboard.urgentExpand`
- **Analytics:** `analytics.*`
- **Customers / gallery / calendar:** matching prefixes

---

## 6. Auth & bootstrap

**Implementation:** `AppBootstrap.tsx`, `middleware.ts`, `login/page.tsx`, `verify-otp/page.tsx`, `demo-access/page.tsx`

### Flow

1. On load, hydrate auth from `localStorage`: `accessToken`, `refreshToken`, `tailor` JSON.
2. Normalize tailor language via `normalizeTailorPreferences()` (demo tailor always `en`).
3. If `DEMO_SKIP_LOGIN` → auto session with `DEMO_TAILOR` fixtures.
4. `/` → `/dashboard` if authed, else `/login`.
5. Unauthed users redirected to `/login` except public paths: `/login`, `/verify-otp`, `/demo-access`.

### Demo gate (deployed public demo)

- Env: `DEMO_GATE_ENABLED=true`, `DEMO_GATE_PASSWORD=...`
- Middleware redirects to `/demo-access` until cookie `demo_access=1` (API: `POST /api/demo-access`).

### Persist session

```ts
webStorage.setItem("accessToken", ...);
webStorage.setItem("refreshToken", ...);
webStorage.setItem("tailor", JSON.stringify(tailor));
```

Mobile: use SecureStore / AsyncStorage equivalents.

---

## 7. Screen-by-screen features

### `/dashboard` — `src/app/(app)/dashboard/page.tsx`

Stitch-aligned home dashboard (demo KPIs + tables).

| UI block | Behavior |
|----------|----------|
| **KPI row** | Total Sales (`₹` en-IN), trend %, Forecast revenue, Due Tomorrow count + avatar stack, green **New Job** card → `/job/new` |
| **Today’s Deliveries** | Table from `DUMMY_TODAY_ORDERS` (job numbers `#NB-8492` etc.); status chips colored via `statusVariant()` |
| **Tomorrow** | `DUMMY_TOMORROW_ORDERS` section |
| **Quick Actions** | Links: New Job, Customers, Calendar, Analytics |
| **Urgent Attention** | Collapsible panel; **pin** persists open state |

**Urgent alerts (demo):** Overdue job link, low inventory, customer inquiry — border variants `error` / `warning` / `info`.

**LocalStorage:**

- `naapbook_dashboard_urgent_pinned` — `"1"` / `"0"`
- `naapbook_dashboard_urgent_open` — `"1"` / `"0"`

**Export report:** Stub `window.alert` (future API).

---

### `/analytics` — `src/app/(app)/analytics/page.tsx`

- Back link → `/dashboard` (nav tab stays Dashboard).
- Period selector (This Month, Last Month, Quarter, Year) — UI only in demo.
- KPI cards, Recharts revenue vs expenses, garment mix pie, repeat customers, insight cards.
- Demo note string `analytics.demoNote`.
- Data: `dummyDashboardData.ts` + `demoInsights.ts`.

---

### `/today` — `src/app/(app)/today/page.tsx`

- Stitch header + status tier filters (All / Pending / Ready / etc.).
- List via `TodayDeliveryRow` component.
- Empty state `today.empty`.
- Links to job detail by id.
- Maps to Stitch today delivery list screens.

---

### `/customers` — `src/app/(app)/customers/page.tsx`

- Directory grid `CustomerGridCard`.
- Search placeholder i18n; filter/sort UI (Stitch).
- **New Customer** → `/customers/new`.
- Card tap → `/customers/[id]`.
- Call / WhatsApp shortcuts (`utils/phone.ts`).

---

### `/customers/new` — add customer form

- Name, phone, optional fields; creates via `createCustomer` mutation.

---

### `/customers/[id]` — customer detail

- Display name (i18n), phone, call/WA.
- Measurements by garment type (read-only / history).
- Past jobs list → job detail.
- **No Stitch HTML** — match tokens + spacing from directory screen.

---

### `/gallery` — `src/app/(app)/gallery/page.tsx`

- Tabs: Shop Gallery / Customer Gallery.
- Masonry-style grid, upload button (demo may stub).
- Demo images: `features/gallery/demoGallery.ts`.
- Stitch `gallery_perfectly_aligned`.

---

### `/calendar` — `src/app/(app)/calendar/page.tsx`

- `MonthCalendar` component.
- Selected day → delivery cards `CalendarDeliveryCard`.
- i18n: `calendar.deliveriesFor`, `calendar.jobCount`.

---

### `/profile` — `src/app/(app)/profile/page.tsx`

Stitch bento settings layout.

| Section | Features |
|---------|----------|
| Identity | Avatar initials, shop name, owner first/last name, save |
| **Language** | Radio grid for 5 languages → Redux + API |
| **Theme** | 4 previews (`minimal_white`, `vibrant`, `green`, `dark`) |
| Notifications | Toggle (local `shopSettingsStorage`) |
| Email alerts | Toggle |
| 2FA | Toggle (UI only) |
| Data sync | Toggle + “Sync now” updates `lastSyncIso` |
| Business hours | Text field |
| New Job CTA | Button → `/job/new` |
| Logout | Clears auth storage + Redux |

**Shop settings storage:** `features/settings/shopSettingsStorage.ts` (notifications, email, sync flags).

---

### `/insights` — legacy / optional

- Page exists; **`next.config.ts` redirects `/insights` → `/dashboard`**.
- No nav link to Insights on web. Mobile can skip or keep deep link only.

---

### `/login` & `/verify-otp`

- Phone OTP flow when `DEMO_SKIP_LOGIN=false`.
- Demo credentials in `features/demo/demoCredentials.ts` (`POC_PHONE_LOCAL_DIGITS`, `POC_OTP`).

---

## 8. New job workflow (critical)

**Route:** `/job/new`  
**Files:** `src/app/(app)/job/new/page.tsx`, `new-job.module.css`, `MeasurementFields.tsx`, `constants/garments.ts`, `utils/measurements.ts`

Single scrollable form (not a multi-step wizard), sections:

### 8.1 Customer section

| Field | Rules |
|-------|--------|
| Phone | 10 digits; `inputMode=numeric`; search customers when complete |
| Name | Required; auto-fill from matched customer |
| Match banner | If phone matches existing customer → green “Existing customer” |
| New banner | If no match → “New customer — saved when you create the job” |
| Query param | `?customerId=` pre-fills from customer list |

**Phone matching:** Last 10 digits equality (`phonesMatch`).

**On submit:** If no match → `createCustomer` then `createJob`.

### 8.2 Garment picker

- **24 garment types** in `GARMENT_TYPES` (see [§12](#12-data-models--api)).
- Collapsible grid with emoji per type (`getGarmentEmoji`, `getGarmentLabel`).
- Toggle expand/collapse (`job.wizard.garmentExpand` / `garmentCollapse`).

### 8.3 Garment type name (`garmentLabel`) — important

Separate from measurement field names.

| Garment | `garmentLabel` rule |
|---------|-------------------|
| `custom` | **Required** free-text name (e.g. “Indo-western gown”) |
| Any other | Optional override; if empty, use localized default garment label |

Saved on job item as `garmentLabel` and inside `measurementSnapshot.garmentLabel`.

Display priority: `item.garmentLabel` → localized `garmentType`.

### 8.4 Measurements

- Rendered when garment selected.
- Component: `MeasurementFields` (see [§9](#9-measurements-system)).
- Snapshot built in `buildMeasurementSnapshot()`:
  - `unit: "inch"`
  - `fields: Record<string, number>` — parsed numbers
  - `textFields?: Record<string, string>` — fractions kept as text, text-only fields
  - `takenAt`, `takenBy: "tailor"`

### 8.5 Delivery & pricing

| Field | Notes |
|-------|--------|
| Promised date | Required (`promisedAt`) |
| Quoted / Advance | Optional numbers; `balance = quoted - advance` |
| GST toggle | `withGst` for bill preview (5% `DUMMY_GST_RATE`) |

### 8.6 Bill preview

- Inline `BillDocument` preview when customer name + garment + quote or “show sample”.
- Toggle sample bill for empty state demo.

### 8.7 Submit

- `createJob` → navigate to `/jobs/{id}`.
- Validation: name, phone, garment, custom name if custom, promised date.

---

## 9. Measurements system

**Files:**

- `src/features/job/MeasurementFields.tsx`
- `src/features/measurements/useGarmentMeasurementFields.ts`
- `src/features/measurements/measurementFieldStorage.ts`
- `src/constants/garments.ts` — `GARMENT_DEFINITIONS` with per-garment `measurementFields`
- `src/utils/measurements.ts` — parsing/coercion

### Default fields per garment

Each `GarmentDefinition` includes `measurementFields: { key, labels, valueKind? }[]`.

Common keys: `chest`, `waist`, `hip`, `shoulder`, `sleeve`, `length`, `neck`, `armhole` — labels in all 5 languages.

### Customize mode

| Action | Behavior |
|--------|----------|
| Enter customize | Add/remove/reorder fields |
| Add preset | Pick from presets not yet on form |
| Add custom (number) | User-defined label → new key |
| Add custom (text) | `valueKind: "text"` — free-form notes |
| Quick-add row | Name + value → add field and set value in one step |
| Reset | `clearSavedFields(garmentType)` → defaults |
| Persist | `localStorage` key `naapbook_measurement_field_configs_v1` |

### Input parsing (`coerceMeasurementValue`)

| Input | Stored as |
|-------|-----------|
| `36` | `fields.chest = 36` |
| `1/4` | `number` + `textFields` keeps `"1/4"` |
| `36 1/4` | mixed fraction parsed to number |
| Text-only field | `textFields` only |
| Non-numeric text | `textFields` |

**UI:** Text inputs (not `keyboardType="decimal-pad"` only) — placeholders `e.g. 36 or 1/4` / free text.

### Job detail display

`jobs/[id]/page.tsx`:

- `measurementEntriesFromSet()` / `buildMeasurementDisplay()` merges `fields` + `textFields` with labels from effective field config.
- Show `garmentLabel` on item header.

---

## 10. Job detail & status FSM

**File:** `src/app/(app)/jobs/[id]/page.tsx`

### Status pipeline UI

Horizontal steps for: `received` → `cutting` → `stitching` → `trial` → `finishing` → `ready` → `delivered`.

- Current status highlighted with `getStatusColor(theme, status)`.
- **Mark next status** uses `JOB_STATUS_FLOW` (allowed transitions only).
- Cancelled is terminal.

### `JOB_STATUS_FLOW` (must match backend)

```ts
received → cutting | cancelled
cutting → stitching | cancelled
stitching → trial | finishing | cancelled
trial → finishing | stitching | cancelled
finishing → ready | cancelled
ready → delivered | cancelled
delivered → (none)
cancelled → (none)
```

### Other job detail features

- Customer card: initials, name, phone, **Call** (`tel:`), **WhatsApp** (share link).
- Fabric swatch colors map (`FABRIC_COLOR_HEX` dictionary).
- Pricing block: quoted, advance, balance (INR en-IN).
- Promised date, overdue styling via `isOverdue()`.
- Link to **Receipt** `/jobs/[id]/receipt`.
- Share job summary on WhatsApp (confirm dialog `job.shareConfirm`).

---

## 11. Receipt & billing

**Files:** `src/app/(app)/jobs/[id]/receipt/page.tsx`, `src/features/billing/BillDocument.tsx`

| Feature | Behavior |
|---------|----------|
| Line items | From job items; `description` = `garmentLabel` ?? `garmentType` |
| GST | Toggle / rate from constants |
| Print | `@media print` CSS in `BillDocument.module.css` |
| WhatsApp | Pre-filled message: shop, customer, garment, job number, dates, amounts |
| Share | `getWaShareLink(phone, text)` |

Mobile: use share sheet + `Linking.openURL` for WA; print via share PDF or WebView print.

---

## 12. Data models & API

**Contracts:** `src/types/shared.ts` — keep aligned with mobile/backend.

### Garment types (24)

`kurta`, `blouse`, `shirt`, `pant`, `salwar`, `sherwani`, `suit`, `lehenga`, `saree_fall`, `dupatta`, `petticoat`, `kameez`, `churidar`, `nightgown`, `anarkali`, `sharara`, `palazzo`, `blazer`, `waistcoat`, `skirt`, `gown`, `frock`, `choli`, `saree`, `custom`

### `MeasurementSet`

```ts
{
  garmentType: GarmentType;
  garmentLabel?: string;
  unit: "inch" | "cm";
  fields: Record<string, number>;
  textFields?: Record<string, string>;
  takenAt: string;
  takenBy?: "tailor" | "helper";
  notes?: string;
}
```

### `JobItem`

```ts
{
  garmentType: GarmentType;
  garmentLabel?: string;
  quantity: number;
  measurementSnapshot?: MeasurementSet;
  customMeasurements?: Record<string, number>;
  notes?: string;
}
```

### RTK Query endpoints (mirror on mobile)

| API file | Endpoints |
|----------|-----------|
| `authApi.ts` | `getMe`, `updateMe`, `logout`, OTP send/verify |
| `customerApi.ts` | list, get, create, update, delete |
| `jobCardApi.ts` | list, get, create, update, `updateJobStatus` |
| `reminderApi.ts` | CRUD reminders |
| `insightsApi.ts` | insights summary |

**Base URL:** `NEXT_PUBLIC_API_URL` (default live `http://localhost:4000/api/v1`).  
**Demo:** `mockBaseQuery.ts` + `demoFixtures.ts` intercepts all calls in-memory.

---

## 13. Demo mode & fixtures

**Env (`.env.example`):**

```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEMO_SKIP_LOGIN=true
```

| Flag | Effect |
|------|--------|
| `IS_DEMO_MODE` | Mock API |
| `DEMO_SKIP_LOGIN` | Auto login as `DEMO_TAILOR` |
| `DEMO_GATE_*` | Password gate for public deploy |

**Fixture scale (approx.):**

- 16 customers
- ~26 jobs (IDs like `demo-job-t-1`, job numbers `#NB-8492`)
- 12 gallery items
- 6 reminders
- Dashboard/analytics dummy constants in `dummyDashboardData.ts`

**Demo tailor:** English, default theme; bootstrap forces `setLanguage("en")`.

---

## 14. Local storage keys

| Key | Purpose |
|-----|---------|
| `accessToken` | JWT |
| `refreshToken` | Refresh |
| `tailor` | JSON `AuthTailor` |
| `naapbook_measurement_field_configs_v1` | Per-garment custom measurement layouts |
| `naapbook_dashboard_urgent_pinned` | Dashboard urgent panel pin |
| `naapbook_dashboard_urgent_open` | Dashboard urgent panel expanded |
| Shop settings | Via `shopSettingsStorage` (notifications, sync, etc.) |

---

## 15. Mobile parity checklist

Use as implementation order for the mobile agent.

### P0 — Core tailor workflows

- [ ] Four themes + `getStatusColor` + Midnight Pro dark surfaces
- [ ] i18n: 5 languages, default `en`, garment/customer label helpers
- [ ] App shell: sidebar + bottom nav + New Job CTA + search → customers
- [ ] Dashboard: KPIs, deliveries table, urgent panel (pin/collapse), quick actions
- [ ] Today list with status filters
- [ ] Customers directory + detail + new customer
- [ ] Calendar month + day deliveries
- [ ] **New job:** phone lookup, 24 garments, **garmentLabel**, measurements editor, bill preview, create job
- [ ] **Job detail:** status FSM, call/WA, fabric, measurements display
- [ ] **Receipt:** BillDocument, GST, WA share

### P1 — Parity with web polish

- [ ] Gallery tabs + grid
- [ ] Analytics screen + charts
- [ ] Profile: language, theme, shop settings, logout
- [ ] Measurement field customize + local persistence
- [ ] Fraction parsing (`parseMeasurementValue` / `coerceMeasurementValue`)
- [ ] Insights API/page (optional; web redirects away)

### P2 — Auth & deploy

- [ ] OTP login + session hydrate
- [ ] Demo mode + fixtures
- [ ] Demo access gate (if public build)

### P3 — UX gaps vs Stitch

- [ ] Pixel-compare each integrated screen to `stitch_naap_book_ui_system/*/screen.png`
- [ ] Mobile: decide bottom nav for Customers + Calendar
- [ ] New job / job detail Stitch screens when exports exist

---

## 16. Reference file index

| Area | Path |
|------|------|
| Types / FSM | `src/types/shared.ts` |
| Garments + fields | `src/constants/garments.ts` |
| Shell / nav | `src/components/AppShell.tsx` |
| Themes | `src/theme/themes/*.ts`, `applyTheme.ts`, `stitch-tokens.css` |
| i18n | `src/i18n/strings.ts` |
| New job | `src/app/(app)/job/new/page.tsx` |
| Measurements UI | `src/features/job/MeasurementFields.tsx` |
| Measurement storage | `src/features/measurements/measurementFieldStorage.ts` |
| Parse utils | `src/utils/measurements.ts` |
| Job detail | `src/app/(app)/jobs/[id]/page.tsx` |
| Receipt | `src/app/(app)/jobs/[id]/receipt/page.tsx`, `BillDocument.tsx` |
| Dashboard | `src/app/(app)/dashboard/page.tsx`, `dummyDashboardData.ts` |
| Demo | `src/features/demo/demoFixtures.ts`, `mockBaseQuery.ts` |
| Stitch map | `stitch_naap_book_ui_system/SCREENS-MAP.md`, `INTEGRATION-STATUS.md` |
| Integration status | `stitch_naap_book_ui_system/INTEGRATION-STATUS.md` |

---

## Changelog summary (web vs older mobile)

High-level deltas the mobile app likely still needs:

1. **New home:** Dashboard replaces Today as default landing; Analytics under dashboard nav.
2. **Gallery** route and bottom nav tab.
3. **Stitch-aligned UI** on dashboard, today, customers, calendar, gallery, profile, analytics (light + dark).
4. **Sidebar always visible** on desktop; mobile drawer + 4-tab bottom nav.
5. **New Job** from sidebar/profile/dashboard; single-page form with garment grid + measurement customize.
6. **`garmentLabel`** on custom and optional override garments.
7. **`textFields` on measurements** + fraction parsing; text inputs not numeric-only.
8. **English default** + Kannada in i18n; demo forces EN.
9. **Dashboard urgent panel** with pin/collapse persistence.
10. **Insights** deprioritized (redirect to dashboard).
11. **Four themes** including Midnight Pro (`dark`) with full token set.
12. **24 garment types** with updated emojis/labels.

---

*Document generated for mobile parity from Naap Book Website standalone repo. Update this file when web ships new routes or Stitch exports.*
