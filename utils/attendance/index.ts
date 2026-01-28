import type { AppBindingPlayer, Client } from 'skland-kit'
import type { AttendanceHandlerResult } from './types'
import { formatCharacterName } from '../format'
import { retry } from '../retry'
import { attendanceHandlerRegistry } from './registry'

export * from './registry'
export * from './shared'
// Export types and utility functions
export * from './types'

/**
 * Core attendance function
 */
async function attendance(
  client: Client,
  character: AppBindingPlayer,
  appName?: string,
): Promise<AttendanceHandlerResult> {
  const characterLabel = formatCharacterName(character, appName)

  // Find handler
  const handlerConfig = attendanceHandlerRegistry.get(character.gameId)

  if (!handlerConfig) {
    return {
      success: false,
      message: `${characterLabel} 不支持的游戏 (gameId: ${character.gameId})`,
      hasError: true,
    }
  }

  // Validate character (if validation function exists)
  if (handlerConfig.validate) {
    const validation = handlerConfig.validate(character)
    if (!validation.valid) {
      return {
        success: false,
        message: `${characterLabel} ${validation.reason || '验证失败'}，跳过签到`,
        hasError: false,
      }
    }
  }

  // Execute attendance
  return await handlerConfig.handler({
    client,
    character,
    characterLabel,
  })
}

/**
 * Attendance function with retry (backward compatible API)
 */
export async function attendCharacter(
  client: Client,
  character: AppBindingPlayer,
  maxRetries: number,
  appName?: string,
  onRetry?: (retriesLeft: number) => void,
): Promise<AttendanceHandlerResult> {
  try {
    return retry(() => attendance(client, character, appName), {
      retries: maxRetries,
      onRetry: onRetry ? retriesLeft => onRetry(retriesLeft) : undefined,
    })
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const characterLabel = formatCharacterName(character, appName)
    return {
      success: false,
      message: `${characterLabel} 签到过程中出现未知错误: ${errorMessage}`,
      hasError: true,
    }
  }
}

// Export AttendanceResult type alias for backward compatibility
export type { AttendanceHandlerResult as AttendanceResult }
