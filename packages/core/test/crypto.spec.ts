import { createHash, createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { encryptAES, encryptDES, hmacSha256, md5 } from '../src'

describe('crypto', () => {
  it('md5', async () => {
    const message = '123456'
    const expected = createHash('md5')
      .update(message, 'utf-8')
      .digest('hex')

    expect(await md5(message)).toBe(expected)
  })

  it('hmacSha256', async () => {
    const key = '1234567890123456'
    const data = '123456'
    const expected = createHmac('sha256', key)
      .update(data, 'utf-8')
      .digest('hex')
    expect(await hmacSha256(key, data)).toBe(expected)
  })

  it('encryptAES', async () => {
    const message = '123456'
    const key = '1234567890123456'
    const expected = '172000e84d64a30f559989a6b9f6082d'
    expect(await encryptAES(message, key)).toBe(expected)
  })

  it('encryptDES', async () => {
    const message = '123456'
    const key = '12345678'
    const expected = 'uAoXvewt7nk='
    expect(await encryptDES(message, key)).toBe(expected)
  })
})
