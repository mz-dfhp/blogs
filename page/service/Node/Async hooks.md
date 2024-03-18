# [Async hooks](https://nodejs.org/docs/latest/api/async_hooks.html#async-hooks)

好的，我们来聊一聊 Node.js 中的 Async Hooks。

Async Hooks 是 Node.js 的一个模块，用于跟踪异步资源的生命周期。在 Node.js 中，很多操作都是异步的，比如文件读写、网络请求等。这些异步操作在背后由事件循环(Event Loop)管理，而 Async Hooks 就提供了一种方法来观察和跟踪这些异步资源的状态变化。

在深入之前，首先要理解几个关键概念：

- 异步资源(Async Resource)：这指的是任何有一个或多个回调函数的对象。例如，当你发起一个 HTTP 请求，这个请求就是一个异步资源。
- 生命周期(Lifecycle)：从一个异步资源被创建（如启动一个 HTTP 请求）到完成它的使命并销毁（如得到响应并处理完数据）的整个过程。

Async Hooks 提供了以下几个主要的钩子函数（hooks）：

1. init：每当一个异步资源被创建时，`init` 钩子就会被触发。
2. before：在异步资源的回调即将被执行之前，`before` 钩子会被触发。
3. after：异步资源的回调执行完后，`after` 钩子会被触发。
4. destroy：当一个异步资源被销毁时，`destroy` 钩子会被触发。

现在让我们来看几个实际的例子：

### 例子 1：追踪异步操作

假设你想了解在你的 Node.js 应用中，有哪些异步操作被创建和销毁。你可以使用 Async Hooks 的 `init` 和 `destroy` 钩子来跟踪它们：

```javascript
const async_hooks = require("async_hooks");

// 创建一个 AsyncHook 实例
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    console.log(`一个新的异步资源被创建了，ID是：${asyncId}, 类型是：${type}`);
  },
  destroy(asyncId) {
    console.log(`一个异步资源被销毁了，ID是：${asyncId}`);
  },
});

// 激活 AsyncHook
hook.enable();

// 进行一个简单的异步操作，比如 setTimeout
setTimeout(() => {
  console.log("定时器的回调函数执行了");
}, 1000);

// 当你运行上面的代码时，你会看到输出类似于以下内容：
// 一个新的异步资源被创建了，ID是：2, 类型是：TIMERWRAP
// 定时器的回调函数执行了
// 一个异步资源被销毁了，ID是：2
```

### 例子 2：维护异步上下文

有时候，我们需要在异步操作中保持上下文信息，Async Hooks 的 `executionAsyncId` 函数可以帮我们做到这点。

```javascript
const async_hooks = require("async_hooks");
const fs = require("fs");

// 用于存储异步操作上下文的 Map
const asyncContext = new Map();

// 获取当前执行上下文的 ID
function eid() {
  return async_hooks.executionAsyncId();
}

// 创建一个 AsyncHook 实例
const hook = async_hooks.createHook({
  init(asyncId) {
    const currentEid = eid();
    if (asyncContext.has(currentEid)) {
      asyncContext.set(asyncId, asyncContext.get(currentEid));
    }
  },
  destroy(asyncId) {
    asyncContext.delete(asyncId);
  },
});

// 激活 AsyncHook
hook.enable();

// 模拟一个异步操作，比如读取文件，并在其上下文中保留一些信息
asyncContext.set(eid(), { fileName: "example.txt" });

fs.readFile("example.txt", (err, data) => {
  if (err) throw err;
  const context = asyncContext.get(eid());
  console.log(`在文件 ${context.fileName} 的回调里，内容是：${data}`);
});
```

在这个例子中，我们通过 `init` 钩子将当前的执行上下文 ID 关联的信息复制到新创建的异步资源中，然后在 `destroy` 钩子中清除它。

这样，无论你的异步操作有多么复杂，只要它们之间存在父子关系，你就能通过 `asyncContext` Map 来追踪每个操作的上下文。

这些示例仅展示了 Async Hooks 功能的一小部分。在实际应用中，Async Hooks 可用于开发复杂的异步跟踪系统、诊断工具，以及为异步操作维护上下文信息等。不过值得注意的是，因为这是一个相对底层的 API，可能会对性能产生影响，所以在生产环境中使用时需要格外谨慎。

## [Terminology](https://nodejs.org/docs/latest/api/async_hooks.html#terminology)

Node.js 中的 `async_hooks` 模块是一个用于追踪 Node.js 应用中异步操作的模块。在详细解释这个模块之前，先来了解一下异步编程。

在 Node.js 中，许多操作都是异步的，比如读取文件、数据库操作或者网络请求。异步编程允许程序在等待这类操作完成时继续执行其他代码，而不是停下来等待操作完成。这使得 Node.js 可以高效地处理并发操作。

然而，异步编程也带来了一些复杂性。例如，跟踪一个操作从开始到结束的整个生命周期，尤其是当有很多异步操作交错执行时，就变得相当困难。

这就是 `async_hooks` 模块发挥作用的地方。它提供了一种机制，使开发人员能够跟踪应用程序中的异步资源（例如，异步操作）的生命周期。现在我们来看一下 `async_hooks` 文档中提到的一些术语：

1. **异步资源 (async resource)**: 一个代表异步操作的对象。每当在 Node.js 中创建一个新的异步操作，如设置一个定时器、发起一个 HTTP 请求等，就会创建一个新的异步资源。

2. **触发异步资源 (trigger async resource)**: 引发另一个异步资源被创建的原始资源。例如，如果你在读取文件操作的回调函数中发起了一个网络请求，则读取文件的操作是触发网络请求被创建的资源。

3. **执行上下文 (execution context)**: 在任何给定时刻，代码正被执行的环境或范围。在 Node.js 中，由于异步操作，执行上下文可能会快速改变。

4. **异步钩子 (async hooks)**: 一组用于追踪异步资源生命周期事件的回调函数。开发者可以通过定义这些回调函数来监听异步资源的创建、销毁等事件。

举几个实际运用的例子：

1. **性能监控**: 假设你正在开发一个网站，并想要监控服务器上的所有异步操作以优化性能。使用 `async_hooks` 你可以跟踪每个异步操作的开始和结束时间，分析耗时较长的操作，并进行优化。

```javascript
const async_hooks = require("async_hooks");

let indent = 0;
function printEvent(event) {
  console.log(`${" ".repeat(indent)}${event}`);
}

const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    printEvent(
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}`
    );
    indent += 2;
  },
  before(asyncId) {
    printEvent(`before: ${asyncId}`);
  },
  after(asyncId) {
    indent -= 2;
    printEvent(`after: ${asyncId}`);
  },
  destroy(asyncId) {
    printEvent(`destroy: ${asyncId}`);
  },
});

hook.enable();
// 执行一些异步操作
```

2. **资源跟踪**: 如果你的 Node.js 应用出现内存泄漏，你可能需要知道哪些资源没有被正确清理。通过 `async_hooks` 你可以追踪异步资源何时被创建和销毁，帮助你找出潜在的内存泄漏源头。

```javascript
const async_hooks = require("async_hooks");
const fs = require("fs");

// 创建一个 Map 来存储异步资源信息
const asyncResources = new Map();

async_hooks
  .createHook({
    init(asyncId, type) {
      asyncResources.set(asyncId, { type, timestamp: Date.now() });
    },
    destroy(asyncId) {
      asyncResources.delete(asyncId);
    },
  })
  .enable();

// 稍后检查未被销毁的资源
setTimeout(() => {
  for (const [id, info] of asyncResources) {
    const lifetime = Date.now() - info.timestamp;
    fs.writeSync(
      1,
      `Resource ${id} of type ${info.type} is still alive after ${lifetime}ms\n`
    );
  }
}, 10000);

// 触发异步操作
```

以上例子展示了如何使用 `async_hooks` 模块的基本功能来监控和跟踪异步资源。注意，虽然这个模块非常强大，但它也可能引入了额外的性能开销，因此应该仅在必要时使用，并且在生产环境中谨慎启用。

## [Overview](https://nodejs.org/docs/latest/api/async_hooks.html#overview)

Node.js 的 `async_hooks` 模块允许我们追踪异步资源的生命周期。在 Node.js 中，很多操作都是异步的，比如读取文件、发起网络请求等。这些异步操作在背后使用了所谓的“异步资源”来处理任务并在未来某个时间点返回结果。`async_hooks` 就是用来帮助开发者了解和追踪这些异步资源的创建、销毁以及状态的变化。

当 Node.js 执行异步操作时，会创建一个异步资源，并为其分配一个唯一的标识符（ID）。`async_hooks` 模块提供了几个关键的钩子函数，允许你在异步资源的整个生命周期中执行自己的代码，这些钩子包括：

1. `init`: 当创建一个新的异步资源时会被调用。
2. `before`: 当一个异步操作即将调用回调之前会被调用。
3. `after`: 当异步操作完成、回调函数被调用后会被调用。
4. `destroy`: 当一个异步资源被销毁时会被调用。
5. `promiseResolve`: 当一个 Promise 被 resolve 时会被调用。

### 实际应用例子

#### 追踪异步操作

假设你正在编写一个 Node.js 应用程序，并且想要统计异步操作的数量以及它们何时开始和结束。你可以使用 `async_hooks` 来追踪这些信息。

```javascript
const async_hooks = require("async_hooks");
const fs = require("fs");

// 用来存储异步资源 ID 的集合
const asyncIds = new Set();

const hooks = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    asyncIds.add(asyncId);
    fs.writeSync(1, `Async resource ${type} with ID ${asyncId} was created\n`);
  },
  destroy(asyncId) {
    asyncIds.delete(asyncId);
    fs.writeSync(1, `Async resource with ID ${asyncId} was destroyed\n`);
  },
});

hooks.enable();

// 一段异步操作，例如定时器
setTimeout(() => {
  console.log("Timer callback executed");
}, 1000);

