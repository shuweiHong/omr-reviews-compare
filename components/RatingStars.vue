<template>
  <span v-if="value == null" class="txt-body-s-regular text-subtlest">Not rated yet</span>
  <div v-else class="stars" :aria-label="`Rated ${value.toFixed(1)} out of 5`">
    <svg
      v-for="index in 5"
      :key="index"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <defs>
        <clipPath :id="clipId(index)">
          <rect x="0" y="0" :width="24 * fraction(index)" height="24" />
        </clipPath>
      </defs>
      <polygon :points="STAR" :fill="emptyFill" />
      <polygon :points="STAR" :fill="yellowFill" :clip-path="`url(#${clipId(index)})`" />
    </svg>
    <span v-if="showValue" class="txt-body-s-bold text-main tabular">
      {{ value.toFixed(1) }}
    </span>
  </div>
</template>

<script setup lang="ts">
const STAR = '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'
const yellowFill = 'var(--graphic-color-secondary-strong, var(--background-color-secondary-strong))'
const emptyFill = 'var(--background-color-surface-elevation-4)'

const props = withDefaults(defineProps<{
  value: number | null
  showValue?: boolean
}>(), {
  showValue: false
})

const uid = useId()

function clipId(index: number) {
  return `star-${uid}-${index}`
}

function fraction(index: number) {
  if (props.value == null) return 0
  return Math.max(0, Math.min(1, props.value - (index - 1)))
}
</script>

<style scoped>
.stars {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.stars svg {
  display: block;
}

.tabular {
  font-variant-numeric: tabular-nums;
}
</style>
