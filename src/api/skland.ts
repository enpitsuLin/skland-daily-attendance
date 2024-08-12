import { command_header, generateSignature, ofetch } from '../utils'
import { BINDING_URL, CRED_CODE_URL, SKLAND_ATTENDANCE_URL, SKLAND_CHECKIN_URL } from '../constant'
import type { AttendanceResponse, BindingResponse, CredResponse, SklandBoard } from '../types'

/**
 * grant_code 获得森空岛用户的 token 等信息
 * @param grant_code 从 OAuth 接口获取的 grant_code
 */
export async function signIn(grant_code: string) {
  const data = await ofetch<CredResponse>(CRED_CODE_URL, {
    method: 'POST',
    headers: Object.assign({
      'Content-Type': 'application/json; charset=utf-8',
    }, command_header),
    body: JSON.stringify({
      code: grant_code,
      kind: 1,
    })
  }) 

  if (data.code !== 0)
    throw new Error(`登录获取 cred 错误:${data.message}`)

  return data.data
}
/**
 * 通过登录凭证和森空岛用户的 token 获取角色绑定列表
 * @param cred 鹰角网络通行证账号的登录凭证
 * @param token 森空岛用户的 token
 */
export async function getBinding(cred: string, token: string) {
  const [sign, headers] = generateSignature(token, BINDING_URL)
  const data = await ofetch<BindingResponse>(BINDING_URL, {
    headers: Object.assign(headers, { sign, cred }),
  })
  if (data.code !== 0)
    throw new Error(`获取绑定角色错误:${data.message}`)

  return data.data
}

/**
 * 登岛检票
 * @param cred 鹰角网络通行证账号的登录凭证
 * @param token 森空岛用户的 token
 */
export async function checkIn(cred: string, token: string, id: SklandBoard) {
  const body = { gameId: id.toString() }
  const [sign, cryptoHeaders] = generateSignature(token, SKLAND_CHECKIN_URL, body)
  const headers = Object.assign(cryptoHeaders, { sign, cred, 'Content-Type': 'application/json;charset=utf-8' }, command_header)
  const data = await ofetch<{ code: number, message: string, timestamp: string }>(
    SKLAND_CHECKIN_URL,
    { method: 'POST', headers, body: JSON.stringify(body) },
  )
  return data
}
/**
 * 明日方舟每日签到
 * @param cred 鹰角网络通行证账号的登录凭证
 * @param token 森空岛用户的 token
 */
export async function attendance(cred: string, token: string, body: { uid: string, gameId: string }) {
  const [sign, cryptoHeaders] = generateSignature(token, SKLAND_ATTENDANCE_URL, body)
  const headers = Object.assign(cryptoHeaders, { sign, cred, 'Content-Type': 'application/json;charset=utf-8' }, command_header)

  const data = await ofetch<AttendanceResponse>(
    SKLAND_ATTENDANCE_URL,
    { method: 'POST', headers, body: JSON.stringify(body) },
  )
  return data
}
