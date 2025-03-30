import { defu } from 'defu'
import { createFetch } from 'ofetch'
import { stringifyQuery } from 'ufo'
import { hmacSha256, md5 } from './crypto'
import { getRequestURL } from './utils'

const WHITE_LIST = ['/web/v1/user/auth/generate_cred_by_code']

export interface ClientOptions {
  baseURL?: (string & {}) | 'https://zonai.skland.com'
  /**
   * 无须处理请求的路径列表
   */
  whiteList?: string[]
}

export interface Client {

}

export interface SklandResponse<T> {
  code: number
  message: string
  data: T
}

export function createClient(options?: ClientOptions) {
  const opt: Required<ClientOptions> = defu(options, {
    baseURL: 'https://zonai.skland.com',
    whiteList: [],
  })
  const whiteList = WHITE_LIST.concat(opt.whiteList)

  const $fetch = createFetch({
    defaults: {
      baseURL: opt.baseURL,
      async onRequest(ctx) {
        const { pathname } = getRequestURL(ctx.request, ctx.options.baseURL)
        if (whiteList.includes(pathname))
          return

        const headers = new Headers(ctx.options.headers)
        const token = headers.get('token')
        if (!token)
          throw new Error('token 不存在')

        const query = ctx.options.query ? stringifyQuery(ctx.options.query) : ''
        const timestamp = (Date.now() - 2 * 1000).toString().slice(0, -3)
        const signatureHeaders = {
          platform: '1',
          timestamp,
          dId: '',
          vName: '1.21.0',
        }
        const str = `${pathname}${query}${ctx.options.body ? JSON.stringify(ctx.options.body) : ''}${timestamp}${JSON.stringify(signatureHeaders)}`

        const hmacSha256ed = await hmacSha256(token, str)

        const sign = await md5(hmacSha256ed)

        Object.entries(signatureHeaders).forEach(([key, value]) => {
          headers.append(key, value)
        })
        headers.append('sign', sign)
        headers.delete('token')

        ctx.options.headers = headers
      },
    },
  })

  return $fetch
}
