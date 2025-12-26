import type { AttendanceResult } from '~/utils/index'
import { useRuntimeConfig } from 'nitro/runtime-config'
import { defineTask } from 'nitro/task'
import { createClient } from 'skland-kit'
import { attendCharacter, createMessageCollector } from '~/utils/index'

export default defineTask<'success' | 'failed'>({
  meta: {
    name: 'attendance',
    description: '每日签到',
  },
  async run() {
    const config = useRuntimeConfig()

    const tokens = config.tokens.split(',')
    if (tokens.length === 0) {
      return { result: 'success' }
    }

    const notificationUrls = config.notificationUrls ? config.notificationUrls.split(',') : []

    const messageCollector = createMessageCollector({
      notificationUrls,
    })

    messageCollector.log('## 明日方舟签到')

    const maxRetries = Number(config.maxRetries)

    const results: AttendanceResult[] = []

    try {
      for (const [index, token] of tokens.entries()) {
        messageCollector.log(`开始处理第 ${index + 1}/${tokens.length} 个账号`)
        const client = createClient()
        const { code } = await client.collections.hypergryph.grantAuthorizeCode(token)
        await client.signIn(code)

        const { list } = await client.collections.player.getBinding()
        const characterList = list.filter(i => i.appCode === 'arknights').flatMap(i => i.bindingList)

        for (const character of characterList) {
          const result = await attendCharacter(client, character, maxRetries)
          results.push(result)
          messageCollector.log(result.message, result.hasError)
        }
      }

      // Count successful attendances
      const successCount = results.filter(r => r.success).length
      if (successCount > 0) {
        messageCollector.log(`成功签到 ${successCount} 个角色`)
      }

      return { result: 'success' }
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      messageCollector.log(`签到过程中出现未知错误: ${errorMessage}`, true)
      return { result: 'failed' }
    }
    finally {
      await messageCollector.push()
    }
  },
})
