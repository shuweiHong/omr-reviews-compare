npm install
npm run dev

Open http://localhost:3000

# OMR Reviews — product compare

Nuxt 3 + Vue 3 slice of an OMR Reviews category page. Select up to 3 CRM tools, then compare ratings, pricing, and buyer attributes side by side.

## Scripts

- `npm run dev` — local app
- `npm test` — selection, missing-data, and lead-cell tests
- `npm run build` — production build
- `npm run lint` — TypeScript check

## What is in the repo

- `docs/part-1-data-model.md` — Part 1 ER sketch and the four modelling questions
- `docs/decision-log.md` — trade-offs for both parts
- `data/seed/products.json` — supplied CRM catalogue (values are illustrative)
- `server/api/products.get.ts` — local data layer over that seed
- `assets/omr/` — OMR design tokens copied from the take-home design system

Seed values are illustrative, not authoritative. Do not quote them as fact.
