# Decision log

One page covering both parts.

## Build decisions

1. **Reviews carry a category, not just a product.** A product can sit in several categories, and each category has its own rating dimensions. The review therefore stores `category_id`. Otherwise HubSpot-in-CRM and HubSpot-in-Marketing would share one undifferentiated score blob.

2. **Nuxt 3 + Vue 3, official scaffolder.** Closest to OMR production. Design-system tokens live in `assets/omr`. I skipped Tailwind: the token file already ships `txt-*`, surface, and radius utilities, and a second utility layer would fight the system we were asked to use.

3. **Selection lives in the URL (`?ids=`).** Refresh and a shared link keep the same shortlist. Local-only state would be simpler, but a buyer sending “look at these two” is the actual job of compare. A 4th pick is blocked, not queued. Compare stays disabled below 2 tools.

4. **Missing data stays missing.** No logo becomes a letter-mark. A missing rating dimension renders “Not rated yet”, not 0.0 stars. `null` prices read “Price on request”. Inventing a score would be worse than a gap.

5. **Highlight the lead cell, not every Yes.** Highest rating and lowest starting price get a quiet surface tint. Ties stay unmarked. One brand fill on the page is the selected card and the primary Compare button.

## What the assistant produced that I changed

The first ER sketch linked products to categories, and reviews only to the product. That looked fine until I walked question 2: if HubSpot is in CRM and Marketing, which dimension set does a review use? You cannot recover that from `PRODUCT_CATEGORY`. I added `REVIEW.category_id` so a review is scored in one category context, and the write path must reject a dimension that does not belong to that category. I kept the rest of the AI’s `REVIEWABLE` split. I threw away the “infer the schema from the product’s categories” version.

## If I had another day

A copy-link confirmation that survives a refresh, a loading skeleton for logo fetches, and `nuxt typecheck` in CI. I would not add extra categories or a fake questionnaire. The brief said to cut scope, not inflate it.
