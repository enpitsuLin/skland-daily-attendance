# 森空岛签到

使用 TypeScript 实现的森空岛自动签到服务，支持多账号管理和多种推送通知方式。

基于 Nitro 构建，支持Node.js、Cloudflare Workers 等环境部署。

## 功能特点

- 🌟 支持多账号管理
- 🤖 自动定时执行签到任务
- 📱 支持多种推送通知方式
- 🔄 支持错误自动重试

## 部署

基于 Nitro 构建，使用 Scheduled Tasks 实现定时任务来签到，查看 [Nitro 文档](https://nitro.build/guide/tasks#platform-support) 了解支持的平台。

### 配置

#### 1. 配置凭据

登录 [森空岛网页版](https://www.skland.com/) 后，打开 https://web-api.skland.com/account/info/hg 记下 content 字段的值

或者登录 [鹰角网络通行证](https://user.hypergryph.com/login) 后打开 https://web-api.hypergryph.com/account/info/hg 记下 content 字段的值

将获取的凭据设置到环境变量 `SKLAND_TOKENS` 中，多个凭据用逗号分隔。

```bash
SKLAND_TOKENS=your-token-1,your-token-2
```

#### 2. 配置消息通知 (可选)

通过 [Statocysts](https://github.com/enpitsuLin/statocysts) 支持等多种通知方式，将对应格式的通知 URL 设置到环境变量 `SKLAND_NOTIFICATION_URLS` 中，多个 URL 用逗号分隔。

```bash
SKLAND_NOTIFICATION_URLS="Statocysts 格式通知 URL"
```

#### 3. 配置持久化存储 (可选)

项目支持使用持久化存储来记录每日签到状态。

因为每次计划任务执行不一定签到成功所以本服务使用每 2 小时执行的计划任务保证当天的签到任务成功，所以需要持久化储存对应日期的签到状态避免成功后重复签到。

> [!WARNING]
> 因为项目默认使用 2 小时的计划任务执行签到任务，所以在使用中不需要那么高的频率来执行签到任务，需要在 `nitro.config.ts` 中手动调整计划任务的执行频率。
> 如果是 Cloudflare Workers 环境，同样需要调整 Worker 的 cron 定时器。

项目支持多种 KV 存储方式，根据不同的部署环境选择合适的存储方案：

##### Upstash Redis（推荐用于 Serverless 环境）

```bash
KV_REST_API_URL=https://your-upstash-redis.upstash.io
KV_REST_API_TOKEN=your-token
```

或使用 Upstash 环境变量：

```bash
UPSTASH_REDIS_REST_URL=https://your-upstash-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

##### Redis

```bash
REDIS_URL=rediss://default:password@your-redis-host:6379
```

或使用通用 KV URL：

```bash
KV_URL=rediss://default:password@your-redis-host:6379
```

##### AWS S3 兼容存储

```bash
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ENDPOINT=https://your-s3-endpoint.com  # 可选，用于兼容 S3 的存储服务
```

##### Cloudflare KV

在 Cloudflare Workers 环境中会自动检测并使用，需要在 Cloudflare Dashboard 中创建名为 `KV` 的 KV 命名空间并绑定到项目。

##### Deno KV

在 Deno Deploy 环境中会自动检测并使用，无需额外配置。

##### 本地文件存储（默认）

如果未配置以上任何存储方式，将自动使用本地文件存储，数据保存在 `.data/kv` 目录下。

##### 禁用持久化存储

如果不需要持久化功能，可以设置：

```bash
DISABLE_KV=true
```

#### 4. 其他配置

##### 重试次数

可以通过环境变量 `SKLAND_MAX_RETRIES` 设置签到失败时的最大重试次数，默认为 3 次。

```bash
SKLAND_MAX_RETRIES=5
```

## 注意事项

- 本项目仅用于学习和研究目的
- 请勿频繁调用 API，以免影响账号安全

## 相关项目

- [罗德岛远程指挥部](https://github.com/enpitsuLin/rhodes-headquarters) - 浏览器扩展，用于监控森空岛信息

## License

MIT
