# 森空岛签到

使用 github action 定时执行森空岛各版面登岛检票和明日方舟每日签到任务

## 使用

### Fork 项目  

点击本仓库右上角 `Fork` 到自己的账号下

### 获取凭据

登录森空岛网页版后，打开 https://web-api.skland.com/account/info/hg 记下 content 字段的值

### 添加 Cookie 至 Secrets

点击Settings -> 点击选项卡 Secrets and variables -> 点击Actions -> New repository secret

建立名为 `SKLAND_TOKEN` 的 secret，值为上一步获取 content，最后点击 Add secret，如果需要多账号支持，请使用半角逗号`,`分割

#### 推送服务

- 支持 server 酱推送每日签到信息，建立名为 `SERVERCHAN_SENDKEY` 的 secret 填入你 server 酱的推送密钥

- 支持 bark 推送每日签到信息，建立名为 `BARK_URL` 的 secret 填入你 bark 的推送地址，例如 `https://api.day.app/xxxxxxxxxx/`，支持自建服务器


<details>
  <summary>最终可能有的 secrets 如下</summary>

| Name               | Secret                                                           |
| ------------------ | ---------------------------------------------------------------- |
| SKLAND_TOKEN \*    | 森空岛 token <br>多账号使用半角逗号`,`分割                        |
| SERVERCHAN_SENDKEY | Server 酱推送密钥，可选                                          |
| BARK_URL           | Bark 推送地址，可选                                              |
</details>

### 启动 Github Action

> Actions 默认为关闭状态，Fork 之后需要手动执行一次，若成功运行其才会激活。

返回项目主页面，点击上方的`Actions`，再点击左侧的`attendance`，再点击`Run workflow`

至此，部署完毕。

> 注意：github actions 会对60天没有活动的仓库自动禁用，你可能要主动关注一下 github actions 的运行情况（一般会发邮件通知 actions 执行失败）

## ~~广告~~

推荐一款浏览器扩展——[罗德岛远程指挥部](https://github.com/enpitsuLin/rhodes-headquarters) 能在浏览器上监控博士您岛上的最新信息
