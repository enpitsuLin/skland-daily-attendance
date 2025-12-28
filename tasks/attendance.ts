import type { Storage } from 'unstorage'
import type { MessageCollector } from '~/utils/index'
import { AsyncLocalStorage } from 'node:async_hooks'
import { useRuntimeConfig } from 'nitro/runtime-config'
import { useStorage } from 'nitro/storage'
import { defineTask } from 'nitro/task'
import { createClient } from 'skland-kit'
import { createContext } from 'unctx'
import { attendCharacter, createMessageCollector, generateAttendanceKey, getSplitByComma } from '~/utils/index'

interface ExecutionStats {
  accounts: {
    total: number
    successful: number // 所有角色都成功的账号
    skipped: number // 今天已签到的账号
    failed: number // 有失败的账号
    failedIndexes: number[]
  }
  characters: {
    total: number
    succeeded: number // 本次签到成功
    alreadyAttended: number // 今天已签到
    failed: number // 签到失败
  }
}

interface ProcessAccountResult {
  accountHasError: boolean
  charactersCount: number
}

interface AttendanceContext {
  stats: ExecutionStats
  messageCollector: MessageCollector
  storage: Storage
  maxRetries: number
  totalAccounts: number
}

// Create attendance context instance
const attendanceContext = createContext<AttendanceContext>({
  asyncContext: true,
  AsyncLocalStorage,
})

// Export composable function for accessing context
const useAttendanceContext = attendanceContext.use

async function processAccount(
  token: string,
  accountNumber: number,
): Promise<ProcessAccountResult> {
  // Get all dependencies from context
  const { stats, messageCollector, storage, maxRetries, totalAccounts } = useAttendanceContext()
  // Check if already attended today
  const attendanceKey = await generateAttendanceKey(token)
  const hasAttended = await storage.getItem(attendanceKey)

  if (hasAttended) {
    messageCollector.log(`\n--- 账号 ${accountNumber}/${totalAccounts} ---`)
    messageCollector.log(`今天已经签到过，跳过`)
    stats.accounts.skipped++
    return { accountHasError: false, charactersCount: 0 }
  }

  messageCollector.log(`\n--- 账号 ${accountNumber}/${totalAccounts} ---`)
  messageCollector.log(`开始处理...`)

  const client = createClient()
  const { code } = await client.collections.hypergryph.grantAuthorizeCode(token)
  await client.signIn(code)

  const { list } = await client.collections.player.getBinding()
  const characterList = list.filter(i => i.appCode === 'arknights').flatMap(i => i.bindingList)

  stats.characters.total += characterList.length

  let accountHasError = false
  for (const character of characterList) {
    const result = await attendCharacter(client, character, maxRetries)
    messageCollector.log(result.message, result.hasError)

    // Collect character statistics
    if (result.hasError) {
      stats.characters.failed++
      accountHasError = true
    }
    else if (result.success) {
      stats.characters.succeeded++
    }
    else {
      // Already attended today
      stats.characters.alreadyAttended++
    }
  }

  // Save attendance status only if all characters succeeded
  if (!accountHasError) {
    await storage.setItem(attendanceKey, true)
    stats.accounts.successful++
  }
  else {
    stats.accounts.failed++
    stats.accounts.failedIndexes.push(accountNumber)
  }

  return { accountHasError, charactersCount: characterList.length }
}

export default defineTask<'success' | 'failed'>({
  meta: {
    name: 'attendance',
    description: '每日签到',
  },
  async run() {
    const config = useRuntimeConfig()

    const tokens = getSplitByComma(config.tokens)
    if (tokens.length === 0) {
      return { result: 'success' }
    }

    const storage = useStorage()

    const notificationUrls = getSplitByComma(config.notificationUrls)

    const messageCollector = createMessageCollector({
      notificationUrls,
    })

    messageCollector.log('## 明日方舟签到')

    const maxRetries = Number(config.maxRetries)

    // Initialize statistics
    const stats: ExecutionStats = {
      accounts: {
        total: tokens.length,
        successful: 0,
        skipped: 0,
        failed: 0,
        failedIndexes: [],
      },
      characters: {
        total: 0,
        succeeded: 0,
        alreadyAttended: 0,
        failed: 0,
      },
    }

    let hasFailed = false

    const ctx = {
      stats,
      messageCollector,
      storage,
      maxRetries,
      totalAccounts: tokens.length,
    }

    // Create context scope for async operations
    await attendanceContext.call(ctx, async () => {
      // Process each account within the context
      for (const [index, token] of tokens.entries()) {
        const accountNumber = index + 1

        try {
          const result = await processAccount(token, accountNumber)

          if (result.accountHasError) {
            hasFailed = true
          }
        }
        catch (error) {
          const { stats, messageCollector } = useAttendanceContext()
          const errorMessage = error instanceof Error ? error.message : String(error)
          messageCollector.log(`\n--- 账号 ${accountNumber}/${tokens.length} ---`)
          messageCollector.log(`处理失败: ${errorMessage}`, true)
          hasFailed = true
          stats.accounts.failed++
          stats.accounts.failedIndexes.push(accountNumber)
        }
      }
    })

    // Output execution summary
    messageCollector.log(`\n========== 执行摘要 ==========`)
    messageCollector.log(`账号统计:`)
    messageCollector.log(`  • 总数: ${stats.accounts.total}`)
    messageCollector.log(`  • 成功: ${stats.accounts.successful}`)
    messageCollector.log(`  • 跳过: ${stats.accounts.skipped}`)
    if (stats.accounts.failed > 0) {
      messageCollector.log(`  • 失败: ${stats.accounts.failed} (账号 #${stats.accounts.failedIndexes.join(', #')})`, true)
    }

    messageCollector.log(`\n角色统计:`)
    messageCollector.log(`  • 总数: ${stats.characters.total}`)
    messageCollector.log(`  • 本次签到成功: ${stats.characters.succeeded}`)
    messageCollector.log(`  • 今天已签到: ${stats.characters.alreadyAttended}`)
    if (stats.characters.failed > 0) {
      messageCollector.log(`  • 签到失败: ${stats.characters.failed}`, true)
    }

    await messageCollector.push()

    return { result: hasFailed ? 'failed' : 'success' }
  },
})
