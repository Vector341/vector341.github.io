## 前端基础

### HTML

- **Head 和 Meta** title charset link script style keyword description author 等
- **基础标签** div h1 h2 h3 p img ul ol li table 等
- **表单** form input button select 等
- **媒体** video audio 等
- **2D 3D** SVG Canvas 等

### CSS

- **选择器** 标签 class id 属性等
- **图文样式** 字号 行高 颜色等
- 布局
    - inline block inline-block
    - 盒子模型
    - margin 相关：纵向合并，负 margin
    - flex 布局
    - grid 布局
    - float 布局
    - BFC
- 定位
    - relative
    - absolute
    - fixed
    - 定位上下文
- **响应式** viewport rem vw vh
- **渐变和动画** transition animation
- 模块化
    - css module
    - css-in-js
    - BEM
- 第三方库
    - NormalizeCSS ResetCSS
    - PostCSS
    - AnimateCSS HoverCSS
    - TailwindCSS BootStrap
    - Sass Less Stylus
    - caniuse.com 检测浏览器兼容性

### JS 和 ES

- 变量和类型
    - let const
    - undefined string number boolean object functioin symbol bigint
- **字符串**
- **数组**
- **对象**
- **函数**
- **class** 原型，原型链，继承
- **作用域** 作用链，自由变量，闭包
- **异步** Promise Async/await 微任务/宏任务 EventLoop
- **Map 和 Set**
- **Proxy 和 Reflect**
- **Generator** `*` yield
- **正则表达式**
- **日期和时间**
- **模块化** AMD CMD UMD CommonJS ES-Module
- **异常处理**
- **第三方库** lodash jQuery Axios day.js ECharts D3 Anime.js jsPDF UUID i18next ...

### JSX

- **语法糖** 本质是 JS 函数
- **插值和表达式** 写法 `{xxx}`
- **事件** 写法 `onClick={fn}`
- **自定义组件** 首字母大写
- **注释** `{/* This is a comment */}`

### TS

- **新增加的类型** any void never
- **类型定义和检查** 变量，函数参数，函数返回值，class 等
- **数组和元祖**
- **Enum 枚举**
- **自定义类型 type** 交叉类型 联合类型
- **接口 interface** 接口的扩展和继承
- **抽象类 Abstract class**
- **泛型 Generics**
- **装饰器 Decorator**
- **类型定义文件 `.d.ts`** 安装第三方的如 `npm install @types/lodash`
- `tsconfig.json` 配置

### JS Web API

- **DOM API** 查询 创建 修改 移动 DOM 节点，DOM 树，DocumentFragment
- **DOM 事件** 事件绑定，事件冒泡，Event 参数，事件代理
- **BOM API** window navigator screen location history 等
- **存储** cookie localStorage sessionStorage indexedDB
- **Ajax** XMLHTTPRequest fetch
- **通讯** postMessage，BroadcastChannel
- **WebWorker** 线程，sharedWorker，ServericeWorker，通讯
- **jsbridge** 如微信 jssdk

## 网络 HTTP 协议

- **URL** 组成
- **Header** Content-type, Accept, Authorization, User-Agent, Host, Referer, Cookie, Cache-control, Content-length, Connection ...
- **Method** GET, POST, PUT, DELETE, PATCH, RestfulAPI
- **Request** url params body
- **Response** status body set-cookie ...
- **Status code** 10x 20x 30x 40x 50x
- **cookie** 服务端 set-cookie，浏览器禁用第三方 cookie
- **Session** 服务端存储数据
- **JWT** 客户端存储数据，替换 token，OAuth 第三方登录，SSO 单点登录 ...
- **跨域** 浏览器同源策略，JSONP，CORS，跨域传递 cookie
- 浏览器缓存策略
    - 强制缓存 Cache-Control
    - 协商缓存 Etag，If-None-Match，Last-Modified， If-Modified-Since
    - 缓存位置 Memory Cache, Dist Cache, Service worker Cache
