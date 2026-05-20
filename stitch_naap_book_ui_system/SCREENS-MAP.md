# Stitch export → app routes

Reference assets: each screen folder has `code.html` + `screen.png`. Theme specs: `naap_book_refined/DESIGN.md`, `midnight_pro/DESIGN.md` (+ `WhiteTheme.md`, `MidnightProTheme.md`).

## 13 Stitch folders (screens + themes)

| # | Stitch folder | App route | Theme | Batch |
|---|---------------|-----------|-------|-------|
| 1 | `dashboard_refined_deliveries_swap` | `/dashboard` | Light (`minimal_white` / default) | 1 |
| 2 | `dashboard_midnight_pro_refined_alignment` | `/dashboard` | Midnight Pro (`dark`) | 1 |
| 3 | `today_s_deliveries_list_view` | `/today` | Light | 1 |
| 4 | `today_s_deliveries_midnight_pro_aligned_list` | `/today` | Midnight Pro | 1 |
| 5 | `advanced_analytics_perfectly_aligned` | `/analytics` | Light | 1 |
| 6 | `advanced_analytics_midnight_pro_aligned_with_back_button` | `/analytics` | Midnight Pro | 1 |
| 7 | `customer_directory_aligned` | `/customers` | Light | 1 |
| 8 | `gallery_perfectly_aligned` | `/gallery` | Light | 1 |
| 9 | `calendar_aligned` | `/calendar` | Light | 1 |
| 10 | `profile_settings_aligned` | `/profile` | Light | 1 |
| 11 | `profile_settings_midnight_pro_aligned` | `/profile` | Midnight Pro | 1 |
| 12 | `naap_book_refined` | — (theme tokens) | Light | 1 |
| 13 | `midnight_pro` | — (theme tokens) | Midnight Pro | 1 |

**Midnight Pro in app:** Profile → theme **Dark** / Midnight Pro sets `data-theme="dark"` on `<html>`.

## App routes without Stitch export

| Route | Purpose |
|-------|---------|
| `/` | Redirect via `AppBootstrap` → `/dashboard` or `/login` |
| `/login`, `/verify-otp` | Auth |
| `/demo-access` | Demo gate |
| `/customers/new` | Add customer |
| `/customers/[id]` | Customer detail + measurements |
| `/job/new` | Single-page new job form |
| `/jobs/[id]` | Job detail |
| `/jobs/[id]/receipt` | Printable bill |
| `/insights` | AI “Samajh” insights |

## Nav ↔ routes

Mobile bottom nav (via `AppShell`): Dashboard (includes `/analytics`), Today, Gallery, Customers, Calendar, Profile. Full-bleed chrome hidden on `/job/new`, `/jobs/*`.
