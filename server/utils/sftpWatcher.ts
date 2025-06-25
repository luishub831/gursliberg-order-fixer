import SFTPClient from 'ssh2-sftp-client'
import { MailerSend, EmailParams, Recipient, Sender, Attachment } from 'mailersend'
import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'

const knownFilesPath = './server/utils/knownFiles.json'
let knownFiles: string[] = []

// Load previously sent files
if (fs.existsSync(knownFilesPath)) {
  knownFiles = JSON.parse(fs.readFileSync(knownFilesPath, 'utf-8'))
}

// Ensure local .tmp folder exists
const localDir = path.resolve('./.tmp')
if (!fs.existsSync(localDir)) {
  fs.mkdirSync(localDir, { recursive: true })
}

export async function checkSFTPAndSendNewFiles() {

  const config = useRuntimeConfig()
  const sftp = new SFTPClient()

  const sftpConfig = {
    host: config.sftpHost,
    port: Number(config.sftpPort),
    username: config.sftpUser,
    password: config.sftpPass,
  }
  console.log('sftp', sftpConfig);

  const mailerSend = new MailerSend({ apiKey: config.mailersendApiKey })

  try {
    await sftp.connect(sftpConfig)
    const files = await sftp.list(config.sftpRemoteDir)
    console.log('files', files);
    for (const file of files) {
      if (knownFiles.includes(file.name)) continue

      const localPath = path.join(localDir, file.name)
      console.log(`[⬇] localPath: ${localPath}`)

      // Download new file
      await sftp.fastGet(`${config.sftpRemoteDir}/${file.name}`, localPath)
      console.log(`[⬇] Downloaded: ${file.name}`)

      // Read and encode as Base64
      const buffer = await fsp.readFile(localPath)
      // const attachment = new Attachment(
      //   buffer.toString('base64'),
      //   file.name,
      //   'application/octet-stream'
      // )
      const attachment = new Attachment(
        fs.readFileSync(localPath, { encoding: 'base64' }),
        file.name,
        'attachment'
      )

      const recipient = new Recipient(config.emailTo, 'Recipient')
      const sender = new Sender(config.emailFrom, 'SFTP Bot')

      const emailParams = new EmailParams()
        .setFrom(sender)
        .setTo([recipient])
        .setSubject(`New file received: ${file.name}`)
        .setHtml(`<p>Attached file: <strong>${file.name}</strong></p>`)
        .setAttachments([attachment])

      const res = await mailerSend.email.send(emailParams)
      console.log(`[📨] MailerSend response:`, res.body?.message || 'Sent')

      // Mark file as processed
      knownFiles.push(file.name)
      fs.writeFileSync(knownFilesPath, JSON.stringify(knownFiles))
    }

    await sftp.end()
  } catch (err) {
    console.error('[SFTP Cron Error]:', err)
  }
}
