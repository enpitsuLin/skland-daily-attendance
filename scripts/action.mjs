import { spawn } from 'node:child_process'
import process from 'node:process'
import * as core from '@actions/core'
import waitOn from 'wait-on'

const PORT = process.env.NITRO_PORT || 3000
const HOST = process.env.NITRO_HOST || 'localhost'
const BASE_URL = `http://${HOST}:${PORT}`

core.info('🚀 准备启动 Nitro 服务...')

// 启动服务
const server = spawn('pnpm', ['dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NITRO_PORT: String(PORT),
  },
})

// 创建一个 Promise 用于等待子进程退出
function killServer() {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      core.warning('⚠️  强制终止服务...')
      server.kill('SIGKILL')
    }, 3000)

    server.on('exit', (code) => {
      clearTimeout(timeout)
      core.info(`🛑 服务已停止 (退出码: ${code})`)
      resolve()
    })

    core.info('🛑 停止服务...')
    server.kill('SIGTERM')
  })
}

let exitCode = 0

// 处理服务进程错误
server.on('error', (error) => {
  core.error(`❌ 启动服务失败: ${error.message}`)
  exitCode = 1
})

try {
  // 等待服务就绪
  await core.group('等待服务启动', async () => {
    core.info(`服务地址: ${BASE_URL}`)
    core.info('超时时间: 60 秒')
    await waitOn({
      resources: [BASE_URL],
      timeout: 60000, // 60 秒超时
      interval: 1000, // 每秒检查一次
    })
    core.info('✅ 服务已启动')
  })

  // 触发 attendance 任务
  await core.group('执行 attendance 任务', async () => {
    const taskUrl = `${BASE_URL}/_nitro/tasks/attendance`
    core.info(`任务 URL: ${taskUrl}`)

    const response = await fetch(taskUrl)

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    core.info('📊 任务响应:')
    core.info(JSON.stringify(data, null, 2))

    // 检查任务结果
    if (data.result === 'success') {
      core.info('✅ 任务执行成功')
      exitCode = 0
    }
    else {
      core.error('❌ 任务执行失败')
      exitCode = 1
    }
  })
}
catch (error) {
  const errorMsg = error instanceof Error ? error.message : String(error)
  core.error(`❌ 执行失败: ${errorMsg}`)
  core.setFailed(errorMsg)
  exitCode = 1
}
finally {
  // 清理：停止服务并等待完全退出
  await killServer()
}

process.exit(exitCode)
