// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  runtimeConfig: {
    shopifyDomain: process.env.SHOPIFY_STORE_DOMAIN,
    shopifyApiVersion: process.env.SHOPIFY_API_VERSION,
    shopifyAdminToken: process.env.SHOPIFY_ADMIN_API_KEY,
    // Private (server-only)
    sftpHost: process.env.SFTP_HOST,
    sftpPort: process.env.SFTP_PORT,
    sftpUser: process.env.SFTP_USER,
    sftpPass: process.env.SFTP_PASS,
    sftpRemoteDir: process.env.SFTP_REMOTE_DIR,
    sftpGeneratedDir: process.env.SFTP_GENERATED_DIR,
  
    mailersendApiKey: process.env.MAILERSEND_API_KEY,
    emailFrom: process.env.EMAIL_FROM,
    emailTo: process.env.EMAIL_TO
  },
  cron: {
    runOnInit: true,
    timeZone: 'Africa/Abidjan',
    jobsDir: 'cron'
  },

  modules: ['@nuxtjs/tailwindcss', 'nuxt-cron']
})