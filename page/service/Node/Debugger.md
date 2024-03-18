# [Debugger](https://nodejs.org/docs/latest/api/debugger.html#debugger)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，它允许你在服务端运行 JavaScript 代码。在 Node.js 中，Debugger 指的是一个内置的调试工具，用于帮助开发者在编写代码时找到错误和性能问题。

当程序不按预期运行或者出现错误时，你可以使用调试器来暂停程序的执行（这被称为 "断点"），查看变量的当前值，逐步执行代码（一步一步运行），并且检查程序的执行流程等。

以下是如何使用 Node.js 内置调试器的基本步骤：

1. **启动调试模式：** 在 Node.js 中，你可以通过在命令行中添加 `--inspect` 标志来启动调试模式。例如，如果你的文件名是 `app.js`，你可以这样启动你的程序：

   ```bash
   node --inspect app.js
   ```

   如果你想在一个特定的端口上监听调试器，你也可以指定端口号，比如：

   ```bash
   node --inspect=9229 app.js
   ```

2. **打开调试客户端：** 一旦启动了带有 `--inspect` 标志的 Node.js 应用程序，你可以使用多种工具作为调试客户端，最常见的是 Chrome 浏览器。你只需要打开 Chrome，然后在地址栏输入 `chrome://inspect` 并回车。

3. **连接到 Node.js 应用程序：** 在 `chrome://inspect` 页面，你应该能够看到你的 Node.js 应用程序列出来。点击对应的链接，Chrome 将打开 DevTools 调试界面。

4. **设置断点和调试：** 在 DevTools 中，你可以在 JavaScript 代码中单击行号来设置断点。当程序执行到断点时，它会暂停，这时你可以检查变量的值、调用栈和作用域链。你还可以使用 step over（跳过当前函数）、step into（进入当前函数）和 step out（退出当前函数）等操作来控制代码的执行。

举个例子，假设我们有下面这个简单的 Node.js 程序：

```js
// app.js
function sayHello(name) {
  console.log(`Hello, ${name}!`);
}

function greet() {
  const userName = "Alice";
  sayHello(userName);
}

greet();
```

如果我们想要调试这段代码，我们可以这样做：

1. 在终端中运行 `node --inspect app.js`。
2. 打开 Chrome 浏览器，输入 `chrome://inspect`，然后连接到我们的应用程序。
3. 在 DevTools 的 Sources 面板中找到 `app.js`，然后在 `sayHello` 函数的 `console.log` 行上设置断点。
4. 刷新或重新启动你的 Node.js 应用程序，当程序执行到 `console.log` 这一行时，它将暂停，允许你检查变量 `name` 的值。

通过以上步骤，你就可以开始使用 Node.js 的内置调试工具来调试你的应用程序了。记住，实际调试时可能涉及到更复杂的情况，但基本的流程和概念是相同的。

## [Watchers](https://nodejs.org/docs/latest/api/debugger.html#watchers)

Node.js 中的“Watchers”是调试功能的一部分，它允许你在调试代码时监视表达式或变量的值。当你使用 Node.js 内置的调试器时，可以设置观察者（watchers），这样就能在每次断点停止时查看特定的数据状态。这个功能对于理解程序如何运行以及在某一时刻程序状态是什么样非常有用。

### 如何使用 Watchers

1. **启动调试器**：首先，你需要启动 Node.js 的调试器。可以通过在命令行中添加`inspect`标志来启动你的 Node.js 应用程序，例如：

```bash
node --inspect yourscript.js
```

2. **连接到调试器**：然后，你可以使用 Chrome 浏览器访问`chrome://inspect`并链接到你的 Node.js 进程，或者使用命令行调试器通过输入：

```bash
node inspect yourscript.js
```

3. **设置断点**：在你的代码中设置断点，你可以在命令行调试器中使用命令`sb(`<`line>)`或者在 Chrome 开发者工具中点击你想要停止的行。

4. **添加观察者**：一旦你的代码在一个断点处停止，你可以设置观察者来监控表达式或变量。在命令行调试器中，你可以使用 `watch('expression')` 命令来添加一个观察者。例如，如果你想监视名为`myVariable`的变量，你会输入：

```bash
watch('myVariable')
```

5. **检查观察结果**：每当代码执行暂停在断点时，你都可以查看所有已设置的观察者的当前值。

### 实际例子

假设你有以下简单的 Node.js 脚本，名为`example.js`：

