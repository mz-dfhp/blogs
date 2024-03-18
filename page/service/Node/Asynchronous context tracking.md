# [Asynchronous context tracking](https://nodejs.org/docs/latest/api/async_context.html#asynchronous-context-tracking)

好的，让我解释一下 Node.js 中的异步上下文跟踪（Asynchronous Context Tracking）。

在 Node.js 应用程序中，经常会有大量的异步操作，比如文件读写、网络请求等。这些操作通常不会立即完成，而是会在未来的某个时刻返回结果。为了管理这种异步性质和跟踪应用程序的状态，Node.js 提供了一些机制，其中之一便是异步上下文跟踪。

### 异步上下文跟踪简介

异步上下文跟踪是指在 Node.js 的整个异步操作过程中，能够保留和追踪给定的上下文或者状态。这样可以帮助我们知道某个具体的异步操作是在何种状态下启动的，以及在它最终完成时能够得到那个时候的相关信息。

### AsyncLocalStorage 类

在 Node.js v21.7.1 版本中，为了实现异步上下文跟踪，引入了 `AsyncLocalStorage` 类。这个类相当于一个存储空间，可以为每个异步操作分配一个独立的上下文。

### 实例化 AsyncLocalStorage

首先，你需要创建一个 `AsyncLocalStorage` 实例：

```javascript
const { AsyncLocalStorage } = require("async_hooks");
const asyncLocalStorage = new AsyncLocalStorage();
```

### 运行时使用 AsyncLocalStorage

使用 `run()` 方法，你可以为一个异步操作设置一个特定的上下文：

```javascript
asyncLocalStorage.run(new Map(), () => {
  // 在这个函数体内部的任何地方，
  // 你都可以通过 asyncLocalStorage.getStore()
  // 获取到当前的存储对象。
});
```

### 存储和检索数据

你可以在上下文中存储和检索数据，就像这样：

```javascript
// 设置上下文
asyncLocalStorage.run(new Map(), () => {
  const store = asyncLocalStorage.getStore();
  // 存储数据
  store.set("key", "value");

  // 模拟异步操作
  setTimeout(() => {
    // 即使在异步回调中，也可以检索之前存储的数据
    const value = store.get("key");
    console.log(value); // 输出：value
  }, 100);
});
```

### 实际应用示例

#### 跟踪用户请求

在 Web 应用程序中，你可能需要为每个用户请求保存一些数据，比如用户身份验证信息或请求特定的参数。这里我们用一个 Express 应用程序的示例来说明：

```javascript
const express = require("express");
const { AsyncLocalStorage } = require("async_hooks");

const app = express();
const asyncLocalStorage = new AsyncLocalStorage();

app.use((req, res, next) => {
  // 为每个请求创建一个新的上下文
  asyncLocalStorage.run(new Map(), () => {
    const store = asyncLocalStorage.getStore();
    store.set("user", req.user); // 假设 req.user 包含了用户信息

    next();
  });
});

app.get("/", (req, res) => {
  const store = asyncLocalStorage.getStore();
  const user = store.get("user"); // 可以获取到用户信息
  res.send(`Hello, ${user.name}`);
});

app.listen(3000);
```

#### 日志记录

另一个常见的场景是日志记录。在复杂的系统中，你可能想要将日志关联到特定的请求或者任务上。利用 `AsyncLocalStorage`，你可以做到这一点：

```javascript
function log(message) {
  const store = asyncLocalStorage.getStore();
  const requestId = store.get("requestId");
  console.log(`${requestId}: ${message}`);
}

app.use((req, res, next) => {
  const requestId = createUniqueId(); // 创建唯一的请求 ID
  asyncLocalStorage.run(new Map(), () => {
    const store = asyncLocalStorage.getStore();
    store.set("requestId", requestId);

    log("Request started");
    next();
  });
});
```

在这个例子中，我们在每次请求开始时记录了一个消息，并且为其附加了一个唯一的 `requestId`。无论在代码的哪个部分调用 `log` 函数，它都能获取到当前请求的 `requestId` 并且输出相关日志。

总结一下，异步上下文跟踪允许你在 Node.js 应用程序中的异步操作中保持状态的连续性，这对于处理复杂的异步逻辑非常有用。使用 `AsyncLocalStorage` 类，你可以轻松地为异步工作流创建和管理上下文环境。

## [Introduction](https://nodejs.org/docs/latest/api/async_context.html#introduction)

当然，让我来解释一下 Node.js 中的异步上下文（`async_context`），并且尽量通俗易懂。

在 Node.js 中，很多操作都是异步的，比如读取文件、网络请求等。异步操作的特点是你不需要等待它完成就可以执行后面的代码，但是这也导致了一个问题：跟踪和管理程序运行状态变得复杂。

为了理解异步上下文，我们先要明白什么是“上下文”。在编程中，“上下文”（Context）通常指的是程序在运行时某一部分代码所能访问的所有变量和其状态。在同步执行（即代码按照顺序一步一步执行）时，追踪上下文相对简单。但是，在异步执行过程中，因为多个操作可能同时发生，追踪上下文就变得困难。

Node.js 的 `async_hooks` 模块提供了一种机制来追踪整个异步操作的生命周期。而 `AsyncLocalStorage` 类，作为 `async_hooks` 的一部分，给我们提供了存储和管理数据与这些异步操作的生命周期保持同步的能力。简而言之，它允许我们在异步操作开始时存储数据，并在任何回调、Promise 或者其他异步操作完成时访问到这些数据，无论这些操作在哪里执行。

实际应用例子：

1. **日志记录**：
   假设你创建了一个 Web 服务器，每个请求都应该有它自己的唯一 ID，以便在日志中跟踪哪些日志消息属于哪个请求。使用 `AsyncLocalStorage`，你可以轻松地为每个请求分配一个 ID，并在任何异步操作中都能访问到它。

   ```javascript
   const { AsyncLocalStorage } = require("async_hooks");
   const asyncLocalStorage = new AsyncLocalStorage();

   // 当请求到达时
   server.on("request", (req, res) => {
     // 启动新的上下文并存储请求ID
     asyncLocalStorage.run(new Map(), () => {
       asyncLocalStorage.getStore().set("requestId", generateUniqueId());

       // 处理请求...
       handleRequest(req, res);
     });
   });

   function handleRequest(req, res) {
     // 你可以在任何被触发的异步操作中获取请求ID
     const requestId = asyncLocalStorage.getStore().get("requestId");
     log(`Starting request ${requestId}`);

     // 异步读取文件
     fs.readFile("/path/to/file", (err, data) => {
       if (err) throw err;
       // 即使是在异步回调内，你也可以拿到正确的请求ID
       const requestId = asyncLocalStorage.getStore().get("requestId");
       log(`Finished request ${requestId}`);

       // 响应请求
       res.end(data);
     });
   }
   ```

2. **用户认证**：
   在处理 HTTP 请求时，你可能需要在请求的整个生命周期中都能够访问当前用户的信息。通过 `AsyncLocalStorage`，你可以在用户认证后存储用户信息，并在任何地方通过上下文访问它。

   ```javascript
   // 假设我们已经认证了用户并且想要在处理请求过程中保持用户信息
   server.on("request", (req, res) => {
     authenticateUser(req).then((user) => {
       asyncLocalStorage.run(new Map(), () => {
         asyncLocalStorage.getStore().set("user", user);

         // 继续处理请求...
         processRequest(req, res);
       });
     });
   });

   function processRequest(req, res) {
     // 获取存储在上下文中的用户信息
     const user = asyncLocalStorage.getStore().get("user");
     console.log(`Processing request for user ${user.name}`);

     // 根据用户信息执行异步操作...
   }
   ```

这些例子说明了 `AsyncLocalStorage` 可以帮助开发者在 Node.js 应用中跨异步边界传递上下文信息，从而更有效地跟踪和管理应用的状态。

## [Class: AsyncLocalStorage](https://nodejs.org/docs/latest/api/async_context.html#class-asynclocalstorage)

`AsyncLocalStorage` 是 Node.js 中的一种异步资源管理工具，它允许你在当前执行的所有异步操作中，传递和存储特定的上下文信息。这对于跟踪请求或者用户的状态非常有用，尤其是在一个复杂的异步环境中，例如一个 Web 服务器处理多个请求时。

想要理解 `AsyncLocalStorage`，首先需要明白 Node.js 的异步模型。Node.js 使用了事件驱动、非阻塞 I/O 模型，这意味着当一个操作需要等待（例如读取文件、等待网络响应），Node.js 不会停下来等待操作完成，而是将这个操作挂起，继续执行后面的代码。当挂起的操作完成后，通过回调函数通知 Node.js 继续处理。

这种模型带来了高效的性能，但同时也使得追踪程序的执行上下文变得困难，因为不同的操作可能会在不同的时间点完成，而且它们之间的关系不像同步代码那样清晰。

这就是 `AsyncLocalStorage` 发挥作用的地方。它提供了一种方式，可以把当前的执行上下文与后续被触发的异步操作相关联。这样，每次异步操作开始时，都可以获取到这个上下文，即使是在代码的不同部分和不同的异步任务之间。

下面通过一些实际例子来说明 `AsyncLocalStorage` 的使用：

### 实例：追踪 HTTP 请求

假设你正在编写一个 Web 服务，并且想要对每个请求生成一个唯一的追踪 ID，以便于在日志中区分来自不同请求的信息。

