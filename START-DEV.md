# Start the website

## What happened when you clicked 127.0.0.1

Your terminal showed:

1. `○ Compiling /middleware ...`
2. Then **`JavaScript heap out of memory`** — the server **crashed**, so the browser could not load.

That is usually because **several old dev servers** were still running (ports 3000, 3001, 3002) and used all RAM.

---

## Fix (do this once)

### Option A — double-click

In **The Tailor App** folder, run **`START-WEBSITE.bat`** (kills old ports, starts one server with more memory).

### Option B — terminal (you are in `website>`)

```powershell
npm.cmd run dev
```

Use the **exact URL** printed (e.g. `http://127.0.0.1:3002`).  
Wait until you see **`✓ Compiled /`** in the terminal, not only `Ready`.

---

## Rules

- Use **`npm.cmd`**, never `npm run` alone in PowerShell.
- From `website>` run **`npm.cmd run dev`** only (not `naapbook:website`).
- Only **one** dev terminal open at a time.
