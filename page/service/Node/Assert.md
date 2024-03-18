---
title: Assert
icon: circle-info
category:
  - 基于 gpt4构建的 node文档
---

# [Assert](https://nodejs.org/docs/latest/api/assert.html#assert)

Node.js 中的 `assert` 模块是一个用于进行各种断言测试的工具。断言测试通常用于编写自动化测试代码，确保程序中的某个部分如预期般工作。如果你想验证你的函数或者代码块返回了正确的结果，或者某些变量包含了正确的值，那么你可以使用 `assert` 模块。

以下是该模块在 Node.js v21.7.1 中可用的一些方法和简单例子：

1. `assert(value, message)`：这是最基础的断言形式，它检查 `value` 是否为真，如果不为真，则抛出一个错误（可选地携带 `message` 文本）。

   举例：

   ```javascript
   const assert = require("assert");

   // 假设我们有一个函数checkTrue，应该返回true
   function checkTrue() {
     return true;
   }

   // 这会通过因为checkTrue返回了true
   assert(checkTrue(), "checkTrue did not return true");

   // 假如checkTrue返回了false，这行代码将会抛出一个错误信息“Assertion failed: checkTrue did not return true”
   assert(checkTrue(), "checkTrue did not return true");
   ```

2. `assert.deepEqual(actual, expected, message)`：用来比较两个对象的内容是否相等。它不考虑对象的引用是否相同，只关心结构和值。

   举例：

   ```javascript
   const assert = require("assert");

   const obj1 = { a: 1, b: 2 };
   const obj2 = { a: 1, b: 2 };

   // 这个测试会通过，即使obj1和obj2是不同的对象实例，但他们的内容是一样的
   assert.deepEqual(obj1, obj2, "These two objects are not equal");
   ```

3. `assert.strictEqual(actual, expected, message)`：用来比较两个值是否严格相等（也就是说，它们是不是完全一样，包括类型和值）。

   举例：

   ```javascript
   const assert = require("assert");

   // 这个测试会通过，因为1严格等于1
   assert.strictEqual(1, 1, "One is not strictly equal to one");

   // 这个测试将失败，并抛出AssertionError，因为'1'（字符串）不严格等于1（数字）
   assert.strictEqual("1", 1, '"1" is not strictly equal to 1');
   ```

4. `assert.rejects(asyncFn, error, message)`：当你要测试一个异步函数是否按预期抛出错误时，这个方法非常有用。

   举例：

   ```javascript
   const assert = require("assert");

   async function myFunction() {
     throw new Error("Something went wrong");
   }

   // 这个测试将通过，因为myFunction抛出了一个错误
   assert.rejects(myFunction, "Expected an error but none was thrown");
   ```

5. `assert.ok(value, [message])`: 断言某个值是真值（truthy）。如果该值不转换为布尔值 true 则抛出 AssertionError。

   举例：

   ```javascript
   const assert = require("assert");

   // 这个测试会通过，因为字符串 "hello" 是一个真值
   assert.ok("hello", "This should pass");

   // 这个测试将失败，并抛出 AssertionError，因为0不是一个真值
   assert.ok(0, "This will fail");
   ```

Node.js 的 `assert` 模块还有更多的方法，例如 `assert.notStrictEqual`、`assert.ifError` 等，每个都有其特定的用途。重要的是要理解 `assert` 模块提供的是一种机制，用于在代码执行过程中验证事情是否符合你的期望。如果不符合，通过抛出错误来让你知道哪里出了问题，这样你就可以修正它以确保代码的质量。

## [Strict assertion mode](https://nodejs.org/docs/latest/api/assert.html#strict-assertion-mode)

Node.js 中的“strict assertion mode”（严格断言模式）是指使用 Node.js 自带的`assert`模块时，采用更加严格的比较方式。在编程中，"assertions"（断言）通常用于测试代码，确保代码按预期工作。当表达式的结果不符合预期时，断言会引发错误。

在 Node.js 的早期版本中，`assert`模块提供了一些方法来进行值的比较，例如`assert.equal()`。但这些方法并不总是非常严格，例如它们可能会认为不同类型的值是相等的（比如数字`1`和字符串`'1'`），因为它们在比较时会进行类型转换。

从 Node.js 9.9.0 版本开始，`assert`模块增加了一个新的子模块`assert.strict`，它提供了与原始`assert`方法同名的方法，但这些方法执行严格相等的比较，也就是说不允许在比较时进行类型转换。

下面通过几个示例来说明非严格断言和严格断言的区别：

### 非严格断言示例

```javascript
const assert = require("assert");

// 这将不会抛出错误，因为==运算符会进行类型转换。
assert.equal(1, "1"); // 此处使用了非严格相等比较

// 这将不会抛出错误，因为1和true被视为相等。
assert.equal(1, true); // 再次使用了非严格相等比较
```

### 严格断言示例

```javascript
const assert = require("assert").strict;

// 这将抛出错误，因为===运算符不允许类型转换。
assert.equal(1, "1"); // 此处使用了严格相等比较，会抛出AssertionError

// 这也将抛出错误，因为1和true不被视为严格相等。
assert.equal(1, true); // 再次使用了严格相等比较
```

在严格断言模式下，如果试图断言两个不同类型的值相等，或者两个值虽然看起来内容相似但数据类型不同，则会抛出错误。这有助于开发人员捕获隐藏的类型相关的 bug，并确保代码逻辑的严密性。

使用严格模式是一种更安全、更可靠的做法，尤其是在进行单元测试时。它可以帮助你避免一些可能在应用程序中造成问题的隐蔽错误。

## [Legacy assertion mode](https://nodejs.org/docs/latest/api/assert.html#legacy-assertion-mode)

Node.js 中的 `assert` 模块是一个用于进行各种断言测试的工具。所谓“断言”（Assertion），就是在代码中设置一些检查点，确保程序运行到这里时，某些条件必须为真。如果条件不成立，则抛出错误并且通常会终止程序。

在 Node.js 的早期版本中，`assert` 模块提供了一种被称为“Legacy assertion mode”的断言模式。"Legacy" 这个单词在这里意味着“遗留”，表明这种模式是一种老旧的使用方式，可能随着时间逐渐被新的方法所取代。

遗留断言模式更简单、更有限，它主要提供了一个函数 `assert(value, message)`，其中：

- `value` 是你想要测试的表达式结果。
- `message` 是一个当断言失败，也就是 `value` 评估为 `false` 时，错误中将包含的信息。

如果 `value` 为真（truthy），也就是说它不是 `false`、`0`、`""`（空字符串）、`null`、`undefined` 或者 `NaN`，那么程序将正常继续执行。如果 `value` 为假（falsy），则会抛出一个错误，并且通常包括 `message` 所提供的信息。

### 实际例子

**1. 通过断言验证变量的值**

```javascript
const assert = require("assert");

let theNumber = 10;

// 断言：theNumber 必须等于 10，否则抛出错误
assert(theNumber === 10, "The number must be 10");
```

在这个例子中，如果 `theNumber` 不等于 10，那么将抛出一个错误，并且错误信息将是 `'The number must be 10'`。

**2. 验证函数返回结果**

```javascript
const assert = require("assert");

function add(x, y) {
  return x + y;
}

// 调用 add 函数，断言结果必须为 5
assert(add(2, 3) === 5, "Addition of 2 and 3 should be 5");
```

在这个例子中，如果函数 `add` 的返回值不为 5，我们会得到一个错误，错误信息是 `'Addition of 2 and 3 should be 5'`。

随着时间的推移，Node.js 引入了更多的断言功能，如深度比较、异步断言和严格模式等。但即使在最新版本的 Node.js 中，遗留断言模式仍然可以使用，只是官方文档建议使用更强大的断言方法。

## [Class: assert.AssertionError](https://nodejs.org/docs/latest/api/assert.html#class-assertassertionerror)

`assert.AssertionError`是 Node.js 中`assert`模块提供的一个类，用于表示断言失败。在编程中，"断言"是一种检查代码是否按预期工作的方式。如果你做出一个假设或者期望，在代码中通过断言来确认这个假设，如果假设为真，则程序继续执行；如果假设为假，则断言会失败，通常会抛出一个错误，并且通常这个错误就是`AssertionError`类型。

在 Node.js 中，`assert`模块提供了一系列的函数，帮助你测试和验证代码。当一个断言函数的条件不满足时，将会抛出`AssertionError`。

下面是一个简单的例子来演示如何使用断言和处理`AssertionError`：

```javascript
const assert = require("assert");

function add(a, b) {
  return a + b;
}

try {
  // 假设我们期望add函数将1和2相加的结果应该是3
  assert.strictEqual(add(1, 2), 3, "1加2应该等于3");

  // 如果我们错误地期待了不正确的结果，比如4
  assert.strictEqual(add(1, 2), 4, "1加2应该等于3");
} catch (error) {
  // 如果上面的断言失败，将会捕获到AssertionError
  if (error instanceof assert.AssertionError) {
    console.error("断言失败：", error.message);
    // 这里可以输出更详细的错误信息，例如
    console.error("实际值：", error.actual); // 实际得到的结果
    console.error("期望值：", error.expected); // 断言中期望的结果
    console.error("操作符：", error.operator); // 使用的比较操作符
  } else {
    // 其他类型的错误可以在这里处理
    console.error("未知错误：", error);
  }
}
```

在上面的例子中，第一个`assert.strictEqual`将会通过，因为`add(1, 2)`确实返回了 3。而第二个`assert.strictEqual`则会失败，因为`add(1, 2)`返回的是 3，不是期望的 4，这会导致一个`AssertionError`被抛出，然后在`catch`块中被捕获。一旦捕获到`AssertionError`，我们就可以访问它的属性（如`message`、`actual`、`expected`和`operator`）来获取失败的详细信息，并据此进行调试。

### [new assert.AssertionError(options)](https://nodejs.org/docs/latest/api/assert.html#new-assertassertionerroroptions)

`assert.AssertionError` 是 Node.js 中 `assert` 模块的一个特殊错误类型，它表示当某项断言（即一种预期）未能满足时抛出的错误。在编程中，断言是一种检查程序状态是否符合预期的方式；如果不符合，通常会抛出错误并可能终止程序。

在 Node.js v21.7.1 版本中，你可以使用 `new assert.AssertionError(options)` 来创建一个 `AssertionError` 的实例。这里的 `options` 是一个对象，可以包含以下属性：

- `message`：错误信息，说明断言失败的原因。
- `actual`：实际得到的结果值。
- `expected`：期望得到的结果值。
- `operator`：用于比较实际和期望值的操作符字符串。
- `stackStartFn`：如果提供了这个函数，堆栈跟踪会从此函数开始，有助于定位错误的源头。

让我们举一个实际的例子：

假设你正在写一个函数用来计算两个数的和，为了确保你的函数正确无误，你想要断言其结果应该等于两个数真实相加的和。如果计算的结果不对，你希望程序能给出提示。

