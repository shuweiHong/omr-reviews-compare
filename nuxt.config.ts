export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/omr/styles.css', '~/assets/app.css'],
  typescript: {
    strict: true,
    typeCheck: false
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'CRM software | OMR Reviews'
    }
  }
})
