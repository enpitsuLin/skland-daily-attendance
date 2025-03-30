import { encryptDES } from './crypto'

export interface DESRule {
  cipher?: string
  is_encrypt: number
  key?: string
  obfuscated_name: string
}

export async function encryptObjectByDESRules(object: Record<string, string | number>, rules: Record<string, DESRule>) {
  const result: Record<string, string | number> = {}

  for (const i in object) {
    if (i in rules) {
      const rule = rules[i]
      if (rule.is_encrypt === 1)
        result[rule.obfuscated_name] = await encryptDES(object[i], rule.key!)
      else
        result[rule.obfuscated_name] = object[i]
    }
    else {
      result[i] = object[i]
    }
  }

  return result
}
