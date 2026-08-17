<template>
  <main class="page-gutter">
    <NuxtLink :to="{ path: '/', query: idsQuery }" class="txt-body-s-semibold text-link-primary omr-focus">
      Back to CRM tools
    </NuxtLink>

    <p v-if="pending" class="txt-body-m-regular text-subtle status">Loading comparison.</p>

    <div v-else-if="products.length < MIN_COMPARE" class="empty">
      <h1 class="txt-headline-l-bold text-main">Pick at least two tools first</h1>
      <p class="txt-body-m-regular text-subtle empty-copy">
        A side-by-side view only helps once you have a shortlist. Go back to the CRM list and select 2 or 3 tools.
      </p>
      <OmButton class="empty-action" @click="navigateTo('/')">Browse CRM tools</OmButton>
    </div>

    <template v-else>
      <p class="txt-label-m-bold-uppercase text-primary kicker">Comparison</p>
      <h1 class="txt-headline-l-bold text-main page-title">{{ heading }}</h1>
      <p class="txt-body-m-regular text-subtle page-lead">
        Ratings, pricing tiers, and buyer checks in one table. Scroll sideways on a narrow screen. The left column stays put.
      </p>
      <div class="toolbar">
        <OmButton variant="outline" @click="copyLink">{{ copied ? 'Link copied' : 'Copy link' }}</OmButton>
      </div>
      <div class="table-wrap">
        <ComparisonTable :products="products" @remove="removeFromCompare" />
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import { MIN_COMPARE, parseIdsParam, serializeIdsParam } from '~/utils/selection'

const route = useRoute()
const router = useRouter()
const copied = ref(false)
const { data, pending } = await useProductCatalogue('CRM')

const catalogue = computed(() => data.value ?? [])
const knownIds = computed(() => catalogue.value.map((product) => product.id))
const selectedIds = computed(() => parseIdsParam(route.query.ids, knownIds.value))
const products = computed(() =>
  selectedIds.value
    .map((id) => catalogue.value.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product))
)
const idsQuery = computed(() => (selectedIds.value.length ? { ids: serializeIdsParam(selectedIds.value) } : {}))

const heading = computed(() => {
  const names = products.value.map((product) => product.name)
  if (names.length === 2) return `${names[0]} vs ${names[1]}`
  if (names.length === 3) return `${names[0]}, ${names[1]}, and ${names[2]}`
  return 'Compare CRM tools'
})

function removeFromCompare(id: string) {
  const next = selectedIds.value.filter((item) => item !== id)
  void router.replace({ query: next.length ? { ids: serializeIdsParam(next) } : {} })
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    copied.value = false
  }
}
</script>

<style scoped>
.status,
.empty {
  margin-top: 48px;
}

.empty-copy {
  margin-top: 8px;
  max-width: 36rem;
}

.empty-action {
  margin-top: 24px;
}

.kicker {
  margin-top: 16px;
}

.page-title {
  margin-top: 8px;
  text-wrap: balance;
}

.page-lead {
  margin-top: 8px;
  max-width: 42rem;
}

.toolbar {
  margin-top: 24px;
}

.table-wrap {
  margin-top: 24px;
}
</style>