```javascript
const http = require("http");
const { AsyncLocalStorage } = require("async_hooks");

// 创建一个AsyncLocalStorage实例
const asyncLocalStorage = new AsyncLocalStorage();

http
  .createServer((req, res) => {
    // 在每个请求的开始处运行
    asyncLocalStorage.run(new Map(), () => {
      // 存储唯一的请求ID到AsyncLocalStorage
      asyncLocalStorage.getStore().set("requestId", Math.random());

      // 处理请求...
      setImmediate(() => {
        // 即使在异步回调中，你也可以访问之前设置的请求ID
        console.log(
          "In setImmediate:",
          asyncLocalStorage.getStore().get("requestId")
        );
      });

      setTimeout(() => {
        // 同样在其他异步回调中可以访问请求ID
        console.log(
          "In setTimeout:",
          asyncLocalStorage.getStore().get("requestId")
        );
      }, 100);

      res.end(
        `Your request ID is: ${asyncLocalStorage.getStore().get("requestId")}`
      );
    });
  })
  .listen(8080);
```

在这个例子中，我们创建了一个 HTTP 服务器，对于每个接收到的请求，我们通过 `asyncLocalStorage.run()` 方法来创建一个新的上下文。我们使用 `new Map()` 作为上下文的存储容器，在其中放置了一个 'requestId' 键值对。

然后在任何异步回调中（比如 `setImmediate` 或 `setTimeout`），我们可以通过调用 `asyncLocalStorage.getStore()` 获取到同一个存储容器，进而拿到当初存储的 'requestId'。这样不论代码执行到哪里，只要是在同一个请求上下文中，我们都可以轻松访问到 'requestId'。

### 实例：用户认证信息

如果你的 Web 应用需要处理用户登录，你可能需要在用户的整个会话中追踪用户的认证信息。

```javascript
// 用户登录成功后，我们可以设置用户信息到 AsyncLocalStorage
async function loginUser(req, res) {
  const user = await authenticateUser(req);
  asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set("user", user);

    // 这里可以调用需要用户信息的其他函数
    doSomething();
    doAnotherThing();
  });
}

// 其他需要用户信息的异步函数
function doSomething() {
  const user = asyncLocalStorage.getStore().get("user");
  console.log("Current user in doSomething:", user.name);
}

function doAnotherThing() {
  const user = asyncLocalStorage.getStore().get("user");
  console.log("Current user in doAnotherThing:", user.name);
}
```

在用户登录后，我们以用户信息创建了一个新的上下文，并存储到了 `AsyncLocalStorage`。在该用户的任意异步操作中，无论多深的函数调用栈，我们都可以通过 `getStore()` 方法访问到同一个用户信息。

总结一下，`AsyncLocalStorage` 提供了一种机制，使得在整个异步操作过程中都能够保持数据的连贯性和访问性，极大地简化了在复杂异步环境下的状态管理问题。

### [new AsyncLocalStorage()](https://nodejs.org/docs/latest/api/async_context.html#new-asynclocalstorage)

`AsyncLocalStorage` 是 Node.js 中提供的一个功能，它允许你在一个异步操作的整个调用链中传递数据而不用显式地将数据从一个函数传递到另一个函数。这就好比是为那些无法直接通过参数传递数据的异步调用创建了一个线程局部存储（类似于 Java 中的 ThreadLocal）。

在 JavaScript 的异步编程中，代码经常需要处理回调函数、Promise 或者 async/await。在这些异步操作中，传统的方法来保持上下文通常是通过闭包或者传递参数来实现的。但是，这样做可能会使得代码复杂且难以维护。这时候 `AsyncLocalStorage` 就派上用场了。

下面我会详细解释 `AsyncLocalStorage` 并举一些例子说明它的使用。

### 创建 AsyncLocalStorage 实例

首先你需要创建一个 `AsyncLocalStorage` 实例：

```js
const { AsyncLocalStorage } = require("async_hooks");
const asyncLocalStorage = new AsyncLocalStorage();
```

### 运用 AsyncLocalStorage 存储和获取数据

当你想要在一个异步流程中跟踪数据时，可以使用 `.run()` 方法来创建这个流程的上下文，并将数据保存在这个上下文中：

```js
asyncLocalStorage.run(new Map(), () => {
  // 在这个回调函数里我们处于 asyncLocalStorage 创建的上下文中
  // 我们可以存储一些数据到上下文中去
  asyncLocalStorage.getStore().set("key", "value");

  // 异步调用，仍然能够访问之前存储的数据
  setTimeout(() => {
    console.log(asyncLocalStorage.getStore().get("key")); // 输出 'value'
  }, 100);
});
```

### 实际运用的例子

#### 例子 1: 跟踪用户请求

假设你有一个 web 服务器，你想要对每个用户请求进行日志记录，并且希望在这个请求的所有异步操作中都能访问到该请求的唯一标识符。

```js
const express = require("express");
const { AsyncLocalStorage } = require("async_hooks");

const asyncLocalStorage = new AsyncLocalStorage();
const app = express();

app.use((req, res, next) => {
  // 每个请求都运行在独立的上下文
  asyncLocalStorage.run(new Map(), () => {
    // 存储请求id到上下文
    asyncLocalStorage.getStore().set("requestId", req.id);
    next();
  });
});

app.get("/", (req, res) => {
  // 即使在异步代码中，我们也能拿到请求id
  setImmediate(() => {
    const requestId = asyncLocalStorage.getStore().get("requestId");
    console.log(`Handling request with id: ${requestId}`);
    res.send("Hello World!");
  });
});

app.listen(3000);
```

#### 例子 2: 数据库查询

如果你在进行数据库操作，你可能想要记录执行数据库操作时的某些上下文信息。

```js
const { AsyncLocalStorage } = require("async_hooks");
const database = require("./database"); // 假设这是你的数据库模块
const asyncLocalStorage = new AsyncLocalStorage();

function fetchDataFromDatabase(query) {
  asyncLocalStorage.run(new Map(), async () => {
    // 存储一些有用的上下文，如当前用户id
    asyncLocalStorage.getStore().set("userId", getCurrentUserId());

    // 执行数据库查询
    const result = await database.query(query);

    // 获取并使用存储的上下文信息
    const userId = asyncLocalStorage.getStore().get("userId");
    console.log(`User ${userId} fetched data from database.`);

    return result;
  });
}
```

在这两个例子中，我们没有必须通过函数参数传递 `requestId` 或 `userId`。相反，我们在一个请求的所有异步操作中都可以访问这些上下文数据，这是因为 `AsyncLocalStorage` 为我们提供了一个独立的存储空间，它随着异步操作流动但并不打断程序逻辑。

注意，虽然 `AsyncLocalStorage` 非常有用，但它也必须谨慎使用。不恰当的使用可能会导致内存泄漏，尤其是如果你忘记清理存储的话。此外，在某些情况下，例如在使用特定的第三方库时，`AsyncLocalStorage` 可能无法正确工作，因为那些库可能会破坏 Node.js 的异步上下文。

### [Static method: AsyncLocalStorage.bind(fn)](https://nodejs.org/docs/latest/api/async_context.html#static-method-asynclocalstoragebindfn)

`AsyncLocalStorage.bind(fn)` 是 Node.js 中的一个高级功能，它属于异步本地存储（AsyncLocalStorage）这个工具，用来在 Node.js 的异步操作中追踪和管理上下文。要理解它，我们首先需要知道 Node.js 中的两个概念：异步编程和执行上下文。

在 JavaScript 和 Node.js 中，异步编程是常见的模式，允许程序在等待某些操作完成时继续执行其他任务。例如，当从数据库中读取数据或者从网络请求数据时，你不希望整个应用程序停下来等待这个操作完成。这就是异步的用武之地。

然而，异步编程引入了一个问题：如何追踪在一系列异步操作中传递的信息？在同步编程中，你可以通过函数调用栈来跟踪变量和状态，但在异步操作中，这些操作可能会跳出当前的调用栈，因此传统的方法行不通。

这里就是 `AsyncLocalStorage` 发挥作用的地方。它为每个异步资源创建一个存储空间，允许你在一个异步操作开始时设置一些数据，在之后的任何时刻，即使在其他异步回调中，都能获取到这些数据。这样，你就能够在整个异步操作链中保持上下文的连续性。

现在，`AsyncLocalStorage.bind(fn)` 方法就是这个功能中的一个工具。它的作用是将一个函数包装起来，确保当这个函数在未来被调用时，它会在当前 AsyncLocalStorage 实例创建的上下文中运行。

让我们举一个实际的例子：

```javascript
const { AsyncLocalStorage } = require("async_hooks");

// 创建一个新的 AsyncLocalStorage 实例
const asyncLocalStorage = new AsyncLocalStorage();

function printName() {
  // 假设这个函数在某个异步操作中被调用
  // 我们想要获取当前的上下文中的名字
  const store = asyncLocalStorage.getStore();
  console.log(store.name); // 输出 "Alice"
}

function someAsyncOperation(callback) {
  // 执行一些异步操作，并在完成时调用回调函数
  setTimeout(callback, 100);
}

// 现在我们设置当前上下文中的名字为 "Alice"
asyncLocalStorage.run({ name: "Alice" }, () => {
  // 我们使用 .bind() 来确保 printName 在当前的上下文中运行
  const boundPrintName = asyncLocalStorage.bind(printName);

  // 即使是在 setTimeout 这样的异步操作中，我们也能够访问到上下文
  someAsyncOperation(boundPrintName);
});
```

在这个例子中，我们创建了一个 `AsyncLocalStorage` 实例，并通过 `run` 方法设置了一个上下文，其中包含了一个名字 "Alice"。接着，我们定义了一个 `printName` 函数，在这个函数中我们想要获取并打印当前上下文中的名字。