- **HTTPS** SSL 协议，SSL 证书，加密过程（非对称和对称加密），通讯过程，options 请求
- **WebSocket**
- **GraphQL**
- **大文件上传** 切片上传，断点续传，秒传

## 框架/库

### React 使用

- **JSX 语法** 上文有介绍
- **函数组件 Functional Component**，纯函数，副作用，生命周期，组件通讯
- **属性 Props**
- **状态 State** 不可变数据，immer.js，“合并”更新，异步更新，表单受控组件
- **Hooks** useState, useEffect, useRef, useContext ... 自定义 Hook, react-use
- **Context** Provider, Consumer
- **性能优化** useMemo, useCallback, React.memo, React compiler ....
- **Suspense 和异步组件**
- **报错 ErrorBoundary**
- **服务端组件 RSC** 服务端渲染 SSR

### React 原理

- **Virtual DOM** React 使用的虚拟文档对象模型，通过对比更新来优化性能
- **Diff 算法** 对比新旧 vdom 并更新真实 DOM
- **Reconciliation** React 的更新算法，用于高效地比较虚拟 DOM 与旧虚拟 DOM 之间的差异，并决定最小化的更新操作
- **React Fiber** React 16 引入的重写的渲染引擎，提供更高效的渲染机制
- **React 合成事件** React 使用事件代理机制，将事件监听器挂载到根 DOM 节点上，而不是每个组件的 DOM 节点，减少了事件监听器的数量，提高了性能
- **React Concurrency** 是 React 18 引入的一项重要特性，使用时间分片和任务调度，用于提升应用的响应性和性能
- **React Batching Update** React 会对多次 state 更新进行批量处理，合并成一次更新，以减少不必要的重渲染和性能开销

### React 生态

- **框架** umijs, Next.js, Remix(react-router), Gatsby, React-Native
- **UI 组件库** AntD, MUI, ShadcnUI
- **状态管理** Redux, Zustand, MobX, Recoil
- **CSS 样式解决方案** TailwindCSS, Styled-components
- **表单和校验** Formik, React hook form
- **数据获取** React Query, SWR, Apollo Client
- **i18n** react-i18next
- **测试** Jest, Reat testing library, Storybook

### Vue 使用

- **脚手架**
- **模板语法** 类和样式，条件渲染，列表渲染，事件绑定，指令
- **响应式** ref，reactive，reactive 局限性
- **Computed**
- **watch** watchEffect
- **表单和 v-model**
- **组件** 生命周期，组件通讯，属性 props
- **插槽 slot**
- **异步组件**
- **动态组件**
- **KeepAlive**
- **组合式函数 Composable** 自定义 Composable，vue-use
- **Setup Script**

### Vue 原理

- **Virtual DOM** Vue 使用虚拟 DOM 来优化 DOM 操作，避免直接操作真实 DOM，从而提高性能
- **Diff 算法** 对比新旧 vdom 并更新真实 DOM
- **响应式原理** Vue 的核心特性之一，通过数据劫持（Object.defineProperty 或 Proxy）实现视图与数据的双向绑定
- **模板编译** Vue 将模板（HTML）编译成渲染函数，并通过虚拟 DOM 渲染 UI。编译过程将模板转换为可执行的 JavaScript 代码
- **异步渲染** NextTick

### Vue 生态

- **框架** Nuxt.js, VuePress
- **路由** Vue-router
- **UI 组件库** ElementPlus, AntDesignVue, VantUI, Vuetify ...
- **状态管理** Vuex, Pina
- **i18n** vue-i18n
- **测试** Vitest, Vue-test-utils, StoryBook

### 其他前端框架/库

- **Angular** 老牌全能框架
- **Selvte** 无 vdom，编译时框架，轻量高效
- **Solid** 无 vdom，响应式编程，高效渲染
