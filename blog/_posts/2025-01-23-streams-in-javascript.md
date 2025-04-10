---
title: JavaScript 中的 Stream
category: javascript
---

### ReadStream 处理框架

一些内置的方法直接返回 ReadableStream，例如网络请求 fetch 中的 response.body. 有以下多种方法读取 ReadableStream

#### 递归写法

```
const reader = rs.getReader();

return new ReadableStream({
  start(controller) {
    function pump() {

      reader.read().then(({ done, value }) => {
        if (done) {
          controller.close();
          reader.releaseLock();
          return;
        }

        controller.enqueue(value);
        pump();
      });
    }
    pump();
  }
})
```

#### 使用 async 的循环写法

```
const reader = rs.getReader();

return new ReadableStream({
  async start(controller) {
    while (true) {
      const { done, value } = await reader.read();

      // When no more data needs to be consumed, break the reading
      if (done) {
        break;
      }

      // Enqueue the next data chunk into our target stream
      controller.enqueue(value);
    }

    // Close the stream
    controller.close();
    reader.releaseLock();
  }
})

```

#### async iterator 写法

```
return new ReadableStream({
  async start(controller) {
    for await (const chunk of rs) {
      controller.enqueue(chunk);
    }
    controller.close();
  }
})
```

### 关闭 Stream

We've already shown examples of using [`ReadableStreamDefaultController.close()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultController/close) to close a reader. As we said before, any previously enqueued chunks will still be read, but no more can be enqueued because it is closed.

If you wanted to completely get rid of the stream and discard any enqueued chunks, you'd use [`ReadableStream.cancel()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/cancel) or [`ReadableStreamDefaultReader.cancel()`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader/cancel).

调用 Controller 的 close 方法只关闭 reader，enqueued 的 chunks 仍可以被读取，但是新数据不能被 enqueued 了。

调用 Reader 的 cancel 方法会彻底关闭 stream 并丢弃所有 enqueued 的 chunks.

### 参考

1. Stream concept：https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Concepts
2. [Using readable streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams)
