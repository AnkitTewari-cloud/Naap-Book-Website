# Missing demo screens — design spec (generated for implementation)

No Stitch `code.html` exists for these routes. UI follows **Naap Book Refined** / **Midnight Pro** tokens (`stitch-tokens.css`, `MaterialIcon`, 14px cards, `stitch-page-pattern`).

## Batch 1 (in progress)

| Route | Goal |
|-------|------|
| `/job/new` | Single-scroll form: customer → garment grid → measurements → pricing → bill preview → sticky save |
| `/jobs/[id]` | Status pipeline, customer contact row, garment/fabric/pricing cards, receipt link |
| `/customers/[id]` | Hero + measurements grid + job history + new job CTA |

## Batch 2 (queued)

| Route | Goal |
|-------|------|
| `/jobs/[id]/receipt` | Print-friendly bill card, share WA, back to job |
| `/customers/new` | Minimal form matching customers directory chrome |
| `/insights` | Samajh layout like `/analytics` (KPI + takeaway cards), no legacy Header/Card |

## Shared patterns

- Page root: `className="stitch-page-pattern"` (inherits from AppShell main on most routes; full-bleed `/job/new` adds locally)
- Section label: 12px uppercase semibold, `--color-text-muted`
- Cards: `--color-surface`, border `--color-border`, radius 14px, `--shadow-card`
- Primary CTA: `--color-primary` / white text
- Secondary actions: green `#006d2f` or lavender `#c3c0ff` in dark mode
