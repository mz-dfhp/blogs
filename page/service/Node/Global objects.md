# [Global objects](https://nodejs.org/docs/latest/api/globals.html#global-objects)

Node.js 中的全局对象是在所有模块中始终可用的对象。你不需要对它们进行特殊的导入或声明，就可以直接在代码的任何地方使用这些对象。下面我将解释一些基本的全局对象，并给出实际使用的例子。

1. **`global`**：
   这个对象类似于浏览器中的`window`对象，是全局命名空间的一个代表。通常情况下，当你在最顶层范围内声明变量时，这些变量会自动成为`global`对象的属性。

   ```js
   // 设置全局变量
   global.myGlobalVar = "Hello, World!";

   // 在其他文件中无需任何import/require
   console.log(myGlobalVar); // 输出：Hello, World!
   ```

2. **`process`**：
   `process`对象提供了与当前 Node.js 进程相关的信息和控制手段。通过它，你可以访问环境信息、读写标准输入输出、捕获异常等。

   ```js
   // 打印平台信息
   console.log(process.platform);

   // 获取环境变量
   console.log(process.env.PATH);

   // 退出程序
   process.exit(0);
   ```

3. **`console`**：
   用于打印各种级别的日志信息，比如`console.log`, `console.error`, 和 `console.warn`。

   ```js
   // 打印信息到 stdout
   console.log("Log message");

   // 打印错误到 stderr
   console.error("Error message");
   ```

4. **`Buffer`**：
   在 Node.js 中，`Buffer` 类是用来处理二进制数据的。例如，从文件系统读取文件时，数据会被存储在`Buffer`对象中。

   ```js
   // 创建一个 Buffer
   const buf = Buffer.from("Hello, World!");

   // 打印 Buffer 内容
   console.log(buf.toString()); // 输出：Hello, World!
   ```

5. **`__dirname`** 和 **`__filename`**：
   这两个对象分别表示当前执行脚本的目录路径和文件路径。

   ```js
   // 输出当前文件所在的目录
   console.log(__dirname);

   // 输出当前文件的完整路径
   console.log(__filename);
   ```

6. **`setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`**：
   这些函数用于处理异步操作中的时间问题。`setTimeout`用于延时执行，而`setInterval`用于定时重复执行某项任务。

   ```js
   // 延时 1 秒后打印信息
   setTimeout(() => {
     console.log("This message is shown after 1 second.");
   }, 1000);

   // 每隔 2 秒打印信息
   const intervalId = setInterval(() => {
     console.log("This message is shown every 2 seconds.");
   }, 2000);

   // 停止定时重复执行的任务
   clearInterval(intervalId);
   ```

这些只是 Node.js 中多个全局对象的简单介绍和例子。全局对象还有很多其他的，比如`require`、`module`等，它们在 Node.js 编程中都扮演着非常重要的角色。随着你逐渐深入学习，你会逐渐理解并熟练运用这些全局对象。

## [Class: AbortController](https://nodejs.org/docs/latest/api/globals.html#class-abortcontroller)

Node.js 中的 `AbortController` 是一个允许你发送一个中止信号以取消某些异步任务的类。这个功能是从浏览器的 Web API 中引入到 Node.js 的，用来取消例如 Fetch API 请求，或者是任何可以使用 `AbortSignal` 的操作。

创建一个 `AbortController` 实例后，你会得到一个 `signal` 属性，这个信号可以传递给支持取消操作的函数或命令。如果你想要取消正在执行的操作，只需调用 `abort()` 方法即可。

下面我会举一些实际的例子：

### 例子 1：取消 HTTP 请求

假设我们正在使用 Node.js 发起一个 HTTP 请求，但我们希望在某个条件满足时（比如用户取消操作，或者超时）取消这个请求。

```javascript
const { AbortController } = require("node:abort-controller");
const fetch = require("node-fetch"); // 假设我们使用 node-fetch 模块来发起请求

const controller = new AbortController();
const signal = controller.signal;

fetch("https://example.com", { signal })
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("Fetch aborted!");
    } else {
      console.error("Fetch error:", err);
    }
  });

// 在5秒后如果请求还没完成就取消它
setTimeout(() => controller.abort(), 5000);
```

在上面的代码中，我们创建了一个 `AbortController` 对象，并通过其 `signal` 属性传递给 `fetch` 函数。如果 5 秒钟内请求没有完成，我们通过 `setTimeout` 调用 `controller.abort()` 来取消请求。如果请求被取消，`fetch` 将会抛出一个名为 `AbortError` 的错误。

### 例子 2：取消事件监听器

`AbortController` 也可以用来取消事件监听器。当你不再需要监听某个事件时，可以发送一个中止信号来移除事件监听器。

```javascript
const { EventEmitter } = require("node:events");
const { AbortController } = require("node:abort-controller");

const emitter = new EventEmitter();
const controller = new AbortController();
const signal = controller.signal;

function eventHandler() {
  console.log("Event fired!");
}

emitter.on("myEvent", eventHandler, { signal }); // 添加事件监听并关联中止信号

// 触发事件
emitter.emit("myEvent");

// 当我们不再想监听事件时可以取消监听
controller.abort();

// 因为已经取消监听，所以以下代码不会导致 eventHandler 被调用
emitter.emit("myEvent");
```

在这个例子中，我们为 `myEvent` 事件添加了一个监听器，同时将 `signal` 关联到该监听器上。当我们调用 `controller.abort()` 后，和该信号关联的事件监听器会被自动移除，因此再次触发 `myEvent` 事件时，`eventHandler` 不会被调用。

通过这些例子，你可以看到 `AbortController` 和它的 `signal` 的主要用途是提供了一种机制来取消一系列不同类型的异步操作。这对于构建可靠且响应用户行为的应用程序非常有用，特别是在处理那些可能需要长时间才能完成的操作时。

### [abortController.abort([reason])](https://nodejs.org/docs/latest/api/globals.html#abortcontrollerabortreason)

Node.js 中的`abortController.abort([reason])`是一个功能，它允许你在代码运行过程中，主动停止某些正在进行的操作。这个功能特别有用，比如当你不再需要完成一个耗时的异步操作，或者用户取消了一个长时间运行的请求时。下面我将通过几个实际例子来解释它的用法和重要性。

### 基础概念

首先，`AbortController` 是一个全局可用的类，在 Node.js 环境中你可以直接使用它来创建一个中止信号控制器的实例。这个实例通过调用其 `abort` 方法可以发送一个中止信号，用于取消一些支持取消操作的任务，比如 HTTP 请求、文件读写操作等。

`abort([reason])` 方法允许你（可选地）提供一个原因（`reason`），这个原因会被传递给监听该中止信号的任务，以便于理解为什么任务被取消了。

### 实际应用示例

#### 示例 1: 取消 HTTP 请求

假设你正在编写一个 Node.js 应用，需要从外部 API 获取一些数据。但是，如果用户突然决定不需要这些数据了，或者想要查询其他信息，那么继续等待当前请求完成就浪费资源了。这时，你就可以使用 `AbortController` 来取消这个请求。

```javascript
const http = require("http");
const { AbortController } = require("abort-controller");

// 创建 AbortController 实例
const controller = new AbortController();
const { signal } = controller;

// 发起 HTTP 请求
const req = http.get("http://example.com", { signal }, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  res.on("data", (chunk) => {
    console.log(`响应主体: ${chunk}`);
  });
});

// 如果请求被中止，则打印错误信息
req.on("error", (err) => {
  if (err.name === "AbortError") {
    console.log("请求被取消");
  } else {
    console.error("请求失败", err);
  }
});

// 例如，用户变更了请求，2秒后取消请求
setTimeout(() => {
  controller.abort("用户取消请求");
}, 2000);
```

在上面的例子中，我们利用 `AbortController` 创建了一个中止信号，并将这个信号作为请求选项传递给 `http.get` 方法。如果在请求完成前调用了 `controller.abort()` 方法，那么请求会被取消，且相关的错误处理函数会接收到一个 `AbortError`，告知请求已被取消。

#### 示例 2: 取消一个文件读取操作

想象一下，你的应用需要读取一个非常大的文件，而在文件读取期间，用户希望取消这个操作，转而执行其他任务。这种情况下，你也可以使用 `AbortController` 来取消文件读取操作。

```javascript
const fs = require("fs");
const { AbortController } = require("abort-controller");

// 创建 AbortController 实例
const controller = new AbortController();
const { signal } = controller;

// 开始读取文件
const stream = fs.createReadStream("path/to/large/file.txt", { signal });

stream.on("data", (chunk) => {
  console.log("接收到文件内容:", chunk.toString());
});

stream.on("error", (err) => {
  if (err.name === "AbortError") {
    console.log("文件读取被取消");
  } else {
    console.error("读取文件时发生错误", err);
  }
});

// 例如，5秒后用户取消文件读取
setTimeout(() => {
  controller.abort("用户取消操作");
}, 5000);
```

在这个例子中，我们同样创建了一个 `AbortController` 实例和对应的中止信号，将其传递给 `fs.createReadStream` 方法以开始读取文件。如果在文件读取完成之前调用了 `controller.abort()`，则文件读取会被取消，相应的错误处理会被触发。

### 总结

`AbortController` 和它的 `abort([reason])` 方法为 Node.js 提供了一种灵活的方式来取消支持取消操作的任务，让资源管理变得更加高效和精确。通过在适当的时候取消不再需要的操作，你可以提升应用的响应性能和用户体验。

### [abortController.signal](https://nodejs.org/docs/latest/api/globals.html#abortcontrollersignal)

在 Node.js 中，`AbortController`是一个内置的全局类，用于发送取消信号以中止一个或多个 Web API 任务。这个概念源自浏览器环境，但在 Node.js 中也被采用以提供类似的功能。`AbortController.signal`属性就是这个机制中的核心部分之一。

### 什么是 `AbortController.signal`?

`AbortController` 实例有一个名为 `signal` 的属性，这个属性返回一个 `AbortSignal` 对象。`AbortSignal` 对象可以被传递给支持取消操作的 API，作为取消请求或任务的信号。当调用 `AbortController` 实例的 `abort()` 方法时，与之关联的所有 `AbortSignal` 都会变得已中止（即它们的 `aborted` 属性会变为 `true`），同时还会触发 `abort` 事件。这允许你根据需要取消操作，比如终止 HTTP 请求、终止读取文件等。

### 如何使用？

以下是几个实际的使用场景：

#### 场景 1: 取消 HTTP 请求

假设你正在使用 Node.js 的`fetch` API（从 Node.js v17.5 起引入）来进行 HTTP 请求，并且你想要在请求花费太长时间时取消它。

```javascript
const { fetch, AbortController } = require("node-fetch");
const controller = new AbortController();
const signal = controller.signal;

// 设置超时来中止请求
setTimeout(() => controller.abort(), 5000);

fetch("https://example.com", { signal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("请求被取消");
    } else {
      console.error("请求失败", err);
    }
  });
```

#### 场景 2: 取消文件读取

假设你使用`fs.promises.readFile`来异步读取一个大文件，并且你希望如果用户突然不再需要这个文件内容，能立即停止读取。

```javascript
const { readFile } = require("fs/promises");
const { AbortController } = require("abort-controller");

const controller = new AbortController();
const signal = controller.signal;

// 假设某个条件满足后，我们决定不再需要文件内容，则调用abort
setTimeout(() => controller.abort(), 1000); // 例如1秒后取消

readFile("/path/to/bigfile", { signal })
  .then((content) => {
    console.log("文件内容", content);
  })
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("读取操作被取消");
    } else {
      console.error("读取文件出错", err);
    }
  });
```

### 小结

`AbortController` 和它的 `signal` 属性提供了一个强大的机制来中止正在执行的操作。这在处理那些可能需要长时间执行，但又可能由于各种原因需要提前结束的任务时非常有用。通过上述示例，你可以看到它如何简化对这类操作的控制，使代码既清晰又易于管理。

### [Class: AbortSignal](https://nodejs.org/docs/latest/api/globals.html#class-abortsignal)

Node.js 中的 `AbortSignal` 类是用来处理可取消的操作的。当你有一些异步任务，比如读取文件、发起网络请求等，并且你希望有能力在这些操作还没完成时取消它们，`AbortSignal` 就非常有用。

`AbortSignal` 类是基于 DOM 的 `AbortController` 规范实现的，因此如果你熟悉前端开发中的 `fetch` API 和 `AbortController` 的使用，那么在 Node.js 中使用 `AbortSignal` 会感到很熟悉。

### 创建一个 AbortSignal

要使用 `AbortSignal`，首先需要创建一个 `AbortController` 实例，然后从中获取 `signal` 属性。这个 `signal` 属性就是 `AbortSignal` 对象，它可以传递给支持取消操作的异步函数。

```javascript
const { AbortController } = require("node:abort-controller");

// 创建一个 AbortController 实例
const controller = new AbortController();

// 获取 signal
const signal = controller.signal;
```

### 使用 AbortSignal

在 Node.js 中，很多内置模块的 API 支持接收一个 `AbortSignal` 对象为参数。例如，你可以在使用 `fs.promises.readFile`（异步读取文件内容）或者 `http.request`（发起 HTTP 请求）时传入 `AbortSignal` 来取消这些操作。

下面是一个使用 `AbortSignal` 取消 HTTP 请求的例子：

```javascript
const http = require("node:http");
const { AbortController } = require("node:abort-controller");

// 创建 AbortController 实例和对应的 signal
const controller = new AbortController();
const signal = controller.signal;

// 发起 HTTP GET 请求
const req = http.get("http://example.com", { signal }, (res) => {
  console.log(`状态码: ${res.statusCode}`);

  res.on("data", (chunk) => {
    console.log(`响应主体: ${chunk}`);
  });
});

// 如果请求超过一定时间未响应，就取消请求
setTimeout(() => {
  controller.abort();
  console.log("请求已被取消");
}, 5000);

// 监听请求是否因取消而终止
req.on("error", (err) => {
  if (err.name === "AbortError") {
    console.error("请求被中断");
  }
});
```

在上面的代码中，我们创建了一个 HTTP GET 请求到 `example.com`。我们设置了一个 5 秒的计时器，如果在这个时间内服务器没有响应，我们就调用 `controller.abort()` 取消请求。一旦请求被取消，`AbortError` 会被抛出，我们在监听 `req` 对象的 `'error'` 事件中捕获这个错误并打印 '请求被中断'。

### 为什么要使用 AbortSignal

使用 `AbortSignal` 提供了更好的资源管理和用户体验。例如，如果用户离开了一个正在加载数据的页面，你可能不想继续进行数据加载，因为这将浪费服务器和客户端的资源。通过 `AbortSignal`，你可以立即停止这些不再需要的操作。

总结一下，`AbortSignal` 是 Node.js 中处理可取消操作的强大工具，它允许开发者编写更加健壮和资源高效的代码。

#### [Static method: AbortSignal.abort([reason])](https://nodejs.org/docs/latest/api/globals.html#static-method-abortsignalabortreason)

在解释 `AbortSignal.abort([reason])` 这个方法之前，我们需要了解一下什么是 `AbortSignal`。`AbortSignal` 是 Node.js 提供的一个工具，它用来与可中断的操作进行通信。例如，如果你有一个可以花费很长时间的异步任务，如网络请求、文件读取等，你可能会希望在某些条件下取消这个任务。`AbortSignal` 就是用来提供这种取消机制的。

现在让我们来看看 `AbortSignal.abort([reason])` 方法：

### AbortSignal.abort([reason])

这个静态方法用于创建一个新的 `AbortSignal` 对象，该对象已经被设置成 "aborted" 状态。你可以选择性地传递一个 `reason` 参数，来说明为什么要终止这个信号。

#### 参数:

- `reason`（可选）: 表示取消原因的值，任何类型都可以，但一般来说是一个错误对象或者字符串。

#### 返回值:

返回一个已经处于 "aborted" 状态的 `AbortSignal` 实例。

#### 使用实例:

假设你正在写一个应用程序，需要从远端 API 获取一些数据。通常情况下，你可能会使用 `fetch` 方法来完成这项任务。但是，如果用户突然关闭页面或者导航到其它页面，你可能不希望这个请求继续消耗资源。在这种情况下，你就可以使用 `AbortSignal` 来取消这个请求。

下面是一个使用 `AbortSignal.abort()` 来取消 HTTP 请求的例子：

```javascript
const fetch = require("node-fetch"); // 假设你在 Node.js 中使用 'node-fetch' 模块

// 创建一个已经标记为 "aborted" 的 AbortSignal
const signal = AbortSignal.abort();

// 尝试使用这个 signal 发起一个 fetch 请求
fetch("https://api.example.com/data", { signal })
  .then((response) => {
    // 如果请求没有被取消，就会执行这里的代码
    console.log("Fetch completed:", response);
  })
  .catch((error) => {
    if (error.name === "AbortError") {
      // 当请求因为 abort 被取消时，捕获错误
      console.log("Fetch was aborted:", error);
    } else {
      // 处理其它类型的错误
      console.error("Fetch error:", error);
    }
  });

// 注意：在这个例子中，请求会立即被取消，
// 因为我们使用了一个已经被设置成 "aborted" 状态的 signal。
```

在现实世界中，你可能会根据某些事件比如用户交互来决定什么时候取消一个操作。例如，在一个 UI 应用程序中，如果用户点击了一个 "取消" 按钮，你可以在那个时间点调用 `AbortSignal.abort()` 来取消相关的操作。

记住，`AbortSignal` 不限于 `fetch` 请求，它也可用于其他支持可中断操作的 API，如流处理、数据库查询等。总的来说，`AbortSignal` 和 `AbortController` 提供一种标准化的方式来管理和取消一些可能需要长时间运行的异步操作。

#### [Static method: AbortSignal.timeout(delay)](https://nodejs.org/docs/latest/api/globals.html#static-method-abortsignaltimeoutdelay)

`AbortSignal.timeout(delay)`是 Node.js 中的一个静态方法，属于`AbortSignal`类。这个方法用来创建一个可以在指定时间之后自动取消（abort）的信号。这种功能很有用，尤其是当你想要在一定时间内限制某个操作的执行时间时。

### 解释：

首先了解一下什么是`AbortSignal`：这是一个提供了一个通用的 API，允许你发送取消信号到某些异步或基于时间的操作上。举个例子，如果你发起了一个网络请求但不想等待太久，你可以使用`AbortSignal`来设置一个超时，如果请求在超时时间内没有完成，就自动取消它。

现在来看`AbortSignal.timeout(delay)`方法：

- `delay`参数代表超时时间，单位是毫秒（ms）。也就是说，你可以设定多久之后需要触发取消操作。
- 方法返回一个`AbortSignal`实例，这个实例会在指定的`delay`时间后被自动标记为"aborted"（已取消）状态。

### 实际运用示例：

#### 示例 1：限制 HTTP 请求超时

假设你在 Node.js 应用中需要向外部服务发起一个 HTTP 请求，但你希望如果该请求在 5 秒内没有响应，则自动取消它。

```javascript
const https = require("https");
const { AbortSignal } = require("node:abort_controller");

// 创建一个在5000毫秒后自动取消的AbortSignal
const signal = AbortSignal.timeout(5000);

const request = https.get("https://example.com", { signal }, (response) => {
  // 这里处理响应...
});

request.on("error", (err) => {
  if (err.name === "AbortError") {
    console.log("请求因超时被取消");
  } else {
    // 处理其他类型的错误
  }
});
```

在这个例子中，如果 5 秒内服务器没有响应，`AbortSignal`对象会变成取消状态，从而触发 HTTP 请求的'error'事件，并传递一个名为'AbortError'的错误对象。

#### 示例 2：限制某个异步操作的执行时间

想象你有一个异步函数`doSomethingAsync`，这个函数通常需要一些时间来完成。如果你想限制它的执行时间，防止它运行得太久，可以这样做：

```javascript
const { AbortSignal } = require("node:abort_controller");

async function doSomethingAsync(signal) {
  try {
    // 模拟一些异步操作
    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        resolve("完成了!");
      }, 3000); // 假设这个操作需要3秒钟

      // 监听abort信号，如果收到则清除定时器并抛出错误
      signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject(new Error("操作被取消"));
      });
    });
  } catch (err) {
    console.error(err.message);
  }
}

// 创建一个在2秒后会自动取消的AbortSignal
const signal = AbortSignal.timeout(2000);

// 执行异步操作，并传入AbortSignal
doSomethingAsync(signal);
```

在这个例子中，如果函数`doSomethingAsync`在 2 秒内没有完成，那么`signal`会变为取消状态，导致监听器被调用，进而清除定时器并抛出一个错误。这样我们就成功地限制了该操作的最长执行时间。

#### [Static method: AbortSignal.any(signals)](https://nodejs.org/docs/latest/api/globals.html#static-method-abortsignalanysignals)

### 解释

在 Node.js 中，`AbortSignal.any(signals)`是一种静态方法，用于创建一个新的`AbortSignal`对象，这个对象会在传入的任何一个`AbortSignal`对象触发中止时也触发中止。简单来说，它允许你将多个取消信号（`AbortSignal`）组合成一个，只要组合里的任何一个信号被触发了“中止”，这个新创建的信号就会跟着被触发。

`AbortSignal`通常用于可中止的操作，比如网络请求、文件读写等，以提供一种取消正在进行中的操作的手段。

### 举例说明

假设你正在构建一个网站后端服务，你需要同时从两个不同的 API 获取数据，但你希望如果其中一个 API 响应时间过长，就取消对两个 API 的调用，以节约资源和时间。

```javascript
const { AbortController, AbortSignal } = require("node:abort_controller");
const fetch = require("node-fetch"); // 假设你使用node-fetch来发送HTTP请求

// 创建两个AbortController实例
const controller1 = new AbortController();
const controller2 = new AbortController();

// 使用AbortSignal.any静态方法合并两个信号
const combinedSignal = AbortSignal.any([
  controller1.signal,
  controller2.signal,
]);

// 设定超时函数，如果5秒内未完成，则触发中止
setTimeout(() => {
  controller1.abort(); // 这里仅触发一个中止，但由于使用了AbortSignal.any，两个请求都会被取消
}, 5000);

// 模拟向第一个API发请求
fetch("https://api.example.com/data1", { signal: combinedSignal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("请求1被取消");
    }
  });

// 模拟向第二个API发请求
fetch("https://api.example2.com/data2", { signal: combinedSignal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("请求2被取消");
    }
  });
```

在上面的示例中：

- 我们分别为两个 API 请求创建了各自的`AbortController`。
- 使用`AbortSignal.any`把两个取消信号合并成一个。
- 如果任意一个请求执行了中止操作（本例中是通过`setTimeout`模拟的 5 秒超时），那么所有使用该合并信号的请求都会被取消。
- 这样做可以很方便地管理多个可能需要同时取消的异步操作，保证它们能够同步地被中断，避免资源浪费。

通过这种方式，你可以有效地控制多个异步任务，增加代码的灵活性和效率。

#### [Event: 'abort'](https://nodejs.org/docs/latest/api/globals.html#event-abort)

当你开始学习 Node.js，了解它如何处理各种事件是非常重要的。在 Node.js 中，许多对象都会触发事件；比如说，当一个 HTTP 请求被取消时，或是当一个 stream（数据流）被关闭时。今天我们要谈论的是`'abort'`事件，这个事件通常与中断操作有关。

### `'abort'`事件是什么？

简单来说，当某个操作或任务（例如网络请求、文件读取等）被中断时，会触发`'abort'`事件。这个事件最常见的用途之一是与 AbortController 接口结合使用，该接口允许你通过发送中断信号来取消一个或多个 Web 请求。

### 实际运用例子

#### 1. 取消 HTTP 请求

在进行 Web 开发时，可能需要根据用户交互取消正在进行的 HTTP 请求。比方说，用户填写表单并提交，但突然决定取消操作并且点击了"取消"按钮。此时，如果 HTTP 请求还在进行中，使用`'abort'`事件可以帮助我们停止这个请求，从而节省资源，提高应用性能。

```javascript
const http = require("http");
const { AbortController } = require("abort-controller");

// 创建一个AbortController实例
const controller = new AbortController();
const { signal } = controller;

// 发起一个HTTP请求
const req = http.get("http://example.com", { signal }, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  // 处理响应...
});

// 如果signal收到了abort事件，取消请求
signal.addEventListener("abort", () => {
  console.log("请求已被取消");
  req.destroy();
});

// 模拟用户取消操作, 5秒后取消请求
setTimeout(() => {
  controller.abort();
}, 5000);
```

在上面的例子中，我们创建了一个`AbortController`实例和它的`signal`。当调用`controller.abort()`方法时，所有监听该`signal`对象的`'abort'`事件处理函数都会被执行。在这个例子中，我们通过`req.destroy()`方法取消了 HTTP 请求，并打印出了`请求已被取消`。

#### 2. node-fetch 中使用`'abort'`

在使用`node-fetch`库发起 HTTP 请求时，也可以利用`'abort'`事件来取消请求。`node-fetch`是一个轻量级的模块，使得在 Node.js 环境中使用 Fetch API 成为可能。

```javascript
const fetch = require("node-fetch");
const { AbortController } = require("abort-controller");

// 创建一个AbortController实例
const controller = new AbortController();
const { signal } = controller;

// 发起一个fetch请求
const fetchData = async () => {
  try {
    const response = await fetch("http://example.com", { signal });
    console.log(await response.text());
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("请求被取消");
    } else {
      console.log("请求失败", error);
    }
  }
};

fetchData();

// 模仿用户操作，5秒后取消请求
setTimeout(() => {
  controller.abort();
}, 5000);
```

在这个例子中，当`controller.abort()`被调用时，如果 fetch 请求还在进行中，它会立即被取消，并且抛出一个名为`AbortError`的错误。我们通过捕获这个错误，可以确定请求确实因为被取消而终止。

### 总结

`'abort'`事件在 Node.js 中是处理可以被中断的操作的一个有用工具。通过上述示例，你可以看到它如何帮助我们有效管理资源，并对用户的实时操作做出快速响应。不仅限于 HTTP 请求，任何支持 Signal 和`'abort'`事件的 API 都可以利用这种机制来提高应用的响应性和性能。

#### [abortSignal.aborted](https://nodejs.org/docs/latest/api/globals.html#abortsignalaborted)

好的，让我们以简单、易懂的方式来讨论 Node.js 中的 `abortSignal.aborted` 属性。

### 什么是 AbortSignal?

首先，让我们了解一下什么是 `AbortSignal`。在 Node.js (同样适用于现代浏览器的 JavaScript)中，`AbortSignal` 对象是用来与一个或多个 DOM 请求（例如网络请求）通信的机制，允许你随时取消这些请求。简而言之，如果你启动了一个任务，比如文件下载、API 调用等，而在某一时刻你想要取消这个任务，`AbortSignal` 和 `AbortController` 就派上了用场。

### abortSignal.aborted 属性

`abortSignal.aborted` 是 `AbortSignal` 对象的一个属性。它是一个布尔值（Boolean），表示与该 `AbortSignal` 相关联的操作是否已经被取消。如果操作已被取消，`aborted` 属性就会是 `true`；否则为 `false`。

### 如何使用

1. **创建 `AbortController`**

   首先，你需要创建一个 `AbortController` 的实例。`AbortController` 提供了一个 `signal` 属性，可以传给支持取消的异步操作，以及一个 `abort` 方法，用于取消操作。

   ```javascript
   const controller = new AbortController();
   const signal = controller.signal;
   ```

2. **进行取消操作**

   在执行需要可取消操作的函数时，你将 `signal` 作为参数传入。然后，在需要取消操作的时候，调用 `controller.abort()`。

   ```javascript
   // 模拟一个需要取消的异步操作
   async function fetchData(signal) {
     if (signal.aborted) {
       console.log("Operation was already aborted");
       return;
     }

     signal.addEventListener("abort", () => {
       console.log("Operation aborted!");
     });

     // 模拟网络请求等待
     await new Promise((resolve) => setTimeout(resolve, 2000));
     console.log("Operation completed");
   }

   fetchData(signal);
   setTimeout(() => controller.abort(), 1000); // 1秒后取消操作
   ```

### 实际运用示例

#### 取消网络请求

如果你正在使用如 Fetch API 发起网络请求，你可能希望在用户离开页面或切换组件时取消这个请求。通过传递 `signal` 给 fetch 方法，然后在需要的时候调用 `abort` 方法，可以轻松实现这一点。

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch("https://example.com/api/data", { signal })
  .then((response) => response.json())
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("Fetch aborted");
    } else {
      console.error("Fetch error:", err);
    }
  });

// 假设在数据还没回来前用户跳转了页面
controller.abort();
```

### 总结

- `AbortSignal` 和 `AbortController` 提供了一种机制，允许你取消一些异步操作，如网络请求。
- `abortSignal.aborted` 属性是一个布尔值，表示相关操作是否已被取消。
- 使用 `AbortController` 创建 `signal`，并将其传递到异步操作中。当需要取消操作时，只需要调用 `controller.abort()`。

#### [abortSignal.onabort](https://nodejs.org/docs/latest/api/globals.html#abortsignalonabort)

Node.js 中的 `abortSignal.onabort` 是一个事件处理器，它关联于 `AbortSignal` 对象。这个对象是用来与 `AbortController` 一起工作的，允许你取消某些异步任务，比如网络请求、文件读写操作或任何返回 `Promise` 的操作。

首先，让我们简单理解下 `AbortController` 和 `AbortSignal`：

- **`AbortController`**：这是一个控制器，用于发出取消信号。当你想取消一项操作时，你会通过这个控制器发出一个信号。
- **`AbortSignal`**：这是从 `AbortController` 获得的信号对象，它可以被传递到任何支持取消操作的异步任务中。这个信号包含了取消的状态和一个 `onabort` 事件处理器，当信号变为“已取消”时，`onabort` 事件将被触发。

现在，让我们举几个实践中的例子来看看 `abortSignal.onabort` 是怎样工作的。

### 示例 1: 取消 HTTP 请求

假设你正在使用 Node.js 的 `fetch()` API 发送 HTTP 请求，但因为某些原因（比如用户点击了取消按钮），你需要取消这个请求。

```javascript
const { fetch, AbortController } = require("node-fetch"); // 确保你安装了node-fetch库

const controller = new AbortController();
const signal = controller.signal;

signal.onabort = () => console.log("请求被取消!");

// 启动一个请求
fetch("https://example.com", { signal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("请求因为调用 abort() 而取消");
    } else {
      console.log("请求失败: ", err);
    }
  });

// 假设在5秒后，我们决定取消请求
setTimeout(() => {
  controller.abort();
}, 5000);
```

### 示例 2: 取消文件读取操作

如果你正在读取一个大文件，但用户希望停止这个操作，你也可以使用 `AbortController` 来取消它。

```javascript
const { readFile } = require("fs/promises");
const { AbortController } = require("abort-controller"); // 确保你安装了abort-controller库

const controller = new AbortController();
const signal = controller.signal;

signal.onabort = () => console.log("文件读取被取消!");

