---
date: 2024-08-31
title: Javascript 中的模块化
categories: javascript module
---

## Javascript 中的模块化

记录 js 中使用模块化的各种模式以及演化过程，为项目选择一个适合的模块化方案。

```
- amdjs # AMD 规范以及实现
- requirejs-demo # requirejs 项目示例，包括 requirejs 源码
- almond-dev0.1 # 简化的 AMD 规范实现
```

### 模块化的基础

Javascript 语言特性中的函数作用域可以作为模块化很好的载体，匿名函数成为早期的模块化方案。

#### 匿名函数

匿名函数创建的闭包为内部的作用域提供了 privacy and state

```js
(function () {
    // ... all vars and functions are in this scope only
    // still maintains access to all globals
})();
```

#### 全局导入

匿名函数中的代码可以通过作用域链的方式访问到全局变量，但这会使模块的依赖变得模糊，因此可以通过传递参数的方式将全局变量有选择性的传递给匿名函数

```js
(function ($, YAHOO) {
    // now have access to globals jQuery (as $) and YAHOO in this code
})(jQuery, YAHOO);
```

#### 模块导出

约定匿名函数的返回值为一个对象，即将内部需要导出的变量放入对象中并通过返回值导出

```js
// module.js
var MODULE = (function () {
    var my = {},
        privateVariable = 1;

    function privateMethod() {
        // ...
    }

    my.moduleProperty = 1;
    my.moduleMethod = function () {
        // ...
    };

    return my;
})();
```

#### 跨文件导入

借助 $.ajax 和 eval 我们可以将上面 module.js 中导出的模块引入

```js
// index.js

$.ajax("./module.js").then((res) => {
    var module = eval(res); // {moduleProperty, moduleMethod}
    var modulePropery = module.moduleProperty;
    var moduleMethod = module.moduleMethod;
});
```

### RequireJS 简介

RequireJS 是一个 JavaScript 的文件和模块的加载器。它为浏览器环境优化，可以提升代码执行速度和代码质量。

RequireJS 具有优秀的兼容性，兼容几乎所有主流浏览器，可以满足项目需求（IE 6+，Firefox 2+，Safari 3.2+，Chrome 3+，Opera 10+）

**主要优势**

RequireJS 作为模块加载器，使得跨文件的引用成为可能。在原生的浏览器环境下，如果文件 A 需要引用文件 B 的方法，只能将方法暴露在全局变量中。当项目中文件较多时，所有方法暴露在全局中会引起混乱，也使得各个文件的依赖关系不够清晰。

使用 RequireJS 的将各个文件模块化方法后，RequireJS 会统一管理各个模块，各文件的引用关系会更加清晰。

#### 使用方法

**引入 requirejs**

首先通过 `<script>` 引入 requirejs，并通过 `data-main` 属性指定 requirejs 的入口

```
// 添加 requirejs 入口
// <script data-main="/web-static/dynaform/app.js" src="/web-static/lib/require.js"></script>
var requireScriptNode = document.createElement("script");

requireScriptNode.dataset.main = "/web-static/dynaform/app.js";
requireScriptNode.src = "/web-static/lib/require.js";
document.head.appendChild(requireScriptNode);
```

`data-main` 指定的文件是 requirejs 的入口，文件中可以定义各项目的基本配置，指定 baseUrl. 定义的模块也需要在其中注册

```
requirejs.config({
	baseUrl: "/web-static/dynaform",
	paths: {
		ipv6Cfg: "./ipv6Cfg"
	}
});

```

**定义模块**

通过 define 方法定义模块，同时可选定义该模块的依赖

```
define(["dep1", "dep2"], function (dep1, dep2) {
	// implement the module

    return {
        color: "black",
        size: "unisize"
    }
});
```

**引用模块**

通过 require 方法引用模块

```
require(['foo'], function(foo) {
	// foo is the exported module object
});
```

### RequireJS 原理解析

通过阅读 RequireJS 的源码，我们可以了解到模块化的实现原理。

#### 模块加载的方式

`req.load` 在浏览器环境下加载(load)模块，

RequireJS 提供了三种方式用于加载脚本文件：

| 底层实现                  | RequireJS 方法 | 使用场景             |
| ------------------------- | -------------- | -------------------- |
| 动态创建/插入 script 标签 | req.createNode | 浏览器中加载模块     |
| importScripts             | req.load       | WebWorker 中加载模块 |
| eval                      | req.exec       | 用于加载插件         |

#### 动态创建/插入 script 标签

插入标签引入代码等同于 Indirect eval，MDN 介绍了它的以下特点：

- Indirect eval 在全局作用域而非局部作用域，被解析的代码无妨访问局部变量
- Indirect eval 不继承 context 的严格模式，只有被解析的代码声明 `use strict` 才会使用严格模式
- 通过 var 声明的变量和函数定义会进入全局变量

MDN 建议不要使用 direct eval，因为它会劣化 JS 性能、不信任代码注入并使压缩器失效。使用 Indirect eval 可以替代部分使用场景。

## 社区方案 CommonJS

CommonJS 是一个由 NodeJS 主导并实现的模块规范，它定义了模块的加载和导出方式，使用 `require` 和 `module.exports` 语法。

## 语言标准 ESModule

关于 ESModule 的内部原理可参考：https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/

### 数据类型

#### module record

#### module instance

#### module map

### 解析阶段

ESModule 解析的三个阶段

1. Construction — find, download, and parse all of the files into module records.
2. Instantiation —find boxes in memory to place all of the exported values in (but don’t fill them in with values yet). Then make both exports and imports point to those boxes in memory. This is called **linking**.
3. Evaluation —run the code to fill in the boxes with the variables’ actual values.

ES module spec 定义了如何将源码文件解析为 module records, 以及如何 instantiate 和 evaluate 模块，但是没有定义如何获取文件。Loader 负责获取文件，同时控制模块如何被加载。It calls the ES module methods — `ParseModule`, `Module.Instantiate`, and `Module.Evaluate`.

#### Construction

Construction 可以分为以下三个阶段

1. Figure out where to download the file containing the module from (aka module resolution)
2. Fetch the file (by downloading it from a URL or loading it from the file system)
3. Parse the file into a module record

##### Module Resolution

##### Fetch

##### Parse

### 互操作性

互操作性的前提是搞清楚 node 如何将一个文件判断为 ESM 或 CJS https://nodejs.org/api/packages.html#determining-module-system

import 只能在 ES Module 中使用，可以引用 CJS 和 ES. import() 可以在 ES 和 CJS 中使用

require 只能在 CJS 中使用，引用 ES Module 时有特殊要求（top-level await)

## 参考文章

1. 原生 JavaScript 如何实现模块化：[JavaScript Module Pattern: In-Depth (adequatelygood.com)](https://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html)
2. Direct and indirect eval https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#direct_and_indirect_eval
3. AMD example: [JavaScript Tutorial => Asynchronous Module Definition (AMD) (riptutorial.com)](https://riptutorial.com/javascript/example/16341/asynchronous-module-definition--amd-)
4. es-modules-a-cartoon-deep-dive：https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/