使用 `asyncLocalStorage.bind(printName)` 将 `printName` 函数绑定到当前上下文，这意味着无论何时何地调用 `boundPrintName`，它都会在创建它的上下文中执行。即使我们在 `setTimeout` 中调用它，也能正确输出 "Alice"，因为 `boundPrintName` 已经绑定到了正确的上下文。

### [Static method: AsyncLocalStorage.snapshot()](https://nodejs.org/docs/latest/api/async_context.html#static-method-asynclocalstoragesnapshot)

Node.js 的 `AsyncLocalStorage` 是一个用来管理异步操作中的上下文信息的工具。在编写 Node.js 程序时，我们常常要处理很多异步操作，比如网络请求、文件读写等。每个操作都可能有自己的一些相关数据，或者说“上下文”。保持这些上下文在异步调用链中不丢失是非常有挑战性的，这就是 `AsyncLocalStorage` 要解决的问题。

### AsyncLocalStorage 简介

`AsyncLocalStorage` 可以被看作是存储数据的容器，它能够在 JavaScript 的异步调用链中传递上下文信息。简单来说，你可以将一些数据放入 `AsyncLocalStorage`，并在之后的任何异步函数调用中取出这些数据，而不必手动将这些数据通过每个函数参数传递。

### snapshot() 静态方法

到了 Node.js v21.7.1 版本，`AsyncLocalStorage` 类中引入了一个新的静态方法叫做 `snapshot()`。这个方法允许你获取当前所有 `AsyncLocalStorage` 实例的活跃状态的快照。

#### 使用场景

这个功能特别有用于诊断和测试目的，因为你可以在某个时间点捕获所有的上下文状态，并进行检查或者比较。

#### 实际运用例子

考虑一个简单的 web 应用，你可能想要在每个用户的请求中记录用户的 ID，以便于在处理请求的过程中能随时访问用户信息。

首先，创建一个 `AsyncLocalStorage` 实例：

```javascript
const { AsyncLocalStorage } = require("async_hooks");
const asyncLocalStorage = new AsyncLocalStorage();
```

当开始处理一个新的请求时，你可以使用 `run` 方法来创建一个与该请求关联的上下文：

```javascript
app.get("/user", (req, res) => {
  // 假设从请求中获取到用户 ID
  const userId = req.query.userId;

  // 使用 run 方法给这个请求创建一个新的上下文
  asyncLocalStorage.run(new Map(), () => {
    // 在上下文中设置用户 ID
    asyncLocalStorage.getStore().set("userId", userId);

    // 处理请求...
    handleRequest(req, res);
  });
});
```

然后在任何时候，如果你需要对当前所有 `AsyncLocalStorage` 实例的状态进行快照，可以这样做：

```javascript
// 获取当前的 AsyncLocalStorage 实例的快照
const snapshot = AsyncLocalStorage.snapshot();

// 打印快照中的所有实例，和它们存储的值
console.log(snapshot);
```

在这个例子中，`snapshot()` 方法被用来捕获所有活跃的上下文信息。例如，在一个复杂的应用中，一个请求可能会触发许多异步操作，通过 `snapshot()` 方法可以帮助开发者在任意时刻理解当前的上下文状态，这对于调试和诊断问题非常有价值。

### [asyncLocalStorage.disable()](https://nodejs.org/docs/latest/api/async_context.html#asynclocalstoragedisable)

好的，我来解释一下 Node.js 中的 `asyncLocalStorage.disable()` 方法。

首先，`AsyncLocalStorage` 是 Node.js 提供的一个功能，它允许我们在异步操作的上下文中保存和访问数据。就像你在同步代码中可以用一个全局变量来存储数据，而其他函数可以读取这个全局变量一样，`AsyncLocalStorage` 可以帮助你在异步操作中做类似的事情，但是更安全和更具隔离性。

接下来，我们来了解 `disable()` 方法。当你调用 `asyncLocalStorage.disable()` 方法时，它会关闭 `AsyncLocalStorage` 实例的功能，并阻止将任何新的异步操作关联到当前的存储空间。这意味着之后创建的异步操作不会再被追踪，它们不会有与 `AsyncLocalStorage` 相关的上下文。

举个实际的例子：

想象你正在开发一个 web 应用，你需要记录用户的请求信息以便在后续的异步操作中使用，比如用户的身份认证信息或者请求特定的数据。

```javascript
const { AsyncLocalStorage } = require("async_hooks");

// 创建一个 AsyncLocalStorage 实例
const asyncLocalStorage = new AsyncLocalStorage();

function logInUser(userId) {
  // 在 AsyncLocalStorage 中存储当前用户ID
  asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set("userId", userId);

    // 使用一些异步操作
    process.nextTick(() => {
      console.log(
        `The user's id is ${asyncLocalStorage.getStore().get("userId")}`
      );
    });
  });
}

logInUser(123); // 输出：The user's id is 123
```

在上面的例子中，我们创建了一个 `AsyncLocalStorage` 实例并用它来存储用户 ID。无论在哪个异步操作中，只要它是在 `asyncLocalStorage.run()` 方法调用的回调函数或其引发的任何异步操作中运行的，我们都可以访问到存储的用户 ID。

如果在某个时间点之后，我们不再需要跟踪任何新的异步操作（比如用户退出登录），我们可以调用 `disable()` 来停止跟踪：

```javascript
// 用户登出
function logOutUser() {
  // 停止 AsyncLocalStorage 实例的功能
  asyncLocalStorage.disable();
}

logOutUser();

process.nextTick(() => {
  if (!asyncLocalStorage.getStore()) {
    console.log("No user is logged in");
  }
});
// 输出：No user is logged in
```

在调用 `logOutUser` 函数后，`AsyncLocalStorage` 被禁用了，所以之后的异步操作尝试获取存储的时候，将得到 `undefined`，表示没有用户登录或者没有相关的上下文信息可用。

总结一下：`asyncLocalStorage.disable()` 方法用于停止一个 `AsyncLocalStorage` 实例的活动，确保新启动的异步操作不会与该实例相关联。这对于清理资源、避免内存泄漏和控制程序的状态非常有用。

### [asyncLocalStorage.getStore()](https://nodejs.org/docs/latest/api/async_context.html#asynclocalstoragegetstore)

`asyncLocalStorage.getStore()` 是 Node.js 中 AsyncLocalStorage 类的一个方法，它用于访问当前异步操作的存储。这里的“存储”可以理解为一个特定的对象，它在一系列异步操作中传递信息，而且这些操作可能涉及多个回调或者事件。

在并发编程（比如在 Node.js 中处理多个请求）中，我们通常需要确保每次请求的数据是隔离的，不会与其他请求的数据相混淆。由于 Node.js 是单线程运行的，这种隔离尤其重要。AsyncLocalStorage 提供了一种方法来创建这种隔离的上下文。

**例子 1: 在 HTTP 服务器中跟踪用户请求**

假设你正在编写一个 Node.js 应用，该应用是一个 HTTP 服务器，你想跟踪每个用户请求的相关信息，比如请求 ID。

```javascript
const http = require("http");
const { AsyncLocalStorage } = require("async_hooks");

// 创建一个 AsyncLocalStorage 实例
const asyncLocalStorage = new AsyncLocalStorage();

http
  .createServer((req, res) => {
    // 启动一个新的异步存储区域
    asyncLocalStorage.run(new Map(), () => {
      // 我们将requestId保存在存储中
      asyncLocalStorage.getStore().set("requestId", Math.random());

      // 处理请求...
      handleRequest(req, res);
    });
  })
  .listen(8080);

function handleRequest(req, res) {
  // 即使在多个异步操作之后，getStore() 方法还是能获取到当前请求的上下文
  const requestId = asyncLocalStorage.getStore().get("requestId");

  // 使用请求ID执行一些操作，比如日志记录等
  console.log(`Handling request with ID: ${requestId}`);

  // 假设有一个异步操作
  setImmediate(() => {
    // 异步操作完成后，我们仍可以访问相同的请求ID
    console.log(`Finished handling request with ID: ${requestId}`);
    res.end(`Your request ID is ${requestId}`);
  });
}
```

在以上代码中，我们创建了一个 HTTP 服务器，并为每个请求创建了一个唯一的请求 ID。通过使用`asyncLocalStorage.run()`，我们为每个请求创建了一个新的上下文，然后在该上下文内部进行操作。无论我们在何处或何时调用`asyncLocalStorage.getStore()`，只要是在同一次请求的异步操作中，它总是返回同一个存储对象，从而允许我们访问到初始设置的`requestId`。

**例子 2: 在数据库查询中维持用户会话**

想象你有一个需要访问数据库的应用程序，且你希望在整个查询过程中保持用户会话信息。

```javascript
const { AsyncLocalStorage } = require("async_hooks");
const asyncLocalStorage = new AsyncLocalStorage();

// 模拟数据库查询
function queryDatabase(query, callback) {
  // 随机延迟模拟查询时间
  setTimeout(() => {
    const userId = asyncLocalStorage.getStore().get("userId");
    console.log(`Running query for user ${userId}: ${query}`);
    callback(null, `Results for user ${userId}`);
  }, Math.floor(Math.random() * 100));
}

