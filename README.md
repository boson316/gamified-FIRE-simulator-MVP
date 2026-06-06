# FIRE Gamification Simulator

**Languages:** [English](README.md) · [中文](README.zh-TW.md)

Gamified compound-interest simulator with slider-driven UI, animated totals, growth chart, and investment-philosophy achievement badges.

## Stack

- Next.js 16 · React 19 · TypeScript
- Tailwind CSS 4 · Framer Motion · canvas-confetti
- LocalStorage for unlocked achievements (no backend)

## Quick start

```powershell
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```powershell
# Unit tests (compound math, Excel FV parity < 0.01%)
cd web
npm run test

# Production build
npm run build

# Repo-level smoke (from project root)
cd ..
python -m pytest -q
```

## MVP features

| Area | Status |
|------|--------|
| Compound simulation (principal + monthly + rate + years) | Done |
| Slider inputs + animated final asset number | Done |
| Yearly growth bar chart (Framer Motion) | Done |
| 5 achievements incl. Zero to One, Lollapalooza (hidden + confetti) | Done |
| LocalStorage persistence | Done |
| Inflation / allocation / multi-currency | Out of scope |

## Project layout

```
web/
├── src/lib/compound.ts      # Core simulation
├── src/lib/achievements.ts  # Rule engine + badges
└── src/components/          # Simulator UI
```

## Deploy

Static-friendly Next.js app — deploy `web/` to Vercel:

```powershell
cd web
npm run build
```

## Related

- Portfolio sprint plan: `作品集_五專案衝刺規劃.md` §7
- Reusable DCA math reference: `cursor/3_Web與API/fin-tools-tw/dca/js/calc.js`