```javascript
let count = 0;

function increment() {
    count += 1;
    console.log('Count is: ' + count);
    if(count `<` 3) {
        setTimeout(increment, 1000);
    }
}

increment();
```

你想调试这个脚本并监视`count`变量的值。下面是你可能采取的步骤：

1. **启动调试器**：

```bash
node inspect example.js
```

2. 使用命令 `c` (continue) 让程序执行直到遇到第一个断点。

3. 当程序停止时，你可以添加一个观察者来监视`count`变量：

```bash
watch('count')
```

4. 再次使用命令 `c` 继续执行程序。

5. 每次当计时器回调函数被调用并且程序在断点处停止时，你都可以看到`count`变量的当前值。这对于跟踪和理解变量如何随时间改变是非常有帮助的。

通过这种方式，使用 Watchers 可以让你更深入地理解你的程序在运行中是如何操作数据的，并帮助你找出和修复 bug。

## [Command reference](https://nodejs.org/docs/latest/api/debugger.html#command-reference)

Node.js 中的命令引用通常是指调试器中可用的一系列命令，这些命令可以帮助你在代码执行时进行检查和控制。在 Node.js v21.7.1 版本中，这些命令可以在官方文档的“Command reference”部分找到。

当你使用 Node.js 的内置调试器时，你可以在命令行界面中输入这些命令来控制程序的执行，比如设置断点、查看变量状态、步进代码等。下面我将通过几个实际应用例子来解释一些常用的命令：

### 1. `cont`, `c`

这个命令用于继续执行被暂停的脚本。如果你已经在某个位置设置了断点，并且程序已经停在那里，你可以通过输入 `cont` 或者简写的 `c` 命令，让程序继续运行直到遇到下一个断点或者程序结束。

**例子**:

```sh
debug> cont
```

### 2. `next`, `n`

这个命令用于单步执行代码但不进入函数内部（即逐行执行但越过函数调用）。当你想要看到当前函数内部的代码如何逐行执行而不跳进任何被调用的函数时，你可以使用 `next` 或者简写的 `n` 命令。

**例子**:

```sh
debug> next
```

### 3. `step`, `s`

与 `next` 不同，`step` 命令用于单步执行代码并进入函数内部。如果当前行调用了一个函数，并且你想要进入这个函数看它是怎么工作的，你就可以使用 `step` 或简写的 `s` 命令。

**例子**:

```sh
debug> step
```

### 4. `out`, `o`

如果你已经使用 `step` 进入了一个函数，但现在你想退出这个函数回到上一层函数，那么你可以使用 `out` 或简写的 `o` 命令。

**例子**:

```sh
debug> out
```

### 5. `setBreakpoint()`, `sb()`

这个命令用于在代码中的特定位置设置一个断点，当程序执行到这个位置时会自动停下来。你可以给出文件名和行号来指定断点的位置。

**例子**:

```sh
debug> setBreakpoint('script.js', 23)
```

这将在 script.js 文件的第 23 行设置一个断点。

以上只是一小部分命令，还有许多其他的命令，如 `watch(expr)` 来监视表达式的值、`restart` 重启脚本等。而且随着版本更新，这些命令可能会发生变化，所以建议查阅最新的 Node.js 文档获取最新信息。

记住，调试器是一个强大的工具，它允许你深入了解你的程序是如何运行的，通过这种方式，你可以更容易地找到并修复程序中的错误。

### [Stepping](https://nodejs.org/docs/latest/api/debugger.html#stepping)

Node.js 中的"Stepping"是一个在调试过程中用来控制程序执行流的术语。当你使用调试器时，你可以一步一步地运行你的代码，这样就可以非常精确地查看和理解你的程序在每个阶段做了什么。这是发现和修复错误非常有用的方法。在 Node.js v21.7.1 中, "Stepping"通常涉及以下几种操作：

1. **step**：执行当前行的代码，如果这行代码包含了一个函数调用，那么调试器将进入这个函数内部，并停在里面的第一行。

2. **next**：也执行当前行的代码，但是与 step 不同的是，即使当前行有函数调用，调试器也不会进入该函数内部，而是直接跳到下一行。

3. **out**：当你在一个函数内部，并想要继续执行直到当前函数执行完毕并返回时使用。

4. **continue**：不再逐行执行，让程序继续运行直到遇到下一个断点（breakpoint）或程序结束。

