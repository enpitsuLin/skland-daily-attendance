import assert from 'assert'
import 'dotenv/config'
import { command_header, generateSignature } from './utils'

const SKLAND_AUTH_URL = 'https://as.hypergryph.com/user/oauth2/v2/grant',
    CRED_CODE_URL = "https://zonai.skland.com/api/v1/user/auth/generate_cred_by_code",
    BINDING_URL = "https://zonai.skland.com/api/v1/game/player/binding", // 绑定角色url
    SKLAND_ATTENDANCE_URL = "https://zonai.skland.com/api/v1/game/attendance"// 签到url

interface SklandResponse<T> {
    code: number,
    message: string
    data: T
}

type AuthResponse = {
    status: number,
    type: string
    msg: string
    data: { code: string; uid: string }
} | {
    statusCode: number,
    error: string,
    message: string,
    validation: any
}

type CredResponse = SklandResponse<{ cred: string; userId: string; token: string; }>

type BindingResponse = SklandResponse<{
    list: {
        appCode: string
        appName: string
        bindingList: {
            uid: string
            isOfficial: boolean,
            isDefault: boolean,
            channelMasterId: string,
            channelName: string
            nickName: string
            isDelete: boolean
        }[],
        defaultUid: string
    }[]
}>

type AttendanceResponse = SklandResponse<{
    ts: number,
    awards: {
        resource: {
            id: string,
            name: string,
            type: string
        },
        count: number
    }[]
}>



async function auth(token: string) {
    const response = await fetch(SKLAND_AUTH_URL, {
        method: "POST",
        headers: command_header,
        body: JSON.stringify({
            "appCode": '4ca99fa6b56cc2ba',
            "token": token,
            "type": 0
        })
    })
    const data = await response.json() as AuthResponse
    if ('statusCode' in data && 'message' in data) {
        throw new Error('登录获取 cred 错误:' + data.message)
    }
    return data.data
}

async function signIn(grant_code: string) {
    const response = await fetch(CRED_CODE_URL, {
        method: "POST",
        headers: Object.assign({
            "Content-Type": "application/json; charset=utf-8"
        }, command_header),
        body: JSON.stringify({
            "code": grant_code,
            "kind": 1
        })
    })
    const data = await response.json() as CredResponse

    if (data.code !== 0) {
        throw new Error('登录获取 cred 错误:' + data.message)
    }
    return data.data
}

async function getBinding(cred: string, token: string) {
    const url = new URL(BINDING_URL)
    const [sign, headers] = generateSignature(token, url)
    const response = await fetch(BINDING_URL, {
        headers: Object.assign(headers, { sign, cred })
    })
    const data = await response.json() as BindingResponse
    if (data.code !== 0) {
        throw new Error('获取绑定角色错误:' + data.message)
    }
    return data.data
}

async function doAttendanceForAccount(token: string) {
    const { code } = await auth(token)
    const { cred, token: signToken } = await signIn(code)
    const { list } = await getBinding(cred, signToken)


    Promise.all(
        list.map(i => i.bindingList).flat()
            .map(async character => {

                console.log('开始签到' + character.nickName);
                const url = new URL(SKLAND_ATTENDANCE_URL)
                const body = {
                    uid: character.uid,
                    gameId: character.channelMasterId
                }
                const [sign, headers] = generateSignature(signToken, url, body)
                const response = await fetch(
                    SKLAND_ATTENDANCE_URL,
                    {
                        method: "POST",
                        headers: Object.assign(headers, { sign, cred, 'Content-Type': "application/json;charset=utf-8" }, command_header),
                        body: JSON.stringify(body)
                    }
                )
                const data = await response.json() as AttendanceResponse

                if (data.code === 0 && data.message === 'OK') {
                    console.log(`${character.nickName}签到成功, 获得了${data.data.awards.map(a => a.resource.name + '' + a.count + '个').join(',')}`);
                } else {
                    console.error(`${character.nickName}签到失败, 错误消息: ${data.message} raw response json: ${JSON.stringify(data)}`)
                    // quit ci with error
                    process.exit(1)
                }
            })
    )
}

assert(typeof process.env.SKLAND_TOKEN === 'string')

const accounts = Array.from(process.env.SKLAND_TOKEN.split(','))

await Promise.all(accounts.map(token => doAttendanceForAccount(token)))
