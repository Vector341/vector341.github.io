---
layout: post
title: "Vector's Weekly-20241028"
date: 2024-10-28
categories: weekly
---

# Vector's Weekly-20241028

记录本周内浏览学习的各类知识

## 新闻类

### [Nginx 宣布代码仓库迁移至 Github](https://mailman.nginx.org/pipermail/nginx-announce/2024/ITL3AOQSAJANFJXMM3VOVOIGOUADWFFK.html)

2024/09/06 Nginx 将其代码仓库由 Mercurial 迁移至 Github, 仓库地址：https://github.com/nginx/nginx

## 博客类

### [为什么我们需要 interdiff 的代码评审](https://gist.github.com/thoughtpolice/9c45287550a56b2047c6311fbadebed2)

对 Gerrit 代码评审工作流的介绍，并对比 Github 代码评审的流程，展示了两者的优劣。

### [Windows NT vs. Unix: 从系统设计角度对比](https://blogsystem5.substack.com/p/windows-nt-vs-unix-design)

作者是 Unix 的开发者和长期使用者，在加入微软后希望深入了解 Windows NT 的设计。本文是他从系统设计角度对比了 Windows NT 和 Unix 的不同之处，包括文件系统、进程管理、网络协议等方面。

### [使用 Service Worker 优化 web 性能](https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/)

使用 Service Worker 除了可以缓存 web 页面和静态资源外，还可以通过编程的方式控制响应结果。作者将自己的博客内容拆分成三部分：shell-start, content, shell-end，实现了更精确的缓存策略，同时还使用 Stream 的方式进一步加快了页面渲染速度。文章的代码主要使用 Service Work 的工具库 [workbox](https://developers.google.com/web/tools/workbox/)

**相关链接**
- Mozilla 的 Service Worker 教程：https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
- Chrome Developers 文档：https://developer.chrome.com/docs/workbox/service-worker-overview/