readFile("/path/to/largefile.txt", { signal })
  .then((content) => console.log("文件内容: ", content))
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("文件读取因为调用 abort() 而取消");
    } else {
      console.log("读取文件失败: ", err);
    }
  });

// 假设在2秒后，我们决定取消文件读取
setTimeout(() => {
  controller.abort();
}, 2000);
```

通过上面的例子可以看到，`abortSignal.onabort` 允许你设置当操作被取消时执行的代码，这对于清理资源、更新 UI 提示信息等非常有用。使用 `AbortController` 和 `AbortSignal` 提供了一种优雅的方式来处理需要取消的异步任务。

#### [abortSignal.reason](https://nodejs.org/docs/latest/api/globals.html#abortsignalreason)

理解`abortSignal.reason`之前，让我们先聊聊 Node.js 中的`AbortController`和`AbortSignal`，这会帮助我们更好地理解`abortSignal.reason`的作用。

### AbortController 和 AbortSignal

在 Node.js（和现代 JavaScript）中，`AbortController`是一个用于发出取消信号的工具。它可以与各种 APIs 一起使用，以提供取消正在进行的异步任务的能力。当你创建了一个`AbortController`实例，你可以通过它的`signal`属性获得一个`AbortSignal`对象。这个`AbortSignal`可以传递给支持取消操作的任何异步 API，以允许你在需要时取消该操作。

### 使用场景

举个例子，假设你正在向服务器发送一个 HTTP 请求获取数据，但由于某种原因（比如用户导航离开当前页面），你想要取消这个还在进行中的请求。这时，你就可以使用`AbortController`和`AbortSignal`来达成这个目标。

### abortSignal.reason

从 Node.js v16.5.0 开始，AbortSignal 增加了一个新的属性：`reason`。这个属性提供了一个方式来存储取消操作的原因，使得错误处理和调试更加直接和简单。

当你调用`AbortController`的`abort([reason])`方法取消一个操作时，你可以可选地提供一个“原因”，这个原因会被存储在关联`AbortSignal`的`reason`属性中。如果没有提供原因，或者`abort()`在没有参数的情况下被调用，则`reason`将是一个通用的`AbortError`。

### 实际应用示例

假设你有一个函数，它使用`fetch`来向服务器请求数据，并且你想要能够根据不同的情况取消这个请求。

```javascript
const { AbortController } = require("node:abort-controller");

async function fetchData(url) {
  const controller = new AbortController();
  const signal = controller.signal;

  setTimeout(() => {
    // 假设1秒后，我们出于某种原因需要取消这个请求
    controller.abort("请求超时");
  }, 1000);

  try {
    const response = await fetch(url, { signal });
    // 这里处理你的响应数据
  } catch (error) {
    if (error.name === "AbortError") {
      console.log(`请求被取消: ${signal.reason}`);
      // 输出: 请求被取消: 请求超时
    } else {
      // 处理其他可能的错误
    }
  }
}

// 调用函数进行测试
fetchData("https://example.com/data");
```

在上面的代码中，`controller.abort('请求超时');`这行代码会取消请求，并将字符串`'请求超时'`设置为取消操作的原因。这个原因随后可以通过`signal.reason`访问到，这在异常处理和日志记录中非常有用，因为它提供了取消操作背后的具体原因。

总结一下，`abortSignal.reason`给予了开发者一个在取消异步操作时附带原因的能力，这对于错误处理、调试和通知用户取消的原因非常有帮助。

#### [abortSignal.throwIfAborted()](https://nodejs.org/docs/latest/api/globals.html#abortsignalthrowifaborted)

Node.js 中的 `AbortSignal` 对象是用来通信的，它允许你发送一个信号以表明某个操作（如网络请求、文件读写等）应该被取消。`AbortSignal` 是 `AbortController` 的一部分，而 `AbortController` 可以创建一个可以传递到需要支持取消操作的函数中的信号。

在 Node.js 里，`AbortSignal.throwIfAborted()` 方法是用来检查是否有取消信号发出的一种快捷方式。如果 `AbortSignal` 已经被触发（即操作已被请求取消），调用这个方法会抛出一个 `AbortError` 错误；如果没有被触发，则什么都不做。

以下是 `AbortSignal.throwIfAborted()` 的几个实际使用例子：

### 例子 1：使用 `fetch` 进行网络请求

当你使用支持 `AbortSignal` 的 `fetch` 函数进行网络请求时，你可能需要取消请求。比如说，用户点击了一个按钮后开始加载数据，但是又迅速点击取消。这时你可以使用 `AbortController` 和 `AbortSignal` 来取消这个请求。

```javascript
const { AbortController } = require("node:abort-controller");
const fetch = require("node-fetch");

const controller = new AbortController();
const signal = controller.signal;

