---
title: i18n 实践方案总结
category: i18n
---

### 基本概念

文本 rtl

数字、日期

https://developer.aliyun.com/article/1266640

[Basic Internationalization Principles | Format.JS](https://formatjs.github.io/docs/core-concepts/basic-internationalization-principles)

### 库

vue-i18n，i18n-next， formatjs 等

实际插件：auto-i18n-plugin(https://juejin.cn/post/7209967260898525242)

该插件是一个个人项目，smb 课在插件的基础上做了大量修改，增加了很多配置项，形成了现在这套方案。

## 原理

基本原理

通过 AST 提取源码中的多语言文本，生成特定格式的 json，进入翻译流程，将翻译后的文本重新输入到 intl 函数中

[Application Workflow | Format.JS](https://formatjs.github.io/docs/getting-started/application-workflow#the-workflow)

## 疑难问题

1. 文本来源的多样性，webpack json 配置文件，接口返回文本、vue default 文本等
2. 切换中英文的刷新时序（请求翻译文本+全量刷新）