```javascript
const assert = require("assert");

function add(a, b) {
  return a + b;
}

// 使用add函数计算2和3的和
const result = add(2, 3);

// 断言结果应该是5
try {
  assert.strictEqual(result, 5, "两数相加结果不正确");
} catch (e) {
  if (e instanceof assert.AssertionError) {
    console.error(`发生错误: ${e.message}`);
    console.error(`实际值: ${e.actual}`);
    console.error(`期望值: ${e.expected}`);
    console.error(`操作符: ${e.operator}`);
  } else {
    throw e; // 如果不是断言错误，则重新抛出异常
  }
}
```

在上面这个例子中，我们期望 `add(2, 3)` 的结果是 `5`。如果结果正确，程序将继续运行。如果结果不正确，会抛出一个 `AssertionError`，然后被 `catch` 块捕获，并打印出相应的错误信息。

如果你犯了一个错误，比如将 `add` 函数实现成了 `a * b` 而不是 `a + b`，那么 `assert.strictEqual(result, 5)` 这行代码就会触发 `AssertionError`，因为 `2 * 3` 不等于 `5`。错误信息和详细数据将被打印出来，帮助你理解问题所在。

## [Class: assert.CallTracker](https://nodejs.org/docs/latest/api/assert.html#class-assertcalltracker)

`assert.CallTracker` 是 Node.js 中的一个工具，它用于测试代码中的函数调用次数。这对于确保在测试期间某些函数是否被调用了正确次数非常有用。

首先，让我们了解为什么要追踪函数调用次数：当你编写测试时，通常你会想确认某些函数在特定条件下被调用了指定的次数。例如，如果你有一个事件监听器，你可能想确认当事件触发时，监听器是否被调用了一次。

现在，让我们来看看如何使用 `assert.CallTracker`：

1. 创建一个 `CallTracker` 对象。
2. 使用 `calls` 方法创建跟踪函数的封装（包装）函数。
3. 在测试结束时，使用 `verify` 方法检查所有的封装函数是否都被调用了正确的次数。

下面是一个简单的例子来演示如何使用 `assert.CallTracker`：

```javascript
const assert = require("assert");

// 创建一个 CallTracker 实例
const tracker = new assert.CallTracker();

function testFunction() {
  // 这个函数将在下面的代码中被调用
}

// 告诉 tracker 我们希望 testFunction 被调用一次
const trackedTestFunction = tracker.calls(testFunction, 1);

// 现在调用我们的封装函数
trackedTestFunction();

// 测试结束后，验证函数是否被调用了正确的次数
process.on("exit", () => {
  tracker.verify(); // 如果 testFunction 不是恰好被调用一次，将会抛出一个错误
});
```

在上面的例子中：

- 我们创建了一个 `CallTracker` 对象。
- 我们告诉 `CallTracker` 我们期待 `testFunction` 被调用一次，`tracker.calls` 返回一个新的封装函数 `trackedTestFunction`。
- 我们调用了 `trackedTestFunction()` 来模拟 `testFunction` 的调用。
- 最后，在进程退出前，我们通过 `tracker.verify()` 来确认 `testFunction` 是否被调用了一次。

如果 `testFunction` 被调用次数不符合预期，`verify` 方法将抛出一个错误，这可以提醒我们检查代码中相关函数的调用逻辑是否有问题。这在进行自动化测试时非常有价值，可以确保你的代码按照预期运行。

### [new assert.CallTracker()](https://nodejs.org/docs/latest/api/assert.html#new-assertcalltracker)

`assert.CallTracker()` 是一个 Node.js 中的工具，用来追踪函数调用的次数。这在测试代码的时候非常有用，因为它可以帮助你确保你的函数在测试期间被调用了预期的次数。

当你写测试的时候，你可能想要检查某个特定的函数是否被调用了准确的次数。如果函数没有被调用，或者调用次数不对，那么可能意味着你的代码中存在问题。使用 `CallTracker` 可以自动化这一检查过程。

下面是如何使用 `assert.CallTracker()` 的一些步骤和例子：

1. 首先，你需要导入 assert 模块并创建一个 `CallTracker` 实例：

   ```javascript
   const assert = require("assert");

   // 创建一个 CallTracker 对象
   const tracker = new assert.CallTracker();
   ```

2. 接下来，你可以通过 `tracker.calls()` 方法创建一个跟踪器，该跟踪器会追踪某个函数被调用的次数。

   ```javascript
   // 追踪某个函数被调用一次
   const callsFunc = tracker.calls(() => {}, 1);
   ```

3. 然后在你的代码中，你需要使用这个被跟踪的函数代替原本你想要测试的函数。

   ```javascript
   function myFunction() {
     // 假设这里会在某种条件下调用 callsFunc
     callsFunc();
   }

   // 调用 myFunction，它会间接调用 callsFunc
   myFunction();
   ```

4. 最后，在测试结束的时候，你可以调用 `tracker.verify()` 来确认所有被跟踪的函数都被调用了正确的次数。
   ```javascript
   // 在测试结束时调用，验证所有被跟踪的函数是否被正确调用
   try {
     tracker.verify();
     console.log("所有被跟踪的函数调用次数正确！");
   } catch (err) {
     console.error("发生错误:", err.message);
   }
   ```

如果 `callsFunc` 没有被调用，或者被调用次数不是一次，`tracker.verify()` 就会抛出一个错误，指明实际调用次数与预期不符。

通过使用 `CallTracker`，你可以轻松地在自动化测试中跟踪和验证函数调用次数，帮助你发现代码中潜在的逻辑错误。

### [tracker.calls([fn][, exact])](https://nodejs.org/docs/latest/api/assert.html#trackercallsfn-exact)

`tracker.calls([fn][, exact])` 是 Node.js 中 assert 模块的一个特性，它被用于跟踪和确保函数的预期调用次数。这在单元测试中非常有用，尤其是当你需要验证某个函数是否被调用了正确次数时。

首先来解释一下 assert 模块：
assert 模块提供了一组断言函数，用于测试代码。在编写测试时，如果某个条件不满足预期，assert 将抛出错误，这通常会导致测试失败。这就可以让开发者知道哪里出了问题。

现在进入正题，`tracker.calls()` 函数是在 `assert.CallTracker` 类中使用的方法。`CallTracker` 是一个用来追踪一个或多个函数被调用情况的工具。如果一个函数没有按照预期次数被调用，则会生成一个错误。

参数解释：

- `fn` (可选)：指定要追踪的函数。
- `exact` (可选)：指定函数必须被调用的确切次数。

这个方法返回一个代理函数，每次这个代理函数被调用时，它内部都会记录一次调用。

实际例子：

假设你正在编写一个电商平台的购物车部分，并且你想要确保当用户添加商品到购物车时，更新购物车总价的函数 `updateTotalPrice()` 被恰好调用了一次。

```javascript
const assert = require("assert");

// 这是你要追踪的函数，也就是你想要验证它是否被正确调用的函数
function updateTotalPrice() {
  console.log("更新了购物车总价");
}

// 创建 CallTracker 实例
const tracker = new assert.CallTracker();

// 告诉 tracker 去追踪 updateTotalPrice 函数，期望它只被调用一次
const callsUpdateTotalPrice = tracker.calls(updateTotalPrice, 1);

// 在测试中，代替真实的 updateTotalPrice 函数使用我们的追踪代理函数
callsUpdateTotalPrice();

// 其他测试逻辑代码...

// 最后验证: 当事件循环结束时，确认 updateTotalPrice 是否被调用了一次
process.on("exit", () => {
  // 如果这个函数没有被调用一次，将抛出错误
  tracker.verify();
});
```

在上述例子中，如果 `updateTotalPrice` 函数未被调用，或者被调用了多于一次，那么 `tracker.verify()` 将会抛出一个错误，这表示我们的测试失败了，因为函数的调用次数与预期不符。

### [tracker.getCalls(fn)](https://nodejs.org/docs/latest/api/assert.html#trackergetcallsfn)

好的，让我们通过一个简单易懂的方式来理解 `tracker.getCalls(fn)` 这个功能。

在 Node.js 中，`assert` 模块提供了一组断言函数，用于测试代码中的各种条件是否满足预期。在编写测试时，经常需要确保某些函数被调用了正确的次数、以正确的参数等。Node.js v21.7.1 版本引入了一个叫做 `tracker` 的新工具，它可以帮助我们跟踪和验证函数的调用情况。

现在，我们将聚焦于 `tracker.getCalls(fn)` 这个方法。这个方法的主要作用是获取到一个特定函数 `fn` 的所有调用记录。这可以帮助我们确认 `fn` 是否被调用过，以及被调用的次数，还能获取到调用时使用的参数列表。

现在我来举一个实际运用的例子：

假设你有一个函数 `sendMessage`，这个函数负责在应用程序中发送消息。在编写测试时，你可能会想要确保 `sendMessage` 被正确地调用了，并且要检查调用它时传递了正确的消息内容。

首先，让我们创建 `sendMessage` 函数和一个模拟其调用的场景：

```javascript
function sendMessage(to, message) {
  console.log(`Sending message to ${to}: ${message}`);
  // 实际的发送消息逻辑会在这里
}
```

现在，我们想要确认 `sendMessage` 是否被调用，以及调用的细节。这时候我们就可以使用 `tracker.getCalls(fn)` 方法来跟踪它：

```javascript
const assert = require("assert");

// 创建一个新的 tracker 对象
const tracker = new assert.CallTracker();

// 告诉 tracker 我们想要跟踪 sendMessage 函数
const callsSendMessage = tracker.calls(sendMessage);

// 模拟一些 sendMessage 的调用
sendMessage("Alice", "Hello Alice!");
sendMessage("Bob", "Hello Bob!");

// 使用 getCalls 方法获取 sendMessage 函数的调用记录
const calls = tracker.getCalls(sendMessage);
console.log(calls); // 打印出调用记录的数组

// 结束测试时，可以使用 tracker.verify() 来确认所有跟踪的函数都被正确地调用了指定次数。
// 如果没有，verify 方法将抛出一个错误
tracker.verify();
```

在这个例子中，`calls` 将包含 `sendMessage` 函数的两次调用信息。每个调用都被记录在一个对象中，该对象包含了调用时传递的参数和其他元数据。

`tracker.getCalls(fn)` 这个方法在编写单元测试时特别有用，因为它让你可以精确地验证函数的调用情况，然后根据这些信息去判断你的代码是否如预期般正确工作。

### [tracker.report()](https://nodejs.org/docs/latest/api/assert.html#trackerreport)

Node.js 的 `assert` 模块提供了一组用于测试和验证代码的功能。在 Node.js 的更高版本中，特别是从 v14.2.0 开始引入了一个新的实验性功能，名为 "异步资源追踪器" (`AsyncResource` 类)。这个功能使得开发者可以更好地追踪和管理异步操作中涉及的资源。