// 假设这里还有更多的异步操作...
```

在上面的例子中，我们创建了一个 `async_hooks` 实例，并定义了 `init` 和 `destroy` 钩子。每当有新的异步资源被创建或销毁时，我们打印出相关的信息。这对于调试和理解你的 Node.js 程序的行为非常有用。

#### 诊断内存泄漏

在复杂的 Node.js 应用程序中，可能会遇到内存泄漏问题。`async_hooks` 可以帮助你诊断哪些异步资源没有被正确地清理，从而导致内存泄漏。

通过跟踪 `init` 和 `destroy` 钩子，你可以发现哪些资源被创建但从未被销毁，这些资源可能是造成内存泄漏的罪魁祸首。

#### 性能监控

你可以使用 `async_hooks` 来监控异步操作的性能。通过记录异步资源的创建时间和结束时间，你可以计算出每个异步操作的持续时间，并找出应用程序中的潜在性能瓶颈。

### 注意事项

虽然 `async_hooks` 是一个强大的工具，但它也会引入额外的性能开销，因为你需要为每个异步事件执行额外的代码。在生产环境中，你应该仔细评估是否真正需要使用 `async_hooks` 以及它对性能的影响。通常情况下，`async_hooks` 更适用于开发和调试阶段，或者在生产环境中进行短暂的性能分析和诊断。

## [async_hooks.createHook(callbacks)](https://nodejs.org/docs/latest/api/async_hooks.html#async_hookscreatehookcallbacks)

`async_hooks.createHook(callbacks)` 是 Node.js 中的一个高级 API，它允许你监控和追踪异步资源的生命周期。在 Node.js 应用程序中，很多操作（如文件读写、网络请求等）都是异步执行的，这意味着它们会在后台运行，而不会阻塞程序继续执行其他代码。

在异步编程中，跟踪和管理这些操作以及与之关联的资源（例如定时器、Promises、回调函数等）可能变得非常复杂。`async_hooks.createHook(callbacks)` 正是用来帮助开发者理解和控制这种复杂性的。

### 参数：

- `callbacks`：这是一个包含回调函数的对象，这些回调函数会在异步资源的不同生命周期事件发生时被调用。主要有以下几种：
  - `init`：当一个异步资源被创建时触发。
  - `before`：异步资源的回调即将被调用之前触发。
  - `after`：异步资源的回调完成后触发。
  - `destroy`：异步资源被销毁时触发。
  - `promiseResolve`：一个 Promise 被 resolve 时触发。

### 返回值：

这个方法返回一个 `AsyncHook` 实例，你可以使用这个实例来控制钩子的行为（比如启动或关闭钩子）。

### 实际使用例子：

1. **追踪异步操作**：假设你想知道在你的应用程序中何时创建了新的异步资源，以及它们何时完成。

```javascript
const async_hooks = require("async_hooks");
const fs = require("fs");

// 定义写日志的函数，这里简单地写到标准输出
function log(message) {
  fs.writeSync(1, `${message}\n`);
}

// 初始化 async_hook
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    log(`Async resource of type ${type} with ID ${asyncId} created`);
  },
  before(asyncId) {
    log(`Going to execute callback for resource with ID ${asyncId}`);
  },
  after(asyncId) {
    log(`Finished callback for resource with ID ${asyncId}`);
  },
  destroy(asyncId) {
    log(`Resource with ID ${asyncId} has been destroyed`);
  },
});

// 启动 hook
hook.enable();

// 一个示例异步操作：延时定时器
setTimeout(() => {
  log("Timeout callback executed");
}, 100);

// 稍后停止 hook
setTimeout(() => {
  hook.disable();
}, 200);
```

在上面的例子中，我们创建了一个 `async_hooks` 的实例，并定义了四个回调函数。每当创建、执行、完成后及销毁异步资源时，相应的回调就会执行，并且输出一条日志信息。

2. **诊断内存泄漏**：如果你怀疑你的 Node.js 应用有内存泄漏（即不再需要的对象没有被垃圾收集器清除），`async_hooks` 可以帮助你追踪那些可能没有被正确销毁的异步资源。

通过记录所有的 `init` 和 `destroy` 调用，并检查其中的差异，你能够发现已经初始化但尚未销毁的资源，进而分析造成内存泄漏的原因。

### 注意：

- `async_hooks` 是一个强大但复杂的 API。如果你刚开始学习编程，不必担心立即深入了解它。随着你对 Node.js 和异步编程的理解逐渐深入，你会更好地利用它来诊断和优化你的应用。
- 使用 `async_hooks` 可能会对性能产生影响，因为它增加了额外的计算工作。所以，在生产环境中，只在需要进行性能调试或问题诊断时才启用它。

### [Error handling](https://nodejs.org/docs/latest/api/async_hooks.html#error-handling)

好的，Node.js 中的 Error handling 是指如何处理程序运行时出现的错误。在 Node.js v21.7.1 版本中，特别是在 async_hooks 模块里，错误处理非常重要，因为异步操作可能会发生在不同的时间点和上下文中。

async_hooks 模块允许开发者跟踪系统中的资源（例如异步操作）的生命周期。这对于调试和理解复杂的异步逻辑特别有用。但是，由于异步操作的特性，错误可能不会在引起它们的同一堆栈上报告或处理。这就需要特别注意错误处理。

一个实际例子可以是：

假设我们有个简单的 Node.js 应用程序，我们正在使用 `fs` 模块异步读取文件内容，并且我们使用了 async_hooks 来跟踪异步操作：

```javascript
const fs = require("fs");
const async_hooks = require("async_hooks");

// 创建一个 AsyncHook 实例
const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    console.log(`异步资源被创建: ${asyncId}`);
  },
  destroy(asyncId) {
    console.log(`异步资源被销毁: ${asyncId}`);
  },
});

// 启用 AsyncHook
asyncHook.enable();

// 异步读取文件
fs.readFile("/path/to/file", (err, data) => {
  if (err) {
    // 这里处理错误
    console.error("读取文件出错:", err);
  } else {
    console.log("文件内容:", data);
  }
});

// 禁用 AsyncHook
asyncHook.disable();
```

在上面的代码中：

- 我们使用 `readFile` 方法异步读取文件。
- 如果读取成功，则在回调函数中输出文件内容。
- 如果读取失败，则在回调函数中输出错误信息。

同时，我们使用 `async_hooks` 模块的 `createHook` 方法来监听所有异步资源的创建和销毁。当一个异步资源（比如由 `fs.readFile` 创建的）被初始化和销毁的时候，我们的 `init` 和 `destroy` 回调函数会被执行，并打印对应的信息。

关于错误处理，值得注意的是，在 `fs.readFile` 的回调函数中，我们首先检查是否存在错误 (`err`)。如果 `err` 不为空，说明在读取文件过程中发生了错误，我们就进入错误处理逻辑，打印出错误信息。这种错误处理模式在 Node.js 中非常常见，即所谓的 "error-first callback"。

总结一下，错误处理在 Node.js 的 async_hooks 模块中非常关键，因为它帮助我们追踪和管理异步操作中可能发生的问题。我们需要在回调函数中始终检查错误，并妥善处理它们，以确保程序的稳定性和可靠性。

### [Printing in AsyncHook callbacks](https://nodejs.org/docs/latest/api/async_hooks.html#printing-in-asynchook-callbacks)

好的，我来解释一下 Node.js 中`AsyncHook`的基本概念和它在`v21.7.1`版本中的一个特性：`Printing in AsyncHook callbacks`。

首先，你需要了解什么是`AsyncHook`。

在 Node.js 中，异步操作非常常见。例如，当你读取文件、访问数据库或者发送网络请求时，通常都会使用异步函数。但这些异步操作的执行顺序有时候难以跟踪，尤其是在复杂的应用程序中。`AsyncHook`模块就是为了帮助我们更好地理解和追踪这些异步资源（例如定时器、Promise、回调等）的生命周期。

简单来说，`AsyncHook`可以让你设置钩子（hooks），这些钩子可以在异步资源的生命周期的不同阶段被触发。

`AsyncHook`提供了几个主要的回调：

- `init`: 当一个异步资源被创建时触发。
- `before`: 在异步资源的回调被调用之前触发。
- `after`: 在异步资源的回调被调用之后触发。
- `destroy`: 当一个异步资源被销毁时触发。

现在，我们来看一下`v21.7.1`版本中的特性`Printing in AsyncHook callbacks`。

这个特性说的是，在`AsyncHook`的回调里打印日志需要小心，因为任何在这些回调中进行的异步操作都可能导致程序的崩溃或者其他意外行为。举个例子，如果你在`init`回调中使用了`console.log`来打印日志，而`console.log`本身就是一个异步操作，这就可能引起递归调用，从而导致程序出问题。

为了解决这个问题，Node.js 建议在`AsyncHook`的回调中使用`process._rawDebug`而非`console.log`。`process._rawDebug`是一个同步方法，它可以避免引入额外的异步活动，从而安全地在`AsyncHook`回调中打印日志。

以下是一个实际的例子，演示如何在`AsyncHook`回调中安全地打印信息：

```javascript
const async_hooks = require("async_hooks");
const fs = require("fs");

// 定义AsyncHook钩子的回调
const hooks = {
  init(asyncId, type, triggerAsyncId) {
    process._rawDebug(
      `Async resource of type ${type} with ID ${asyncId} created.`
    );
  },
  before(asyncId) {
    process._rawDebug(`Before callback of asyncId ${asyncId}.`);
  },
  after(asyncId) {
    process._rawDebug(`After callback of asyncId ${asyncId}.`);
  },
  destroy(asyncId) {
    process._rawDebug(`Destroyed asyncId ${asyncId}.`);
  },
};

// 创建并启用AsyncHook实例
const asyncHook = async_hooks.createHook(hooks);
asyncHook.enable();

// 执行一个异步操作作为示例
fs.readFile(__filename, () => {
  process._rawDebug("Read file operation completed.");
});
```

在上面的代码示例中，我们定义了`AsyncHook`的 4 个回调，然后使用`process._rawDebug`在每个回调中打印相关信息，而不是使用`console.log`。通过这种方式，我们可以安全地监控异步资源的创建和销毁，而不会引入新的异步操作风险。

## [Class: AsyncHook](https://nodejs.org/docs/latest/api/async_hooks.html#class-asynchook)

Node.js 中的 AsyncHooks 模块提供了一种用于追踪异步资源（如 Promises、Timers、Callbacks 等）生命周期的机制。它允许你钩入异步操作的关键阶段，例如当它们被创建、销毁或触发回调时。

`AsyncHook` 是一个类，其中包含了几个关键的事件钩子函数来追踪异步资源的状态。使用 `AsyncHook` 类，可以创建出自己的实例，通过这些实例来监控和管理异步操作的生命周期。

下面详细介绍一下 `AsyncHook` 的基本原理和如何使用它：

### 创建 AsyncHook 实例

首先，你需要从 `async_hooks` 模块中引入 `AsyncHook` 类，并且创建实例。创建 AsyncHook 实例时，你可以传入一个包含不同生命周期回调的对象。主要的回调有以下几个：

- `init`: 当一个异步资源被创建时会被调用。
- `before`: 在异步资源的回调函数被调用之前会被调用。
- `after`: 在异步资源的回调函数完成后会被调用。
- `destroy`: 当一个异步资源被销毁时会被调用。

```js
const async_hooks = require("async_hooks");

