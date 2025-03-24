---
title: babel 插件开发
category: babel
---


### 环境搭建

使用 typescript 和 @babel/helper-plugin-utils 可以更好的获取类型提示

```json
// package.json
{
  "name": "sourcecode",
  "packageManager": "yarn@4.4.1",
  "dependencies": {
    "@babel/core": "^7.26.10"
  },
  "devDependencies": {
    "@babel/helper-plugin-utils": "^7.26.5",
    "@types/babel__helper-plugin-utils": "^7.10.3",
    "@types/node": "^22.13.10"
  }
}
```

### 插件示例1
实现模块导入的 tree shaking
```js
// input
import { Button, Alert } from "hey-store"
// output
import Button from "hey-store/Button"
import Alert from "hey-store/Alert"
```
参考实现
https://juejin.cn/post/7028584587227824158


```ts
import { declare } from '@babel/helper-plugin-utils';
import t from '@babel/types';

export interface Options {
  libraryName: string;
}

export default declare((api, options: Options) => {
  api.assertVersion(7);

  const { libraryName } = options;
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { node } = path;
        if (node.source.value !== libraryName ||
            node.specifiers.some(specifier => t.isImportDefaultSpecifier(specifier))) {
          return;
        }
        const { specifiers } = node;

        const importDeclarations = specifiers.map((specifier: t.ImportSpecifier) => {
          const moduleName = (specifier.imported as t.Identifier).name;
          const localIdentifier = specifier.local;
          return generateImport(moduleName, localIdentifier)
        });

        path.replaceWithMultiple(importDeclarations);
      }
    }
  }
  function generateImport(moduleName: string, localIdentifier: t.Identifier) {
    return t.importDeclaration(
      [t.importDefaultSpecifier(localIdentifier)],
      t.stringLiteral(`${libraryName}/${moduleName}`)
    );
  }
});
```

TODO 如何使用 decalre 定义的插件 如何传入 api, option, dir 属性

### 插件示例2
箭头函数转换为普通函数
参考实现：https://juejin.cn/post/7025237833543581732#heading-27
官方实现：packages\babel-plugin-transform-arrow-functions\src\index.ts

babel 的 path 中已封装了 path.arrowFunctionToExpression() 方法


### 插件示例3
自动中文翻译
https://juejin.cn/post/7209967260898525242
