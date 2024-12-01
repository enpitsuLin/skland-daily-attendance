import { describe, expect, it } from 'vitest'
import type { DESRule } from './crypto'
import { encryptAES, encryptDES, encryptObjectByDESRules, md5 } from './crypto'

const DES_RULE: Record<string, DESRule> = {
  appId: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'uy7mzc4h',
    obfuscated_name: 'xx',
  },
  box: {
    is_encrypt: 0,
    obfuscated_name: 'jf',
  },
  canvas: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'snrn887t',
    obfuscated_name: 'yk',
  },
  clientSize: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'cpmjjgsu',
    obfuscated_name: 'zx',
  },
  organization: {
    cipher: 'DES',
    is_encrypt: 1,
    key: '78moqjfc',
    obfuscated_name: 'dp',
  },
  os: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'je6vk6t4',
    obfuscated_name: 'pj',
  },
  platform: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'pakxhcd2',
    obfuscated_name: 'gm',
  },
  plugins: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'v51m3pzl',
    obfuscated_name: 'kq',
  },
  pmf: {
    cipher: 'DES',
    is_encrypt: 1,
    key: '2mdeslu3',
    obfuscated_name: 'vw',
  },
  protocol: {
    is_encrypt: 0,
    obfuscated_name: 'protocol',
  },
  referer: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'y7bmrjlc',
    obfuscated_name: 'ab',
  },
  res: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'whxqm2a7',
    obfuscated_name: 'hf',
  },
  rtype: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'x8o2h2bl',
    obfuscated_name: 'lo',
  },
  sdkver: {
    cipher: 'DES',
    is_encrypt: 1,
    key: '9q3dcxp2',
    obfuscated_name: 'sc',
  },
  status: {
    cipher: 'DES',
    is_encrypt: 1,
    key: '2jbrxxw4',
    obfuscated_name: 'an',
  },
  subVersion: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'eo3i2puh',
    obfuscated_name: 'ns',
  },
  svm: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'fzj3kaeh',
    obfuscated_name: 'qr',
  },
  time: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'q2t3odsk',
    obfuscated_name: 'nb',
  },
  timezone: {
    cipher: 'DES',
    is_encrypt: 1,
    key: '1uv05lj5',
    obfuscated_name: 'as',
  },
  tn: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'x9nzj1bp',
    obfuscated_name: 'py',
  },
  trees: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'acfs0xo4',
    obfuscated_name: 'pi',
  },
  ua: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'k92crp1t',
    obfuscated_name: 'bj',
  },
  url: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'y95hjkoo',
    obfuscated_name: 'cf',
  },
  version: {
    is_encrypt: 0,
    obfuscated_name: 'version',
  },
  vpw: {
    cipher: 'DES',
    is_encrypt: 1,
    key: 'r9924ab5',
    obfuscated_name: 'ca',
  },
}

const BROWSER_ENV = {
  plugins: 'MicrosoftEdgePDFPluginPortableDocumentFormatinternal-pdf-viewer1,MicrosoftEdgePDFViewermhjfbmdgcfjbbpaeojofohoefgiehjai1',
  ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
  canvas: '259ffe69', // 基于浏览器的canvas获得的值，不知道复用行不行
  timezone: -480, // 时区，应该是固定值吧
  platform: 'Win32',
  url: 'https://www.skland.com/', // 固定值
  referer: '',
  res: '1920_1080_24_1.25', // 屏幕宽度_高度_色深_window.devicePixelRatio
  clientSize: '0_0_1080_1920_1920_1080_1920_1080',
  status: '0011', // 不知道在干啥
}

describe('crypto', () => {
  it('md5', () => {
    expect(md5('123456')).toBe('e10adc3949ba59abbe56e057f20f883e')
  })

  it('encryptAES', () => {
    const message = '123456'
    const key = '1234567890123456'
    const expected = '7f2be80dd2bfc4ae7f6ae62f1f04e384'
    expect(encryptAES(message, key)).toBe(expected)
  })

  it('encryptDES', () => {
    const message = '123456'
    const key = '1234567890123456'
    const expected = 'M59RCYudPds='
    expect(encryptDES(message, key)).toBe(expected)
  })

  it('encryptObjectByDESRules', () => {
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

    expect(encryptObjectByDESRules(object, rules)).toEqual(expected)
  })
})
