<template>
  <article
    class="product-card"
    :class="{ 'product-card--selected': selected, 'product-card--blocked': blocked }"
  >
    <div class="product-card__cover" :style="{ background: coverColor }" />
    <div class="product-card__body">
      <ProductLogo :name="product.name" :logo-url="product.logo_url" />
      <h2 class="txt-headline-m-bold text-main product-card__name">{{ product.name }}</h2>
      <RatingStars :value="overallRating(product)" show-value />
      <p class="txt-body-s-regular text-subtle">{{ startingPriceLabel(product) }}</p>
      <p class="txt-body-s-medium text-primary">{{ product.category }} software</p>
      <label class="product-card__select txt-body-s-semibold">
        <input
          class="omr-focus"
          type="checkbox"
          :checked="selected"
          :disabled="blocked"
          :aria-label="checkboxLabel"
          @change="emit('toggle', product.id)"
        >
        {{ checkboxCopy }}
      </label>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import { overallRating, startingPriceLabel } from '~/utils/format'

const props = defineProps<{
  product: Product
  selected: boolean
  blocked: boolean
}>()

const emit = defineEmits<{
  toggle: [id: string]
}>()

const COVER = [
  'var(--background-color-primary-main)',
  'var(--background-color-secondary-main)',
  'var(--background-color-primary-subtle)',
  'var(--background-color-primary-strong)'
]

function hashName(value: string) {
  let hash = 0
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) % 997
  return hash
}

const coverColor = computed(() => COVER[hashName(props.product.name) % COVER.length])

const checkboxCopy = computed(() => {
  if (props.selected) return 'Selected'
  if (props.blocked) return 'Limit reached'
  return 'Compare'
})

const checkboxLabel = computed(() => {
  if (props.selected) return `Remove ${props.product.name} from comparison`
  if (props.blocked) return `${props.product.name} cannot be added. Remove a selected tool first.`
  return `Add ${props.product.name} to comparison`
})
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: var(--background-color-surface-elevation-1);
  border: 1px solid var(--border-color-main);
  border-radius: var(--radius-lg);
  overflow: hidden;
  padding-bottom: 20px;
  transition: var(--transition-border), var(--transition-background);
}

.product-card--selected {
  background: var(--background-color-primary-subtlest);
  border-color: var(--border-color-selected);
}

.product-card--blocked {
  opacity: 0.72;
}

.product-card__cover {
  height: 72px;
  width: 100%;
  filter: blur(28px);
  transform: scale(1.4);
  opacity: 0.55;
}

.product-card__body {
  margin-top: -32px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
}

.product-card__name {
  min-height: 44px;
  display: flex;
  align-items: center;
  text-wrap: balance;
}

.product-card__select {
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.product-card--blocked .product-card__select {
  cursor: not-allowed;
}
</style>