// 用户会话
asyncLocalStorage.run(new Map(), () => {
  // 在Map中设置用户ID
  asyncLocalStorage.getStore().set("userId", "user123");

  // 执行数据库查询
  queryDatabase("SELECT * FROM table", (err, results) => {
    console.log(results); // "Results for user user123"
  });
});
```

在这个例子中，我们使用了`AsyncLocalStorage`来保存用户 ID。即使数据库查询是异步的，并且可能会在不同的 tick 或事件循环迭代中完成，我们仍然可以通过`asyncLocalStorage.getStore()`安全地访问和关联到正确的用户会话。

总结：

- `asyncLocalStorage.getStore()` 返回存储的引用，可以从中获取或设置键值对。
- 它在异步任务（如事件监听器、Promise、异步函数）之间共享状态，这些任务是通过特定的 AsyncLocalStorage 实例启动的。
- 这种方法避免了传统的通过闭包或者模块级变量传递状态的方式，在并发处理时更加安全和可靠。

通过这些例子，你应该能够看到`asyncLocalStorage.getStore()`如何帮助管理在异步操作之间的状态共享，这对于创建具有复杂异步流程的 Node.js 应用非常有用。

### [asyncLocalStorage.enterWith(store)](https://nodejs.org/docs/latest/api/async_context.html#asynclocalstorageenterwithstore)

好的，让我们来谈谈 Node.js 中的 `asyncLocalStorage.enterWith(store)` 方法。`AsyncLocalStorage` 是 Node.js 提供的一个类，用于在所有异步操作中跟踪与特定请求或事务相关的上下文。这个特性是非常有用的，因为在 Node.js 异步编程模型中，维护特定执行流（例如用户请求）的状态通常很难。

### AsyncLocalStorage 简介

首先，`AsyncLocalStorage` 是一个实现了异步存储的类，它允许你保存数据，这些数据可以在当前的异步调用链中随处访问，不受全局命名空间污染的影响。它相当于线程本地存储(Thread Local Storage)在单线程异步编程模式下的等价物。

### `enterWith(store)` 方法

`asyncLocalStorage.enterWith(store)` 是 `AsyncLocalStorage` 类的一个方法，用于在当前的异步执行上下文中设置一个存储对象。该方法接收一个参数 `store`，它是你想要在当前执行上下文中存放的数据。当你调用这个方法时，你所提供的 `store` 将会用于当前的执行路径以及之后创建的所有异步事件。即使你进入了一个新的异步操作，`store` 也会被保留下来。

### 实际应用例子

假设我们正在构建一个 Web 服务器，我们需要跟踪每个用户请求的唯一标识符，以便在处理请求的过程中能够在日志中输出该标识符。使用 `AsyncLocalStorage` 和它的 `enterWith` 方法，我们可以轻松做到这一点。

```javascript
const http = require("http");
const { AsyncLocalStorage } = require("async_hooks");

// 创建一个新的 AsyncLocalStorage 实例
const asyncLocalStorage = new AsyncLocalStorage();

http
  .createServer((req, res) => {
    // 对于每个请求，我们生成一个唯一的请求ID
    const requestId = Math.random().toString(36).substring(2, 15);

    // 使用 'enterWith' 将 requestId 设置为当前上下文的 store
    asyncLocalStorage.enterWith({ requestId });

    // 在异步操作中，我们可以从 asyncLocalStorage 获取 requestId
    setTimeout(() => {
      const store = asyncLocalStorage.getStore();
      console.log(`In setTimeout - RequestId: ${store.requestId}`); // 输出 requestId
      res.end(`Your request ID is: ${store.requestId}`);
    }, 100);
  })
  .listen(8080);

console.log("Server running on port 8080");
```

在这个例子中：

1. 我们创建了一个 HTTP 服务器，每次接收到请求都会为其生成一个 `requestId`。
2. 我们调用 `asyncLocalStorage.enterWith()` 方法，并传递一个包含 `requestId` 属性的对象作为 `store`。
3. 在 `setTimeout` 的回调函数中，我们通过 `asyncLocalStorage.getStore()` 获取当前的存储对象，并打印出 `requestId`。
4. 用户得到响应时，他们会看到自己特定的 `requestId`。

以上就是一个简化的实践例子，展示了如何使用 `AsyncLocalStorage` 和 `enterWith` 方法来传递请求特定的数据。在更复杂的应用中，这种模式可以帮助你维护和跟踪用户请求的状态，例如用户认证信息、日志记录、性能监控等。

### [asyncLocalStorage.run(store, callback[, ...args])](https://nodejs.org/docs/latest/api/async_context.html#asynclocalstoragerunstore-callback-args)

`asyncLocalStorage.run(store, callback[, ...args])` 是 Node.js 的一个功能，它属于 `AsyncLocalStorage` API。这个 API 允许你跨异步操作保持状态，可以把它想象成为在一系列相关的异步调用之间传递一个“背包”，无论你走到哪里，背包里面的东西都会伴随着你。

首先要理解，在 JavaScript 中，特别是在 Node.js 环境下，编程时常常会遇到异步操作，比如读取文件、数据库操作或者发起网络请求等。在这些异步操作中，有时候我们需要在不同的函数和回调中保持一些共享的状态。这通常不容易做到，因为每次异步调用可能都会创建一个新的调用栈，也就是说上下文（context）在这些异步调用之间是不自动共享的。

`AsyncLocalStorage`类提供了一种解决方法，它允许你创建一个存储区域，这个存储区域在一个异步调用链的所有回调中是可访问的。`asyncLocalStorage.run()` 方法则是启动这样一个带有存储（store）的异步操作链。

现在让我举例说明：

```javascript
const { AsyncLocalStorage } = require("async_hooks");
const asyncLocalStorage = new AsyncLocalStorage();

function printCurrentRequest() {
  // 获取当前存储的数据
  const store = asyncLocalStorage.getStore();
  console.log(store);
}

function middleware(req, res) {
  // 假设 req 对象有一个唯一ID
  const uniqueId = req.id;

  // 运行一个回调，并创建一个新的存储区域，这个区域会在后续的异步调用链中传递
  asyncLocalStorage.run(new Map(), () => {
    // 设置当前请求的唯一ID到存储区域
    asyncLocalStorage.getStore().set("requestId", uniqueId);

    // 处理请求
    handleRequest(req, res);
  });
}

function handleRequest(req, res) {
  // 异步操作，例如读取数据库或文件系统
  process.nextTick(() => {
    // 即使在异步代码中，我们也能从存储区域获取那个唯一ID
    printCurrentRequest(); // 输出 Map { 'requestId' => '...some id...' }
  });
}
```

在以上例子中：

1. 我们首先通过 `require('async_hooks')` 引入了必要的模块，并创建了一个 `AsyncLocalStorage` 实例。
2. 当接收到一个新的请求时（这里是由 `middleware` 函数模拟），我们调用 `asyncLocalStorage.run()` 并传递一个新的 Map 作为存储对象以及一个回调函数。在这个回调函数中，我们将请求的唯一标识符设置到这个 Map 中。
3. 在 `handleRequest` 函数中，我们执行了一个异步操作 `process.nextTick()`。即使在异步操作内部，我们仍然可以通过 `asyncLocalStorage.getStore()` 来获取之前设置的存储对象，并打印出其中保存的请求 ID。

这样，即便我们处于深层次的异步调用中，也能够方便地获取到关联的请求 ID 或其他信息，而不用手动去将这些信息一层层传递下去。这对于跟踪用户请求、日志记录等场景特别有用。

### [asyncLocalStorage.exit(callback[, ...args])](https://nodejs.org/docs/latest/api/async_context.html#asynclocalstorageexitcallback-args)

`asyncLocalStorage.exit(callback[, ...args])` 是 Node.js 中 `AsyncLocalStorage` 类的一个方法，它提供了一种在异步操作中保持上下文存储的方式。要理解这个方法，首先我们需要知道什么是 `AsyncLocalStorage` 和它为何而存在。

**什么是 AsyncLocalStorage？**

当你在进行异步编程时，比如在 Node.js 中处理网络请求或数据库操作，每个操作都可能涉及多个回调函数或异步事件。问题在于，原生的 JavaScript 并不提供直接的机制来跟踪在这些异步操作之间传递的上下文信息（例如用户身份、请求特定数据等）。这就是 `AsyncLocalStorage` 登场的地方。

使用 `AsyncLocalStorage`，你可以为每个入站请求或任务创建一个独立的上下文，而无需显式地将上下文对象从一个函数传递到另一个函数。

**`asyncLocalStorage.exit(callback[, ...args])` 方法是做什么的？**

这个方法允许你退出当前的 `AsyncLocalStorage` 上下文。这意味着在 `callback` 这个回调函数执行时，任何使用 `asyncLocalStorage.getStore()` 获取的存储值都会返回 `undefined`，因为那个时刻你已经不在原始存储的上下文中了。

具体来说，`exit` 方法的作用是临时退出 `AsyncLocalStorage` 上下文，执行回调，然后恢复原有的上下文状态。这对于某些情况下，当你不希望某个操作影响当前的上下文，但又需要执行一段代码非常有用。

**实际运用例子：**

假设你正在开发一个 Node.js 的 web 应用，并且你想要为每个用户请求创建一个唯一的日志 ID，以便在处理用户请求的同时跟踪日志。

1. 首先，你会在请求处理开始时创建一个新的 `AsyncLocalStorage` 实例：

```javascript
const { AsyncLocalStorage } = require("async_hooks");
const asyncLocalStorage = new AsyncLocalStorage();

function onRequest(req, res) {
  const requestId = generateUniqueId();
  asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set("requestId", requestId);
    handleRequest(req, res);
  });
}
```

2. 在处理请求过程中，无论你在哪个异步函数中，你都可以随时通过 `getStore` 获取到当前请求的 ID：

```javascript
function logMessage(message) {
  const store = asyncLocalStorage.getStore();
  const requestId = store ? store.get("requestId") : null;
  console.log(`[${requestId}] ${message}`);
}