fetch("https://api.example.com/data", { signal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => {
    if (err.name === "AbortError") {
      console.error("Fetch aborted by the user.");
    } else {
      console.error("Fetch error:", err);
    }
  });

// 假设某些条件下我们想要取消请求：
setTimeout(() => {
  controller.abort(); // 发送取消信号
}, 1000); // 比如在1秒后取消
```

### 例子 2：使用 `fs.promises` 读取文件

当你使用 Node.js 的文件系统模块（`fs`）中的 promises API 读取文件时，你也可以取消这个操作，如果该操作长时间未完成，比如：

```javascript
const { readFile } = require("fs/promises");
const { AbortController } = require("abort-controller");

const controller = new AbortController();
const { signal } = controller;
const filePath = "/path/to/file.txt";

readFile(filePath, { signal })
  .then((content) => {
    console.log(content.toString());
  })
  .catch((err) => {
    if (err.name === "AbortError") {
      console.error("Read file operation was aborted.");
    } else {
      console.error("Error reading file:", err);
    }
  });

// 如果5秒内文件还未读完，就取消这次操作
setTimeout(() => {
  controller.abort();
}, 5000);
```

在以上两个例子中，我们都没有直接使用 `throwIfAborted()`。但是，在你自己的代码中，特别是当你编写一个需要响应取消信号的函数时，你可以这样使用它：

```javascript
function doSomething(signal) {
  // 在操作开始前立即检查是否已经被取消
  signal.throwIfAborted();

  // ... 执行一些操作 ...

  // 在操作过程中定期检查
  if (signal.aborted) {
    signal.throwIfAborted(); // 如果已经取消，会抛出错误
  }

  // ... 完成操作 ...
}

const controller = new AbortController();
const { signal } = controller;
try {
  doSomething(signal);
} catch (err) {
  if (err.name === "AbortError") {
    console.error("Operation aborted by the user.");
  } else {
    throw err; // 其他错误继续抛出
  }
}

// 取消操作
controller.abort();
```

在 `doSomething` 函数中，我们通过调用 `signal.throwIfAborted()` 来确保在函数执行的任何阶段如果收到了取消信号，就立即停止执行并抛出 `AbortError`，从而使得调用者能够知道操作已经被取消并处理这种情况。

## [Class: Blob](https://nodejs.org/docs/latest/api/globals.html#class-blob)

理解 Node.js 中的 `Blob` 类非常重要，尤其是在你需要处理二进制数据（如文件上传下载、图像处理等场景）时。我会首先解释什么是 `Blob`，然后通过一些实际例子来帮助你更好地理解。

### 什么是 Blob？

`Blob`（Binary Large Object）表示不可变的原始数据块。它通常用于处理二进制数据，这些数据可以是任意类型的文件，比如图片、音频、视频等。在 Node.js 的环境下，`Blob` 类提供了一种方式来处理这些二进制数据，使得文件的读取和传输变得更加高效和简便。

### Blob 类的关键特性

- **不可变性**：Blob 一旦被创建，其内容就不能被改变。如果想要修改 Blob 中的数据，你需要创建一个新的 Blob 实例。
- **支持多种数据类型**：你可以从字符串、ArrayBuffer 等多种格式创建 Blob 对象。
- **高效性**：Blob 设计用来高效处理大型二进制数据。

### 实际运用例子

#### 1. 文件上传

在网页应用中，用户可能需要上传图片或文档。使用 Blob，你可以方便地读取这些文件的内容，并以二进制形式发送到服务器。

Node.js 示例代码（假设有一个表单提交了文件）：

```javascript
const fs = require("fs");

// 假设 req 是请求对象，fileInputField 是 input 表单的 name 属性值
const fileData = req.files.fileInputField.data;

// 创建 Blob 对象
const blob = new Blob([fileData], { type: "application/octet-stream" });

// 可以将 blob 保存到文件系统或发送到服务器...
```

#### 2. 图像处理

假设你正在开发一个应用，需要对用户上传的图片进行处理（例如压缩、转换格式等）。使用 Blob，你可以轻松处理这些图像数据。

Node.js 示例代码（压缩图像数据）：

```javascript
// 注意：实际图像处理需要使用专门的库，如 Sharp
const sharp = require("sharp");
const fs = require("fs");

async function compressImage(blob) {
  // 假设 blob 包含图像数据
  const buffer = await blob.arrayBuffer(); // 将 Blob 转换为 ArrayBuffer 以供处理

  sharp(buffer)
    .resize(200, 200) // 假设我们要将图像的尺寸调整为 200x200
    .toFile("output.jpg", (err, info) => {
      // 图像已经被处理并保存为 output.jpg
    });
}
```

#### 3. 数据传输

当你需要在不同的系统间传输大量数据时（例如，从浏览器传输到服务器或者服务间传输），Blob 可以作为一种高效的数据容器。

```javascript
// 假设你需要将一份报告作为 Blob 发送到另一个服务
const reportData = generateReport(); // 假设这个函数生成报告的原始数据
const reportBlob = new Blob([reportData], { type: "text/plain" });

sendBlobToService(reportBlob); // sendBlobToService 是假设的函数，负责发送 Blob 到服务
```

### 总结

`Blob` 类在 Node.js 中是处理二进制数据的强大工具，特别是当涉及到文件和数据传输时。通过上述例子，你可以看到 `Blob` 如何在不同情境下被应用，从而加深你对它的理解。记住，在处理复杂数据或大文件时，利用 `Blob` 的特性可以显著提高应用性能和用户体验。

## [Class: Buffer](https://nodejs.org/docs/latest/api/globals.html#class-buffer)

Node.js 的`Buffer`类是一个非常有用的工具，用于处理二进制数据。想象一下，当你在网上浏览时，你所看到的图片、视频和下载的文件实际上都是以二进制形式在互联网上传输的。在 Node.js 中，`Buffer`类就是专门用来处理这种类型的数据的。

### 理解 Buffer

简单来说，`Buffer`可以被理解为临时存储二进制数据的容器。它是一个更接近于底层的数据结构，允许你操作或访问原始的内存空间。每个`Buffer`对象都是一块预先分配好的内存，你可以很方便地读写这块内存。

### 创建 Buffer

在 Node.js v21.7.1 中，创建`Buffer`对象通常不使用`new Buffer()`（这是旧方法，现在已弃用），而是使用以下几种方式：

1. `Buffer.from()`：从一个字符串、数组或另一个 Buffer 实例创建一个新的 Buffer。
2. `Buffer.alloc(size)`：创建一个指定大小的新 Buffer，其内容将被初始化为 0。
3. `Buffer.allocUnsafe(size)`：同样创建一个指定大小的新 Buffer，但其内容未被初始化，可能包含敏感数据。

### 实践应用例子

#### 例子 1：字符串与 Buffer 的转换

假设你需要处理网络请求，接收到的数据可能是加密的文本。你可能会先将接收到的数据存入`Buffer`，然后对其进行解码。

```javascript
// 将字符串转换成Buffer
const bufFromString = Buffer.from("Hello World", "utf8");

// 将Buffer转换回字符串
const strFromBuf = bufFromString.toString("utf8");
console.log(strFromBuf); // 输出: Hello World
```

#### 例子 2：读取文件并处理二进制数据

如果你正在编写一个 Node.js 应用程序，需要读取用户上传的图片，进行一些处理，然后保存。

```javascript
const fs = require("fs");

// 异步读取图片文件
fs.readFile("path/to/your/image.png", (err, data) => {
  if (err) throw err;

  // 此时data就是一个Buffer对象，包含了图片的二进制数据
  console.log(data);

  // 进行某些处理，例如图片压缩、格式转换等

  // 处理完成后，可以将结果写入到新文件
  fs.writeFile("path/to/your/new_image.png", data, (err) => {
    if (err) throw err;
    console.log("Image processed and saved.");
  });
});
```

在这个例子中，`fs.readFile`方法用来异步读取文件内容，返回的`data`对象就是一个 Buffer，其包含了文件的二进制数据。处理完毕后，你可以使用`fs.writeFile`方法将 Buffer 的内容写入到新的文件中。

### 总结

`Buffer`类在 Node.js 中扮演着重要角色，尤其是在处理像 TCP 流、文件 I/O 等涉及二进制数据的场景。通过简单的 API，开发者可以轻松地在 JavaScript 中操作这些低级的二进制数据，使得 Node.js 成为处理网络和文件系统相关任务的强大工具。

## [Class: ByteLengthQueuingStrategy](https://nodejs.org/docs/latest/api/globals.html#class-bytelengthqueuingstrategy)

在解释`ByteLengthQueuingStrategy`之前，我们需要了解几个基础概念：Streams（流）、Backpressure（背压）以及 Queuing Strategies（队列策略）。

### 基础概念

- **Streams:** 在编程中，流是一种处理读写数据的方式，可以看作是随着时间推移连续传递的数据序列。Node.js 中使用流可以高效地处理大量数据，比如文件读写、网络通信等。

- **Backpressure:** 当数据通过流传输时，可能生产者（产生数据的一方）的速度超过消费者（接收数据的一方）能够处理的速度，这时就会造成所谓的“背压”。系统需要有机制来应对这种情况，确保数据不会丢失，并且不会使内存消耗过多导致程序崩溃。

- **Queuing Strategies:** 队列策略是一种机制，用来控制当背压出现时，数据应该如何被缓存。它定义了流中数据缓冲的行为。

### ByteLengthQueuingStrategy 类

`ByteLengthQueuingStrategy` 是 Node.js 提供的一个类，它实现了一个特定的队列策略。这个策略根据数据块（chunk）的字节长度来管理流中的背压。给定一个指定的 "highWaterMark" （高水位标），这个策略将允许流中的数据量累积到接近这个值，但不超过它。当队列中的总字节数达到高水位标时，流会停止从源头读取数据，直到队列中的数据被消耗到足够低。

#### 使用例子

假设你正在编写一个 Node.js 应用，该应用需要从一个大文件中读取数据，并将其发送到客户端。以下是一个简化版的代码例子：

```javascript
const fs = require("fs");
const { ReadableStream } = require("stream/web");
const { ByteLengthQueuingStrategy } = require("stream/web");

// 创建一个可读流来从文件读取数据
const readableStream = fs.createReadStream("path/to/large/file");

// 创建一个新的 ReadableStream 的实例和 ByteLengthQueuingStrategy
const queuingStrategy = new ByteLengthQueuingStrategy({
  highWaterMark: 1024 * 1024,
});
const webReadableStream = new ReadableStream(
  {
    start(controller) {
      // 当流开始时，你可以设置一些初始化逻辑
    },
    pull(controller) {
      // 这里是当消费者要求更多数据时的逻辑
      const chunk = readableStream.read(); // 读取一块数据
      if (chunk) {
        controller.enqueue(chunk); // 将数据添加到流的队列中
      } else {
        controller.close(); // 如果没有更多数据，关闭流
      }
    },
    cancel() {
      // 这里是如果消费者取消了流时的清理逻辑
    },
  },
  queuingStrategy
);

// 现在 webReadableStream 表示流，可以用于 web API 或其他支持标准流的场景
```

在这个例子中，`ByteLengthQueuingStrategy` 被用来创建一个队列策略，其中 `highWaterMark` 设置为 1MB（1024 \* 1024 字节）。这意味着流将尽力维持队列大小在 1MB 左右，如果队列大小超过这个值，将暂停从文件中读取更多数据，等待数据被消费后再继续。

通过这样的机制，即便是处理非常大的文件，你的应用也可以避免一次性加载过多数据到内存中，从而避免内存溢出问题，并且提供一个平滑的数据处理流程。

## [\_\_dirname](https://nodejs.org/docs/latest/api/globals.html#__dirname)

Node.js 是一个让 JavaScript 运行在服务器端的平台，而非仅仅在浏览器中运行。这让 JavaScript 能够用于开发服务器端的软件，包括网站后端、API 等。

在 Node.js 中，`__dirname` 是一个非常重要且实用的全局变量。它给出了当前执行文件所在目录的绝对路径。这意味着，无论你的项目部署在哪里，`__dirname` 都能准确地指向你的代码文件所处的文件夹位置。

### 为什么 `__dirname` 很重要？

- **路径的可靠性**：当你的代码需要引用其他文件或模块时（比如读取配置文件、加载静态资源等），使用相对路径可能会遇到问题，尤其是当你的项目结构变化或在不同的环境下运行时。`__dirname` 确保你总是从当前文件所在的绝对路径开始引用，提高了代码的稳定性。
- **跨平台兼容**：Windows 和 Unix 系统（如 Linux 和 macOS）在文件路径的表示上有所不同（例如，分隔符分别是 `\` 和 `/`）。使用 `__dirname` 可以帮助你的代码跨平台兼容，因为 Node.js 会处理这些差异。

### 实际例子

假设我们有一个项目，项目结构大概是这样的：

```
myProject/
│
├── data/
│   └── myData.json
│
├── scripts/
│   └── readData.js
│
└── index.js
```

#### 示例 1：读取数据文件

在 `scripts/readData.js` 中，你想读取 `data/myData.json` 文件。如果直接使用相对路径可能会出错，因为相对路径是相对于执行 Node 命令的当前目录，而不是脚本文件所在的目录。这里 `__dirname` 就派上用场了：

```javascript
const fs = require("fs");
const path = require("path");

// 构建 data 文件的绝对路径
const dataPath = path.join(__dirname, "..", "data", "myData.json");

// 读取文件
fs.readFile(dataPath, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

这段代码中，`__dirname` 是 `scripts` 目录的路径。通过 `path.join(__dirname, '..', 'data', 'myData.json')`，我们可以构建出 `myData.json` 的正确绝对路径，无论这段代码在哪里执行。

#### 示例 2：配置文件引入

假设在你的项目根目录 (`myProject/`) 下有一个配置文件 `config.json`。在项目的任何地方引用这个配置文件时，使用 `__dirname` 来确保路径的正确性：

```javascript
const configPath = path.join(__dirname, "config.json");
const config = require(configPath);

console.log(config.someSetting); // 输出某项配置
```

在这个例子中，无论你的代码放在项目的哪个位置或深度，使用 `path.join(__dirname, 'config.json')` 都可以安全地引用到根目录下的 `config.json` 文件。

### 结论

`__dirname` 在 Node.js 中提供了一种稳定且跨平台的方式来处理文件路径。通过实例化这个全局变量，你可以更安全、更灵活地管理文件和目录路径，让你的应用更加健壯和可维护。

## [\_\_filename](https://nodejs.org/docs/latest/api/globals.html#__filename)

在 Node.js 中，`__filename`是一个非常重要的全局变量，它表示当前正在执行的脚本的文件路径。这个路径是绝对路径，也就是说，它给出了从你电脑的根目录一直到该文件位置的完整路径。

让我通过一些简单的例子来解释`__filename`的用途和如何在实际编程中运用它。

### 例子 1：打印当前文件路径

假设你有一个名为`example.js`的 Node.js 脚本，位于`/Users/yourname/projects/myapp`目录下。如果你在这个脚本中写上以下代码：

```javascript
console.log(__filename);
```

当你运行这个脚本时（使用`node example.js`命令），输出将会是：

```
/Users/yourname/projects/myapp/example.js
```

这告诉你当前正在执行的脚本的完整路径。

### 例子 2：基于文件路径进行操作

`__filename`可以用来获取当前文件的目录，从而构建相关文件的路径。例如，你想要读取与脚本位于同一目录下的另一个文件。你可以使用`path`模块来帮助处理路径相关操作。

假设在相同的目录下还有一个`data.txt`文本文件，你的`example.js`脚本想要读取它，可以这样做：

```javascript
const fs = require("fs");
const path = require("path");

// 获取当前脚本所在目录
const directoryName = path.dirname(__filename);

// 构建data.txt文件的路径
const filePath = path.join(directoryName, "data.txt");

// 读取文件内容
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

这段代码首先导入了`fs`模块（用于文件系统操作）和`path`模块（用于路径操作）。然后，利用`path.dirname`函数获取当前脚本所在的目录，并使用`path.join`拼接出`data.txt`的完整路径。最后，使用`fs.readFile`读取并打印出文件内容。

### 例子 3：动态引入模块

在 Node.js 中，你可能需要根据不同的条件动态地引入模块。`__filename`可以帮助你计算出模块文件的确切路径。

```javascript
const myModulePath = path.join(path.dirname(__filename), "myModule.js");
const myModule = require(myModulePath);

myModule.doSomething();
```

在这个例子中，我们动态地构建了一个模块文件`myModule.js`的路径，并且使用`require`函数来加载这个模块。然后我们调用了这个模块中的`doSomething`方法。

总结一下，`__filename`在 Node.js 中用来获取当前执行文件的完整路径，这对于文件操作、模块管理以及调试等场景都非常有用。通过以上例子，你应该能够理解`__filename`的基本用法，并且能够在你自己的项目中灵活运用它。

## [atob(data)](https://nodejs.org/docs/latest/api/globals.html#atobdata)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，使得开发者可以使用 JavaScript 来编写服务器端的代码。而 `atob(data)` 是一个在 Node.js 环境中用来解码由 base64 编码的字符串的函数。

首先，让我们理解一下 base64 编码是什么。Base64 是一种用 64 个字符表示所有二进制数据的编码方法。这个编码被设计用来处理那些不容易用文本方式传输的数据。比如，你想在网络上发送一个图片或者其他二进制文件，这时候就可以用 base64 编码来实现。它主要将数据分成 6 位一组（因为 2^6 = 64），然后对应到一个可打印的字符集合中：A-Z, a-z, 0-9, + 和 /。

### 如何使用 `atob(data)`

`atob(data)` 函数接收一个用 base64 编码的字符串作为参数，并返回一个解码后的字符串。这个函数在处理数据传输过程中非常有用。比如，当你从一个 API 获取了一些以 base64 编码的数据，或者需要处理以 base64 编码的用户输入时。

实际运用例子包括：

1. **处理图片文件**：假设你正在编写一个网站，用户可以上传图片作为他们的头像。用户上传的图片可能会被转换成 base64 编码的字符串，以便通过网络传输。当服务器接收到这个字符串，你可以使用 `atob()` 来解码这个字符串，然后处理原始的图像数据。

   ```javascript
   const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...";
   // 假设这是一个用户上传的图片经过base64编码的字符串

   // 使用atob解码
   const imageBuffer = Buffer.from(atob(base64Image.split(",")[1]), "binary");

   // 接下来可以用这个buffer来保存图片到服务器磁盘，或进行其他处理
   ```

2. **安全传输小型数据**：比如说，你开发了一个网页游戏，需要在客户端与服务器间传递加密的游戏状态信息。这些信息可以先被加密，然后转成 base64 字符串发送给服务器。服务器接收到后，可以用 `atob()` 解码，再进行解密处理。

   ```javascript
   const encodedGameState = "c29tZSBnYW1lIHN0YXRlIGVuY29kZWQ=";
   // 假设这是加密并且转成base64的游戏状态信息

   // 在服务器端解码
   const decodedGameState = atob(encodedGameState);

   // 接下来可以解密decodedGameState来获取游戏状态
   ```

3. **在 Web 开发中处理编码**：当你需要在前后端之间安全地传递可能包含特殊字符的文本信息时，如 JSON 字符串。你可以将其编码为 base64 格式，确保在 HTTP 请求/响应过程中不会出现编码错误或数据损坏。

这些例子展示了 `atob(data)` 在处理经过 base64 编码的数据时的实际运用场景。记住，当你处理任何形式的编码和解码时，关注数据的安全性是非常重要的，尤其是涉及用户输入或敏感信息时。

## [BroadcastChannel](https://nodejs.org/docs/latest/api/globals.html#broadcastchannel)

理解 `BroadcastChannel` 概念之前，我们先来聊一下它为什么会存在。在多个浏览器标签页、Web Workers 或者其他支持 JavaScript 的环境中运行的独立脚本之间进行通信，通常是相当复杂的。而 `BroadcastChannel` API 提供了一种简单的通信方式。在 Node.js v21.7.1 版本中引入的这个 API，允许不同的 Node.js 进程（或线程）之间也能够使用类似的机制进行通信。

### BroadcastChannel 基础

`BroadcastChannel` 可以被看作是一个消息广播系统，允许任何加入同一频道的成员接收到广播的消息。当你创建一个 `BroadcastChannel` 实例并指定一个频道名称时，任何在相同进程中或其他进程中监听这个频道的 `BroadcastChannel` 实例都可以收到通过该频道发送的消息。

### 如何工作

1. **创建**: 首先，你需要创建一个 `BroadcastChannel` 的实例，并给它一个频道名称。

   ```javascript
   const { BroadcastChannel } = require("node:globals");
   const channel = new BroadcastChannel("my_channel");
   ```

2. **发送消息**: 使用 `postMessage` 方法发送消息到频道。

   ```javascript
   channel.postMessage("Hello, BroadcastChannel!");
   ```

3. **接收消息**: 在同一个或不同的进程中，监听相同频道将收到消息。

   ```javascript
   channel.onmessage = (event) => {
     console.log(event.data); // 打印 "Hello, BroadcastChannel!"
   };
   ```

4. **关闭频道**: 当不再需要时，应该关闭频道释放资源。

   ```javascript
   channel.close();
   ```

### 实际运用示例

#### 1. 多进程状态同步

假设你正在运行一个 Node.js 应用，该应用有多个子进程，需要同步某些状态信息。比如，在一个游戏服务器上，一个玩家的动作需要通知其他所有子进程更新状态。

```javascript
// 子进程 A 发送消息
const channelA = new BroadcastChannel("game_state");
channelA.postMessage("Player1 Moved");

// 子进程 B 接收消息
const channelB = new BroadcastChannel("game_state");
channelB.onmessage = (event) => {
  console.log(event.data); // "Player1 Moved"
};
```

#### 2. 跨服务事件通知

如果你的 Node.js 应用由多个微服务组成，可能需要在服务之间传递通知或事件。例如，在一个电子商务系统中，订单服务需要通知库存服务减少库存。

```javascript
// 订单服务
const orderChannel = new BroadcastChannel("order_service");
orderChannel.postMessage("Order Placed - Reduce Stock");

// 库存服务
const stockChannel = new BroadcastChannel("order_service");
stockChannel.onmessage = (event) => {
  if (event.data === "Order Placed - Reduce Stock") {
    console.log("Reducing stock...");
  }
};
```

### 注意事项

- `BroadcastChannel` 在 Node.js 中是一个相对新的特性，确保你的 Node.js 环境至少达到 v21.7.1 版本。
- 使用完 `BroadcastChannel` 后，记得调用 `close()` 方法来清理资源。
- `BroadcastChannel` 更适合于较小规模的、实时性要求不极高的通信场景。对于大规模、高可靠性的消息传递需求，可能需要考虑更专业的消息队列或流处理系统。

通过上述介绍和示例，你应该对 Node.js 中的 `BroadcastChannel` 有了基本的了解，它为跨进程或线程间的通信提供了一种便捷的机制。

## [btoa(data)](https://nodejs.org/docs/latest/api/globals.html#btoadata)

`btoa(data)` 是一个全局函数，用于将给定的数据（通常是字符串）编码成一种叫做 Base64 的格式。Base64 编码是一种编码方法，它将任意的二进制数据转换成了一组仅包含 64 个字符的 ASCII 字符串，这些字符包括大写字母 A-Z、小写字母 a-z、数字 0-9、加号（+）和斜杠（/）。Node.js 中的`btoa`函数实际上源自浏览器 JavaScript 中的同名 API。

下面来详细解释一下，并举一些实例说明其使用。

### 为什么需要 Base64 编码？

有时候我们需要在不支持二进制数据传输的场合（比如电子邮件或某些文本协议）发送二进制数据（比如图片或者其他文件类型）。Base64 编码就是为此设计的，它可以将二进制数据转换成纯文本形式，而且在接收端可以完美地还原回原始的二进制数据。

### 如何使用 `btoa` 函数？

在 Node.js 中，如果你想要将一个字符串进行 Base64 编码，可以直接调用`btoa`函数：

```javascript
const encodedData = btoa("Hello, world!"); // 编码字符串'Hello, world!'
console.log(encodedData); // 输出编码后的字符串: 'SGVsbG8sIHdvcmxkIQ=='
```

在上面的例子中，字符串`'Hello, world!'`被转换成了 Base64 编码的字符串`'SGVsbG8sIHdvcmxkIQ=='`。

### 注意事项

在 Node.js 中使用`btoa`时，需要考虑到`btoa`函数被设计为处理 Unicode 字符串。如果你尝试对包含扩展字符集的字符串进行编码，可能会遇到问题，因为`btoa`期望接收的是二进制数据。因此，在实际应用中，如果你需要对非标准 ASCII 字符进行 Base64 编码，通常需要先将字符串转换成 Buffer 或者处理为 UTF-8 编码的字符串。

例如，以下代码展示了如何将中文字符串转换为 Base64 编码：

```javascript
const text = "你好，世界！";
const buffer = Buffer.from(text, "utf-8"); // 首先创建一个Buffer
const base64Encoded = buffer.toString("base64"); // 然后将Buffer转换为Base64字符串

console.log(base64Encoded); // 输出Base64编码后的字符串
```

上面的示例利用了 Node.js 中`Buffer`对象的能力来正确处理 UTF-8 编码的字符串，并将其转换为 Base64 编码。

总结来说，`btoa`函数在 Node.js 中提供了一种方便的方式来进行 Base64 编码，但要注意正确处理字符编码以避免潜在的问题。

## [clearImmediate(immediateObject)](https://nodejs.org/docs/latest/api/globals.html#clearimmediateimmediateobject)

Node.js 中的 `clearImmediate(immediateObject)` 是一个全局函数，用来取消由 `setImmediate()` 函数设置的一个操作。这个机制允许你安排一些代码在当前事件循环周期结束后尽快运行，而 `clearImmediate()` 则提供了一种方式来阻止那些尚未执行的操作。

### 理解 `setImmediate()` 和 `clearImmediate()`

首先，我们得了解 `setImmediate()` 函数。当你调用 `setImmediate()` 时，你实际上是告诉 Node.js： "嘿，我有这块代码，我希望在当前事件循环完成后，尽快执行它，但不是马上。" 这对于想要确保代码异步执行，并且在执行长时间运行的操作之后将控制权返回给事件循环，以便处理其他待处理的事件，非常有用。

例如：

```javascript
const immediateId = setImmediate(() => {
  console.log("这段代码稍后执行");
});

console.log("当前事件循环结束前执行");
```

在上面的代码中，即使 `setImmediate()` 被首先调用，由于它被安排在事件循环的当前阶段之后运行，所以 `'当前事件循环结束前执行'` 将首先输出，随后才是 `'这段代码稍后执行'`。

### 使用 `clearImmediate()`

现在，如果在某个时刻，出于任何原因，你决定你不再需要执行通过 `setImmediate()` 安排的操作，这就是 `clearImmediate()` 发挥作用的地方。通过传递 `setImmediate()` 返回的 ID 给 `clearImmediate()`，你可以取消该操作。

举例说明：

```javascript
const immediateId = setImmediate(() => {
  console.log("这段代码不会被执行");
});

// 取消上面安排的操作
clearImmediate(immediateId);
```

在此例中，尽管我们使用 `setImmediate()` 安排了一段代码稍后执行，但我们通过调用 `clearImmediate()` 并传入从 `setImmediate()` 获取的 ID，取消了该操作。因此，`'这段代码不会被执行'` 实际上永远不会被打印出来。

### 实际应用场景

1. **动态决策**：假设你正在构建一个实时数据处理系统，你可能会基于新收到的数据动态地决定是否继续某些已经安排的任务。通过使用 `clearImmediate()`，你可以根据最新的信息灵活地取消那些不再需要的任务。

2. **避免不必要的操作**：在用户界面（UI）的交互过程中，用户的操作可能触发一些即时反应的代码执行。如果用户迅速更改了他们的决定（比如快速切换标签），使用 `clearImmediate()` 可以避免执行因之前的操作而安排的、现在已不再需要的任务，这有助于节省资源并提高应用程序的响应性能。

理解和使用 `setImmediate()` 与 `clearImmediate()`，可以帮助你更好地控制你的异步代码执行流程，使你的应用程序既高效又可靠。

## [clearInterval(intervalObject)](https://nodejs.org/docs/latest/api/globals.html#clearintervalintervalobject)

`clearInterval(intervalObject)` 是 Node.js 中的一个全局函数，用于停止由 `setInterval()` 设置的定时执行的动作。当你使用 `setInterval()` 函数创建了定期重复执行的任务后，可以通过 `clearInterval()` 来取消这个任务。

让我们来具体看几个例子来理解它是如何工作的。

### 例子 1：简单的计时器

假设你想每隔一秒钟打印一次 "Hello, World!" 到控制台(console)，并且在打印了 5 次之后停止打印。

代码如下：

```javascript
let count = 0;
const intervalId = setInterval(() => {
  console.log("Hello, World!");
  count += 1;

  // 当打印次数达到5次，停止间隔调用
  if (count >= 5) {
    clearInterval(intervalId);
  }
}, 1000);
```

在上述代码中：

- 我们首先定义了一个变量 `count` 来记录当前已经打印了多少次。
- 然后，我们使用 `setInterval()` 创建了一个计时器，设置它每隔 1000 毫秒（即一秒钟）执行一次匿名函数。
- 在匿名函数内部，我们打印出 "Hello, World!" 的消息，并且将 `count` 变量的值增加 1。
- 接着我们检查 `count` 的值是否达到了 5。如果达到了，我们就调用 `clearInterval()` 并传入 `intervalId`（这是 `setInterval()` 返回的一个标识符），以停止后续的定时调用。

### 例子 2：动画或轮询任务

想象一个网页应用，你需要定期去检查服务器上是否有新的数据更新。你可以设置一个 `setInterval()` 定时器定期发送请求，并且在某些条件满足之后，使用 `clearInterval()` 停止轮询。

假设以下是伪代码：

```javascript
let intervalId = setInterval(() => {
  // 模拟发起网络请求检查数据更新
  checkForUpdates();

  // 如果满足某些条件，比如用户导航离开了当前页面，我们可以清除定时器
  if (userLeftPage) {
    clearInterval(intervalId);
  }
}, 5000);
```

在这个例子中：

- 我们每 5 秒钟通过 `checkForUpdates()` 函数模拟发送一次请求去检查更新。
- 我们通过一个条件判断（`userLeftPage`）来判断用户是否离开了页面，如果离开了，我们就通过 `clearInterval(intervalId)` 停止定时器。

通过这两个例子，你应该能看出 `clearInterval()` 是如何配合 `setInterval()` 使用的，以便在特定情况下取消定期执行的任务。这是在编写涉及时间间隔处理的 JavaScript 或 Node.js 代码时一个非常常见和有用的功能。

## [clearTimeout(timeoutObject)](https://nodejs.org/docs/latest/api/globals.html#cleartimeouttimeoutobject)

`clearTimeout(timeoutObject)` 是 JavaScript 中清除定时器的一个函数。在 Node.js 环境中，这个函数也是可用的，并且和浏览器中的 JavaScript 表现基本一致。

当你设置一个定时器，比如使用 `setTimeout()` 函数，它将在指定的延迟之后执行一个函数。如果在这段延迟时间结束之前你决定不想要这个定时器继续执行了，你就可以使用 `clearTimeout()` 函数来取消它。

下面是 `clearTimeout()` 函数的使用例子：

```javascript
// 设置一个定时器，让它在3000毫秒（3秒）后执行一个函数
const timeoutObject = setTimeout(() => {
  console.log("这条消息会在3秒后显示");
}, 3000);

// 假设出于某种原因，我们不再需要上面那个定时器了
// 我们可以使用 clearTimeout() 来取消它
clearTimeout(timeoutObject);

// 因为定时器已经被清除，上面的console.log语句不会被执行
```

在实际应用中，`clearTimeout()` 可能用于以下场景：

1. **用户交互**：假如有一个网站提醒用户他们的会话即将过期，但如果用户进行了某些操作，比如点击了一个按钮，你可能想要取消那个计时器。
2. **优化性能**：如果你的应用定时拉取服务器更新，但用户关闭了相应的视图或组件，你可能想要清除相关的定时器，以防不必要的网络请求和 CPU 占用。
3. **条件逻辑控制**：可能你设置一个定时器去执行一个任务，但根据后续的程序逻辑，你决定那个任务不再需要执行，这时候可以用 `clearTimeout()` 来取消。

记住，`clearTimeout()` 需要传入一个参数，即原先由 `setTimeout()` 返回的定时器对象，这样 JavaScript 才知道要取消哪一个定时器。如果你尝试清除一个不存在的定时器，或者传入了错误的参数，通常不会发生任何事情（不会抛出错误），代码的其他部分还会正常运行。

## [Class: CompressionStream](https://nodejs.org/docs/latest/api/globals.html#class-compressionstream)

当我们谈论 Node.js 中的`CompressionStream`类，我们实际上是在讨论一种用于数据压缩的工具。这个概念听起来可能有点抽象，但我会通过一些简单的例子来解释它。

### 基础理解

首先，让我们来了解一下什么是数据压缩。数据压缩，就像它的名字一样，是减小文件或数据的大小的过程。想象你有一个装满气球的大盒子，如果你把所有气球放气，那么这些气球占用的空间就会变小，你甚至可以把更多的气球放进盒子里。数据压缩也遵循同样的原理，它通过各种算法移除或重新编码信息，从而减少数据占用的空间。

`CompressionStream`是实现这种压缩的一个手段。在 Node.js（一个 JavaScript 运行环境）中，`CompressionStream`是一个特殊的“流”类，设计用来处理流式数据的压缩。流式数据是指那些可以一部分一部分发送的数据，如视频或音频流、或是大型文件传输。

### 实际应用示例

#### 1. 网站性能优化

假设你正在开发一个网站，上面有大量的图片和视频内容。为了提高页面加载速度，你可以在服务器端使用`CompressionStream`对这些资源进行压缩，然后再发送给用户的浏览器。浏览器接收到压缩后的数据，解压缩，并显示给用户。这个过程对用户是透明的，但大大提高了网页的加载速度和用户体验。

#### 2. 减少存储成本

如果你在开发一个需要存储大量文档或记录的应用程序，磁盘空间可能会成为一个问题。在保存这些文档之前，使用`CompressionStream`进行压缩可以显著减少所需的存储空间，从而降低成本。

#### 3. 提高网络传输效率

在构建一个客户端和服务器交互的应用时，若需要传输大量数据，直接发送原始数据可能会使网络通信非常缓慢。通过在发送之前使用`CompressionStream`对数据进行压缩，可以减少需要传输的数据量，从而加快传输速度，提高效率。

### 如何使用

在 Node.js 中使用`CompressionStream`类相对简单。下面是一个基本的示例代码，展示如何压缩数据：

```javascript
// 引入zlib模块，它提供了压缩功能
const zlib = require("zlib");

// 创建一个CompressionStream实例，这里以gzip压缩为例
const compressionStream = zlib.createGzip();

// 创建输入和输出流，以文件操作为例
const fs = require("fs");
const input = fs.createReadStream("input.txt"); // 假设我们有一个需要被压缩的文件input.txt
const output = fs.createWriteStream("input.txt.gz"); // 输出文件将是压缩后的版本

// 使用管道操作将输入流连接到压缩流，然后将结果输出到目标文件
input.pipe(compressionStream).pipe(output);
```

在这个例子中，我们创建了一个 gzip 压缩流，将一个文件流通过它进行压缩，然后输出到另一个文件。这只是`CompressionStream`应用的冰山一角，但基本上，工作原理都是类似的：读取原始数据，通过压缩流处理，然后输出压缩后的数据。

希望这些信息和例子能帮助你理解 Node.js 中`CompressionStream`类的用处和工作方式！

## [console](https://nodejs.org/docs/latest/api/globals.html#console)

Node.js 是一个基于 Chrome V8 JavaScript 引擎的 JavaScript 运行环境，使你可以在服务器端运行 JavaScript 代码。Node.js 的一个特点是非阻塞 I/O，即使相对大量的数据也能高效处理。

在 Node.js 中，`console` 对象提供了一系列的方法来输出信息到标准输出（stdout）或标准错误（stderr）。这些方法类似于浏览器中的 `console` 对象，因此如果你有在浏览器中使用过 `console` 的经验，你会发现它们很熟悉。

以下是一些最常用的 `console` 方法及其用法：

1. `console.log()`: 这是最常见的控制台输出方法，用于打印普通的日志信息。

   ```javascript
   console.log("Hello, World!"); // 输出: Hello, World!
   ```

2. `console.error()`: 用于输出错误消息到 stderr。

   ```javascript
   console.error("Something went wrong!"); // 输出错误消息: Something went wrong!
   ```

3. `console.warn()`: 用于输出警告信息。

   ```javascript
   console.warn("This is a warning!"); // 输出警告信息: This is a warning!
   ```

4. `console.info()`: 用于输出信息性消息，功能与 `console.log()` 类似，但在某些平台上可能会以不同的方式标记或记录。

   ```javascript
   console.info("Informative message."); // 输出: Informative message.
   ```

5. `console.debug()`: 类似于 `console.log()`，但通常只在调试模式下才显示。

   ```javascript
   console.debug("Debugging message."); // 只有在启用调试时才会显示
   ```

6. `console.table()`: 可以将数组或对象的内容以表格形式打印出来，方便查看复杂数据结构。

   ```javascript
   console.table([
     { a: 1, b: "Y" },
     { a: 2, b: "Z" },
   ]);
   // 显示:
   // ┌─────────┬─────┬─────┐
   // │ (index) │  a  │  b  │
   // ├─────────┼─────┼─────┤
   // │    0    │  1  │ 'Y' │
   // │    1    │  2  │ 'Z' │
   // └─────────┴─────┴─────┘
   ```

7. `console.assert()`: 用于断言测试，如果第一个参数为 `false`，则输出后面的消息。

   ```javascript
   console.assert(2 === 2, "This will not be printed");
   console.assert(2 === 3, "Assertion failed: 2 is not equal to 3"); // Assertion failed: 2 is not equal to 3
   ```

8. `console.time()` 和 `console.timeEnd()`: 用于计算代码执行时间间隔。

   ```javascript
   console.time("100-elements");
   for (let i = 0; i `<` 100; i++) {
     // 模拟代码
   }
   console.timeEnd("100-elements"); // 打印出100次循环所花费的时间
   ```

9. `console.trace()`: 打印当前的堆栈轨迹。

   ```javascript
   function foo() {
     function bar() {
       console.trace();
     }
     bar();
   }

   foo();
   // 显示foo和bar函数被调用的轨迹
   ```

以上就是 Node.js 中 `console` 对象的一些基本用法。通过这些方法，你可以帮助自己进行调试、监控程序的行为或者仅仅是输出一些有用的信息。这在开发过程中是非常有帮助的，特别是当你需要快速定位问题或理解程序流程时。

## [Class: CountQueuingStrategy](https://nodejs.org/docs/latest/api/globals.html#class-countqueuingstrategy)

`CountQueuingStrategy` 是 Node.js 中用来处理流（streams）的一种策略，主要用于背压管理。背压（backpressure）是当你处理数据流时遇到的一个问题，就是生产速度比消费速度快，导致数据积压。为了解决这个问题，Node.js 提供了几种队列策略，`CountQueuingStrategy` 就是其中之一。

具体来说，`CountQueuingStrategy` 会根据“计数”来控制队列中的块（chunks），也就是说它会跟踪在内部队列中的对象数量，并根据这个数量来判断是否需要暂停接收更多的数据块，从而控制背压。

下面通过一个例子来说明 `CountQueuingStrategy` 是如何使用的。

假设我们想创建一个可以读取数据并逐个处理的流程。但是我们的处理能力有限，不能处理太多的数据块。因此，我们使用 `CountQueuingStrategy` 来限制内部队列中可以存放的数据块数量。

```javascript
const { ReadableStream, CountQueuingStrategy } = require("stream/web");

// 创建一个简单的数据源数组
const data = ["a", "b", "c", "d"];

// 创建一个可读流，并使用 CountQueuingStrategy 控制背压
const readableStream = new ReadableStream(
  {
    start(controller) {
      for (let chunk of data) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  },
  new CountQueuingStrategy({ highWaterMark: 1 })
);

// 设置监听器来读取数据
const reader = readableStream.getReader();

async function processStream() {
  let done, value;
  while ((({ done, value } = await reader.read()), !done)) {
    console.log(value); // 输出 'a', 'b', 'c', 'd'
    // 处理每个数据块，模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

processStream(); // 开始处理流
```

在上述例子中：

1. 我们创建了一个包含字母 'a' 到 'd' 的数组作为我们的数据源。
2. 接着创建了一个 `ReadableStream` 对象，并传入一个起始函数，该函数将数组中的每个元素（即数据块）加入到流中。
3. 在实例化 `ReadableStream` 时，我们传入了 `CountQueuingStrategy` 对象，并设置 `highWaterMark`（高水位标记）为 1。这意味着当队列中的数据块达到或超过 1 时，流便不再接受新的数据块，直到现有的数据块被处理完毕。
4. 最后，我们定义并调用 `processStream` 函数来异步地读取和打印流中的数据，每个数据块处理完毕之后会等待 100 毫秒，模拟异步操作的时间消耗。

使用 `CountQueuingStrategy` 可以有效管理大量数据的处理，避免消费者处理不过来时造成程序崩溃或内存溢出。在 Node.js 中管理流式数据时，这是一种非常有用的机制，尤其适用于文件处理、网络通信等场景。

## [Crypto](https://nodejs.org/docs/latest/api/globals.html#crypto)

Node.js 中的`crypto`模块是一个提供加密功能的库，包括一系列用于处理加密技术的工具。它可以帮助你进行数据的散列(hash)，创建数字签名，加密数据传输，以及执行其他与加密相关的任务。

以下是几个`crypto`模块实际应用的例子：

### 1. 数据散列(Hashing)

数据散列是将任意长度的输入通过散列算法转换成固定长度的输出串（通常更短、看起来随机）。这个过程是单向的，也就是说从散列值通常无法逆向推导出原始数据。

**应用场景**: 存储用户密码时，不应该明文存储，而应该存储密码的散列值。

```javascript
const crypto = require("crypto");

// 创建一个散列器(hasher)
const hasher = crypto.createHash("sha256");

// 输入数据
hasher.update("your-password");

// 计算散列值
const hash = hasher.digest("hex");

console.log(hash); // 输出散列值
```

### 2. 加密和解密

加密用于将数据转换成不能直接阅读的格式，保证数据的安全性。解密是加密的逆过程，用于将加密后的数据恢复到其原始格式。

**应用场景**: 发送敏感信息，比如信用卡信息或私人对话。

```javascript
const crypto = require("crypto");

// 定义加密的密钥和算法
const algorithm = "aes-192-cbc";
const password = "password-used-to-generate-key";

// 使用密码和算法生成密钥
const key = crypto.scryptSync(password, "salt", 24);
const iv = Buffer.alloc(16, 0); // 初始化向量

const cipher = crypto.createCipheriv(algorithm, key, iv);

let encrypted = cipher.update("some clear text data", "utf8", "hex");
encrypted += cipher.final("hex");

console.log(encrypted); // 加密后的数据

// 解密
const decipher = crypto.createDecipheriv(algorithm, key, iv);

let decrypted = decipher.update(encrypted, "hex", "utf8");
decrypted += decipher.final("utf8");

console.log(decrypted); // 解密后的原文
```

### 3. 数字签名与验证

数字签名是使用发送者的私钥加密信息的散列值，接收方可以使用公钥来验证该信息是否未被篡改。

**应用场景**: 确认文件或信息未被修改，比如软件发布时确保下载的软件未被篡改。

```javascript
const crypto = require("crypto");

// 生成一对密钥
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const data = "important data";

// 使用私钥创建签名
const signer = crypto.createSign("SHA256");
signer.update(data);
const signature = signer.sign(privateKey, "hex");

console.log(signature); // 输出签名

// 使用公钥来验证签名
const verifier = crypto.createVerify("SHA256");
verifier.update(data);
const isVerified = verifier.verify(publicKey, signature, "hex");

console.log(isVerified); // 如果为 true，则签名有效
```

这些例子只是`crypto`模块功能的冰山一角，但它们展示了如何在 Node.js 中用简单的方式来执行基本的加密操作。随着你对编程和安全性理解的加深，你会发现更多复杂且功能强大的用法。记住，在处理加密和安全相关的代码时要格外小心，因为错误的做法可能会导致安全漏洞。

## [crypto](https://nodejs.org/docs/latest/api/globals.html#crypto_1)

Node.js 的 `crypto` 模块是一个用于加密的内建库，它提供了各种加密功能，包括对称加密、非对称加密、哈希算法等。在 Node.js v21.7.1 中，这个模块仍然是核心的一部分，让我们来通过几个例子，深入理解它的实际应用。

### 哈希算法（Hashing）

哈希算法可以将任意长度的数据转换成固定长度的字符串（通常看起来是一串乱码）。这个过程是单向的，也就是说你不能从哈希值逆向得到原始数据。这种特性使得哈希算法在存储密码、验证数据完整性等方面非常有用。

**例子：**

```javascript
const crypto = require("crypto");

// 创建一个 SHA-256 的哈希算法
const hash = crypto.createHash("sha256");

// 输入数据
hash.update("hello world");

// 生成哈希值输出
console.log(hash.digest("hex"));
```

在这个例子中，我们使用了 SHA-256 算法对字符串 "hello world" 进行哈希处理，并以十六进制格式输出结果。

### 对称加密

对称加密使用相同的密钥进行加密和解密。这种方式在需要快速加解密大量数据时很有用。但是，它也带来了密钥管理上的挑战，因为你必须确保密钥在通信双方之间安全共享。

**例子：**

```javascript
const crypto = require("crypto");

const algorithm = "aes-192-cbc";
const password = "密码"; // 使用足够复杂的密码
const key = crypto.scryptSync(password, "盐值", 24); // 密钥派生函数
const iv = Buffer.alloc(16, 0); // 初始化向量

const cipher = crypto.createCipheriv(algorithm, key, iv);

let encrypted = cipher.update("要加密的数据", "utf8", "hex");
encrypted += cipher.final("hex");

console.log(encrypted);
```

这个例子展示了如何使用 AES-192-CBC 算法对数据进行加密。注意，我们需要一个密钥和初始化向量（IV）进行加密。

### 非对称加密

非对称加密使用一对密钥：公钥和私钥。公钥可以分享给任何人，用来加密数据；而私钥保留在数据接收者手里，用来解密。这种方法在数字签名和建立安全通信（比如 HTTPS）时非常重要。

**例子：**

未直接列出，因为非对称加密通常涉及到密钥的生成、存储和使用，步骤较为复杂。但基本思路是使用 `crypto.generateKeyPair()` 或 `crypto.generateKeyPairSync()` 方法生成一对公钥和私钥，然后使用公钥加密数据，私钥解密数据。

### 总结

Node.js 的 `crypto` 模块提供了强大而灵活的加密功能，既可以用于基本的数据加密和哈希计算，也支持高级场景如 SSL/TLS 安全通信。不管你是在开发 Web 应用、构建 API 还是处理敏感数据，合理使用 `crypto` 模块都能大大增强你应用的安全性。

## [CryptoKey](https://nodejs.org/docs/latest/api/globals.html#cryptokey)

理解 Node.js 中的 `CryptoKey` 对于编程新手来说可能稍显复杂，但我会尽量用简单的语言来说明。

首先，要知道 Node.js 是一个运行在服务器端的 JavaScript 环境，它允许开发者使用 JavaScript 来写后端代码。而在很多后端应用中，数据安全性是非常重要的一环，这就需要用到加密技术。Node.js 通过提供一个名为 `crypto` 的模块，使得实现各种加密技术变得可能。“CryptoKey”是这个模块的组成部分之一。

### 什么是 CryptoKey？

简单来说，`CryptoKey` 是代表一个加密密钥的对象。这个对象可以用于各种加密操作，比如加密数据、解密数据、签署数据或验证数据的签名等。在网络通信和数据存储领域，保证数据的安全性是极其重要的，`CryptoKey` 就是用来加强这一安全性的工具之一。

### CryptoKey 的使用场景

举几个实际的例子：

1. **HTTPS 通信**：当你浏览网页时，尤其是输入敏感信息（比如支付信息）的时候，你的浏览器和服务器之间的通信是加密的。这种加密过程就可能用到 `CryptoKey`。服务器会有一对密钥（公钥和私钥）。公钥用来加密数据，私钥用来解密数据。只有这样，即便数据在传输过程中被截获，没有密钥的人也无法解读数据的真实内容。

2. **用户密码存储**：当你在一个网站注册账号时，你的密码需要被安全地存储在服务器上。开发者通常不会直接存储你的密码，而是存储密码的加密版本。这个过程中，`CryptoKey` 可以用来对密码进行加密。

3. **数字签名**：假设你在使用一个文档签名的应用，当你签署一个文件时，这个应用可能会使用 `CryptoKey` 来创建一个独一无二的签名，这个签名基于你的私钥和文件的内容生成。接收方可以使用你的公钥来验证这个签名确实是由你创建的，从而确认文件的真实性和完整性。

### 如何创建和使用 CryptoKey

在 Node.js 中，使用 `crypto` 模块的 `subtle` 属性可以创建和管理 `CryptoKey`。以下是一个非常基本的示例代码，展示了如何创建一个密钥：

```javascript
const crypto = require("crypto").webcrypto;

// 生成加密密钥的参数
const keyParams = {
  name: "AES-GCM", // 加密算法
  length: 256, // 密钥长度
};

// 生成一个加密密钥
crypto.subtle
  .generateKey(
    keyParams,
    true, // 是否可导出
    ["encrypt", "decrypt"] // 密钥用途
  )
  .then((key) => {
    console.log(key);
  })
  .catch((err) => {
    console.error(err);
  });
```

以上代码展示了如何生成一个用于加密和解密的密钥。这只是一个简化的例子，实际应用中可能涉及更复杂的参数和错误处理逻辑。

总结起来，`CryptoKey` 是 Node.js 提供的一种方式，用于处理加密密钥，以保障数据传输和存储的安全性。通过 `crypto` 模块的 API，开发者可以轻松地生成密钥、加密数据、解密数据等，从而为应用添加安全保护层。

## [CustomEvent](https://nodejs.org/docs/latest/api/globals.html#customevent)

Node.js 在其版本 21.7.1 中加入了对 `CustomEvent` 的支持，这是一个非常有用的功能，特别是在事件驱动的应用程序中。在深入解释之前，让我们先了解什么是 `CustomEvent`。

## CustomEvent 简介

`CustomEvent` 是一种特殊的事件，可以让你创建自定义的事件类型，并且能够携带特定的信息。它原本是浏览器中的一个特性，用于在前端 JavaScript 代码中创建和触发自定义事件。Node.js 引入这个特性后，开发者现在也能在后端环境中使用这个强大的功能。

### 创建一个 CustomEvent

在 Node.js 中，你可以使用 `CustomEvent` 构造函数来创建一个自定义事件。构造函数接受两个参数：事件名称和一个包含事件选项的对象。这个对象中可以指定任意的数据作为事件的一部分，通过 `detail` 属性传递。

```javascript
const event = new CustomEvent("my-custom-event", { detail: { key: "value" } });
```

这里创建了一个名为 `my-custom-event` 的事件，并且通过 `detail` 属性传递了一个对象 `{ key: 'value' }` 作为事件的载荷（payload）。

### 触发 CustomEvent

创建自定义事件后，你需要一个事件监听器来“监听”这个事件，然后你可以使用 `dispatchEvent` 方法来触发该事件。不过值得注意的是，Node.js 环境下并没有像浏览器中那样的全局 `dispatchEvent` 方法。在 Node.js 中，通常我们会使用 EventEmitter 类来代替这个功能。

```javascript
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// 监听自定义事件
myEmitter.on("my-custom-event", (event) => {
  console.log(event.detail); // 输出：{ key: 'value' }
});

// 触发事件
myEmitter.emit(
  "my-custom-event",
  new CustomEvent("my-custom-event", { detail: { key: "value" } })
);
```

## 实际运用例子

### 1. 用户注册成功发送欢迎邮件

假设你正在编写一个用户注册的后端服务，当用户注册成功后，你想发送一封欢迎邮件给用户。使用 `CustomEvent` 可以很方便地实现这个功能。

```javascript
const EventEmitter = require("events");
class UserEventEmitter extends EventEmitter {}

const userEvents = new UserEventEmitter();

// 监听用户注册成功事件
userEvents.on("user-registered", (event) => {
  sendWelcomeEmail(event.detail.email);
});

// 用户注册函数
function registerUser(userData) {
  // 假设这里是用户注册逻辑
  console.log("User registered:", userData);

  // 触发用户注册成功事件
  userEvents.emit(
    "user-registered",
    new CustomEvent("user-registered", { detail: { email: userData.email } })
  );
}

// 发送欢迎邮件的假设函数
function sendWelcomeEmail(email) {
  console.log(`Sending welcome email to ${email}`);
}

// 示范如何注册用户
registerUser({ email: "newuser@example.com" });
```

在这个例子中，我们创建了一个 `UserEventEmitter` 来处理用户相关的事件。当调用 `registerUser` 函数注册用户成功后，我们触发了一个 `user-registered` 自定义事件，并通过 `detail` 参数传递了用户的邮箱地址。而事件监听器则负责调用发送欢迎邮件的逻辑。

### 结论

`CustomEvent` 在 Node.js 中的引入为后端开发提供了更多灵活性和可能性，使得事件驱动的编程模式更加强大。通过自定义事件的创建、触发和监听，开发者可以以更解耦的方式编写模块化代码，增强代码的可读性和可维护性。

## [Class: DecompressionStream](https://nodejs.org/docs/latest/api/globals.html#class-decompressionstream)

Node.js 中的`DecompressionStream`类是一个用于解压数据流的工具，这意味着它可以帮助你将压缩过的数据还原回原始形式。这个功能在处理网络传输、文件存储等场景中特别有用，因为数据压缩可以显著减少所需的存储空间和传输时间。

### 什么是压缩与解压？

简单来说，压缩就是通过某种算法减小文件或数据的大小，而解压则是恢复数据到原始状态的过程。比如，你下载的.zip 文件就是压缩后的，需要解压才能得到里面的内容。

### 如何使用 `DecompressionStream`

在 Node.js 中，`DecompressionStream`类通常与流(Stream)一起使用，流是一种处理大量数据的有效方式，允许你以连续的方式读取或写入数据，而不必一次性将所有数据加载到内存中。

假设我们有一个通过 gzip 算法压缩的文件（例如，`example.gz`），我们想要解压这个文件并读取其中的内容，我们可以这样操作：

```javascript
const fs = require("fs");
const { createDecompressionStream } = require("node:stream/web");

// 创建一个读取压缩文件的流
const compressedStream = fs.createReadStream("example.gz");

// 创建一个解压缩流
const decompressionStream = createDecompressionStream("gzip");

// 创建一个写入解压缩数据的流（例如输出到控制台或文件）
const output = process.stdout; // 这里为了演示，我们直接将解压后的内容输出到控制台

// 将压缩的数据流连接到解压缩流，然后输出
compressedStream.pipe(decompressionStream).pipe(output);
```

在这个例子中，我们首先通过`fs.createReadStream`创建了一个读取被压缩文件`example.gz`的流。然后，我们实例化了一个`DecompressionStream`用于解压 gzip 压缩的数据。最后，我们将解压后的数据流导向输出（这里是控制台）。如果你想将解压后的数据保存到文件，只需将`output`改为指向一个文件写入流即可。

### 实际运用的例子

1. **网络传输优化**：当我们需要通过网络发送大量数据时，例如一个网站的静态资源（JS, CSS, 图片等），通常会先进行压缩，然后在客户端进行解压，这样可以显著减少传输所需时间。

2. **日志文件处理**：服务器上的日志文件往往非常庞大，通过压缩存储可以节省空间。当需要分析这些日志时，我们可以使用`DecompressionStream`来实时解压日志文件，进行处理或查看。

3. **游戏资源管理**：在游戏开发中，资源如图像、声音文件等，经常被压缩以减少下载时间和磁盘空间占用。使用`DecompressionStream`可以在游戏运行时解压这些资源，无需预先解压所有内容。

通过上述例子，你可以看出`DecompressionStream`类在 Node.js 应用程序中的重要性及其广泛的应用场景。理解和掌握如何处理压缩和解压缩数据是进行高效数据处理和优化传输的关键。

## [Event](https://nodejs.org/docs/latest/api/globals.html#event)

Node.js 的 `Event` 模块是一个允许你创建、触发和监听自定义事件的极其重要的组成部分。为了帮助你更好地理解，让我们从基础开始，逐步深入，并通过实际的例子来阐述它的用法。

### 什么是 Node.js 中的 Event？

在 Node.js 中，许多内置对象都会发出事件：例如，一个网络请求可能会发出事件，表示数据已接收或连接已关闭。这些事件可以被 Node.js 中的任何其他对象"监听"（也就是等待并响应）。这种模式非常适合处理异步操作，并在整个 Node.js 生态系统中广泛使用。

### Event 模块的基本组件

1. **EventsEmitter**: 这是 Node.js 中所有能触发事件的对象的基础。它提供了触发事件(`emit`)和监听事件(`on`)的方法。

2. **Event listeners**: 这些是绑定到特定事件上的函数。当事件被触发时，这些函数将被执行。

### 如何使用

假设我们要建立一个简单的事件系统，每当新用户注册时发送欢迎邮件。以下是如何使用 Node.js 的 `EventEmitter` 类来实现：

#### 步骤 1: 导入 `events` 模块

```javascript
const EventEmitter = require("events");
```

#### 步骤 2: 创建一个 EventEmitter 实例

```javascript
const myEmitter = new EventEmitter();
```

#### 步骤 3: 监听事件

在发送邮件前，我们需要"监听"注册事件。这意味着我们需要设置一个函数，当事件发生时运行。

```javascript
myEmitter.on("userRegistered", (email) => {
  console.log(`Sending welcome email to ${email}`);
  // 在这里添加发送邮件的代码
});
```

#### 步骤 4: 触发事件

现在我们有了监听器，我们需要在用户注册时触发`userRegistered`事件。

```javascript
myEmitter.emit("userRegistered", "user@example.com");
```

当上面的代码运行时，它会输出："Sending welcome email to user@example.com"。

### 实际应用场景

1. **Web 服务器**：在 Node.js 中，HTTP 服务器在收到请求时发出事件，你可以通过监听这些事件来响应不同的 HTTP 请求。

   ```javascript
   const http = require("http");

   const server = http.createServer();
   server.on("request", (req, res) => {
     res.end("Hello World!");
   });

   server.listen(3000);
   ```

   在这个例子中，我们监听了服务器的`request`事件，然后发送回一条消息。

2. **文件操作**：文件系统（fs）模块允许你对文件进行读写操作。这些操作可以是异步的，并且发出事件，比如完成读取文件。

   ```javascript
   const fs = require("fs");
   const EventEmitter = require("events");

   class WithTime extends EventEmitter {
     execute(asyncFunc, ...args) {
       this.emit("begin");
       console.time("execute");
       asyncFunc(...args, (err, data) => {
         if (err) {
           return this.emit("error", err);
         }
         this.emit("data", data);
         console.timeEnd("execute");
         this.emit("end");
       });
     }
   }

   const withTime = new WithTime();

   withTime.on("begin", () => console.log("About to execute"));
   withTime.on("end", () => console.log("Done with execute"));

   const readFile = (file, cb) => fs.readFile(file, "utf8", cb);

   withTime.execute(readFile, __filename);
   ```

   在此示例中，我们创建了一个带有自定义事件（如`begin`, `data`, `end`）的类`WithTime`，以监控文件读取操作的不同阶段。

Node.js 的事件系统是构建高效、可扩展网络应用的核心。通过上述示例，你可以看到它如何使得管理和响应异步操作变得简单。

## [EventTarget](https://nodejs.org/docs/latest/api/globals.html#eventtarget)

Node.js 中的`EventTarget`是一个非常重要且基础的概念，直接关联到了 Node.js 强大的事件驱动架构。在 Node.js v21.7.1 中，`EventTarget`继续被支持和维护，确保开发者可以利用它来创建高效、可扩展的网络应用程序。为了让你更好地理解`EventTarget`，我们将从它的基本概念说起，并通过实际的例子来展示其用法。

### 基本概念

首先，`EventTarget`是一个可以拥有监听器（Listeners）的对象，这些监听器用于监听和响应不同类型的“事件”（Events）。在 Node.js 中，很多核心对象都是`EventTarget`的实例，比如 HTTP 服务器（http.Server），文件流（fs.ReadStream）等。

事件本身可以视为一个特定的信号，表示某种事情已经发生。例如，在 HTTP 服务器上，每当有新的请求到来时，都会触发一个事件。

### 使用`EventTarget`

使用`EventTarget`的基本步骤包括：

1. **创建**一个`EventTarget`的实例或获取一个已经存在的`EventTarget`的实例。
2. **添加**事件监听器，以便当特定的事件发生时能够执行一些操作。
3. **触发**事件，这通常由 Node.js 内部处理，但也可以手动触发。

### 实际运用例子

#### 例子 1：HTTP 服务器

```javascript
const http = require("http");

// 创建 HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World\n");
});

// 监听 'listening' 事件
server.on("listening", () => {
  console.log("Server is listening on port 8080");
});

// 启动服务器，监听8080端口
server.listen(8080);
```

在这个例子中，我们创建了一个简单的 HTTP 服务器。我们使用`server.on()`方法来添加一个监听器，这个监听器关注的是服务器开始监听端口时触发的`listening`事件。当事件发生时，控制台将输出一条消息表明服务器已经准备好接受连接了。

#### 例子 2：自定义事件

除了内置的事件外，Node.js 还允许你创建并触发自定义事件。

```javascript
const { EventTarget, Event } = require("events");

// 创建一个 EventTarget 实例
const myTarget = new EventTarget();

// 添加一个监听器，监听 'myEvent' 事件
myTarget.addEventListener("myEvent", (event) => {
  console.log(`Handled: ${event.type}`);
});

// 创建一个事件并触发
const event = new Event("myEvent");
myTarget.dispatchEvent(event); // 输出 "Handled: myEvent"
```

这个例子中，我们创建了一个`EventTarget`实例，并添加了一个监听器来处理自定义的`myEvent`事件。随后，我们创建了一个`myEvent`事件并通过调用`dispatchEvent`方法来触发它，导致我们的监听器函数被执行。

通过这两个例子，你可以看到`EventTarget`在 Node.js 中如何用来处理各种事件，无论是系统事件还是自定义事件。这种基于事件的异步编程模型是 Node.js 非常强大的特性之一，使得 Node.js 非常适合处理 I/O 密集型任务，如网络服务器、实时通讯等。

## [exports](https://nodejs.org/docs/latest/api/globals.html#exports)

在 Node.js 中，`exports` 是一个非常重要的功能，它允许你创建可以被其他文件（模块）使用的代码。每个 Node.js 文件都被视为一个模块，通过 `exports` 关键字，你可以将函数、对象或变量从一个模块输出，使得其他模块能够通过 `require` 函数引入并使用这些导出的代码。

当你创建一个 Node.js 模块时，默认情况下会有一个空的 `exports` 对象。你可以给这个对象添加属性，这些属性就是你想要暴露给其他模块的部分。

### 示例 1：导出单个功能

假设你创建了一个名为 `math.js` 的文件，提供了一些数学相关的函数：

```javascript
// math.js

// 定义两个函数
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// 导出函数
exports.add = add;
exports.subtract = subtract;
```

现在你可以在另一个文件中使用这些函数，如下：

```javascript
// app.js

// 引入math模块
const math = require("./math");

// 使用math模块的函数
const sum = math.add(10, 5);
const difference = math.subtract(10, 5);

console.log(sum); // 输出：15
console.log(difference); // 输出：5
```

### 示例 2：导出整个对象

如果你想一次性导出多个功能或值，你可以直接对 `module.exports` 进行赋值。

```javascript
// greetings.js

// 创建一个包含多个问候语的对象
const greetings = {
  hello: function (name) {
    return `Hello, ${name}!`;
  },
  goodbye: function (name) {
    return `Goodbye, ${name}!`;
  },
};

// 直接将整个对象导出
module.exports = greetings;
```

然后，在另一个文件中，你可以这样使用上面的模块：

```javascript
// app.js

// 引入greetings模块
const greetings = require("./greetings");

// 使用greetings模块的函数
const greetingMessage = greetings.hello("Alice");
const farewellMessage = greetings.goodbye("Bob");

console.log(greetingMessage); // 输出：Hello, Alice!
console.log(farewellMessage); // 输出：Goodbye, Bob!
```

### 示例 3：组合使用 exports 和 module.exports

虽然通常推荐使用其中一种方式进行导出，但你也可以在一个模块中混合使用 `exports` 和 `module.exports`。

```javascript
// mixedExports.js

// 添加到exports对象
exports.simpleMessage = "Hello world";

// 替换整个module.exports对象
module.exports = {
  complexFunction: function () {
    console.log("This is a more complex function");
  },
};
```

需要注意的是，由于最后一行替换了整个 `module.exports` 对象，所以 `simpleMessage` 将不会被导出。只有 `complexFunction` 可用于引入此模块的其他文件。

总结一下，`exports` 是 Node.js 中实现模块化的基础设施之一。它允许开发者编写可复用的代码，并管理依赖关系。在版本 21.7.1 中，其基本概念和用途与之前的版本保持一致。

## [fetch](https://nodejs.org/docs/latest/api/globals.html#fetch)

Node.js v21.7.1 引入的`fetch`功能是基于全球网联盟（W3C）和网络应用开放标准联合会（WHATWG）定义的 Web 标准。这意味着，Node.js 现提供了一个原生的方式来执行 HTTP(S)请求，而不需要依赖外部库如`request`或`axios`。在之前的版本中，如果你想发起网络请求，通常需要安装和使用第三方库。现在，通过`fetch` API 的集成，Node.js 使得发送网络请求变得更加简单和直接。

### `fetch` 的基本用法

`fetch`函数允许你发起网络请求并获取响应。它返回一个 Promise，因此你可以使用`.then()`和`.catch()`方法处理成功的响应或捕获错误。

下面是一些实际示例，展示如何在 Node.js 中使用`fetch`。

#### 示例 1: 获取文本数据

假设我们要从一个在线资源获取一些文本数据：

```javascript
fetch("https://api.example.com/data.txt")
  .then((response) => response.text()) // 将响应体转换为文本
  .then((data) => console.log(data)) // 打印数据
  .catch((error) => console.error("Fetching data failed:", error));
```

#### 示例 2: 获取 JSON 数据

通常 API 会返回 JSON 格式的数据，这里是如何处理这种类型的响应：

```javascript
fetch("https://api.example.com/items")
  .then((response) => response.json()) // 将响应体转换为JSON
  .then((data) => {
    console.log(data); // 处理数据
  })
  .catch((error) => console.error("Fetching JSON failed:", error));
```

#### 示例 3: 发送带有数据的 POST 请求

如果你需要向服务器发送数据（例如，提交表单），可以将`method`, `headers`, 和 `body`选项添加到`fetch`调用中：

```javascript
fetch("https://api.example.com/submit", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John",
    age: 30,
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error submitting data:", error));
```

### 错误处理

使用`fetch`时，有两种主要类型的错误需要处理：网络错误和 HTTP 错误状态（例如 404 或 500）。`fetch`只在遇到网络错误时（例如断网）才会拒绝（reject）Promise。即使 HTTP 响应状态表示错误（如 404 或 500），`fetch`也会解析并返回 Promise。因此，检查响应的`ok`属性或状态码是很重要的，以识别这类错误。

```javascript
fetch("https://api.example.com/might-not-exist")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .catch((error) =>
    console.error("There has been a problem with your fetch operation:", error)
  );
```

以上是 Node.js 中`fetch`的一些基础用法示例。正如你所见，`fetch`提供了一种标准且易于使用的方式来进行网络请求，它将在处理各种 web 开发任务时大有裨益。

## [Class: File](https://nodejs.org/docs/latest/api/globals.html#class-file)

Node.js v21.7.1 中的`File`类是一个代表文件系统中文件的抽象，它提供了一系列方法和属性来与文件交互。这意味着当你在编写 Node.js 程序时，可以使用`File`类来读取、写入或修改文件等操作。下面我将通俗易懂地解释这个类，并给出几个实际的例子来说明如何使用它。

首先，了解一点基础知识：Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，它允许你用 JavaScript 来编写服务器端代码。Node.js 非常擅长处理 I/O 密集型任务，比如网络通信、文件操作等，正因为此，`File`类在 Node.js 中扮演着重要的角色。

### `File`类的关键方法和属性

- `read()`和`write()`方法：允许你读取和写入文件内容。
- `copy()`方法：可以复制文件。
- `move()`方法：支持移动文件到新位置。
- `delete()`方法：用于删除文件。
- `path`属性：表示文件的路径。
- `size`属性：显示文件大小。

事实上，在 Node.js 的官方文档中并没有直接提到一个名为`File`的类。通常情况下，我们通过`fs`模块（文件系统模块）来进行文件操作。`fs`模块提供了一套用于操作文件系统的 API，包括读取文件、写入文件、修改文件权限等功能。但为了本次解释的需要，我们假设存在一个`File`类，以下是如何使用这些方法的一些示例。

### 示例

#### 读取文件内容

```javascript
const fs = require("fs");

// 异步读取文件内容
fs.readFile("/path/to/file.txt", "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

// 同步读取文件内容
try {
  const data = fs.readFileSync("/path/to/file.txt", "utf-8");
  console.log(data);
} catch (err) {
  console.error(err);
}
```

#### 写入文件内容

```javascript
const fs = require("fs");

const content = "Hello, Node.js";

// 异步写入文件内容
fs.writeFile("/path/to/file.txt", content, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("File has been written");
});

// 同步写入文件内容
try {
  fs.writeFileSync("/path/to/file.txt", content);
  console.log("File has been written");
} catch (err) {
  console.error(err);
}
```

#### 复制文件

```javascript
const fs = require("fs");

// 异步复制文件
fs.copyFile("/path/to/source.txt", "/path/to/destination.txt", (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("File copied successfully");
});
```

以上示例展示了如何在 Node.js 中进行基本的文件操作。虽然直接使用`File`类的描述在官方文档中找不到，但是你可以通过`fs`模块（文件系统模块）来执行所有这些文件操作，这也是处理文件最常见的方式之一。

希望这能帮助你更好地理解 Node.js 中如何进行文件操作。随着你逐渐深入学习，你会发现还有更多高级特性和技巧等待着你去探索。

## [Class FormData](https://nodejs.org/docs/latest/api/globals.html#class-formdata)

理解 Node.js 中的`FormData`类可以从两个方面入手：首先了解什么是`FormData`，其次探讨它在实际应用中的几个例子。

### 什么是 FormData？

`FormData`类是用于构造一组键值对，这些键值对代表表单字段和它们的值，可以通过网络发送。在浏览器环境里，它经常用来在前端与后端之间传送表单数据。而在 Node.js 中，`FormData`的概念被引进来，允许服务器端代码也能构建和操作类似表单的数据，并发送 HTTP 请求。

### 实际运用的例子

#### 1. 上传文件到服务器

假设你需要通过 Node.js 上传一个图片文件到远程服务器。在这种情况下，你可以使用`FormData`来构建请求体，附上文件数据。

```javascript
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios"); // 使用axios库来发送HTTP请求

// 创建一个FormData实例
const form = new FormData();
// 添加文件到表单数据，第一个参数是后端接收的key
form.append("image", fs.createReadStream("./photo.png"));

// 发送POST请求上传文件
axios
  .post("http://example.com/upload", form, {
    headers: {
      ...form.getHeaders(),
    },
  })
  .then((response) => {
    console.log("文件上传成功", response.data);
  })
  .catch((error) => {
    console.error("上传失败", error);
  });
```

这里使用`fs.createReadStream`来读取本地文件，然后通过`form.append`方法把文件添加到`FormData`对象中。注意，我们还需要设置正确的请求头，`form.getHeaders()`方法帮助我们获取了正确的`Content-Type`，包括边界字符串。

#### 2. 提交表单数据

假定你想通过 Node.js 向某个 API 提交一份表单，包含用户信息。

```javascript
const FormData = require("form-data");
const axios = require("axios");

// 创建FormData实例
const form = new FormData();
// 向表单中添加字段
form.append("username", "JohnDoe");
form.append("age", 30);

// 发送请求
axios
  .post("http://example.com/api/submit-form", form, {
    headers: {
      ...form.getHeaders(),
    },
  })
  .then((response) => {
    console.log("表单提交成功", response.data);
  })
  .catch((error) => {
    console.error("表单提交失败", error);
  });
```

在这个例子中，我们创建了一个`FormData`对象，并通过`append`方法添加了两个字段：用户名和年龄。然后，使用`axios`库发送了一个 POST 请求，将表单数据提交到指定的 URL。

#### 总结

`FormData`类在 Node.js 中是处理表单数据、文件上传等场景的有力工具。通过构造`FormData`对象并利用现有的 HTTP 客户端库（如`axios`），你可以轻松地发送复杂的 POST 请求，以满足各种开发需求。

## [global](https://nodejs.org/docs/latest/api/globals.html#global)

Node.js 是一个运行于服务器端的 JavaScript 环境，它让 JavaScript 也能开发后端程序、命令行工具等，而不仅限于在浏览器中运行。在 Node.js 中，有一些全局对象和变量是随处可用的，你不需要通过`require`或者`import`来引入它们。这些就是所谓的全局（global）对象。

### Global 对象

在 Node.js 里，最顶层的作用域不是全局（global），与在浏览器中的 JavaScript 不同。在浏览器中，顶层作用域是全局作用域。这意味着在浏览器中声明的变量（不使用`var`, `let`, 或 `const`）将会成为全局变量。但在 Node.js 中，模块文件内部的顶层作用域实际上是该模块本身，因此定义的变量属于模块作用域，不会污染全局作用域。

然而，Node.js 提供了一个`global`关键字，它类似于浏览器环境中的`window`对象。通过`global`对象，可以访问到所有的全局变量，即那些不需要使用任何特定模块就能够使用的变量。

### 实际应用例子

#### 1. 全局变量

比如，我们可以使用`global`对象来定义一个全局变量，这样在其他的任何模块中都可以访问到这个变量。

```js
// 在module1.js中
global.myGlobalVar = "Hello, world";

// 然后在module2.js中
console.log(global.myGlobalVar); // 输出: Hello, world
```

#### 2. 内置模块和函数

`global`对象还包含了很多内置的属性和函数，比如：

- `console`: 用于输出日志信息到标准输出或标准错误。
- `setTimeout()`, `clearTimeout()`, `setInterval()`, `clearInterval()`: 用于处理时间相关的操作。

例如，我们可以使用`setTimeout()`函数来在指定的延迟后执行代码，而这个函数就是`global`对象的一个方法。

```js
setTimeout(() => {
  console.log("This message is shown after 3 seconds");
}, 3000);
```

#### 3. globalThis

从 Node.js v12 开始引入了`globalThis`关键字，提供了一种标准化的方式来获取全局对象，无论代码是在什么环境下执行的，都可以使用`globalThis`来代替`global`、`window`、`self`等，以便跨平台兼容。

```js
console.log(globalThis.setTimeout === setTimeout); // 输出: true
```

综上所述，`global`对象在 Node.js 中扮演着重要的角色，使得定义全局变量和访问内置功能变得可能。同时，通过引入`globalThis`，Node.js 在促进跨环境代码共享方面也做出了努力。

## [Class Headers](https://nodejs.org/docs/latest/api/globals.html#class-headers)

Node.js 中的 `Headers` 类是用于处理 HTTP 请求和响应头的一个工具。它提供了一系列方法，让你能够方便地操作这些头信息。理解 `Headers` 类可以帮助你在构建网络应用时更精细地控制数据交换过程。

### 基本概念

在 HTTP 协议中，头部（Headers）承载着关键的信息，如客户端支持的内容类型、服务器发送的内容类型、请求身份验证信息等。当浏览器（或其他客户端）发送请求到服务器时，会附带请求头（Request Headers），服务器响应时同样会带有响应头（Response Headers）。

### `Headers` 类的核心功能

- **添加、获取、删除头信息**：你可以轻松地为请求或响应添加新的头信息，检索已存在的头信息，或删除不需要的头信息。
- **迭代头信息**：`Headers` 类提供了方法，使得遍历所有头信息变得简单。

### 实际应用示例

假设你正在编写一个 Node.js 应用，需要向另一个服务发送 API 请求，并且你需要在这个请求中包含一些特定的头信息，比如`Content-Type`（内容类型）和`Authorization`（授权信息）。

#### 示例一：创建并发送带有自定义头的 HTTP 请求

```javascript
const fetch = require("node-fetch"); // 假设使用node-fetch库进行HTTP请求
const url = "https://api.example.com/data";
const headers = new Headers();

// 添加头信息
headers.append("Content-Type", "application/json");
headers.append("Authorization", "Bearer your_token_here");

// 发送请求
fetch(url, {
  method: "GET",
  headers: headers,
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

在这个例子中，我们通过`append`方法给请求添加了两个头信息：`Content-Type`和`Authorization`。这表明我们将以 JSON 格式发送请求的主体内容，并且请求已经被适当地授权。

#### 示例二：处理接收到的响应头

当你从服务器接收响应时，可能需要读取某些响应头信息，例如，检查内容类型或者分页信息。

```javascript
fetch("https://api.example.com/data")
  .then((response) => {
    // 获取并打印内容类型
    console.log(response.headers.get("Content-Type"));

    // 检查是否还有下一页
    const linkHeader = response.headers.get("Link");
    if (linkHeader && linkHeader.includes('rel="next"')) {
      console.log("有下一页数据");
    }

    return response.json();
  })
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

在处理响应时，我们通过调用`get`方法来获取特定的头信息。在这个例子中，我们检查了内容类型，也查看了`Link`头来判断是否还有更多的页面数据可供请求。

### 总结

`Headers` 类是处理 HTTP 头部信息的强大工具，无论是在发送请求还是接收响应时。通过其提供的方法，你可以灵活地设置、获取和操作头信息，以满足你的网络通信需求。在实际开发中，合理利用头信息可以帮助你构建更高效、更安全的网络应用。

## [MessageChannel](https://nodejs.org/docs/latest/api/globals.html#messagechannel)

Node.js 的`MessageChannel`是一种 API，它允许不同的 JavaScript 环境（比如主线程和工作线程之间）进行简单的通信。在解释`MessageChannel`前，你需要理解几个关键概念：

1. **Node.js 中的工作线程（Worker Threads）**：Node.js 可以运行多个线程，这对于执行耗时操作非常有用，因为它们可以异步执行，不会阻塞主线程。

2. **主线程与工作线程的通信问题**：虽然工作线程能够提升应用的性能，但它引入了线程间通信的复杂性。两个线程需要能够安全、高效地交换信息。

这就是`MessageChannel`派上用场的地方。它提供了一种机制，允许两个 JavaScript 环境通过传递消息进行通信，而不是共享内存，这样做更安全、更简单。

### `MessageChannel`的组成

`MessageChannel`包含两个主要部分：

1. **端口（Ports）**：每个`MessageChannel`有两个端口（`port1`和`port2`），这两个端口相互连接，允许数据从一个端口发送到另一个端口。

2. **消息事件（Message events）**：当一个端口收到消息时，它会触发一个事件，可以在这个事件的处理程序中读取消息数据。

### 实际应用举例

假设我们有一个计算密集型任务，比如生成斐波那契数列的前 N 项，我们不想在主线程上执行这个任务，因为它可能会造成应用响应缓慢。我们可以创建一个工作线程来处理这个任务，并使用`MessageChannel`与主线程通信。

#### 步骤 1：创建工作线程文件

```javascript
// fibonacciWorker.js
const { parentPort } = require('worker_threads');

function generateFibonacci(n) {
    let fib = [0, 1];
    for(let i = 2; i `<` n; i++) {
        fib[i] = fib[i-1] + fib[i-2];
    }
    return fib;
}

parentPort.on('message', (n) => {
    parentPort.postMessage(generateFibonacci(n));
});
```

#### 步骤 2：在主线程中使用`MessageChannel`与工作线程通信

```javascript
const { Worker } = require("worker_threads");
const { MessageChannel } = require("worker_threads");

// 创建一个MessageChannel
const { port1, port2 } = new MessageChannel();

// 创建工作线程
const worker = new Worker("./fibonacciWorker.js", { workerData: null });

// 使用port2与工作线程通信
worker.postMessage(null, [port2]);

// 监听从工作线程发来的消息
port1.on("message", (data) => {
  console.log(data); // 打印生成的斐波那契数列
});

// 发送消息给工作线程，请求生成前10项斐波那契数列
port1.postMessage(10);
```

在这个例子中，我们创建了一个工作线程来生成斐波那契数列，并通过`MessageChannel`的两个端口在主线程和工作线程之间进行通信。主线程通过`port1`发送一个消息给工作线程（指定要生成的项数），工作线程接收这个消息，完成计算后，再通过`port2`回发消息给主线程。这样既避免了主线程阻塞，又实现了安全有效的线程间通信。

## [MessageEvent](https://nodejs.org/docs/latest/api/globals.html#messageevent)

Node.js 的 `MessageEvent` 是一个在 Node.js 中用来表示信息传递事件的对象。这类事件通常在使用如 Worker 线程或者其他的异步、事件驱动的接口时发生，比如 WebSockets。在 Node.js v21.7.1 的文档中，`MessageEvent` 主要与这样的场景相关联。

### 基本概念

首先，让我们了解一下什么是 `MessageEvent`。简单来说，它是当一个消息被发送到某个对象（比如 Worker 线程、WebSocket）时所触发的事件的表示。这个事件对象包含了关于消息的详细信息，例如消息的内容以及可能的其他元数据。

### 主要属性

- `data`：它包含了实际发送的消息。这可以是字符串、Buffer、ArrayBuffer 或其他格式的数据。
- `type`：事件类型，默认为 "message"。
- `origin`：发送消息的源的标识符，但在 Node.js 中这个属性可能不常用。
- `lastEventId`：和 `origin` 类似，这个属性在浏览器环境下更常见，用于标识事件的唯一 ID。

### 实例应用

#### 使用 Worker 线程

在 Node.js 中，`MessageEvent` 最常见的使用场景之一就是跨 Worker 线程的通信。假设你有一个处理 CPU 密集型任务的场景，你可能会想把这些任务放在一个独立的线程中执行，以避免阻塞主线程。

```javascript
const { Worker, isMainThread, parentPort } = require("worker_threads");

if (isMainThread) {
  // 主线程代码
  const worker = new Worker(__filename);

  worker.on("message", (event) => {
    console.log(`收到来自 Worker 的消息: ${event.data}`);
  });

  worker.postMessage({ data: "Hello, Worker!" });
} else {
  // Worker 线程代码
  parentPort.on("message", (event) => {
    console.log(`收到来自主线程的消息: ${event.data}`);
    parentPort.postMessage({ data: `已收到：“${event.data}”` });
  });
}
```

在这个例子中，主线程创建了一个新的 Worker 线程，并通过 `postMessage` 发送消息。Worker 线程收到消息后，会响应并将另一个消息发送回主线程。注意，每次消息交换实际上涉及到了 `MessageEvent` 对象，它通过 `event.data` 属性携带消息内容。

#### 使用 WebSocket

另一个 `MessageEvent` 的应用示例是在实现基于 WebSocket 的实时通信时。WebSocket 允许客户端和服务器之间建立一个持久的连接，通过这个连接双向传输数据。

```javascript
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(event) {
    console.log(`收到客户端消息： ${event.data}`);
  });

  ws.send(JSON.stringify({ data: "Hello from server!" }));
});
```

在这个例子中，服务器使用 `ws` 库创建了一个 WebSocket 服务，并监听客户端的连接请求。当服务器接收到客户端发送的消息时，`message` 事件被触发，事件处理函数接收到一个 `MessageEvent` 对象，其中包含了客户端发送的消息内容。

### 结论

`MessageEvent` 在 Node.js 中是处理各种消息传递机制的核心。无论是在多线程编程中跨线程通信，还是在构建实时、双向通信的网络应用程序中，`MessageEvent` 都扮演着重要角色。通过它提供的属性和方法，开发者能够高效地管理和处理消息数据，为用户带来更快速、平滑的交互体验。

## [MessagePort](https://nodejs.org/docs/latest/api/globals.html#messageport)

Node.js 中的 `MessagePort` 是一种机制，它允许不同的 JavaScript 环境（或称为线程）之间进行双向通信。想象你有两个岛屿（线程），而 `MessagePort` 就像是连接这两个岛屿的桥梁，让它们可以相互发送信息。

### 基础概念

在 Node.js 中，通常情况下代码是单线程运行的，意味着一次只能执行一件事。然而，有些任务特别耗时，比如读取大文件、进行复杂计算等，这会阻塞线程，影响性能和用户体验。为了解决这一问题，Node.js 允许开发者创建多个线程来并行处理任务。但是，主线程如何与这些新线程沟通就成了一个问题。这正是 `MessagePort` 发挥作用的地方。

### 实际运用

让我们举几个例子来说明 `MessagePort` 的实际运用：

1. **背景任务处理**：假设你正在开发一个网站后端，需要生成一份复杂的报告，这个过程非常耗时。你可以创建一个新的线程来处理报告生成，同时主线程继续响应其他用户请求。当报告生成完毕，通过 `MessagePort` 通知主线程，主线程随后可以将报告发送给用户。

2. **Web Workers**：虽然 Web Workers 是 Web 浏览器的概念，但它和 Node.js 中的多线程使用 `MessagePort` 进行通信的概念相似。在一个复杂的前端应用中，你可能需要在后台执行一些数据处理任务，而不干扰主界面的响应性。通过 Web Workers 和 `MessagePort`，你可以在一个独立的线程中完成这些任务，并将结果发送回主线程更新 UI。

3. **微服务架构**：在一个更大的系统中，你可能会将应用拆分成多个小服务（即微服务），它们各自处理不同的功能。假设这些服务需要在本地机器上运行并且频繁交换数据。在这种场景下，你可以使用 `MessagePort` 在这些服务之间建立通信渠道，让它们能够高效地交换消息。

### 如何使用

在 Node.js 里使用 `MessagePort` 通常涉及到 `worker_threads` 模块。以下是一个简单的示例：

```javascript
const { Worker, isMainThread, parentPort } = require("worker_threads");

if (isMainThread) {
  // 主线程逻辑
  const worker = new Worker(__filename); // 创建一个工作线程执行当前文件
  worker.on("message", (message) => console.log(`收到: ${message}`)); // 监听工作线程发来的消息
  worker.postMessage("你好，工作线程"); // 向工作线程发送消息
} else {
  // 工作线程逻辑
  parentPort.on("message", (message) => {
    console.log(`工作线程收到消息: ${message}`);
    parentPort.postMessage(message + "工作线程已接收"); // 回复消息给主线程
  });
}
```

在这个例子中，主线程创建了一个工作线程，并通过 `postMessage()` 方法向它发送了一条消息。工作线程接收这条消息，并通过 `postMessage()` 方法回复。这个往返过程就是通过 `MessagePort` 完成的。

### 总结

`MessagePort` 提供了一种强大方式，使得在 Node.js 应用中不同线程或环境间的双向通信变得可能。无论是处理耗时的后台任务，还是在复杂的系统架构中实现微服务间的通信，`MessagePort` 都是一个非常有用的工具。

## [module](https://nodejs.org/docs/latest/api/globals.html#module)

Node.js 中的 `module` 是一个非常核心的概念，它指的是一个可以被其他文件重用的代码块。每个 Node.js 文件都被视为一个模块。

在 Node.js 中，当你创建一个 `.js` 文件时，这个文件内部不仅仅包含了你写的代码，还有一些隐藏的结构。Node.js 会为每个文件提供一个 `module` 对象，这个对象代表了当前文件或模块本身。而通过 `module.exports` 属性，你可以决定哪些部分可以被其他模块访问或使用，即导出成员。

### module 对象

`module` 对象是当前模块的一个引用，它具有以下几个关键的属性：

- `module.exports`：它是对外暴露接口的对象。如果你想要某个功能被其他文件重用，你就需要将其添加到 `module.exports` 中。
- `module.require`：这是一个函数，和全局的 `require` 函数类似，用于导入其他模块的导出内容。
- `module.id`：当前模块的唯一标识符。
- `module.filename`：当前模块的文件名，带有完整路径。
- `module.loaded`：一个布尔值，表示模块是否已经加载完成。
- `module.parent`：一个引用，指向第一个要求该模块的模块。

### 使用 module.exports 导出模块

让我们来看一个简单的例子，说明如何使用 `module.exports`。

假设我们有一个 `mathUtils.js` 文件，我们想要共享一些数学相关的函数：

```javascript
// mathUtils.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = {
  add: add,
  subtract: subtract,
};
```

在上面的例子中，我们定义了两个函数 `add` 和 `subtract`，然后我们把它们作为一个对象添加到 `module.exports`。这意味着任何导入 `mathUtils.js` 的文件现在都可以访问这两个函数。

### 从其他模块导入

现在，如果我们想在另一个文件中使用 `mathUtils.js` 的函数，我们可以这样做：

```javascript
// app.js
const mathUtils = require("./mathUtils");

console.log(mathUtils.add(1, 2)); // 输出: 3
console.log(mathUtils.subtract(5, 3)); // 输出: 2
```

在 `app.js` 中，我们使用内置的 `require` 函数来加载 `mathUtils.js` 模块。Node.js 解析 `mathUtils.js` 文件并执行它，然后返回 `module.exports` 对象。这样，我们就可以通过 `mathUtils` 变量访问 `add` 和 `subtract` 函数了。

### 结论

通过这种方式，Node.js 支持模块化编程，使得代码组织更加清晰，便于管理。每个文件都封装了特定的逻辑，通过 `module.exports` 和 `require()` 方法进行交互，形成了一个由多个小模块构建起来的大型应用程序。

## [Navigator](https://nodejs.org/docs/latest/api/globals.html#navigator)

从我所了解的信息来看，截至 2023 年 4 月，Node.js 的官方文档中并没有直接提到 `Navigator` 作为 Node.js 的一部分。通常情况下，`Navigator` 对象是与 Web 浏览器相关的一个概念，用于在 JavaScript 中获取用户浏览器的信息，而不是 Node.js 的特性。这可能导致了一些混淆。

Node.js 是一个运行在服务器端的 JavaScript 环境，主要用于构建服务器端应用程序，而不是直接与浏览器交互。因此，Node.js 主要关注的是如何处理网络请求、文件系统操作以及与其他后台服务的交互等。

尽管如此，让我们考虑一下你的问题背景，并试图从两个角度给予解释和实际使用例子：

### 1. 如果是在浏览器环境中的 `Navigator`

在浏览器环境中，`Navigator` 对象提供了有关浏览器的信息，例如版本号、安装的插件等。这对于需要根据用户浏览器能力调整自己功能的前端 Web 应用非常有用。

**例子：**

- **检查是否支持某个特性**：如果你想检查用户的浏览器是否支持地理位置服务（Geolocation），可以通过以下方式：

  ```javascript
  if ("geolocation" in navigator) {
    console.log("Geolocation is available");
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position);
    });
  } else {
    console.log("Geolocation is not available");
  }
  ```

- **用户代理检测**：获取浏览器的用户代理字符串，帮助判断用户正在使用哪种浏览器。
  ```javascript
  const userAgent = navigator.userAgent;
  console.log(userAgent);
  ```

### 2. 在 Node.js 中使用类似功能

虽然 Node.js 本身不包括 `Navigator` 对象，但你可以通过其他方式获取运行 Node.js 应用程序的服务器或环境的信息。

- **操作系统信息**：使用 Node.js 的 `os` 模块可以获取服务器的操作系统信息。

  ```javascript
  const os = require("os");

  console.log("Operating system: ", os.type());
  console.log("Free memory: ", os.freemem());
  console.log("Total memory: ", os.totalmem());
  console.log("CPU details: ", os.cpus());
  ```

- **环境变量访问**：你也可以访问环境变量，这在配置应用程序时很有用。
  ```javascript
  // The document is from Ying Chao Tea.Do not use for commercial purposes.
  const NODE_ENV = process.env.NODE_ENV;
  console.log("Environment: ", NODE_ENV);
  ```

综上所述，`Navigator` 更多地与浏览器环境相关，而 Node.js 作为服务器端 JavaScript 运行环境，其核心功能集中在服务器端操作上。希望这能帮助你理解这两者之间的区别以及如何在各自的领域内利用它们。

## [navigator](https://nodejs.org/docs/latest/api/globals.html#navigator_1)

Node.js v21.7.1 中的`navigator`对象是一项新加入的全局 API，它模拟了在浏览器环境中常见的`navigator`对象。在浏览器中，`navigator`对象包含有关用户的浏览器信息，比如版本、是否启用 cookie 以及操作系统等。

然而，在 Node.js 这样的服务器端环境中，通常不需要像在浏览器那样处理客户端特定的信息。但在某些情况下，开发者可能希望让服务器端代码能够兼容或者模拟浏览器环境，例如当他们正在使用一些既可以在浏览器中运行也可以在服务器上运行的同构 JavaScript 代码时。

截至我知识库最后更新的时间点，正式的 Node.js 文档中并没有提供名为`navigator`的全局对象。因此，以下内容是基于你提供的链接和当前已知信息进行推断的，不代表最终的官方实现。

举个例子，如果 Node.js 确实包含了一个类似浏览器中的`navigator`全局对象，它可能会被用来检测当前执行代码的 Node.js 版本，就像在浏览器中可以通过`navigator.userAgent`来获取浏览器的用户代理字符串一样。但它在服务器端的意义将显著不同，因为服务器不需要适配不同的用户浏览器环境。

假定在 Node.js 21.7.1 中存在这样一个全局的`navigator`对象，你可能会遇到类似下面的用法：

```javascript
console.log(navigator.userAgent);
```

在上面的例子中，我们打印出了`userAgent`属性的值，这在浏览器中通常包含了浏览器名称、版本和操作系统等信息。在 Node.js 中，这可能会返回关于 Node.js 自身版本的信息，或者是一个空字符串，因为它并不是一个浏览器。

请注意，由于 Node.js 环境与浏览器环境差异很大，即使引入了`navigator`对象，其功能和属性也可能非常有限，并且主要是为了兼容性考虑，而不是实际的信息查询需求。

如果你需要在 Node.js 中获取关于当前环境的详细信息，通常会使用诸如`process`全局对象中的方法和属性，例如：

```javascript
console.log(process.version); // 打印Node.js版本
console.log(process.platform); // 打印操作系统平台
```

以上就是对 Node.js 中假设存在的`navigator`全局对象的解释。如果在未来的 Node.js 版本中确实引入了这样一个对象，具体的应用和实现细节可能会有所不同，建议查阅当时的官方文档以获取准确信息。

### [navigator.hardwareConcurrency](https://nodejs.org/docs/latest/api/globals.html#navigatorhardwareconcurrency)

Node.js v21.7.1 中的 `navigator.hardwareConcurrency` 是一个在 Node.js 环境中较新加入的特性。在浏览器环境中，这个属性已经存在一段时间了，用于展示用户设备上可用的逻辑处理器核心的数量。这通常被用来确定并发执行任务的最优数量，从而更有效地利用多核处理器的能力。

在 Node.js 中引入 `navigator.hardwareConcurrency` 表明了对于这种跨平台代码共享和一致性体验的重视。基本上，它允许你的 Node.js 应用程序检测运行它的服务器或计算机有多少逻辑处理器（CPU 核心）。通过了解可用的逻辑处理器数量，你可以优化应用程序的性能，特别是在涉及到需要大量计算资源的场景下。

### 实际运用例子

1. **并行处理任务**

   假设你正在编写一个 Node.js 应用程序，该程序需要处理大量的数据分析任务。如果没有合理地管理，这些任务可能会串行执行，导致效率低下。通过使用 `navigator.hardwareConcurrency`，你可以得知系统的逻辑处理器数量，然后根据这些信息，将任务划分为多个子任务，并行地执行它们。

   ```javascript
   const numCPUs = navigator.hardwareConcurrency;

   for (let i = 0; i `<` numCPUs; i++) {
     // 创建Worker线程或子进程处理部分任务
   }
   ```

2. **动态调整线程池大小**

   在使用诸如 Web 服务器之类的 Node.js 应用程序时，你可能需要创建一个线程池来处理并发请求。通常，线程池的大小直接影响着应用程序处理能力。通过`navigator.hardwareConcurrency`，你可以动态设置线程池的大小为逻辑处理器的数量，或者基于该值的某个比例，以此来最大化资源利用率。

   ```javascript
   const poolSize = navigator.hardwareConcurrency;

   // 基于poolSize初始化线程池
   ```

3. **负载均衡**

   在进行高性能计算或者需要高并发处理的服务中，了解服务器的 CPU 核心数可以帮助实现更优的负载均衡策略。例如，在一个集群中，你可以根据不同服务器的`navigator.hardwareConcurrency`值分配不同的任务量，确保每个服务器都在其最佳性能范围内运行。

   ```javascript
   // 根据 navigator.hardwareConcurrency 值，决定将多少任务分配给当前服务器
   ```

### 注意事项

- 虽然了解逻辑处理器的数量是有益的，但在设计并发策略时还需要考虑其他因素，例如，单个任务的内存需求、I/O 密集型与 CPU 密集型任务的区别等。
- 过度的并行可能会导臀资源竞争，反而降低程序性能。因此，合理的使用`navigator.hardwareConcurrency`提供的信息至关重要。

总之，`navigator.hardwareConcurrency`为 Node.js 应用程序提供了一个强大的工具，以便更好地理解和利用底层硬件资源，从而优化性能和资源使用。

### [navigator.language](https://nodejs.org/docs/latest/api/globals.html#navigatorlanguage)

在 Node.js 中，`navigator.language`属性实际上并不直接存在或被支持，这是因为`navigator`对象本质上是 Web APIs 的一部分，通常存在于浏览器环境中，用于获取用户浏览器的相关信息，比如语言偏好、版本号等。Node.js 是一个服务器端的 JavaScript 运行环境，主要聚焦于服务器端或后台应用开发，并不包含`navigator`对象或与之相关的 Web API。

不过，为了解答你关于`navigator.language`的好奇，让我们先来了解它在浏览器环境中的作用，然后讨论在 Node.js 环境下如何处理相似的需求。

### 在浏览器中`navigator.language`

在浏览器环境中，`navigator.language`返回一个字符串，表示用户的首选语言。这通常是用户在浏览器设置中指定的语言，例如`en-US`代表美国英语，`zh-CN`代表中国大陆地区的简体中文。

**举例**：

- 如果你的网站需要根据用户的语言偏好显示不同语言的内容，可以使用`navigator.language`来获取用户的首选语言，然后据此显示相应的页面版本。

```javascript
let userLanguage = navigator.language || navigator.userLanguage;
// navigator.userLanguage 是为了兼容IE浏览器

