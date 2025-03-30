import { describe, expect, it } from 'vitest'
import { encryptObjectByDESRules, generateDeviceID } from '../src'
import { BROWSER_ENV, DES_RULE, SM_CONFIG } from '../src/constants'

describe('utils', () => {
  it('encryptObjectByDESRules', async () => {
    const object = BROWSER_ENV

    const rules = DES_RULE

    const expected = {
      ab: 'jYTfqbaQNrY=',
      an: '7pMB/N4HgyQ=',
      as: 'ZiEGW6ynU0Q=',
      bj: 'Fd5zMeCbJY2nc0J7tHO+PhlIlRR63RY8fYNs9YznImp6jkEBiv0a/tEKhl595d4tcrzH6sfKUs4nKN0nXy6W7J2x+LUZLuaw7FVBddNfZ3O2ToGM9rykP902i7Vt2WXFIk2V2VvLCCiW1v0CkqsLCDzGAvwx5WtxoEbG/lmeDKo=',
      cf: '28/tqKZHZlQvtdne1LRJi507hr012/kc',
      gm: 'HvYa39S0OS4=',
      hf: '5Ff2HmUkil1XYnjmjWlu/K55KTcmUZpP',
      kq: '/DXc2+x/RAQSFJ/sKmDA4aT5QTgP9gzchpbk1IOIfWARsk2FyMpkFBk0Ys1KvCH8sjmMy+0439V4WOCYWmcgAhYmqlXrq33pH8SJKlYvOdUAS9ps75Mp3UTdJurGvbJQNWLlBp0UxQk0Z6A6Lg07Zu8t6PAbcSoGyaa826BG0Mo=',
      yk: 'I6evoagk0jL0RCGjelJAmw==',
      zx: 'gxHeT3BY9PJ+tysf0WFAQ+4iqjE4Jw1gHFwaMqRgMKbMWRpsOZ58yQ==',
    }

    expect(await encryptObjectByDESRules(object, rules)).toEqual(expected)
  })

  it('should return a valid did', async () => {
    const did = await generateDeviceID(SM_CONFIG, BROWSER_ENV, DES_RULE)
    expect(did).toBeDefined()
  })
})
