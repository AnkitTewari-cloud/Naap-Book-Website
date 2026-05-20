# Stitch UI integration status

Last updated: **Batch 2** (docs sync). Implementation baseline: **Batch 1** (theme + shell + core screens).

## Batch 1 completed

| Area | What shipped |
|------|----------------|
| **Theme** | `stitch-tokens.css`, `tokens.ts`, `minimalWhite.ts`, `dark.ts`, `globals.css` aligned to `naap_book_refined` / `midnight_pro` DESIGN.md |
| **AppShell** | Sidebar + bottom nav, `stitch-page-pattern` on `<main>`, `AppTopBar` |
| **`/dashboard`** | KPI grid, deliveries table, quick actions, urgent panel — maps to `dashboard_refined_deliveries_swap` / `dashboard_midnight_pro_refined_alignment` |
| **`/analytics`** | KPI row, revenue chart, garment mix, insights cards, back to dashboard — maps to `advanced_analytics_*` |
| **`/today`** | Status filters, `TodayDeliveryRow` list, Stitch header — maps to `today_s_deliveries_*` |
| **`/customers`** | Directory grid, search/filter, `stitch-page-pattern` — `customer_directory_aligned` |
| **`/gallery`** | Tabs, masonry grid, upload — `gallery_perfectly_aligned` |
| **`/calendar`** | Month grid, delivery cards — `calendar_aligned` |
| **`/profile`** | Bento settings, language, Midnight Pro toggle — `profile_settings_*` |

## Integration by app route

| Route | Status | Stitch reference | Notes |
|-------|--------|------------------|-------|
| `/dashboard` | **Integrated** | `dashboard_refined_deliveries_swap`, `dashboard_midnight_pro_refined_alignment` | Default home after login. Verify light + Midnight Pro. |
| `/analytics` | **Integrated** | `advanced_analytics_perfectly_aligned`, `advanced_analytics_midnight_pro_aligned_with_back_button` | Linked from dashboard; nav highlights Dashboard tab. |
| `/today` | **Integrated** | `today_s_deliveries_list_view`, `today_s_deliveries_midnight_pro_aligned_list` | `TodayDeliveryRow` + tier filters. |
| `/customers` | **Integrated** | `customer_directory_aligned` | `stitch-page-pattern` on page root. |
| `/gallery` | **Integrated** | `gallery_perfectly_aligned` | |
| `/calendar` | **Integrated** | `calendar_aligned` | |
| `/profile` | **Integrated** | `profile_settings_aligned`, `profile_settings_midnight_pro_aligned` | Dark bento when `data-theme="dark"`. |
| `/customers/new` | **Not in export** | — | Functional; no Stitch HTML. |
| `/customers/[id]` | **Not in export** | — | Call/WA, measurements, job history — no Stitch HTML. |
| `/job/new` | **Not in export** | — | Single scroll form; highest UX gap vs brief. |
| `/jobs/[id]` | **Not in export** | — | Status pipeline, pricing actions. |
| `/jobs/[id]/receipt` | **Not in export** | — | `BillDocument` print/share. |
| `/insights` | **Not in export** | — | Generic cards; optional v1.5 in brief. |
| `/login`, `/verify-otp` | **Not in export** | — | Pre-auth screens. |
| `/demo-access` | **Not in export** | — | Demo gate only. |

**Theme-only (no page route):** `naap_book_refined/`, `midnight_pro/` → `ThemeProvider` + `applyTheme.ts`. Supplementary: `WhiteTheme.md`, `MidnightProTheme.md`.

## Midnight Pro (dark theme)

- Profile → **Midnight Pro** / Dark → `data-theme="dark"`.
- Canvas `#0b1326`, cards `#171f33`, nav accent `#c3c0ff`, primary `#4f46e5`.
- Compare each Integrated route against the `*_midnight_pro_*` folder `screen.png`.

## Demo data

- **16 customers**, **~26 jobs**, **12 gallery** items, **6 reminders**.
- Dashboard/analytics/today chips use consistent demo job IDs.

## Dev / verify

1. `START-WEBSITE.bat` or `npm run dev` in `naap-book/website` (Turbopack off by default for OOM).
2. Hard refresh (Ctrl+Shift+R).
3. Spot-check: `/dashboard`, `/today`, `/analytics`, `/customers`, `/gallery`, `/calendar`, `/profile`.
4. Profile → Midnight Pro → re-check dashboard, today, analytics.

## Remaining work (P0 / P1)

### P0 — no Stitch export; core tailor flows

| Route | Gap |
|-------|-----|
| `/job/new` | No Stitch HTML; must match §5.6 single-scroll brief (garment grid, measurements editor, bill preview, sticky footer). |
| `/jobs/[id]` | No export; status FSM, pricing block, call/WA, fabric/measurements read-only. |
| `/jobs/[id]/receipt` | No export; printable `BillDocument`, GST toggle, WhatsApp share affordance. |
| `/customers/[id]` | No export; detail layout, measurement history by garment, past jobs list. |

### P1 — secondary / auth

| Route | Gap |
|-------|-----|
| `/customers/new` | Add-customer form; can mirror directory styling until dedicated export. |
| `/insights` | Samajh takeaways; optional v1.5 — restyle when Stitch frames exist. |
| `/login`, `/verify-otp` | Auth UX not in zip; align to Stitch tokens when designed. |

### Optional polish (Integrated routes)

- Pixel diff vs `screen.png` on narrow mobile (320–390px).
- i18n: hard-coded English subtitles on dashboard/today where strings not in `strings.ts`.
- Live API wiring for analytics KPIs (currently demo `DUMMY_*` data).

## Historical notes

- **ThemeProvider vs CSS:** Inline theme on `<html>` must stay aligned with `stitch-tokens.css` or Stitch colors look wrong.
- **Home route:** `/dashboard` is default; Stitch export now includes dashboard/today/analytics (Batch 1).
- **Server:** Connection error `-102` = dev server not running.