在你提到的 Node.js v21.7.1 中，`assert` 模块的 `tracker.report()` 方法是这套异步资源追踪系统中的一个部分。它的作用是报告那些还未被关闭的异步资源。简单来说，如果你启动了一些异步操作（比如定时器、文件读写、网络请求等）而在某个时间点，你想要确保所有资源都已经被正确清理（即没有遗漏的打开资源），你可以使用 `tracker.report()` 来进行检查。

下面是一个简单的例子来说明其用法：

```javascript
const assert = require("assert");
const { AsyncResource } = require("async_hooks");

// 创建一个异步资源追踪器
const tracker = new assert.AsyncTracker();

// 创建一个异步资源
const resource = new AsyncResource("example_resource");

// 通知追踪器我们开始了一个异步操作
tracker.init(resource.asyncId());

// 假设我们有一些异步逻辑
setTimeout(() => {
  // 异步操作完成后，我们需要关闭资源
  resource.emitDestroy();
  tracker.destroy(resource.asyncId());

  // 这时候可以检查是否仍然有未关闭的资源
  console.log(tracker.report()); // 应该为空，因为我们关闭了资源
}, 100);

// 如果我们忘记关闭资源，report() 方法将会报告该资源仍然是打开状态
setTimeout(() => {
  console.log(tracker.report()); // 将会显示一个包含了 example_resource 的数组
}, 200);
```

上述代码大致演示了如何使用 `tracker.init()` 来初始化一个追踪器，跟踪一个异步资源的生命周期，并使用 `tracker.report()` 在不同时间点报告还未关闭的资源。

请注意，由于 `AsyncTracker` 是一个实验性的功能，它的 API 和行为可能在未来的版本中发生变化。另外，在使用它之前，你需要对 Node.js 中的异步编程有一定的了解，包括事件循环和异步钩子（`async_hooks`）模块。

### [tracker.reset([fn])](https://nodejs.org/docs/latest/api/assert.html#trackerresetfn)

好的，我来解释一下 Node.js 中的`tracker.reset([fn])`这个方法。

首先，我们需要知道`tracker.reset([fn])`这个方法是属于 Node.js 中`assert`模块里面的一个功能，而`assert`模块主要用于进行各种断言操作。在编程中，断言（Assert）是一种检查代码逻辑是否正确的方式。它通常用于测试代码，确保代码按照预期的方式运行。

`assert`模块里有一个叫做`AsyncResource`的类，这个类主要用来跟踪异步操作的状态。其中，`tracker`是`AsyncResource`实例化出来的一个对象，用于追踪和管理多个异步操作。

在一些复杂的程序中，你可能会启动了很多异步操作，比如读写文件、数据库操作等等。使用`tracker`可以帮助你确保所有的这些操作都被正确地完成了。如果你想重置`tracker`的状态，就可以用到`tracker.reset([fn])`这个方法。

这里的`[fn]`是一个可选的回调函数，当所有追踪的异步操作完成时，这个回调函数会被调用。

让我们通过一个简单的例子来理解这个概念：

假设我们有一个程序，它执行两个异步操作：一个是读取一个文件，另一个是从网络获取一些数据。我们想要确保这两个操作都完成后再进行下一步。

```javascript
const assert = require("assert");
const fs = require("fs");
const http = require("http");

// 创建一个新的 AsyncResource 实例来跟踪异步操作
const tracker = new assert.AsyncTracker();

// 一个读取本地文件的异步操作
tracker.add("read-file");
fs.readFile("/path/to/file", (err, data) => {
  if (err) throw err;
  console.log("File read completed");
  // 操作完成后通知 tracker
  tracker.remove("read-file");
});

// 一个进行网络请求的异步操作
tracker.add("network-request");
http.get("http://example.com", (res) => {
  console.log("Request completed");
  res.on("data", () => {});
  res.on("end", () => {
    // 操作完成后通知 tracker
    tracker.remove("network-request");
  });
});

// 当所有的异步操作都完成后，我们可以重置 tracker
// 这里可以传入一个回调函数，在所有操作完成时执行
tracker.reset(() => {
  console.log("All asynchronous operations have been completed.");
});
```

在上面的代码中，我们添加了两个异步操作到`tracker`中，并且当每个操作完成时，调用`remove`来告诉`tracker`该操作已经结束。最后，我们调用`tracker.reset()`来重置`tracker`状态，并传入一个回调函数，这个回调函数在所有追踪的异步操作完成时执行，即打印出"All asynchronous operations have been completed."。

这样，通过使用`tracker.reset([fn])`，我们能够在所有异步操作完成后执行一些清理工作或者是进入下一个流程等操作。

### [tracker.verify()](https://nodejs.org/docs/latest/api/assert.html#trackerverify)

`tracker.verify()` 是 Node.js 中的一个断言工具，用于测试代码中的异步操作是否如预期完成。这个函数是 `assert` 模块的一部分，其中 `assert` 模块是用于写测试代码的一个实用工具。在 Node.js v21.7.1 的文档中，`tracker.verify()` 被用来确保所有被追踪的异步操作都已经结束。

举一个简单的例子：

假设你正在编写一个网络应用程序，你有一个函数 `fetchData()` 用于从互联网上获取数据，并且这个函数是异步的。你想要确保在你的测试中，`fetchData()` 函数被正确地调用和处理。

```javascript
const assert = require("assert");

// 假设这是你的异步函数
function fetchData(callback) {
  setTimeout(() => {
    // 模拟数据获取后的回调
    callback("some data");
  }, 100); // 延迟100毫秒模拟异步操作
}

// 创建一个新的异步资源跟踪器
const tracker = new assert.AsyncTracker();

// 通知 tracker 你将要开始一个异步操作
const resource = tracker.createResource("fetchData");

// 调用你的异步函数
fetchData((data) => {
  console.log(data); // 输出获取到的数据

  // 异步操作完成后，告诉 tracker
  tracker.removeResource(resource);
});

// 一些其他代码...

// 最后，在程序结束前（比如在所有测试运行完之后）检查所有异步操作是否完成
process.on("exit", () => {
  try {
    tracker.verify(); // 这将抛出错误如果还有未完成的异步操作
  } catch (err) {
    console.error("存在未完成的异步操作:", err);
    process.exit(1); // 非零退出码表示有错误发生
  }
});
```

在这个示例中，我们使用了 `fetchData()` 来模拟一个异步操作，它通过 `setTimeout()` 延迟 100 毫秒后返回数据。我们使用 `tracker.createResource()` 来注册一个正在进行的异步操作，并用 `tracker.removeResource()` 来表明这个特定的异步操作已经完成。

最后，在程序退出之前，我们使用 `tracker.verify()` 来检查是否所有被跟踪的异步操作都已经完成。如果有任何操作未完成，它会抛出一个错误。

这就是 `tracker.verify()` 的基本用法，它能帮助开发者确保他们的异步代码按照预期正确执行，特别是在编写测试时非常有用。

## [assert(value[, message])](https://nodejs.org/docs/latest/api/assert.html#assertvalue-message)

好的，让我来解释一下 Node.js 中的 `assert(value[, message])` 功能。

Node.js 的 `assert` 是一个用于进行断言测试的模块。所谓断言测试，简单来说，就是在代码中设置一些检查点（断言），以确保程序运行时的某个条件必须为真（true）。如果条件不为真，则会抛出一个错误（error），这通常表示你的程序出现了逻辑上的问题。

在 Node.js v21.7.1 的文档中，`assert(value[, message])` 函数是用来进行基本的断言测试的。这个函数接收两个参数：

1. `value`：这个参数是你想要测试的表达式或者值。
2. `message`（可选）：当断言失败的时候，将会显示的错误信息。

如果传入的 `value` 是真值（truthy，即在布尔上下文中转换为 `true` 的值），那么程序将继续执行。如果 `value` 是假值（falsy，即在布尔上下文中转换为 `false` 的值，比如 `0`, `''`, `null`, `undefined`, `NaN`, 或者 `false`），则会抛出一个带有 `message` 的 `AssertionError`（断言错误）。如果没有提供 `message`，就会使用默认的错误信息。

举个例子：

```javascript
const assert = require("assert");

// 假设你有一个函数 isAdult，它判断用户是否成年：
function isAdult(age) {
  return age >= 18;
}

// 使用断言来测试这个函数。
const userAge = 20;

// 如果 userAge 是成年，则不会有任何输出，程序继续执行。
assert(isAdult(userAge), "User must be an adult.");

// 如果我们将 userAge 改为未成年年龄，例如 16：
const anotherUserAge = 16;

// 现在断言会失败，因为 isAdult(anotherUserAge) 返回 false，
// 所以 assert 函数会抛出错误，并附带我们提供的消息 'User must be an adult.'。
// 如果我们没有提供消息，就会抛出一个默认的 AssertionError。
assert(isAdult(anotherUserAge), "User must be an adult.");
```

在上面的例子中，我们首先导入了 Node.js 的 `assert` 模块，然后定义了一个 `isAdult` 函数来检测年龄是否满足成年条件。之后我们用 `assert` 函数测试了两个不同的年龄，第一个年龄满足条件而静默通过，第二个年龄不满足条件时抛出了错误。

断言测试在开发过程中非常有用，尤其是在单元测试中验证函数的正确性。这种方式可以及早地发现程序中的错误，避免错误深入到系统中其他部分，节省调试的时间和成本。

## [assert.deepEqual(actual, expected[, message])](https://nodejs.org/docs/latest/api/assert.html#assertdeepequalactual-expected-message)

`assert.deepEqual(actual, expected[, message])` 是 Node.js 中 `assert` 模块提供的一个函数，它用于测试两个值在结构上是否相等。这里的“结构上相等”意味着对象的属性和数组中的元素在递归比较时是一致的，但并不检查其原型、绑定的符号属性，或者不可枚举的属性。

现在我们来举一些实际的例子来说明这个函数的用法：

假设你正在编写一个程序，需要确保你处理得到的数据结构与期望的结构完全一致。例如，你有一个函数，它应该返回一个包含用户信息的对象。

```javascript
function getUser() {
  // 在真实的情况下，这里可能会有从数据库获取数据的代码
  return {
    name: "Alice",
    age: 25,
    hobbies: ["reading", "gaming"],
  };
}
```

现在，你想要测试这个函数返回的对象是否与你所期望的对象结构相匹配。你可以使用 `assert.deepEqual()` 来进行测试。

```javascript
const assert = require("assert");

// 调用你的函数来获取结果
const actualUser = getUser();

// 定义一个期望得到的结果对象
const expectedUser = {
  name: "Alice",
  age: 25,
  hobbies: ["reading", "gaming"],
};

// 使用assert.deepEqual()来判断actualUser和expectedUser是否结构上相等
assert.deepEqual(
  actualUser,
  expectedUser,
  "The user object does not match the expected structure."
);
```

如果 `actualUser` 和 `expectedUser` 在结构上相等，那么这个断言通过，程序继续执行。如果它们不相等，`assert.deepEqual()` 将抛出一个错误，错误信息将会是提供的消息（在这个例子里是 `'The user object does not match the expected structure.'`），如果没有提供消息，则显示默认的错误信息。

