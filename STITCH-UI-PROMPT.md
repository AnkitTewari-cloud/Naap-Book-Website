# Google Stitch UI/UX Prompt — Naap Book Web

Copy everything inside the fenced block below into **Google Stitch** as your design brief. Adjust bracketed placeholders if needed.

---

```
DESIGN A COMPLETE UI/UX SYSTEM FOR: “Naap Book” (नाप बुक) — Web App (Responsive PWA-style)

## 1. Product summary

Naap Book is a voice-first, offline-capable **tailor shop workbook** for Indian neighborhood tailors (boutique / masterji shops). It replaces the paper register with: today’s deliveries, customer book + measurements, job cards, bills/receipts, calendar, business analytics, and AI insights (“Samajh”).

This brief is for the **browser web app** (Next.js implementation target), not a consumer marketplace. One logged-in tailor per session. Currency: **INR (₹)**. Locale: **India** (DD/MM dates, lakh formatting, +91 phones).

Tagline: “Your tailoring workbook” / “आपकी सिलाई बही”

Demo shop persona: **Ramesh Tailoring Works**, Pune — use realistic Indian names (Asha Devi, Ravi Patil, Meena Kulkarni).

---

## 2. Primary user persona

- **Who:** Neighborhood tailor, 35–60 years old, 10+ years experience, may have ≤10th standard formal education.
- **Devices:** Android phone (primary), occasional laptop at shop counter.
- **Literacy:** Comfortable with WhatsApp, phone calls, photos; **not** comfortable with dense English SaaS dashboards, tiny text, or multi-step enterprise wizards.
- **Goals:** See what’s due today, add a customer/job fast, record measurements, print/share a bill, know monthly earnings.
- **Constraints:** Bright shop lighting, one-handed use, intermittent network, prefers **Hindi** (also Marathi, Tamil, Kannada, English).

**Design north star:** Feels like a **clean digital bahi-khata (register)**, not like Swiggy/Zomato or a bank app. Calm, large touch targets, obvious primary action per screen.

---

## 3. UX principles (non-negotiable)

1. **One obvious action per screen** — e.g. Today = “what to deliver”; New Job = scrollable single form (no “Next” wizard steps).
2. **Touch-first** — minimum 44×44px tap targets; bottom navigation on mobile; no hover-only affordances.
3. **Low cognitive load** — short labels, garment emojis (👚 blouse, 👖 pant, 👘 kurta), status colors consistent everywhere.
4. **Bilingual-friendly layout** — UI must not break when labels switch to Devanagari/Tamil/Kannada scripts (variable line height, no fixed single-line truncation on names).
5. **Trust & clarity for money** — quoted / advance / balance always visible on jobs and bills; GST toggle explicit.
6. **Progressive disclosure** — advanced actions (customize measurement fields, analytics drill-down) behind clear secondary buttons.
7. **Accessible contrast** — WCAG AA for text; status never conveyed by color alone (include text label).

---

## 4. Information architecture & navigation

### Auth / gate (unauthenticated)
- `/demo-access` — simple password gate for public demos (optional)
- `/login` — phone number + “Send OTP”
- `/verify-otp` — 4–6 digit OTP entry, resend

### App shell (authenticated)
- **Mobile (<1024px):** fixed bottom nav (5 slots): Dashboard | Today | **FAB +** (center) | Customers | Calendar | Profile — hide chrome on full-bleed flows (`/job/new`, `/jobs/*`).
- **Desktop (≥1024px):** left sidebar 260px with same items + “New job” link; content max-width ~1100px centered.

### Core routes (design all screens)
| Route | Purpose |
|-------|---------|
| `/dashboard` | Home — 2×2 KPI grid (see §5) |
| `/analytics` | Shop analytics charts & KPIs |
| `/today` | Deliveries due today (job cards list) |
| `/customers` | Searchable customer directory |
| `/customers/new` | Add customer |
| `/customers/[id]` | Customer detail + measurement history |
| `/job/new` | **Single scrollable** new job form |
| `/jobs/[id]` | Job detail — status pipeline, pricing, fabric, actions |
| `/jobs/[id]/receipt` | Printable bill + WhatsApp share |
| `/calendar` | Month calendar with job dots |
| `/profile` | Shop name, language, theme, logout |
| `/insights` | AI “Samajh” takeaways + summary stats (optional v1.5 screen) |

---

## 5. Screen-by-screen specifications

### 5.1 Dashboard (`/dashboard`) — DEFAULT HOME
**Layout:** 2×2 responsive grid (stacks to 1 column on narrow mobile).

| Cell | Content | Interaction |
|------|---------|-------------|
| Top-left | **Monthly sales** — large ₹ figure (e.g. ₹2,48,500) | Tap → Analytics |
| Top-right | **Today’s orders** — compact list (job #, customer, garment, ₹, status chip) | Each row → Job detail |
| Bottom-left | **Next month projected** — ₹ forecast + subtle trend hint | Informational (optional tap → Analytics) |
| Bottom-right | **Tomorrow’s orders** — same compact list pattern | Row → Job detail |

Below grid: primary CTA **“+ New job”** + text link “Today’s deliveries”.

**Visual:** Card-based cells, soft border, subtle hover/focus ring on tappable cells. Sales figure uses primary accent color, bold 28–32px.

---

### 5.2 Analytics (`/analytics`)
- Back link to Dashboard.
- **KPI row (4 cards):** Avg order value, Pending balance, Repeat customers %, New customers this month.
- **Bar chart:** Revenue last 6 months (₹ on Y-axis, month labels).
- **Horizontal bar list:** Top garments % (Blouse, Kurta, Pant, Lehenga…).
- Footer note: “Demo analytics” style disclaimer in muted text.
- Chart colors use theme `primary`; grid lines subtle.

---

### 5.3 Today (`/today`)
- Page title: “Today’s deliveries” (localized).
- List of **Job Card** components (see §6.3): customer name, garment emoji+label, job number, promised date, status pill, ₹ balance highlight if overdue.
- Empty state: friendly illustration/icon + “No deliveries today — relax!”
- Header action: link to Insights (optional).

---

### 5.4 Customers (`/customers`)
- Sticky search: “Search by name or phone”
- Customer rows: avatar initial circle, name (localized), phone, last job hint.
- FAB or header “Add customer”
- Empty state for new shops.

### 5.5 Customer detail (`/customers/[id]`)
- Name, phone with **Call** and **WhatsApp** action buttons (green WA icon).
- Measurement history grouped by garment type.
- List of past jobs linked to job detail.

---

### 5.6 New Job (`/job/new`) — SINGLE PAGE SCROLL (critical)
**No step wizard. One continuous form with section headings:**

1. **Customer** — Name, 10-digit phone; inline banner “✓ Existing customer” (green) or “New customer — saved on create” (neutral).
2. **Garment** — Grid of emoji tiles (Kurta, Blouse, Shirt, Pant, Salwar, Sherwani, Suit, Lehenga, Saree fall, Dupatta, Petticoat, Kameez, Churidar, Nightgown, Custom). Selected state: primary border + ring.
3. **Measurements** — Dynamic field grid based on garment; section header shows emoji + garment name; **“Customize fields”** opens inline editor:
   - Reorder (↑↓), delete (✕), add from preset dropdown (Chest, Waist, Sleeve…), add custom field name.
   - “Reset to defaults” + “Done”; badge “Saved” when customized.
   - Inputs: numeric, placeholder “in” (inches).
4. **Delivery & pricing** — Date picker (min today), Quoted ₹, Advance ₹ (optional).
5. **Bill preview** — Toggles: “Include GST (5%)”, “Preview sample bill”; live **BillDocument** card:
   - Shop header (name, phone, address), GSTIN or “Bill without GST”
   - Bill #, date, customer
   - Line items table, subtotal, GST line, total, advance, balance due
   - “Sample bill” ribbon when demo mode
6. **Sticky footer:** Primary “Finish” / “Create job” (disabled until required fields valid).

Top: back arrow only (no bottom nav on this screen).

---

### 5.7 Job detail (`/jobs/[id]`)
- Job number + status pill (color-coded FSM):
  - Received → Cutting → Stitching → Trial → Finishing → Ready → Delivered | Cancelled
- Customer block with call/WA.
- Garment, fabric color swatch, measurements read-only.
- Pricing: Quoted / Advance / **Balance** (emphasized).
- Promised date; overdue warning (red) if past due.
- Primary: “Mark next status” (one step forward in FSM).
- Secondary: View receipt, Share on WhatsApp.

---

### 5.8 Receipt / Bill (`/jobs/[id]/receipt`)
- Screen actions: Back, **Print** (print-optimized layout).
- Receipt card: shop header, customer, garment line items, ₹ breakdown.
- Print styles: hide chrome, white background, black text.

---

### 5.9 Calendar (`/calendar`)
- Month grid (Sun–Sat or Mon–Sun — pick one, consistent).
- Dots or chips on days with deliveries; tap day → list below or sheet.
- Navigate prev/next month.

---

### 5.10 Profile (`/profile`)
- Shop name (editable inline).
- **Language** picker: Hindi, English, Marathi, Tamil, Kannada (native script labels).
- **Theme** picker: 4 swatches — Minimal White (default), Vibrant, Green (WhatsApp-inspired), Dark.
- Stats: total orders, lifetime revenue (optional).
- Logout.

---

### 5.11 Login / OTP / Demo gate
- Centered card max-width 420px on soft background.
- Large phone input, prominent CTA.
- Demo mode hint: test phone + OTP visible in muted box (POC only).
- Demo-access: password field + submit, minimal branding.

---

## 6. Component library (design all states)

### 6.1 Buttons
- **Primary:** filled, rounded 10–12px, bold label, min-height 44px.
- **Secondary:** outline surface.
- **Danger:** red outline for delete/remove field.
- **Icon buttons:** 32px for reorder/delete in measurement editor.

### 6.2 Cards
- Surface white/cream on tinted background; border 1px; radius 12–14px; shadow `0 4px 16px rgba(15,23,42,0.08)`.

### 6.3 Job Card (list item)
- Left: garment emoji in rounded square.
- Center: customer name (bold), garment + job #, promised date.
- Right: status pill + ₹ amount.
- Overdue: red left border or “Overdue” badge.
- Entire card tappable.

### 6.4 Status pills
Colors (consistent across themes):
- Received #9CA3AF, Cutting #F59E0B, Stitching #3B82F6, Trial #8B5CF6, Finishing #0EA5E9, Ready #10B981, Delivered #22C55E, Cancelled #EF4444, Overdue #DC2626.

### 6.5 Form inputs
- Full-width, 44px height, 12px horizontal padding, clear focus ring (accent color).
- Labels above field, 13–14px semibold.

### 6.6 Bill document
- Receipt aesthetic: dashed divider under shop header, monospace-friendly bill #, right-aligned amount column, bold total row, thank-you footer bilingual (“Thank you — धन्यवाद”).

### 6.7 Demo banner (optional top strip)
- “Demo mode — sample data” — dismissible or persistent muted bar.

---

## 7. Design system tokens

### 7.1 Typography
- **Font:** System UI stack with **Noto Sans Devanagari** fallback for Hindi/Marathi; support Tamil/Kannada glyphs.
- Page title: 28px semibold.
- Section label: 11–12px uppercase tracking, muted.
- Body: 15px; small meta: 13px.

### 7.2 Spacing scale
4 / 8 / 12 / 20 / 32 / 48 px.

### 7.3 Radii
6 / 10 / 14 / 18px + pill 999px for status chips.

### 7.4 Four themes (deliver separate artboards or token tables)

**A. Minimal White (default)**  
Background #F8F9FB, Surface #FFFFFF, Primary #111827, Accent #4F46E5, Text muted #6B7280, Border #E5E7EB.

**B. Vibrant (Bahi-khata)**  
Background #FFF7E6, Primary #B23A48 (marigold-red), Accent #2E86AB (peacock blue), warm borders #F0E2C8.

**C. Green (WhatsApp-inspired)**  
Primary #25D366-ish green, chat-bubble card surfaces, familiar to WA users.

**D. Dark**  
Background #0F172A, Surface #1E293B, Primary light on dark, reduced eye strain for evening shop.

Each theme: map all status colors + WhatsApp green #25D366 for share buttons.

---

## 8. Responsive breakpoints

| Breakpoint | Behavior |
|------------|----------|
| 320–390px | Single column; bottom nav; dashboard 1-col grid; garment grid 3–4 cols |
| 391–767px | Same; slightly wider cards |
| 768–1023px | Optional 2-col dashboard; more horizontal padding 24px |
| 1024px+ | Sidebar nav; no bottom nav; dashboard 2×2 grid; content max 1100px |

Safe areas: respect `env(safe-area-inset-bottom)` on iPhone for bottom nav.

---

## 9. Localization & content

- Design **Hindi (default)** and **English** variants for key screens (Dashboard, New Job, Bill).
- Show native script in language picker: हिन्दी, English, मराठी, தமிழ், ಕನ್ನಡ.
- ₹ formatting: `₹2,48,500` (Indian grouping).
- Dates: “19 May 2026” or localized equivalent.

---

## 10. Key user flows (prototype links)

1. Login → Dashboard → tap Monthly sales → Analytics → back.
2. Dashboard → tap Today order row → Job detail → Receipt → Print preview.
3. FAB New Job → fill customer → tap Pant → enter waist/length → toggle GST bill → Finish.
4. Customers → search → Customer detail → Call / WhatsApp.
5. Profile → switch theme Vibrant → switch language Hindi → return Dashboard (show localized nav).

---

## 11. Empty, loading, error states

- **Loading:** centered “Loading…” muted text (no flashy skeleton required for POC).
- **Empty lists:** icon + one-line encouragement in local language.
- **Form errors:** red inline alert below form (“Could not create job”).
- **404 job:** friendly message + back to Today.

---

## 12. Explicitly avoid

- Multi-step wizard with “Next/Back” for new job (use single scroll).
- English-only jargon: “CRM”, “Pipeline”, “SKU”.
- Tiny 12px body text or &lt;40px touch targets.
- Dark patterns, ads, consumer marketplace map/browse tailor UI.
- Stock photos of Western offices; if illustrations, use Indian small-shop context.
- Competing FABs (only one central “+” in bottom nav).

---

## 13. Deliverables requested from Stitch

1. **Mobile-first** frames (390×844) for all §5 screens + component states.
2. **Desktop** frames (1280×800) for Dashboard, New Job, Job detail, Analytics.
3. **Design system page:** colors, type, spacing, buttons, inputs, cards, status pills, bill component.
4. **Four theme variants** for Dashboard + New Job (at minimum Minimal + Vibrant).
5. **Interactive prototype** linking flows in §10.
6. **Handoff notes:** CSS variable names matching `data-theme` attributes; component names for dev (AppShell, JobCardManifest, BillDocument, MeasurementFields).

---

## 14. Implementation reference (for dev alignment)

Stack: Next.js 15 App Router, CSS Modules + CSS variables, no Tailwind requirement in final code but token values above should match. Icons: emoji for garments; simple Unicode or SVG for nav. Charts: bar chart for analytics. PWA-friendly, `100dvh` full viewport.

Product name in UI: **Naap Book** (not StitchIt — StitchIt is a separate future consumer app in the same monorepo).

---

END OF BRIEF. Generate polished, production-ready UI mockups following this spec exactly.
```

---

## How to use in Google Stitch

1. Open [Google Stitch](https://stitch.withgoogle.com) (or your Workspace Stitch entry point).
2. Start a **new project** named `Naap Book Web`.
3. Paste the prompt block above as the **initial design brief**.
4. Follow up with per-screen prompts if needed, e.g. *“Generate mobile frame for §5.6 New Job with Customize fields panel expanded.”*
5. Export frames (PNG/Figma) and share with dev to map to `naap-book/website/src/app/(app)/`.

## Sync with current codebase

| Stitch screen | Code route |
|---------------|------------|
| Dashboard | `/dashboard` |
| Analytics | `/analytics` |
| Today | `/today` |
| New Job | `/job/new` |
| Job detail | `/jobs/[id]` |
| Receipt | `/jobs/[id]/receipt` |
| Customers | `/customers` |
| Calendar | `/calendar` |
| Profile | `/profile` |

Update this file when routes or UX change.
