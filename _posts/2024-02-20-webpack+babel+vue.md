---
title: webpack 打包体积优化
category: webapck
---

# webpack

## 源码/原理

TODO 文章：
[A deep dive into webpack's building process](https://medium.com/@magenta2127/a-deep-dive-into-webpacks-bundling-process-part1-6060853e8abd)
[基于源码的 webpack 打包流程分析](https://juejin.cn/post/7355011823277998080)

### tapable

Tapable 实现了在编译过程中的一种**发布订阅者**模式的插件 Plugin 机制。https://juejin.cn/post/7040982789650382855

### 源码解读

手写 webpack：https://juejin.cn/post/7031546400034947108#heading-23

### webapck 内部数据结构

**Entry**

```typescript
declare interface EntryData {
    /**
     * dependencies of the entrypoint that should be evaluated at startup
     */
    dependencies: Dependency[];

    /**
     * dependencies of the entrypoint that should be included but not evaluated
     */
    includeDependencies: Dependency[];

    /**
     * options of the entrypoint
     */
    options: EntryOptions;
}
```

## 压缩体积优化

### 原则

需要搞清楚优化目标：总体打包体积、网络传输体积

根据目标确认流程：例如打包固件时存在 llzma 的压缩流程，更大的单文件体积有利于压缩。compression-webpack-plugin 直接压缩

根据目标流程优化：开启 inline asset 使得资源文件内联（url-loader）

---

-   定位资源占用：https://webpack.js.org/guides/code-splitting/#bundle-analysis 这里介绍了各个插件用于分析打包产物
    [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 显示打包产物各个 chunk 的大小
-   一般较大的体积占用：polyfill, locale

---

建立一套评价机制：

-   如何评估裁剪效果：dist 文件夹大小（最根本），webpack-bundler-analyze 生成报告（仅涉及 js）（最直观），miniFs 打包体积（酌情考虑）
-   裁剪目标：对标 TPOS 的打包体积 (dist: ; js: 1.5MB). 不要关心 miniFs，因为 TPOS 和和 SDMP 后续 miniFs 的逻辑不同.
-   两个优化方案：1. 针对 cpe1300d （可通过裁剪模块等方式）2. 针对更广泛的 SDMP 机型（优化框架）

### 针对 SMBUI 的优化思路

-   利用好内置的优化配置选项：TerserPlugin 传入自定义的配置
-   CSS 优化：`css-minimizer-webpack-plugin`, `mini-css-extract-plugin`
-   splitChunks 提取公共产物
-   生成压缩产物：`compression-webpack-plugin`
-   避免重复使用 asset module 和 file-loader, url-loader
-   浏览器兼容性让步，省去 polyfill
-   dynamic import with variable 动态 import 时使用了运行时变量，全量打包

### webpack optimize in product

| Option        | Description                                                                                                                                                                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `development` | Sets `process.env.NODE_ENV` on `DefinePlugin` to value `development`. Enables useful names for modules and chunks.                                                                                                                                                |
| `production`  | Sets `process.env.NODE_ENV` on `DefinePlugin` to value `production`. Enables deterministic mangled names for modules and chunks, `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin` and `TerserPlugin`. |
| `none`        | Opts out of any default optimization options                                                                                                                                                                                                                      |

If not set, webpack sets `production` as the default value for `mode`.

https://webpack.docschina.org/guides/production/

### Tree shakeing

webpack5 支持更深层的包分析 https://webpack.js.org/blog/2020-10-10-webpack-5-release/#major-changes-optimization
开启 **sideEffect** 可以更好地分析依赖关系

[Webpack 中的 sideEffects 到底该怎么用？ - 前端-专注 javascript - SegmentFault 思否](https://segmentfault.com/a/1190000015689240)
[你的 Tree-Shaking 并没什么卵用 - 知乎](https://zhuanlan.zhihu.com/p/32831172)
[Deep Dive into SideEffects Configuration - DEV Community](https://dev.to/markliu2013/deep-dive-into-sideeffects-configuration-14me)
[vue.js - vue-cli3 创建的项目，开启 sideEffects: \["\*.css"\] 后，vue 里的 style 样式被丢弃了 - SegmentFault 思否](https://segmentfault.com/q/1010000019629950)

## webpack.config.js 配置

具体到配置上，可以参考 react-script(create-react-app)，vue-cli 等生成项目的配置。主要优化点有：chunk, splitChunks, optimization, performance 等

### Optimization TerserPlugin

```js
optimization: {
    // emitOnErrors: true,
    mangleExports: 'size',
    moduleIds: 'size',
    usedExports: true, // 标记出未被导出的变量
    minimize: true, // 去除无用变量并压缩代码
    minimizer: [
        new TerserPlugin({
            test: /\.m?js$/,
            parallel: true,
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    collapse_vars: true,
                    reduce_vars: true
                },
                format: {
                    comments: false
                }
            }
        }),
        new CssMinimizerPlugin()
    ],
}
```

## 优化结果

记录各个方案的优化效果

### gzip 压缩

compression-webpack-plugin + 配置 httpd 支持 pre-compress

压缩前

```sh
>du -h
64K     ./font
575K    ./imgs
2.3M    ./js
276K    ./static/images/topo/device
42K     ./static/images/topo/horizon
42K     ./static/images/topo/vertical
426K    ./static/images/topo
597K    ./static/images
597K    ./static
3.5M    .
```

压缩后

```
D:\需求\cpe3000切换vue\smbui\dist>du -h
64K     ./font
575K    ./imgs
673K    ./js
276K    ./static/images/topo/device
42K     ./static/images/topo/horizon
42K     ./static/images/topo/vertical
426K    ./static/images/topo
597K    ./static/images
597K    ./static
2.0M    .
```

对于 miniFs 的大小无优化作用：1.55MB

### 删除冗余图片

copy-webpack-plugin 的错误使用

```
$ du -h
64K     ./font
490K    ./imgs
2.4M    ./js
3.0M    .

$ du
64      ./font
490     ./imgs
2421    ./js
2996    .
```

miniFs: 1184KB

### 内联图片

```
$ du
64      ./font
32      ./imgs
2509    ./js
2618    .
```

#### webpack5 asset module

all resource

```
$ du
64      ./font
459     ./imgs
2237    ./js
2781    .

du -b
59248   ./font
231573  ./imgs
2170788 ./js
2471795 .
```

all inline

```
du -b
59248   ./font
14111   ./imgs
2458188 ./js
2536492 .
```

auto asset

```
du -b
59248   ./font
14111   ./imgs
2277120 ./js
2491862 .
```

仅内联 4KB 以下的图片

```
{
    test: /\.(png|svg|jpg|gif)$/,
    type: 'asset',
    parser: {
        dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
        }
    }
},
```

# babel

## 如何看懂 babel 实际生效的配置

#### Plugin Ordering https://babeljs.io/docs/plugins#plugin-ordering

> Ordering matters for each visitor in the plugin.

This means if two transforms both visit the "Program" node, the transforms will run in either plugin or preset order.

-   Plugins run before Presets.
-   Plugin ordering is first to last.
-   Preset ordering is reversed (last to first).

#### Print effective configs

You can tell Babel to print effective configs on a given input path

-   powershell

```powershell
$env:BABEL_SHOW_CONFIG_FOR = ".src/myComponent.jsx"; npm start
```

`BABEL_SHOW_CONFIG_FOR` accepts both absolute and relative _file_ paths. If it is a relative path, it will be resolved from [`cwd`](https://babeljs.io/docs/options#cwd).

例如当前项目生效的配置

```json
@babel/preset-env: `DEBUG` option

Using targets:
{
  "edge": "122"
}

Using modules transform: false

Using plugins:
  syntax-numeric-separator { "edge":"122" }
  syntax-nullish-coalescing-operator { "edge":"122" }
  proposal-optional-chaining { "edge":"122" }
  syntax-json-strings { "edge":"122" }
  syntax-optional-catch-binding { "edge":"122" }
  syntax-async-generators { "edge":"122" }
  syntax-object-rest-spread { "edge":"122" }
  syntax-dynamic-import { "edge":"122" }
  syntax-export-namespace-from { "edge":"122" }
  syntax-top-level-await { "edge":"122" }

Using polyfills: No polyfills were added, since the `useBuiltIns` option was not set.
Babel configs on "D:\需求\cpe3000切换vue\smbui\src\core\Router.js" (ascending priority):
config D:\需求\cpe3000切换vue\smbui\.babelrc
{
  "presets": [
    "@babel/env",
    "stage-2",
    "@babel/react"
  ],
  "plugins": [
    "syntax-dynamic-import",
    "transform-vue-jsx"
  ]
}

programmatic options from babel-loader
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "debug": true,
        "targets": {
          "edge": 122
        }
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-transform-runtime"
  ],
  "filename": "D:\\需求\\cpe3000切换vue\\smbui\\src\\core\\Router.js",
  "sourceMaps": false,
  "sourceFileName": "D:\\需求\\cpe3000切换vue\\smbui\\src\\core\\Router.js",
  "caller": {
    "name": "babel-loader",
    "target": "web",
    "supportsStaticESM": true,
    "supportsDynamicImport": true,
    "supportsTopLevelAwait": true
  }
}
```

#### config merge

当在多个地方配置 babel 后，最终生效的配置是通过 merge 形成。
https://babeljs.io/docs/configuration#how-babel-merges-config-items

#### name normalization

当引入 plugin 时，可以通过多种方式指定插件名称。实际插件的解析方式见：
https://babeljs.io/docs/options#name-normalization