重要的是要注意，`assert.deepEqual()` 方法在 Node.js v10.0.0 已被废弃，并在后续版本中移除，取而代之的是 `assert.deepStrictEqual()`。新的 `deepStrictEqual` 版本更加严格地比较对象的类型和值。因此，在最新的 Node.js 代码中，你应该使用 `assert.deepStrictEqual()` 而不是 `assert.deepEqual()`。

例如，使用 `assert.deepStrictEqual()`：

```javascript
// ... 其他代码不变 ...

// 使用assert.deepStrictEqual()来判断actualUser和expectedUser是否完全一样
assert.deepStrictEqual(
  actualUser,
  expectedUser,
  "The user object does not match the expected structure."
);
```

这个调用方式与 `assert.deepEqual()` 相似，但它会检查更多的条件，比如对象的类型。所以，如果 `actualUser` 和 `expectedUser` 之间有任何细微的不同，包括数据类型的不同（比如一个是数字类型，另一个是字符串类型的数字），`assert.deepStrictEqual()` 会抛出错误。

### [Comparison details](https://nodejs.org/docs/latest/api/assert.html#comparison-details)

好的，Node.js 中的 `assert` 模块主要用于执行断言操作，它是一种检查代码是否按预期工作的方式。在测试中尤其常用，比如你可能想确认一个函数返回正确的结果或者一个对象具有期望的属性。

在 Node.js v21.7.1 的文档中，关于 `Comparison details` （比较细节）部分说明了 `assert` 模块如何对数据进行比较，特别是 `strict` 模式与 `legacy` 模式之间的差异。

下面我将简单解释这两种模式，并给出一些例子：

### 1. Strict 模式：

Strict（严格）模式意味着比较时会采用 JavaScript 的 `===` 运算符，即所谓的 "严格相等"。这意味着不仅值需要相等，类型也必须完全相同。

例如：

```javascript
const assert = require("assert").strict;

assert.strictEqual(5, 5); // OK, 因为值和类型都相等。
assert.strictEqual("5", "5"); // OK, 同上。

// 将抛出 AssertionError，因为虽然'5'转换成数字后等于5，但类型不同。
assert.strictEqual(5, "5");
```

### 2. Legacy 模式：

Legacy（传统）模式更加宽松，它使用 `==` 运算符，允许类型转换。

例如：

```javascript
const assert = require("assert");

// 不会抛出错误，因为'5'转换成数字后等于5。
assert.equal(5, "5");
```

### 实际运用例子：

#### 例子 1：检查函数返回值

假设我们有一个函数 `add`，可以添加两个数字，我们想确保它能正确工作。

```javascript
function add(a, b) {
  return a + b;
}

// 使用 strict 模式来测试
const assert = require("assert").strict;
assert.strictEqual(add(2, 3), 5); // 正确的调用，不会抛出错误
assert.strictEqual(add(2, 2), 5); // 错误的调用，会抛出 AssertionError
```

#### 例子 2：检查对象属性

如果我们有一个对象，并且我们想检查对象是否包含特定的属性和值。

```javascript
const user = {
  name: "Alice",
  age: 25,
};

// 使用 strict 模式来测试
const assert = require("assert").strict;
assert.strictEqual(user.name, "Alice"); // 正确的调用，不会抛出错误
assert.strictEqual(user.age, "25"); // 错误的调用，会因为类型不同而抛出 AssertionError
```

总结一下，`assert` 模块提供了一组用于验证代码正确性的实用功能，在自动化测试中非常有用。理解严格模式和传统模式之间的区别，对正确使用该模块至关重要。

## [assert.deepStrictEqual(actual, expected[, message])](https://nodejs.org/docs/latest/api/assert.html#assertdeepstrictequalactual-expected-message)

`assert.deepStrictEqual` 是 Node.js 中 `assert` 模块提供的一个函数，用于进行深度相等性检查。该函数会递归地检查两个对象的所有属性和属性值是否严格相等（即类型和值都一样）。

### 参数解释

- `actual`: 这是你想要测试的实际值。
- `expected`: 这是你期望的值，用来和实际值进行对比。
- `message`: 如果提供了这个参数，并且实际值与期望值不符，那么在抛出错误时会显示这个消息文本。

### 作用

当你在编写代码时，特别是在做单元测试时，你可能会想确认你的函数或者模块返回的结果是否符合期望。`assert.deepStrictEqual` 函数帮助你断言两个复杂对象完全一致。如果不一致，Node.js 会抛出一个 AssertionError，告诉你哪里不符合预期。

### 实际运用的例子

1. **比较简单对象**

假设你有一个函数 `getUser` 返回一个用户对象，你想验证它返回的对象是否正确：

```javascript
const assert = require("assert");

function getUser() {
  return {
    name: "Alice",
    age: 25,
  };
}

const expectedUser = {
  name: "Alice",
  age: 25,
};

assert.deepStrictEqual(
  getUser(),
  expectedUser,
  "The user object is not as expected!"
);
```

这段代码中，如果 `getUser()` 函数返回的对象与 `expectedUser` 完全相同，那么程序将正常执行。如果有差异，比如年龄不是 25，就会抛出一个错误并显示 `'The user object is not as expected!'`。

2. **比较数组**

你也可以使用 `assert.deepStrictEqual` 来比较数组：

```javascript
const assert = require("assert");

const actualArray = [1, 2, 3];
const expectedArray = [1, 2, 3];

assert.deepStrictEqual(actualArray, expectedArray, "The arrays do not match!");
```

3. **比较嵌套对象**

嵌套对象的比较，意味着每一层的对象都会被逐个属性比较：

```javascript
const assert = require("assert");

const person = {
  name: "John",
  address: {
    street: "123 Main St",
    city: "Anytown",
  },
};

const expectedPerson = {
  name: "John",
  address: {
    street: "123 Main St",
    city: "Anytown",
  },
};

assert.deepStrictEqual(
  person,
  expectedPerson,
  "The person objects are not deeply equal!"
);
```

在上面的例子中，即使 `address` 属性是一个嵌套的对象，`deepStrictEqual` 也会检查 `street` 和 `city` 属性是否匹配。

### 注意事项

- `deepStrictEqual` 会考虑对象的原型、可枚举属性与不可枚举属性等多个方面，所以确保在使用时理解对象的这些细节。
- 当比较类实例或者含有循环引用的对象时，也必须谨慎使用。
- 因为 `deepStrictEqual` 会检查类型，所以数字 `1` 和字符串 `'1'` 将不会被认为是相等的。

总结起来，使用 `assert.deepStrictEqual` 可以帮助你确认你的代码是否按照你的预期工作，尤其是在处理复杂对象和数据结构时。它是单元测试的重要工具之一。

### [Comparison details](https://nodejs.org/docs/latest/api/assert.html#comparison-details_1)

当你阅读 Node.js 的文档时，尤其是`assert`模块的部分，你会遇到“Comparison details”这个章节。在 Node.js 中，`assert`模块提供了一系列的断言测试，用来确保代码按照你的预期方式运行。如果断言失败，通常意味着有一个错误或者 bug 存在于你的代码中。

**Comparison details** 指的是当使用`assert`模块进行值比较时，Node.js 如何决定两个值是否相等。在 Node.js v21.7.1 中，这些详情非常重要，因为它们决定了断言会成功还是失败。

让我们通过几个实际例子来理解这些细节：

### 1. `assert.strictEqual()` 和 `assert.notStrictEqual()`

这两个方法用来检查两个值是否严格相等（即不进行类型转换）。

```javascript
const assert = require("assert");

// 正确示例：1 和 '1' 不严格相等，因为它们类型不同
assert.notStrictEqual(1, "1"); // No error thrown

// 错误示例：1 和 1 严格相等
assert.notStrictEqual(1, 1); // AssertionError: 1 !== 1
```

### 2. `assert.deepEqual()` 和 `assert.notDeepEqual()`

这些方法用来对对象和数组进行深度比较，但不考虑原型或者属性的可枚举性。

```javascript
const assert = require("assert");

let obj1 = { a: { b: 1 } };
let obj2 = { a: { b: 1 } };
let obj3 = { a: { b: "1" } };

// 正确示例：虽然obj1和obj2不是同一个对象，但它们结构相同
assert.deepEqual(obj1, obj2); // No error thrown

// 错误示例：obj1和obj3看起来类似，但b的值类型不同
assert.deepEqual(obj1, obj3); // AssertionError: { a: { b: 1 } } deepEqual { a: { b: '1' } }
```

### 3. `assert.deepStrictEqual()` 和 `assert.notDeepStrictEqual()`

这些方法跟`assert.deepEqual()`类似，但是会考虑原型和属性的可枚举性，并要求比较的元素类型也必须相同。

```javascript
const assert = require("assert");

let arr1 = [1, 2, 3];
let arr2 = ["1", "2", "3"];

// 正确示例：arr1和arr2元素的值看似相同，但实际上类型不同
assert.notDeepStrictEqual(arr1, arr2); // No error thrown

// 错误示例：arr1与自己比较，完全相同
assert.notDeepStrictEqual(arr1, arr1); // AssertionError: [1, 2, 3] notDeepStrictEqual [1, 2, 3]
```

总结起来，当你使用`assert`模块中的比较函数时，你需要清楚地知道你想要的是哪种比较逻辑：是简单的严格比较(`strictEqual`)，还是不考虑类型的深度比较(`deepEqual`)，抑或是既考虑值又考虑类型的深度比较(`deepStrictEqual`)。根据你的需求选择合适的方法，能帮助你更准确地进行断言测试。

## [assert.doesNotMatch(string, regexp[, message])](https://nodejs.org/docs/latest/api/assert.html#assertdoesnotmatchstring-regexp-message)

`assert.doesNotMatch(string, regexp[, message])` 是 Node.js 中 `assert` 模块的一个方法，用于断言（即确认）一个字符串 `string` 不匹配给定的正则表达式 `regexp`。如果字符串确实不符合这个模式，那么程序就会继续执行；如果字符串符合模式，则会抛出一个错误。

### 参数解释

- `string`: 这是你想要进行检查的文本。
- `regexp`: 正则表达式，用于定义字符串应当遵循的特定模式或规则。
- `message`: 如果断言失败（即字符串匹配了正则表达式），则可以提供一个自定义的错误信息，它将被包含在抛出的错误中。这个参数是可选的。

### 使用场景和例子

假设你正在开发一个功能，用户需要输入用户名，但是你不希望用户名中包含数字。你可以使用 `assert.doesNotMatch()` 来检查用户名是否符合要求：

```javascript
const assert = require("assert");

// 用户名不应该包含数字
const username = "Alice123";
const pattern = /\d+/; // 正则表达式，用于匹配任何包含至少一个数字的情况

try {
  // 断言用户名不应匹配包含数字的模式
  assert.doesNotMatch(username, pattern, "用户名中不能包含数字！");
} catch (error) {
  console.error(error.message);
  // 如果断言失败，错误信息将会是 '用户名中不能包含数字！'
}
```