// 创建 AsyncHook 实例
const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    // 当一个异步资源被创建时执行
  },
  before(asyncId) {
    // 异步资源的回调函数被调用之前执行
  },
  after(asyncId) {
    // 异步资源的回调函数完成后执行
  },
  destroy(asyncId) {
    // 一个异步资源被销毁时执行
  },
});
```

### 启动和停止 AsyncHook 实例

创建好了 `AsyncHook` 实例后，需要通过 `enable()` 方法启动它，通过 `disable()` 方法停止它。

```js
// 启动 AsyncHook
asyncHook.enable();

// 在某个时刻停止 AsyncHook
asyncHook.disable();
```

### 使用 AsyncHook 实例监控异步操作

假设我们想要监控一个简单的 `setTimeout` 函数：

```js
// 监控行为示例
asyncHook = async_hooks
  .createHook({
    init(asyncId, type, triggerAsyncId) {
      console.log(`异步资源被创建, 类型是: ${type}, 资源ID: ${asyncId}`);
    },
    before(asyncId) {
      console.log(`在调用异步资源ID ${asyncId} 的回调前`);
    },
    after(asyncId) {
      console.log(`在调用异步资源ID ${asyncId} 的回调后`);
    },
    destroy(asyncId) {
      console.log(`异步资源ID ${asyncId} 被销毁了`);
    },
  })
  .enable();

// 设置一个定时器
setTimeout(() => {
  console.log("setTimeout 的回调函数被执行");
}, 100);
```

以上代码中，我们创建了一个 `AsyncHook` 实例并启用它，然后设置了一个定时器。当定时器开始计时，会触发 `init` 回调；当定时器的时间到了准备执行回调时，会触发 `before`；执行完回调后，会触发 `after`；最后，当定时器相关的异步资源被 Node.js 清理时，会触发 `destroy`。

### 实际运用的例子

AsyncHook 可以在很多场景中发挥作用，比如：

- **性能监测**：通过记录异步资源的创建和销毁，可以监控和分析应用程序的性能问题。
- **调试**：如果你的应用有难以捉摸的异步错误，可以使用 AsyncHook 来跟踪异步调用栈。
- **资源管理**：在长期运行的应用中，避免内存泄漏是非常重要的，通过监控异步资源的生命周期，你可以确保资源得到正确释放。

尽管 `AsyncHook` 是一个强大的工具，但是请注意，它仍然是一个相对底层的 API，并且在生产环境中过度使用可能会对性能产生影响。因此，在生产环境中使用时需要谨慎。

### [asyncHook.enable()](https://nodejs.org/docs/latest/api/async_hooks.html#asynchookenable)

Node.js 的 `async_hooks` 模块是一个用于追踪应用中的异步资源（如 Promises、Timers、Callbacks 等）的生命周期事件的系统。`asyncHook` 实例的 `enable()` 方法则用于启动这种追踪。当你调用这个方法后，所有注册在该 `asyncHook` 实例上的回调函数都会在相应的异步事件发生时被触发。这对于理解和监控程序中的异步操作非常有用。

首先，让我们简单了解一下异步编程。在 Node.js 中，很多操作是异步的，比如从文件系统读取文件或者发起网络请求。异步操作通常不会立即完成，并且它们的执行不会阻塞程序的其他部分。Node.js 使用事件循环来处理异步操作，这样就可以在等待异步操作完成时执行其他代码。

现在，让我们通过几个例子来更具体地理解 `async_hooks`：

### 创建 AsyncHook

要使用 `async_hooks`，首先需要引入模块并创建一个 `AsyncHook` 实例。为此，需要定义几个回调函数，这些回调函数将在异步资源的不同生命周期阶段被调用：

```javascript
const async_hooks = require("async_hooks");

// 初始化回调
function init(asyncId, type, triggerAsyncId) {
  console.log(`异步资源被创建，资源ID：${asyncId}, 类型：${type}`);
}

// 在异步资源的回调被调用之前执行
function before(asyncId) {
  console.log(`即将执行异步回调，资源ID：${asyncId}`);
}

// 在异步资源的回调执行完毕后执行
function after(asyncId) {
  console.log(`完成执行异步回调，资源ID：${asyncId}`);
}

// 当异步资源被销毁时执行
function destroy(asyncId) {
  console.log(`异步资源被销毁，资源ID：${asyncId}`);
}

// 创建 AsyncHook 实例
const asyncHook = async_hooks.createHook({ init, before, after, destroy });
```

### 启用 AsyncHook

只有调用了 `enable()` 方法，上述的回调才会开始工作。

```javascript
asyncHook.enable();
```

### 实际运用的例子

来看一个具体的使用场景，假设你想追踪一个定时器（timer）的生命周期：

```javascript
asyncHook.enable(); // 启用我们的 asyncHook

setTimeout(() => {
  console.log("这是定时器的回调函数");
}, 100);

// 输出可能如下:
// 异步资源被创建，资源ID：2, 类型：TIMERWRAP
// 即将执行异步回调，资源ID：2
// 这是定时器的回调函数
// 完成执行异步回调，资源ID：2
// 异步资源被销毁，资源ID：2
```

在这个例子中，`setTimeout` 是一个异步操作。通过 `async_hooks`，我们能够追踪到与这个定时器相关的各个事件。当你运行这段代码时，它会按照异步事件发生的顺序打印出相关信息。

### 关闭 AsyncHook

如果不再需要监控异步事件，可以调用 `disable()` 方法停止追踪：

```javascript
asyncHook.disable();
```

### 应用场景

`async_hooks` 主要用于复杂应用的性能监控、调试以及跟踪异步资源的创建和销毁过程。例如，开发者可以利用它来检测内存泄漏，或者确保长时间运行的应用中异步资源被正确管理。

总结一下，`enable()` 方法是一个使你能够追踪应用中异步事件生命周期的强大工具，它可以帮助你更好地理解和优化你的 Node.js 应用。

### [asyncHook.disable()](https://nodejs.org/docs/latest/api/async_hooks.html#asynchookdisable)

Node.js 中的 Async Hooks 模块允许我们跟踪应用程序中异步操作的生命周期。当你开始使用 Node.js 时，会发现很多操作是异步的，比如读取文件、数据库操作或发起 HTTP 请求。

`asyncHook.disable()` 是 Async Hooks API 中的一个方法，它用来停用（禁用）特定的 Async Hook 实例。一旦调用了这个方法，之前通过 `asyncHook.enable()` 启用的钩子将不再触发任何回调。

### Async Hooks 简介

在 Node.js 中，每个异步资源（例如 Promise、Timeout、Callback）都由一个内部的异步 ID 来表示。Async Hooks 允许你注册几种类型的回调函数，这些回调会在异步资源的生命周期中的关键时刻被调用：

- `init`: 当一个异步资源被创建时触发。
- `before`: 异步资源的回调函数即将被调用时触发。
- `after`: 异步资源的回调函数已调用完成后触发。
- `destroy`: 异步资源销毁时触发。

### 使用 asyncHook.disable()

下面是一个实际的例子来说明如何使用 `asyncHook.disable()`：

假设你正在编写一个 Node.js 应用程序，需要追踪某些异步操作，例如何时有新的异步任务被创建。首先，你可以创建一个 Async Hook 实例并启用它，然后在某个时间点决定停止追踪：

```javascript
const asyncHooks = require("async_hooks");

// 初始化一个 Async Hook 实例
const myAsyncHook = asyncHooks.createHook({
  init(asyncId) {
    console.log(`异步资源被创建，其ID为：${asyncId}`);
  },
});

// 启用 Async Hook
myAsyncHook.enable();

// ... 这里可能会有一些异步操作 ...

// 假设在某个条件满足后，我们不再想追踪异步操作
if (conditionMet) {
  // 停用 Async Hook
  myAsyncHook.disable();
}
```

在上面的代码中，我们定义了一个新的 Async Hook 实例 `myAsyncHook`，它包含一个 `init` 回调，这个回调只会在异步资源被创建时打印出其 ID。我们用 `myAsyncHook.enable()` 方法启用了这个钩子。

随着程序的运行，如果触发了某个条件，比如 `conditionMet` 变为 `true`，我们就调用 `myAsyncHook.disable()` 来停用这个钩子。一旦停用，无论有多少异步资源被创建，`init` 回调都不会再被调用。

### 总结

`asyncHook.disable()` 方法在你需要终止监控异步资源的生命周期时非常有用。这可能是因为你已经收集了足够的性能数据或者不希望额外的监控影响应用程序的性能。记住，过度使用 Async Hooks 可能会对你的应用性能有负面影响，因此确保仅在需要的时候启用和禁用它们。

### [Hook callbacks](https://nodejs.org/docs/latest/api/async_hooks.html#hook-callbacks)

Node.js 中的 `async_hooks` 模块允许我们追踪异步资源的生命周期。异步资源是指在 Node.js 中使用异步操作（如定时器、promise、回调、等）时创建的对象。了解这些资源何时被创建和销毁，对于高级应用程序性能监测和调试非常有用。

在 `async_hooks` 模块中，"hook callbacks" 是一些特殊的函数，你可以设置它们来监听异步资源的不同生命周期事件。它们分别是：

1. `init` - 当一个异步资源被创建时触发。
2. `before` - 在异步资源的回调执行之前触发。
3. `after` - 在异步资源的回调执行之后触发。
4. `destroy` - 当一个异步资源被销毁时触发。
5. `promiseResolve` - 当一个`Promise`对象被 resolve 时触发。

下面我将分别对这些回调进行解释，并给出示例。

### init

此回调在异步资源创建时触发，可用于追踪资源在应用中的实例化。

```javascript
const async_hooks = require("async_hooks");

// 创建一个异步钩子实例
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    console.log(`异步资源被创建, 类型: ${type}, 资源ID: ${asyncId}`);
  },
});

// 激活钩子
hook.enable();
```

如果你运行上述代码并创建一个`setTimeout`，你会看到一个与该定时器关联的 init 事件日志。

### before/after

这些回调分别在异步操作之前和之后被调用，允许你理解异步事件的执行顺序。

```javascript
hook = async_hooks.createHook({
  before(asyncId) {
    console.log(`即将执行异步回调，资源ID: ${asyncId}`);
  },
  after(asyncId) {
    console.log(`完成执行异步回调，资源ID: ${asyncId}`);
  },
});

hook.enable();

// 使用一个简单的 setTimeout 示例
setTimeout(() => {
  console.log("定时器回调执行");
}, 100);
```

在上面的例子中，你会看到在`setTimeout`的回调执行前后打印了相应的信息。

### destroy

当一个异步资源不再需要时，`destroy`回调被触发。这是资源生命周期结束的信号。

```javascript
hook = async_hooks.createHook({
  destroy(asyncId) {
    console.log(`异步资源被销毁，资源ID: ${asyncId}`);
  },
});

