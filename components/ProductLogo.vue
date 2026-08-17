<template>
  <div
    class="logo-frame"
    :style="resolvedUrl ? undefined : { background: markColor }"
  >
    <img
      v-if="resolvedUrl"
      :src="resolvedUrl"
      :alt="`${name} logo`"
      referrerpolicy="no-referrer"
      @error="failed = true"
    >
    <span v-else class="txt-headline-m-bold text-solid-inverse" aria-hidden="true">
      {{ letterMark(name) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { letterMark } from '~/utils/format'

const MARK_COLORS = [
  'var(--background-color-primary-main)',
  'var(--background-color-primary-strong)',
  'var(--background-color-primary-stronger)',
  'var(--background-color-primary-strongest)'
]

const props = defineProps<{
  name: string
  logoUrl: string | null
}>()

const failed = ref(false)
const resolvedUrl = computed(() => (failed.value ? null : props.logoUrl))

function hashName(value: string) {
  let hash = 0
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) % 997
  return hash
}

const markColor = computed(() => MARK_COLORS[hashName(props.name) % MARK_COLORS.length])
</script>