在上面的代码中，`username` 包含数字，所以与正则表达式 `pattern` 匹配，因此 `assert.doesNotMatch()` 会抛出一个带有我们自定义消息 `'用户名中不能包含数字！'` 的错误。如果 `username` 没有包含数字（例如是 `'Alice'`），那么断言就会通过，程序会继续正常运行。

再举一个例子，比如，在处理用户输入的电子邮箱时，你要确保输入的数据不是你企业的电子邮箱后缀：

```javascript
const assert = require("assert");

const email = "user@examplecorp.com";
const corporateEmailPattern = /@examplecorp\.com$/i; // 检查以 "@examplecorp.com" 结尾的邮箱

try {
  // 确认电子邮件地址不以企业邮箱后缀结尾
  assert.doesNotMatch(email, corporateEmailPattern, "请勿使用公司邮箱注册。");
} catch (error) {
  console.error(error.message);
  // 如果断言失败，错误信息将会是 '请勿使用公司邮箱注册。'
}
```

在这个例子里，如果 `email` 变量的值以 `"@examplecorp.com"` 结尾，`assert.doesNotMatch()` 将会抛出错误，并输出消息 `'请勿使用公司邮箱注册。'`。如果 `email` 值没有以公司邮箱后缀结尾，比如 `user@gmail.com`，那么断言通过，程序正常继续执行。

## [assert.doesNotReject(asyncFn[, error][, message])](https://nodejs.org/docs/latest/api/assert.html#assertdoesnotrejectasyncfn-error-message)

`assert.doesNotReject(asyncFn[, error][, message])`是 Node.js 中的一个断言函数，用于测试一个异步函数`asyncFn`（它通常返回一个 Promise）是否不会被拒绝（reject）。如果这个异步函数被拒绝了，并且拒绝的原因符合指定的错误`error`（如果提供），那么`assert.doesNotReject`将会抛出一个错误。这个错误可以通过`message`参数来自定义错误消息。

在解释之前，我们需要理解以下几点：

- **Async Function（异步函数）**: 一个返回 Promise 对象的函数，该对象代表了一个将要发生在未来某个时刻的完成（fulfilled）或者失败（rejected）事件。
- **Promise**: 是一个代表了异步操作最终成功(fulfillment)或失败(rejection)的对象。
- **Rejected Promise**: 当 Promise 因为错误而没有成功执行时，它就会被拒绝（reject）。
- **Assert 模块**: Node.js 内置的模块，用于编写测试代码。当一些预期条件不满足时，它可以抛出错误（AssertionError），帮助开发者找到问题。

现在，让我们详细地看看`assert.doesNotReject`如何工作：

```javascript
const assert = require("assert");

// 异步函数，它返回一个解决（fulfill）的Promise
function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 2000);
  });
}

// 异步函数，它返回一个被拒绝（reject）的Promise
function rejectAfter2Seconds() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("rejected"));
    }, 2000);
  });
}

// 测试resolveAfter2Seconds函数，期望它不被拒绝
assert
  .doesNotReject(resolveAfter2Seconds, Error, "这个异步操作应该没有被拒绝")
  .then(() => {
    console.log("通过了！异步操作没有被拒绝");
  });

// 测试rejectAfter2Seconds函数，期望它不被拒绝（这会失败）
assert
  .doesNotReject(rejectAfter2Seconds, Error, "这个异步操作应该没有被拒绝")
  .then(() => {
    console.log("通过了！异步操作没有被拒绝");
  })
  .catch((error) => {
    console.error("错误：", error.message);
  });
```

在上面的例子中：

- `resolveAfter2Seconds`是一个异步函数，它在 2 秒后成功地解决了它的 Promise。
- `rejectAfter2Seconds`是一个异步函数，它在 2 秒后拒绝了它的 Promise。

当我们使用`assert.doesNotReject`测试`resolveAfter2Seconds`时，测试通过，因为 Promise 被成功地解决了。但当我们用同样的方法来测试`rejectAfter2Seconds`时，测试失败，因为这个异步函数返回了一个被拒绝的 Promise，与`assert.doesNotReject`的预期相反。

使用`assert.doesNotReject`主要是在测试代码中，确保特定的异步函数在运行时不会因为异常或特定的错误条件而拒绝它的 Promise。如果不满足这个条件，你的测试代码将会收到一个错误提示，从而让你知道代码的哪个部分可能存在问题。

## [assert.doesNotThrow(fn[, error][, message])](https://nodejs.org/docs/latest/api/assert.html#assertdoesnotthrowfn-error-message)

Node.js 中的 `assert` 模块是用来进行各种断言测试的工具，这是在编写代码时用于确保代码符合期望的一种方式。`assert.doesNotThrow(fn[, error][, message])` 是 `assert` 模块中的一个方法，它用来测试一个函数在执行时是否不会抛出错误。

当你使用 `assert.doesNotThrow()` 方法时，你实际上是在说：“我认为这个函数在运行时是不应该抛出错误的”。如果函数执行过程中确实没有抛出任何错误，那么程序就会继续运行；但是如果函数执行过程中抛出了错误，`assert.doesNotThrow()` 会产生一个 AssertionError 异常。

现在让我们详细解释一下 `assert.doesNotThrow()` 方法的各个参数：

1. `fn`: 这是一个将要被执行的函数，通常是你想测试的那部分代码。
2. `error` (可选): 这个参数可以是一个构造函数、正则表达式或者一个自定义验证函数，它用来指定函数 `fn` 执行时抛出的错误类型。如果函数抛出了一个与之匹配的错误，`assert.doesNotThrow()` 将会抛出 AssertionError 异常。
3. `message` (可选): 如果断言失败（也就是函数抛出了错误），这个字符串信息会被添加到 AssertionError 异常中，使得调试更加容易。

让我们来举几个实际运用的例子：

### 例子 1：一个不抛出错误的函数

```javascript
const assert = require("assert");

function doesNotThrowError() {
  return true;
}

// 我们预期这个函数在执行时不会抛出错误
assert.doesNotThrow(doesNotThrowError); // 正常执行，没有错误。
```

在这个例子中，由于函数 `doesNotThrowError` 在执行时没有抛出任何错误，所以 `assert.doesNotThrow()` 不会有任何的输出，程序会正常继续运行。

### 例子 2：一个抛出错误的函数

```javascript
const assert = require("assert");
////来源：doc.cherrychat.org 请勿商用
function throwsTypeError() {
  throw new TypeError("This is a type error");
}

// 我们预期这个函数在执行时不会抛出类型错误
try {
  assert.doesNotThrow(
    throwsTypeError,
    TypeError,
    "Function should not throw a TypeError"
  );
} catch (error) {
  console.error(error.message);
  // 输出: Function should not throw a TypeError
}
```

在这个例子中，因为 `throwsTypeError` 函数抛出了一个 `TypeError`，这与我们使用 `assert.doesNotThrow()` 断言的预期相反，所以会抛出一个 AssertionError 异常，并且包含我们提供的 `'Function should not throw a TypeError'` 信息。

### 例子 3：使用正则表达式作为错误参数

```javascript
const assert = require("assert");

function throwsErrorWithMessage() {
  throw new Error("This will fail");
}

try {
  // 我们预期这个函数在执行时不会抛出包含特定文本的错误
  assert.doesNotThrow(
    throwsErrorWithMessage,
    /fail/,
    'Should not throw an error with "fail"'
  );
} catch (error) {
  console.error(error.message);
  // 输出: Should not throw an error with "fail"
}
```

在这个例子中，我们使用了一个正则表达式 `/fail/` 来检测错误消息中是否包含单词 "fail"。由于抛出的错误中确实包含了 "fail"，所以 `assert.doesNotThrow()` 断言失败，抛出了 AssertionError 异常，并且包含我们提供的信息。

总结起来，`assert.doesNotThrow()` 是一个在测试过程中验证代码不应该抛出错误的工具，通过捕获和处理函数执行中可能发生的异常，它帮助开发者确保代码的健壮性和正确性。

## [assert.equal(actual, expected[, message])](https://nodejs.org/docs/latest/api/assert.html#assertequalactual-expected-message)

当然，让我来帮你理解 Node.js 中的 `assert.equal` 方法。

在编程中，尤其是进行单元测试时，我们经常需要验证代码的某个部分是否按照预期工作。这就是断言（assertion）的用歌。在 Node.js 的 `assert` 模块中，提供了一系列的断言测试方法，用于确保代码表现出预期的行为。

`assert.equal(actual, expected[, message])` 是其中的一个方法。这个方法用于检查两个值是否相等。如果不相等，将会抛出一个错误。这里是它接收的参数：

- `actual`: 这是你的代码产生的实际结果。
- `expected`: 这是你期望得到的结果。
- `message`: 如果实际结果与预期结果不符，你可以提供一个自定义的错误信息，这个参数是可选的。

如果 `actual` 与 `expected` 不等，那么 `assert.equal` 会抛出一个异常，并且会显示你提供的 `message`（如果你没有提供 `message`，则会显示默认的错误信息）。注意，`assert.equal` 使用的是 `==` 比较，也就是说它会进行类型转换。

下面是一些使用 `assert.equal` 的实际例子：

### 例子 1: 基本使用

```javascript
const assert = require("assert");

function add(a, b) {
  return a + b;
}

// 测试 add 函数
assert.equal(add(1, 1), 2, "1 加 1 应该等于 2");

// 如果上面的断言失败了，将会抛出一个错误：
// AssertionError: 1 加 1 应该等于 2
```

### 例子 2: 在没有提供错误信息的情况下使用

```javascript
const assert = require("assert");

// 假设有一个函数 supposedToReturnString 返回一个值
function supposedToReturnString() {
  return 123; // 故意写错，应该返回字符串
}

// 这里我们期待返回值是一个字符串 "hello"
assert.equal(supposedToReturnString(), "hello");

// 由于返回的是数字 123，而不是字符串 "hello"，
// 上面的断言会失败并抛出一个错误，但错误信息是默认生成的。
```

### 例子 3: 在异步代码中使用

```javascript
const assert = require("assert");

// 假设有一个异步函数 fetchTitle，它从网络获取一个标题
function fetchTitle(callback) {
  setTimeout(() => {
    callback("Node.js Guide"); // 假装这是从网上获取的标题
  }, 100);
}

// 测试 fetchTitle 函数
fetchTitle((title) => {
  assert.equal(title, "Node.js Guide", "标题应该匹配");
});

// 如果 fetchTitle 函数没有按照预期返回 'Node.js Guide'，
// 那么断言会失败，并抛出一个错误。
```

请记住，在 Node.js v14.x 版本之后，`assert.equal` 被弃用（deprecated），推荐使用 `assert.strictEqual` 方法，因为它采用严格相等比较（使用 `===`），不会发生类型转换，从而减少潜在的错误和混淆。