function handleRequest(req, res) {
  logMessage("开始处理请求");
  // 做一些异步工作...
}
```

3. 现在，如果有一个特定的异步操作，你希望在此期间不关联任何请求 ID。你可以使用 `asyncLocalStorage.exit` 来实现：

```javascript
function performUnrelatedTask() {
  asyncLocalStorage.exit(() => {
    // 在这个函数里面，getStore 将会返回 undefined。
    const store = asyncLocalStorage.getStore();
    const hasNoRequestId = store === undefined;
    console.log(`无请求ID的上下文: ${hasNoRequestId}`); // 打印 true
    // 执行与请求无关的任务...
  });
}

// 在handleRequest中的某个位置调用 performUnrelatedTask
```

在上面的例子中，`performUnrelatedTask` 函数里的代码是在“退出”了原有的请求 ID 上下文的情况下运行的，因此即使在异步操作中，通过 `getStore` 也不能获取到请求 ID。这样做可以确保某些不应该与特定请求关联的日志或操作不会被错误地关联上。

### [Usage with async/await](https://nodejs.org/docs/latest/api/async_context.html#usage-with-asyncawait)

好的，Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。它允许在服务器端运行 JavaScript 代码。Node.js 提供了很多模块，其中一个重要的模块是 `async_hooks`，该模块用于追踪应用程序中异步资源（如 Promises, Timers, or Callbacks）的生命周期。

在 Node.js v21.7.1 版本中，`async_hooks` 模块提供了一种机制来监控和管理异步操作的上下文。这对开发者来说非常有用，因为它可以帮助追踪异步执行过程中的状态变化，并确保即使在异步操作中也能正确地维护上下文信息。

### async/await 与 async_hooks

在 JavaScript 中，`async/await` 是处理异步操作的一种语法糖，它使得异步代码看起来和同步代码类似。这使得写异步代码更容易理解和维护。然而，在异步代码中跟踪和管理上下文（比如变量、用户身份认证信息等）可能会变得复杂。

举个例子，假设你正在写一个 Web 应用程序，每当用户发出请求时，你都需要记录他们的身份验证信息。在异步操作中，由于 JavaScript 的事件循环，保持用户的上下文信息不丢失是具有挑战性的。

下面我会给你介绍一个使用 `async_hooks` 来跟踪异步操作中的上下文信息的示例。

### 示例：使用 async_hooks 跟踪异步上下文

```javascript
const async_hooks = require("async_hooks");
const fs = require("fs");

// 初始化存储执行上下文的 Map
const asyncContextMap = new Map();

// 创建 async_hooks 实例，定义初始化、销毁等钩子
const hooks = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    // 当异步资源创建时，将其父级上下文复制到当前的异步资源
    if (asyncContextMap.has(triggerAsyncId)) {
      asyncContextMap.set(asyncId, asyncContextMap.get(triggerAsyncId));
    }
  },
  destroy(asyncId) {
    // 当异步资源被销毁时，从 Map 中移除
    asyncContextMap.delete(asyncId);
  },
});

// 激活钩子
hooks.enable();

// 存放用户特定上下文的函数
function setContext(value) {
  // 获取当前执行的异步ID
  const eid = async_hooks.executionAsyncId();
  // 设定当前异步上下文
  asyncContextMap.set(eid, value);
}

// 获取用户特定上下文的函数
function getContext() {
  // 获取当前执行的异步ID
  const eid = async_hooks.executionAsyncId();
  // 返回当前异步上下文
  return asyncContextMap.get(eid);
}

// 使用 async/await 的异步函数
async function main() {
  setContext({ userId: "123", role: "admin" }); // 设置当前上下文
  await otherAsyncFunction(); // 调用其他异步函数
  console.log(getContext()); // 即使在其他异步函数内部，也能获取到之前设置的上下文
}

// 另一个异步函数
async function otherAsyncFunction() {
  await new Promise((resolve) => setTimeout(resolve, 100)); // 模拟异步操作，如数据库调用等
  console.log("In otherAsyncFunction:", getContext()); // 获取并打印上下文
}

main().catch(console.error);
```

在这个例子中：

1. 我们通过 `require` 引入了 `async_hooks` 和 `fs`（文件系统）模块。
2. 使用 `async_hooks.createHook` 方法创建了一个钩子实例，传入了钩子的回调函数，定义了在异步资源的生命周期不同阶段会执行的动作。
3. 我们启用了这些钩子，让它们开始工作。
4. `setContext` 函数用于在特定的异步操作中设置上下文。
5. `getContext` 函数用于获取当前的上下文。
6. 在 `main` 函数中，我们设置了上下文，然后在 `otherAsyncFunction` 中使用 `await` 延时，并尝试获取之前设置的上下文。

通过这种方式，即使在经过多个异步调用后，我们仍然能够获取到正确的上下文信息。这在构建复杂的异步逻辑时非常有帮助，比如处理 HTTP 请求、数据库操作时跟踪用户的会话信息。

这样的机制对于构建稳健和可维护的 Node.js 应用程序至关重要，特别是在涉及复杂异步流程，如进行多层次的数据库查询或者调用外部服务时。利用 `async_hooks` 提供的功能，开发者能更容易地诊断问题、优化性能以及保持代码的清晰度。

### [Troubleshooting: Context loss](https://nodejs.org/docs/latest/api/async_context.html#troubleshooting-context-loss)

Node.js 中的 "context loss" 是指在异步编程时，程序执行期间丢失了与原始操作关联的上下文信息。这通常发生在使用诸如回调、Promise、async/await 等异步 API 时。

为了理解这一点，我们首先需要明白什么是“上下文”（context）。在编程中，上下文通常包含了执行某项任务所需的相关信息，比如用户的身份信息、请求的追踪 ID 等。在同步代码中，由于代码按顺序执行，保持上下文相对简单。但在异步编程中，你可能会遇到一个函数启动了一个异步任务，而当这个任务完成并继续执行后续代码时，它已经丢失了启动该任务时的上下文信息。

在 Node.js 中，`AsyncLocalStorage` 是用来跟踪异步操作中的上下文并将其保持不丢失的一个工具。它像是一个随着异步任务传递的容器，在每个新的异步调用中都能访问到原始的上下文数据。

现在让我们来看看几个实际的例子：

### 1. 记录日志

假设你的应用程序有很多用户同时发送请求，你想要在日志中记录下每个请求的唯一标识符(trace ID)以便追踪。在异步操作中，由于回调和延迟执行，你可能会丢失这个 trace ID。

使用 `AsyncLocalStorage` 可以帮助你在整个请求处理过程中，不管有多少异步跳转，都可以访问到这个 trace ID。

```javascript
const { AsyncLocalStorage } = require("async_hooks");
const asyncLocalStorage = new AsyncLocalStorage();

function logWithTraceId(message) {
  const traceId = asyncLocalStorage.getStore();
  console.log(`[${traceId}] ${message}`);
}

asyncLocalStorage.run("12345", () => {
  // 在这个闭包里面，无论多少层异步调用，getStore() 都会返回 '12345'
  logWithTraceId("开始处理请求");

  setTimeout(() => {
    // 异步操作
    logWithTraceId("异步操作完成"); // 依然可以获取到 '12345'
  }, 100);
});
```

### 2. 用户身份验证

在构建 Web 服务器时，你可能需要在每次请求中保持用户的登录状态。如果在异步处理用户请求时丢失了用户信息，就会出现问题。

使用 `AsyncLocalStorage`，你可以确保无论请求如何被异步处理，用户信息始终可用。

```javascript
const { AsyncLocalStorage } = require("async_hooks");
const asyncLocalStorage = new AsyncLocalStorage();

// 假设这是处理请求的函数
function handleRequest(request, response) {
  const user = authenticateUser(request); // 假设这个函数根据请求返回用户信息
  asyncLocalStorage.run(user, () => {
    // 这里可以存取用户信息
    doSomeAsyncWork(() => {
      // 即使在异步回调中也可以访问到用户信息
      const userInAsync = asyncLocalStorage.getStore();
      response.end(`Hello, ${userInAsync.name}!`);
    });
  });
}

function doSomeAsyncWork(callback) {
  // 一些异步工作...
  process.nextTick(callback);
}

function authenticateUser(request) {
  // 根据请求认证用户...
  return { name: "Alice" }; // 返回用户信息
}

