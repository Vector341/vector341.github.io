---
title: 第三方 cookie 与浏览器隐私政策的演进
---



### IE11 等早期浏览器

针对第三方 cookie 没有任何限制。内嵌的 iframe 发送请求可以携带 cookie，收到响应后也可以正常种下 cookie

### Chrome 

版本：122

Chrome 已经针对第三方 cookie 进行了一定的管控。对于没有指定 SameSite 的 cookie，默认视为 SameSite=Lax。这类 cookie 在 iframe 中发送时不会携带，只有当用户通过导航跳转到对应 URL 后才会携带。同时 iframe 收到响应后也会不会种下 cookie. 报错信息如下：

```
The Set-Cookie headers didn't specify a "SameSite" attribute and was defaulted to "SameSite=Lax", and was blocked because it came from cross-site respone which was not the the response to a top-level navigation. The Set-Cookie had to have been with "SameSite=None" to enable cross-site usage.
```

**解决方案**

1. 服务器侧使用 https 连接并为 cookie 设置 `SameSite=None;Secure` 

2. 客户端/浏览器侧可以通过重定向/导航的方式访问第三方域名，并在该域名下种下 cookie. 后续请求需要携带 cookie 时也可以通过导航/跳转第三方域名的方式携带 cookie



### Firefox

上述浏览器采用的仍然是传统的 cookie 存取机制：同一域名下的 cookie 保存在同一 cookie jar 中，浏览器以域名作为主键排列各个 cookie jar。这种方式存在很很多的安全隐患：

1. 一个顶级站点 A 可以通过嵌入另一个顶级站点 B 的资源或文档（document）推断用户是否访问过 B 站点。此外，A 站点还可以推断出用户在 B 站点的更多信息；
2. 反之，某个站点可以通过将资源文件嵌入到许多不同的站点中来跨站追踪用户

Firefox 采用了 State Partitioned 的策略，每个 cookie jar 有两个主键：<domain, top> 当浏览器保存 cookie 时除了记录 set-cookie 的 domain 字段，还会记录当前请求的 document context，即 window.top 的 url. 

在这样的策略下，不同 tab 种下的 cookie 在不同的 cookie jar 中，各 tab 间的请求只能携带自身 cookie jar 中对应的 cookie. 这种方式加强了不同 tab 间 cookie 的隔离等级，但同个 tab 下的不同 domain 的 cookie 的隔离等级却降低了。ifram 中的第三方请求也可以正常地设置 cookie（尽管被限制在了该 tab 中）





Ref

windows 磁盘上各个浏览器存储 cookie 的位置：[Where are cookies stored in Windows? (Chrome, Firefox, Edge, Opera)](https://www.digitalcitizen.life/cookies-location-windows-10/)