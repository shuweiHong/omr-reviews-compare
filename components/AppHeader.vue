<template>
  <header class="site-header">
    <div class="site-header__inner">
      <NuxtLink to="/" class="site-header__brand omr-focus">
        <img src="/omr-reviews-logo.svg" alt="OMR Reviews" height="28" width="160">
      </NuxtLink>
      <p class="txt-label-m-medium text-subtle">CRM software</p>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  border-bottom: 1px solid var(--border-color-main);
  background: var(--background-color-surface);
}

.site-header__inner {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.site-header__brand {
  display: inline-flex;
  align-items: center;
}
</style>
