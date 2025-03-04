---
layout: post
title: "新闻周报：沉舟侧畔，千帆竞过"
date: 2024-09-07
categories: weekly
---

记录本周内浏览学习的各类知识



## 新闻类

### [CSS 在默认文档流中支持垂直居中](https://build-your-own.org/blog/20240813_css_vertical_center/)

自 Chrome 123 起可以通过一个 CSS 属性实现内容垂直居中！

```
<div style="align-content: center; height: 100px;">
  <code>align-content</code> just works!
</div>
```

CSS 的居中可以算是经典问题了，CSS Trick 有一篇[长文](https://css-tricks.com/centering-css-complete-guide/)专门介绍水平居中与垂直居中方案。水平居中的方案相对简单，而垂直居中曾经只能通过 flex 布局或特殊 trick 实现，现在也终于有了方案。

> 这篇文章来自网站 https://www.build-your-own.org，正如名字所示，网站主要介绍介绍如何从零开始手写自己的 Redis/Database/Compiler/Web Server/Web Pages. 其中 Build Your Own Web Server 使用 Node JS 编写，Build Your Own Compiler 使用 python 编写，都很适合非科班的程序员阅读。
>
> 这几本书在博客上仅提供试读，在 z-library 可以下载到完整版 [From Source Code To Machine Code - James Smith  - download on Z-Library (singlelogin.re)](https://singlelogin.re/book/25210604/6e7427/from-source-code-to-machine-code.html)



### [Google 正在巩固第三方 Cookie](https://brave.com/blog/related-website-sets/)

这是一篇由 Breaver 和大学研究人员发表的论文，概述了谷歌对禁用第三方 cookie 消极的态度。

TODO 精读文章



### [google closure 库正式进入 Archived 状态](https://github.com/google/closure-library/issues/1214)

这是项目组于 2023 年 11 月 1 日发布的公告：2023 年 11 月 1 日，Closure Library 项目逐渐进入维护状态（maintenance mode），这一过程持续 10 个月，2024 年 8 月 1 日，项目正式进入 Archived 状态。此后，Closure Library 项目将不再接受新的功能请求和 bug 报告。

公告中回顾了 Closure Library 项目的开发背景与发展历程，遗憾地表示该项目已经不适合现代 Web 开发。公告为项目的各个模块介绍了替代品，涵盖了 DOM 处理、网络请求、无障碍及测试等方面。

> 我曾经接触过的项目使用 Closure Compiler 作为代码压缩器（打包器），在对源码一定的规范下，它有很好的压缩效果，公告也提及 Closure Compiler 的核心模块会继续维护。但可惜的是 Compiler 使用 Mozilla 的 rihno 引擎作为 JavaScript 运行时，它在一些非规范要求的场景下与 V8 表现差异较大，对项目代码提出更高的要求。
 

### [Firefox 计划禁用 HTTP/2 Push](https://news.ycombinator.com/item?id=41464334)

两年前 google 宣布 [Chrome 106 中默认禁用 HTTP/2 Push](https://developer.chrome.com/blog/removing-push/)，如今 Firefox 也做出了这一决定。这一决定的主要原因是项目组近期收到多个有关 HTTP/2 Push 的 bug.

Mozilla 的这一决定再次表明了 HTTP/2 Push 设计的缺陷，在项目中使用这一模式也往往很难带来性能提升（甚至性能退化）。Google 建议使用 [103 Early Hints](https://developer.chrome.com/blog/early-hints) 和 [Preloading](https://web.dev/articles/preload-critical-assets) 作为替代.



## 项目/工具类

### [Hestus](https://www.hestus.co/)

Hestus 是一个集成了 AI 助手的 CAD 工具，现阶段通过 Autodesk Fusion 插件的形式到工作流中。

> 看官方 DEMO 和集成形式，这个工具的应用领域更偏向工业设计类，与土木工程/建筑工程使用的 CAD 工具不属于同一类



### [Porffor](https://porffor.dev/)

从零开始的 JavaScript 编译器，将 JavaScript 编译为 WASM/C/二进制文件。这个项目还在早期阶段，官网记录了 Test262 测试集的通过率，几乎每天都有更新（2024/09/04 已通过 42.26%）。



## 文章类

### [前端构建工具综述](https://sunsetglow.net/posts/frontend-build-systems.html)

一篇详细的综述性文章，从构建过程（build）和开发过程（dev）两个方面介绍前端构建需要解决的问题和相应的工具。内容几乎涉及了现代 web 开发需要的各类工具/工具链，读完可以对前端构建有一个全方位的认识。

文章的目录如下，仅阅读目录就能了解前端的大致构建流程：

```
1. Build Steps
    1.1. Transpilation
    1.2. Bundling
        1.2.1. Code Splitting
        1.2.2. Tree Shaking
        1.2.3. Static Assets
    1.3. Minification
2. Developer Tooling
    2.1. Meta-Frameworks
    2.2. Sourcemaps
    2.3. Hot Reload
    2.4. Monorepos
3. Trends
```



### [What Color is Your Function?](https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/)

异步编程思想的经典文章，形象地用红色/蓝色表示同步/异步函数，介绍了由异步性引入的问题与主流语言的解决方案。值得一提的是作者 Bob Nystrom 的博客内容非常丰富，包括有关游戏编程模式与[手写编译器](https://craftinginterpreters.com/)的两本书籍。



### [JavaScript 模块设计模式](https://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html)

介绍在 CommonJS, AMD, ES Module 诞生之前原生的 JavaScript 如何实现模块化。模块化的基础是函数作用域与立即执行函数，以此衍生了增强、克隆、继承等多种模块化设计模式。



### [Web 剪切板是如何存放数据的？](https://alexharri.com/blog/clipboard)

文章介绍了 Web 中与剪切板有关的 Clipboard API 和 Clipboar Event 的用法及限制，并以 Google Docs 和 Figma 为例分析它们如何实现自定义数据的复制/粘贴。作者不仅局限于讨论 Web 剪切板，还以 Windows 与 MacOS 为例介绍了 Web 剪切板如何与系统剪切板交互。

> Clipboard API 相关的 API：Secure Context，Blob，Clipboard API，Async I/O; 
>
> Clipboard Events API 相关的 API：DataTransfer, DataTransferItem
>
> 我使用 Clipboard API 实现了以下 DEMO 用于熟悉 API
>
> 剪切板读写 - using Clipboard API [DEMO](https://codepen.io/vector341/pen/dyBwaeN)