让我们通过一些例子来说明这些概念：

假设你有以下简单的 Node.js 程序，文件名为`app.js`:

```javascript
function greet(name) {
  console.log("Hello, " + name);
}

function run() {
  greet("Alice");
  greet("Bob");
}

run();
```

这个程序定义了两个函数`greet`和`run`，然后调用`run`函数。`greet`函数负责打印问候信息。

如果你想调试这个程序，你首先在命令行中使用如下命令启动 Node.js 的内置调试器：

```bash
node inspect app.js
```

现在，你正在调试模式下。这意味着可以使用前面提到的 stepping 操作来控制程序的执行。

1. **step (s)**:

   如果你在程序的最开始设置了断点，运行`step`命令会让你进入`run`函数，然后是`greet`函数。

2. **next (n)**:

   当你在`greet('Alice')`这一行时，使用`next`命令会让你跳转到`greet('Bob')`这一行，而不是进入`greet`函数内部。

3. **out (o)**:

   假设你已经用`step`进入了`greet`函数内部，但你决定你不想一行一行查看这个函数了。此时，你可以使用`out`命令，这会让调试器执行完整个`greet`函数，并把你带回到`run`函数的下一行。

4. **continue (c)**:

   当你觉得没有必要逐行执行，想要程序继续运行，可能是直到程序结束或下一个断点，你可以使用`continue`命令。

记住，在调试期间，你可以随时添加新的断点，这样当使用`continue`命令时，程序将停在那些新的断点上。

通过这些 stepping 命令，你可以更好地理解你的程序是如何工作的，以及在执行过程中变量的值是如何变化的。这对于发现逻辑错误或者理解程序流非常有价值。

### [Breakpoints](https://nodejs.org/docs/latest/api/debugger.html#breakpoints)

在编程中，"断点"（Breakpoints）是一种调试代码的技术，它可以让程序在执行到某一行时暂停运行。这使得开发者可以查看程序当前的状态，比如变量的值、调用栈等信息，并且能够单步执行代码以观察程序的行为。

Node.js 提供了一个内置的调试器，可以让你在 Node.js 程序中设置和管理断点。下面我会详细解释如何在 Node.js v21.7.1 中使用断点，以及它们的一些实际应用示例。

### 如何设置断点

在 Node.js 中，你可以通过几种不同的方式设置断点：

1. **在源代码中插入 `debugger` 语句：**
   你可以在想要暂停的代码行上方添加一个 `debugger;` 语句。当 Node.js 运行在调试模式下时，每当遇到 `debugger` 语句，它就会暂停执行。

   ```javascript
   // example.js 文件
   console.log("这行将会正常执行");
   debugger; // 程序将在这里暂停
   console.log("如果有调试器连接，这行将会等待执行");
   ```

   要启动调试模式，你需要使用 `--inspect` 标志启动你的程序：

   ```
   node --inspect example.js
   ```

2. **使用 Node.js 调试客户端：**
   Node.js 提供了一个简单的命令行调试客户端，你可以通过它来设置断点。首先，使用以下命令启动调试客户端：

   ```
   node inspect example.js
   ```

   然后，在调试器提示符下，使用 `setBreakpoint()` 或 `sb()` 命令来设置断点。例如：

   ```
   setBreakpoint(3) // 在第三行设置断点
   setBreakpoint('example.js', 3) // 在“example.js”文件的第三行设置断点
   ```

### 断点的实际运用示例

