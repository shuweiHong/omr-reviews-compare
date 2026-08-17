<template>
  <button
    class="omr-btn omr-focus txt-body-m-bold"
    :class="[`omr-btn--${variant}`, { 'omr-btn--full': fullWidth }]"
    :disabled="disabled"
    type="button"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
  fullWidth?: boolean
}>(), {
  variant: 'primary',
  disabled: false,
  fullWidth: false
})
</script>

<style scoped>
.omr-btn {
  height: 48px;
  min-width: 160px;
  padding: 0 18px;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: var(--transition-background), var(--transition-border), var(--transition-color);
}

.omr-btn--primary {
  background: var(--background-color-button-primary-color, var(--background-color-primary-main));
  color: var(--text-color-inverse);
}

.omr-btn--secondary {
  background: var(--background-color-button-secondary-color, var(--background-color-primary-subtlest));
  color: var(--text-color-primary);
  border-color: var(--border-color-primary);
}

.omr-btn--outline {
  background: transparent;
  color: var(--text-color-main);
  border-color: var(--border-color-strong);
}

.omr-btn--full {
  width: 100%;
}

.omr-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
