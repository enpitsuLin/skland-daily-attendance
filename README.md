# 森空岛签到

使用 TypeScript 实现的森空岛自动签到系统，支持多账号管理和多种推送通知方式。

核心支持在所有支持 [Web Cryptography](https://caniuse.com/cryptography) 的运行环境运行，包括浏览器、Node.js、Cloudflare Workers 等。

## 功能特点

- 🌟 支持多账号管理
- 🤖 自动定时执行签到任务
- 📱 支持多种推送通知方式
- 🔄 支持错误自动重试

## 部署方式

基于 Nitro 构建，使用 Scheduled Tasks 实现定时任务来签到，查看 [Nitro 文档](https://nitro.unjs.io/guide/scheduled-tasks) 了解支持的平台。

## 配置

### 1. 获取凭据

登录 [森空岛网页版](https://www.skland.com/) 后，打开 https://web-api.skland.com/account/info/hg 记下 content 字段的值

或者登录 [鹰角网络通行证](https://user.hypergryph.com/login) 后打开 https://web-api.hypergryph.com/account/info/hg 记下 content 字段的值

### 2. 设置消息通知方式 (可选)

通过 [Statocysts](https://github.com/enpitsuLin/statocysts) 支持等多种通知方式，只需要将对应格式的通知 URL 设置到环境变量中即可。

### 3. 设置所需环境变量

| 环境变量                 | 描述                              |
| ------------------------ | --------------------------------- |
| SKLAND_TOKENS            | 森空岛凭据，多个凭据用逗号分隔    |
| SKLAND_NOTIFICATION_URLS | 消息通知 URL，多个 URL 用逗号分隔 |
| SKLAND_MAX_RETRIES       | 最大重试次数，默认 3              |

## 注意事项

- 本项目仅用于学习和研究目的
- 请勿频繁调用 API，以免影响账号安全

## 相关项目

- [罗德岛远程指挥部](https://github.com/enpitsuLin/rhodes-headquarters) - 浏览器扩展，用于监控森空岛信息

## License

MIT
