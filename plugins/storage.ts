/* eslint-disable node/prefer-global/process */
import type { NitroRuntimeConfig } from 'nitro/types'
import type { Driver } from 'unstorage'
import type { KVOptions } from 'unstorage/drivers/cloudflare-kv-binding'
import type { FSStorageOptions } from 'unstorage/drivers/fs-lite'
import type { RedisOptions } from 'unstorage/drivers/redis'
import type { S3DriverOptions } from 'unstorage/drivers/s3'
import type { UpstashOptions } from 'unstorage/drivers/upstash'
import { definePlugin } from 'nitro'
import { useRuntimeConfig } from 'nitro/runtime-config'
import { useStorage } from 'nitro/storage'

interface UpstashKVConfig extends UpstashOptions {
  driver: 'upstash'
}

interface RedisKVConfig extends RedisOptions {
  driver: 'redis'
}

interface S3KVConfig extends S3DriverOptions {
  driver: 's3'
}

interface CloudflareKVConfig extends KVOptions {
  driver: 'cloudflare-kv-binding'
}

interface DenoKVConfig {
  driver: 'deno-kv'
}

interface FSLiteKVConfig extends FSStorageOptions {
  driver: 'fs-lite'
}

type ResolvedKVConfig = UpstashKVConfig | RedisKVConfig | S3KVConfig | CloudflareKVConfig | DenoKVConfig | FSLiteKVConfig

function resolveKVConfig(config: NitroRuntimeConfig): ResolvedKVConfig | false {
  if (process.env.DISABLE_KV)
    return false

  // Upstash Redis
  if ((process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) || (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)) {
    return {
      driver: 'upstash',
      url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
    } as ResolvedKVConfig
  }
  // Redis
  if (process.env.REDIS_URL || process.env.KV_URL?.startsWith('rediss://')) {
    return {
      driver: 'redis',
      url: process.env.REDIS_URL || process.env.KV_URL,
    } as ResolvedKVConfig
  }
  // S3
  if (process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY && process.env.S3_BUCKET && process.env.S3_REGION) {
    return {
      driver: 's3',
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT || undefined,
    } as ResolvedKVConfig
  }

  // Cloudflare KV
  if (config.hosting?.includes('cloudflare')) {
    return {
      driver: 'cloudflare-kv-binding',
      binding: 'KV',
    } as ResolvedKVConfig
  }

  // Deno KV
  if (config.hosting?.includes('deno')) {
    return {
      driver: 'deno-kv',
    } as ResolvedKVConfig
  }

  // Default: local file storage
  return {
    driver: 'fs-lite',
    base: '.data/kv',
  } as ResolvedKVConfig
}

function getDriver(config: ResolvedKVConfig): Promise<Driver> {
  switch (config.driver) {
    case 'upstash': {
      const { driver, ...driverOptions } = config
      return import('unstorage/drivers/upstash').then(module => module.default(driverOptions))
    }
    case 'redis': {
      const { driver, ...driverOptions } = config
      return import('unstorage/drivers/redis').then(module => module.default(driverOptions))
    }
    case 's3': {
      const { driver, ...driverOptions } = config
      return import('unstorage/drivers/s3').then(module => module.default(driverOptions))
    }
    case 'cloudflare-kv-binding': {
      const { driver, ...driverOptions } = config
      return import('unstorage/drivers/cloudflare-kv-binding').then(module => module.default(driverOptions))
    }
    case 'deno-kv': {
      const { driver, ...driverOptions } = config
      return import('unstorage/drivers/deno-kv').then(module => module.default(driverOptions))
    }
    case 'fs-lite': {
      const { driver, ...driverOptions } = config
      return import('unstorage/drivers/fs-lite').then(module => module.default(driverOptions))
    }
    default: {
      throw new Error(`Unsupported driver`)
    }
  }
}

export default definePlugin(async () => {
  const config = useRuntimeConfig()

  const kvConfig = resolveKVConfig(config)
  if (!kvConfig) {
    return
  }

  const driver = await getDriver(kvConfig)
  const storage = useStorage()

  storage.mount('kv', driver)
})