if (userLanguage === "zh-CN") {
  // 显示中文内容
} else if (userLanguage === "en-US") {
  // 显示英文内容
}
```

### 在 Node.js 环境中处理类似需求

尽管 Node.js 没有`navigator`对象，但我们可以通过其他方式获取用户的语言偏好，特别是在处理 HTTP 请求时。HTTP 请求头中有一个`Accept-Language`字段，它提供了类似的功能，即标明客户端（通常是浏览器）优先接收哪种语言的内容。

**举例**：

当你在 Node.js 应用中创建一个 web 服务器时，可以读取请求头`Accept-Language`来决定响应的语言。

```javascript
const http = require("http");

http
  .createServer((req, res) => {
    const language = req.headers["accept-language"];

    // 假设默认语言是英语
    let responseText = "Hello, World!";

    if (language.startsWith("zh-CN")) {
      responseText = "你好，世界！";
    }

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(responseText);
  })
  .listen(8080);

console.log("Server running at http://127.0.0.1:8080/");
```

在这个例子中，服务器检查 HTTP 请求的`Accept-Language`头部，如果发现用户偏好的语言是中文（`zh-CN`），则用中文响应；否则，默认用英语响应。

总结来说，尽管 Node.js 本身不支持`navigator.language`这样的浏览器专有 API，但你仍然可以通过分析 HTTP 请求中的`Accept-Language`头部，在 Node.js 应用中实现类似的功能，即根据用户的语言偏好定制内容。

### [navigator.languages](https://nodejs.org/docs/latest/api/globals.html#navigatorlanguages)

Node.js 版本 21.7.1 中的 `navigator.languages` 实际上是一个相对新引入的全局属性，它模仿了在浏览器环境中存在的 `window.navigator.languages` 属性。这个属性旨在帮助开发者获取用户的首选语言列表，通常按照用户偏好的顺序排列。然而，在 Node.js 环境中，`navigator.languages` 的引入是为了增加与 Web 平台的兼容性，并非直接反映操作系统的语言设置。

### 理解 `navigator.languages`

在浏览器环境中，`navigator.languages` 返回的是用户在浏览器设置中指定的首选语言列表，例如 `['en-US', 'fr', 'de']`。这有助于开发者提供更加个性化和本地化的网页内容。

在 Node.js 中，`navigator.languages` 的设计初衷类似 —— 提供一个接口来了解用户的语言偏好，尽管 Node.js 是运行在服务器端的环境。从 Node.js v21.7.1 开始，`navigator.languages` 被引入作为实验性功能，主要用于与浏览器的 API 对齐，提高代码的跨运行环境兼容性。

### 如何使用

使用 `navigator.languages` 很简单，你可以直接访问这个全局变量来获取当前设置的语言列表。以下是一个基本的示例：

```javascript
console.log(navigator.languages); // 输出可能是 ['en-US', 'fr']
```

但需要注意的是，由于 Node.js 主要运行于服务器端，`navigator.languages` 在 Node.js 中的值需要你在应用程序的某个地方手动设置，以便模拟或传递客户端（如浏览器）的首选语言信息。

### 实际应用场景

1. **国际化（i18n）处理**：如果你正在开发一个多语言支持的网站或应用，使用 `navigator.languages` 可以帮助你决定向用户展示哪种语言的内容。例如，根据用户的语言偏好自动选择邮件模板的语言。

2. **日志记录和分析**：了解使用你的应用的用户偏好哪些语言，可以帮助你进行市场定位和内容规划。通过记录 `navigator.languages` 的值，可以获取到这一信息。

3. **内容协商**：在服务器端，根据 `navigator.languages` 指定的优先级选择最合适的语言版本资源返回给客户端，比如选择合适的本地化视频或文档。

### 注意事项

- 在 Node.js 中，默认情况下 `navigator.languages` 可能未定义，因为它依赖于外部输入（例如 HTTP 请求头）来模拟或设置。
- 由于 `navigator.languages` 在 Node.js 中是一个新特性并且标记为实验性的，它的行为在未来版本中可能会有所改变。因此，在生产环境中使用时应谨慎并保持关注 Node.js 的更新。

总结，`navigator.languages` 在 Node.js 中的引入为服务器端的应用提供了更多与客户端兼容的可能性，并且为国际化和本地化的实现提供了便利。然而，由于其实验性质和不同于浏览器环境的工作方式，开发者在使用时需要特别注意。

### [navigator.platform](https://nodejs.org/docs/latest/api/globals.html#navigatorplatform)

Node.js 是一个开源和跨平台的 JavaScript 运行环境。它允许你在服务器端运行 JavaScript 代码，这意味着可以构建服务器、工具或者甚至是命令行应用程序。然而，你提到的`navigator.platform`实际上并不属于 Node.js 的部分，而是 Web APIs 的一部分，经常用于浏览器中的 JavaScript 环境。

不过，为了帮助你理解`navigator.platform`在类似环境中的作用（比如在浏览器环境中），以及如何在 Node.js 中处理相似的需求，我会详细解释下。

### `navigator.platform`简介

在 Web 开发中，`navigator.platform`是一个只读属性，返回一个字符串，表示浏览器所运行的操作系统或平台的信息。开发者经常利用这个属性来获取用户设备的操作系统信息，从而为用户提供更优化的体验或执行特定操作系统相关的功能。

#### 实例

假设你正在开发一个网站，需要根据用户的操作系统调整布局或功能：

```javascript
if (navigator.platform.startsWith("Win")) {
  console.log("Looks like you are using Windows.");
  // 为Windows用户提供特定的操作或视觉效果
} else if (navigator.platform.startsWith("Mac")) {
  console.log("Looks like you are using macOS.");
  // 为macOS用户提供特定的操作或视觉效果
} else {
  console.log("Unknown platform");
  // 提供一个通用的布局或功能
}
```

### 在 Node.js 中处理平台信息

虽然在 Node.js 中没有`navigator.platform`（因为`navigator`对象是 Web API 的一部分，主要用于浏览器环境），Node.js 有自己的方式来提供关于运行环境的信息。

Node.js 提供了`os`模块，其中包含了一些用于获取操作系统相关信息的方法，比如`os.platform()`方法就可以用来获取运行 Node.js 程序的操作系统平台。

#### 示例

```javascript
const os = require("os");

