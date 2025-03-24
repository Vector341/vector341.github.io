---
title: Cypress入门介绍
date: 2024-02-19
categories: cypress test
---

# Cypress 简介

## 前言

Cypress 是一个 all in one 的前端测试框架，它集成了 Test Runner、断言库、UI 以及工具库。想要了解 Cypress 这类框架的工作原理，可以从它的各个模块入手。Cypress 文档中的 FAQ 章节总结了它集成或参考的各个框架 [How is this different from 'X' testing tool \| General Questions](https://docs.cypress.io/faq/questions/general-questions-faq#How-is-this-different-from-X-testing-tool)。其中 Mocha 是 Cypress 直接依赖的测试框架，Cypress 并没有对它做任何修改/重新实现，因此 Mochai 的 BDD(Behavior Driven Do) 语法在 Cypress 中都是通用的。

Mochai 只是一个 Test Runner，它提供了实用的方法 `descirbe`, `it` 等用于组织测试用例。Chai 则是 Mochai 官方支持的断言库，Chai 提供了两种风格的断言方式，包括 TDD(`assert`) 和 BDD(`expect`, `should`).

遗憾的是，Mochai 的官方文档并结构不够清晰，而且缺乏类似 Guide 的章节，直接阅读的门槛较高。好在 BDD 的测试思想与设计模式具有通用性，Node 内置库 Test Runner 就实现了 Mochai 的很大一部分的功能，且 API 与 Mochai 高度一致（`descirbe`, `it`）。同时，Node 也有内置的断言库 Assert，提供了类似 Chai 中 BDD 风格的 API (`assert`). 因此 Node 的官方文档是入门测试很好的参考书，也是进一步学习 Mochai 等其他测试框架的基石。

### Test Runner - Mochai

[Test runner \| Node.js v18.19.1 Documentation (nodejs.org)](https://nodejs.org/docs/latest-v18.x/api/test.html)

#### `it` is a shorthand for [`test()`](https://nodejs.org/docs/latest-v18.x/api/test.html#testname-options-fn). 
test 用于定义一个测试用例
```js
test('synchronous passing test', (t) => {
  // This test passes because it does not throw an exception.
  assert.strictEqual(1, 1);
});
```

describe 和 it 用于定义嵌套的测试用例：
```js
describe('A thing', () => {
  it('should work', () => {
    assert.strictEqual(1, 1);
  });

  it('should be ok', () => {
    assert.strictEqual(2, 2);
  });

  describe('a nested thing', () => {
    it('should work', () => {
      assert.strictEqual(3, 3);
    });
  });
});
```


### 断言库 - Chai
Chai 则是 Mochai 官方支持的断言库，Chai 提供了两种风格的断言方式，包括 TDD(`assert`) 和 BDD(`expect`, `should`).

#### TDD 风格 - assert
使用 `assert` 风格的断言类似于 Node 的内置库 Assert:
```js
assert('foo' !== 'bar', 'foo is not bar');
```

#### BDD 风格 - expect, should

**should风格**
```js
cy.get(".proName").should("contain", info.model).should("be.visible");
```

## 介绍

### 整体架构与框架

[Cypress系列（2）- Cypress 框架的详细介绍 - 小菠萝测试笔记 - 博客园 (cnblogs.com)](https://www.cnblogs.com/poloyy/p/12966125.html)

Cypress 将测试脚本代码和项目代码都加载入浏览器不同的 iframe 中执行，因此测试脚本的执行环境也是浏览器，会收到浏览器安全策略的限制。



### 与 Selenium 的对比

Cypress 文档通过问答的方式简要介绍了自己的底层架构、工作原理和使用的其他库（Mochai 等）[General Questions \| Cypress Documentation](https://docs.cypress.io/faq/questions/general-questions-faq#How-is-this-different-from-X-testing-tool)。 其中提及 Cypress 不同于 Selenium，它的底层没有使用 WebDriver，也不存在 language binding 等模块，除此之外，它们之间还有两个主要的不同：

- Cypress runs in the context of the browser. With Cypress it's easier to inspect what is running in the browser, but harder to talk to the outside world. In Selenium it's the exact opposite. Selenium runs outside of the browser where your application is running (though Cypress is adding more commands every day that give you access to the outside world - like [`cy.request()`](https://docs.cypress.io/api/commands/request), [`cy.exec()`](https://docs.cypress.io/api/commands/exec), and [`cy.task()`](https://docs.cypress.io/api/commands/task)).
- With Selenium you get either 100% simulated events (with Selenium RC) or 100% native events (with Selenium WebDriver). With Cypress, you get both. For the most part we use simulated events. However we do use automation APIs for things like Cookies where we extend outside of the JavaScript sandbox and interact with the underlying browser APIs. This gives us flexibility to determine which type of event to use in specific situations. Native event support is on our [roadmap](https://docs.cypress.io/guides/references/roadmap).

第二点中提及了模拟事件（simulated event） 和原生事件（native event），其中模拟事件指通过 JavaScript 触发的事件，它的 `event.isTrusted` 是 `false`。Cypress 中大部分 API （`cy.click` 和 `cy.type`）等都是模拟事件，不过也有一些第三库实现了部分原生事件 [cypress-real-events - npm ](https://www.npmjs.com/package/cypress-real-events)



#### Selenium 的架构

[Selenium components \| Selenium](https://www.selenium.dev/documentation/overview/components/)





# 文档学习

## Core Concepts

记录 Cypress 官方文档 Core Concept 章节：https://docs.cypress.io/guides/core-concepts/introduction-to-cypress



cy.get 基于 jQuery 的选择器封装，因此支持 jQuery 的语法：

```js
// Each Cypress query is equivalent to its jQuery counterpart.
cy.get('#main-content').find('.article').children('img[src^="/static"]').first()
```



cy.get 是异步的，它封装了基本的重试操作，当元素未找到时会持续重试直到找到该元素或超时

```js
cy
  // cy.get() looks for '#element', repeating the query until...
  .get('#element')

  // ...it finds the element!
  // You can now work with it by using .then
  .then(($myElement) => {
    doSomething($myElement)
  })
```


### cy.exec

exec 方法提供了执行任意命令的方法

初次之外 cy.task 提供了执行 node 命令的方法，cy.request 提供了发送请求的方法



### 调试 Cypress 

Cypress 的代码均是异步执行的，因此在 cy.get 命令的同一作用域插入 debugger 命令并不能查看 cy 查询到的元素

```js
it('let me debug like a fiend', () => {
  cy.visit('/my/page/path')

  cy.get('[data-testid="selector-in-question"]')

  debugger // Doesn't work
})
```

正确的做法是像调试 Promise 语句一样在 then 中添加 debugger

```js
it('let me debug when the after the command executes', () => {
  cy.visit('/my/page/path')

  cy.get('[data-testid="selector-in-question"]').then(($selectedElement) => {
    // Debugger is hit after the cy.visit
    // and cy.get commands have completed
    debugger
  })
})
```

cypress 也提供了 `cy.debug` 的 API 便于调试

```
cy.get('[data-testid="selector-in-question"]').debug()
```



## Network Request

[Network Requests \| Cypress Documentation](https://docs.cypress.io/guides/guides/network-requests)

[intercept \| Cypress Documentation](https://docs.cypress.io/api/commands/intercept#Interception-lifecycle)

Cypress 提供了 `cy.intercept` 这一 API 用于 spy 或 stub 网络请求，它可以接收多种参数，用于 Mock 数据、修改服务器返回数据等。

### 使用方法

调用 `cy.intercept ` 的前一个/前几个请求用于指定监听的请求，可以通过 URL, path, method, [RouteMatcher]([intercept \| Cypress Documentation](https://docs.cypress.io/api/commands/intercept#routeMatcher-RouteMatcher)) 等指定。之后的参数用于指定响应的数据，可以通过对象字面量、fixture 等方式提供。

不同于请求时使用 Promise 的链式调用，直接调用 intercept 不会 yield 任何数据，需要通过别名 Alias 或回调来获取请求和响应数据。

**Alias**

通过别名可以获取这个 intercept 的引用，后续通过 wait 方法拿到 [interception]([intercept \| Cypress Documentation](https://docs.cypress.io/api/commands/intercept#Using-the-yielded-object)) 对象。

```js
cy.intercept({
  method: 'POST',
  url: '/myApi',
}).as('apiCheck')

cy.visit('/')
cy.wait('@apiCheck').then((interception) => {
  // 'interception' is an object with properties
  // 'id', 'request' and 'response'
  assert.isNotNull(interception.response.body, '1st API call has data')
})

cy.wait('@apiCheck').then((interception) => {
  assert.isNotNull(interception.response.body, '2nd API call has data')
})

cy.wait('@apiCheck').then((interception) => {
  assert.isNotNull(interception.response.body, '3rd API call has data')
})
```

另一种获取别名的方式是在 intercept 的回调中设置 req 的 alias 属性，这种方法赋予了我们筛选请求时更高的自由度: 当通过请求路径和 query 定位请求仍不够准确时，可以在回调中通过请求体判断。

```js
cy.intercept('POST', '/graphql', (req) => {
  if (req.body.hasOwnProperty('query') && req.body.query.includes('mutation')) {
    req.alias = 'gqlMutation'
  }
})
```

**routeHandler**

使用 routeHandler 作为 `cy.intercept` 的最后一个参数可以访问到整个请求-响应的数据。

```js
    cy.intercept("/stok=*/ds", (req) => {
      if (req.body.custom_woclient) {
        req.on("before:response", (res) => {
          console.log("before response");
        })

        req.on("response", (res) => {
          console.log("response");
        });

        // 调用 continue 立即结束请求阶段，将请求发送至服务器
        // continue 的回调包括响应数据，可以对响应数据进行操作
        req.continue((res) => {
          console.log("continue", res);
          const data = res?.body;

          if (data) {
            let error_code = JSON.parse(data).error_code;
            expect(error_code).to.equal(0);
          }
        });

        req.on("after:response", (res) => {
          console.log("after response");
        })
      }
    });
```







## 测试用例的组织

>**Spec** A single test file that contains a set of test cases or individual tests. Each spec file typically focuses on testing a specific feature, functionality, or aspect of the application under test. Specs define the test scenarios, interactions with the application, and assertions to verify expected behavior. Spec files are written in JavaScript or TypeScript and have a `.js` or `.ts` extension.
>
>**Test** An individual test case within a spec file. It represents a specific scenario or behavior that needs to be tested. A test typically consists of a series of actions performed on the application being tested, such as interacting with UI elements, submitting forms, or making assertions to validate the expected outcomes. Cypress provides a rich set of built-in commands and APIs to facilitate writing tests and interacting with the application in a declarative manner.
>
>**Test Suite** A collection of spec files that are grouped together. It allows you to organize your tests based on different criteria, such as functional areas, modules, or specific features. A test suite can include multiple spec files, each containing one or more tests. By grouping related tests together in a test suite, you can organize and manage your tests more effectively. Cypress provides options to run individual spec files, multiple spec files, or the entire test suite during test execution.

简而言之，**Test** 指代一个测试用例；**Spec** 在形式上是一个文件，一般由多个 Test 组成；而 **Test Suite** 则是多个文件组成的一套测试。



# Example

记录一些小项目，代码示例

## 测试覆盖率

[Code Coverage \| Cypress Documentation](https://docs.cypress.io/guides/tooling/code-coverage)

测试覆盖率的统计主要分为两步：instrumenting code 和 run test

### Instrumenting code

这一步有两种方法可以实现，分别如下：

#### 手动执行

这里使用的库是 [Istanbul](https://istanbul.js.org/) 和它的命令行工具 [nyc](https://github.com/istanbuljs/nyc)

```
npx nyc instrument --compact=false src instrumented
```

运行该命令即可生成被”测量“的带代码 instrumented

#### 在转译中加入流程

使用  [`babel-plugin-istanbul`](https://github.com/istanbuljs/babel-plugin-istanbul) 可以将 instrument 的加入转译的过程中

```
// .babelrc
{
  "presets": ["@babel/preset-react"],
  "plugins": ["transform-class-properties", "istanbul"]
}
```

### 运行测试并生成测试覆盖率报告

执行测试命令后即可生成文本、JSON 或 HTML 格式的报告



## 组件测试

### 组件样式

组件测试中引入样式也是测试的重要组成部分。例如 Modal 组件需要正确地设置 z-index 才能生效。

Jest 和 Vitest 等基于 Node 的测试框架不能发现这类问题，因为它们在例如 JSDom 的模拟 DOM 环境中渲染你的组件和样式。JSDom 没有盒模型和相关的断言，例如父元素遮盖了子元素并阻止点击这类情况在缺少真是的浏览器环境下是无法测试的。

> 这里 Cypress 文档提到了 Jest 等框架的运行原理和框架。与之不同的是 Cypress 是基于浏览器的测试框架



## 添加调试

当遇到涉及 Cypress 的内部问题时，可能需要打开该框架的内部打印，具体命令见 Guide => Command Line 章节

Cypress 内部有很多模块，打开调试时可以选择性地打开。具体的模块见：[Troubleshooting Print DEBUG logs \| Cypress Documentation](https://docs.cypress.io/guides/references/troubleshooting#Print-DEBUG-logs)

**打开调试打印**

```
DEBUG=cypress:*
// On Windows
set DEBUG=cypress:*

cypress run
// or cypress open
```





# 疑难问题

## cy.origin

[origin \| API](https://docs.cypress.io/api/commands/origin)

[Web Security \| Guide](https://docs.cypress.io/guides/guides/web-security#Different-superdomain-per-test-requires-cyorigin-command)

[Cross Origin Testing \| Guide](https://docs.cypress.io/guides/guides/cross-origin-testing)

### 背景

测试路由器多域名时需要在一个测试项中访问多个域名，由于 Cypress 框架的限制而涉及了跨域的问题。



### 解决方案

**方案一**

通用的方法是使用 cy.origin，它明确回调中的代码在第一个参数中的域内执行。因此需要访问多个域名的示例测试代码如下：

```
info.multiDomainUrl.forEach((item) => {
    cy.origin(item, () => {
        cy.visit("/");
            cy.get("#Login").should("be.visible");
        });
});
```

cy.origin 具有最广泛的普适性，然而在内网的网络拓扑下存在严重的问题。（见后文描述）



**方案二**

跨域产生的原因是浏览器同源规则（same-origin policy）的限制，主动关闭该限制可以便于 Cypress 的测试。需要注意的是 Cypress 当前只支持 chromium 系列的浏览关闭安全限制，设置项为 `chromeWebSecurity: false`, 详见 [Disabling Web Security \| Web Security](https://docs.cypress.io/guides/guides/web-security#Disabling-Web-Security)

关闭同源限制后无需使用 cy.origin 也可以正常地跨域访问资源，示例代码如下：

```
info.multiDomainUrl.forEach((item) => {
    cy.visit(item);
    cy.get("#Login").should("be.visible");
    cy.url().should("contain", item);
});

```



### 测试跨域访问中的问题

**前提：**当测试路由器拓扑时才会出现此类问题，访问公网域名（http://example.com/)  等不会出现问题。这两者的主要差异在于测试路由器的域名解析时需要关闭 PC 的公网连接，将 PC 接入路由器的局域网中，因此整个测试环境是无公网访问的。



#### 现象

**Cypress 的问题**

部分 Cypress 的功能会因无网络访问而失效，具体表现为 ` cypress open ` 启动控制台变慢。



**浏览器的问题**

当使用 cy.origin 跳转其他域名时，chrome 和 edge 出现加载极慢的情况（资源加载 20~30s）。而 firefox 和 electron 正常执行。



无公网访问时，因此很多浏览器的的 API 都会访问失败，导致频繁重试耽误测试网址的解析：

> set DEBUG=cypress:network:* -cypress:network:cors 

浏览器访问的具体 API 与浏览器开发商相关，例如 chrome 下访问的 API 包括 `clients2.google.com`, `content-autofill.googleapis.com` 等，这也导致了不同浏览器访问的 URL 数量与频率不同，因此在不同浏览器下有不同的表现。



### Bug 记录

多域名测试中常常会测试失败，但失败的原因大不相同，这里记录几种典型的 bug log

#### Bug 1

```
Uncaught (in promise) Error: backend:request failed to receive a response from the primary Cypress spec bridge within 10 second.
    at cypress_cross_origin_runner.js:185318:12
```



#### Bug 2

```
http://wowifi.smartont.net/

We attempted to make an http request to this URL but the request failed without a response.

We received this error at the network level:

  > Error: getaddrinfo ENOTFOUND wowifi.smartont.net

Common situations why this would fail:
  - you don't have internet access
  - you forgot to run / boot your web server
  - your web server isn't accessible
  - you have weird network configuration settings on your computer
      at eval (webpack:///./cypress/e2e/router/cmcc/main.cy.js:716:11)
  at Array.forEach (<anonymous>)
      at Context.eval (webpack:///./cypress/e2e/router/cmcc/main.cy.js:712:26)
  From Your Spec Code:
      at eval (webpack:///./cypress/e2e/router/cmcc/main.cy.js:716:11)
  at Array.forEach (<anonymous>)
      at Context.eval (webpack:///./cypress/e2e/router/cmcc/main.cy.js:712:26)

  From Node.js Internals:
    Error: getaddrinfo ENOTFOUND wowifi.smartont.net
        at GetAddrInfoReqWrap.onlookup [as oncomplete] (node:dns:108:26)

```



**Bug3**

重试超时：无论是 cy.origin 还是 cy.visit 的超时都归于这一类，此时通过手动设置超时时间可以通过测试用例。

```
// cypress.config.js
pageLoadTimeout: 520000,

// main.cy.js
it.only(index + ".多域名测试项", { defaultCommandTimeout: 50000 }, () => {
// 测试用例
})

```









### 浏览器差异

#### Chrome & Edge

Chrome 和 Edge 等基于 Chromium 内核的浏览器会受配置项中 chromeWebSecurit 的影响，而 firefox 则不会

#### Electron

When working with Electron, it is important to understand that Electron is not a web browser. It allows you to build feature-rich desktop applications with familiar web technologies, but your code wields much greater power. JavaScript can access the filesystem, user shell, and more. This allows you to build high quality native applications, but the inherent security risks scale with the additional powers granted to your code.

#### Firefox

**问题1：**当网络仅连接内网时，启动项目会卡住

**问题2：**关闭浏览器时仍会显示运行中，只能全部关闭











>1. 页面上修改DNS时，要更改一个字段，如邮件前文所述。
>
>2. 页面修改工作模式时（包括桥切成路由；路由切成桥；路由模式下切成pppoe、dhcp、static等），需要将/custom_system/default_config_status/default_config_status的 workmode设为1。
>3. 页面对双频合一做出任何修改时，都需要将/custom_system/default_config_status/default_config_status的bandsteering设为1
>4. 用户通过页面修改MLO的时候，需要/custom_system/default_config_status/default_config_status的mlo设为1