## [assert.fail([message])](https://nodejs.org/docs/latest/api/assert.html#assertfailmessage)

`assert.fail([message])` 是 Node.js 中的一个断言函数，它属于 `assert` 模块。在编程中，断言(assertion)通常用来进行测试，确保代码的行为符合预期。如果断言失败（即条件不成立），通常会抛出一个错误。

在 Node.js 的 `assert` 模块中，`assert.fail()` 方法是特殊的，因为它会直接导致一个断言失败，不需要任何条件。你可以使用这个方法来测试错误处理代码或者确保某段代码不被执行。

下面我们来看几个实际的例子来理解 `assert.fail([message])` 的使用：

### 例子 1：测试错误处理

假设你有一个函数 `processData`，当处理失败时应该抛出一个错误。你想测试当处理失败时这个错误是否正确地被抛出。

```javascript
const assert = require("assert");

function processData(data) {
  if (data.invalid) {
    throw new Error("Invalid data!");
  }
  // ... 处理数据 ...
}

try {
  // 假设你传递了无效的数据给 processData
  processData({ invalid: true });

  // 如果 processData 没有抛出错误，那么使用 assert.fail 指出这是一个失败。
  assert.fail("processData should have thrown an error for invalid data");
} catch (error) {
  // 如果捕获到错误，检查它是否是预期的错误
  assert.equal(error.message, "Invalid data!");
}
```

在上面这个例子中，我们期望 `processData` 函数抛出一个错误，如果没有抛出，我们使用 `assert.fail` 来表示测试未按预期执行。

### 例子 2：确保代码的某部分不被执行

考虑另一个场景，你有一个回调函数应该在特定条件下不被调用。你可以在回调函数内部使用 `assert.fail` 来确保该函数没有被错误地执行。

```javascript
const assert = require("assert");

function runCallbackUnderCondition(callback, condition) {
  if (!condition) {
    callback();
  }
}

runCallbackUnderCondition(() => {
  // 这个回调不应该执行，如果执行了，就标记为失败
  assert.fail("Callback should not have been called");
}, false);
```

在这个例子中，如果 `condition` 是 `false`，则 `callback` 不应该被调用。如果由于某些原因 `callback` 被调用了，`assert.fail` 将会触发，并且抛出一个错误，告诉我们有东西出错了。

### 总结

`assert.fail([message])` 主要用于测试目的，是让你能够明确表达“这里不应该被执行到”的意图。当你期望某个动作导致错误或者某段代码不应该被运行时，你可以使用这个函数。通过提供可选的 `message` 参数，你还可以输出一个自定义的错误信息，以便更清晰地了解测试失败的原因。

## [assert.fail(actual, expected[, message[, operator[, stackStartFn]]])](https://nodejs.org/docs/latest/api/assert.html#assertfailactual-expected-message-operator-stackstartfn)

好的，让我来解释一下 Node.js 中的 `assert.fail` 函数。

在编程中，尤其是进行单元测试的时候，我们经常需要验证代码是否按照预期工作。例如，你可能想确认一个函数返回了正确的结果或者确保一个条件为真。这种时候，断言（assertions）就非常有用。

Node.js 的 `assert` 模块就提供了这样的功能，它包含了一系列的函数用于断言。如果某个断言失败了，那么通常会抛出一个错误。

`assert.fail` 是 `assert` 模块中的一个函数，用于明确地标记一个测试为失败。当你调用这个函数时，不管什么情况，都会抛出一个断言错误。

### 函数参数

- `actual` (可选): 实际值。
- `expected` (可选): 预期值。
- `message` (可选): 错误信息，可以是一个字符串或者一个实现了 `Error` 接口的对象。
- `operator` (可选): 用于指定失败的比较操作符的字符串，通常用于断言库内部。
- `stackStartFn` (可选): 如果提供了该参数，它会被用来计算错误栈跟踪的起始位置。

### 使用方式和例子

#### 例子 1：无条件失败

```javascript
const assert = require("assert");

// 这段代码将直接导致断言失败
try {
  assert.fail();
} catch (error) {
  console.error(error.message); // 输出："Assertion failed"
}
```

在上面的例子中，我们没有提供任何参数给 `assert.fail`，所以它将直接抛出一个带有默认错误信息“Assertion failed”的错误。

#### 例子 2：提供自定义错误信息

```javascript
const assert = require("assert");

// 自定义错误信息
try {
  assert.fail("This is a custom error message");
} catch (error) {
  console.error(error.message); // 输出："This is a custom error message"
}
```

这里，我们提供了一个自定义的错误信息给 `assert.fail`，当断言失败时，它会抛出一个带有这个自定义信息的错误。

#### 例子 3：使用 actual 和 expected

```javascript
const assert = require("assert");

// 指定实际值和预期值
try {
  const actualValue = 10;
  const expectedValue = 20;
  assert.fail(
    actualValue,
    expectedValue,
    "Actual value does not match expected value",
    "==="
  );
} catch (error) {
  console.error(error.message);
  // 输出："Expected values to be strictly equal:"
  //       "+ actual - expected"
  //       "+ 10    - 20"
}
```

在这个例子中，我们使用了 `actual`, `expected`, `message`, 和 `operator` 参数。`assert.fail` 抛出了一个错误，其中包含了实际值和预期值的比较。请注意，在这种情况下，即使实际值和预期值相等，`assert.fail` 依然会抛出错误，因为这个函数的目的就是明确表示一个失败的断言。

总结一下，`assert.fail` 可以用来明确指出一个测试应该失败，并允许你提供详细的错误信息。它通常在测试代码不能达到特定执行路径或某些意外情况出现时使用。在实际的单元测试框架中（如 Mocha 或 Jest），使用 `assert.fail` 来标记测试失败是很常见的做法。

## [assert.ifError(value)](https://nodejs.org/docs/latest/api/assert.html#assertiferrorvalue)

`assert.ifError(value)` 是 Node.js 中 `assert` 模块的一个功能。在 Node.js 中，`assert` 模块通常用于进行各种断言测试，即验证代码的某个特定部分是否如预期地正确运行。`assert.ifError(value)` 函数的主要作用是检查其参数 `value` 是否为一个错误对象（`error`）。如果 `value` 是一个错误对象，那么 `assert.ifError` 会抛出这个错误；如果 `value` 不是错误对象，即为 `null` 或 `undefined`，则不会有任何反应，代码继续执行。

在实际应用中，你可能会在处理异步操作的回调函数中遇到 `assert.ifError` 的用例。当异步操作完成后，回调函数通常会接收两个参数：一个是可能出现的错误对象`err`，另一个是操作结果`data`。使用 `assert.ifError` 可以帮助你检查是否发生了错误，并且立即抛出，这样可以及时发现并处理问题。

下面通过几个例子来具体说明：

### 示例 1：读取文件

```javascript
const fs = require("fs");
const assert = require("assert");

// 异步读取文件
fs.readFile("somefile.txt", (err, data) => {
  // 如果读取过程中有错误发生，抛出这个错误
  assert.ifError(err);

  // 否则，正常处理文件内容
  console.log(data.toString());
});
```

在这个例子中，我们使用 Node.js 的 `fs`（文件系统）模块来异步读取一个名为 `somefile.txt` 的文件。读取操作完成后，会调用一个回调函数，它接收两个参数：`err` 和 `data`。如果文件读取过程中发生了错误（例如，文件不存在），`err` 参数会包含错误信息。使用 `assert.ifError(err)` 会检查 `err` 是否存在，如果存在就会抛出错误，否则程序继续向下执行并输出文件内容。

### 示例 2：数据库查询

```javascript
const database = require("some-database-lib");
const assert = require("assert");

// 执行数据库查询
database.query("SELECT * FROM users", (err, results) => {
  // 如果查询过程中有错误发生，抛出这个错误
  assert.ifError(err);

  // 否则，正常处理查询结果
  console.log(results);
});
```

在这个例子中，我们假设有一个数据库库 `some-database-lib`，用于执行 SQL 查询。我们试图从 `users` 表中选择所有记录。查询结束后，回调函数被调用，传入可能的错误对象 `err` 和查询结果 `results`。使用 `assert.ifError(err)` 来检查是否有错误发生。如果没有错误，则继续处理和输出查询结果。

### 注意事项：

- `assert.ifError()` 在发现错误时会抛出异常，这意味着如果你不处理这个异常（例如，使用 try-catch），那么你的程序可能会直接终止。
- 在最新版本的 Node.js 中，推荐使用更现代的异步处理方式，比如 Promises 或者 async/await，而不是依赖回调和 `assert.ifError()`。

以上就是 `assert.ifError(value)` 的详细解释和一些实际使用示例，希望能帮助你更好地理解这个函数的作用和用法。

## [assert.match(string, regexp[, message])](https://nodejs.org/docs/latest/api/assert.html#assertmatchstring-regexp-message)

`assert.match(string, regexp[, message])` 是 Node.js 中 `assert` 模块提供的一个函数，用于验证一个字符串是否匹配一个正则表达式规则。如果字符串没有符合指定的正则表达式，那么这个函数会抛出一个错误。

在这里，让我们分解一下这个函数的各个部分：

- `string`：这是你想要进行测试的文本。
- `regexp`：这是一个正则表达式对象，用来定义你期望字符串符合的规则。
- `message`（可选）：如果断言失败，可以提供一个自定义的错误消息，这个消息会被展示给用户。

实际运用的例子：

假设你正在编写一个程序，需要检查用户输入的是不是有效的电子邮箱地址。你可以使用 `assert.match` 来确保用户输入的字符串符合电子邮件地址的通常格式。

```javascript
const assert = require("assert");

// 电子邮件正则表达式（简化版本）
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

try {
  // 测试有效的电子邮件
  assert.match("user@example.com", emailRegex);
  console.log("有效的电子邮件地址！");
} catch (error) {
  console.error("电子邮件地址无效：", error.message);
}

try {
  // 测试无效的电子邮件
  assert.match("userexample.com", emailRegex);
} catch (error) {
  console.error("电子邮件地址无效：", error.message);
}
```

在上面的代码里，我们首先引入了 Node.js 的 `assert` 模块。接着定义了一个简单的正则表达式来近似地验证电子邮件地址的格式。然后，我们用 `try...catch` 结构两次调用 `assert.match` 函数：第一次传入一个有效的电子邮件地址，第二次传入一个无效的字符串。当 `assert.match` 断言失败时，会抛出一个错误，这个错误会在 `catch` 块中被捕获，并打印出自定义的错误消息。

如果字符串通过了正则表达式的检测，程序会继续打印“有效的电子邮件地址！”。如果没有通过，则会在控制台输出一条错误消息，告知“电子邮件地址无效”，并展示具体的错误信息。

这种方法非常有用于在程序中验证数据，确保它们符合你设定的预期格式和规则。通过使用 `assert.match`，你可以方便地对用户输入、配置项或任何其他字符串数据进行校验。

