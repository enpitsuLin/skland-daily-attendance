import { format } from 'date-fns'
import { encryptAES, encryptDES, encryptRSA, md5 } from './crypto'

export interface DESRule {
  cipher?: string
  is_encrypt: number
  key?: string
  obfuscated_name: string
}

export async function encryptObjectByDESRules(object: Record<string, string | number>, rules: Record<string, DESRule>) {
  const result: Record<string, string | number> = {}

  for (const i in object) {
    if (i in rules) {
      const rule = rules[i]
      if (rule.is_encrypt === 1)
        result[rule.obfuscated_name] = await encryptDES(object[i], rule.key!)
      else
        result[rule.obfuscated_name] = object[i]
    }
    else {
      result[i] = object[i]
    }
  }

  return result
}

export function getRequestURL(request: RequestInfo, baseURL?: string) {
  const url = typeof request === 'string' ? request : request.url
  if (URL.canParse(url))
    return new URL(url)
  return new URL(url, baseURL)
}

export async function generateShuMeiId() {
  const now = new Date()
  const _time = format(now, 'yyyyMMddHHmmss')

  // 生成UUID v4
  const uid = crypto.randomUUID()

  // MD5加密uid
  const uidMd5 = await md5(uid)

  const v = `${_time + uidMd5}00`

  // 计算smsk_web
  const smsk_web = (await md5(`smsk_web_${v}`)).substring(0, 14)

  return `${v + smsk_web}0`
}

const stringify = (obj: any) => JSON.stringify(obj).replace(/":"/g, '": "').replace(/","/g, '", "')

export async function gzipObject(o: object) {
  // 将对象转换为字节数组
  const encoded = new TextEncoder().encode(stringify(o))

  // 使用 CompressionStream 进行 gzip 压缩
  const compressed = await new Response(
    new Blob([encoded]).stream().pipeThrough<Uint8Array>(new CompressionStream('gzip')),
  ).arrayBuffer()

  // 转换为 Uint8Array 并设置 Python gzip OS FLG
  const compressedArray = new Uint8Array(compressed)
  compressedArray[9] = 19 // Python gzip OS FLG = Unknown

  // 转换为 base64
  return btoa(String.fromCharCode(...compressedArray))
}

export function getTn(o: Record<string, any>) {
  // 获取并排序对象的所有键
  const sortedKeys: string[] = Object.keys(o).sort()

  // 用于存储处理后的值
  const resultList: string[] = []

  // 遍历排序后的键
  for (const key of sortedKeys) {
    let v: any = o[key]

    // 处理数字类型
    if (typeof v === 'number')
      v = String(v * 10000)

    // 处理对象类型（递归）
    else if (typeof v === 'object' && v !== null)
      v = getTn(v)

    resultList.push(v)
  }

  // 将所有结果连接成字符串
  return resultList.join('')
}

export interface DeviceIDConfig {
  organization: string
  appId: string
  publicKey: string
  protocol: string
  apiHost: string
  apiPath: string
}

export async function generateDeviceID(
  config: DeviceIDConfig,
  browserEnvironment: Record<string, string | number>,
  rules: Record<string, DESRule>,
) {
  const uid = crypto.randomUUID()
  const priId = (await md5(uid)).substring(0, 16)

  const ep = await encryptRSA(uid, config.publicKey)

  const browser = Object.assign(browserEnvironment, {
    vpw: crypto.randomUUID(),
    svm: Date.now(),
    trees: crypto.randomUUID(),
    pmf: Date.now(),
  })

  const desTarget = Object.assign(browser, {
    protocol: 102,
    organization: config.organization,
    appId: config.appId,
    os: 'web',
    version: '3.0.0',
    sdkver: '3.0.0',
    box: '', // 首次请求为空
    rtype: 'all',
    smid: await generateShuMeiId(),
    subVersion: '1.0.0',
    time: 0,
  })

  // 计算并添加 tn
  desTarget.tn = await md5(getTn(desTarget))

  // DES 加密
  const desResult = await encryptObjectByDESRules(desTarget, rules)

  // GZIP 压缩
  const gzipResult = await gzipObject(desResult)

  // AES 加密
  const aesResult = await encryptAES(gzipResult, priId)

  const body = {
    appId: 'default',
    compress: 2,
    data: aesResult,
    encode: 5,
    ep,
    organization: config.organization,
    os: 'web',
  }

  // 发送请求
  const response = await fetch(new URL(config.apiPath, `${config.protocol}://${config.apiHost}`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const resp = await response.json()
  if (resp.code !== 1100)
    throw new Error('did计算失败，请联系作者')

  return `B${resp.detail.deviceId}`
}
