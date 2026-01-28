import type { AppBindingPlayer, Client } from 'skland-kit'

export interface AttendanceHandlerInput {
  client: Client
  character: AppBindingPlayer
  characterLabel: string
}

export interface AttendanceHandlerResult {
  success: boolean
  message: string
  hasError: boolean
}

export type AttendanceHandler = (
  input: AttendanceHandlerInput,
) => Promise<AttendanceHandlerResult>

export interface ValidationResult {
  valid: boolean
  reason?: string
}

export type AttendanceValidator = (
  character: AppBindingPlayer,
) => ValidationResult

export interface AttendanceHandlerConfig {
  gameId: number
  gameName: string
  handler: AttendanceHandler
  validate?: AttendanceValidator
}

/**
 * 定义签到处理器配置
 * @param config - 处理器配置对象
 * @returns 返回相同的配置对象（用于类型推断）
 * @example
 * ```ts
 * export const myGame = defineAttendanceHandler({
 *   gameId: 5,
 *   gameName: '我的游戏',
 *   handler: myGameHandler,
 * })
 * ```
 */
export function defineAttendanceHandler(
  config: AttendanceHandlerConfig,
): AttendanceHandlerConfig {
  return config
}