hook.enable();

let interval = setInterval(() => {
  console.log("定时器回调执行");
}, 100);

// 在一段时间后清除定时器
setTimeout(() => {
  clearInterval(interval);
}, 500);
```

在这个例子里，当我们清除定时器时，相关的异步资源就会被销毁，触发`destroy`回调。

### promiseResolve

这个回调在一个`Promise`解析时被调用。即使 Promise 已经被 resolve 了，这个回调仍然会被触发。

```javascript
hook = async_hooks.createHook({
  promiseResolve(asyncId) {
    console.log(`一个Promise被resolve了，资源ID: ${asyncId}`);
  },
});

hook.enable();

let promise = new Promise((resolve, reject) => {
  resolve("成功");
});

promise.then((value) => {
  console.log(value);
});
```

当 Promise 被解决时，`promiseResolve`回调会被触发，并且会打印出相应的信息。

使用 `async_hooks` 需要谨慎，因为它可能会显著影响程序的性能。通常只在开发和调试应用程序时才会使用它。在生产环境中监控异步资源，建议使用成熟的性能监测工具。

#### [init(asyncId, type, triggerAsyncId, resource)](https://nodejs.org/docs/latest/api/async_hooks.html#initasyncid-type-triggerasyncid-resource)

`async_hooks`模块是 Node.js 中的一个高级功能，允许开发者钩入异步资源的生命周期事件。在这个上下文中，“异步资源”指的是一些可以产生新的异步操作的对象，比如定时器、Promises、TCP 服务器和连接等。

`init`函数是`async_hooks`模块中的一个重要部分，它是一个回调函数，当一个异步资源被创建时就会被触发。了解`init`函数很重要，因为它提供第一手信息关于异步操作从何而来及其类型。

### 参数详解

- `asyncId`：一个唯一的 ID 用来标识异步资源。
- `type`：一个字符串表示异步资源的类型（例如`Promise`、`Timeout`、`TCPServer`等）。
- `triggerAsyncId`：这个 ID 指向创建当前异步资源的父资源。每个异步资源都可能由另一个异步资源触发创建。
- `resource`：与异步操作相关联的实际资源对象。

### 实际应用示例

以下是使用`async_hooks`和`init`钩子的简单例子：

```javascript
const async_hooks = require("async_hooks");

// 定义init钩子函数
function init(asyncId, type, triggerAsyncId, resource) {
  console.log(`异步资源被创建, 类型: ${type}, ID: ${asyncId}`);
}

// 创建一个异步钩子实例并传递我们的init函数
const hook = async_hooks.createHook({ init });
hook.enable(); // 启用钩子

// 当定时器启动时，init函数将被调用
setTimeout(() => {
  console.log("定时器执行了!");
}, 1000);
```

在这个例子中，当`setTimeout`创建一个新的定时器时，`init`钩子会被触发，并打印出异步资源的类型和 ID。然后，当定时器到时间后，在控制台输出“定时器执行了!”。

注意，以上代码主要用于演示目的，并不建议在生产环境中无节制地使用`async_hooks`，因为过度使用可能会对性能产生影响。

总结起来，`init`函数是一个在异步资源初始化时就会被 Node.js 调用的回调函数，通过它你可以跟踪和监视你的应用程序中的异步操作。尽管这可能听起来有点复杂，但了解它对于深入理解 Node.js 中的异步编程非常重要，特别是在调试和优化性能方面。

##### [type](https://nodejs.org/docs/latest/api/async_hooks.html#type)

Node.js 中的 `async_hooks` 模块允许我们追踪在 Node.js 应用程序中异步资源的生命周期。一个异步资源可以是一个定时器、Promise、或者是任何调用了回调函数的操作，比如文件读写和网络通信。

在 `async_hooks` 模块中，每个异步事件都有一个对应的类型（type），这告诉我们事件是什么类型的异步操作。例如，当你创建一个新的 Promise 或者使用 setTimeout 设置一个定时器时，Node.js 将分别为它们分配特定的类型。

让我们通过几个例子来说明：

1. **setTimeout**: 当你使用 `setTimeout` 函数设置一个定时器时，Node.js 会创建一个叫做 `TIMERWRAP` 的异步资源类型。

```javascript
const async_hooks = require("async_hooks");
const fs = require("fs");

function logWithId(message) {
  fs.writeSync(1, `${async_hooks.executionAsyncId()}: ${message}\n`);
}

const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    logWithId(`${type} initialized`);
  },
});

hook.enable();
setTimeout(() => logWithId("Timeout callback"), 100);
```

2. **Promise**: 当你创建一个新的 Promise 时，Node.js 会创建一个名为 `PROMISE` 的异步资源。

```javascript
// 继续上面的代码

new Promise((resolve, reject) => {
  resolve("Resolved");
}).then((value) => {
  logWithId(`Promise resolved with: ${value}`);
});
```

在上述代码片段中，我们首先引入 `async_hooks` 和 `fs`（用于同步写入日志）。然后定义了 `logWithId` 函数来输出与当前异步 ID 相关联的日志消息。我们创建了一个 `async_hooks` 实例，并定义了 `init` 钩子，当一个异步资源被初始化时，它将调用这个钩子函数并打印出资源的类型。

接着，我们启用了钩子，设置了一个定时器和一个 Promise，并为它们打印相关的日志。当这段代码运行时，你将看到类似以下输出：

```
1234: TIMERWRAP initialized
5678: PROMISE initialized
5678: Promise resolved with: Resolved
```

这里的数字（例如 `1234` 和 `5678`）是异步 ID，它们是唯一的标识符，用于追踪异步资源。

通过监控不同类型的异步资源，开发人员可以更好地理解和调试他们的 Node.js 应用程序中的异步流程。这是非常重要的，因为异步编程是 Node.js 中最核心也是最复杂的部分之一。

需要注意的是，`async_hooks` 主要用于复杂的性能监测和调试场景，在日常的应用开发中可能用得不多，但了解它可以帮助深入理解 Node.js 中的异步处理机制。

##### [triggerAsyncId](https://nodejs.org/docs/latest/api/async_hooks.html#triggerasyncid)

Node.js 中的 `async_hooks` 模块允许我们追踪应用中异步操作的生命周期。在这个模块里，每一个异步资源都有一个唯一的标识符，称为 `asyncId`。而 `triggerAsyncId` 是一个与之相关联的术语。

首先，理解 Node.js 中的异步编程很重要。在 Node.js 里，许多操作是异步执行的，比如读取文件、数据库操作、网络请求等。这意味着当这些操作被触发时，Node.js 不会等待它们完成，而是继续执行下一个任务，在异步操作完成时通过回调函数来处理结果。

现在，来解释 `triggerAsyncId`：

1. **什么是 `triggerAsyncId`？**

   - 当异步操作被初始化时（比如启动一个定时器或者发起一个 HTTP 请求），Node.js 将该操作分配一个唯一的 `asyncId`。
   - `triggerAsyncId` 是指启动当前异步操作的那个异步资源的 `asyncId`。基本上，它表示了异步事件链中的“父”异步资源，即哪个资源导致当前异步资源的创建。

2. **为什么需要 `triggerAsyncId`？**

   - 在复杂的应用中，异步操作经常相互嵌套和链式调用。使用 `triggerAsyncId` 可以帮助我们追踪这样的调用链，了解当前的异步操作是由哪个之前的操作所触发的。

3. **怎样获取 `triggerAsyncId`？**

   - 在 `async_hooks` 模块中，你可以通过 `executionAsyncId()` 函数来获得当前正在执行的异步资源的 `asyncId`。
   - 而 `triggerAsyncId` 可以在创建异步资源时通过资源对象获取，或者在异步钩子的回调函数中获取。

4. **实际例子**
   - 假设你有一个 HTTP 服务器，每当接收到新的请求时就会创建一个新的异步操作。如果你想要跟踪这个请求的整个生命周期，包括它引发的所有其他异步操作，你可以使用 `triggerAsyncId` 来建立整个事件链。

```javascript
const async_hooks = require("async_hooks");
const http = require("http");

// 创建一个异步钩子实例
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    console.log(
      `异步资源类型: ${type}, asyncId: ${asyncId}, triggerAsyncId: ${triggerAsyncId}`
    );
  },
});

// 激活这个钩子
hook.enable();

http
  .createServer((req, res) => {
    res.end("hello world");
  })
  .listen(8080);

// 当 HTTP 服务器接收到请求时，init 钩子会被触发，
// 输出类似 "异步资源类型: TCPWRAP, asyncId: 2, triggerAsyncId: 1"
// 这里的 triggerAsyncId 是指启动 TCP 服务器异步操作的 asyncId。
```

在这个例子中，`init` 钩子函数会在每个异步资源创建时被调用，打印出了当前异步资源的类型、它自己的 `asyncId` 以及触发它的 `triggerAsyncId`。这可以让你看到当一个 HTTP 请求进入服务器时，是如何触发一个新的异步资源创建的，并且这个资源是被哪个已存在的异步操作（TCP 服务器监听）所触发的。

使用 `triggerAsyncId` 可以让你更清晰地理解在 Node.js 应用内部，各个异步资源是如何相互关联的，从而对复杂的异步逻辑有更好的掌控。

##### [resource](https://nodejs.org/docs/latest/api/async_hooks.html#resource)

Node.js 中的 `async_hooks` 模块是用来跟踪 Node.js 应用中的异步资源（例如异步操作、定时器或者其他需要回调函数的场景）的生命周期的。每当一个异步事件发生或者一个异步资源被创建时，`async_hooks` 可以让你知道这些事件何时发生，并提供有关它们的信息。

在 `async_hooks` 模块里，`resource` 是一个与特定异步操作相关联的对象。每次创建异步资源时，都会生成一个新的 `resource` 实例，并且它通常包含有关该资源的额外信息，这使得跟踪和调试异步操作变得更加容易。

下面通过一些例子来具体说明 `resource` 的用法。

### 例子 1：使用 async_hooks 跟踪异步操作

```javascript
const async_hooks = require("async_hooks");

// 创建一个异步钩子实例
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    // 在这里，resource 是与新创建的异步资源相关联的对象
    console.log(`初始化异步资源: ${type}，资源ID: ${asyncId}`);
  },
});

// 启用钩子
hook.enable();

// 执行一个异步操作
setTimeout(() => {
  console.log("定时器回调执行");
}, 100);

