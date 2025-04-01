---
title: "Vue Router 中 path 的解析"
date: 2023-12-15
category: vue
---

> 参考：
>
> vue-router 内部跳转逻辑
>
> [vue-router 中 push 方法 name 和 path 路由跳转的区别（从源码的角度讲）附带性能测试\_router.push name-CSDN 博客](https://blog.csdn.net/qq_36356218/article/details/106833761)

调用 `router.push("path") `时，传入的参数有多种类型。按 vue-router 文档，可传入字符串、对象等：

```js
// literal string path
router.push("home");

// object
router.push({ path: "home" });

// named route
router.push({ name: "user", params: { userId: "123" } });

// with query, resulting in /register?plan=private
router.push({ path: "register", query: { plan: "private" } });
```

当传入具名路由时，跳转的新路由可以由 name 明确地确定，但传入字符串或 path 时，跳转的目的 path 需要经过解析（normalize + resolve）。

## 数据类型

从源码中可知 push 的参数类型为 `RawLocation`

```typescript
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
        return new Promise((resolve, reject) => {
            this.history.push(location, resolve, reject)
        })
    } else {
        this.history.push(location, onComplete, onAbort)
    }
}
```

从类型定义中可以查到 RawLocatiion 可以为字符串或 Location，而 Location 只是一个 Plain Object，

```typescript
export type RawLocation = string | Location;

export interface Location {
    name?: string;
    path?: string;
    hash?: string;
    query?: Dictionary<string | (string | null)[] | null | undefined>;
    params?: Dictionary<string>;
    append?: boolean;
    replace?: boolean;
}
```

## 字符串的内部处理

见参考 [vue-router 中 push 方法 name 和 path 路由跳转的区别（从源码的角度讲）附带性能测试\_router.push name-CSDN 博客](https://blog.csdn.net/qq_36356218/article/details/106833761) 中 push 的内部实现，调用 push 后以下三个函数依次调用：

```typescript

transitionTo (
    location: RawLocation,
    onComplete?: Function,
    onAbort?: Function
)


function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
   		 var location = normalizeLocation(raw, currentRoute, false, router);
		 // ...
    }


function normalizeLocation (
  raw,
  current,
  append,
  router
)
```

​ 三个函数的第一个参数均是 `RawLocation`，在 `normalizeLocation` 中才正式处理。

normalizeLocation 也被封装在 [router.resolve](https://v3.router.vuejs.org/api/#router-resolve) 中，返回值中的 location 即调用 normalize 后的返回值

### `normalizeLocation` 源码

来看源码（已删减，仅保留与字符串处理相关逻辑）

```typescript
function normalizeLocation(raw, current, append, router) {
    // 1. 字符串包装为对象
    var next = typeof raw === "string" ? { path: raw } : raw;

    // named target
    if (next._normalized) {
        return next;
    } else if (next.name) {
        // ...
        return next;
    }

    // relative params
    if (!next.path && next.params && current) {
        next = extend({}, next);
        next._normalized = true;
        var params$1 = extend(extend({}, current.params), next.params);
        // ...
        return next;
    }

    // 2. 处理字符串的核心逻辑
    var parsedPath = parsePath(next.path || "");
    var basePath = (current && current.path) || "/";
    var path = parsedPath.path
        ? resolvePath(parsedPath.path, basePath, append || next.append)
        : basePath;

    // 处理 query 和 hash
    // ...

    return {
        _normalized: true,
        path: path,
        query: query,
        hash: hash,
    };
}
```

从源码中可知，处理字符串最终进入的逻辑为 `resolvePath`. 从传参可以看出，该函数处理（resolve）跳转路径与当前路径的跳转关系：

```typescript
export function resolvePath(
    relative: string,
    base: string,
    append?: boolean
): string {
    const firstChar = relative.charAt(0);
    if (firstChar === "/") {
        return relative;
    }

    if (firstChar === "?" || firstChar === "#") {
        return base + relative;
    }

    const stack = base.split("/");

    // remove trailing segment if:
    // - not appending
    // - appending to trailing slash (last segment is empty)
    if (!append || !stack[stack.length - 1]) {
        stack.pop();
    }

    // resolve relative path
    const segments = relative.replace(/^\//, "").split("/");
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        if (segment === "..") {
            stack.pop();
        } else if (segment !== ".") {
            stack.push(segment);
        }
    }

    // ensure leading slash
    if (stack[0] !== "") {
        stack.unshift("");
    }

    return stack.join("/");
}
```

从源码中可知，当 relative 的首字符为 `/` 时会直接返回 relative， 此时 relative 作为绝对路径跳转（不考虑 base)。

注释 remove trailing segment 说明当未指定 append 时，base 中的最后一个路径会被略去，因此单独传入字符串后的跳转页面与原页面为兄弟关系（`/path/src` push("dest") 跳转至 `/path/dest`）

从源码还能得知 push 方法也可以用于在同一页面跳转锚点（hash）或更新 query 参数，仅需要传入以 `#` 或 `?` 打头的字符串即可。
