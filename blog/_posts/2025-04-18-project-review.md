---
title: 项目复盘
categories: [learn]
---

## webpack 打包体积优化

思路：指标，方案/优化手段，性能实践

1. requirejs -> esmodule
2. splitChunk
3. Terser plugin 配置, miniCss plugin
4. polyfill 优化，browserlist
5. IgnorePlugin
6. url-loader, asset module

### 延申

1. webpack 构建流程，hooks
2. tapable
3. esmodule 与 commonjs 差异

## 天翼云盘接入

access_token 获取
跨域状态共享(业务的登录状态带入鉴权服务器)

### 业务场景

有两部分，一是登录换取 access_token，二是跨域同步登录信息

1. 页面嵌入 iframe，url = unifyAccountLogin.do?appId=id&returnURL=http://our.com&state=xxx
2. 登录后 access_token 返回到后台
3. 后续通过 access_token 单点登录完成会员订购功能

### 延申

OAuth2 授权码模式的流程
OAuth2 的其他授权模式：Authorization Code，Client Credentials, Device Code,(不推荐Implicit Flow, Password Grant) https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2#grant-type-client-credentials