console.log(`Your platform is ${os.platform()}`);

// 这将输出类似 'darwin', 'win32', 'linux' 等，取决于你的操作系统。
```

在 Node.js 中，使用`os`模块可以让你编写跨平台的代码，例如，根据不同的操作系统执行不同的任务或者调整应用程序的性能参数等。

总之，虽然你最初的问题关于`navigator.platform`并不直接适用于 Node.js，但通过理解如何在不同的环境（如浏览器与 Node.js）中获取和使用平台信息，你可以更好地开发跨平台的应用程序。

### [navigator.userAgent](https://nodejs.org/docs/latest/api/globals.html#navigatoruseragent)

Node.js 通常用于服务器端的 JavaScript 运行环境，并不像浏览器环境拥有 `navigator` 对象。不过，Node.js v16.0.0 引入了一个实验性的功能，可以模拟一些浏览器特有的全局变量，其中就包括 `navigator.userAgent`。

在浏览器中，`navigator.userAgent` 是一个字符串，指的是用户代理（User Agent）的信息，即浏览器自身的身份标识。这个字符串通常包含了操作系统、浏览器类型、浏览器版本等信息，网站可以通过这个字符串来判断访问者使用的是哪种浏览器，从而提供适配后的内容或功能。

由于 Node.js 主要运行在服务器端，它本身并不需要 `navigator` 对象。但为了兼容某些原本设计在浏览器上运行的代码，或进行服务端渲染（SSR），Node.js 通过 `global.navigator` 模拟实现了这样一个对象。

在 Node.js 中使用这个属性之前，请确保你的版本支持该特性，并且你已经启用了相应的实验性功能。从 Node.js v21.7.1 版本开始，如果你直接尝试访问 `navigator.userAgent`，可能会遇到未定义的错误，因为它不是 Node.js 核心 API 的一部分。

下面是一个简单的例子说明如何在 Node.js 环境中使用 `navigator.userAgent`：

```javascript
// 假设你的 Node.js 环境启用了对 navigator.userAgent 的支持
// 首先，我们需要设置一个模拟的 user-agent 字符串
global.navigator = {
  userAgent:
    "Mozilla/5.0 (Linux; U; Android 4.2.2; en-us; Nexus 4 Build/JOP40D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30",
};

// 然后就可以在 Node.js 代码中读取这个值了
console.log(navigator.userAgent);

// 输出示例：
// Mozilla/5.0 (Linux; U; Android 4.2.2; en-us; Nexus 4 Build/JOP40D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30
```

在实际应用中，使用 `global.navigator` 更多的是为了与那些期望在浏览器环境下运行的库或框架兼容。例如，如果你在服务器端使用了一些第三方库，而这些库在某些地方依赖于浏览器的 `navigator` 对象，则你可能需要模拟 `global.navigator` 来避免出错。当然，这种做法需要谨慎，因为它涉及到对全局对象的修改，可能会导致意想不到的副作用。

总结起来：在 Node.js 中，`navigator.userAgent` 是一个非标准的、模拟的浏览器全局变量，用于特定情况下的兼容性处理。在大多数后端开发场景中，你可能都不需要关心这个属性。

## [PerformanceEntry](https://nodejs.org/docs/latest/api/globals.html#performanceentry)

Node.js 中的 `PerformanceEntry` 接口来自于性能时间线 API（Performance Timeline API），它提供了一种方式来获取和分析网站或应用程序的性能指标。虽然最初这个接口是为浏览器环境设计的，但在 Node.js 中，它也被引入以便开发者可以监控和分析后端操作的性能。

一个 `PerformanceEntry` 对象包含以下属性：

- **name**: 描述性能条目名称的字符串，如资源名称、标记名等。
- **entryType**: 表示性能条目类型的字符串，比如 "mark"、"measure"、"frame" 等。
- **startTime**: 性能条目的开始时间点。
- **duration**: 性能条目持续的时间长度。

### 在 Node.js 中使用 `PerformanceEntry`

在 Node.js 中，你可以利用 `performance` 模块中的 API 来创建并获取性能条目。下面我们通过几个例子来演示它的实际应用。

#### 实例 1: 使用 `performance.mark()` 和 `performance.measure()`

假设你想要测量一段代码的执行时间。你可以使用 `performance.mark()` 方法在代码执行前后各设置一个标记，然后使用 `performance.measure()` 来计算两个标记之间的时间差：

```javascript
const { performance, PerformanceObserver } = require("perf_hooks");

// 设置一个初始标记
performance.mark("start_process");

// 模拟一些需要测量的代码
setTimeout(() => {
  // 设置结束标记
  performance.mark("end_process");

  // 测量两个标记之间的时间差
  performance.measure("My Special Process", "start_process", "end_process");

  // 使用 PerformanceObserver 监听性能条目的记录
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.log(`${entry.name}: ${entry.duration}`);
    });
  });

  observer.observe({ entryTypes: ["measure"] });
}, 1000);
```

在上面的例子中，我们模拟了一段耗时的操作（通过 `setTimeout`），然后通过 `performance.mark()` 在操作开始和结束时各设置了一个标记。接着，我们使用 `performance.measure()` 方法来测量这两个标记之间的时间差。`PerformanceObserver` 被用来观测和打印出测量结果。

#### 实例 2: 监控异步操作的性能

Node.js 的 `performance` API 不仅限于同步代码。借助 `PerformanceObserver` 和特定的性能条目（如 `'function'` 类型），你也可以观察异步操作的性能。

```javascript
const { performance, PerformanceObserver } = require("perf_hooks");

async function someAsyncOperation() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("done");
    }, 300);
  });
}

(async () => {
  await someAsyncOperation();

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.log(`${entry.name}: ${entry.duration}`);
    });
  });

  observer.observe({ type: "function", buffered: true });

  // 注意：在 Node.js v21.7.1 中，直接监控异步函数的性能可能需要更复杂的设置或第三方库的支持，
  // 上面的代码更多地展示了如何使用 PerformanceObserver。
})();
```

注意，直接通过 `PerformanceObserver` 监控异步操作的性能可能需要针对性的配置或利用特定的 API 调用，因此在具体项目中，实现方式可能会有所不同。

### 总结

`PerformanceEntry` 和相关的 API 在 Node.js 中允许开发者进行细粒度的性能监控和测量。通过标记和测量代码的执行时间，你可以获得关于你的应用性能的深入见解，从而优化和提高其效率。

## [PerformanceMark](https://nodejs.org/docs/latest/api/globals.html#performancemark)

Node.js 中的 `PerformanceMark` 是一个性能测量工具，它允许你标记程序中的特定时间点。这些时间点后来可以用来计算代码执行的时长或者比较不同代码片段之间的执行效率。理解 `PerformanceMark` 可以帮助你优化应用的性能，确保用户体验流畅。

### 如何使用 `PerformanceMark`

首先，你需要了解如何创建一个标记（mark）。Node.js 提供了一个全局的 `performance` 对象，通过这个对象你可以调用 `mark()` 方法来创建一个标记。看下面的基础用法示例：

```javascript
const { performance } = require("perf_hooks");

// 创建一个标记名为 "start"
performance.mark("start");

// 一些你想要测量的代码...
setTimeout(() => {
  // 模拟一些异步操作，例如从数据库获取数据

  // 在操作结束时创建另一个标记名为 "end"
  performance.mark("end");

  // 计算两个标记之间的时间差，即操作的持续时间
  const measure = performance.measure(
    "measure between start and end",
    "start",
    "end"
  );
  console.log(measure.duration);
}, 1000);
```

在上述代码中，我们首先导入了 Node.js 的 `perf_hooks` 模块，这是必需的，因为 `performance` API 是其中提供的功能。然后，我们调用 `performance.mark()` 来设置起始和结束的标记点。通过 `setTimeout` 模拟了一个异步操作，可以是任何操作，比如请求网络资源或者读取文件等。最后，我们通过 `performance.measure()` 方法计算起始和结束之间的时间差，即这次操作的持续时间，并打印出来。

### 实际运用举例

**例 1：测量 API 请求时间**

假设你正在开发一个 Web 服务，并想要测量一个特定 API 请求处理所需的时间。

```javascript
const { performance } = require("perf_hooks");

// 标记请求开始
performance.mark("apiStart");

fetch("https://some-api.com/data")
  .then((response) => response.json())
  .then((data) => {
    // 数据处理

    // 标记请求结束
    performance.mark("apiEnd");

    // 测量请求总耗时
    const measure = performance.measure(
      "API request time",
      "apiStart",
      "apiEnd"
    );
    console.log(`API请求耗时: ${measure.duration}`);
  });
```

**例 2：测量文件读写操作的时间**

在进行文件操作时，了解读写操作的性能也很重要。

```javascript
const { performance } = require("perf_hooks");
const fs = require("fs");

performance.mark("writeStart");

fs.writeFile("example.txt", "Hello Node.js", (err) => {
  if (err) throw err;

  performance.mark("writeEnd");
  performance.measure("write operation", "writeStart", "writeEnd");

  const measureWrite = performance.getEntriesByName("write operation")[0];
  console.log(
    `File write operation took ${measureWrite.duration} milliseconds`
  );

  performance.mark("readStart");

  fs.readFile("example.txt", (err, data) => {
    if (err) throw err;

    performance.mark("readEnd");
    performance.measure("read operation", "readStart", "readEnd");

    const measureRead = performance.getEntriesByName("read operation")[0];
    console.log(
      `File read operation took ${measureRead.duration} milliseconds`
    );
  });
});
```

### 总结

`PerformanceMark` 和 Node.js 中的 `performance` API 为开发者提供了强大的工具来测量代码执行时间。通过合理地利用这些工具，你可以精确地了解到代码中的哪一部分可能会成为性能瓶颈，并据此作出相应的优化。这对于构建高性能的应用来说至关重要。

## [PerformanceMeasure](https://nodejs.org/docs/latest/api/globals.html#performancemeasure)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，允许在服务器端运行 JavaScript 代码。这使得 JavaScript 不仅可以用于构建前端网页交互，也能用于后端服务器的开发。Node.js 提供了大量的内置模块，以便于进行文件系统操作、网络请求等。其中，性能监测是 Node.js 中一个重要的部分，它帮助开发人员识别和优化程序中的性能瓶颈。

`PerformanceMeasure` 是 Node.js 提供的一个全局接口，用于测量和记录代码的执行时间。通过这个功能，你可以非常精确地测量代码片段的执行时长，从而帮助你更好地理解应用的性能特性，并对其进行优化。

### 如何使用 `PerformanceMeasure`

1. **开始和结束标记**：首先，你需要标记出想要测量的代码段的开始和结束。这是通过调用 `performance.mark()` 方法完成的，你可以为每个标记指定一个唯一的名称。

2. **测量**：一旦你有了开始和结束的标记，就可以通过调用 `performance.measure()` 方法来测量它们之间的时间差。这个方法同样需要一个名称（用于识别这次测量），以及开始和结束标记的名称。

3. **获取结果**：测量完成后，你可以通过查看 `performance.getEntriesByName()` 或 `performance.getEntriesByType('measure')` 来获取具体的测量结果，其中包含了开始和结束时间点以及二者之间的时间差。

### 实际应用示例

假设你正在开发一个 Web 应用，并想要测量某个数据处理函数的执行时间。

```javascript
const { performance, PerformanceObserver } = require("perf_hooks");

// 注册一个性能观察者来异步地捕获性能测量结果
const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0]);
  performance.clearMarks(); // 清除所有已经记录的标记
});
obs.observe({ entryTypes: ["measure"] });

// 标记“开始”
performance.mark("start_process");

// 执行你想要测量的函数或代码段
processData();

// 标记“结束”
performance.mark("end_process");

// 测量从“start_process”到“end_process”的执行时间
performance.measure("Process Time", "start_process", "end_process");
```

在上面的示例中，`processData` 函数是我们想要测量执行时间的代码部分。通过在函数执行前后分别设置开始(`start_process`)和结束(`end_process`)标记，然后调用 `performance.measure()` 方法，我们能够得到这段代码执行所需的时间。性能观察者 (`PerformanceObserver`) 用于异步捕获并打印出测量结果。

总结而言，`PerformanceMeasure` 是一个强大的工具，它能够帮助开发者准确地测量和分析代码的执行时间，这对于性能优化和问题诊断来说至关重要。

## [PerformanceObserver](https://nodejs.org/docs/latest/api/globals.html#performanceobserver)

了解 Node.js 中的`PerformanceObserver`是一个有趣且重要的话题，它涉及监测和改进你的程序性能。首先，让我们一步步来解析这个概念，并通过例子来加深理解。

**什么是 PerformanceObserver?**

在 Node.js 中，`PerformanceObserver`类用于观察性能测量事件，这些事件可以是由用户定义的标记、测量或者是 Node.js 内部操作的性能指标。简单地说，就是一个工具，帮助你收集和分析代码运行时的性能数据。

**为什么需要 PerformanceObserver？**

当你开发应用时，确保它运行得既快又高效非常关键。但是，不使用工具的情况下，很难准确知道哪部分代码导致了性能瓶颈。`PerformanceObserver`就像是给你提供了一副“眼镜”，通过它，你可以看到哪些操作耗时最长，从而对它们进行优化。

**如何使用 PerformanceObserver？**

使用`PerformanceObserver`通常包括几个步骤：注册观察者、指定想要监听的性能条目类型、开始收集性能数据，最后是处理这些数据。

**例 1：监测自定义性能标记**

假设你正在写一个简单的程序，其中包含一段可能会影响整体性能的代码。你想知道这段代码运行了多久。

```javascript
const { PerformanceObserver, performance } = require('perf_hooks');

// 创建一个性能观察者来收集性能指标
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  console.log(entries);
});

// 让观察者关注特定类型的性能指标，这里是'mark'和'measure'
observer.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('start'); // 开始标记

// 假设这是你想要测试性能的代码
for(let i = 0; i `<` 1000000; i++) {}

