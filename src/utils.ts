import { createHash, createHmac } from 'node:crypto'

export const command_header = {
  'User-Agent': 'Skland/1.5.1 (com.hypergryph.skland; build:100501001; Android 34; ) Okhttp/4.11.0',
  'Accept-Encoding': 'gzip',
  'Connection': 'close',
  'Content-Type': 'application/json'
}

export const sign_header = {
  platform: '1',
  timestamp: '',
  dId: '',
  vName: '1.5.1',
}

const MILLISECOND_PER_SECOND = 1000

export function generateSignature<T extends Record<string, string>>(token: string, uri: string | URL, data?: T) {
  const timestamp = (Date.now() - 2 * MILLISECOND_PER_SECOND).toString().slice(0, -3)
  const header = { ...sign_header }
  header.timestamp = timestamp
  const { pathname, searchParams } = new URL(uri)
  const str = `${pathname}${searchParams.toString()}${data ? JSON.stringify(data) : ''}${timestamp}${JSON.stringify(header)}`

  const hmacSha256ed = createHmac('sha256', token)
    .update(str, 'utf-8')
    .digest('hex')

  const sign = createHash('md5')
    .update(hmacSha256ed)
    .digest('hex')

  return [sign.toString(), header as typeof sign_header] as const
}

export function getPrivacyName(name: string) {
  return name.split('')
    .map((s, i) => (i > 0 && i < name.length - 1) ? '*' : s)
    .join('')
}
