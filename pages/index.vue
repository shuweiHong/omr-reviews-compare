<template>
  <main class="page-gutter">
    <p class="txt-label-m-bold-uppercase text-primary">CRM software</p>
    <h1 class="txt-headline-l-bold text-main page-title">
      Compare CRM tools side by side
    </h1>
    <p class="txt-body-m-regular text-subtle page-lead">
      Shortlist up to {{ MAX_COMPARE }} tools. Then check ratings, pricing, and the attributes B2B buyers actually argue about.
    </p>

    <p v-if="pending" class="txt-body-m-regular text-subtle status">Loading the CRM catalogue.</p>
    <div v-else-if="error" class="status">
      <p class="txt-body-m-regular text-error">We could not load the catalogue. Refresh the page and try again.</p>
    </div>
    <section v-else class="product-grid" aria-label="CRM tools">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :selected="selectedIds.includes(product.id)"
        :blocked="isBlocked(product.id)"
        @toggle="toggle"
      />
    </section>
  </main>
  <CompareBar
    :selected-ids="selectedIds"
    :names="selectedNames"
    :compare-ready="compareReady"
    :notice="notice"
    @compare="openCompare"
    @clear="clear"
  />
</template>

<script setup lang="ts">
import { MAX_COMPARE, serializeIdsParam } from '~/utils/selection'

const { data, pending, error } = await useProductCatalogue('CRM')
const products = computed(() => data.value ?? [])
const knownIds = computed(() => products.value.map((product) => product.id))
const { selectedIds, notice, compareReady, toggle, clear } = useCompareSelection(knownIds)

const selectedNames = computed(() =>
  selectedIds.value
    .map((id) => products.value.find((product) => product.id === id)?.name)
    .filter((name): name is string => Boolean(name))
)

function isBlocked(id: string) {
  return !selectedIds.value.includes(id) && selectedIds.value.length >= MAX_COMPARE
}

function openCompare() {
  if (!compareReady.value) return
  void navigateTo({ path: '/compare', query: { ids: serializeIdsParam(selectedIds.value) } })
}
</script>

<style scoped>
.page-title {
  margin-top: 8px;
  text-wrap: balance;
}

.page-lead {
  margin-top: 8px;
  max-width: 42rem;
}

.status {
  margin-top: 32px;
}

.product-grid {
  margin-top: 32px;
}
</style>