// 输出可能如下：
// 初始化异步资源: Timeout，资源ID: 1
// 定时器回调执行
```

在这个例子中，我们创建了一个 `async_hooks` 实例，并定义了一个 `init` 回调函数。这个回调会在每个异步资源被创建的时候执行。在回调中，我们可以查看到 `resource` 对象，它包含了创建的异步资源的详细信息。这里我们仅仅打印出了资源类型和资源 ID。

### 例子 2：获取资源的额外信息

```javascript
const async_hooks = require("async_hooks");
const fs = require("fs");

// 写日志到文件的函数
function logToFile(message) {
  fs.writeFileSync("/path/to/log.txt", `${message}\n`, { flag: "a" });
}

const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    // 获取资源相关信息
    if (type === "TIMERWRAP") {
      logToFile(`Timer created with timeout: ${resource._list.msecs}`);
    }
  },
});

hook.enable();

// 设置一个定时器
setTimeout(() => {}, 1000);
```

在这个例子中，当一个 `TIMERWRAP` 类型的资源（即内部用于跟踪定时器的资源）被创建时，我们通过查看 `resource` 对象上特有的属性（例如 `_list.msecs`）来获取定时器的超时时间，并将这个信息写入到日志文件中。

需要注意的是，直接访问像 `_list.msecs` 这样带有下划线前缀的属性并不是推荐的做法，因为这意味着属性是私有的，它可能在未来的版本中改变或被移除。然而，在某些调试场景下，访问私有属性可能是唯一的方式来获取你需要的信息。

总结起来，`resource` 在 `async_hooks` 模块中代表了与异步事件相关的资源对象。通过监听异步事件的生命周期和检查相关资源，开发者可以更好地理解和管理应用中的异步逻辑。

##### [Asynchronous context example](https://nodejs.org/docs/latest/api/async_hooks.html#asynchronous-context-example)

在 Node.js 中，`async_hooks` 模块是用来追踪应用中异步操作的上下文的。每当创建一个异步资源时（比如一个 Promise、一个 setTimeout, 或者其他任何形式的异步操作），都会为这个资源分配一个唯一的 ID，并且通过 `async_hooks` 可以监听到这些资源的生命周期：创建(create)、之前(before)、之后(after)、销毁(destroy)等事件。

在 Node.js v21.7.1 的文档中，“Asynchronous context example” 展示了如何使用 `async_hooks` 来跟踪异步操作的上下文。我将根据这个例子给你解释它的工作方式，并提供一些实际应用场景的例子。

首先，我们需要引入几个模块：

```javascript
const async_hooks = require("async_hooks");
const fs = require("fs");
```

接着，我们定义一个写日志的函数，用于输出信息到标准错误输出（通常用于调试）：

```javascript
function debug(...args) {
  // 使用 fs.writeSync 而不是 console.log 避免自己被 async_hooks 跟踪导致无限循环
  fs.writeSync(
    1,
    `${args
      .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
      .join(" ")}\n`
  );
}
```

现在我们设置异步钩子：

```javascript
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    // 当一个异步资源被创建时触发
    const eid = async_hooks.executionAsyncId();
    debug(
      `init: ${asyncId}, type: ${type}, trigger: ${triggerAsyncId}, execution: ${eid}`
    );
  },
  before(asyncId) {
    // 异步回调函数调用之前触发
    debug(`before: ${asyncId}`);
  },
  after(asyncId) {
    // 异步回调函数调用结束后触发
    debug(`after: ${asyncId}`);
  },
  destroy(asyncId) {
    // 异步资源被销毁时触发
    debug(`destroy: ${asyncId}`);
  },
});

// 启动这些钩子
hook.enable();
```

最后，我们执行一个简单的异步操作，例如一个 `setTimeout`：

```javascript
setTimeout(() => {
  debug("Timeout callback executed");
}, 100);
```

在这个过程中，你会看到日志中记录了各种事件的发生，比如：

- 当 `setTimeout` 被调用时，它的初始化(init)事件
- 在 `setTimeout` 回调执行之前(before)和之后(after)的事件
- 当定时器完成并被 GC 清理时，它的销毁(destroy)事件

**实际运用示例：**

1. **性能监控：** 你可以使用 `async_hooks` 来监控特定类型的异步操作，记录它们的耗时，用于诊断性能瓶颈。

2. **请求追踪：** 在构建一个 web 服务器时，你可能想要追踪一次 HTTP 请求的整个生命周期。通过 `async_hooks`，你可以追踪从请求开始到结束涉及的所有异步操作。

3. **日志和调试：** 在复杂的应用中，了解异步操作的流程对于调试是非常有帮助的。`async_hooks` 可以帮助你确定事件循序和异步调用链，从而更容易找到问题所在。

注意：虽然 `async_hooks` 是一个强大的工具，但它会增加额外的性能开销，因此在生产环境中使用时需要谨慎。在大量异步操作的情况下，尤其需要考虑这个问题。

#### [before(asyncId)](https://nodejs.org/docs/latest/api/async_hooks.html#beforeasyncid)

Node.js 中的`async_hooks`模块是用来追踪异步资源（比如定时器、Promises、异步 I/O 等）的生命周期事件的。当你创建一个异步操作时，这些异步资源会被分配一个唯一的`asyncId`。

在`async_hooks`模块中，有几个关键的生命周期回调函数供你来实现，它们会在异步资源的不同阶段被 Node.js 的运行时调用。这些回调包括：

- `init(asyncId, type, triggerAsyncId, resource)`：当一个异步资源被创建时触发。
- `before(asyncId)`：在异步资源的回调函数执行之前触发。
- `after(asyncId)`：在异步资源的回调函数执行完毕后触发。
- `destroy(asyncId)`：当一个异步资源被销毁时触发。
- `promiseResolve(asyncId)`：当一个 Promise 对象被解析时触发。

`before(asyncId)`就是其中一个生命周期回调。每次准备进入异步操作的回调之前，`before(asyncId)`都会被调用，此时可以执行一些准备工作或者记录信息。`asyncId`参数就是当前即将执行的异步操作的 ID。

下面通过一个例子来说明`before(asyncId)`的用法：

```javascript
const async_hooks = require("async_hooks");
const fs = require("fs");

// 定义一个输出日志的函数，方便我们查看调用情况
function logWithId(msg) {
  fs.writeSync(1, `${msg}\n`);
}

// 创建一个 AsyncHooks 实例，并定义其中的钩子函数
const hooks = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    logWithId(
      `init: ${asyncId} of type ${type}, triggered by ${triggerAsyncId}`
    );
  },
  before(asyncId) {
    logWithId(`before: ${asyncId}`);
  },
  after(asyncId) {
    logWithId(`after: ${asyncId}`);
  },
  destroy(asyncId) {
    logWithId(`destroy: ${asyncId}`);
  },
});

// 激活 AsyncHooks
hooks.enable();

// 创建一个简单的异步定时器
setTimeout(() => {
  logWithId("Timeout callback executed");
}, 100);

/* 输出可能类似于：
init: 6 of type TIMERWRAP, triggered by 1
init: 7 of type Timeout, triggered by 1
before: 7
Timeout callback executed
after: 7
destroy: 7
*/
```

上述代码通过`async_hooks`模块创建了一个监视器，它记录了异步资源（在这个例子中是一个 setTimeout 定时器）的主要生命周期事件。`before(asyncId)`被用来输出一个日志条目，表明我们即将进入一个特定的异步资源的回调。你可以在这里做一些你需要做的事情，比如检查环境状态、收集性能指标等。

请注意，过度使用`async_hooks`模块可能会对程序性能产生负面影响，因为它增加了额外的处理，所以应该权衡在生产环境中使用它的好处和代价。而且，由于异步追踪可能涉及底层的操作细节，因此通常只有当你需要诊断复杂的异步逻辑问题时才会使用此模块。

#### [after(asyncId)](https://nodejs.org/docs/latest/api/async_hooks.html#afterasyncid)

好的，Node.js 的 `async_hooks` 模块是用来追踪 Node.js 应用中异步资源（例如：Promises, Timers, Streams 等）的生命周期事件的。在这个模块中，`after(asyncId)` 函数是一个回调函数，它会在异步操作执行完毕之后被触发。

首先，我们需要理解什么是`asyncId`。每当一个异步资源被创建时，Node.js 都会生成一个唯一的`asyncId`。这个`asyncId`可以被用来追踪和管理特定的异步资源。

现在我们来看看`after(asyncId)`函数怎样工作：

1. 当你使用`async_hooks`模块创建钩子（hooks），你可以定义不同的生命周期事件的回调函数，比如`init`、`before`、`after`和`destroy`。
2. 一旦注册了这些回调，当相应的异步事件发生时，Node.js 就会自动调用它们。
3. `after(asyncId)` 就是其中一个回调函数，在异步操作结束后，即将释放控制权回到 Event Loop 前，此回调会被触发。

为了更好地理解，让我们举一个例子：

```javascript
const async_hooks = require("async_hooks");

// 创建一个 AsyncHook 实例。传入的对象包含不同的回调函数。
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    console.log(`一个新的异步资源被创建了，它的id是：${asyncId}`);
  },
  before(asyncId) {
    console.log(`在异步资源（id: ${asyncId}）开始执行前调用。`);
  },
  after(asyncId) {
    console.log(`在异步资源（id: ${asyncId}）执行完成后调用。`);
  },
  destroy(asyncId) {
    console.log(`异步资源（id: ${asyncId}）已被销毁。`);
  },
});

// 激活这个 AsyncHook。
hook.enable();

// 这里我们执行一个异步操作，比如一个setTimeout定时器
setTimeout(() => {
  console.log("定时器执行了");
}, 100);

// 注意：实际的asyncId值会根据运行时情况变化。
```

当上面的代码运行时，你会在控制台看到类似于以下输出：

```
一个新的异步资源被创建了，它的id是：6
在异步资源（id: 6）开始执行前调用。
定时器执行了
在异步资源（id: 6）执行完成后调用。
异步资源（id: 6）已被销毁。
```

在这个例子中，setTimeout 函数创建了一个异步事件，当它被创建、执行和销毁时，我们通过`async_hooks`模块提供的回调函数来记录了这些信息。

使用`async_hooks`模块可以帮助开发者更好地理解和监控异步操作，尤其在复杂的应用程序中，它能够帮助定位性能问题或者潜在的错误。但是也需要注意，频繁地捕获和处理大量的异步事件可能会对性能产生影响。因此，在生产环境中需要谨慎使用。

#### [destroy(asyncId)](https://nodejs.org/docs/latest/api/async_hooks.html#destroyasyncid)

Node.js 中的 `async_hooks` 模块是用来追踪异步资源（如 Promises、Timers、Streams 等）的生命周期的。在 Node.js 的上下文中，每一个异步操作都被分配了一个唯一的标识符，称为 `asyncId`。

这些异步资源的创建和销毁可以通过 `async_hooks` 模块的不同钩子（hooks）函数来监控。其中 `destroy` 钩子就是在异步资源被销毁时触发的。当一个异步资源完成其生命周期并且不再需要时，Node.js 通知 `destroy` 钩子，这样相关的资源就可以被适当地清理。

使用 `destroy(asyncId)` 函数时，你实际上是在定义一个 `destroy` 钩子的行为。在你创建 `async_hooks` 实例并启动它之后，每当有异步资源被销毁时，就会调用你提供的这个 `destroy` 函数，并传入那个资源的 `asyncId`。

这里是一个简单的例子显示怎样使用 `destroy` 钩子：

```javascript
const async_hooks = require("async_hooks");

