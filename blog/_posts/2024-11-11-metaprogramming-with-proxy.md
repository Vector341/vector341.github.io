---
title: 使用 proxy 进行元编程
categories: javascript metaprogramming
---

# 使用 proxy 进行元编程：Metaprogramming with proxy

## 使用 proxy 作为 handler

如果想拦截一个对象的所有操作，handler 中需要实现 Proxy 支持的每个方法:

```js
const handler = {
	get(target, prop) {
		console.log(`get ${prop}`);
		return Reflect.get(target, prop);
	},
	set(target, prop, value) {
		console.log(`set ${prop} = ${value}`);
		return Reflect.set(target, prop, value);
	},
	...
}
```

这时可以使用特殊构造 proxy 作为 handler:

```js
const handler = new Proxy(
    {},
    {
        get(target, prop) {
            return function (...args) {
                console.log(`${prop} called`, args.slice(1));
                return Reflect[prop](...args);
            };
        },
    }
);
```

此时 proxy 的作用不是普通对象的 wrapper 而是一个 virtual object，它使用编程的方式生成了各个对象。

## 并非所有对象都可以被 proxy 透明地代理

### 源对象的方法中使用了 this

### 源对象在 this 上绑定了不受 proxy 控制的信息

使用 WeakMap 实现私有属性时，weakMap 存储了 this 信息，而 proxy 无法控制 this 的指向。

```js
const _name = new WeakMap();

class Person {
	constructor(name) {
		_name.set(this, name);
	},
	sayName() {
		return _name.get(this);
	}
}
```

### 源对象是 JavaScript 的内置对象

内置对象的一些方法是 internal slots 它们像一般的属性一样在对象上存储，但不能通过 getter/setter 访问。因此通过 proxy 的 get 方法无法拦截。

```js
const target = new Date();
const handler = {};
const proxy = new Proxy(target, handler);
proxy.getDate(); // TypeError: this is not a Date object.
```

## The meta object protocol and proxy traps

proxy 提供了 13 种针对对象的拦截操作，有些操作是 fundenmental operations 它们是 proxy 的基础，有些操作是 derived operations 它们基于 fundamental operations 实现。

- fundenmental operations: apply, defineProperty, deleteProperty, getOwnPropertyDescriptor, ownKeys, preventExtensions, isExtensible, getPrototypeOf, setPrototypeOf
- derived operations: has, get, set, construct

### get 实现的伪代码

```js
// Method definition
[[Get]](propKey, receiver) {
    const desc = this.[[GetOwnProperty]](propKey);
    if (desc === undefined) {
        const parent = this.[[GetPrototypeOf]]();
        if (parent === null) return undefined;
        return parent.[[Get]](propKey, receiver); // (A)
    }
    if ('value' in desc) {
        return desc.value;
    }
    const getter = desc.get;
    if (getter === undefined) return undefined;
    return getter.[[Call]](receiver, []);
}
```

## 不变量 enforcing invariants

对于 non-extensible 和 non-configurable 的属性, proxy 的操作存在一些限制，目的是确保 proxy 的操作不会与源对象的属性冲突。

### 参考

https://exploringjs.com/es6/ch_proxies.html#sec_proxy-use-cases
