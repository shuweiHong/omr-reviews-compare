# Part 1 — Core data model

Sketch only. No database in this exercise. Cardinalities are what I would defend in the walkthrough.

```mermaid
erDiagram
    VENDOR ||--o{ PRODUCT : publishes
    REVIEWABLE ||--o| PRODUCT : "is a"
    REVIEWABLE ||--o| PARTNER : "is a"
    REVIEWABLE ||--o| EVENT : "is a"
    CATEGORY |o--o{ CATEGORY : nests
    PRODUCT ||--o{ PRODUCT_CATEGORY : "in"
    CATEGORY ||--o{ PRODUCT_CATEGORY : lists
    REVIEWABLE ||--o{ REVIEW : receives
    REVIEWER ||--o{ REVIEW : writes
    CATEGORY ||--o{ REVIEW : "rated in"
    CATEGORY ||--o{ CATEGORY_DIMENSION : uses
    RATING_DIMENSION ||--o{ CATEGORY_DIMENSION : applies
    REVIEW ||--o{ REVIEW_RATING : "has"
    RATING_DIMENSION ||--o{ REVIEW_RATING : scored
    PARTNER ||--o{ PARTNER_PRODUCT : specialises
    PRODUCT ||--o{ PARTNER_PRODUCT : "served by"
    PARTNER ||--o{ PARTNER_CATEGORY : specialises
    CATEGORY ||--o{ PARTNER_CATEGORY : "served by"

    VENDOR {
        string id PK
        string name
    }
    REVIEWABLE {
        string id PK
        string reviewable_kind
    }
    PRODUCT {
        string id PK, FK
        string vendor_id FK
        string name
        string logo_url
    }
    PARTNER {
        string id PK, FK
        string name
        string kind
    }
    EVENT {
        string id PK, FK
        string name
        date starts_on
    }
    CATEGORY {
        string id PK
        string name
        string parent_id FK
    }
    PRODUCT_CATEGORY {
        string product_id PK, FK
        string category_id PK, FK
    }
    RATING_DIMENSION {
        string id PK
        string slug
        string label
    }
    CATEGORY_DIMENSION {
        string category_id PK, FK
        string dimension_id PK, FK
    }
    REVIEWER {
        string id PK
        string display_name
    }
    REVIEW {
        string id PK
        string reviewable_id FK
        string reviewer_id FK
        string category_id FK
        string body
        date created_on
    }
    REVIEW_RATING {
        string review_id PK, FK
        string dimension_id PK, FK
        float score
    }
    PARTNER_PRODUCT {
        string partner_id PK, FK
        string product_id PK, FK
        string role
    }
    PARTNER_CATEGORY {
        string partner_id PK, FK
        string category_id PK, FK
    }
```

`REVIEWABLE.reviewable_kind` is `product` | `partner` | `event`. `PRODUCT.id`, `PARTNER.id`, and `EVENT.id` reuse the `REVIEWABLE` id (joined subtype, 1:1). Exactly one subtype row exists for a reviewable. That is an application invariant, not a second foreign key on `REVIEW`.

---

## The four questions

**1. Several categories, and categories may nest.**  
`CATEGORY.parent_id` is a nullable self-FK: **0..1 parent**, **0..N children**. Root categories have `parent_id = null`, so the parent side is not mandatory. Products sit in many categories through `PRODUCT_CATEGORY` (`M:N`). Nesting is a tree, not a DAG: at most one parent keeps breadcrumbs and “CRM → Sales CRM” simple. If a category later needs two parents, replace the FK with a category-edge table.

**2. Dimensions differ by category, and stay out of the review.**  
`RATING_DIMENSION` is the catalogue of what we *can* measure (`lead_management`, `deliverability`, `ease_of_use`). `CATEGORY_DIMENSION` says which of those apply to a category. The review itself is text + who + when. Scores live in `REVIEW_RATING` (`REVIEW 1:N REVIEW_RATING`). Adding a CRM-only dimension does not change the review table. A review also stores `category_id`: HubSpot listed under CRM and Marketing is rated with that page’s dimension set, not a blob of mixed scores. Write path should reject a `REVIEW_RATING` whose dimension is not in that category’s set.

**3. Tools, partners, and later events, without copying review machinery.**  
Reviews point at `REVIEWABLE`, not at `PRODUCT` or `PARTNER`. A new type is a new subtype table plus a `reviewable_kind` value. `REVIEW` / `REVIEW_RATING` stay unchanged. Vendor is *not* reviewable: a vendor publishes products (`VENDOR 1:N PRODUCT`). I considered a single table with nullable columns for every type and rejected it. That gets cheaper on day one and expensive the first time events appear.

**4. A partner that specialises in a tool or a category.**  
Two join tables, both `M:N`: `PARTNER_PRODUCT` (for example a HubSpot implementation partner, `role` = implementation | reseller) and `PARTNER_CATEGORY` (specialised in CRM). Specialisation is not the same as “this partner *is* a CRM product”, so it is not reused from `PRODUCT_CATEGORY`.

---

## What I left out

Pricing tiers, feature attributes, and the questionnaire are catalogue or UI concerns (Part 2 seed). They are not required to answer the four questions. Aggregates (average ease of use on a category page) are queries over `REVIEW_RATING`, not extra entities.