## [assert.notDeepEqual(actual, expected[, message])](https://nodejs.org/docs/latest/api/assert.html#assertnotdeepequalactual-expected-message)

`assert.notDeepEqual(actual, expected[, message])` 是 Node.js 中的一个断言方法，用于测试两个变量在结构上是否不完全相等。断言（`assert`）是一种检查代码行为的方式，确保代码运行结果符合预期。如果断言失败（即实际结果和预期不符），则会抛出错误。

这里解释一下“深度相等”（deep equality）的概念。当我们比较两个对象或数组时，即使它们包含相同的数据，但如果它们在内存中是不同的实体，它们也被认为是不相等的。这就是所谓的“浅相等”（shallow equality）。而“深度相等”则是指不仅数据相同，结构也要完全一致，即每个嵌套的对象或数组都应当相等。

`assert.notDeepEqual` 的作用是判断两个变量的值以及它们内部结构是否不相等。如果这两个变量在结构和嵌套的数据上完全一样，那么断言会失败，并抛出错误。

参数说明：

- `actual`: 实际得到的结果。
- `expected`: 你期望的结果。
- `message`: 如果断言失败，抛出的错误信息中会包含这个消息字符串。

举几个具体的例子：

```javascript
// 引入 assert 模块
const assert = require("assert");

// 示例 1：两个对象具有相同的结构和值，断言将失败，因为我们期望它们不相等。
const obj1 = { a: { b: 1 } };
const obj2 = { a: { b: 1 } };
try {
  assert.notDeepEqual(obj1, obj2);
} catch (err) {
  console.error(err.message); // 断言错误：AssertionError [ERR_ASSERTION]: Input objects are identical
}

// 示例 2：两个对象在结构上类似，但值不同，断言将通过，没有错误抛出。
const obj3 = { a: { b: 1 } };
const obj4 = { a: { b: "1" } }; // 注意：b 的值是字符串类型的 '1'
assert.notDeepEqual(obj3, obj4); // 通过断言

// 示例 3：两个数组的元素看起来相同，但有不同的引用，断言将通过。
const arr1 = [{ a: 1 }, { b: 2 }];
const arr2 = [{ a: 1 }, { b: 2 }];
assert.notDeepEqual(arr1, arr2); // 通过断言

// 示例 4：使用自定义信息
try {
  const obj5 = { a: 1 };
  const obj6 = { a: 1 };
  assert.notDeepEqual(obj5, obj6, "这两个对象是相等的");
} catch (err) {
  console.error(err.message); // 这两个对象是相等的
}
```

以上示例中，只有在实际值和期望值不深度相等的情况下断言才会成功，否则会抛出错误。可以看到，在第一个示例中，虽然 `obj1` 和 `obj2` 在内存中是不同的对象，但它们的结构和包含的数据相同，因此断言失败，并得到了一个异常。其他示例中，由于数据或类型上的细微差异，断言正确地通过了。

## [assert.notDeepStrictEqual(actual, expected[, message])](https://nodejs.org/docs/latest/api/assert.html#assertnotdeepstrictequalactual-expected-message)

好的，Node.js 中的 `assert` 模块提供了一系列的断言测试，这些是用于确保代码按照预期方式工作的函数。在编程中，“断言”是指检查程序是否有某种状态，如果不是，则抛出一个错误。

`assert.notDeepStrictEqual(actual, expected[, message])` 是 `assert` 模块中的一个函数，它用于判断两个变量的值和类型是否不严格深度相等。这里的“不严格深度相等”意味着：

- 它比较对象的属性和数组的元素，包括嵌套结构。
- 该比较不仅检查值，还检查值的类型。
- 不同于 `==` 或者 `!=` 这样的宽松比较（它们做类型转换），这里使用的是类似于 `===` 或者 `!==` 的严格比较。

如果实际值 (`actual`) 和预期值 (`expected`) 深度严格相等，则该断言会失败，并抛出一个错误。可选的 `message` 参数可以提供自定义的错误信息。

让我们通过几个例子来理解 `assert.notDeepStrictEqual()` 的用法：

### 示例 1：比较简单的数据

```javascript
const assert = require("assert");

let actual = 3;
let expected = 4;

// 这将不会抛出错误，因为 actual !== expected
assert.notDeepStrictEqual(actual, expected);
```

### 示例 2：比较数组

```javascript
const assert = require("assert");

let actual = [1, 2, 3];
let expected = [1, 2, 3];

// 这将会抛出错误，因为两个数组是深度严格相等的
try {
  assert.notDeepStrictEqual(actual, expected);
} catch (err) {
  console.error(err.message); // 输出自动生成的错误信息
}
```

### 示例 3：比较对象

```javascript
const assert = require("assert");

let person1 = { name: "Alice", age: 25 };
let person2 = { name: "Alice", age: 25 };

// 尽管这两个对象看起来相同，但它们在内存中是不同的实例。
// 因此，以下断言将不会抛出错误。
assert.notDeepStrictEqual(person1, person2);
```

### 示例 4：比较嵌套结构

```javascript
const assert = require("assert");

let actual = { a: { b: 2 } };
let expected = { a: { b: 2 } };

// 这将会抛出错误，因为两个对象的结构和值都是深度严格相等的
try {
  assert.notDeepStrictEqual(actual, expected);
} catch (err) {
  console.error(err.message);
}
```

在实际编程中，你可能会在单元测试时使用这个函数，以确保你的函数或方法返回的结果不与一个特定的错误结果相匹配。例如，你可能想确认一个排序函数没有返回未排序的数组，或者一个数据处理函数没有返回一个错误的对象结构。通过这种方式，`assert.notDeepStrictEqual()` 可以帮助你捕获潜在的错误并确保代码的稳健性。

## [assert.notEqual(actual, expected[, message])](https://nodejs.org/docs/latest/api/assert.html#assertnotequalactual-expected-message)

`assert.notEqual(actual, expected[, message])` 是 Node.js 中的一个断言函数，属于 `assert` 模块。这个函数用来检查两个值是否不相等。如果两个值相等，那么这个函数会抛出一个错误（AssertionError），表示测试失败。如果它们不相等，说明这个检查通过了，程序则会继续执行。

在 Node.js 中，`assert`模块通常用于编写测试代码，以确保你的代码按照预期那样工作。

`actual` 参数是你的代码产生的实际结果。
`expected` 参数是你预期的结果，你希望 `actual` 不要等于这个值。
`message` 参数是可选的，它是当断言失败时显示的错误信息。

下面举几个例子来说明 `assert.notEqual` 的用法：

### 例子 1: 基本用法

```javascript
const assert = require("assert");

let actualValue = 5;
let unexpectedValue = 5;

// 这里我们期望 actualValue 和 unexpectedValue 不相等。
// 因为它们实际上是相等的，所以会抛出 AssertionError。
assert.notEqual(actualValue, unexpectedValue);
```

在这个例子中，我们期待 `actualValue` （实际值）和 `unexpectedValue` （不期望的值）不相等，但事实上它们相等，因此代码会抛出一个错误，并停止执行。

### 例子 2: 自定义错误信息

```javascript
const assert = require("assert");

let actualValue = "hello";
let unexpectedValue = "hello";

try {
  // 如果 actualValue 和 unexpectedValue 相等，则会抛出错误。
  // 错误信息将被设置为 'Values should not be equal'
  assert.notEqual(actualValue, unexpectedValue, "Values should not be equal");
} catch (error) {
  console.error(error.message); // 输出: Values should not be equal
}
```

在这个例子中，我们传递了一个自定义的错误信息。当 `actualValue` 和 `unexpectedValue` 相等时，会抛出一个错误，并显示我们提供的错误信息。

### 例子 3: 测试对象不相等

```javascript
const assert = require("assert");

let actualObject = { a: 1 };
let unexpectedObject = { a: 1 };

// 尽管两个对象内容看起来相同，但它们在内存中是两个不同的实例，所以不会抛出错误。
assert.notEqual(actualObject, unexpectedObject);
```

在这个例子中，尽管 `actualObject` 和 `unexpectedObject` 在结构上看起来相同，但在 JavaScript 中，对象是通过引用来比较的。因为这两个对象是分别创建的，它们引用的内存地址不同，所以 `assert.notEqual` 不会抛出错误。

需要注意的是，在 Node.js v14.x 版本后，`assert.notEqual` 被标记为废弃的，官方建议使用 `assert.notStrictEqual` 方法替换它，以进行更严格的比较。

## [assert.notStrictEqual(actual, expected[, message])](https://nodejs.org/docs/latest/api/assert.html#assertnotstrictequalactual-expected-message)

在 Node.js 中，`assert` 模块提供了一组用于测试的断言函数。这些函数常用于编写测试代码，帮助开发者验证代码是否按照预期运行。

`assert.notStrictEqual(actual, expected[, message])` 是 `assert` 模块中的一个函数，它用来检查两个值是否不严格相等。所谓“不严格相等”，意味着它们在内存中的地址或者引用不相同，或者它们的类型和值不完全匹配。这与 `==`（宽松相等）和 `===`（严格相等）在 JavaScript 中的比较是对应的。

### 用法：

- `actual`：实际值，即你的代码产生的结果。
- `expected`：期望值，即你认为正确的结果。
- `message`：当断言失败时要显示的错误信息（可选）。

如果 `actual` 和 `expected` 值严格不相等，什么都不会发生，你的测试会继续运行。如果它们严格相等，那么会抛出一个错误，通常包含 `message` 提供的信息（如果传递了 `message` 参数）。

### 实际例子：

假设你正在编写一个简单的程序，该程序包括一个函数，该函数应返回两个参数相乘的结果：

```javascript
function multiply(a, b) {
  return a * b;
}
```

现在你想测试这个函数，确保它不会错误地返回相加的结果。你可以写如下测试代码：

```javascript
const assert = require("assert");

function multiply(a, b) {
  return a * b; // 正确的实现
}

// 测试用例
const result = multiply(2, 3);

// 检查multiply函数的输出不是相加的结果
assert.notStrictEqual(
  result,
  2 + 3,
  "Multiply should not return the sum of the arguments"
);
```

如果 `multiply` 函数正常工作，并返回了 `6`（2 乘以 3 的结果），`assert.notStrictEqual` 将通过，因为 `6` （乘法结果）不等于 `5`（加法结果）。

但是，如果我们的函数有错误，比如它错误地返回了相加的结果：

```javascript
function multiply(a, b) {
  return a + b; // 错误的实现
}
```

此时，`assert.notStrictEqual` 将会失败，因为 `multiply(2, 3)` 将返回 `5`，这恰巧等于 `2 + 3`，违反了我们的测试期望，即 “乘法结果不应该等于加法结果”。 断言失败时，它会抛出一个错误，错误信息将是：“Multiply should not return the sum of the arguments”。

使用 `assert.notStrictEqual` 可以帮助你捕获一些可能由于粗心导致的编程错误，或者确保代码的变更没有破坏原有的功能。在自动化测试中，它是确保代码质量和稳定性的关键工具之一。

