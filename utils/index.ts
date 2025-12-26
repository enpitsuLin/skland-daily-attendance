export * from './attendance'
export * from './format'
export * from './message'
export * from './retry'

export function getSplitByComma(value: string) {
  return value ? value.split(',') : []
}