// 定义一个 init 钩子函数用于追踪新的异步资源的创建
function init(asyncId, type, triggerAsyncId) {
  console.log(`异步资源创建：${asyncId}, 类型：${type}`);
}

// 定义一个 destroy 钩子函数用于追踪异步资源的销毁
//来源：doc.cherrychat.org 请勿商用
function destroy(asyncId) {
  console.log(`异步资源销毁：${asyncId}`);
}

// 创建一个 AsyncHooks 实例，并传入我们定义的钩子函数
const hook = async_hooks.createHook({ init, destroy });

// 启动我们的钩子实例
hook.enable();

// 创建一个定时器作为一个异步资源，它会在执行后被销毁
setTimeout(() => {
  console.log("定时器执行完毕");
}, 100);

// 在 Node.js 运行该脚本时，你会看到类似以下的输出：
// 异步资源创建：5, 类型：TIMERWRAP
// 异步资源创建：6, 类型：Timeout
// 定时器执行完毕
// 异步资源销毁：6

// 注意：具体的 asyncId 值可能会有所不同，因为这个 ID 是由 Node.js 动态生成的。
```

在这个例子中，我们分别定义了两个钩子函数 `init` 和 `destroy`。当一个异步资源如 `setTimeout` 被创建时，`init` 函数被调用，并打印出相关信息。当这个定时器执行完毕并被销毁时，`destroy` 函数被调用，我们也打印出了相应的信息。

这种机制在调试复杂的异步代码或者构建性能监测工具时非常有用。例如，如果你在开发一个大型的 Node.js 应用，想要追踪内存泄漏或者异步资源的异常行为，使用 `async_hooks` 模块的 `destroy` 钩子可以帮助你确定资源是否被适时地清理。

记住，虽然 `async_hooks` 是一个强大的模块，但它的使用可能会引入额外的性能开销，特别是在大量异步操作的场景中。因此，除非必须，通常不推荐在生产环境中全面启用 `async_hooks`。

#### [promiseResolve(asyncId)](https://nodejs.org/docs/latest/api/async_hooks.html#promiseresolveasyncid)

好的，让我们一步步来了解 `promiseResolve(asyncId)` 这个函数。

首先，`promiseResolve(asyncId)` 函数是 Node.js 中 `async_hooks` 模块的一部分。`async_hooks` 模块用于跟踪异步资源的生命周期，也就是说，它可以让你知道在 Node.js 里面各种异步操作（比如定时器、Promises、异步 I/O 操作等）是什么时候开始、什么时候结束的。

现在，让我们聚焦于 `promiseResolve`：

- `promiseResolve(asyncId)` 是一个事件回调函数，它会在一个 Promise 被解决（即成功地完成了它的异步操作）时被触发。
- `asyncId` 是一个唯一标识符，这个标识符对应着被解决的那个 Promise。

为什么要用它？主要是因为在复杂的应用中，可能同时进行着大量的异步操作，通过使用 `async_hooks` 和 `promiseResolve`，开发者可以更好地理解和监控这些异步操作的执行情况。

下面是一个简化的实际例子来说明一下 `promiseResolve` 的用法：

```javascript
const async_hooks = require("async_hooks");

// 初始化 async_hooks 实例，并定义 promiseResolve 回调函数
const hook = async_hooks.createHook({
  promiseResolve: (asyncId) => {
    console.log(`Promise with asyncId ${asyncId} has been resolved`);
  },
});

// 激活 hooks
hook.enable();

// 创建一个新的 Promise 对象
let myPromise = new Promise((resolve, reject) => {
  // 异步操作：例如，在1秒后解决 Promise
  setTimeout(() => {
    resolve("Success!");
  }, 1000);
});

myPromise.then((value) => {
  // 当promise解决时，这里的代码会被执行
  console.log(value); // 输出 'Success!'
});
```

上面的代码演示了如何监控一个特定的 Promise 何时被解决。当 `myPromise` 在 1 秒后被解决时，注册到 `async_hooks` 的 `promiseResolve` 回调就会被触发，并打印出相关信息。

这只是 `promiseResolve` 的一个简单用法，但是在实际应用中，你可以利用这个机制进行更复杂的异步追踪，比如检测性能瓶颈、调试复杂的异步流程、跟踪资源的创建与销毁等。

再次强调，`async_hooks` 是一个高级功能，对于 Node.js 的初学者来说可能有点复杂。当你开始构建更加复杂的异步应用时，它将会非常有用。

### [async_hooks.executionAsyncResource()](https://nodejs.org/docs/latest/api/async_hooks.html#async_hooksexecutionasyncresource)

好的，让我来解释一下 Node.js 中的 `async_hooks.executionAsyncResource()` 这个函数。

首先，`async_hooks` 是 Node.js 的一个模块，它提供了一些钩子（hooks），可以让我们追踪异步资源在其生命周期中的状态变化。当我们说“异步资源”，我们指的是如定时器、Promise、回调函数等可能不会立即完成的操作。

现在，`executionAsyncResource()` 函数是 `async_hooks` 模块中的一个非常特别的功能。这个函数允许你获取当前异步执行上下文中的资源（也就是导致回调函数被调用的那个异步资源）。换句话说，当一个异步函数正在执行时，你可以使用这个函数来找到触发这个函数执行的具体资源。

**为什么这很有用？**

在 Node.js 中，由于异步操作的普遍性，跟踪程序的流程可能会变得复杂。比如，当你有大量的异步操作，想要知道当前的回调是由哪个异步操作触发的时候，这个函数就派上用场了。

**实际运用例子：**

1. **日志记录：** 当你在维护一个大型应用时，可能需要对异步操作进行精确的日志记录。通过使用 `executionAsyncResource()`，你可以获取当前执行的上下文，并将其与日志相关联，以便更容易地追溯问题。

   ```javascript
   const async_hooks = require("async_hooks");
   const fs = require("fs");

   function logWithAsyncContext(message) {
     const resource = async_hooks.executionAsyncResource();
     // 假设每个异步资源都有一个唯一的标识符
     const asyncId = resource.asyncId;
     fs.writeSync(1, `Async ID: ${asyncId}, Message: ${message}\n`);
   }

   async_hooks
     .createHook({
       init(asyncId, type, triggerAsyncId, resource) {
         // 可以在此记录资源初始化信息
       },
       before(asyncId) {
         // 在异步操作之前调用
       },
       after(asyncId) {
         // 在异步操作之后调用
       },
       destroy(asyncId) {
         // 当资源销毁时调用
       },
     })
     .enable();

   setTimeout(() => {
     logWithAsyncContext("This will log the async context of setTimeout");
   }, 100);
   ```

2. **追踪请求：** 在构建 Web 服务器时，可能需要保留每个请求的上下文，比如用户认证信息、请求参数等。尽管在 Node.js 中通常使用中间件来处理这种情况，但 `executionAsyncResource()` 在某些复杂场景下可以作为一个替代方案。

   ```javascript
   const async_hooks = require("async_hooks");
   const http = require("http");

   const server = http.createServer((req, res) => {
     const currentResource = async_hooks.executionAsyncResource();
     // 将请求数据附加到当前异步资源
     currentResource.reqData = { url: req.url, method: req.method };
     res.end("Hello World");
   });

   server.listen(3000);

   // 稍后在任何地方
   function getReqData() {
     const currentResource = async_hooks.executionAsyncResource();
     return currentResource.reqData;
   }
   ```

请注意，Node.js 中的 `async_hooks` 是一个比较底层的模块，通常情况下，你可能不需要直接使用它，除非你在做一些特别详细的异步跟踪或者是构建库和框架。对于普通开发来说，理解其工作原理有助于你更好地把握 Node.js 异步编程的本质。

### [async_hooks.executionAsyncId()](https://nodejs.org/docs/latest/api/async_hooks.html#async_hooksexecutionasyncid)

Node.js 中的 `async_hooks` 模块允许你追踪应用中异步资源（如 Promises, Timers, Callbacks 等）的生命周期。在这个模块中，`executionAsyncId()` 函数是一个非常重要的工具，它能够帮助你了解当前执行上下文的唯一标识符。

每当 Node.js 开始执行一个异步函数时，都会分配给它一个唯一的 ID，这就是所谓的“异步 ID”。`executionAsyncId()` 会返回当前正在执行的异步操作的 ID。如果当前没有异步操作正在执行，那么该函数将返回 0。

这个功能对于调试和性能监控很有用，因为你可以通过这些 ID 来追踪异步操作和它们之间的关系。

### 实际例子

**例子 1：追踪异步操作**

假设我们在处理一个 HTTP 请求，并且想要知道在请求处理过程中各个异步操作的执行情况。

```javascript
const async_hooks = require("async_hooks");
const http = require("http");

// 创建一个异步钩子实例，用于追踪异步资源的创建和销毁
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    console.log(
      `一个新的异步资源被创建：${type} (ID: ${asyncId}), 触发者ID: ${triggerAsyncId}`
    );
  },
  destroy(asyncId) {
    console.log(`异步资源被销毁，ID: ${asyncId}`);
  },
});

// 启动异步钩子
hook.enable();

// 创建一个HTTP服务器
http
  .createServer((req, res) => {
    // 输出当前执行的异步ID
    console.log(
      `在请求处理器中，当前执行的异步ID是: ${async_hooks.executionAsyncId()}`
    );

    // 异步读取文件
    fs.readFile("/path/to/file", (err, data) => {
      if (err) throw err;
      console.log(
        `在回调中，当前执行的异步ID是: ${async_hooks.executionAsyncId()}`
      );
      res.end(data);
    });
  })
  .listen(8080);