// 模拟接收请求
handleRequest(
  {
    /* 请求对象 */
  },
  { end: (msg) => console.log(msg) }
);
```

在以上这两个例子中，`asyncLocalStorage.run` 创建了一个新的上下文，并且你可以通过 `asyncLocalStorage.getStore` 来获取当前存储的上下文。即使在进行异步操作时，只要是在 `run` 方法调用的函数内部或者由这个函数触发的任何异步回调中，都可以访问到相同的上下文信息。这样就避免了上下文的丢失，即使是在复杂的异步代码流中。

## [Class: AsyncResource](https://nodejs.org/docs/latest/api/async_context.html#class-asyncresource)

好的，让我们来聊一聊 Node.js 中的 `AsyncResource` 类.

`AsyncResource` 是 Node.js 的异步钩子 API (`async_hooks`) 的一部分。这个 API 主要被用于创建异步资源，并跟踪它们在一个异步操作中的生命周期。在理解了什么是异步资源之后，你就能更好地理解 `AsyncResource` 为何重要。

在 Node.js 中，当你启动一个异步操作，比如读取文件、发起网络请求或者设定一个 setTimeout，Node.js 会在后台处理这些任务，而不会阻塞其他代码的执行。每一个这样的异步操作都可以被视作一个“异步资源”。

现在，为什么我们需要追踪异步资源呢？主要有两个原因：

1. **诊断和调试**：想象一下，如果你的应用程序出现问题或性能瓶颈，而且这些问题可能与特定的异步操作相关联，那么知道哪些异步资源参与了哪些操作将非常有帮助。
2. **上下文管理**：在异步编程中，保持操作的上下文（比如请求特定的用户数据）是一个挑战。`AsyncResource` 提供了一种机制来保持这种上下文即使在多次的异步跳转之后。

### 实际运用的例子

举例来说，假设你有一个 web 服务器，每当接收到用户请求时，你想要追踪请求从开始到结束的整个流程。在这个过程中，可能会涉及多个异步操作，比如数据库查询或外部服务调用。

```javascript
const http = require("http");
const { AsyncResource } = require("async_hooks");

// 创建一个服务器
const server = http.createServer((req, res) => {
  // 对每个请求，我们创建一个新的 AsyncResource 实例
  // 这里 'REQUEST' 是自定义的资源类型名称
  const asyncResource = new AsyncResource("REQUEST");

  // 假设有一个异步操作，比如数据库查询，//来源：doc.cherrychat.org 请勿商用
  queryDatabase(() => {
    // 当数据库回调执行时，我们想确保它依旧在原始请求的上下文中
    // 使用 AsyncResource 的 runInAsyncScope 方法可以实现这一点
    asyncResource.runInAsyncScope(() => {
      // 现在这里的代码就像是直接在请求回调中运行的
      // 可以安全地使用跟请求相关的上下文，例如用户信息等
      res.end("Query result sent to the user");
    });
  });
});

server.listen(3000);

function queryDatabase(callback) {
  // 模拟数据库异步操作
  setTimeout(callback, 100);
}
```

在这个例子中，我们创建了一个 HTTP 服务器，它在每个请求上都创建了一个 `AsyncResource` 实例。通过这种方式，我们可以确保即使在异步操作发生时（例如数据库查询），我们也能够保持对原始请求的追踪和上下文管理。

总结一下，`AsyncResource` 是一个强大的工具，用于在 Node.js 应用程序中管理和维持异步操作的上下文。虽然它在某些情况下非常有用，但你也应该注意，误用或过度使用 `async_hooks` 可能会引入性能开销和复杂性。所以，在考虑使用这个功能时，务必要评估你的实际需求。

### [new AsyncResource(type[, options])](https://nodejs.org/docs/latest/api/async_context.html#new-asyncresourcetype-options)

Node.js 中的 `AsyncResource` 是异步钩子（async_hooks）模块的一部分。这个模块允许你追踪应用程序中的异步操作，如定时器、Promise、异步 I/O 等。

当你在 Node.js 中写异步代码时，回调函数或者 Promise 往往会在不同的时间执行，有时它们的上下文（比如变量等）可能丢失，使得难以追踪问题或者保持状态的一致性。为了解决这个问题，`AsyncResource` 类被创建出来，用来为这些异步操作提供一个稳定的上下文。

现在，我们将详细地看看 `AsyncResource`：

### 构造函数：new AsyncResource(type[, options])

- `type`: 这是一个字符串参数，表示资源的类型名称。通常是自定义的，并用于识别资源的种类。
- `options`: 这是一个可选参数，可以设置初始化选项，其中包括：
  - `triggerAsyncId`: 指定触发这个资源的异步事件 ID。如果未提供，则使用当前执行的异步 ID。
  - `requireManualDestroy`: 默认情况下，资源会在其对应的回调执行后自动销毁。如果此选项设置为 true，则必须手动调用`.emitDestroy()`来销毁资源。

`AsyncResource` 的实例用于创建一个新的异步操作上下文。在该上下文中运行的代码能够通过异步钩子的 API 追踪到，这样就能保留和管理异步操作过程中的状态信息。

### 实际例子

假设你正在开发一个 Web 服务器，每当接收到请求时，你需要记录请求的相关信息，并在整个异步处理流程中保持对这些信息的访问。

```javascript
const async_hooks = require("async_hooks");
const http = require("http");

// 创建一个异步上下文存储
const asyncLocalStorage = new async_hooks.AsyncLocalStorage();

http
  .createServer((req, res) => {
    // 当一个新请求进来时，创建一个新的上下文
    asyncLocalStorage.run(new Map(), () => {
      // 将请求信息保存在当前上下文中
      asyncLocalStorage.getStore().set("url", req.url);

      // 处理请求
      handleRequest(req, res);
    });
  })
  .listen(8080);

function handleRequest(req, res) {
  // 异步进行数据库查询或其他操作
  setImmediate(() => {
    // 即便是在异步回调中，我们也能获取到保存的请求信息
    const url = asyncLocalStorage.getStore().get("url");
    console.log(`处理请求的URL: ${url}`);

    // 响应请求
    res.end(`请求路径是: ${url}`);
  });
}
```

在这个例子中，我们使用 `async_hooks.AsyncLocalStorage` 类，它是基于 `AsyncResource` 的一个高级抽象，来创建一个与当前请求绑定的本地存储。无论是在原始请求处理函数还是在稍后的任何异步回调中，都能够安全地访问这个存储并获取请求的 URL 信息。

这样，我们就实现了跨异步操作的状态保持，而不用担心回调之间的上下文丢失。这对于日志记录、事务管理、用户身份验证等场景非常有用。

### [Static method: AsyncResource.bind(fn[, type[, thisArg]])](https://nodejs.org/docs/latest/api/async_context.html#static-method-asyncresourcebindfn-type-thisarg)

Node.js 中的`AsyncResource.bind(fn[, type[, thisArg]])`是关于异步资源和异步上下文跟踪的一个特性。在解释这个方法之前，让我们先简单了解一下相关的概念。

**异步编程：**
Node.js 非常擅长处理异步操作，比如文件读写、网络请求等。这意味着你可以触发一个操作，并且在它完成时得到通知，而不需要阻塞程序的其他部分。

**异步上下文（Async Context）：**
当你在 Node.js 中运行异步代码时，Node.js 需要跟踪当前的执行环境——即所谓的“上下文”。这是因为异步操作可能会在未来的某个时间点完成，而到那时当前的执行环境可能已经完全不同了。

**异步资源（AsyncResource）：**
异步资源是一个类，它的实例代表了一个具体的异步操作。通过使用`AsyncResource`，你可以创建一个新的异步事件，然后 Node.js 将能够正确地跟踪该事件的上下文。

现在，让我们来看看`AsyncResource.bind()`方法。

### `AsyncResource.bind(fn[, type[, thisArg]])`

这个静态方法允许你创建一个新的函数（通常称为绑定函数），当调用这个绑定函数时，它会运行原始函数`fn`，并确保在原始函数执行期间，异步操作的上下文被正确地保持和跟踪。

参数：

- `fn`: 要被绑定的原始函数。
- `type`: 可选参数，为你创建的异步资源指定一个类型名称，这主要用于调试。
- `thisArg`: 可选参数，绑定函数里`this`的值。

**实际应用示例：**

假设你正在编写一个 Node.js 的 Web 服务器，并且在处理某些请求时，需要在多个异步操作中保持用户的身份信息。通常情况下，由于 Node.js 的异步性质，你可能会丢失用户的上下文信息。为了解决这个问题，你可以使用`AsyncResource`：

```javascript
const { AsyncResource } = require("async_hooks");
const fs = require("fs");

// 假设这是你的用户上下文信息
const userContext = {
  userId: "abc123",
};

// 创建一个异步资源
const asyncResource = new AsyncResource("RequestHandler");

function logUserData(callback) {
  // 使用 AsyncResource.bind() 绑定回调函数，以便在当前异步资源的上下文中运行
  fs.readFile(
    "/path/to/user/data.txt",
    asyncResource.bind((err, data) => {
      if (err) throw err;
      // 即使在异步读取文件之后，我们仍然可以访问userContext
      console.log("User Data for:", userContext.userId);
      callback(data);
    })
  );
}