假设我们正在开发一个简单的 web 服务器，并且我们想要调试当用户访问特定路由时的行为。我们猜测在处理用户请求的函数中可能存在一个 bug。

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/hello") {
    debugger; // 设置断点
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World\n");
  } else {
    //来源：doc.cherrychat.org 请勿商用
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

server.listen(3000);
```

在上面的代码中，我们在处理 `/hello` 路由的代码块前加入了 `debugger` 语句。当我们用 `node --inspect` 启动服务并且用户尝试访问 `/hello` 时，程序会在 `debugger` 语句处暂停执行。这时，我们可以使用调试工具检查 `req` 和 `res` 对象的内容，单步执行代码，或者观察其他可能影响程序执行的因素。

这种方式可以帮助我们理解代码是如何运作的，并且让我们找到并修复可能出现的问题。通过逐步检查程序的状态，我们可以更有效地进行问题定位和解决。

### [Information](https://nodejs.org/docs/latest/api/debugger.html#information)

Node.js 中的调试器是一个用来检查和调试正在运行的 Node.js 应用程序的内置模块。在 Node.js v21.7.1 版本中，调试器的信息部分提供了一些命令，可以帮助你了解当前调试会话的状态。

以下是在 Node.js 调试器中的 `info` 命令列表及其作用的介绍：

1. `info break`: 显示所有设置的断点。当你在代码中设置了断点，并想要查看或者确认这些断点的位置时，使用这个命令将显示所有的断点，包括行号和文件名。

2. `info watch`: 显示所有被监视的表达式及其当前值。如果你设置了表达式监视，并想了解这些表达式的当前值，此命令会帮助到你。

3. `info globals`: 显示所有的全局变量。有时候，你可能需要查看全局作用域中有哪些可用的变量，此时就可以使用这个命令。

4. `info locals`: 显示当前函数的局部变量。当你处于某个函数的上下文中并且想知道该函数作用域内有哪些局部变量时，这个命令很有用。

让我们举些实际的例子来解释这些命令如何工作。

假设你有以下简单的 Node.js 脚本（假定保存为 `example.js`）:

```javascript
let x = 10;

function sum(a, b) {
  let result = a + b;
  console.log(result);
  return result;
}

sum(x, 20);
```

现在，如果你想调试这个脚本，你可以在命令行中启动 Node.js 的调试器：

```bash
node inspect example.js
```

这将启动调试会话。现在，让我们使用之前提到的 `info` 命令。

- 使用 `info break` 查看你是否已经设置了任何断点。因为我们还没有设置任何断点，所以它应该会告诉你没有断点。

- 使用 `info globals` 在调试会话开始时查看全局变量。你应该能够看到变量 `x` 和函数 `sum`。

- 使用 `info locals` 在函数 `sum` 的上下文中查看局部变量。例如，你可以在 `sum` 函数的第一行上设置一个断点（使用命令 `setBreakpoint('example.js', 3)`），然后执行程序直到它停在那个断点（使用命令 `cont`），然后使用 `info locals` 来查看变量 `a`, `b`, 和 `result`。

请注意，随着 Node.js 版本的升级，调试器的具体命令和功能可能有变化，请参考对应版本的官方文档以获取最新的指南和信息。

### [Execution control](https://nodejs.org/docs/latest/api/debugger.html#execution-control)

Node.js 的调试器允许开发者控制程序的执行，以及检查当前程序的状态。在 Node.js v21.7.1 中，“Execution control”是指用来管理程序执行流程的一系列命令和功能。这些可以让你暂停代码的运行、逐步执行代码、继续代码运行直到遇到下一个断点等。

以下是`Execution control`中的一些常见命令和它们的作用：

1. `cont`, `c`：继续执行程序，直到遇到下一个断点。
2. `next`, `n`：执行下一行代码，如果当前行有函数调用，不会进入该函数内部。
3. `step`, `s`：单步执行代码，如果当前行有函数调用，会进入该函数内部。
4. `out`, `o`：从当前函数中跳出，回到函数被调用的地方。
5. `pause`：暂停正在运行的代码。

举几个实际的应用例子：

假设你有以下简单的 Node.js 代码：

```javascript
console.log("Hello");
function doSomething() {
  console.log("Doing something...");
}
console.log("Start process");
doSomething();
console.log("End process");
```

现在你想要调试这段代码，首先你得以调试模式启动 Node.js：

```bash
node inspect yourfile.js
```

然后调试器启动后，你会看到提示符 `(debug)`，此时可以输入命令来控制代码的执行。

比如，你想要继续执行直到程序的下一个断点（如果没有设置断点，就是运行完毕），你可以输入：

```bash
cont
```

或者

```bash
c
```

如果你希望单步执行代码，查看`doSomething`函数内部发生了什么，当程序执行到`doSomething()`前你可以输入：

```bash
step
```

或者

```bash
s
```

这样代码会进入`doSomething`函数，并且每次输入`step`或`s`都会执行函数内部的下一行代码。

如果你在函数里面，想要退出当前函数，回到函数被调用的地方，可以使用：

```bash
out
```

或者

```bash
o
```

最后，如果你的程序正在运行，突然想要暂停查看当前执行的状态，可以随时在控制台输入：

```bash
pause
```

这会暂停代码的执行，让你可以检查变量值、调用栈等信息。

总之，“Execution control”提供的这些命令对于逐步深入调试 Node.js 代码非常有用，它们帮助你理解代码的执行流程，找出错误和性能瓶颈。

### [Various](https://nodejs.org/docs/latest/api/debugger.html#various)

Node.js 的调试器让开发者能够对 Node.js 应用程序进行检查和调试。在 Node.js v21.7.1 的文档中，“Various”指的是调试器中的一系列不同的命令和功能，这些可以帮助你更好地控制调试过程。

以下是一些 Node.js 调试器的主要特点和如何在实际开发中使用它们：

1. **启动调试会话**：

   - 通常，你可以通过在终端中运行 `node inspect `<`your_script.js>` 命令来启动一个调试会话。这将启动 Node.js 的内置调试客户端，并暂停执行在第一行代码上。

2. **断点**：

   - 断点允许你暂停代码执行在特定的地方，以便你可以查看变量的当前值或程序的状态。
   - 在代码中，你可以通过插入 `debugger;` 语句设置一个断点。当使用调试器运行代码时，每当执行到 `debugger;` 语句，代码就会暂停执行。
   - 例如，如果你想查看一个函数在处理数据后的结果，你可以在函数返回结果之前加入一个 `debugger;` 语句。

3. **控制执行流**：

   - 使用调试器命令，你可以控制代码的执行流，比如 `cont`, `next`, `step`, `out` 等。
   - `cont` (或 `c`)：继续执行直到遇到下一个断点。
   - `next` (或 `n`)：单步执行下一行代码，但不进入任何函数内部。
   - `step` (或 `s`)：单步执行并步入函数内部。
   - `out` (或 `o`)：从当前函数中步出。

4. **观察变量**：

   - 在调试期间，可以使用 `watch('expression')` 来监视特定的表达式或变量。当你继续执行代码时，这个表达式的值改变了，调试器会通知你。

5. **检查变量值**：

   - 使用 `exec expression` 命令可以在当前暂停的上下文中执行任意表达式，这样你可以检查和计算变量的值。

6. **列出源代码**：
   - 使用 `list(n)` 命令，可以列出当前执行点前后共 `n` 行的源代码，这对于理解当前代码执行的上下文非常有用。

现在，我们举一个具体的例子，假设你有以下简单的 Node.js 脚本 (`script.js`)：

```javascript
function add(a, b) {
  debugger;
  return a + b;
}

const result = add(1, 2);
console.log(result);
```

为了调试这段代码，你可以在你的终端里运行：

```sh
node inspect script.js
```

当脚本开始执行时，它会在 `debugger;` 语句处暂停，在这里你可以检查变量 `a` 和 `b` 的值，然后使用调试命令（如 `cont`、`next`、`step`、`out`）来控制执行流，使用 `watch('a + b')` 来监视表达式的值，或者使用 `exec a + b` 来立即计算表达式的结果。

记住，这些调试技巧对于理解你的代码如何运行以及在发生问题时确定错误的来源都是非常有价值的。随着经验的积累，你会越来越熟悉这些工具，它们将成为你日常工作的重要部分。

## [Advanced usage](https://nodejs.org/docs/latest/api/debugger.html#advanced-usage)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，允许你在服务器端运行 JavaScript 代码。在 Node.js 中，有一个内置的调试器，用于帮助开发者找到代码中的错误和性能瓶颈。

在 Node.js v21.7.1 的文档中，“Advanced usage”通常指的是关于调试器的高级应用方法。这里我会简单介绍几个高级使用调试器的场景，并举例说明如何在实际中应用这些技巧。

### 使用非默认端口或主机连接调试器

默认情况下，Node.js 调试器监听本地计算机上的 127.0.0.1:9229 端口。但在一些场景下，可能需要更改监听的端口或主机地址。例如，如果你想要在不同的网络设置或在 Docker 容器中进行调试，可能就需要修改这些参数。

**实例：**

```sh
node --inspect=0.0.0.0:9230 your-script.js
```

这条命令会启动你的 Node.js 应用并使调试器监听所有网络接口的 9230 端口。这样远程机器也能连接到你的调试器。

### 使用调试协议

Node.js 调试器遵循了一套调试协议，它定义了调试器与外部工具（如 Chrome DevTools）之间的通信方式。理解这个协议可以帮助你在必要时编写自己的调试工具，或者集成到其他 IDE 中。

### 利用脚本延迟调试

有时候，你可能需要在应用启动后立刻开始调试，而不是手动附加调试器到正在运行的进程。为此，可以使用 `--inspect-brk` 标志，这将导致 Node.js 在第一行 JavaScript 代码执行前暂停，直到调试器已附加和准备好。

**实例：**

```sh
node --inspect-brk your-script.js
```

启动后，打开 Chrome 浏览器，输入 chrome://inspect/ 并点击 "Open dedicated DevTools for Node"，你将能够看到你的脚本文件，并能在第一行代码上看到一个断点。

### 自定义调试器行为

通过 CLI 参数或环境变量，可以在启动时传递给 Node.js 调试器以控制其行为。例如，你能够通过设置 `NODE_OPTIONS` 环境变量来预先配置调试器选项，而不是在命令行中重复输入这些选项。

**实例：**

```sh
export NODE_OPTIONS='--inspect=0.0.0.0:9230'
node your-script.js
```

这样做会使得每次启动 Node.js 应用时都会自动监听指定的 IP 地址和端口。

总结起来，"Advanced usage"部分通常涉及对 Node.js 调试器的深入配置和控制，包括改变监听端口、理解调试协议、脚本延迟调试及自定义调试器行为等。通过熟悉这些高级特性，开发者能够更灵活地处理不同的调试场景，并优化他们的开发流程。

### [V8 inspector integration for Node.js](https://nodejs.org/docs/latest/api/debugger.html#v8-inspector-integration-for-nodejs)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境。它使得开发者可以在服务器端运行 JavaScript 代码。与浏览器中运行的 JavaScript 相比，Node.js 提供了更多用于处理文件系统、网络通信等后端功能的 API。

当你写 Node.js 程序时，就像任何其他编程任务一样，你可能需要调试你的代码。调试是找出并修复代码中错误（或称为 bug）的过程。Node.js 提供了几种不同的调试选项，而“V8 inspector integration”是其中一种强大的机制。

### V8 Inspector Integration

V8 inspector 是 Chromium 项目的一部分，它允许开发者连接 DevTools（开发者工具），也就是你在 Chrome 浏览器中看到的那些调试工具，以便对 Node.js 应用进行调试。

V8 inspector 的集成意味着你可以使用熟悉的界面来检查变量的值、单步执行代码、设置断点（代码中的标记，告诉调试器在此处暂停执行）、观察调用栈（一个函数调用另一个函数的顺序）等等。

#### 如何使用 V8 Inspector?

1. 启动 Node.js 程序并启用 inspector。这可以通过在命令行中运行你的 Node.js 应用时添加 `--inspect` 或 `--inspect-brk` 标志来完成。

   - 使用 `--inspect`：这将启动 inspector 但不会在开始时暂停你的应用程序。
   - 使用 `--inspect-brk`：这将在应用程序的第一行代码之前启动 inspector 并暂停程序，从而给你时间来打开 DevTools 并设置断点。

2. 打开 Chrome 浏览器，并访问 `chrome://inspect` 地址。在 "Remote Target" 部分，你应该会看到你的 Node.js 应用程序。

3. 点击 "inspect" 链接，这将打开 DevTools。现在，你可以像调试前端 JavaScript 代码一样调试你的 Node.js 代码。

#### 实际例子

假设你有一个简单的 Node.js 脚本，如下所示：

```javascript
function sayHello(name) {
    console.log('Hello, ' + name);
}

function calculate() {
    let sum = 0;
    for (let i = 0; i `<` 10; i++) {
        sum += i;
    }
    return sum;
}

sayHello('World');
let result = calculate();
console.log('The sum is: ' + result);
```

你想调试这段代码。你可以这样做：

1. 在终端中运行 `node --inspect-brk your-script.js`。
2. 打开 Chrome 浏览器，访问 `chrome://inspect`。
3. 点击相应的 "inspect" 链接来打开 DevTools。
4. 在 DevTools 中，你可以在 `sayHello` 函数声明上设置一个断点，然后点击继续执行按钮。
5. 当代码执行到 `sayHello` 函数时，它会在那里停止，你可以检查变量 `name` 的值，步入函数内部，或者继续执行到下一个断点。

通过 V8 inspector，你可以以一种直观、交互式的方式来调试你的 Node.js 应用，就像调试客户端 JavaScript 代码一样。这是一个非常有用的特性，尤其是对于更复杂的应用程序和新手开发者来说。