console.log(
  `服务器运行中，当前执行的异步ID是: ${async_hooks.executionAsyncId()}`
);
```

在这个例子中，我们使用 `async_hooks` 模块来打印出创建和销毁异步资源的信息。同时，在请求处理器和文件读取的回调函数中，我们也打印出了当前执行上下文的异步 ID。

**例子 2：调试异步错误**

有时候，我们可能无法轻易地追踪一个错误从哪里传来，尤其是在复杂的异步代码中。使用 `executionAsyncId()` 可以帮助我们定位问题。

```javascript
// ...引入 async_hooks 和其他需要的模块...

// 假设我们有以下的异步函数
function someAsyncOperation(callback) {
  // 异步操作中出现错误
  setImmediate(() => {
    callback(new Error("Something went wrong!"));
  });
}

// 使用 executionAsyncId 打印出错时的上下文ID
someAsyncOperation((err) => {
  console.error(
    `错误发生在异步ID ${async_hooks.executionAsyncId()} 的上下文中`
  );
  console.error(err.stack);
});
```

在这个简单的例子中，我们使用了 `setImmediate` 来模拟异步操作，模拟在其中产生一个错误。通过在回调函数中打印 `executionAsyncId()` 的结果，我们可以知道出错的上下文 ID，进而在复杂的程序中更容易找到问题的来源。

总的来说，`executionAsyncId()` 是一个强大的工具，尤其适合用于开发大型复杂的 Node.js 应用，需要仔细跟踪和管理异步操作。

### [async_hooks.triggerAsyncId()](https://nodejs.org/docs/latest/api/async_hooks.html#async_hookstriggerasyncid)

`async_hooks.triggerAsyncId()` 是 Node.js 中一个较为高级的 API，它属于 `async_hooks` 模块。为了理解这个函数，我们需要先简单了解一下 Node.js 中的异步编程和异步资源。

在 Node.js 中，很多操作都是异步的，比如读写文件、网络请求等。当你启动一个异步操作时，Node.js 不会等待这个操作完成，而是继续执行下面的代码，当异步操作完成后，通过回调函数来处理结果。这样能够提高程序的效率和响应速度。

每一个这样的异步操作都可以看作是一个异步资源。而 `async_hooks` 模块就允许我们追踪这些资源的生命周期，也就是说，我们可以知道何时创建了一个异步资源，何时销毁它，以及其他相关的状态变更。

`async_hooks.triggerAsyncId()` 这个函数用来获取当前执行上下文触发（创建）了某个异步资源的 ID。换句话说，它返回的是引发当前回调或者 Promise 的那个异步资源的 ID。这个 ID 在整个 Node.js 进程中是唯一的。

### 使用场景举例

假设你正在开发一个 Node.js 应用，你想要监测和调试异步操作：

1. **性能监控**：你想要监控特定的异步操作，了解系统中不同种类的异步请求的性能表现。

2. **调试**：在复杂的应用中，可能会有成百上千个异步调用，当出现问题时，你需要找到问题的根源。使用 async_hooks 和 `triggerAsyncId()` 可以帮助你追踪异步调用链。

3. **日志追踪**：在处理日志时，你想要将相关的异步操作关联起来，以便更好地理解事件流。

4. **上下文传递**：在一个长的异步调用链中，你可能需要传递一些上下文信息（例如用户身份认证信息），了解每一个操作是由什么触发的可以帮助你在正确的地方传递和恢复这些信息。

### 实际代码示例

假设我们有以下场景：我们的应用程序中有一个异步函数 `doSomethingAsync()`，该函数在被调用时会创建一个新的异步资源，而我们想要知道谁触发了这个异步调用：

```javascript
const async_hooks = require("async_hooks");

// 创建一个异步资源，并在资源的生命周期内部记录所触发的 Async ID。
function doSomethingAsync(callback) {
  const asyncId = async_hooks.executionAsyncId();
  const triggerAsyncId = async_hooks.triggerAsyncId(); // 获取触发者的 Async ID
  console.log(
    `Async Resource created by Async ID: ${asyncId}, triggered by Async ID: ${triggerAsyncId}`
  );

  // 模拟异步操作
  setImmediate(() => {
    callback();
  });
}

// 初始化异步钩子
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    console.log(
      `Resource: ${asyncId} of type ${type} created, triggered by ${triggerAsyncId}`
    );
  },
  destroy(asyncId) {
    console.log(`Resource: ${asyncId} destroyed`);
  },
});

// 启用异步钩子
hook.enable();

// 在外部调用我们的异步函数
doSomethingAsync(() => {
  console.log("Do something after async operation");
});

// 停用异步钩子
hook.disable();
```

在这个示例中：

- 我们首先导入了 `async_hooks` 模块。
- 定义了一个异步函数 `doSomethingAsync()`，在其中调用 `async_hooks.triggerAsyncId()` 来打印出触发当前异步操作的父异步资源的 ID。
- 使用了 `async_hooks` 创建了一个钩子实例，它会在异步资源创建和销毁时运行相应的函数，打印出资源 ID 和类型。
- 我们启用了这个钩子，然后调用 `doSomethingAsync()` 并传入了回调函数。
- 最后停用钩子避免对性能造成影响。

这只是一个非常基本的介绍和示例；在真正的应用程序中，`async_hooks` 的使用通常更加复杂并且需要对异步编程有深刻的理解。

### [async_hooks.asyncWrapProviders](https://nodejs.org/docs/latest/api/async_hooks.html#async_hooksasyncwrapproviders)

`async_hooks` 是 Node.js 中的一个模块，它提供了用于追踪异步资源生命周期（例如，当一个异步操作开始、执行、结束时）的钩子。在 Node.js 应用程序中，很多操作都是异步的，比如读写文件、数据库操作、网络请求等。

`async_hooks.asyncWrapProviders` 是 `async_hooks` 的一部分，它是一个对象，其中包含了 Node.js 定义的所有可被监控的异步资源类型。这个对象的键是资源类型的名称，值是对应的数字 ID。

举个例子，如果你想要跟踪 HTTP 服务器的异步行为，如新建连接和请求处理，你可能会查看 `async_hooks.asyncWrapProviders` 对象，找到与 HTTP 服务器相关的资源类型。然后，你可以使用 `async_hooks` 模块来创建钩子，并在钩子中定义当这些事件发生时需要执行的回调函数。

下面是一个简化的实际运用例子：

```javascript
const async_hooks = require("async_hooks");
const fs = require("fs");

// 创建一个日志函数，将消息写入到stderr以便调试。
function debug(...args) {
  // Use a synchronous write to stderr to avoid needing extra async_hooks hooks.
  fs.writeSync(1, `${args.join(" ")}\n`);
}

// 创建异步钩子实例
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    if (async_hooks.asyncWrapProviders[type]) {
      // 如果类型存在于asyncWrapProviders中
      debug(`Async resource of type ${type} created with id ${asyncId}`);
    }
  },
  destroy(asyncId) {
    debug(`Async resource with id ${asyncId} has been destroyed`);
  },
});

// 启动钩子
hook.enable();

// 示例：创建一个简单的HTTP服务器
const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Hello World!");
});

server.listen(8080, () => {
  debug("Server is listening on port 8080");
});

// 通过执行一个HTTP请求触发异步事件
const httpReq = http.request({ port: 8080 }, (res) => {
  res.on("data", (data) => {
    debug("Received data:", data.toString());
  });
  res.on("end", () => {
    server.close(); // 关闭服务器
    hook.disable(); // 停止异步钩子
  });
});

httpReq.end();
```

在这个例子中，我们创建了一个异步钩子实例，并定义了两个回调函数：`init` 和 `destroy`。`init` 函数会在一个异步资源被创建时调用，而 `destroy` 函数则会在资源被销毁时调用。我们启用了这个钩子，然后创建了一个简易的 HTTP 服务器和客户端请求。通过运行这段代码，你可以看到当 HTTP 请求相关的异步事件发生时，我们的 `debug` 函数会输出相应的信息。

这个例子展示了如何使用 `async_hooks` 来监视和调试 Node.js 中的异步操作，该技术尤其对于理解复杂异步流程或排查性能问题非常有用。请注意，由于性能考虑，不推荐在生产环境中无节制地使用 `async_hooks`。

## [Promise execution tracking](https://nodejs.org/docs/latest/api/async_hooks.html#promise-execution-tracking)

当我们在 Node.js 中使用 `Promise` 进行异步编程时，有时候需要跟踪和理解 `Promise` 的执行流程，特别是在复杂的应用中，这样可以更好地调试和优化代码。Node.js 为此提供了一个叫做 `async_hooks` 的模块，它可以让你监视异步资源的生命周期事件，包括 `Promise`。

在 Node.js v21.7.1 版本中，`async_hooks` 模块包含了对 `Promise` 执行跟踪的功能。这意味着你可以使用 `async_hooks` 来监听 `Promise` 在其生命周期内发生的不同事件，并作出相应的处理或记录。这些事件包括创建（init）、解决（resolve）、拒绝（reject）等。

接下来我会给你讲解一下具体的概念和实际运用的例子：

### 实际概念：

1. **异步资源**：指的是那些需要操作系统进行操作，可能要等待操作系统返回结果的对象，例如文件读写、网络请求等。
2. **生命周期事件**：表示异步资源从创建到销毁过程中发生的各种事件。

### 实际运用示例：

假设我们有一个服务器，处理客户端发送的请求。每个请求我们都用 `Promise` 包装一些数据库操作或者其他异步任务。我们想要监控这些 `Promise` 的生命周期，以便知道哪些操作耗时较长，哪些操作可能导致错误等。

首先，你需要引入 `async_hooks` 模块并且创建钩子：

```javascript
const asyncHooks = require("async_hooks");

// 创建一个异步钩子
const hook = asyncHooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    console.log(`Promise created: ${asyncId}`);
  },
  before(asyncId) {
    console.log(`Promise about to execute: ${asyncId}`);
  },
  after(asyncId) {
    console.log(`Promise executed: ${asyncId}`);
  },
  destroy(asyncId) {
    console.log(`Promise destroyed: ${asyncId}`);
  },
});

// 启动钩子
hook.enable();
```

以上代码中，我们定义了几个函数来分别在 `Promise` 创建、即将执行、已经执行和被销毁时获取通知。而 `asyncId` 是一个唯一的标识，代表特定的异步资源或 `Promise`。

现在，让我们看一个简单的情景，在一个异步操作中使用 `Promise`：

```javascript
function doSomethingAsync() {
  return new Promise((resolve, reject) => {
    // 模拟异步操作
    setTimeout(() => {
      resolve("Operation completed");
    }, 1000);
  });
}