// 处理请求，最终调用logUserData
function handleRequest(req, res) {
  // 执行异步操作，同时传递一个回调函数
  logUserData((data) => {
    // 当数据被读取完毕后，发送给客户端
    res.end(data);
  });
}
```

在这个例子中，我们定义了一个`logUserData()`函数，它读取用户数据的异步操作，并且我们希望在文件读取完成后还能访问到`userContext`。为此，我们使用`asyncResource.bind()`将回调函数与当前的异步资源上下文绑定。这样，无论何时回调函数被执行，它都能够访问到当初创建异步资源时的上下文环境，在这种情况下就是`userContext`对象。

### [asyncResource.bind(fn[, thisArg])](https://nodejs.org/docs/latest/api/async_context.html#asyncresourcebindfn-thisarg)

`asyncResource.bind(fn[, thisArg])` 是 Node.js 中 Async Hooks 模块的一个方法，这个模块主要用于监视异步资源的生命周期。在这里，异步资源是指那些如定时器、网络请求等需要回调函数的操作。

为了让你更好理解 `asyncResource.bind()`，我们先来弄明白几个概念：

1. **异步编程**: 在 Node.js 中，我们经常会进行异步编程。这意味着某些代码的执行不会立即完成，而是在未来的某个时间点完成。比如，当你从数据库读取数据或者从互联网下载文件时，程序会继续运行而不会等待这些操作完成。

2. **异步资源**: 当你启动一个异步操作（比如读取文件），Node.js 会创建一个异步资源，它代表了那个操作。

3. **回调函数**: 这是当异步操作完成时将被调用的函数。例如，当文件读取完毕后，用于处理文件内容的函数。

4. **执行上下文**: 在 JavaScript 中，每次函数被调用时，都会有一个与之相关的上下文（也称作作用域），在其中可以访问特定的变量和函数。

现在说到 `asyncResource.bind(fn[, thisArg])` 方法：

- `fn`: 这个参数是你想要执行的回调函数。
- `thisArg`: （可选）当回调函数作为方法调用时，你可以通过这个参数设置 `this` 的值。

`asyncResource.bind(fn[, thisArg])` 方法的作用是返回一个新的函数，当你调用这个新函数时，原始的回调函数 `fn` 将在 `asyncResource` 创建的异步资源的上下文中执行。这就确保了无论何时何地调用这个新函数，它都能正确地关联到创建它的异步资源的上下文。

举例说明：

假设我们正在开发一个服务器，当收到一个用户请求时，我们要查询数据库并返回一些数据。在数据库查询完成后，我们需要执行一个回调函数来处理结果：

```javascript
const { AsyncResource } = require("async_hooks");
const fs = require("fs");

// 假设这是我们处理数据库查询结果的回调
function databaseQueryCallback(err, data) {
  // 这里可以处理查询结果
  console.log(data);
}

// 创建一个异步资源实例
const asyncResource = new AsyncResource("DATABASE_QUERY");

// 假设这是我们接收到用户请求时调用的函数
function onUserRequest() {
  // 绑定回调函数到异步资源的执行上下文
  const boundCallback = asyncResource.bind(databaseQueryCallback);

  // 执行数据库查询，并传入绑定了上下文的回调函数
  simulateDatabaseQuery(boundCallback);
}

// 模拟数据库查询函数
function simulateDatabaseQuery(callback) {
  // 使用 fs 模拟异步操作
  fs.readFile("data.txt", callback);
}

// 模拟用户请求
onUserRequest();
```

在这个例子中，`onUserRequest()` 函数模拟了接收到用户请求的情况。我们创建了一个名为 `DATABASE_QUERY` 的 `AsyncResource` 实例。然后我们使用 `asyncResource.bind(databaseQueryCallback)` 来确保 `databaseQueryCallback` 在 `simulateDatabaseQuery` 异步操作完成后执行时，仍然在 `DATABASE_QUERY` 资源的上下文中运行。这样帮助我们追踪和管理异步操作，尤其是在复杂的应用中，确保代码的逻辑正确性。

### [asyncResource.runInAsyncScope(fn[, thisArg, ...args])](https://nodejs.org/docs/latest/api/async_context.html#asyncresourceruninasyncscopefn-thisarg-args)

好的，让我们来详细了解一下 Node.js 中 `asyncResource.runInAsyncScope(fn[, thisArg, ...args])` 这个方法。

首先，这个方法是属于 Node.js 的异步资源管理中的部分。在 JavaScript 和 Node.js 中，我们经常会处理异步操作，比如读取文件、请求网络数据等。这些操作通常不会立即完成，而是在未来的某个时刻完成。Node.js 使用事件循环（Event Loop）来处理这样的异步操作。

但是，在异步编程中，有一个常见的问题是跟踪和管理异步操作的上下文。也就是说，当你启动一个异步操作时，可能需要确保在操作完成时能够知道它是在哪里启动的，以及相关的上下文信息。例如，在处理用户请求时，你可能需要知道请求是由哪个用户发起的，即使在请求的处理过程中有多个异步调用发生。

为了解决这个问题，Node.js 提供了 Async Hooks 模块，它可以创建异步资源，并在整个异步操作的生命周期内保持它们的上下文信息。

现在，让我们看看 `asyncResource.runInAsyncScope(fn[, thisArg, ...args])` 方法：

- `asyncResource` 是一个异步资源对象，它代表一个特定的异步操作。
- `runInAsyncScope` 是 asyncResource 对象的一个方法，它允许你执行一个函数 `fn`，同时保持这个函数的执行上下文与创建 asyncResource 时的上下文相同。
- `fn` 是要执行的函数。
- `thisArg` （可选）是当调用 `fn` 时 `this` 的值。
- `...args` （可选）是传递给 `fn` 的参数。

举个例子：

```javascript
const { AsyncResource, executionAsyncId } = require("async_hooks");
const fs = require("fs");

// 创建一个新的异步资源实例，'request' 可以是任意命名，表示资源类型
const asyncResource = new AsyncResource("request");

// 模拟一个异步操作，例如从文件系统读取文件
fs.readFile("/path/to/file", (err, data) => {
  // 这个回调是异步的，它的执行上下文已经和创建它的上下文不同了
  // 使用 asyncResource.runInAsyncScope 来恢复创建时的上下文
  asyncResource.runInAsyncScope(() => {
    // 在这里，executionAsyncId() 将返回创建 asyncResource 时的异步ID
    console.log("执行上下文ID:", executionAsyncId());

    // 处理文件数据或错误...
  });
});

// 在异步操作外部，executionAsyncId 返回当前的执行上下文ID
console.log("外部执行上下文ID:", executionAsyncId());
```

在这个例子中，我们通过 `AsyncResource` 创建了一个名为 'request' 的新的异步资源实例。接着我们模拟了一个异步的文件读取操作。在文件读取的回调函数中，我们使用了 `asyncResource.runInAsyncScope` 来执行另一个函数，这样做是为了确保该函数内部的异步上下文 ID 与创建 `asyncResource` 时的 ID 相同，这对于跟踪和诊断异步操作非常有用。

简单来说，`asyncResource.runInAsyncScope` 让你可以安全地运行代码并保持异步操作的上下文，这对于编写复杂的异步程序至关重要。

### [asyncResource.emitDestroy()](https://nodejs.org/docs/latest/api/async_context.html#asyncresourceemitdestroy)

好的，让我们来谈谈 Node.js 中的 `asyncResource.emitDestroy()` 方法。

在 Node.js 中，`async_hooks` 模块是用来追踪应用程序中异步操作的。每当你创建一个异步资源（比如一个定时器、一个 Promise、或者是一个调用了某个异步函数的操作），这个资源就会被 `async_hooks` 跟踪。

`async_hooks` 模块允许你注册钩子(hooks)，它们会在异步资源的生命周期的特定点被触发。这些点包括：

- 初始化（init）: 当一个异步资源被创建时
- 在回调之前（before）: 当一个异步事件准备调用它的回调函数时
- 在回调之后（after）: 当一个异步事件的回调函数执行完毕时
- 销毁（destroy）: 当一个异步事件不再需要，并准备被垃圾收集时

现在，`asyncResource.emitDestroy()` 是一个方法，它属于 `AsyncResource` 类，这个类是 `async_hooks` 模块提供的。你可以使用 `AsyncResource` 来创建表示异步操作的资源，而 `emitDestroy()` 方法则用来手动触发 "销毁" 钩子。

让我举个例子帮助你更好地理解。假设你正在编写一段代码，这段代码中需要处理很多用户的请求，而这些请求都是异步的。为了追踪每个请求何时结束（可能是因为已经完成，或者是出错），你想要知道资源什么时候被销毁。

```javascript
const async_hooks = require("async_hooks");

// 创建一个异步钩子实例，注册 destroy 钩子
const hook = async_hooks.createHook({
  destroy(asyncId) {
    console.log(`资源 ${asyncId} 被销毁了`);
  },
});

// 激活钩子
hook.enable();

// 使用 AsyncResource 创建一个表示异步资源的实例
class MyResource extends async_hooks.AsyncResource {
  constructor() {
    super("MyResource");
  }

  // 做一些异步操作，例如模拟一个异步请求
  async doSomethingAsync() {
    // ...
    // 请求完成或出错之后，我们想要释放资源
    this.emitDestroy(); // 手动触发销毁
  }
}

// 创建并使用 MyResource 实例
const myResource = new MyResource();
myResource.doSomethingAsync();

// 输出可能会是：资源 `<`id> 被销毁了 (其中 `<`id> 是分配给该资源的唯一标识符)
```

在这个例子中，每当 `myResource.doSomethingAsync()` 完成它的工作后，我们通过调用 `myResource.emitDestroy()` 来告诉 Node.js：这个异步操作已经完成，相应的资源可以被认为是“销毁”的，即它不再需要了。这就会触发我们定义的 `destroy` 钩子，然后控制台会打印出消息。

在实际应用中，你可能会使用这种机制来清理资源，或者是收集关于异步操作何时完成的统计信息。这对于诊断内存泄漏和理解应用程序的行为非常有用。

总结一下，`asyncResource.emitDestroy()` 是一个高级功能，用于在你确定某个异步资源不再需要时，手动通知 Node.js 的 `async_hooks` 系统。这在管理和跟踪复杂的异步逻辑时非常有用。

### [asyncResource.asyncId()](https://nodejs.org/docs/latest/api/async_context.html#asyncresourceasyncid)

在 Node.js 中，`asyncResource.asyncId()` 是一个函数，用于获取异步资源的唯一标识符。要理解这个函数，首先得了解一下 Node.js 中的异步编程和异步资源的概念。

异步编程允许程序执行其他任务而不必等待一个长时间运行的操作完成。在 Node.js 中，我们经常处理异步操作，比如文件读写、网络请求或者定时器等。

当你启动一个异步操作时，Node.js 会创建一个表示该操作的“异步资源”。每个异步资源都有一个唯一的 ID，即“异步 ID”，这就是`asyncResource.asyncId()`返回的内容。

现在来看一下 `asyncResource.asyncId()` 具体是怎么使用的，以及它的实际应用。但是在具体例子之前，需要明白这个 API 大多数情况下被用于底层库或工具的开发，普通应用开发者很少直接与之打交道。

假设你正在开发一个 Node.js 应用监控工具，你想追踪和记录特定异步操作的生命周期，那么 `asyncResource.asyncId()` 会非常有用。例如：

```javascript
const { AsyncResource } = require("async_hooks");

