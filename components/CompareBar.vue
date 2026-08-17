<template>
  <div class="sticky-compare-bar">
    <div class="bar">
      <div class="bar__copy">
        <p class="txt-body-m-semibold text-main">{{ countLabel }}</p>
        <p class="txt-body-s-regular" :class="notice ? 'text-warning' : 'text-subtle'">
          {{ notice || helper }}
        </p>
        <ul v-if="names.length" class="bar__picks">
          <li v-for="name in names" :key="name" class="txt-label-s-medium text-selected">
            {{ name }}
          </li>
        </ul>
      </div>
      <div class="bar__actions">
        <OmButton v-if="selectedIds.length" variant="outline" @click="emit('clear')">
          Clear selection
        </OmButton>
        <OmButton :disabled="!compareReady" @click="emit('compare')">
          Compare tools
        </OmButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { allowedSelectionCopy, MAX_COMPARE, MIN_COMPARE } from '~/utils/selection'

const props = defineProps<{
  selectedIds: string[]
  names: string[]
  compareReady: boolean
  notice: string
}>()

const emit = defineEmits<{
  compare: []
  clear: []
}>()

const countLabel = computed(() => {
  const count = props.selectedIds.length
  if (count === 0) return 'No tools selected yet'
  if (count === 1) return `1 of ${MAX_COMPARE} tools selected`
  return `${count} of ${MAX_COMPARE} tools selected`
})

const helper = computed(() => {
  const count = props.selectedIds.length
  const remaining = MAX_COMPARE - count
  const needed = MIN_COMPARE - count
  if (count === 0) return `Pick ${allowedSelectionCopy()} CRM tools to line them up side by side.`
  if (count < MIN_COMPARE) {
    return needed === 1
      ? `Add one more tool. A comparison needs at least ${MIN_COMPARE}.`
      : `Add ${needed} more tools. A comparison needs at least ${MIN_COMPARE}.`
  }
  if (remaining > 0) {
    return remaining === 1
      ? 'Ready to compare. You can still add one more.'
      : `Ready to compare. You can still add ${remaining} more.`
  }
  return 'That is the maximum. Open the comparison, or remove a tool first.'
})
</script>

<style scoped>
.bar {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-block: 12px;
}

.bar__copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.bar__picks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
}

.bar__actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .bar {
    flex-direction: column;
    align-items: stretch;
  }

  .bar__actions :deep(.omr-btn) {
    width: 100%;
    min-width: 0;
  }
}
</style>