doSomethingAsync().then((result) => {
  console.log(result); // 日志输出 "Operation completed"
});
```

当上述代码执行时，如果我们之前启动了 `async_hooks` 钩子，你将能够在控制台看到与这个 `Promise` 相关的不同生命周期事件的日志。

通过这样的方式，你可以对 `Promise` 执行过程有更清晰的认识。在开发复杂的 Node.js 应用时，这个功能对于性能调试和错误跟踪尤其有用。

## [JavaScript embedder API](https://nodejs.org/docs/latest/api/async_hooks.html#javascript-embedder-api)

Node.js 中的 JavaScript Embedder API 主要是指那些提供给高级用户或框架开发者用于嵌入 JavaScript 引擎到它们自己的应用程序中的 API。在我们讨论 Async Hooks 模块下的 JavaScript Embedder API 之前，你需要了解一些基本概念。

### Async Hooks 简介

Async Hooks 是 Node.js 提供的一个模块，它允许开发者监控和追踪资源（如 HTTP 请求、文件操作等）的生命周期事件。这个模块可以帮助你了解异步操作何时开始和结束，以及它们的上下文。

在 Async Hooks 中，"资源"通常表示一个对象，它代表了一个异步操作（例如，当你进行一个 HTTP 请求，底层会有一个资源代表这个请求）。每个资源都与一个唯一的异步 ID 关联。

### JavaScript Embedder API 的作用

JavaScript Embedder API 在 Async Hooks 模块中提供了一组函数，使得开发者（特别是嵌入器或原始模块作者）能够更精确地控制和实现自定义异步资源的钩子跟踪。换句话说，如果你正在创建一个新的异步 API，或者在 Node.js 之外使用 JavaScript 引擎，并希望你的异步操作能被 Async Hooks 正确追踪，那么你就需要使用这套 API。

### JavaScript Embedder API 的主要组件

- `async_hooks.createHook(callbacks)`：用于注册钩子的回调函数，这些回调会在异步资源的生命周期不同阶段被调用。
- `class AsyncResource`：一个方便的类，用于从复杂的异步操作（比如那些涉及多次回调的操作）中创建新的异步资源。

### 实际应用例子

假设你正在编写一个 Node.js 的数据库连接库，该库支持异步查询。但是，你想确保库的用户能够使用 Async Hooks 来追踪查询的执行。

```javascript
const async_hooks = require("async_hooks");
const { AsyncResource } = require("async_hooks");

// 这是你的数据库查询功能的简化版本
class DatabaseQuery extends AsyncResource {
  constructor() {
    // 调用super并传入'QUERY'来为此类型的资源命名
    super("QUERY");
  }

  query(sql, callback) {
    // 执行查询...
    const fakeResult = "some data"; // 假数据结果

    // 当查询完成时，你使用emitBefore和emitAfter来通知Async Hooks
    this.emitBefore();
    callback(null, fakeResult); // 模拟异步回调
    this.emitAfter();
  }
}

// 创建一个hook，记录所有的异步事件
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    console.log(`Async resource of type ${type} created with id ${asyncId}`);
  },
  before(asyncId) {
    console.log(`Before async call ${asyncId}`);
  },
  after(asyncId) {
    console.log(`After async call ${asyncId}`);
  },
  destroy(asyncId) {
    console.log(`Async resource ${asyncId} destroyed`);
  },
});

// 激活hooks
hook.enable();

// 使用你的数据库库
const dbQuery = new DatabaseQuery();
dbQuery.query("SELECT * FROM table", (err, results) => {
  if (err) throw err;
  // 处理结果...
  dbQuery.emitDestroy(); // 查询完毕，销毁资源
});

// 稍后关闭hooks
hook.disable();
```

在这个例子中，`DatabaseQuery`类继承自`AsyncResource`。它在内部处理异步操作，并且通过调用`this.emitBefore()`和`this.emitAfter()`方法，确保在异步操作执行的前后，Async Hooks 能够接收到正确的事件。通过调用`this.emitDestroy()`，我们还通知 Async Hooks 这个异步操作已经完成，资源可以被清理了。

这就是 JavaScript Embedder API 的基本用法，它可以让你将自定义的异步操作无缝集成进 Node.js 的异步追踪系统。

### [Class: AsyncResource](https://nodejs.org/docs/latest/api/async_hooks.html#class-asyncresource)

当然，Node.js 中的 AsyncResource 类是一个 API，它来自 `async_hooks` 模块。这个类的主要目的是允许你手动创建一个异步操作，在 Node.js 的异步操作跟踪系统中被识别和监控。这样做可以帮助你保持异步资源（比如操作、请求、任务等）的上下文不丢失，即使在多个回调之间传递时也不会发生混乱。

在实际应用中，AsyncResource 类非常有用，特别是当你在编写涉及复杂异步逻辑的库或工具时，比如自定义事件发射器，或者与底层资源（如数据库连接）交互的模块。下面我将逐步解释并给出一些例子。

### 创建一个 AsyncResource

首先，你需要从 `async_hooks` 模块引入 `AsyncResource` 类：

```javascript
const { AsyncResource } = require("async_hooks");
```

然后，你可以创建一个新的 AsyncResource 实例：

```javascript
const asyncResource = new AsyncResource("MY_ASYNC_RESOURCE");
```

这里 `'MY_ASYNC_RESOURCE'` 是为这个资源分配的名字，以便于在异步跟踪过程中能够辨识它。

### 使用 AsyncResource

你可能想要在某个异步操作中使用这个资源，保持上下文环境。例如，想象你正在处理 HTTP 请求，并且需要在几个不同的回调函数中传递用户信息。如果直接这么做，上下文可能会丢失，因此，我们可以使用 `AsyncResource` 来维护它。

```javascript
const http = require("http");
const { AsyncResource } = require("async_hooks");

// 假设这是一些用户信息
const userInfo = {
  id: 1,
  username: "nodeuser",
};

http
  .createServer((req, res) => {
    // 创建一个新的 AsyncResource 实例，每个请求都会有一个
    const asyncResource = new AsyncResource("HTTP_REQUEST");

    // 模拟一些异步逻辑
    fetchDataFromDB((err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end("Database error");
      }

      // 使用 runInAsyncScope 方法来运行一个回调，保持了AsyncResource的上下文
      asyncResource.runInAsyncScope(() => {
        // 在这里可以安全地访问 userInfo 对象，此处上下文得到了保持
        res.writeHead(200);
        res.end(`Hello, ${userInfo.username}!`);
      });
    });
  })
  .listen(3000);

function fetchDataFromDB(callback) {
  // 这里是模拟数据库异步操作
  process.nextTick(() => {
    callback(null, "some data");
  });
}
```

在这个例子中，对于每个传入的 HTTP 请求，我们都创建了一个新的 `AsyncResource`。然后，在异步操作（比如数据库查询）完成时，我们使用这个 `AsyncResource` 实例的 `runInAsyncScope` 方法来执行回调，确保 `userInfo` 在整个异步链中都可以被正确访问。

### 总结

`AsyncResource` 是 Node.js 中一个高级功能，通常用在需要精确控制和维护异步操作上下文时。通过手动管理异步资源，开发者可以避免上下文丢失问题，并确保代码在复杂的异步场景下表现良好。虽然这对于大多数日常应用程序开发而言可能不是必须的，但在创建库、框架或需要细致操作异步资源的场合中，它是一个非常有价值的工具。

## [Class: AsyncLocalStorage](https://nodejs.org/docs/latest/api/async_hooks.html#class-asynclocalstorage)

`AsyncLocalStorage` 是 Node.js 中的一个类，它属于 `async_hooks` 模块，提供了一种在 JavaScript 的异步操作中存储和传递数据的方法。这个类的作用类似于在多线程应用中使用的线程本地存储（Thread Local Storage），只不过 Node.js 通常是单线程运行的，所以这里我们谈论的是 "异步" 本地存储。

### 为什么需要 AsyncLocalStorage？

在 Node.js 的异步编程模型中，当你进行一系列异步操作时，例如读写文件、访问数据库或发起网络请求等，这些操作经常会通过回调函数、Promises 或 async/await 来处理。在此过程中，追踪和管理特定于用户或请求的上下文信息变得复杂，因为原始的上下文很容易在异步调用链中丢失。

比如，假设你在处理一个 Web 请求时想要记录日志，并且希望所有的日志都能带有当前请求的唯一标识符。在同步代码中，你可以简单地将这个标识符存储在一个变量中，但在异步操作中，由于执行可能会跳到事件循环的其他部分然后再回来，那么在回调函数或其他异步操作中获取这个标识符就变得不直观。

### 如何使用 AsyncLocalStorage？

1. 创建实例：首先需要创建 `AsyncLocalStorage` 的一个实例。
2. 运行上下文：通过 `.run()` 方法创建一个新的异步上下文，在此上下文中可以设置一些要传递的数据。
3. 获取存储的数据：在上下文中任何时间点，都可以通过 `.getStore()` 方法来获取先前存储的数据。

### 实际例子

#### 记录请求相关日志

假设你正在编写一个 Web 应用，并且每当有请求进来时，你想要给这个请求分配一个唯一的请求 ID，并在处理这个请求期间产生的所有日志中包含这个 ID。

```javascript
const http = require("http");
const { AsyncLocalStorage } = require("async_hooks");

// 创建 AsyncLocalStorage 实例
const asyncLocalStorage = new AsyncLocalStorage();

http
  .createServer((req, res) => {
    // 假设我们为每个请求生成一个唯一的 ID
    const requestId = Date.now() + Math.random();

    // 使用 .run() 方法创建一个新的异步上下文，并设置 requestId
    asyncLocalStorage.run(new Map(), () => {
      asyncLocalStorage.getStore().set("requestId", requestId);

      // 处理请求...
      handleRequest(req, res);
    });
  })
  .listen(8080);

function handleRequest(req, res) {
  // 在任何异步操作中，我们都可以获取当前请求的上下文
  setImmediate(() => {
    log("开始处理请求");

    // 做一些异步的事情...
    setTimeout(() => {
      log("完成请求处理");
      res.end("Hello World");
    }, 100);
  });
}

function log(message) {
  // 无需传递请求 ID，因为它被存储在 AsyncLocalStorage 中
  const requestId = asyncLocalStorage.getStore().get("requestId");
  console.log(`请求 ${requestId}: ${message}`);
}
```

在这个例子中，每个请求的处理都通过 `asyncLocalStorage.run()` 方法包裹起来，从而确保请求 ID 能够在整个异步操作中被保存并可获取。

总结一下，`AsyncLocalStorage` 提供了在 Node.js 异步编程环境中保持上下文状态的能力，适用于跟踪请求级别的信息、授权、日志记录等场景。