## [assert.ok(value[, message])](https://nodejs.org/docs/latest/api/assert.html#assertokvalue-message)

`assert.ok(value[, message])` 是 Node.js 中 `assert` 模块提供的一个基本函数，用于断言测试。这个函数的作用是验证一个值是否为真（truthy），即在逻辑上该值不是假（false）、0、空字符串('')、null、undefined 或者 NaN 等。

如果传递给 `assert.ok()` 的值不满足以上条件（即它为真），那么程序会继续执行，没有任何反应。但如果值为假，那么就会抛出一个 `AssertionError`。如果你提供了第二个参数 `message`，那么当断言失败时，这个消息将作为错误信息的一部分被输出，帮助你快速定位问题。

下面举几个例子来说明这个函数是如何工作的:

### 例子 1: 断言一个值为真

```javascript
const assert = require("assert");

// 假设我们有一个函数，返回用户是否已登录
function isLoggedIn(user) {
  // 这里只是一个示例，实际情况可能需要检查用户的登录状态
  return user && user.loggedIn;
}

// 用户信息示例
const user = {
  name: "Alice",
  loggedIn: true,
};

// 使用 assert.ok() 断言用户已登录
assert.ok(isLoggedIn(user), "用户未登录"); // 由于用户已登录，所以这里不会抛出异常
```

在这个例子中，如果 `isLoggedIn(user)` 返回 `false`，则会抛出错误，错误信息为 "用户未登录"。

### 例子 2: 断言失败并抛出自定义错误信息

```javascript
const assert = require("assert");

// 假设有一个函数计算购物车中商品的总价
function calculateTotal(items) {
  // 示例计算总价，实际中需要对 items 数组进行处理
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

// 购物车商品示例
const cartItems = [
  { name: "笔", price: 1.5, quantity: 2 },
  { name: "纸", price: 2.0, quantity: 1 },
];

// 计算总价
const total = calculateTotal(cartItems);

// 使用 assert.ok() 断言总价大于 0
assert.ok(total > 0, "购物车的总价应该大于 0"); // 如果 total 不大于 0，会抛出 "购物车的总价应该大于 0" 错误
```

在这个例子中，如果 `calculateTotal(cartItems)` 的结果小于或等于 0，则 `assert.ok()` 会抛出一个带有 "购物车的总价应该大于 0" 的错误信息。

使用 `assert.ok()` 最常见的场景是在单元测试中。开发者会用它来确保代码的某个部分（比如一个函数的输出）符合预期。如果不符合预期，即断言失败，测试框架就能够捕获错误，并报告测试未通过。

注意：在生产环境中使用断言要非常小心，因为断言失败会导致程序崩溃。通常断言主要用于开发和测试阶段。

## [assert.rejects(asyncFn[, error][, message])](https://nodejs.org/docs/latest/api/assert.html#assertrejectsasyncfn-error-message)

`assert.rejects()` 是 Node.js 中 `assert` 模块的一个方法，该模块用于编写测试代码。在编程中，我们经常需要确保我们的程序表现出预期的行为，尤其是当遇到错误或异常情况时。对此，我们编写测试来验证这些行为，并使用断言(assert)来声明某些条件必须为真。

`assert.rejects()` 方法专门用来测试异步函数是否像预期那样被拒绝(rejected)。在 JavaScript 的世界里，异步操作通常通过 Promise 来处理，而一个 Promise 可以被解决(resolved)也可以被拒绝(rejected)。如果一个异步操作失败了，我们就期望它返回一个被拒绝的 Promise。

以下是 `assert.rejects()` 方法的基本使用方法：

```js
const assert = require("assert");

// 异步函数，返回一个会被拒绝的 Promise
async function myAsyncFunction() {
  throw new Error("出错啦！");
}

// 测试该异步函数是否如预期一样被拒绝
assert
  .rejects(
    myAsyncFunction, // 我们要测试的异步函数
    Error, // 预期的错误类型
    "myAsyncFunction 应该抛出一个错误" // 如果断言失败了，抛出的错误消息
  )
  .then(() => {
    console.log("测试通过，函数被正确地拒绝");
  });
```

在上面的例子中，`myAsyncFunction` 是一个会抛出错误的异步函数。我们期望这个函数执行后返回的 Promise 被拒绝，并带有一个错误。

`assert.rejects()` 接受三个参数：

1. `asyncFn`: 一个返回 Promise 的异步函数或者直接就是一个 Promise。
2. `error` (可选): 这个参数描述了预期的错误应该是什么样的，它可以是：
   - 一个构造函数，例如 `Error`，表示预期错误应该是这个类的实例。
   - 一个正则表达式，用来匹配错误信息中的文本。
   - 一个具体的对象，表示预期错误对象应该与它深度相等。
   - 一个断言函数，自定义检查错误对象的逻辑。
3. `message` (可选): 如果断言失败，将抛出的错误消息，帮助开发者快速定位问题。

让我们看另一个例子，这次我们期望错误信息中包含特定的文本：

```js
const assert = require("assert");

async function anotherAsyncFunction() {
  throw new Error("网络请求失败");
}

assert
  .rejects(
    anotherAsyncFunction,
    /网络请求失败/, // 使用正则表达式来匹配错误信息
    "anotherAsyncFunction 应该抛出包含特定信息的错误"
  )
  .then(() => {
    console.log("测试通过，函数抛出了包含特定文本的错误");
  });
```

在这个例子中，我们预期 `anotherAsyncFunction` 函数抛出的错误信息中包含 "网络请求失败" 这段文本。

总之，`assert.rejects()` 是 Node.js 中一个十分有用的工具，它能帮助你验证异步代码在遇到错误时是否按照预期工作。通过正确使用它，你可以提高代码的健壮性和可靠性。

## [assert.strictEqual(actual, expected[, message])](https://nodejs.org/docs/latest/api/assert.html#assertstrictequalactual-expected-message)

`assert.strictEqual(actual, expected[, message])` 是 Node.js 中的一个断言函数，它用来测试代码。这个函数是 `assert` 模块中的一个方法，`assert` 模块提供了一系列用于测试和验证代码功能是否正确的函数。

在使用 `assert.strictEqual` 方法时，你需要给它传递两个参数：`actual` 和 `expected`。这两个参数分别代表实际值和期望值。如果这两个值严格相等（即它们的类型和值都相同），那么该函数不会有任何输出；如果不相等，则会抛出一个错误。可选的第三个参数 `message` 是当断言失败时要显示的错误信息。

### 详细解释：

- `actual`: 实际得到的结果。
- `expected`: 你期望得到的结果。
- `message`: 当实际结果与预期结果不严格相等时，将抛出一个包含这个消息的错误。

### 为什么要用 `assert.strictEqual`？

在编写代码时，我们通常会写单元测试来确保代码行为符合预期。`assert.strictEqual` 就是用于这种测试的一个工具。通过比较实际值和期望值是否完全相等，它帮助开发者捕捉错误和问题。

### 例子：

假设你正在编写一个函数，该函数用于计算两个数字的和。

```javascript
function add(a, b) {
  return a + b;
}
```

现在，你想测试这个函数是否如你所期望的那样工作。你可以写一个测试用例：

```javascript
const assert = require("assert");

// 测试 add 函数
const result = add(2, 3); // 实际调用函数

// 使用 assert.strictEqual 检查函数输出是否为 5
assert.strictEqual(result, 5, "2 + 3 应该等于 5");
```

在上面的例子中，如果 `add` 函数正确地返回了 `5`，则 `assert.strictEqual` 不会有任何输出。但如果 `add` 函数返回的不是 `5`，例如由于某些错误而返回了 `4`，那么 `assert.strictEqual` 会抛出一个错误，并显示提供的错误信息 `'2 + 3 应该等于 5'`。

### 注意事项：

- "严格相等"意味着它不会在比较时进行类型转换。例如，字符串 `'5'` 和数字 `5` 在严格相等的意义上是不相等的。
- 如果你只关心值而不关心类型，可以使用 `assert.equal` 方法，它允许在比较时进行类型转换。

使用 `assert.strictEqual` 及其他断言方法可以帮助你确保代码的可靠性，并及时发现潜在的错误。

## [assert.throws(fn[, error][, message])](https://nodejs.org/docs/latest/api/assert.html#assertthrowsfn-error-message)

Node.js 中的 `assert` 是一个用于进行各种断言测试的模块。其中 `assert.throws()` 方法是用来测试一个函数 `fn` 是否会抛出一个错误。如果函数没有抛出错误，或者抛出的错误与预期不符，`assert.throws()` 将会抛出一个 AssertionError（断言错误）。

参数解释：

- `fn`：这个参数是你想要测试的函数，它应当在执行时抛出一个错误。
- `error`：这是可选参数。它可以是一个构造函数、正则表达式、错误消息或者验证函数，用于检查抛出的错误是否满足特定的条件。
- `message`：这也是一个可选参数。如果提供了这个参数，在断言失败时会显示这个自定义错误消息，而不是默认的错误消息。

举几个实际的例子来说明这个方法的使用：

**例子 1：基本使用**

假设我们有一个函数 `myFunction`，它在遇到错误情况时应该抛出一个错误：

```js
function myFunction() {
  throw new Error("出问题了！");
}
```

我们想要测试 `myFunction` 是否真的抛出了错误：

```js
const assert = require("assert");

try {
  assert.throws(myFunction); // 测试 myFunction 是否抛出错误
  console.log("myFunction 正确地抛出了一个错误。");
} catch (err) {
  console.error("myFunction 没有抛出错误，或者抛出的错误类型不正确。");
}
```

**例子 2：使用错误类型进行测试**

现在我们想进一步确认 `myFunction` 抛出的错误是特定类型的。比如我们预期它应该抛出一个 `TypeError`：

```js
function myFunction() {
  throw new TypeError("这是一个类型错误！");
}

const assert = require("assert");

try {
  assert.throws(myFunction, TypeError); // 测试 myFunction 抛出的是否为 TypeError 类型的错误
  console.log("myFunction 正确地抛出了 TypeError 错误。");
} catch (err) {
  console.error(
    "myFunction 没有抛出 TypeError 错误，或者抛出的错误类型不正确。"
  );
}
```

**例子 3：使用自定义错误信息**

可能我们还希望定制 AssertionError 的错误消息，使其更加清晰易懂：

```js
function myFunction() {
  throw new Error("错误发生了！");
}

const assert = require("assert");

try {
  assert.throws(myFunction, TypeError, "myFunction 应该抛出 TypeError!");
} catch (err) {
  console.error(err.message);
  // 输出 "myFunction 应该抛出 TypeError!" 而不是 assert 默认的错误信息
}
```

总结一下，`assert.throws()` 方法是用来测试一个函数是否按照预期抛出了错误。如果函数运行结果与预期（不抛出错误，或者抛出了不同类型的错误）不一致，它会帮助你快速地找到问题所在，并通过抛出 AssertionError 来通知你测试未通过。