performance.mark('end'); // 结束标记
performance.measure('My Special Loop', 'start', 'end'); // 测量从开始到结束标记之间的时间
```

在这个例子中，我们使用`performance.mark()`方法来标记代码执行的起止点，然后用`performance.measure()`计算这两点之间的持续时间。`PerformanceObserver`则用来捕获和打印出这段时间。

**例 2：监控异步操作的性能**

现代 Web 应用中，异步操作无处不在，了解某个异步操作耗时多久对于性能调优同样重要。

```javascript
const { PerformanceObserver, performance } = require("perf_hooks");

const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  console.log(entries);
});
observer.observe({ entryTypes: ["measure"] });

async function fetchData() {
  performance.mark("fetchStart");

  await new Promise((resolve) => setTimeout(resolve, 2000)); // 模拟异步操作

  performance.mark("fetchEnd");
  performance.measure("Fetch Data", "fetchStart", "fetchEnd");
}

fetchData();
```

在这个例子里，我们模拟了一个异步操作（假设是从某处获取数据），并且通过标记和测量，我们能够确定这个异步操作的具体耗时。

总结来说，`PerformanceObserver`是 Node.js 提供的一个强大工具，它可以帮你洞察程序的性能状况，通过收集和分析性能数据，从而做出相应的优化。希望以上的解读和示例能帮助你更好地理解并开始使用`PerformanceObserver`来提升你的应用性能。

## [PerformanceObserverEntryList](https://nodejs.org/docs/latest/api/globals.html#performanceobserverentrylist)

`PerformanceObserverEntryList` 是 Node.js 中的一个全局对象，它提供了一个列表，来访问由 `PerformanceObserver` 对象收集的性能度量事件 (`PerformanceEntry` 对象)。这些度量事件可以包括不同类型的性能相关信息，例如时间标记、资源加载时间等。

当你创建一个新的 `PerformanceObserver` 并且开始观察一定类型的性能条目时，每当有新的性能条目被记录，节点会调用回调函数，并传递 `PerformanceObserverEntryList` 对象给这个回调。然后，你可以使用这个列表查询和分析性能数据。

以下是如何使用 `PerformanceObserverEntryList` 的一个简单例子：

```javascript
const { PerformanceObserver, performance } = require("perf_hooks");

// 创建一个性能观察者实例来观察“measure”类型的性能条目
const obs = new PerformanceObserver((items) => {
  // 获取所有的性能条目列表
  const entries = items.getEntries();

  // 遍历每个条目并打印出来
  entries.forEach((entry) => {
    console.log(`Name: ${entry.name}, Duration: ${entry.duration}`);
  });

  // 清除当前存储的性能条目
  performance.clearMarks();
});

// 开始观察特定类型的性能条目
obs.observe({ entryTypes: ["measure"] });

// 添加一些性能标记（marks）
performance.mark("A");
// ... 在这里你可能会执行某些代码 ...
performance.mark("B");
// 测量从“A”到“B”的时间
performance.measure("A to B", "A", "B");
```

在上面的例子中，代码做了以下几件事情：

1. 导入了 Node.js 性能 API 中的 `perf_hooks` 模块。
2. 创建了一个 `PerformanceObserver` 实例，该实例通过一个回调函数来接收性能事件。
3. 回调函数使用 `getEntries` 方法从 `PerformanceObserverEntryList` 获取了所有性能条目，并遍历输出条目名称和持续时间。
4. 通过 `observe` 方法开始观察名为“measure”的性能条目。
5. 使用 `performance.mark` 创建性能标记，之后测量它们之间的差异并将其命名为“A to B”。

当 `performance.measure` 被调用时，它会生成一个类型为 "measure" 的性能条目，`PerformanceObserver` 检测到这一变化，并触发回调函数，此时 `PerformanceObserverEntryList` 对象就会包含这个刚生成的 measure 条目。这样你就可以分析程序中某些操作的性能表现了。

## [PerformanceResourceTiming](https://nodejs.org/docs/latest/api/globals.html#performanceresourcetiming)

Node.js 的 `PerformanceResourceTiming` 是一个重要的接口，它提供了网络请求的详细计时信息。这个功能主要用于性能分析，帮助开发者了解程序在执行过程中网络请求的性能表现。

### 什么是 PerformanceResourceTiming?

`PerformanceResourceTiming` 是一个包含了一次特定网络请求（如 HTTP、HTTPS 请求）性能数据的对象。它继承自 `PerformanceEntry` 接口，并增加了与资源加载相关的属性。

### PerformanceResourceTiming 的属性

这个对象包括了从请求开始到请求结束的各个阶段的时间戳，比如：

- `startTime`: 请求开始的时间。
- `redirectStart` 和 `redirectEnd`: 如果请求被重定向，这两个属性表示重定向开始和结束的时间。
- `fetchStart`: 浏览器准备好使用网络发送请求的时间。
- `domainLookupStart` 和 `domainLookupEnd`: 域名查询开始和结束的时间。
- `connectStart` 和 `connectEnd`: 与服务器建立连接的开始和结束时间。
- `requestStart`: 浏览器向服务器发出请求的时间。
- `responseStart` 和 `responseEnd`: 接收到响应的开始和结束时间。

通过这些时间戳，你可以衡量网络请求的性能，比如总体耗时、连接建立时间、响应接收时间等等。

### 实际运用例子

1. **性能分析**：如果你正在开发一个 Node.js 应用，并且注意到某些操作响应很慢，你可以使用 `PerformanceResourceTiming` 来测量不同网络请求的性能，进而找出性能瓶颈。

2. **监控和日志**：在生产环境中，你可以利用 `PerformanceResourceTiming` 数据进行实时性能监控。如果发现某个请求的性能突然下降，可以及时调整或优化代码。

3. **用户体验分析**：了解页面或应用加载过程中各个资源的加载时间，可以帮助你优化用户体验。比如，如果你发现图片加载特别慢，可能需要对图片进行压缩或使用更快的 CDN。

### 如何使用

在 Node.js 中使用 `PerformanceResourceTiming` 通常与 `performance` API 结合使用。首先，你需要启用和访问 performance API，然后通过一定的方法获取到特定请求的 `PerformanceResourceTiming` 对象。

```javascript
const { performance } = require("perf_hooks");

// 模拟一个请求
function fetchData(url) {
  const start = performance.now();

  // 这里是发起请求的逻辑，比如使用 fetch API 或其他 HTTP 客户端
  console.log(`Fetching ${url}...`);

  // 请求完成后，测量并记录性能
  const end = performance.now();
  console.log(`Fetch completed in ${end - start} milliseconds.`);
}

fetchData("https://example.com");
```

请注意，上面的示例只是为了演示如何手动测量性能。在 Node.js 环境中，由于没有内置的 `fetch` API ，你可能需要使用第三方库（如 Axios、node-fetch 等）来发起网络请求。同时，Node.js 的 `perf_hooks` 模块提供了更多专门的工具来测量和监控性能数据，但 `PerformanceResourceTiming` 主要是一个 Web API，其直接应用更多地体现在客户端浏览器环境中。

总结起来，虽然 `PerformanceResourceTiming` 在 Node.js 中不是直接使用的 API，了解它有助于你深入理解性能分析的概念，并且能够在适当的场景下（如客户端浏览器环境或借助相应的 Node.js 库）应用这些概念。

## [performance](https://nodejs.org/docs/latest/api/globals.html#performance)

Node.js 的 `performance` API 提供了一个方便的方式来测量代码的性能。这个 API 来自于 Web 浏览器中的 Performance 接口，特别是 High Resolution Time API 和 Performance Timeline API，它们允许你以极高的精度（通常是微秒级别）获取时间信息。

在 Node.js 中，`performance` API 能够帮助你理解应用程序运行的具体情况，比如函数执行多久，或者某些异步操作需要多少时间才能完成。这有助于识别和优化程序中的瓶颈。

以下是该 API 的一些关键部分：

1. `performance.now()`: 返回当前时间的高精度时间戳，相对于 `performance.timeOrigin`。它非常适合用来测量小段代码的执行时间。
2. `performance.mark()`: 用来创建一个时间标记（称为"标记点"），可以用这些标记点来衡量代码运行过程中的关键节点。
3. `performance.measure()`: 创建一个命名的时间间隔，通过指定两个标记点（开始和结束）来计算它们之间的时间差。

下面是一些实际的例子，说明如何使用这些功能：

### 实例 1: 测量代码块执行时间

假设你想要测量一个函数`doSomething()`的执行时间。

```javascript
const { performance } = require("perf_hooks");

// 开始计时
let startTime = performance.now();

// 执行你的函数
doSomething();

// 结束计时
let endTime = performance.now();

console.log(`doSomething 函数执行耗时：${endTime - startTime} 毫秒`);
```

### 实例 2: 使用标记和测量

如果你的程序包含了一系列复杂的操作，你可能想要详细了解每个步骤的耗时。

```javascript
const { performance, PerformanceObserver } = require("perf_hooks");

// 设置性能观察者，监听测量事件
const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries());
  performance.clearMarks();
});
obs.observe({ entryTypes: ["measure"] });

// 开始第一个操作
performance.mark("A-start");
doFirstThing();
performance.mark("A-end");

// 测量第一个操作
performance.measure("First thing", "A-start", "A-end");

// 开始第二个操作
performance.mark("B-start");
doSecondThing();
performance.mark("B-end");

// 测量第二个操作
performance.measure("Second thing", "B-start", "B-end");

function doFirstThing() {
  // ... 假设这里有一些代码
}

function doSecondThing() {
  // ... 假设这里也有一些代码
}
```

这段代码通过设置 `PerformanceObserver` 来监听测量事件，并在执行每个操作前后放置标记。然后，它调用 `performance.measure()` 来获取两个标记点之间的时间间隔。当每次测量完成时，性能观察者会输出测量结果。

使用 Node.js 的 `performance` API 可以帮助你更好地理解和优化你的代码性能。通过上述示例，你可以开始基本的性能监控，并逐步深入到更复杂的性能分析中去。

## [process](https://nodejs.org/docs/latest/api/globals.html#process)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，它让开发者可以使用 JavaScript 来编写服务端代码。在 Node.js 中，`process` 是一个全局对象，提供了当前 Node.js 进程的信息和控制能力。通过 `process` 对象，你可以与正在运行的 Node.js 程序交互，获取环境信息，监听运行时事件等。

以下是一些 `process` 对象最常用的属性和方法的解释和例子：

### process.env

`process.env` 属性返回包含用户环境信息的对象。这通常用来读取环境变量，这些变量可以保存敏感数据（比如数据库密码），或者用来决定程序在不同环境下（例如开发、测试、生产）的行为。

例子：

```javascript
console.log(process.env.PATH); // 打印环境变量PATH
```

如果你有一个名为 `DATABASE_PASSWORD` 的环境变量，你可以这样获取它：

```javascript
const dbPassword = process.env.DATABASE_PASSWORD;
```

### process.argv

`process.argv` 属性返回一个数组，其中包含当启动 Node.js 进程时传入的命令行参数。第一个元素是 node 命令的完整路径，第二个元素是执行的脚本文件的完整路径，而其他的元素是任何额外的命令行参数。

例子：

```javascript
// 运行 node script.js arg1 arg2
console.log(process.argv);
// 输出类似于：['node 路径', '/path/to/script.js', 'arg1', 'arg2']
```

### process.exit()

`process.exit()` 方法用来退出当前进程。你可以指定一个退出码（默认为 0），表示成功或者错误的完成。

例子：

```javascript
process.exit(); // 默认退出码为 0，代表成功执行
process.exit(1); // 退出码为 1，通常表示出现了错误
```

### process.cwd()

`process.cwd()` 方法返回 Node.js 进程的当前工作目录。这是执行 shell 命令或操作文件系统时非常有用的。

例子：

```javascript
console.log(process.cwd()); // 打印出当前工作目录
```

### process.nextTick()

`process.nextTick()` 方法允许你把一个回调函数放到事件循环的下一个轮次。这意味着无论何时调用 `nextTick()`，所传递的回调函数都会在其余代码执行完毕后、事件循环继续之前被触发。

例子：

```javascript
console.log("开始");
process.nextTick(() => {
  console.log("异步操作");
});
console.log("已计划");
// 输出顺序将会是 "开始" -> "已计划" -> "异步操作"
```

### process.on()

`process.on()` 方法用来绑定事件处理函数，监听特定的事件。Node.js 进程对象可以触发多种事件，比如 `exit`、`uncaughtException` 等。

例子：

```javascript
process.on("exit", (code) => {
  console.log(`即将退出，退出码：${code}`);
});
// 当进程退出时，会打印退出码
```

以上就是针对 Node.js 中 `process` 对象的一些基础知识点以及实用的例子。因为 `process` 是一个全局对象，所以你可以在任何 Node.js 模块中直接使用它，而不需要像使用其他模块那样导入它。

## [queueMicrotask(callback)](https://nodejs.org/docs/latest/api/globals.html#queuemicrotaskcallback)

好的，让我们一起深入了解 `queueMicrotask(callback)` 这个功能，并通过简单易懂的方式来探索它在 Node.js 中的应用。

### 什么是 `queueMicrotask(callback)`?

在 JavaScript 中，`queueMicrotask` 是一种将一个任务排进微任务队列（microtask queue）的方法。这意味着你通过这个方法添加的任务会在当前执行栈清空之后立即执行，但是在任何其他宏任务（例如设置时间延迟的 `setTimeout`、`setInterval`）之前执行。

微任务（microtasks）主要包括 Promise 回调和通过 `queueMicrotask` 添加的任务。使用 `queueMicrotask` 相比直接使用 Promise（例如 `Promise.resolve().then(callback)`），提供了一种更直接、语义化的方式进行微任务调度。

### 实际运用例子

#### 例子 1: 在异步操作完成后更新状态

假设你正在编写一个 Node.js 应用，需要在数据处理完毕后更新某些状态，但想确保这个更新操作发生在当前事件循环结束之后，以避免阻塞其它紧急操作。

```javascript
function processData(data) {
  // 假设这里有一些异步的数据处理逻辑
  console.log(`处理数据: ${data}`);

  // 数据处理完成后，我们希望更新状态
  queueMicrotask(() => {
    console.log("更新状态完成");
  });
}

processData("示例数据");
```

在这个例子中，无论 `processData` 函数的处理逻辑多复杂，状态更新的代码总是在当前 JavaScript 执行栈完成后、下一个宏任务开始前执行。

#### 例子 2: 避免堆栈溢出

当你有一个递归函数，该函数在没有到达递归终点时会不断地调用自己，这可能会导致堆栈溢出错误。使用 `queueMicrotask` 可以有效避免这个问题，因为它把新的调用放到微任务队列中，这样可以保持堆栈的清洁。

```javascript
function recursiveFunction(count) {
  if (count > 0) {
    console.log(count);
    queueMicrotask(() => recursiveFunction(count - 1));
  } else {
    console.log("完成");
  }
}

recursiveFunction(10000); // 这不会导致堆栈溢出
```

在这个例子里，每次递归调用都被排入微任务队列，而不是直接从前一个调用中同步地进行，从而避免了堆栈溢出的风险。

### 总结

通过以上的例子，我们可以看到 `queueMicrotask` 在 Node.js 的实用性。它使得微任务调度变得简单且直观，特别是在需要确保某些任务在当前执行环境结束后立即执行，但又不希望阻塞后续宏任务时非常有用。此外，它还能帮助我们优雅地处理像递归这类可能导致堆栈溢出的操作。

## [Class: ReadableByteStreamController](https://nodejs.org/docs/latest/api/globals.html#class-readablebytestreamcontroller)

Node.js 中的`ReadableByteStreamController`是一个内部构建的类，它是用来控制可读流（Readable Stream）的字节数据的一个接口。在解释之前，我们需要理解几个基础概念：

1. **流（Streams）**: 在编程中，流是一系列连续的数据元素，这些元素可以逐个地进行处理，而不需要一次性加载全部数据。流可以用于读取或写入大文件，网络通信等场景。

2. **可读流（Readable Streams）**: 这种类型的流用于读取数据。你可以想象成水流从一端流向另一端，其中数据从源头（如文件、网络请求等）流向消费者。

现在，让我们回到`ReadableByteStreamController`。这个类是 Node.js 内部使用的，并不常直接暴露给普通开发者。它被用于底层的实现，特别是当你创建自己的定制的可读流时。这个类提供了一些方法和属性来监视和控制流的状态和行为。

例如，如果你正在实现一个自定义的可读流来处理像文件的字节数据，`ReadableByteStreamController`可以帮助你控制数据的传输，比如确定何时一个数据块已经被发送，或者流应该结束了。

下面是`ReadableByteStreamController`的几个关键特性：

- **enqueue(chunk)**: 用来将一个新的数据块添加到流中。`chunk`必须是一个`Buffer`或者一个`Uint8Array`，表示二进制数据。
- **close()**: 当没有更多的数据需要添加到流时，这个方法被调用来关闭流。
- **error(e)**: 如果在处理流时遇到错误，这个方法会被调用，并且会传播错误信息。
- **desiredSize**: 这是一个 getter 属性，返回流中还能接受多少字节的数据，如果流已经满了就返回 0。

因为`ReadableByteStreamController`通常用于底层开发，所以它不太适合编程初学者。相对来说，你可能会更常与`fs.createReadStream`这样的 API 打交道，用于读取文件等操作。

举一个抽象的例子，假设我们要创建一个可读流，用于逐步读取一个大文件并进行处理：

```javascript
const { Readable } = require("stream");

class MyCustomReadableStream extends Readable {
  constructor(options) {
    super(options);
    // 初始化代码...
  }

  _read(size) {
    // _read是内部方法，Node.js会在需要数据的时候调用它
    // 模拟异步读取数据
    setTimeout(() => {
      const data = getData(); // 假设这个函数负责获取数据
      if (data) {
        this.push(data); // 使用push方法来发送数据
      } else {
        this.push(null); // 如果没有更多数据，发送null来关闭流
      }
    }, 100);
  }
}

// 使用这个自定义的可读流
const myStream = new MyCustomReadableStream();
myStream.on("data", (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
myStream.on("end", () => {
  console.log("There will be no more data.");
});
```

在上面的代码中，我们没有直接使用`ReadableByteStreamController`，但我们使用了`Readable`类来创建一个自定义的可读流。在内部，Node.js 可能会使用类似`ReadableByteStreamController`的机制来管理由`_read`方法提供的数据流。

## [Class: ReadableStream](https://nodejs.org/docs/latest/api/globals.html#class-readablestream)

当你听到 Node.js 中的`ReadableStream`，可以把它想象成一个不断流动的水管。在编程世界里，这个“水管”不是传输水，而是传输数据。`ReadableStream`是一种能让你以一种高效、顺序的方式处理数据流的工具。

### 什么是 Stream？

在 Node.js 中，Stream 是处理读写大量数据的一个抽象概念。想象一下，如果你有一个非常大的文件，一次性读取并加载到内存中可能会导致程序崩溃或运行缓慢。使用 Stream，你可以分批次地读取和处理数据，就像你可以把一壶水倒入杯子一样一点一点倒，而不是试图一次性全部吞下。

### ReadableStream 的作用

`ReadableStream`特别指的是那些用于读取数据的 Stream。这意味着数据可以从一个`ReadableStream`"流出"，就像水从水管流出一样。这对于处理诸如来自文件、网络请求或其他输入源的大量数据尤其有用。

### ReadableStream 的实际应用

1. **文件处理**：
   假设你需要读取一个非常大的日志文件并分析里面的内容。使用`fs.createReadStream()`方法，你可以创建一个指向该文件的`ReadableStream`，然后逐块读取文件内容，而不是一次性将整个文件载入内存。这样做可以显著降低内存使用，并提高应用性能。

   ```javascript
   const fs = require("fs");

   // 创建一个指向大文件的可读流
   const readableStream = fs.createReadStream("path/to/large/file.txt");

   readableStream.on("data", (chunk) => {
     console.log(`Received a chunk of data with size ${chunk.length}`);
   });

   readableStream.on("end", () => {
     console.log("No more data.");
   });
   ```

2. **网络请求**：
   当你发送一个 HTTP 请求获取某些资源（比如从 API 获取数据）时，响应体可能非常大。如果使用`ReadableStream`，你可以逐步处理这些数据，比如解析 JSON 数据流，而不是等待整个数据下载完成。这有助于提升应用响应速度和用户体验。

3. **数据转换**：
   `ReadableStream`可以与`WritableStream`结合使用，实现数据的实时转换。比如，你可能想要将一个文本文件中的数据读取出来，转换格式后再写入另一个文件。通过`pipe`方法，可以轻松地将`ReadableStream`的输出连接到`WritableStream`的输入，实现数据的流式转换。

   ```javascript
   const fs = require("fs");
   const zlib = require("zlib"); // Node.js核心模块，用于数据压缩

   // 创建一个读取流和一个写入流
   const readStream = fs.createReadStream("input.txt");
   const writeStream = fs.createWriteStream("output.txt.gz");

   // 使用zlib.createGzip()创建一个转换流，将数据压缩成.gz格式
   const gzip = zlib.createGzip();

   // 管道链：读取 -> 压缩 -> 写入
   readStream.pipe(gzip).pipe(writeStream);
   ```

通过这些例子，我们可以看到`ReadableStream`在处理大型数据、优化性能和增强用户体验方面的重要性。在 Node.js 的世界里，熟练掌握 Streams 无疑是一项非常有价值的技能。

## [Class: ReadableStreamBYOBReader](https://nodejs.org/docs/latest/api/globals.html#class-readablestreambyobreader)

在 Node.js 中，`ReadableStreamBYOBReader`（Bring Your Own Buffer Reader）是一个相对高级的概念，它属于流(Streams) API 的一部分。要理解`ReadableStreamBYOBReader`，首先我们需要了解几个基本概念：

1. **流 (Streams):** 在 Node.js 中，流是一种处理读写数据的方式，可以将其看作是数据的管道。通过流，我们可以高效地处理大量数据，因为我们不必等待所有数据都可用才开始处理。

2. **可读流 (Readable Streams):** 是一种流，允许你读取数据。例如，当你从文件系统读取文件或者从网络请求中接收数据时，你会使用到可读流。

3. **BYOB（Bring Your Own Buffer）:** 这是一种高效处理二进制数据的机制。简而言之，它允许你提供一个自己的缓冲区（一个存放数据的容器），然后直接将数据读入这个缓冲区中，这样可以减少内存的使用和复制操作，提高性能。

现在，让我们深入`ReadableStreamBYOBReader`：

### `ReadableStreamBYOBReader` 类

`ReadableStreamBYOBReader`类允许你以一种更控制和高效的方式读取流中的数据。它的“BYOB”特性使得你可以指定一个自定义的缓冲区（Buffer），直接将数据读取到这个缓冲区中，而无需流自动为你创建新的缓冲区。这种方法主要用于处理二进制数据，例如文件和网络通信，其中性能非常关键。

#### 实际运用例子

考虑以下场景：

1. **文件处理:** 假设你正在开发一个应用程序，需要从一个大型的二进制文件中读取数据。使用`ReadableStreamBYOBReader`，你可以创建一个固定大小的缓冲区，比如每次读取 4KB 的数据。这样，你就可以在控制内存使用的同时，有效率地逐步处理整个文件。

2. **视频流处理:** 如果你正在实现一个需要处理视频数据的功能，可能需要从网络获取视频流并进行处理。通过使用`ReadableStreamBYOBReader`，你可以指定一个缓冲区来接收视频数据块。这可以帮助你更有效地管理内存和处理速度，尤其是在处理高清视频流时。

3. **网络通信:** 当你的应用与其他服务通过 TCP 或 UDP 协议交换大量数据时，使用`ReadableStreamBYOBReader`可以帮助你更精确地控制数据的接收方式。例如，你可以根据当前的处理能力和内存使用情况动态调整缓冲区的大小。

### 如何使用

使用`ReadableStreamBYOBReader`的基本步骤如下：

1. 获取一个可读流。
2. 创建一个`ReadableStreamBYOBReader`实例，传入这个可读流。
3. 创建一个 Buffer（你的“BYOB”）。
4. 使用`read()`方法读取数据到你的 Buffer 中。

请注意，由于此 API 的复杂性和专业性，在实际应用中，它主要被用于特定的性能敏感场景。如果你是编程新手，建议首先熟悉基本的流操作和概念，然后再深入了解和使用`ReadableStreamBYOBReader`。

## [Class: ReadableStreamBYOBRequest](https://nodejs.org/docs/latest/api/globals.html#class-readablestreambyobrequest)

在 Node.js v21.7.1 中，`ReadableStreamBYOBRequest` 是一个类，代表了 "Bring Your Own Buffer" (BYOB) 读取请求的概念。它是用于流式数据处理的一部分，并且与 `ReadableStream` 类型的流紧密相关。这个类不是经常直接使用，而是在底层系统和库中处理字节数据时用到。

首先，让我们了解一些基本概念：

- **流 (Stream)**：在编程中，流是一系列连续的数据元素，这些数据元素可以作为一个整体被访问。它们是动态的数据集合，你可以从中读取数据或向其中写入数据。
- **可读流 (Readable Stream)**：是一种特殊类型的流，从中你可以读取数据。比如，在 Node.js 中，当你从文件、网络等来源读取数据时，你会使用到可读流。
- **BYOB ("Bring Your Own Buffer")**：是一个高级别的概念，允许调用者提供自己的缓冲区（即内存块），以便从流中读取数据直接填充到这个缓冲区中。这可以提高性能，因为它减少了内存复制操作。

现在让我们深入了解 `ReadableStreamBYOBRequest` 类：

`ReadableStreamBYOBRequest` 实例是由支持 BYOB 读取的可读流创建的。当流准备好将数据填充进调用者提供的缓冲区时，它会给出一个请求。作为开发者，你通常不需要直接创建或使用这个类，它更多出现在实现自定义可读流或者与底层系统交互时。

这个类主要有两个方法：

- `respond(bytesWritten)`：完成读取操作并指示已经写入`bytesWritten`字节数到缓冲区。
- `respondWithNewView(view)`：完成读取操作但使用一个新的 `ArrayBufferView` 来替代原来的缓冲区。

实际应用中，你可能不会直接跟`ReadableStreamBYOBRequest`打交道，但如果你在创建更加底层的库或者需要对性能进行优化时，理解这个类就很重要了。

举个实例来说明，假设你正在处理一个非常大的数据文件，比如一个视频文件，你想边读边处理这个文件。使用传统的流处理方式，你可能会遇到内存管理不当或者性能瓶颈的问题。而利用 BYOB 模式，你可以控制数据是如何被读取和填充到缓冲区的，从而更有效地管理内存，实现高效的数据处理。

简单代码示例:

```javascript
// 假设我们有一个支持BYOB的可读流source
const source = getSomeBYOBCompatibleReadableStream();

// 当流准备好接受缓冲区时会触发'byob-request'事件
source.on("byob-request", (request) => {
  // 创建一个8KB大小的缓冲区
  const buffer = new ArrayBuffer(8192);
  const view = new Uint8Array(buffer);

  // 现在我们把缓冲区提供给流，它会填充数据
  request.view(view);

  // 假设我们完成了数据的读取
  request.respond(8192);
});

// 开始读取数据
source.read();
```

记住，这只是为了展示 `ReadableStreamBYOBRequest` 的概念，并不是一个真实的完整示例。在实际应用中，BYOB 通常结合着流的控制器（`ReadableStreamDefaultController`）等其他组件来使用。

## [Class: ReadableStreamDefaultController](https://nodejs.org/docs/latest/api/globals.html#class-readablestreamdefaultcontroller)

在了解`ReadableStreamDefaultController`之前，我们需要先明确几个概念：Node.js、流（Stream）、以及可读流。让我来依次为你解释。

### Node.js

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。它允许你在服务器端运行 JavaScript 代码，这意味着你可以用 JavaScript 来编写后端代码。

### 流（Stream）

在 Node.js 中，流是处理数据的一种方式，尤其是当数据量大或者数据还在产生时。流可以将数据分成小块进行处理和传输，这样就不必等待所有数据都可用才开始处理。

### 可读流

可读流是一种流，它用于从某处（如文件、HTTP 响应等）读取数据。想象一下，你正用一根吸管喝奶昔，吸管里的奶昔就像是通过可读流传送的数据。

### ReadableStreamDefaultController

`ReadableStreamDefaultController`是 Node.js 中流 API 的一部分。它是一个底层接口，主要用于由开发人员创建的自定义可读流。直白点说，如果你想自定义流的行为（比如怎么读数据，何时停止读数据等），你可能会用到它。

`ReadableStreamDefaultController`提供了几个关键的方法来控制流的状态和行为：

- `close()`: 调用此方法会关闭流，意味着没有更多的数据可以读取。
- `enqueue(chunk)`: 通过这个方法可以向流中添加数据块（chunk）。这相当于说，“这里有更多数据可以读。”
- `error(e)`: 如果在处理流的过程中出现错误，可以调用此方法来报告错误。

### 实际应用案例

假设你正在构建一个网络应用，需要从一个大型文件中读取数据，并且实时地将其发送给客户端。使用标准的读取整个文件到内存中的方法可能会导致内存占用过高。这时，你可以使用自定义的可读流来逐渗读取和发送文件内容。

```javascript
const { Readable } = require("stream");

class MyReadableStream extends Readable {
  constructor(options) {
    super(options);
    this.dataIndex = 0; // 模拟数据索引
  }

  _read(size) {
    setTimeout(() => {
      if (this.dataIndex > 10) {
        // 假设当读到10次数据后结束
        this.push(null); // 使用 null 来表示流的结束
      } else {
        this.push(`Data chunk ${this.dataIndex}`); // 推送数据到流中
        this.dataIndex++;
      }
    }, 100); // 延迟模拟异步数据读取
  }
}

const myStream = new MyReadableStream();
myStream.on("data", (chunk) => {
  console.log(chunk.toString());
});
myStream.on("end", () => {
  console.log("No more data.");
});
```

在这个例子中，我们定义了一个类`MyReadableStream`，继承并实现了`Readable`类的`_read`方法。在`_read`方法中，我们模拟异步地读取数据（这里简化为使用`setTimeout`），并使用`push`方法将数据块发送出去。当数据读取完毕时，我们通过`push(null)`来通知流结束。

总结来说，`ReadableStreamDefaultController`是在 Node.js 中管理和控制自定义可读流行为的关键工具，尽管直接使用的场景不多，但它为 Node.js 中的数据流操作提供了强大的底层支持。

## [Class: ReadableStreamDefaultReader](https://nodejs.org/docs/latest/api/globals.html#class-readablestreamdefaultreader)

Node.js 的`ReadableStreamDefaultReader`是一个与流（数据的连续传输）相关的对象，用于逐段读取来自一个`ReadableStream`的数据。这个概念可能听起来有点抽象，但我会通过一些实际例子帮你更好地理解。

### 基本概念

首先，让我们了解几个基本概念：

- **流（Stream）**：在编程中，流是一系列连续的数据。想象成水流，数据如同水滴一样从一个地方流向另一个地方。在 Node.js 中，流被用于处理大量数据，比如文件读写、网络通信等，因为它们允许数据分块处理，而不是一次性加载整个数据集合到内存中。
- **ReadableStream**：一个可读流允许你读取数据。可以将其视为一个数据源，例如文件、HTTP 响应体等。

### `ReadableStreamDefaultReader`

`ReadableStreamDefaultReader`是用于按顺序从`ReadableStream`中读取数据的标准接口。当你有一个`ReadableStream`实例时，你可以创建一个`ReadableStreamDefaultReader`来按块（chunk）读取流中的数据。

#### 如何使用

假设我们有一个很大的文本文件，你想要逐行读取此文件而不是一次性将整个文件加载到内存中。使用`ReadableStreamDefaultReader`可以帮助我们这样做。

##### 步骤 1: 创建 ReadableStream

首先，你需要有一个`ReadableStream`。在 Node.js 中，你可以通过各种方式获取它，例如从 HTTP 响应或者直接从文件系统读取。

```javascript
const fs = require("fs");

// 创建一个ReadableStream
const readableStream = fs.createReadStream("./large-file.txt", {
  encoding: "utf8",
});
```

##### 步骤 2: 使用 ReadableStreamDefaultReader 读取数据

然后，我们利用`ReadableStream`创建一个`ReadableStreamDefaultReader`来读取数据。

```javascript
// 假设这里的readableStream是你已经获取的可读流
const reader = readableStream.getReader();

async function readData() {
  while (true) {
    // 读取数据
    const { done, value } = await reader.read();
    if (done) {
      break; // 当没有更多数据时退出循环
    }
    console.log(value); // 打印出来的值就是读取到的数据块
  }
}

readData();
```

### 实际应用例子

1. **文件处理**：假设你正在开发一个 Node.js 应用，需要处理非常大的日志文件。使用`ReadableStreamDefaultReader`可以帮助你逐行读取日志，进行分析或者统计，而不需要将整个文件一次性加载到内存。

2. **网络请求**：当你从一个 API 获取大量数据时，比如下载一个大文件或者视频流时，`ReadableStreamDefaultReader`可以帮助你按块处理这些数据，例如边下载边处理数据，而不是等待整个下载完成。

### 总结

`ReadableStreamDefaultReader`提供了一种高效的方法来处理大量数据，特别是在资源受限的情况下（比如内存）。通过按需逐块读取数据，它使得即使是处理大型文件或数据流也变得容易和可管理。

## [require()](https://nodejs.org/docs/latest/api/globals.html#require)

Node.js 中的`require()`函数是一个用来加载模块的关键功能。当你想要在一个文件中使用另一个文件或模块导出的代码时，你会用到`require()`。

在 Node.js 中，每个文件都被视为一个独立的模块。如果你想在一个文件（比如`main.js`）中访问另一个文件（比如`module.js`）导出的变量、函数或对象，你需要使用`require()`函数来导入它们。

下面是`require()`的基本用法：

### 基本使用

假设我们有一个名为`math.js`的文件，里面定义了一些数学相关的函数，并且我们希望能够在其他文件中使用这些函数。

**math.js:**

```javascript
function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

// 使用module.exports导出函数，使得其它文件可以通过require()获取
module.exports = {
  add,
  subtract,
};
```

现在，如果我们想在另一个文件`main.js`中使用这些数学函数，我们就需要用`require()`导入`math.js`。

**main.js:**

```javascript
// 导入math.js模块
const math = require("./math");

// 现在我们可以使用math模块中的函数了
const sum = math.add(10, 5);
const difference = math.subtract(10, 5);

console.log(`Sum: ${sum}`); // 输出: Sum: 15
console.log(`Difference: ${difference}`); // 输出: Difference: 5
```

请注意，在`require()`函数中我们提供了相对路径（'./math'），这意味着`math.js`和`main.js`位于同一个目录下。`require()`函数返回的是`math.js`文件中通过`module.exports`导出的内容。

### `require()`解析

当你调用`require()`时，Node.js 遵循以下步骤来解析和加载模块：

1. 解析给定的路径，如果提供了相对路径（如'./module'），它将根据当前文件的位置进行解析。
2. 查看指定路径的文件是否存在。
3. 如果文件存在，则加载该文件并执行其内部代码。
4. 最后，返回该文件通过`module.exports`导出的内容，以便在`require()`被调用的地方使用。

### 内置模块

Node.js 还具有许多内置模块，例如`fs`（用于文件系统操作）、`http`（用于创建 HTTP 服务器）等，这些模块也可以使用`require()`来加载。

例如，如果你想读取一个文件的内容，你可以使用内置的`fs`模块：

```javascript
// 导入fs模块
const fs = require("fs");

// 使用fs模块读取文件的内容
fs.readFile("example.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

在这个例子中，我们没有提供相对路径来加载`fs`模块，因为它是一个内置模块，Node.js 知道如何找到它。

总之，`require()`函数是 Node.js 中用于模块加载和导入其他文件或模块功能的核心机制，允许你组织和重用代码。通过模块化开发，你可以创建可维护性更高、结构更清晰的应用程序。

## [Response](https://nodejs.org/docs/latest/api/globals.html#response)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，它让你可以在服务端运行 JavaScript 代码。在 Node.js 中，Response 对象是 HTTP 响应的封装，它提供了一系列属性和方法来控制服务器返回给客户端的内容。

在 Node.js v21.7.1 的文档中，`Response` 指的是 `http.ServerResponse` 类的实例对象，这个对象在 HTTP 交互过程中表示服务器对客户端请求的回应。它通常由 Node.js 内部创建，不需要我们手动去实例化它。当我们创建一个 HTTP 服务器，并且服务器接收到客户端的请求时，Node.js 将会自动创建这个 Response 对象，并将它作为第二个参数传递给我们定义的请求处理函数。

下面是关于 `Response` 对象的一些说明和简单使用例子：

### 创建一个 HTTP 服务器

```javascript
const http = require("http");

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // req 是 IncomingMessage 实例，代表客户端的请求
  // res 是 ServerResponse 实例，用于构建服务器的响应

  // 设置 HTTP 头信息：状态码 200、内容类型为 text/plain
  res.writeHead(200, { "Content-Type": "text/plain" });

  // 发送响应体 "Hello, World!" 并结束响应
  res.end("Hello, World!");
});

// 服务器监听 3000 端口
server.listen(3000, () => {
  console.log("Server running at http://127.0.0.1:3000/");
});
```

这段代码创建了一个简单的 HTTP 服务器，它监听本地的 3000 端口。当一个请求到达时，它发送一个文本响应 "Hello, World!" 到客户端。

### Response 对象的常用方法：

- `res.writeHead(statusCode[, statusMessage][, headers])`: 写入 HTTP 响应头。`statusCode` 是状态码（如 200，404 等），`statusMessage` 是可选的状态消息，默认情况下状态码对应的默认文本会被自动填充，`headers` 是一个对象，包含了要发送的 HTTP 响应头。

- `res.end([data][, encoding][, callback])`: 结束响应过程。如果指定了`data`，则在结束响应之前发送数据；`encoding` 是编码方式；`callback` 是当响应流结束时的回调函数。

- `res.write(data[, encoding][, callback])`: 向响应体写入数据。使用多次 `write` 可以生成更复杂的响应内容。通常在调用 `end` 方法之前调用。

请注意，Node.js v21.7.1 是指特定版本的 Node.js，在其他版本中，API 可能有所不同，但基本原理是类似的。以上就是关于 Node.js 中 `Response` 对象的介绍和使用示例。通过这个对象，你可以控制返回给客户端的响应内容和格式。

## [Request](https://nodejs.org/docs/latest/api/globals.html#request)

Node.js 是一个基于 Chrome V8 JavaScript 引擎的 JavaScript 运行环境，它让开发者可以使用 JavaScript 来编写服务器端的代码。Node.js 使用非阻塞、事件驱动的模型，使其轻量且高效，特别适合处理数据密集型或需要实时功能的应用程序。

在 Node.js 中，`Request` 不是一个直接提供的全局对象或函数。这里可能有些误解。通常在 Node.js 的文档中，`request` 指的是 HTTP 请求的概念，这可能出现在某些模块中，比如 `http` 模块，它允许你创建服务器或进行 HTTP 客户端请求。

下面我会给你介绍一下 Node.js 中和 HTTP 请求相关的基本概念，并给出几个例子：

### HTTP 服务器端示例

当你在 Node.js 创建一个 HTTP 服务器时，你会用到 `http.createServer()` 方法，该方法会回调一个函数，这个函数有两个参数：`req`（request 请求）和 `res`（response 响应）。

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("Hello World!"); // 向客户端发送响应
    res.end(); // 结束响应
  }
});

