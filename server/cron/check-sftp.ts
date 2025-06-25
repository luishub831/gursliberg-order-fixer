// import { checkSFTPAndSendNewFiles } from '../utils/sftpWatcher'

// export default defineEventHandler(async () => {
//   console.log('[nuxt-cron] 🔄 Running SFTP check at', new Date().toISOString())
//   await checkSFTPAndSendNewFiles()
// })

import { defineCronHandler } from '#nuxt/cron'
import { checkSFTPAndSendNewFiles } from '../utils/sftpWatcher'

export default defineCronHandler('hourly', async() => {
  // do action
  console.log('[nuxt-cron] 🔄 Running SFTP check at', new Date().toISOString())
  await checkSFTPAndSendNewFiles()
})