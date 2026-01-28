import type { AttendanceHandlerConfig } from './types'
import { arknights } from './handlers/arknights'
import { endfield } from './handlers/endfield'

export interface AttendanceHandlerRegistry {
  register: (config: AttendanceHandlerConfig) => void
  get: (gameId: number) => AttendanceHandlerConfig | undefined
  getOrThrow: (gameId: number) => AttendanceHandlerConfig
  has: (gameId: number) => boolean
  getAllGameIds: () => number[]
  size: () => number
  clear: () => void
}

function createAttendanceHandlerRegistry(
  init?: Iterable<readonly [number, AttendanceHandlerConfig]>,
): AttendanceHandlerRegistry {
  const handlers = new Map<number, AttendanceHandlerConfig>(init)

  return {
    register(config) {
      if (handlers.has(config.gameId)) {
        console.warn(`Attendance handler for gameId ${config.gameId} already registered, overwriting...`)
      }
      handlers.set(config.gameId, config)
    },

    get(gameId) {
      return handlers.get(gameId)
    },

    getOrThrow(gameId) {
      const handler = handlers.get(gameId)
      if (!handler) {
        throw new Error(`No attendance handler registered for gameId: ${gameId}`)
      }
      return handler
    },

    has(gameId) {
      return handlers.has(gameId)
    },

    getAllGameIds() {
      return Array.from(handlers.keys())
    },

    size() {
      return handlers.size
    },

    clear() {
      handlers.clear()
    },
  }
}

// Export singleton instance
export const attendanceHandlerRegistry = createAttendanceHandlerRegistry([
  [1, arknights],
  [3, endfield],
])