server.listen(3000); // 监听3000端口
console.log("Server listening on port 3000");
```

在上述示例中，我们创建了一个 HTTP 服务器，当用户访问根路径 `('/')`时，服务器会返回 "Hello World!"。

### HTTP 客户端示例

如果你想在 Node.js 中创建一个 HTTP 客户端来发送请求到其他服务器，你可以使用 `http.request()` 方法。

```javascript
const http = require("http");

const options = {
  hostname: "www.example.com",
  port: 80,
  path: "/upload",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  res.on("data", (d) => {
    process.stdout.write(d);
  });
});

req.on("error", (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

// 写入数据到请求主体
req.write(JSON.stringify({ key: "value" }));
req.end();
```

在上面的示例中，我们使用 `http.request()` 发送了一个 POST 请求到 `www.example.com` 的 `/upload` 路径。我们还设置了请求头 `Content-Type` 为 `application/json`，并将 JSON 字符串作为请求正文发送。

### 注意事项

需要注意的是，随着 Node.js 版本的更新，API 可能会有变化。例如，在某些新版本中，`http/2` 或其他模块可能会提供更先进的机制来处理 HTTP 请求和响应。因此，建议查看具体的 Node.js 版本文档以获取最准确的信息。

以上就是关于 Node.js 中 HTTP 请求 (`request`) 的基础知识和简单应用。希望这对你有所帮助！

## [setImmediate(callback[, ...args])](https://nodejs.org/docs/latest/api/globals.html#setimmediatecallback-args)

Node.js 中的 `setImmediate(callback[, ...args])` 是一个非常有用的方法，它用于安排在当前事件循环周期完成后尽快执行一个脚本。简单来说，`setImmediate` 函数允许你告诉 Node.js：“嘿，一旦你完成了现有的工作，立即运行这个函数。”

### 基本用法

- **callback**: 这是当计时器到期时要执行的函数。
- **...args**（可选）: 这些是传递给回调函数的额外参数。

语法如下：

```javascript
setImmediate(callback[, ...args])
```

### 实际运用例子

#### 1. 基础示例

假设你正在编写一个程序，需要先完成某些同步任务，然后再异步执行其他操作。这里就可以使用 `setImmediate`。

```javascript
console.log("开始执行");

setImmediate(() => {
  console.log("异步操作");
});

console.log("结束执行");
```

输出将会是：

```
开始执行
结束执行
异步操作
```

这里，尽管 `setImmediate` 被放置在中间，其回调函数的执行实际上是在所有同步任务完成之后。

#### 2. 结合其他异步操作

假设你在处理文件，需要在读取完文件之后立即处理数据，这时 `setImmediate` 就非常有用。

```javascript
const fs = require("fs");

fs.readFile("example.txt", (err, data) => {
  if (err) throw err;

  console.log("文件读取完成");

  setImmediate(() => {
    console.log("处理文件数据");
  });
});

console.log("开始文件操作");
```

输出顺序将是：“开始文件操作” -> “文件读取完成” -> “处理文件数据”。通过 `setImmediate`，我们确保文件读取和初步处理完毕后，再处理接下来的任务。

#### 3. 使用参数

你可以向 `setImmediate` 的回调函数传递参数，这在处理具体的数据时特别有用。

```javascript
function processUserData(id, callback) {
  // 模拟数据库操作
  setImmediate(callback, null, { id: id, name: "John Doe" });
}

processUserData(123, (err, data) => {
  if (err) throw err;
  console.log(data); // 输出： { id: 123, name: 'John Doe' }
});
```

在这个例子中，`setImmediate` 用来模拟数据库操作的异步回调，其中 `null` 和用户数据作为参数传给回调函数。

### 总结

`setImmediate()` 为你提供了一种方式来执行异步代码，这在你需要确保当前执行栈中的所有同步和异步代码都完成后非常有用。无论是在处理 I/O、网络请求还是仅仅希望延迟执行代码，`setImmediate()` 都能派上用场。通过实际示例，我们看到了如何在不同情景下利用该方法优化我们的代码执行流程。

## [setInterval(callback, delay[, ...args])](https://nodejs.org/docs/latest/api/globals.html#setintervalcallback-delay-args)

当你开始学习编程，尤其是 JavaScript 和 Node.js 时，你会遇到很多用于执行定时任务的函数。`setInterval()`就是这样一个非常实用的函数。在 Node.js（包括 v21.7.1 版本）中，`setInterval()`的基本作用是按照指定的时间间隔重复执行某个函数。

### 基础概念

- **callback**: 这是你希望周期性执行的函数。
- **delay**: 定时器应该等待多少毫秒（一秒等于 1000 毫秒），在每次执行回调函数之间。
- **...args**: （可选参数）这些是传递给回调函数的额外参数。

### 如何使用 `setInterval()`

基本语法：

```javascript
const intervalID = setInterval(callback, delay, ...args);
```

- `intervalID` 是一个唯一的标识符，你可以用它来停止这个定时器。

### 实际运用例子

#### 例子 1: 简单的倒数计时器

假设你正在制作一个简单的倒数计时器，每隔一秒钟减少计数，直至 0。

```javascript
let countdown = 10;

function timer() {
    console.log(countdown);
    countdown--;
    if (countdown `<` 0) {
        clearInterval(intervalID); // 停止定时器
        console.log('倒数完毕！');
    }
}

// 设置定时器，每1000毫秒（即1秒）调用一次timer函数
const intervalID = setInterval(timer, 1000);
```

在这个例子中，我们每隔一秒打印出倒数计时器的值，直到它减到 0。

#### 例子 2: 更新网站内容

想象你正在开发一个需要定期从服务器获取最新信息并更新网页内容的网站。为了模拟这种情况，我们可以使用`setInterval()`定期执行一个函数来获取数据（在这里，我们用模拟数据代替实际的网络请求）。

```javascript
function fetchLatestNews() {
  // 这里假装我们用某种方式获取了最新消息
  console.log("获取并显示最新新闻");
}

// 每5秒刷新一次新闻
setInterval(fetchLatestNews, 5000);
```

此示例展示了如何使用`setInterval()`来模仿定期从服务器获取数据并更新内容的行为。

#### 例子 3: 动态更改网页背景色

如果你想让你的网页背景色每隔几秒就自动改变，你也可以使用`setInterval()`。

```javascript
function changeBackgroundColor() {
  const body = document.body;
  // 生成随机颜色
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  body.style.backgroundColor = color;
}

// 每2秒改变一次背景色
setInterval(changeBackgroundColor, 2000);
```

该代码段将网页的背景色每两秒更改一次，展示了`setInterval()`在用户界面动态效果中的应用。

### 停止 `setInterval()`

要停止`setInterval()`定时器，你需要使用`clearInterval()`函数，并传入由`setInterval()`返回的标识符。

```javascript
clearInterval(intervalID);
```

这样，无论你的定时器是用来更新数据、动态改变 UI 还是别的什么，当它不再需要时，你都可以轻松地停止它。

通过这些例子，你应该能够明白`setInterval()`在 Node.js 中的基本用法及其在实际开发中的应用。

## [setTimeout(callback, delay[, ...args])](https://nodejs.org/docs/latest/api/globals.html#settimeoutcallback-delay-args)

`setTimeout(callback, delay[, ...args])` 在 Node.js 中是一个非常基础的函数，用来在指定的时间之后执行一个函数。这个功能在编程中经常用于延迟任务、定时任务或者在不阻塞程序其他部分的情况下执行代码。

### 参数解释

- `callback`: 这是你希望在等待了特定的`delay`毫秒数后执行的函数。
- `delay`: 表示等待多长时间以毫秒为单位的数字。（1000 毫秒=1 秒）
- `[...args]`: 这是一个可选参数，可以传递任意数量的参数给`callback`函数。

### 返回值

当你调用`setTimeout`时，它会返回一个`timeout`对象，你可以用这个对象来取消延时（使用`clearTimeout()`方法）。

### 实际运用例子

#### 例子 1：基本用法

假设你正在写一个程序，需要在 2 秒后打印出"Hello, world!"到控制台。你可以像这样使用`setTimeout`：

```javascript
function greet() {
  console.log("Hello, world!");
}

// 设置timeout以在2000毫秒（即2秒）后调用greet函数
setTimeout(greet, 2000);
```

#### 例子 2：带有额外参数的用法

现在，如果你想要传递一些参数给你的`greet`函数呢？比如你想要定制化打招呼信息，可以这么做：

```javascript
function greet(name) {
  console.log("Hello, " + name + "!");
}

// 使用setTimeout并在2秒后传递'Node.js'作为参数给greet函数
setTimeout(greet, 2000, "Node.js");
```

在 2 秒后，这段代码将打印出"Hello, Node.js!"。

#### 例子 3：取消延时

在某些情况下，你可能想要取消尚未执行的延迟函数。你可以保存`setTimeout`的返回值，并使用`clearTimeout`来取消它。

```javascript
function greet() {
  console.log("Hello, world!");
}

// 设置一个延时函数
let timeoutId = setTimeout(greet, 5000);

// 决定在2秒后取消这个延时函数
setTimeout(function () {
  clearTimeout(timeoutId);
  console.log("Timeout is cleared!");
}, 2000);
```

在上面的代码中，"Hello, world!"永远不会被打印，因为在 2 秒之后，我们取消了原来设置为 5 秒后执行的`greet`函数。

这些例子演示了`setTimeout`在实际应用中的一些基本用法。它非常有用，在各种场景下都能见到它的身影，比如在处理异步操作时，避免立即执行某些代码片段，或者是在创建动画、轮询服务器等方面。

## [structuredClone(value[, options])](https://nodejs.org/docs/latest/api/globals.html#structuredclonevalue-options)

Node.js 里的`structuredClone(value[, options])`函数是一个用于深拷贝 JavaScript 对象的全局函数。深拷贝意味着它会创建一个新对象，并且复制原始对象中所有层级的属性到新对象中，包括那些嵌套的对象。

在 JavaScript 中，当你将一个对象赋值给另一个变量时，实际上你只是在复制这个对象的引用，而非对象本身。这意味着如果你修改了新的变量所引用的对象，原始的对象也会被修改，因为它们指向了同一个内存地址。使用`structuredClone`可以避免这种情况，因为它会创建一个完整的副本。

简单来说，`structuredClone`的作用就是创建一个完全独立的复制品，改变复制品不会影响原对象。

下面是一个如何使用`structuredClone`的例子：

```javascript
// 假设我们有一个包含多层嵌套对象的对象
const original = {
  name: "Original",
  details: {
    created: new Date(),
    tags: ["node", "javascript"],
  },
};

// 使用 structuredClone 方法来创建这个对象的深拷贝
const cloned = structuredClone(original);

// 现在我们修改 cloned 对象的属性
cloned.name = "Cloned";
cloned.details.tags.push("clone");

// 打印 original 对象，可以看到它并没有被修改
console.log(original);
// 输出:
// {
//   name: 'Original',
//   details: {
//     created: [Date object representing creation time],
//     tags: ['node', 'javascript'] // 注意这里没有 'clone'
//   }
// }

// 打印 cloned 对象，可以看到它与 original 不同
console.log(cloned);
// 输出:
// {
//   name: 'Cloned',
//   details: {
//     created: [Date object representing creation time],
//     tags: ['node', 'javascript', 'clone']
//   }
// }
```

通过上面的例子，你可以看到对`cloned`对象进行的更改没有影响到`original`对象。这表明`structuredClone`成功地创建了一个深拷贝。

此外，`structuredClone`还支持一些选项，比如你可以设置转换特定类型的对象。例如，你可以传递一个`transfer`选项来转移`ArrayBuffer`的所有权（这是高级功能，通常用于处理性能敏感的操作，比如在 Web Workers 之间传输数据）。

总结一下，`structuredClone`是一个非常有用的函数，尤其是当你需要确保复制的对象与原始对象相互独立时，这在处理复杂的数据结构或者需要隔离修改的场景下极为重要。

## [SubtleCrypto](https://nodejs.org/docs/latest/api/globals.html#subtlecrypto)

Node.js 的`SubtleCrypto`模块提供了一套用于执行低级加密操作的 API。这些操作包括哈希、签名、验证、加密和解密等功能，主要用于处理 Web 应用程序中的安全性需求。在 Node.js v21.7.1 中，`SubtleCrypto`作为全局范围内的一个对象可用，即无需通过 require 或 import 就可以直接使用。

### SubtleCrypto 的关键特性：

- **安全性**：设计用于处理安全敏感的操作，如密码学函数。
- **异步 API**：大多数方法返回`Promise`，这意味着它们不会阻塞事件循环，使得它适合于 I/O 密集型的 Node.js 应用。
- **标准化**：基于 Web 标准，确保了跨平台兼容性和前瞻性。

### 实际运用的例子

让我们来看几个`SubtleCrypto`的具体应用实例。

#### 1. 哈希生成(Hashing)

假设你想要为一个密码或任意数据生成一个哈希值，以便安全存储或验证。

```javascript
async function generateHash(data) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // 转换为字节数组
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex; // 返回十六进制格式的哈希值
}

generateHash("hello world").then(console.log); // 打印出"hello world"的SHA-256哈希值
```

#### 2. 数据加密和解密

如果你需要安全地传输信息，比如发送一个加密的消息给某人，你可以使用`SubtleCrypto`进行加密和解密。

首先，你需要创建加密密钥：

```javascript
async function generateKey() {
  return window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}
```

然后，使用该密钥加密数据：

```javascript
async function encryptData(secretData, key) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 初始化向量
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(secretData);

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData
  );

  return { encryptedData, iv };
}
```

最后，使用同一个密钥和 IV（初始化向量）来解密数据：

```javascript
async function decryptData(encryptedData, key, iv) {
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedData
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}
```

### 小结

`SubtleCrypto`提供了强大而灵活的工具，以支持各种安全性需求，从简单的数据哈希到复杂的加密/解密操作。使用这些工具时，重要的是要理解它们的工作原理以及如何正确安全地实现相关功能，尤其是在处理敏感信息时。

## [DOMException](https://nodejs.org/docs/latest/api/globals.html#domexception)

Node.js 是一个在服务器端运行 JavaScript 的环境，允许你构建快速、可扩展的网络应用。Node.js v21.7.1 中提及的`DOMException`并不是 Node.js 独有的概念，而是源自于浏览器环境下的 Web APIs。在 Node.js 中引入`DOMException`意味着 Node.js 希望在处理类似 Web 的场景时提供更一致的开发体验。

### 什么是 DOMException？

`DOMException`本来是 Web API 的一部分，用于报告在处理文档对象模型（DOM）时遇到的错误和异常情况。在浏览器中，当操作 DOM（即网页上的各种元素）时，如果出现问题（如尝试使用不存在的属性或方法），浏览器会抛出`DOMException`。

### 为什么 Node.js 要包含 DOMException？

在 Node.js 中包含`DOMException`主要是为了支持那些同时在服务器端和浏览器端工作，且需要处理或抛出与 DOM 操作相关异常的代码库。这样可以使得在 Node.js 环境中运行的代码在处理某些特定类型的错误时能够更加符合 Web 标准，提高代码的可移植性和一致性。

### 实际应用例子

1. **服务器端渲染（SSR）**：

   - 当你在使用 React、Vue 或 Angular 这类前端框架进行服务器端渲染时，有时需要操作虚拟 DOM。若在这个过程中遇到问题，利用`DOMException`可以创建与客户端浏览器相似的错误处理体验。

2. **使用 JSDOM 等库**：

   - JSDOM 是一个在 Node.js 中模拟 Web 浏览器环境的库。当你使用 JSDOM 来运行原本设计运行在 Web 浏览器中的 JavaScript 代码时，可能会遇到需要抛出或处理`DOMException`的情况。例如，如果你试图通过 JSDOM 模拟的 DOM 元素执行无效操作，抛出`DOMException`可以清晰地指示错误类型。

3. **Web API 的服务器端实现**：
   - 如果你正在 Node.js 中实现或模拟一个 Web API，那么在适当的情况下使用`DOMException`可以使错误处理更加标准化。比如，当 API 用户试图访问一个未定义的属性或调用未实现的方法时，抛出`DOMException`可以让错误信息更直接、更易于理解。

### 总结

虽然 Node.js 主要关注于服务器端编程，引入`DOMException`这样的概念有助于处理跨环境（即服务器和客户端）编码时的错误处理一致性。这对于需要大量与 DOM 操作或浏览器 API 交互的应用开发（如 SSR、使用 JSDOM 等场景）尤其有用。

## [TextDecoder](https://nodejs.org/docs/latest/api/globals.html#textdecoder)

Node.js 中的 `TextDecoder` 是用于将编码的文本数据转换成字符串的工具。这是一个非常有用的功能，尤其是在处理网络通信或文件读取时，因为这些操作往往会涉及到不同的字符编码格式。

### 为什么需要 `TextDecoder`？

在计算机中，所有的信息最终都是以二进制的形式存储的。但是，对于文本信息来说，存在多种不同的编码方式来表示这些二进制数据，比如 UTF-8、UTF-16、ISO-8859-1 等。不同的系统或程序可能使用不同的编码方式，所以在进行数据交换时，能够识别和转换这些编码就显得尤为重要。

### 如何使用 `TextDecoder`？

`TextDecoder` 是 Node.js 的全局对象，你不需要安装或引入任何额外的模块来使用它。以下是一个简单的示例，演示如何使用 `TextDecoder` 将 UTF-8 编码的文本转换成字符串：

```javascript
// 假设我们有一串 UTF-8 编码的二进制数据
const encodedData = new Uint8Array([
  72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33,
]);

// 创建一个 TextDecoder 实例，默认情况下它是针对 UTF-8 编码的
const decoder = new TextDecoder();

// 使用 decode 方法将编码的数据转换成字符串
const decodedString = decoder.decode(encodedData);

console.log(decodedString); // 输出: Hello World!
```

### 实际应用场景

1. **网络通信：** 当你通过 AJAX 或 WebSocket 接收服务器发送的数据时，这些数据通常是以字节流的形式存在的。如果服务器端发送的是文本数据，那么你可能需要使用 `TextDecoder` 来将这些字节流转换成可读的字符串。

2. **文件处理：** 在 Node.js 中读取文件时，尤其是文本文件，文件内容通常被读取为 Buffer（一个字节的数组）。如果你知道文件使用的字符编码，可以利用 `TextDecoder` 将这些字节转换成字符串，便于后续处理。

3. **数据解析：** 在某些情况下，比如从数据库或第三方服务获取的数据可能是经过编码的。使用 `TextDecoder` 可以帮助你将这些数据转换成人类可读的格式，从而更容易地进行数据分析和处理。

总之，`TextDecoder` 在处理现代 Web 和 Node.js 应用中的文本数据时，扮演着一个非常关键的角色。通过正确地使用它，你可以轻松地跨越不同编码格式带来的障碍，让数据处理变得更加高效和准确。

## [Class: TextDecoderStream](https://nodejs.org/docs/latest/api/globals.html#class-textdecoderstream)

当然，我会尽量用简单的语言来解释 Node.js 中的 `TextDecoderStream` 类给你。

在 Node.js v21.7.1 及以后的版本中，`TextDecoderStream` 是 `globals` 模块提供的一个类，它主要用于将流式的二进制数据（比如来自文件、网络请求等）转换成文本形式。它是 `TextDecoder` 的一个扩展，专为处理流数据而设计。

### 理解 `TextDecoderStream`

让我们先从基础说起。通常在计算机中，文本被存储为二进制数据。这些二进制数据根据不同的编码方式（如 UTF-8, UTF-16 等）被解读成人类可以理解的文本。`TextDecoderStream` 就是用来做这样的事情，但特别针对“流”数据。所谓“流”数据，就是数据一小块一小块地连续传输，而非一次性全部发送。

### 实际运用例子

#### 1. 处理网络请求的数据流

想象你正在创建一个 Node.js 应用，需要从某个 API 获取数据。这些数据以流的形式返回，使用 `TextDecoderStream` 可以轻松将这些二进制流数据解码成文本。

```javascript
const { TextDecoderStream } = require("node:stream/web");
const https = require("https");

https.get("http://example.com/data", (res) => {
  if (res.statusCode === 200) {
    res.pipe(new TextDecoderStream("utf-8")).on("data", (chunk) => {
      console.log("Decoded chunk:", chunk);
    });
  } else {
    console.error(`Request failed with status code: ${res.statusCode}`);
  }
});
```

在这个例子中，你通过 HTTP GET 请求获取数据，然后通过 `TextDecoderStream` 将其转换成 UTF-8 编码的文本。

#### 2. 读取文件数据流

如果你有一个大型的文本文件，希望逐步读取并处理它的内容，`TextDecoderStream` 也很适合这个场景。

```javascript
const fs = require("fs");
const { TextDecoderStream } = require("node:stream/web");

const readableStream = fs.createReadStream("large-file.txt");
const textStream = readableStream.pipe(new TextDecoderStream("utf-8"));

textStream.on("data", (chunk) => {
  console.log("New text chunk:", chunk);
});

textStream.on("end", () => {
  console.log("Finished reading file.");
});
```

在上面的代码中，我们使用 `fs.createReadStream` 创建了一个可读流来读取一个大文件。然后，我们使用管道 `pipe()` 方法将这个可读流连接到 `TextDecoderStream` 上，这样可以逐块地将读取到的二进制数据转换为 UTF-8 编码的文本。

### 总结

`TextDecoderStream` 提供了一种高效且简便的方法来处理二进制流数据，并将其转换为文本。无论是处理网络响应、文件读取还是其他类型的流数据，使用 `TextDecoderStream` 都能让你的工作变得更加简单。

## [TextEncoder](https://nodejs.org/docs/latest/api/globals.html#textencoder)

当然，让我帮你了解一下 Node.js 中的`TextEncoder`。

首先要知道，`TextEncoder`是一个全局的工具类（Utility class），它用来将 JavaScript 字符串（使用 UTF-16 编码）转换成字节流（byte stream），通常是为了以 UTF-8 格式存储或传输数据。简单来说，就是把你能读懂的文本转换成计算机底层可以处理的数字格式。

在 Node.js 中，`TextEncoder`默认支持 UTF-8 编码。UTF-8 是一种非常流行的字符编码方式，能够编码世界上几乎所有的字符，并且是 Internet 上最常用的编码方式。

### 实际运用例子

#### 例子 1：将字符串转换为 Uint8Array

```javascript
const textEncoder = new TextEncoder();
const text = "Hello, World!";
const encoded = textEncoder.encode(text);
console.log(encoded); // 输出 Uint8Array
```

在这个例子中，我们创建了一个`TextEncoder`实例，然后调用`encode`方法来转换字符串`'Hello, World!'`。最终，我们得到了一个`Uint8Array`类型的对象，里面包含了原字符串按照 UTF-8 编码后的字节数据。

#### 例子 2：与 Node.js Buffer 结合使用

```javascript
const textEncoder = new TextEncoder();
const text = "Hello, Node.js!";
const encoded = textEncoder.encode(text);

