import { getShopifyOrderByNumber } from '~/server/utils/shopify'
import { createRequire } from 'module'
import SFTPClient from 'ssh2-sftp-client'
import { Readable } from 'stream'

import { formatOrder } from '~/server/utils/formatter'


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const orderNumber = body.orderId

  if (!orderNumber) {
    throw createError({ statusCode: 400, message: 'Order number is required' })
  }

  try {
    // 1. Fetch order
    const order = await getShopifyOrderByNumber(orderNumber)

    // 2. Format
    const formatted = formatOrder(order)
    const stream = Readable.from([formatted])

    // 3. Connect to SFTP
    const sftp = new SFTPClient()
    await sftp.connect({
      host: config.sftpHost,
      port: Number(config.sftpPort),
      username: config.sftpUser,
      password: config.sftpPass
    })

    // 4. Build remote path
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '.')
    const filename = `N8999869.Gursliberg.${date}.${order.order_number}.txt`
    const remotePath = `${config.sftpGeneratedDir}/${filename}`

    // 5. Upload in memory
    await sftp.put(stream, remotePath)
    await sftp.end()

    return {
      message: `✅ File uploaded to SFTP: ${filename}`,
      file: filename,
      path: remotePath
    }
  } catch (err) {
    console.error('[generate-file error]', err)
    throw createError({ statusCode: 500, message: 'Failed to upload file' })
  }
})
