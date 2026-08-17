<template>
  <div class="compare-scroll">
    <table class="compare-table">
      <thead>
        <tr>
          <th class="txt-label-m-bold text-subtle" scope="col">{{ '' }}</th>
          <th v-for="product in products" :key="product.id" scope="col">
            <div class="head">
              <ProductLogo :name="product.name" :logo-url="product.logo_url" />
              <p class="txt-headline-s-bold text-main">{{ product.name }}</p>
              <button
                class="txt-body-s-semibold text-link-primary omr-focus unstyle"
                type="button"
                @click="emit('remove', product.id)"
              >
                Remove
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th class="txt-label-m-semibold text-subtle" scope="row">Overall rating</th>
          <td
            v-for="product in products"
            :key="`${product.id}-overall`"
            :class="{ 'is-lead': overallLeads.includes(product.id) }"
          >
            <RatingStars :value="overallRating(product)" show-value />
            <p v-if="overallLeads.includes(product.id)" class="txt-label-s-bold-uppercase text-selected lead-label">
              Highest
            </p>
          </td>
        </tr>
        <tr v-for="dimension in RATING_DIMENSIONS" :key="dimension.key">
          <th class="txt-label-m-semibold text-subtle" scope="row">{{ dimension.label }}</th>
          <td
            v-for="product in products"
            :key="`${product.id}-${dimension.key}`"
            :class="{ 'is-lead': ratingLeads[dimension.key]?.includes(product.id) }"
          >
            <RatingStars :value="ratingOrNull(product.ratings[dimension.key])" show-value />
          </td>
        </tr>
        <tr>
          <th class="txt-label-m-semibold text-subtle" scope="row">Starting price</th>
          <td
            v-for="product in products"
            :key="`${product.id}-start`"
            :class="{ 'is-lead': priceLeads.includes(product.id) }"
          >
            <span class="txt-body-s-regular text-main">{{ startingPriceLabel(product) }}</span>
          </td>
        </tr>
        <tr>
          <th class="txt-label-m-semibold text-subtle" scope="row">Pricing tiers</th>
          <td v-for="product in products" :key="`${product.id}-price`">
            <ul class="tier-list">
              <li
                v-for="tier in product.pricing_tiers"
                :key="tier.name"
                class="txt-body-s-regular text-main"
              >
                <span class="txt-body-s-semibold">{{ tier.name }}.</span>
                {{ formatEuroPerMonth(tier.price_eur_month) }}
              </li>
            </ul>
          </td>
        </tr>
        <tr v-for="row in ATTRIBUTE_ROWS" :key="row.key">
          <th class="txt-label-m-semibold text-subtle" scope="row">{{ row.label }}</th>
          <td v-for="product in products" :key="`${product.id}-${row.key}`" class="txt-body-s-regular text-main">
            {{ row.value(product) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import { RATING_DIMENSIONS } from '~/types/product'
import { idsWithHighest, idsWithLowest } from '~/utils/compare'
import {
  formatEuroPerMonth,
  formatLanguages,
  formatYesNo,
  overallRating,
  ratingOrNull,
  startingPrice,
  startingPriceLabel
} from '~/utils/format'

const props = defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const ATTRIBUTE_ROWS = [
  { key: 'free_trial', label: 'Free trial', value: (product: Product) => formatYesNo(product.attributes.free_trial) },
  { key: 'hosting', label: 'Hosting', value: (product: Product) => product.attributes.hosting },
  { key: 'eu_data_center', label: 'EU data centre', value: (product: Product) => formatYesNo(product.attributes.eu_data_center) },
  { key: 'gdpr', label: 'GDPR ready', value: (product: Product) => formatYesNo(product.attributes.gdpr_compliant) },
  { key: 'iso', label: 'ISO 27001', value: (product: Product) => formatYesNo(product.attributes.iso_27001) },
  {
    key: 'certs',
    label: 'Certifications',
    value: (product: Product) => product.attributes.certifications.length
      ? product.attributes.certifications.join(', ')
      : 'None listed'
  },
  { key: 'languages', label: 'Languages', value: (product: Product) => formatLanguages(product.attributes.languages) },
  { key: 'api', label: 'API', value: (product: Product) => formatYesNo(product.attributes.api) },
  { key: 'sso', label: 'SSO', value: (product: Product) => formatYesNo(product.attributes.sso) },
  { key: 'mobile', label: 'Mobile app', value: (product: Product) => formatYesNo(product.attributes.mobile_app) },
  { key: 'hq', label: 'HQ country', value: (product: Product) => product.attributes.hq_country }
]

const overallLeads = computed(() =>
  idsWithHighest(props.products.map((product) => ({ id: product.id, value: overallRating(product) })))
)

const ratingLeads = computed(() => {
  const leads: Record<string, string[]> = {}
  for (const dimension of RATING_DIMENSIONS) {
    leads[dimension.key] = idsWithHighest(
      props.products.map((product) => ({
        id: product.id,
        value: ratingOrNull(product.ratings[dimension.key])
      }))
    )
  }
  return leads
})

const priceLeads = computed(() =>
  idsWithLowest(props.products.map((product) => ({ id: product.id, value: startingPrice(product) })))
)
</script>

<style scoped>
.head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-width: 180px;
}

.tier-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.unstyle {
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

.lead-label {
  margin: 6px 0 0;
}

.is-lead {
  background: var(--background-color-primary-subtlest);
}
</style>