// 转换 Uint8Array 到 Buffer
const buffer = Buffer.from(encoded.buffer);
console.log(buffer); // 输出 Buffer
```

在这个例子中，我们又转换了一个字符串，不过这次我们使用`Buffer.from()`方法将`Uint8Array`转换成了 Node.js 中的`Buffer`。`Buffer`是 Node.js 专门用于处理二进制数据的类。

#### 例子 3：写入文件

```javascript
const fs = require("fs");
const textEncoder = new TextEncoder();
const text = "Hello, file system!";
const encoded = textEncoder.encode(text);

// 将编码后的内容写入文件
fs.writeFile("output.txt", encoded, (err) => {
  if (err) throw err;
  console.log("The file has been saved!");
});
```

在这个例子中，我们使用了 Node.js 的文件系统模块（`fs`）。我们先编码一个字符串，然后通过`fs.writeFile`方法将编码后的数据写入到`output.txt`文件中。如果没有错误发生，控制台会打印出“文件已经被保存”的消息。

### 总结

总的来说，`TextEncoder`允许我们在 Node.js 环境中轻松地将字符串（如用户输入、文件内容等）转换为字节数据，这样的转换对于网络通信、文件操作等场景非常有用。这些操作背后的基本思想是确保数据可以在不同系统间正确无误地传递和存储。

## [Class: TextEncoderStream](https://nodejs.org/docs/latest/api/globals.html#class-textencoderstream)

非常好，让我们深入了解 Node.js 中的`TextEncoderStream`类。

首先，从最基础的概念开始，`TextEncoderStream`是一个在 Node.js 环境下可用的全局类，它主要用于将文本（即字符串）转换为流式的二进制格式。这个类实际上是 Web 平台 API 的一部分，特别是与 Streams API 紧密结合使用，但它也被 Node.js 采纳以提升其对处理文本和二进制数据的能力。

### 关键点理解：

- **文本到二进制的转换**：`TextEncoderStream`允许你把文本（通常是 UTF-8 格式的字符串）转换成二进制数据流（Uint8Array 格式）。这在处理需要大量文本数据转化为可以在网络上发送或存储为文件的二进制数据时非常有用。
- **流式处理**：与单次转换不同，`TextEncoderStream`支持流式处理，意味着它可以逐步处理大量数据，而不是一次性把所有内容加载到内存中。这对于处理大文件或实时数据传输尤其重要。

### 实际应用例子：

1. **文件编码**：假设你正在开发一个 Node.js 应用，需要读取一个文本文件（例如.log 日志文件），并把它转换成二进制格式来进行压缩或加密后存储。使用`TextEncoderStream`，你可以轻松地实现这个文本到二进制的转换过程。

2. **网络传输**：如果你的应用需要通过网络发送文本数据（比如 JSON），你可能想要先将文本数据转换为二进制格式来优化传输效率。这里，`TextEncoderStream`可以作为这个转换过程的一部分，帮助减少发送数据时所需的带宽。

3. **数据处理管道**：考虑一个场景，其中你的 Node.js 应用需要从一个源（比如 API 或数据库）获取文本，经过转换（加密、压缩等）后再发送给另一个目的地。`TextEncoderStream`可以被插入到这个数据处理链中，负责将文本转换为二进制流，以便后续的处理流程可以更高效地进行。

### 示例代码段：

让我们看一个简单的代码示例，展示如何使用`TextEncoderStream`：

```javascript
const { pipeline } = require("stream");
const { createReadStream, createWriteStream } = require("fs");
const { TextEncoderStream } = require("util");

// 创建一个从文本文件读取的流
const readStream = createReadStream("example.txt");

// 创建一个TextEncoderStream，将文本转换为二进制数据流
const encoder = new TextEncoderStream();

// 创建一个写入流，输出到另一个文件
const writeStream = createWriteStream("output.bin");

// 使用pipeline将这些流连接起来
pipeline(readStream, encoder, writeStream, (err) => {
  if (err) {
    console.error("Pipeline failed", err);
  } else {
    console.log("Pipeline succeeded");
  }
});
```

此示例中，我们创建了一个 pipeline，其中包含从一个文本文件读取、将读取的文本转换为二进制格式，然后将转换后的数据写入另一个文件的过程。这只是`TextEncoderStream`潜力的一个小窥，实际上它可以应用于更多复杂且强大的数据处理场景中。

## [Class: TransformStream](https://nodejs.org/docs/latest/api/globals.html#class-transformstream)

Node.js 的`TransformStream`类是一个非常强大的工具，它允许你在数据被读取和写入之间进行转换。这意味着数据可以在被最终处理前以某种方式被修改或者变化。在 Node.js 中，流（Streams）是处理读取和写入数据的一种高效方式，特别是当处理大量数据或者来自外部资源（比如文件或网络请求）的数据时。`TransformStream`则进一步扩展了这些能力。

### 理解 TransformStream

简而言之，`TransformStream`是一种特殊类型的流，它表现为同时可读也可写的流，并且在输入与输出之间进行某种形式的转换或操作。它继承自 Node.js 中的`Duplex`流，但添加了转换功能。你可以将它想象成一个管道段，在这个管道段内部，流动的数据会被以某种方式加工或修改。

### TransformStream 的用法

为了使用`TransformStream`，你通常需要通过扩展`TransformStream`类来创建一个自定义的转换流，实现你自己的`transform`方法。这个方法会定义如何处理输入的数据并生成输出数据。

```javascript
const { TransformStream } = require("node:stream/web"); // 注意：从Node.js 16.5.0开始支持

class MyTransformStream extends TransformStream {
  constructor() {
    super({
      transform(chunk, controller) {
        // 这里定义如何处理每个数据块（chunk）
        // 例如，将所有文本转换为大写
        const transformedChunk = chunk.toUpperCase();
        controller.enqueue(transformedChunk); // 将转换后的数据块放入队列等待下游处理
      },
    });
  }
}
```

### 实际应用示例

#### 示例 1：文件内容转换

假设你有一个文本文件，你想将其中的所有文字转换为大写，然后保存到另一个文件中。

```javascript
const fs = require("fs");
const { pipeline } = require("node:stream");
const { TransformStream } = require("node:stream/web");

// 创建一个转换流实例，用于将文本内容转换为大写
const uppercaseTransform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toString().toUpperCase());
  },
});

// 使用pipeline方法来简化流的连接
pipeline(
  fs.createReadStream("input.txt"), // 从input.txt文件中读取内容
  uppercaseTransform, // 通过我们的转换流将内容转换为大写
  fs.createWriteStream("output.txt"), // 将转换后的内容写入output.txt文件中
  (err) => {
    if (err) {
      console.error("Pipeline failed.", err);
    } else {
      console.log("Pipeline succeeded.");
    }
  }
);
```

#### 示例 2：实时数据压缩

如果你正在构建一个需要接收数据，然后即时压缩并传输该数据的应用程序，你可以使用`zlib`模块提供的压缩功能结合`TransformStream`。

```javascript
const { createGzip } = require("zlib");
const { pipeline } = require("node:stream");
const { TransformStream } = require("node:stream/web");
const fs = require("fs");

// 创建一个gzip压缩流
const gzip = createGzip();

// 假设我们要压缩的数据来自一个文件，并将其写入另一个.gz文件
pipeline(
  fs.createReadStream("input.txt"),
  gzip, // 将数据通过gzip流进行压缩
  fs.createWriteStream("input.txt.gz"),
  (err) => {
    if (err) {
      console.error("Pipeline failed", err);
    } else {
      console.log("Pipeline succeeded");
    }
  }
);
```

在这两个例子中，我们看到`TransformStream`能够在数据的读取、处理和输出过程中起到桥梁的作用，无论是对数据进行格式转换还是压缩都展示了其强大的灵活性。此外，通过使用 Node.js 的流，你可以更高效地处理数据，特别是在处理大型文件或数据流时，因为它们不需要一次性加载整个数据到内存中。

## [Class: TransformStreamDefaultController](https://nodejs.org/docs/latest/api/globals.html#class-transformstreamdefaultcontroller)

Node.js 中的`TransformStreamDefaultController`是用于处理流数据（stream）的一个工具，它允许你在数据从源头到目的地传输的过程中对数据进行修改或转换。这在处理大量数据时特别有用，比如读取文件、网络通信等场景。要理解`TransformStreamDefaultController`，首先需要简单了解几个基本概念：

1. **流（Stream）**：在 Node.js 中，流是一系列数据元素，这些数据元素可以逐个地被处理和传输。流可以是可读的、可写的，或者即可读又可写。

2. **Transform Stream**：转换流（Transform Stream）是一种特殊类型的双工流（Duplex Stream），它既是可读的也是可写的。其特点是可以在读取输入数据和生成输出数据之间执行某种转换或操作。

现在，我们来深入了解`TransformStreamDefaultController`的角色和功能。在 Node.js 的 Streams API 中，`TransformStreamDefaultController`是一个接口，它提供了控制转换流行为的方法，比如向流中添加数据、终止流或报告错误等。当你创建自定义的转换流时，Node.js 会在背后为你创建一个`TransformStreamDefaultController`实例，你可以通过这个实例来控制流的行为。

### 实际运用的例子

假设你正在开发一个节点应用程序，需要从一个文件中读取数据，然后对数据进行压缩或加密，最后将处理后的数据写入另一个文件或发送到客户端。

1. **日志文件转换**：如果你的应用生成了大量的日志文件，并且你希望实时监视并分析这些日志，但只关心其中的警告和错误信息。你可以使用转换流来实现这一点，通过设置一个过滤条件，仅把包含特定关键词（如"ERROR"或"WARNING"）的日志行输出到处理流中。

```javascript
const { Transform } = require("stream");

// 创建一个转换流，仅保留含有“ERROR”或“WARNING”的日志行
const filterLogs = new Transform({
  transform(chunk, encoding, callback) {
    const line = chunk.toString();
    if (line.includes("ERROR") || line.includes("WARNING")) {
      this.push(line);
    }
    callback();
  },
});

// 可以把这个转换流连接到日志文件的读取流和输出流之间
```

2. **数据加密**：在将数据写入磁盘之前，可能想要对其进行加密。你可以创建一个转换流，它读取原始数据，使用加密算法处理数据，然后输出加密后的数据。

```javascript
const { Transform } = require("crypto");

// 假设有一个加密函数encryptData
const encryptStream = new Transform({
  transform(chunk, encoding, callback) {
    const encryptedData = encryptData(chunk.toString());
    this.push(encryptedData);
    callback();
  },
});

// 然后，你可以将这个流插入到数据的写入过程中
```

理解`TransformStreamDefaultController`及其在 Node.js 中的应用，能够帮助你更好地利用 Node.js 处理复杂的数据流场景。通过自定义转换流，你可以高效地对数据流进行读取、转换和写入操作，满足各种复杂的业务需求。

## [URL](https://nodejs.org/docs/latest/api/globals.html#url)

Node.js 中的 URL 模块提供了一系列实用功能，用以处理和解析 URL。URL（统一资源定位符）是互联网上用于标识资源位置的地址。在 Node.js v21.7.1 文档中，关于 URL 的信息主要集中在全局 URL 类以及与之相关的几个重要组件上。下面我将通过一些通俗易懂的解释和实际例子来为你介绍这些内容。

### 全局 URL 类

在 Node.js 中，`URL` 类是一个全局变量，它使得不需要通过 `require('url')` 来导入即可使用。这个类提供了构造、解析和编码 URL 的 API。

#### 使用示例：

**创建和解析 URL：**

```javascript
const myURL = new URL("https://example.com/p/a/t/h?query=string#hash");

console.log(myURL.hostname); // 输出: example.com
console.log(myURL.pathname); // 输出: /p/a/t/h
console.log(myURL.search); // 输出: ?query=string
console.log(myURL.hash); // 输出: #hash
```

这里我们创建了一个新的 URL 对象，其包含了网站的协议 (`https`)、主机名 (`example.com`)、路径 (`/p/a/t/h`)、查询参数 (`?query=string`) 和片段 (`#hash`) 等部分。

**修改 URL 组件：**

```javascript
myURL.pathname = "/a/b/c";
myURL.search = "?type=test";

console.log(myURL.toString()); // 输出: https://example.com/a/b/c?type=test
```

此例展示了如何修改 URL 的路径和查询字符串，并且通过 `toString()` 方法输出最终的 URL 字符串。

### 实际应用场景

1. **开发 RESTful API**：在处理 HTTP 请求时，经常需要解析请求中的 URL 来获取资源路径、查询参数等信息，从而决定相应的业务逻辑。

2. **网页爬虫**：对于爬虫应用，经常需要从网页中提取链接并解析这些链接的各个组成部分，以方便后续的页面下载和数据提取。

3. **构建 Web 应用**：在构建 Web 应用时，通常需要根据不同的 URL 路径和查询参数渲染不同的页面内容或执行特定的后端逻辑。

4. **数据分析**：在进行日志分析或用户行为分析时，解析访问网站的 URL 可以帮助我们更好地理解用户的意图和偏好。

Node.js 中的 URL 模块是处理网络编程任务时不可或缺的工具之一，无论是简单的 URL 解析还是复杂的 Web 应用开发，都可能会用到它。希望以上的介绍和示例能帮助你更好地理解和学习 Node.js 中的 URL 处理机制。

## [URLSearchParams](https://nodejs.org/docs/latest/api/globals.html#urlsearchparams)

Node.js 中的 `URLSearchParams` 是一个全局可用的类，它提供了一种简单的方式来处理 URL 中的查询字符串。你可以将其视为一个工具箱，它让你轻松地读取、修改、检查或者删除 URL 查询字符串中的参数。

### 基本使用

当你在网页地址（URL）中看到 `?` 后面跟着的文本时，那些就是查询字符串。比如，在 URL `https://example.com/?name=John&age=30` 中，查询字符串是 `name=John&age=30`。这里有两个参数：`name` 的值是 `John`，`age` 的值是 `30`。

### 实例化

首先，你可以通过直接传递查询字符串来创建一个 `URLSearchParams` 的实例：

```javascript
const params = new URLSearchParams("name=John&age=30");
```

也可以通过传递一个对象来创建实例，对象的键值对会被转换成查询字符串中的参数：

```javascript
const params = new URLSearchParams({ name: "John", age: 30 });
```

### 读取参数

你可以使用 `.get()` 方法来获取特定参数的值：

```javascript
console.log(params.get("name")); // 输出: John
console.log(params.get("age")); // 输出: 30
```

### 添加或修改参数

如果你想添加新的参数，或者修改现有参数的值，可以使用 `.set()` 方法：

```javascript
params.set("job", "Developer");
params.set("name", "Jane");
```

现在，如果你输出查询字符串，会看到 `name` 已经被改成 `Jane`，并且新增了一个 `job` 参数：

```javascript
console.log(params.toString()); // 输出: name=Jane&age=30&job=Developer
```

### 删除参数

要删除一个参数，你可以使用 `.delete()` 方法：

```javascript
params.delete("age");
console.log(params.toString()); // 输出: name=Jane&job=Developer
```

### 遍历参数

如果你想遍历所有的参数，可以使用 `.forEach()` 方法：

```javascript
params.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});
/*
输出:
name: Jane
job: Developer
*/
```

### 实际应用例子

#### 管理网址参数

假设你正在开发一个网上商城的前端，并且用户可以通过查询字符串来过滤搜索结果，比如按照品牌和价格区间筛选。你可以使用 `URLSearchParams` 来轻松管理这些查询参数。

#### AJAX 请求

在发送 AJAX 请求时，经常需要将数据附加到查询字符串上。使用 `URLSearchParams`，你可以轻松构建这部分内容，并确保数据以正确的格式发送。

#### 页面重定向

如果你的网站或应用需要根据某些条件重定向用户，并在新的 URL 上附加数据（如状态消息），`URLSearchParams` 可以帮助你以编程方式构建这些 URL。

总之，`URLSearchParams` 是处理 Web 开发中常见任务的强大工具。通过提供清晰、简洁的 API，它让操作 URL 查询字符串变得简单直接。

## [WebAssembly](https://nodejs.org/docs/latest/api/globals.html#webassembly)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，让你可以在服务器端运行 JavaScript。WebAssembly（缩写为 Wasm）是一种低级语言，它允许在网络上高效地执行代码，并且可由多种编程语言编写然后编译成 WebAssembly。

在 Node.js 中使用 WebAssembly 有很多好处：

1. **性能**：WebAssembly 能够提供接近原生的执行速度，这对于计算密集型任务非常有利。
2. **跨平台**：编写一次，随处运行。通过 WebAssembly，你可以编写程序并将其编译成一种格式，该格式在所有支持 WebAssembly 的平台上都能运行。
3. **安全性**：WebAssembly 在一个沙盒环境中执行，为应用程序提供了一个安全的执行环境。

Node.js v21.7.1 对 WebAssembly 的支持意味着你可以在 Node.js 应用程序中加载和运行 WebAssembly 模块。下面是如何在 Node.js 中使用 WebAssembly 的步骤及例子：

### 步骤：

1. **编译到 WebAssembly**: 首先，你需要有一个编译为 `.wasm` 格式的模块。这通常意味着你会从 C/C++、Rust 等语言写代码，然后使用相应的工具链将其编译成 WebAssembly 模块。

2. **加载 WebAssembly 模块**: 在 Node.js 中，你可以使用 `WebAssembly.instantiate()` 或 `WebAssembly.instantiateStreaming()` 方法来加载 `.wasm` 文件。

### 实际例子：

假设你已经有了一个名为 `simple.wasm` 的 WebAssembly 模块文件，它包含了一个增加两个数的函数。

在 Node.js 中，你可以这样加载和使用它：

```javascript
const fs = require("fs").promises;
const path = require("path");

async function loadWasmFile(fileName) {
  const filePath = path.join(__dirname, fileName);
  const wasmBuffer = await fs.readFile(filePath);

  // 注意：实际的实例化方法可能因 Node.js 版本而异
  const { instance } = await WebAssembly.instantiate(wasmBuffer);

  return instance;
}

async function main() {
  try {
    const wasmInstance = await loadWasmFile("simple.wasm");

    // 假设 simple.wasm 导出了一个叫做 'add' 的函数
    const result = wasmInstance.exports.add(5, 3);

    console.log(`Result of add function: ${result}`); // 应该打印 8，如果 add 函数是将两个数相加的话
  } catch (error) {
    console.error("Error loading WebAssembly module:", error);
  }
}

main();
```

在这个例子中，我们使用 Node.js 的文件系统（`fs`）模块以异步方式读取 `.wasm` 文件。然后使用 `WebAssembly.instantiate()` 方法将二进制数据实例化为一个可以操作的 WebAssembly 实例。最后，我们调用此实例中导出的 `add` 函数，并打印结果。

请注意，WebAssembly 在不同的环境和应用场景中可能表现不同，具体使用方法也可能随 Node.js 版本的变化而变化。因此，建议检查 Node.js 的官方文档以获取相关 API 的最新信息和使用指南。

## [WebSocket](https://nodejs.org/docs/latest/api/globals.html#websocket)

Node.js 是一个基于 Chrome V8 JavaScript 引擎的 JavaScript 运行环境。WebSocket 则是一种网络通信协议，它提供了在单个 TCP 连接上进行全双工通讯的能力。在 Node.js v21.7.1 中，WebSocket 被认为是一个全局对象，这意味着你可以直接在 Node.js 代码中使用 WebSocket 而不需要额外安装模块。

WebSocket 使得客户端和服务器之间可以建立持久的连接，并且服务器可以实时地向客户端推送数据。这个机制非常适合需要实时性较高的应用程序，比如在线游戏、聊天应用、实时通知系统等。

当你使用 WebSocket 的时候，会遵循以下步骤：

1. 客户端发起一个特殊的 HTTP 请求到服务器，这个请求被称作 "WebSocket 握手" 请求。
2. 如果服务器支持 WebSocket，它会响应一个 "握手" 响应，然后连接就会从 HTTP 升级到 WebSocket 协议。
3. 一旦连接成功升级，客户端和服务器之间就可以通过此连接发送和接收消息了。

下面是一个简单的例子来说明如何在 Node.js 中使用 WebSocket：

**服务器端 (server.js):**

```javascript
const http = require("http");
const { WebSocketServer } = require("ws");

// 创建一个简单的 HTTP 服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World\n");
});

// 创建一个 WebSocket 服务器
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  console.log("一个客户端已连接");

  // 当接收到客户端发送的消息时触发
  ws.on("message", function incoming(message) {
    console.log("收到消息：", message);
  });

  // 向客户端发送消息
  ws.send("你好，客户端！");
});

// 监听端口
server.listen(8080, () => {
  console.log("服务器正在监听端口 8080");
});
```

**客户端 (client.html):**

```html
`<`!DOCTYPE html> `<`html> `<`body> `<`script> let ws = new
WebSocket("ws://localhost:8080"); // 当 WebSocket 连接打开时触发 ws.onopen =
function(event) { console.log("连接已打开"); // 发送消息给服务器
ws.send("你好，服务器！"); }; // 当 WebSocket 接收到消息时触发 ws.onmessage =
function(event) { console.log("收到服务器消息：", event.data); }; // 当
WebSocket 关闭时触发 ws.onclose = function(event) { console.log("连接已关闭");
}; `<`/script> `<`/body> `<`/html>
```

在上面的例子中：

- 我们创建了一个简单的 HTTP 服务器，并在该服务器上挂载了一个 WebSocket 服务器。
- 当 WebSocket 服务器接收到新的连接时，它会向客户端发送一条消息，并设置事件监听器来处理客户端发来的消息。
- 在客户端 HTML 中，我们创建了一个新的 WebSocket 实例并连接到我们的服务器。
- 客户端在连接打开后发送一条消息给服务器，同时准备接收从服务器发来的消息。

以上就是一个简单的 WebSocket 在 Node.js 中的使用示例。通过这个例子，你应该可以理解如何在 Node.js 中创建 WebSocket 服务端和客户端，并进行简单的通信。

## [Class: WritableStream](https://nodejs.org/docs/latest/api/globals.html#class-writablestream)

Node.js 中的 `WritableStream` 是一个抽象的概念，它代表一个目标，你可以向这个目标写入数据。在日常开发中，这个“目标”可能是文件、HTTP 响应或者是任何可以接收数据的系统组件。

### 理解 WritableStream

想象 `WritableStream` 就像一个水桶，你可以往里面倒水（写入数据）。但是，这个水桶不仅仅可以装水，它可以装任何东西（即任何类型的数据）。

### 核心特性

1. **异步写入：** Node.js 的 `WritableStream` 设计为异步的，这意味着你可以在不阻塞程序其他部分运行的情况下向其写入数据。
2. **背压管理：** 当你向流中写入数据的速度超过了它处理数据的速度时，`WritableStream` 能够通过内部机制来处理这种情况，确保数据不会丢失。
3. **多种数据源：** 你可以从多种数据源（如文件、缓冲区、其他流等）写入数据到 `WritableStream`。

### 实际运用例子

让我们通过几个简单的例子来更好地理解 `WritableStream` 的应用：

#### 例子 1: 写入文件

假设你想保存一些数据到文件中，你可以创建一个指向该文件的 `WritableStream`，然后将数据写入其中。

```javascript
const fs = require("fs");

// 创建一个指向 'example.txt' 的 WritableStream
const fileStream = fs.createWriteStream("example.txt");

// 向文件中写入数据
fileStream.write("Hello, World!");
fileStream.end(); // 完成写入
```

#### 例子 2: HTTP 响应

当你在 Node.js 中创建一个 web 服务器时，每当有请求进来，你都会得到一个关于该请求的响应对象。这个响应对象实际上就是一个 `WritableStream`，你可以通过它发送数据给客户端。

```javascript
const http = require("http");

// 创建一个简单的服务器
const server = http.createServer((req, res) => {
  // res (响应对象) 是一个 WritableStream
  res.write("Hello, Client!");
  res.end();
});

server.listen(3000, () => console.log("Server is running on port 3000"));
```

#### 例子 3: 流式处理大文件

如果你要处理非常大的文件，一次性读取可能会占用太多内存。这时，你可以使用 `WritableStream` 来进行流式写入，边读边写，减少内存使用。

```javascript
const fs = require("fs");

// 创建一个可读流和一个可写流
const readStream = fs.createReadStream("large-input-file.txt");
const writeStream = fs.createWriteStream("output-file.txt");

// 将大文件的内容流式传输到另一个文件
readStream.pipe(writeStream);
```

以上例子展示了 `WritableStream` 在不同场景下的应用，希望这能帮助你理解它的作用和如何利用它来进行有效的数据处理。

## [Class: WritableStreamDefaultController](https://nodejs.org/docs/latest/api/globals.html#class-writablestreamdefaultcontroller)

好的，Node.js 中的 `WritableStreamDefaultController` 是一个在流（Streams）API 中使用的控制器类。你可以把流比作是数据的管道，而这个控制器则用于管理这些数据如何写入目标。

首先，我们需要理解 Node.js 中的流（Streams）概念：

- **流**：流是一组有序的、可读取或可写入的数据序列。想象你有一根水管，水可以从一端流到另一端，流在 Node.js 中就是这样，只不过流动的是数据而不是水。

现在，让我们聚焦在 **可写流**（Writable Streams）上：

- **可写流**：这种流允许你将数据写入到某处，比如文件、HTTP 响应体、或者是其他任何形式的消费者。

`WritableStreamDefaultController` 正是用来控制这种可写流的。它提供了几个关键的方法和属性来管理流的状态和行为。但通常情况下，作为开发者，你不需要直接与这个控制器打交道。这个控制器主要被底层系统使用，以确保数据正确地写入流中。

不过，了解其存在和功能对于理解流的内部工作机制是有帮助的。这里有一些 `WritableStreamDefaultController` 的关键特性：

1. **error()**: 如果在写入流的过程中遇到错误，这个方法可以用来报告错误。
2. **signal**: 这是一个 `AbortSignal` 对象，它允许你通过一个信号来停止写入操作。

由于 `WritableStreamDefaultController` 是一个相对底层的 API，在日常编程中很少直接使用它，所以举实际例子可能会超出初学者的应用场景。不过，我可以给你展示一个简化的例子，说明如何使用高级 API 来创建可写流，并通过它写入数据：

```javascript
const { Writable } = require("stream");

// 创建一个自定义的可写流
const myWritableStream = new Writable({
  // 当向流写入数据时，会调用此函数
  write(chunk, encoding, callback) {
    console.log(chunk.toString()); // 打印数据
    callback(); // 调用回调表示完成写入
  },
});

// 使用流
myWritableStream.write("Hello, World!", (err) => {
  if (err) throw err;
  console.log("数据已写入");
});

myWritableStream.end(() => {
  console.log("结束写入数据");
});
```

在这个例子中，我们创建了一个可写流，并且定义了当数据写入该流时应该执行的逻辑。每次调用 `write()` 方法时，都会触发 `write` 函数，并打印传入的数据。当调用 `end()` 方法时，表示没有更多的数据需要写入，流应该关闭。这个过程背后，`WritableStreamDefaultController` 可能在起着作用，但这是隐藏在 Node.js 流实现之下的。

总结来说，`WritableStreamDefaultController` 是 Node.js 流 API 的一部分，它在幕后帮助控制数据如何写入可写流，虽然不常直接使用它，但理解其原理有助于深入理解 Node.js 中的流处理。

## [Class: WritableStreamDefaultWriter](https://nodejs.org/docs/latest/api/globals.html#class-writablestreamdefaultwriter)

好的，让我来以简单易懂的方式说明 Node.js 中的 `WritableStreamDefaultWriter` 类。

首先，理解流（Stream）是关键。在编程中，流是一种抽象的概念，指的是数据的一连串传输。想象成水流，数据就像水一样从一个地方流向另一个地方。流可以是可读的、可写的、或者两者兼具。

在 Node.js 中，`WritableStream` 是表示“可写流”的一种对象。这意味着它能够接收数据并将其发送到某个目的地，比如文件、进程、HTTP 响应等。

### `WritableStreamDefaultWriter` 类

当我们谈到 `WritableStreamDefaultWriter` 时，我们是在讨论一个用于操作 `WritableStream` 的工具。这个类提供了多种方法，允许你高效地向流中写入数据，控制数据的流动，以及处理各种与流相关的事件。

### 关键方法和属性

- **write()**：允许你向流中写入数据。
- **close()**：关闭流，意味着没有更多的数据将被写入。
- **abort()**：如果有需要，可以通过这个方法中止流的写入操作。
- **ready** 和 **desiredSize**：这些属性提供了关于流当前状态的信息，比如它是否已准备好接收更多数据，以及流希望接收的数据大小。

### 实际运用示例

#### 示例 1：向文件写入内容

假设你想通过 Node.js 将日志信息写入文件。在这种情况下，你可以创建一个指向该文件的 `WritableStream`，然后使用 `WritableStreamDefaultWriter` 来向其中写入日志。

```javascript
const fs = require("fs");

// 创建指向 'log.txt' 文件的 WritableStream
const writableStream = fs.createWriteStream("log.txt");

// 获取 WritableStream 的 writer
const writer = writableStream.getWriter();

// 写入数据
writer.write("这是一条日志信息。\n").then(() => {
  console.log("日志已写入");
});

// 完成后关闭流
writer.close();
```

#### 示例 2：向 HTTP 响应写入数据

当你在使用 Node.js 构建 Web 服务器时，你可能需要向客户端发送数据。HTTP 响应本身就是一个 `WritableStream`，这意味着你可以使用 `WritableStreamDefaultWriter` 向客户端发送数据。

```javascript
const http = require("http");

// 创建 HTTP 服务器
http
  .createServer((request, response) => {
    // 获取 HTTP 响应的 writer
    const writer = response.getWriter();

    // 向 HTTP 响应中写入数据
    writer.write("Hello, World!\n").then(() => {
      console.log("数据已发送至客户端");
    });

    // 结束响应
    writer.close();
  })
  .listen(8080);

console.log("服务器运行在 http://localhost:8080/");
```

注意，第二个示例是一个概念性的示例，旨在演示如何使用 `WritableStreamDefaultWriter` 在不同类型的流（这里是 HTTP 响应）中写入数据。在实际的 Node.js HTTP 服务器代码中，你会直接使用 `response.write()` 和 `response.end()` 方法来写入和结束响应，因为 HTTP 响应对象直接提供了这些方法，无需显式获取 `WritableStreamDefaultWriter`。

总之，`WritableStreamDefaultWriter` 是一个非常强大的类，使得在 Node.js 中处理流式写入变得更加灵活和高效。通过上述示例，你应该能够开始探索如何在自己的项目中利用这些技术。