// 假设这是你的异步操作
function someAsyncOperation(callback) {
  // 创建一个异步资源
  const asyncResource = new AsyncResource("SOME_OPERATION_TYPE");

  // 开始异步操作
  setTimeout(() => {
    // 在回调之前运行你的代码，可以使用asyncResource.bind()来确保上下文正确。
    asyncResource.runInAsyncScope(() => {
      // 这里可以获取到当前异步资源的asyncId
      const id = asyncResource.asyncId();
      console.log(`The async ID is: ${id}`);

      // 执行真正的回调函数
      callback();
    });

    // 你可以在这里执行清理工作
    asyncResource.emitDestroy();
  }, 100);
}

someAsyncOperation(() => {
  console.log("Async operation completed");
});
```

在这段代码中，我们创建了一个名为 `SOME_OPERATION_TYPE` 的异步资源。当 `setTimeout` 被调用时，我们通过 `asyncResource.runInAsyncScope` 来关联异步操作和资源，并在内部获取该资源的 `asyncId`。

这种方式能够帮助我们监控和追踪异步资源从创建到销毁的整个过程。在开发复杂应用或者进行性能优化时，这信息非常重要，因为它可以帮助我们找出可能的内存泄露或者无效的异步调用。

### [asyncResource.triggerAsyncId()](https://nodejs.org/docs/latest/api/async_context.html#asyncresourcetriggerasyncid)

好的，让我们一起来了解一下 Node.js 中 `asyncResource.triggerAsyncId()` 这个方法。

Node.js 是一个基于 Chrome 的 V8 JavaScript 引擎构建的平台，它允许你在服务器端运行 JavaScript 代码。Node.js 提供了很多模块和 API 来处理不同的任务，例如文件系统操作、网络通信等。在这些任务中，经常涉及到异步编程，即你发起一个任务并且立即返回，而任务的完成会在未来的某个时间点。

为了更好地跟踪和管理异步操作，Node.js 引入了 Async Hooks 模块，并且在其中定义了 `asyncResource.triggerAsyncId()` 方法。

### asyncResource.triggerAsyncId()

`asyncResource.triggerAsyncId()` 是 Async Hooks 模块中的一个方法，用于获取触发（创建）`asyncResource` 的异步资源的 ID。简单来说，当你创建了一个异步资源（比如一个定时器、Promise、或者异步 I/O），Node.js 会给这个资源分配一个唯一的 ID 我们称之为 `asyncId`。

`asyncResource` 是 Async Hooks 中用来表示特定的异步操作的对象。一个 `asyncResource` 可能是由另

### [Using AsyncResource for a Worker thread pool](https://nodejs.org/docs/latest/api/async_context.html#using-asyncresource-for-a-worker-thread-pool)

当然，我会为你详细解释 Node.js 中 AsyncResource 在 Worker 线程池中的使用，并且尽量通俗易懂。

首先，让我们了解几个基本概念：

1. **Node.js** 是一个能让 JavaScript 运行在服务器端的平台。
2. **异步编程（Asynchronous Programming）**：在 Node.js 中，很多操作是异步的，比如读写文件，网络请求等。这意味着你可以发起一个操作，并在它完成时得到通知，而不是等待它完成才继续执行其他代码。
3. **Async Hooks**: 这是 Node.js 提供的一套 API，用来追踪异步资源的生命周期事件，比如创建、销毁等。
4. **AsyncResource**: 这是 `async_hooks` 模块中的一个类，用于为手动创建的异步操作创建一个新的异步资源。
5. **Worker 线程（Worker Threads）**：Node.js 允许我们创建额外的线程来处理任务，这些线程称为 Worker 线程。它们可以帮助我们在后台执行 CPU 密集型任务，而不会阻塞主线程。

现在，我们将结合这些概念来理解如何在 Worker 线程池中使用 AsyncResource。

在一个典型的 Node.js 应用程序中，可能有很多并发的异步操作正在进行。如果我们想要确保这些操作的上下文（例如用户信息，请求特定数据）在整个异步操作过程中保持不变，这时候就需要 Async Hooks 和 AsyncResource 了。

使用 Worker 线程池时，我们可能想要确保这些工作线程正确地管理和传递异步操作的上下文。例如，假设你有一个 Web 服务器，并且每个请求都可能被分配给一个 Worker 线程去处理。在此场景中，你可能需要跟踪每个请求的信息，并且在异步操作中保持这些信息的一致性。

这里有一个简化的例子来说明如何使用 AsyncResource：

```javascript
const { AsyncResource } = require("async_hooks");
const {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} = require("worker_threads");

if (isMainThread) {
  // 主线程部分
  const worker = new Worker(__filename, {
    workerData: { query: "select * from table" }, // 假设这是一个数据库查询请求
  });

  worker.on("message", (result) => {
    console.log(result); // 收到 Worker 线程的处理结果
  });
} else {
  // Worker 线程部分
  const asyncResource = new AsyncResource("SQLQuery");

  process.nextTick(() => {
    asyncResource.runInAsyncScope(() => {
      // 在这里执行异步操作，比如数据库查询
      // 假设完成查询，然后返回结果
      const result = "query result";
      parentPort.postMessage(result);
    });
  }, workerData.query);
}
```

在这个例子中：

- 我们创建了一个新的 Worker 线程来处理数据库查询请求。
- 在工作线程内部，我们创建了一个名为 `SQLQuery` 的 `AsyncResource` 实例。这个实例代表了我们即将进行的数据库查询异步操作。
- 使用 `asyncResource.runInAsyncScope()` 方法把数据库查询的异步操作包裹起来，确保异步操作在正确的异步上下文中执行。
- 当 Worker 线程完成任务后，它通过 `parentPort.postMessage()` 向主线程发送消息。

通过这种方式，我们可以维护和管理复杂的异步操作流程，同时保证每一步都可以追踪到正确的上下文信息。在实际应用中，这对于调试、性能跟踪以及保持代码的清晰和可维护性非常重要。

### [Integrating AsyncResource with EventEmitter](https://nodejs.org/docs/latest/api/async_context.html#integrating-asyncresource-with-eventemitter)

好的，首先让我们了解一下 Node.js 中 AsyncResource 和 EventEmitter 这两个概念：

1. **AsyncResource**: 这是一个来自 `async_hooks` 模块的类，它用于创建一个新的异步资源。在 Node.js 中，很多操作都是异步的，比如文件读写、网络请求等。AsyncResource 让你能够为这些异步操作创建一个上下文，保证在操作开始和结束时可以追踪到资源的状态。

2. **EventEmitter**: 这是 Node.js 的事件触发器，它允许对象发布（emit）事件并注册监听器来响应这些事件。例如，当一个 HTTP 服务器收到一个请求时，它可能会发出一个 'request' 事件。

在 Node.js v21.7.1 中，有关 `Integrating AsyncResource with EventEmitter` 的部分主要说明了如何将这两者结合使用，以确保异步上下文在事件触发时得到正确的传递和管理。

举一个例子来说，假设你有一个处理 HTTP 请求的程序，每当有新的连接时，服务器都会触发一个事件。如果你想追踪这个事件处理过程中的异步操作，并确保所有相关的回调都与该事件的上下文相关联，那么你可以使用 `AsyncResource` 来 “包装” 事件发射器（EventEmitter）。

示例代码可能看起来像这样：

```javascript
const { AsyncResource, executionAsyncId } = require("async_hooks");
const { EventEmitter } = require("events");

// 创建一个继承 EventEmitter 的类
class MyEmitter extends EventEmitter {
  emitWithAsyncResource(event, ...args) {
    // 创建一个 AsyncResource 实例
    const asyncResource = new AsyncResource("MyEmitter", {
      triggerAsyncId: executionAsyncId(),
    });

    // 使用 runInAsyncScope 来调用原始的 emit 方法，保证回调函数的执行在正确的异步上下文中
    asyncResource.runInAsyncScope(() => {
      super.emit(event, ...args);
    });

    // 销毁 AsyncResource 实例
    asyncResource.emitDestroy();
  }
}

// 创建一个 MyEmitter 实例
const myEmitter = new MyEmitter();

// 注册一个监听器
myEmitter.on("event", () => {
  // 在这个函数里，你可以获取到当前的异步 ID
  console.log(`处理事件时的异步 ID: ${executionAsyncId()}`);
});

// 发射事件
myEmitter.emitWithAsyncResource("event");
```

在这个例子中，我们定义了一个名为 `MyEmitter` 的类，它继承了 `EventEmitter`。我们添加了一个名为 `emitWithAsyncResource` 的方法，它创建了一个 `AsyncResource` 并使用 `runInAsyncScope` 方法来触发事件。这样，无论何时发生事件，回调函数都会在与事件相对应的异步上下文中运行。这使得跟踪和管理异步操作变得更加简单，特别是在复杂的应用程序中，需要追踪诸如性能度量或日志记录等任务时。
