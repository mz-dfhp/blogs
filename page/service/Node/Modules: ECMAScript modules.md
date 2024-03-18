# [Modules: ECMAScript modules](https://nodejs.org/docs/latest/api/esm.html#modules-ecmascript-modules)

Node.js 中的 ECMAScript 模块（ESM）是一种标准格式，用于编写和组织 JavaScript 代码。自 ECMAScript 2015 (ES6) 引入模块概念以来，这成为了在 JavaScript 中管理和封装代码的一种流行方式。ESM 允许开发人员通过 `import` 和 `export` 语句轻松地在不同文件间共享和重用代码。

在 Node.js v21.7.1 中，ECMAScript 模块的使用和支持进一步得到强化，下面通过一些实际例子来解释 ESM 的使用：

### 导出模块

假设你有一个文件 `mathUtils.js`，你想共享其中的一些数学工具函数。

```javascript
// mathUtils.js

// 定义并导出加法函数
export function add(x, y) {
  return x + y;
}

// 定义并导出乘法函数
export function multiply(x, y) {
  return x * y;
}
```

在上述代码中，我们定义了两个简单的数学相关函数：`add` 和 `multiply`，并通过 `export` 关键字将它们导出，以便其他模块可以使用这些函数。

### 导入模块

如果你想在另一个文件 `app.js` 中使用这些数学工具函数，你需要导入它们。

```javascript
// app.js

import { add, multiply } from "./mathUtils.js";

console.log(add(2, 3)); // 输出: 5
console.log(multiply(2, 3)); // 输出: 6
```

这里，我们使用 `import` 语句从 `mathUtils.js` 文件导入了 `add` 和 `multiply` 函数，并且在控制台打印了这些函数的执行结果。

### 默认导出

每个模块还可以有一个“默认”导出，适用于当模块只导出一个东西时更为方便。

比如，你有一个 `greetings.js` 文件:

```javascript
// greetings.js

export default function greet(name) {
  return `Hello, ${name}!`;
}
```

在此例中，`greet` 函数被设置为模块的默认导出。

要导入默认导出的模块，可以这样写：

```javascript
// app.js

import greet from "./greetings.js";

console.log(greet("World")); // 输出: Hello, World!
```

注意，当导入默认导出时，你可以给它指定任意名称。

### 动态导入

Node.js 也支持动态导入，这意味着你可以根据条件或在运行时导入模块。这对于按需加载代码特别有用。

```javascript
// 条件导入 example.js
if (Math.random() > 0.5) {
  import("./mathUtils.js").then((math) => {
    console.log(math.add(5, 3));
  });
} else {
  console.log("No need for math utilities right now.");
}
```

在这个例子中，我们使用 `Math.random()` 来决定是否导入 `mathUtils.js` 模块。如果条件满足，我们通过 `import()` 函数动态导入模块，并使用 `.then()` 方法来处理返回的 Promise 对象。

通过以上例子，你应该对 Node.js 中 ECMAScript 模块的使用有了一个基本的了解。ESM 提供了一种标准化的方法来组织和重用 JavaScript 代码，使得开发更加模块化、易于维护。

## [Introduction](https://nodejs.org/docs/latest/api/esm.html#introduction)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。它允许你在服务器端运行 JavaScript，这意味着你可以使用 JavaScript 来编写后端代码，就像你通常在浏览器中做前端开发一样。Node.js 特别强大的地方在于其非阻塞 I/O 和事件驱动机制，使其特别适合处理高并发的网络应用。

现在，针对 Node.js v21.7.1 的 **ESM (ECMAScript Modules)** 部分，我们来详细解释一下这个概念，并举例说明。

### ESM (ECMAScript Modules) 简介

在 Node.js 之前，JavaScript 主要用于浏览器端，模块系统不是标准的一部分。随着时间的发展，为了让 JavaScript 也能在服务器端运行，社区提出了各种模块规范，比如 CommonJS。Node.js 最初采用的是 CommonJS 模块规范，它是 Node.js 中 `require` 和 `module.exports` 的基础。

然而，ECMAScript（即 JavaScript 的官方标准）在后来的版本中引入了自己的模块系统，称为 ECMAScript Modules (简称 ESM)。它使用 `import` 和 `export` 语句来导入和导出模块。由于它是 JavaScript 官方的标准，因此具有更好的跨平台兼容性和未来的可持续性。

### ESM 在 Node.js 中的应用

在 Node.js v21.7.1 中，支持 ECMAScript Modules 让你可以更加方便地在 Node.js 项目中使用最新的 JavaScript 特性和模块化标准。这意味着你可以：

- 使用 `import` 导入其他 JavaScript 文件或者模块
- 使用 `export` 导出模块，供其他文件使用

#### 实际运用例子

假设你正在开发一个简单的网站后端，需要处理用户信息，并且使用了一个第三方库来发送邮件。

**user.js**

```javascript
// 定义一个用户类
export class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  // 用户的方法，例如打招呼
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
}
```

**mail.js**

```javascript
// 导入 Node.js 的内置模块
import fs from "fs";
import path from "path";

// 假设有一个函数用于发送邮件
export function sendEmail(user, message) {
  // 发送邮件的逻辑...
  console.log(`Sending email to ${user.email}...`);
}
```

**app.js**

```javascript
import { User } from "./user.js";
import { sendEmail } from "./mail.js";

// 创建一个用户实例
const user = new User("Alice", "alice@example.com");

// 使用用户的方法
user.greet();

// 发送一封邮件给用户
sendEmail(user, "Welcome to our service!");
```

在上述例子中，我们定义了两个模块：`user.js` 和 `mail.js`，并在 `app.js` 中将它们导入。通过这种方式，我们把功能相关的代码组织在了一起，使得项目结构更加清晰，也便于维护和管理。

### 总结

使用 ECMAScript Modules (ESM) 在 Node.js 中是现代 JavaScript 开发的趋势。它不仅符合最新的标准，还帮助你以模块化的方式组织代码，提升开发效率和项目的可维护性。随着 Node.js 和 JavaScript 生态的发展，掌握和理解 ESM 将对任何 JavaScript 开发者都大有裨益。

## [Enabling](https://nodejs.org/docs/latest/api/esm.html#enabling)

Node.js 是一个运行时环境，允许你使用 JavaScript 来编写服务器端代码。它非常适合开发需要高并发、快速响应的网络应用程序。从 Node.js 版本 12 开始，默认支持 ECMAScript 模块（ESM），这是一种在 JavaScript 文件中使用模块的标准方式。在 Node.js v21.7.1 中，这种支持得到了进一步的强化和优化。

### ESM (ECMAScript Modules) 简介

ESM 允许开发者将大型的 JavaScript 程序分解成可重用的小块代码（模块），每个模块都可以导出或导入另一模块的功能。这样做不仅有助于代码组织和维护，还能提升代码复用率和加载效率。

### 在 Node.js 中启用 ESM

在 Node.js 中，启用 ESM 的方式很直接。你只需要注意文件后缀名和`package.json`文件的配置：

1. **使用 .mjs 文件后缀：** 如果你的 JavaScript 文件以 `.mjs` 结尾，Node.js 会自动将其作为 ECMAScript 模块处理。
2. **在 `package.json` 中设置 `"type": "module"`：** 如果你更喜欢使用 `.js` 文件后缀，你可以在项目的根目录下的 `package.json` 文件中添加 `"type": "module"`。这样，Node.js 就会将所有的 `.js` 文件视为 ECMAScript 模块。

### 实际运用例子

#### 示例 1: 导出和导入模块

假设我们正在开发一个简单的数学工具库：

**mathUtil.mjs**

```javascript
// 导出函数
export function sum(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}
```

现在，如果我们想在另一个文件中使用这些函数，我们可以这样做：

**app.mjs**

```javascript
// 导入 mathUtil 模块
import { sum, multiply } from "./mathUtil.mjs";

console.log(sum(2, 3)); // 输出：5
console.log(multiply(2, 3)); // 输出：6
```

#### 示例 2: 使用 package.json 启用 ESM

如果你的项目包含很多 `.js` 文件，并且你希望它们都被当作 ECMAScript 模块来处理，你可以在 `package.json` 中进行如下设置：

**package.json**

```json
{
  "type": "module"
}
```

现在，所有 `.js` 文件都将按照 ECMAScript 模块来解析和执行。

### 总结

通过使用 ECMAScript 模块（ESM），Node.js 使开发者能够以更现代和标准化的方式组织和共享 JavaScript 代码。无论是通过文件扩展名 `.mjs`，还是在 `package.json` 中设置，启用 ESM 都是非常简单直接的。随着 Node.js 和 JavaScript 生态系统的不断成熟，对 ESM 的支持将会变得越来越重要。

## [Packages](https://nodejs.org/docs/latest/api/esm.html#packages)

Node.js 是一个运行在服务器端的平台，它允许你使用 JavaScript 来编写服务器端代码。Node.js v21.7.1 版本，像其他版本一样，支持许多功能和模块，其中之一是对 ES 模块（ESM）和包（Packages）的支持。

### 包（Packages）

在 Node.js 中，一个“包”通常指的是一个包含着可重用代码的文件夹，这些代码可以被其他 Node.js 应用所引用和使用。一个包能包含一个或多个模块。模块是单个文件（或文件的集合），它们封装了特定的功能以供其他部分的应用程序使用。Node.js 使用 npm（node package manager）来管理这些包。

当我们谈论到 Node.js v21.7.1 对于“包”的处理，主要涉及如何组织和导入 ES 模块。ES 模块是 ECMAScript（即 JavaScript）的标准模块系统，它提供了一个原生的方式来导出和导入模块成员（比如变量、函数等）。

### 在 Node.js 中使用包

要在 Node.js 项目中使用包，你首先需要创建一个 `package.json` 文件。这个文件作为项目的清单，描述了项目的名称、版本、依赖等信息。你可以通过运行 `npm init` 命令自动生成这个文件。

#### 实际运用示例

假设你正开发一个 web 服务器，并且希望使用 `express` 这个包来简化任务。

1. **初始化项目：** 首先，在你的项目文件夹中打开终端，然后运行 `npm init` 并跟随提示完成设置，这会生成一个 `package.json` 文件。

2. **安装 Express：** 接着运行 `npm install express`，这个命令会下载 `express` 包及其依赖到一个名为 `node_modules` 的文件夹中，同时 `package.json` 文件也会被更新，以记录 `express` 作为一个依赖项。

3. **使用 Express：** 创建一个名为 `server.js` 的文件，并写入以下代码：

   ```javascript
   const express = require("express");
   const app = express();

   app.get("/", (req, res) => {
     res.send("Hello World!");
   });

   app.listen(3000, () => {
     console.log("Server is running on http://localhost:3000");
   });
   ```

   上面这段代码创建了一个简单的 web 服务器，它监听本地的 3000 端口，并且当你访问根 URL (`/`) 时，会响应 "Hello World!"。

4. **运行你的服务器：** 最后，在终端中运行 `node server.js`，然后打开浏览器访问 `http://localhost:3000`，你就能看到 "Hello World!" 的消息了。

### 总结

在 Node.js 中，包使得代码复用变得简单，它们可以被轻松地安装和管理。Node.js 的 `package.json` 文件是管理项目依赖的中心点。通过上述实例，我们看到了如何在一个实际项目中使用包（如 `express`）来快速启动和运行一个 web 服务器。这展示了包在 Node.js 开发中的基本用途和重要性。

## [import Specifiers](https://nodejs.org/docs/latest/api/esm.html#import-specifiers)

好的，让我们一步步来理解 Node.js 中的导入说明符（import specifiers）。

### 什么是导入说明符？

在 JavaScript ES6 及之后的版本中，引入了模块系统。这意味着你可以将代码分割成多个文件（模块），然后通过导入（import）和导出（export）语句来共享这些文件里的功能或数据。导入说明符就是你在使用`import`语句时，用来指定你想从其他模块导入什么的部分。

### 基本语法

```javascript
import { something } from "module-name";
```

这里，`something`就是导入说明符，它告诉 JS 引擎你想从'module-name'这个模块中导入名为`something`的部分。

### 例子

假设我们有一个名为`mathUtils.js`的文件，它导出了两个函数：`add`和`subtract`。

```javascript
// mathUtils.js
export function add(x, y) {
  return x + y;
}

export function subtract(x, y) {
  return x - y;
}
```

如果我们想在另一个文件中使用这些函数，我们可以这样导入它们：

```javascript
// main.js
import { add, subtract } from "./mathUtils.js";

console.log(add(5, 3)); // 输出：8
console.log(subtract(10, 5)); // 输出：5
```

在这个例子中，`{ add, subtract }`就是导入说明符，它告诉 JS 引擎我们想从`mathUtils.js`导入`add`和`subtract`这两个函数。

### Node.js 中的特殊情况

Node.js 支持 CommonJS 模块系统（`require`/`module.exports`）和新的 ES 模块系统（`import`/`export`）。在对 ES 模块的支持中，Node.js 允许使用 URL 路径、相对路径和绝对路径作为导入说明符。例如：

```javascript
import express from "https://unpkg.com/express@latest"; // 从URL导入
import config from "./config.js"; // 从相对路径导入
import { fileURLToPath } from "url"; //从内置模块导入
```

### import Specifiers 的新变化

在较新的 Node.js 版本中，导入说明符可能会包含更多的特性，比如支持导入 JSON 模块或者更灵活地处理路径和 URL。具体的特性和语法可能会随着 Node.js 的版本不断演进。

### 结论

导入说明符是用于指定从其他模块导入哪些部分的关键元素。理解它们是掌握 JavaScript 模块化编程的重要一步。随着实践的增加，你将会更熟练地运用这一机制。希望这个解释能够帮助你更好地理解导入说明符的概念和用法！

### [Terminology](https://nodejs.org/docs/latest/api/esm.html#terminology)

了解 Node.js 中的术语对于掌握其工作原理至关重要。在 Node.js 的环境里，特别是在 v21.7.1 版本中提到的 ESM（ECMAScript 模块）相关的文档，介绍了几个核心概念。这里我会解释一些基础术语，并通过实际例子帮助你理解。

### 1. ESM (ECMAScript Modules)

ESM 是 JavaScript 官方的模块系统，用于在不同的 JavaScript 文件之间导入和导出代码。与 Node.js 早期使用的 CommonJS 不同，ESM 提供了静态导入和导出，意味着你可以在编译时而非运行时确定依赖关系。

**实际例子:**

想象你正在开发一个网站，并且需要处理用户数据。你可能有一个`user.js`模块来管理用户信息，和一个`utils.js`模块来存放一些辅助函数。

```javascript
// utils.js
export function formatName(name) {
  return name.toUpperCase();
}

// user.js
import { formatName } from "./utils.js";

function addUser(name) {
  console.log(`Adding user: ${formatName(name)}`);
}

addUser("john doe");
```

在这个例子中，`user.js`通过 ESM 导入了`utils.js`中的`formatName`函数。

### 2. CommonJS

CommonJS 是 Node.js 最初采用的模块标准，主要用于服务器端 JavaScript 应用程序。它支持动态导入，即可以根据条件或者在任何时刻导入模块。

**实际例子:**

如果你有一个项目需要根据不同环境加载不同的配置文件。

```javascript
// config-dev.js
module.exports = {
  databaseURL: "http://dev.example.com/db",
};

// main.js
let config;
if (process.env.NODE_ENV === "development") {
  config = require("./config-dev.js");
}

console.log(config.databaseURL);
```

在这里，`main.js`根据环境变量动态决定是否加载`config-dev.js`。

### 3. Import Maps

Import maps 允许你控制模块标识符映射到具体的 URL 上，而无需通过相对或绝对路径。这使得在大型项目中管理模块更为简单，同时也支持浏览器直接加载模块。

**实际例子:**

假设你在前端项目中使用了多个库，例如 React 和 Lodash，而且想避免在每次导入时使用长路径。

你可以在 HTML 文件中定义一个 import map:

```html
`<`script type="importmap"> { "imports": { "react": "/path/to/react.js",
"lodash": "/path/to/lodash.js" } } `<`/script>
```

然后，在你的 JavaScript 文件里就可以简洁地引用这些库：

```javascript
import react from "react";
import lodash from "lodash";

// 使用react和lodash...
```

这些核心概念是理解和使用 Node.js v21.7.1 中 ESM 非常重要的部分。希望这些解释和例子能帮助你更好地理解。

### [Mandatory file extensions](https://nodejs.org/docs/latest/api/esm.html#mandatory-file-extensions)

好的，让我们深入了解 Node.js 中的"强制文件扩展名"（Mandatory file extensions）特性，尤其是在 v21.7.1 版本的上下文中。

### 强制文件扩展名是什么？

在 Node.js 中，当使用 ES 模块（ESM）时，强制文件扩展名这个特性要求所有导入的模块必须明确指定文件的扩展名。这意味着，与 CommonJS 模块系统相比，在 ESM 中你不能省略文件扩展名，否则 Node.js 将无法正确导入模块。

### 为什么需要强制文件扩展名？

这个设计有几个原因：

1. **清晰性**：它强制开发者明确文件类型，使得代码更易于理解。
2. **性能**：避免 Node.js 运行时需要猜测和尝试各种扩展名来找到正确的文件，从而提高加载性能。
3. **一致性**：与浏览器中的 JavaScript 模块处理保持一致，因为浏览器也要求指定扩展名。
4. **工具兼容性**：有助于静态分析工具和打包工具如 Webpack 和 Rollup 更好地处理代码。

### 实际例子

假设我们有两个文件，`mathUtils.js`和`app.mjs`。`mathUtils.js`包含一些基本的数学函数，而`app.mjs`是我们的主应用程序文件。

#### mathUtils.js

```javascript
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

#### app.mjs（错误示范）

如果你试图像这样导入模块但没有指定扩展名：

```javascript
import { add, subtract } from "./mathUtils"; // 错误：没有指定扩展名
console.log(add(2, 3));
```

运行这段代码会导致错误，因为没有指定`.js`扩展名。

#### app.mjs（正确示范）

正确的导入方式应该包含完整的文件扩展名：

```javascript
import { add, subtract } from "./mathUtils.js"; // 正确：指定了扩展名
console.log(add(2, 3));
```

这样，Node.js 就能够正确地找到并导入`mathUtils.js`文件。

### 结论

通过强制文件扩展名的使用，Node.js v21.7.1 版强调了代码的清晰性、提高了性能，并与浏览器端的模块处理方式保持了一致性。这对于编写可维护和高效的 JavaScript 应用程序是非常重要的。在实际开发过程中，记得总是在导入语句中指定文件的扩展名。

### [URLs](https://nodejs.org/docs/latest/api/esm.html#urls)

Node.js 中的 URLs 涉及到如何处理和操作网络中的资源定位符（URLs）。在 Web 开发和许多网络应用中，理解和使用 URL 是非常关键的。Node.js 提供了一套 API 来处理这些 URLs，特别是在其模块系统中。

在 Node.js v21.7.1 的文档里，当谈到 ES Modules (ESM) 和 URLs 的时候，主要是指在 Node.js 中导入和管理 ES Modules 时如何使用 URL。ES Modules 是 JavaScript 的官方标准格式，用于编写模块化的代码。在 Node.js 中，你可以通过使用 URLs 来导入这些模块，不仅限于本地模块，还包括远程模块。

### 实际运用的例子

#### 1. 导入本地模块

假设你有一个名为 `example.mjs` 的 ES Module 文件，位于你的项目目录下。你可以使用相对路径（以 `./` 或 `../` 开始）来导入它：

```javascript
import { myFunction } from "./example.mjs";
```

这里 `.mjs` 后缀表示这是一个 ES Module 文件。

#### 2. 导入 node_modules 中的模块

如果你想要导入安装在 `node_modules` 目录中的模块，可以直接使用模块的名称，Node.js 会自动解析 URL：

```javascript
import express from "express";
```

这里的 `express` 是一个流行的 Node.js 框架，通常从 npm 安装。

#### 3. 导入远程模块

Node.js 还支持从远程 URL 导入 ES Modules。这意味着你可以直接从互联网上加载 JavaScript 模块。例如：

```javascript
import * as someLibrary from "https://example.com/some-library.mjs";
```

这个功能特别适合于实验或快速原型开发，允许你无需下载和安装模块就可以直接使用。但请注意，出于安全考虑，在生产环境中谨慎使用此功能。

### 注意事项

- 使用 URL 导入模块时，必须遵循 CORS（跨源资源共享）策略。
- 使用 HTTPS URL 是一个好习惯，以确保数据传输的安全。

通过这些示例，你可以看到 Node.js 如何使用 URLs 来管理和导入 ES Modules。这强调了 Node.js 在模块化开发方面的灵活性，无论是本地还是远程模块，都提供了统一和简便的方式来处理它们。

#### [file: URLs](https://nodejs.org/docs/latest/api/esm.html#file-urls)

Node.js v21.7.1 中提到的 "file: URLs" 是关于如何在代码中引用和操作文件路径的一个特点。在 Node.js 中，你经常需要加载或者读取文件，无论是 JavaScript 代码文件、JSON 配置文件还是其他类型的文件。这里所说的 "file: URLs" 实际上是一种特殊的 URL 格式，用来指定文件系统中的位置，其格式遵循标准的 URL 规则，但是协议部分使用的是 "file:"。

### 基本概念

一个典型的 "file: URL" 看起来可能是这样的：

```
file:///path/to/my/file.txt
```

这个 URL 指向了本地文件系统中的 `/path/to/my/file.txt` 文件。注意到 URL 的开头有三个斜杠（`///`），前两个斜杠是协议名后面的标准双斜杠，第三个斜杠表示根目录。

### 在 Node.js 中的应用

#### 读取文件

假设你想在 Node.js 程序中读取一个文本文件的内容。一般情况下，你可能会用到 `fs` 模块的 `readFileSync` 方法或者 `fs/promises` 的 `readFile` 方法。如果使用 "file: URLs"，你的代码可以这样写：

```javascript
import fs from "fs/promises";

async function readFileContent() {
  const fileUrl = new URL("file:///path/to/my/file.txt");
  const content = await fs.readFile(fileUrl);
  console.log(content.toString());
}

readFileContent().catch(console.error);
```

这里，我们通过 `new URL('file:///path/to/my/file.txt')` 创建了一个指向文件的 URL 对象，并将其传递给 `fs.readFile` 方法。这是一种更加现代和通用的方式来处理文件路径，尤其是当你的代码需要在不同的操作系统之间移植时，因为 "file: URLs" 自动处理了不同平台路径差异的问题。

#### 导入模块

在 Node.js 中使用 ES 模块（ECMAScript Modules）时，你也可以使用 "file: URLs" 来导入本地模块。例如：

```javascript
import myModule from "file:///path/to/my/module.js";

myModule.doSomething();
```

这里，我们直接通过 "file: URL" 引用了一个模块。这种方式同样非常有用，尤其是在处理复杂的文件路径或者跨平台脚本时。

### 结论

"file: URLs" 在 Node.js 中提供了一种强大且灵活的方式来引用和操作文件系统中的资源。它使得文件路径的表达更加统一和标准化，同时简化了跨平台开发的复杂性。无论是读取文件、导入模块，还是其他涉及文件路径的操作，"file: URLs" 都能提供清晰和有效的解决方案。

#### [data: imports](https://nodejs.org/docs/latest/api/esm.html#data-imports)

在 Node.js v21.7.1 中，一个引人注目的新特性是 **data: imports**。这个功能允许你直接在你的代码中通过 `import` 语句加载内联数据。这意味着你可以在模块导入时，将数据作为字符串直接嵌入到你的代码中，而不需要从外部文件或数据库读取数据。

### 如何工作

在 JavaScript 中，`data:` URL 以 `data:[`<`mediatype>][;base64],`<`data>` 的形式存在，其中：

- `` <`mediatype`> ``是数据的 MIME 类型（如`text/plain`或`application/json`）。
- `;base64` 表示数据以 Base64 编码，这是可选的。
- `` <`data`> `` 是数据本身，在 URL 编码或者 Base64 编码下。

当你使用 `data:` 导入时，Node.js 解析这个 URL，并且根据提供的数据和 MIME 类型来处理它。

### 实际运用例子

#### 1. 导入纯文本

假设你正在开发一个应用程序，需要使用一段静态的文本数据。使用 `data:` 导入，你可以这样做：

```javascript
// ES Module syntax
import myText from "data:text/plain,Hello%20World";

console.log(myText); // 输出：Hello World
```

这里，我们导入了一个简单的文本 "Hello World"。注意我们使用 `%20` 来表示空格。

#### 2. 导入 JSON 数据

如果你需要内嵌一小段 JSON 数据，可以类似地这样做：

```javascript
import myData from "data:application/json;base64,eyJrZXkiOiJ2YWx1ZSJ9";

console.log(myData); // 输出：{ key: 'value' }
```

在这个例子中，我们有一段 Base64 编码的 JSON 数据（`{"key":"value"}`），并将其导入为 `myData` 对象。这对于配置或者小规模的固定数据集十分有用。

#### 3. 使用在测试中

`data:` 导入特别适合于测试场景，其中你可能需要向测试函数提供固定的输入数据。例如，假设你正在测试一个函数，该函数解析 CSV 数据：

```javascript
import csvData from "data:text/csv;base64,Y29sdW1uMSxjb2x1bW4yLGNvbHVtbjMKdGVzdDEsdGVzdDIsc29tZSBkYXRhCmFub3RoZXIsdmFsdWVzLGhlcmU=";

// 假设 parseCsv 是你需要测试的函数
parseCsv(csvData).then((parsed) => {
  console.log(parsed);
  // 这里你可以进行断言或其他处理
});
```

在上面的例子中，CSV 数据被编码并作为 `csvData` 导入。这样，你就可以轻松地在测试文件中包含必要的数据，而不需要依赖外部文件。

### 总结

`data:` 导入在 Node.js 中打开了很多有趣的可能，特别是对于需要内嵌小量数据的场景。它减少了对外部文件的依赖，使得代码更加自包含和便于分享。同时，在测试和原型开发中，它也提供了便利，允许开发者快速迭代而不必担心数据的存储和管理。

#### [node: imports](https://nodejs.org/docs/latest/api/esm.html#node-imports)

Node.js 的版本 21.7.1 引入了许多新特性和改进，其中一个重要的概念是`node: imports`。这个特性是关于 ESM（ECMAScript 模块）的，它为在 Node.js 中使用 JavaScript 模块提供了一种新的方式。理解这个特性对于编写现代 Node.js 代码是非常重要的。

### 基本概念

首先，我们需要了解什么是 ESM。简单来说，ESM 是 JavaScript 的官方标准格式，用于在不同的 JavaScript 文件之间分享和重用代码。你可以把它想象成一种方式，通过这种方式，你可以将大型的、复杂的代码库拆分成更小、更易管理的部分，并且在这些部分之间共享功能。

在 Node.js 中，以前主要依赖 CommonJS（简称 CJS）模块系统。CommonJS 是 Node.js 默认的模块系统，在过去，它支配了 Node.js 的生态系统。然而，随着 ESM 在前端 JavaScript 开发中的流行，Node.js 也开始支持 ESM，以保持与浏览器环境的兼容性和现代化开发实践的同步。

### `node: imports`

`node: imports`是一个在 Node.js ESM 中引入的特性，它允许开发者以一种更清晰、更安全的方式导入内置模块。简单地说，当你想在 Node.js 应用程序中使用 Node.js 的内置模块（如`fs`、`path`等）时，你可以通过预定的命名空间`node:`来明确指明这一点。

### 实际应用例子

#### 传统方式 vs `node: imports`

在`node: imports`之前，如果你想在你的 ESM 项目中使用`fs`模块（一个用于文件操作的内置模块），你可能会这样做：

```javascript
import fs from "fs";
```

这种方式虽然简单，但它并不区分你导入的是 Node.js 的内置模块还是来自`node_modules`目录的第三方模块，或者是你项目中的其他文件。

使用`node: imports`后，你可以这样导入`fs`模块：

```javascript
import fs from "node:fs";
```

这种方式使得导入的来源更加清晰，任何看到这段代码的人都清楚`fs`是 Node.js 的内置模块。

#### 更安全

使用`node:`协议有助于避免潜在的名称冲突和模猜测攻击（dependency confusion attack），因为它明确指出模块是来自 Node.js 本身，而不是其他任意来源。

### 总结

`node: imports`增强了 ESM 在 Node.js 中的使用体验，通过提供一个清晰、安全的方式来导入内置模块。这有助于提高代码的可读性和安全性，是 Node.js 向现代 JavaScript 生态系统迈进的又一步。对于编程新手来说，掌握 ESM 及其相关特性，如`node: imports`，是理解和利用 Node.js 全面能力的重要一环。

## [Import attributes](https://nodejs.org/docs/latest/api/esm.html#import-attributes)

在 Node.js 中，"Import attributes"是一个引入 JavaScript 模块时可以使用的特性。这允许开发者在`import`语句中指定额外的选项或元数据。从 Node.js 版本 21.7.1 开始，这个特性变得可用。

### 理解 Import Attributes

要理解 Import Attributes，首先需要知道 ESM（ECMAScript Modules）是 JavaScript 官方的模块系统，用于在不同的 JavaScript 文件之间共享代码。以前，Node.js 主要使用 CommonJS 模块系统，但现在也支持 ESM。

在导入模块时，我们通常使用如下语法：

```javascript
import something from "some-module";
```

有了 Import Attributes，我们可以为`import`语句添加额外的信息，比如：

```javascript
import json from "./example.json" assert { type: "json" };
```

这里，`assert { type: 'json' }`是一个 Import Attribute，它告诉 JavaScript 引擎这个模块应该被当作 JSON 来处理。

### 使用场景和例子

#### 1. 导入 JSON 模块

假设你有一个配置文件`config.json`，你想在你的 Node.js 应用中直接导入它。在支持 Import Attributes 的 Node.js 版本中，可以这样做：

```javascript
import config from "./config.json" assert { type: "json" };
console.log(config); // 输出config.json文件的内容
```

这确保了导入的模块确实按照 JSON 的格式来解析，提高了代码的安全性和清晰度。

#### 2. 导入 WebAssembly 模块

如果你正在使用 WebAssembly 模块，Import Attributes 同样非常有用。例如：

```javascript
import myWasmModule from "./my-module.wasm" assert { type: "webassembly" };
```

这告诉 Node.js 这个模块是一个 WebAssembly 模块，应该相应地进行处理。

### 总结

Import Attributes 提供了一种灵活的方式来控制模块的导入行为，使得模块导入更加安全和透明。通过指定类型断言，开发者可以确保模块以正确的方式被加载和解析，减少潜在的错误并提升代码质量。这个功能对于使用 JSON、WebAssembly 等特殊格式的模块尤其有用，能够简化处理流程，提高开发效率。

## [Builtin modules](https://nodejs.org/docs/latest/api/esm.html#builtin-modules)

Node.js 中的内置模块是 Node.js 自带的一系列模块，你不需要安装就可以直接使用它们来完成各种任务。这些模块提供了许多底层的功能，如文件系统操作、网络通信、路径处理等。

在 Node.js v21.7.1 中，你可以通过简单的 `import` 语句或 `require` 函数来使用这些内置模块。例如：

### 文件系统（`fs` 模块）

文件系统模块允许你与文件系统进行交互。比如，你可以读取文件、写入文件、创建目录等。

```javascript
import fs from "fs"; // 使用 ES6 模块语法导入

// 异步读取文件内容
fs.readFile("/path/to/file", "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

### HTTP 模块

HTTP 模块允许你创建 HTTP 服务器或客户端。这对于开发 Web 应用程序非常有用。

```javascript
import http from "http"; // 使用 ES6 模块语法导入

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

// 监听 3000 端口
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
```

### 路径（`path` 模块）

路径模块提供了一些实用函数，用于处理文件路径。

```javascript
import path from "path"; // 使用 ES6 模块语法导入

// 使用 path.join() 连接路径片段
const directoryName = path.join("/Users", "yourname", "Documents");
console.log(directoryName); // 输出：/Users/yourname/Documents
```

### URL 模块

URL 模块提供了一些实用函数，用于 URL 处理与解析。

```javascript
import url from "url"; // 使用 ES6 模块语法导入

// 解析 URL
const myURL = new URL("https://example.org:8000/path/name?query=123#hash");
console.log(myURL.hostname); // 输出：example.org
```

使用这些内置模块可以帮助你完成各种编程任务，从创建 web 服务器到处理文件和数据。通过结合这些模块，你可以构建功能丰富的应用程序。

## [import() expressions](https://nodejs.org/docs/latest/api/esm.html#import-expressions)

理解 Node.js 中的 `import()` 表达式之前，先来简单了解一下 JavaScript 模块系统的背景。

### JavaScript 模块系统

在早期的 JavaScript 开发中，所有代码通常都写在一个或几个大文件里。随着应用程序变得越来越复杂，这种做法显得非常混乱且难以维护。为了解决这个问题，JavaScript 引入了模块系统。模块系统允许开发者将代码分割成可重用的单独文件（即模块）。每个模块可以导出特定的函数、变量等供其他模块使用（通过`import`），同时也可以引入其他模块导出的内容（通过`export`）。

### ES Modules (ESM) 和 CommonJS

在 Node.js 中，历史上主要使用的是 CommonJS 模块系统。CommonJS 使用 `require()` 函数来导入模块和 `module.exports` 来导出模块内容。而在较新版本的 JavaScript 中，引入了官方的模块系统，被称为 ES Modules (ESM)，它使用 `import` 和 `export` 关键词来处理模块的导入和导出。

### `import()` 表达式

`import()` 表达式是 ES Modules 的一个特性，它允许你动态地导入模块。与静态的 `import` 语句不同，`import()` 可以在代码的任何地方调用，并返回一个 promise，这个 promise 解析到一个模块对象，该对象包含了导入模块的所有导出。

这种动态导入的方式非常适合于按需加载模块的情况，可以帮助提升应用性能，减少启动时的加载时间。

### 实际运用的例子

#### 按需加载模块

想象你正在开发一个网站，其中有一个功能是生成 PDF 报告，但这个功能只被极少数用户使用。

```javascript
// 按钮点击事件
document.getElementById("generate-pdf").addEventListener("click", async () => {
  // 动态导入生成 PDF 的模块
  const pdfModule = await import("./pdf-generator.js");

  // 使用导入的模块创建 PDF
  pdfModule.createPDF();
});
```

在这个例子中，`pdf-generator.js` 模块只有在用户实际点击“生成 PDF”按钮时才会被导入，从而减少了网页初始加载时的资源消耗。

#### 条件导入

假设你的应用需要根据用户的偏好导入不同的主题样式。

```javascript
async function loadTheme(themeName) {
  let theme;
  if (themeName === "dark") {
    theme = await import("./themes/dark.js");
  } else {
    theme = await import("./themes/light.js");
  }
  theme.apply();
}

loadTheme(userPreference.theme);
```

这个例子展示了如何根据条件动态选择并导入相应的模块。用户偏好的主题仅在函数 `loadTheme` 被调用时才确定下来，并且之后才进行相应模块的导入。

通过这些例子，你可以看到 `import()` 表达式在实现代码分割和改进应用加载性能方面的强大能力。

## [import.meta](https://nodejs.org/docs/latest/api/esm.html#importmeta)

理解 `import.meta` 的概念及其在 Node.js 中的应用，首先需要把握两个核心点：`import` 语法是如何工作的，以及什么是元数据（metadata）。在 JavaScript ES6 模块系统中，`import` 语句被用来引入其他 JavaScript 文件中的绑定（变量，函数，类等）。元数据是关于数据的信息，简单来说，就是一种描述数据本身特性的数据。

在 Node.js 中，`import.meta` 是一个对象，它提供了当前模块的相关信息。这个对象最常见的属性是 `import.meta.url`，它返回当前模块的 URL。由于 Node.js 主要运行在服务器端，并不像浏览器环境那样直接加载网页上的 JavaScript，所以这里的 URL 指的是文件在文件系统中的路径，表现为一个以 `file://` 开始的 URL 字符串。

### 实际运用示例

#### 示例 1: 获取当前模块的路径

如果你正在编写一个 Node.js 应用，并且你想获取当前模块文件的绝对路径，可以使用 `import.meta.url`。这在处理文件路径、读取模块所在目录下的其他资源时非常有用。

```javascript
// 假设这个脚本位于 /home/user/my-node-app/src/mod.js

console.log(import.meta.url);
// 输出: file:///home/user/my-node-app/src/mod.js
```

#### 示例 2: 动态导入其他模块

假设你有一个复杂的应用，需要根据不同的条件动态加载模块，`import.meta` 可以配合动态 `import()` 语法使用，实现更灵活的模块导入。

```javascript
// 动态决定要加载的模块路径
const moduleName = "./moduleA.js";

import(`${new URL(moduleName, import.meta.url)}`).then((module) => {
  // 使用导入的模块
  module.doSomething();
});
```

在这个例子中，`import.meta.url` 用来获取当前模块的绝对 URL，然后 `new URL()` 构造函数用来生成新模块的完整 URL。这种方式特别适合于模块路径在运行时才能确定的场景。

#### 示例 3: 环境配置和条件导入

想象一个场景，你的应用需要根据不同的环境（例如开发环境和生产环境）加载不同的配置文件或模块。

```javascript
let config;
if (process.env.NODE_ENV === "development") {
  config = await import(`${new URL("./config.dev.mjs", import.meta.url)}`);
} else {
  config = await import(`${new URL("./config.prod.mjs", import.meta.url)}`);
}

console.log(config.default); // 使用导入的配置
```

在这个例子中，我们根据环境变量 `NODE_ENV` 的值来决定加载哪个配置文件。这种方法让代码结构清晰，容易管理。

总之，`import.meta` 在 Node.js 中提供了一种方便的方式来获取模块自身的信息或基于模块位置动态导入其他模块，为模块化编程带来了更多的灵活性和可能。

### [import.meta.dirname](https://nodejs.org/docs/latest/api/esm.html#importmetadirname)

确实，理解`import.meta.dirname`在 Node.js v21.7.1 中的使用是很有帮助的。首先，我们需要了解几个基本概念。

### 基础概念

1. **Node.js**: 是一个能够在服务器端运行 JavaScript 代码的环境。
2. **ES Modules (ESM)**: 是 JavaScript 的官方标准模块系统，允许你将大的程序分割成小块独立的模块，这样做可以提高代码的可维护性和复用性。
3. **CommonJS**: 是 Node.js 中使用的另一种模块规范，但随着 ES Module 的普及，Node.js 也开始支持 ES Module。

### `import.meta`

- 在 ESM 中，`import.meta`是一个提供当前模块信息的对象。最常见的用例是`import.meta.url`，它返回当前模块文件的 URL。

### `import.meta.dirname`

- 在以前的 Node.js 版本中，如果你使用 CommonJS 模块系统，可以通过`__dirname`全局变量直接获取当前模块文件所在目录的绝对路径。
- 然而，在 ESM 中，没有这样的全局变量（因为 ESM 旨在与浏览器 JavaScript 兼容，而浏览器不支持文件系统操作），所以`__dirname`无法直接使用。
- Node.js v21.7.1 中引入了`import.meta.dirname`，作为一种方法提供给开发者，使他们能够在使用 ESM 时获取当前模块的目录路径，效果类似于 CommonJS 中的`__dirname`。

### 实际运用例子

#### 例子 1：读取同一目录下的配置文件

假设你有一个项目，目录结构如下：

```
/project
    /config
        config.json
    index.mjs
```

你想在`index.mjs`模块中读取`config/config.json`配置文件：

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";

// Convert the import.meta.url to a directory path
const __dirname = dirname(fileURLToPath(import.meta.url));

// Construct the path to the config file
const configPath = `${__dirname}/config/config.json`;

// Async function to read and parse the JSON file
async function readConfig() {
  try {
    const configFile = await readFile(configPath);
    const config = JSON.parse(configFile);
    console.log("Config:", config);
  } catch (error) {
    console.error("Error reading config file:", error);
  }
}

readConfig();
```

在这个例子中，我们使用`import.meta.url`获取当前模块的 URL，然后将这个 URL 转换为文件系统路径，并最终得到目录路径。这样就可以构建出配置文件的完整路径，并读取它。

#### 注意点

由于`import.meta.dirname`是在 Node.js v21.7.1 中引入的，所以在写这篇解释时，还需要手动转换`import.meta.url`来获得目录名。未来，如果`import.meta.dirname`被正式加入 Node.js，那么获取当前目录的方式可能会更简洁。始终检查最新的 Node.js 文档，以了解当前的最佳实践。

### [import.meta.filename](https://nodejs.org/docs/latest/api/esm.html#importmetafilename)

在 Node.js 的版本 21.7.1 中，`import.meta.filename` 是一个非常有用的属性，它可以帮助你获取当前模块文件的路径。这个属性是在 ECMAScript 模块（ESM）中引入的，与传统的 CommonJS 模块系统相比，ESM 提供了更加现代化和灵活的模块管理方式。在 CommonJS 中，我们通常使用 `__dirname` 和 `__filename` 来获取当前文件或目录的路径，但在 ESM 中，这两个变量不可用。这时，`import.meta.filename` 就成了获取当前模块文件路径的一个重要手段。

### 举个例子

假设你有一个项目，项目结构如下：

```
project/
│
├── src/
│   └── script.js
│
└── index.js
```

在 `src/script.js` 中，你想要获取当前文件的路径。你可以这样做：

```javascript
// 在 src/script.js
console.log(import.meta.filename);
```

当你运行这个模块时，输出会是这个文件的绝对路径，例如：

```
/path/to/your/project/src/script.js
```

### 实际运用

**1. 日志记录：** 当你需要在日志中记录哪个文件产生了日志，`import.meta.filename` 可以帮助你轻松地获取这个信息，让日志的追踪更加容易。

**2. 动态导入模块：** 如果你的应用需要根据不同的条件动态加载模块，`import.meta.filename` 可以用来确定当前模块的路径，从而构建出其他模块的路径进行导入。

**3. 配置文件路径：** 在很多应用中，配置文件可能和当前执行的脚本文件在同一个目录。使用 `import.meta.filename` 可以帮助你确定当前文件的位置，进而找到配置文件的确切位置。

注意：使用 `import.meta.filename` 时，你需要确保你的 Node.js 应用是以 ECMAScript 模块的形式运行的。这通常意味着你的文件扩展名是 `.mjs`，或者你在 `package.json` 中设置了 `"type": "module"`。

### [import.meta.url](https://nodejs.org/docs/latest/api/esm.html#importmetaurl)

在 Node.js 中，`import.meta.url`是一个特殊的属性，用于获取当前模块文件的 URL。这对于 ES 模块（ECMAScript Modules）尤其重要，它能帮助你在运行时了解模块的位置，从而加载或引用模块内外的其他资源。

让我们逐步理解并通过例子掌握`import.meta.url`的用法：

### 基本概念

当你使用 ES 模块系统（即使用`import`和`export`声明）编写代码时，每个模块都被视为一个独立的文件。有时，你可能需要知道当前模块的路径或 URL，以便动态地引入其他模块或访问模块同目录下的资源。这就是`import.meta.url`派上用场的地方。

### 如何使用 `import.meta.url`

#### 获取当前模块的 URL

```js
console.log(import.meta.url);
```

如果你在名为`example.js`的文件中运行这段代码，并且该文件位于你的电脑上`/Users/yourname/projects/node-project`目录下，则`import.meta.url`将输出：

```
file:///Users/yourname/projects/node-project/example.js
```

注意输出的是一个`file://`协议的 URL，而不仅仅是一个文件路径。

#### 实际应用示例

1. **读取模块同目录下的文件**

   假设你在开发过程中需要读取与当前模块位于同一目录中的配置文件`config.json`。你可以利用`import.meta.url`配合`new URL()`构造函数实现这一点。

   ```js
   import { readFileSync } from "fs";

   // 构造config.json文件的完整URL
   const configUrl = new URL("config.json", import.meta.url);

   // 读取配置文件
   const config = JSON.parse(readFileSync(configUrl, "utf8"));

   console.log(config);
   ```

2. **动态导入其他模块**

   在某些情况下，你可能希望根据不同的条件动态导入模块。比如，基于用户的输入或程序的状态来决定导入哪个模块。这时，可以使用`import()`函数结合`import.meta.url`来实现。

   ```js
   // 假设根据不同的语言环境加载不同的翻译文件
   async function loadTranslation(locale) {
     // 构造翻译文件的路径
     const translationModuleUrl = new URL(
       `translations/${locale}.js`,
       import.meta.url
     );
     // 动态导入翻译模块
     const translation = await import(translationModuleUrl);
     return translation.default;
   }

   loadTranslation("en").then(console.log); // 假设存在en.js，则加载并打印其内容
   ```

### 注意事项

- `import.meta.url`只在 ES 模块中有效，如果你在 CommonJS 模块（即使用`require`和`module.exports`的模块系统）中尝试使用它，会遇到错误。
- 使用`import.meta.url`时，需要确保 Node.js 运行时支持 ES 模块。从 Node.js v12 开始，ES 模块得到了实验性支持，但在更高版本中支持更加稳定。

通过上述示例和说明，希望你对`import.meta.url`有了更深刻的理解，以及如何在 Node.js 项目中灵活应用它。

### [import.meta.resolve(specifier)](https://nodejs.org/docs/latest/api/esm.html#importmetaresolvespecifier)

在解释 `import.meta.resolve(specifier)` 之前，让我们了解一些基本概念。Node.js 是一个开源、跨平台的运行时环境，它允许你使用 JavaScript 来编写服务器端代码。随着 ES6 (ECMAScript 2015) 的推出，JavaScript 引入了模块系统，允许开发者通过 `import` 和 `export` 关键词导入和导出模块。这种方式比之前使用的 CommonJS 模块系统（即 `require` 语法）更为现代和标准化。

在 ECMAScript 模块（ESM）中，`import.meta` 是一个提供关于当前模块信息的对象。而 `import.meta.resolve()` 方法则是用来解析模块路径的。具体来说，它接收一个模块的 "specifier"（指定符），然后返回一个 Promise，这个 Promise 解析为该模块的绝对 URL。

### 使用场景

假设你正在编写一个模块，这个模块需要加载另一个模块或是一个文件，但你只知道这个目标模块或文件的相对路径或包名。在这种情况下，你可以使用 `import.meta.resolve()` 来获得目标的绝对路径，这样就可以确保正确地加载它。

### 实例

举个简单的例子，假设你有以下目录结构：

```
/my-project
  /node_modules
    /some-package
      index.js
  /src
    main.js
```

在 `main.js` 中，你想要动态地导入位于 `node_modules` 下的 `some-package` 包。你可以这样做：

```javascript
async function loadPackage() {
  const packagePath = await import.meta.resolve("some-package");
  const { default: somePackage } = await import(packagePath);
  // 现在可以使用 somePackage 进行其他操作了
}

loadPackage();
```

在这个例子中，`import.meta.resolve('some-package')` 会返回一个 Promise，这个 Promise 解析为 `some-package` 包的绝对 URL。然后你可以使用这个 URL 通过动态 `import()` 语法来导入该包。

这个方法特别有用，因为它允许你灵活地解析模块路径，尤其是在处理包名、相对路径或者甚至是网络资源时。它使得模块的动态导入变得非常直接和安全。

总的来说，`import.meta.resolve()` 是一个强大的工具，它为 Node.js 中的模块解析提供了更多的灵活性和可能性。不仅可以用于本地项目中模块的路径解析，还能应对更加复杂的场景，如根据运行时条件动态决定需要加载的模块等。

## [Interoperability with CommonJS](https://nodejs.org/docs/latest/api/esm.html#interoperability-with-commonjs)

理解 Node.js 中的 ES Modules (ESM)与 CommonJS 之间的互操作性对于编程新手来说可能稍显复杂，但我会尽力以简单易懂的方式解释，并给出一些实际的例子。

### 基础概念

首先，需要了解两个重要的模块系统：

- **CommonJS**：这是 Node.js 最初使用的模块系统，它允许你通过`require()`函数导入模块，并通过`module.exports`或`exports`对象导出模块。CommonJS 主要用于服务器端代码，因为它是同步加载模块的。

- **ES Modules (ESM)**：这是 ECMAScript 标准的官方模块系统，由 JavaScript 语言本身提供支持。它允许你通过`import`和`export`语句来导入和导出模块。ESM 可以用于客户端和服务器端代码，它支持异步加载模块。

### 互操作性

在 Node.js 的早期版本中，CommonJS 和 ESM 不能很好地一起工作。然而，随着时间的发展，Node.js 增加了对这两种模块系统间互操作性的支持。具体来说，在 Node.js v21.7.1 等较新版本中，开发者可以更灵活地在同一个项目中混合使用 CommonJS 和 ESM。

#### 从 CommonJS 导入 ESM

如果你有一个 ESM 模块，你想在 CommonJS 代码中使用它，你必须通过`import()`函数来异步导入。这是因为 ESM 本质上设计为支持异步加载。

```javascript
// CommonJS文件 example.cjs
(async () => {
  const { myFunction } = await import("./myModule.mjs");
  myFunction();
})();
```

在这个例子中，`myModule.mjs`是一个 ESM 模块（`.mjs`扩展名通常用于 ESM 文件），我们通过异步方式导入并使用它的`myFunction`功能。

#### 从 ESM 导入 CommonJS

在 ESM 中导入 CommonJS 模块相对简单。你可以直接使用`import`语句，就像导入其他 ESM 模块一样。

```javascript
// ESM文件 example.mjs
import myCjsModule from "./myCjsModule.cjs";
myCjsModule();
```

这里，`myCjsModule.cjs`是 CommonJS 模式的模块（`.cjs`扩展名用于明确指定 CommonJS 模块），我们可以像平时导入 ES 模块那样导入它。

### 注意事项

- 当从 CommonJS 模块导入 ESM 时，必须使用异步导入，因为 ESM 支持异步加载。
- 模块的默认导出在两种系统之间工作时需要特别注意。例如，如果 CommonJS 模块导出一个对象，当从 ESM 导入时，这个对象将是`default`导出的一部分。
- 在混合使用这两种模块系统时，建议清晰地了解各自的特性和限制，以避免可能出现的问题。

希望这个解释能帮助你更好地理解 Node.js 中 CommonJS 与 ESM 之间的互操作性！

### [import statements](https://nodejs.org/docs/latest/api/esm.html#import-statements)

Node.js 是一个强大的 JavaScript 运行环境，允许你在服务器端执行 JavaScript 代码。Node.js v21.7.1 中支持了 ES Modules (ESM)，这意味着可以使用`import`和`export`语法来组织和重用代码。

### `import`语句

在 JavaScript 中，`import`语句被用于引入其他模块（即文件或包）中导出的功能，比如函数、类、对象或变量等。使用`import`，你可以轻松地在一个模块中使用另一个模块定义的功能。

#### 基本语法

```javascript
import defaultExport from "module-name";
```

- `defaultExport`: 导入模块默认导出的成员，并给它命名为`defaultExport`。
- `"module-name"`: 模块的路径或名称。如果是第三方库，则通常是库的名称；如果是文件模块，则是文件的路径。

##### 具体实例

假设我们有一个数学计算的模块`mathUtils.js`：

```javascript
// mathUtils.js
export function add(x, y) {
  return x + y;
}

export function subtract(x, y) {
  return x - y;
}

const PI = 3.14159;
export default PI;
```

在另一个文件中，我们想要使用这个模块提供的功能：

```javascript
// app.js
import PI, { add, subtract } from "./mathUtils.js";

console.log(add(2, 3)); // 输出：5
console.log(subtract(5, 3)); // 输出：2
console.log(PI); // 输出：3.14159
```

在这个例子中，`add`和`subtract`函数是通过花括号导入的，因为它们是`mathUtils.js`的命名导出。而`PI`是该模块的默认导出，因此在导入时不需要花括号。

### 实际应用例子

#### 使用第三方库

假设你在开发一个 Web 应用，需要使用一个日期处理库`date-fns`来处理日期：

```javascript
import { formatDistanceToNow } from "date-fns";

const result = formatDistanceToNow(new Date(2023, 0, 1));
console.log(`距离现在已过去了 ${result}`);
```

这里，我们从`date-fns`库中导入了`formatDistanceToNow`函数，用于计算从指定日期到现在的时间距离，并打印到控制台。

#### 动态导入

动态导入是一个更高级的场景，允许你按需加载模块。这对于减小应用的初始加载时间非常有帮助：

```javascript
async function loadModule() {
  if (需要特定功能) {
    const { someFunction } = await import("./someModule.js");
    someFunction();
  }
}

loadModule();
```

以上展示了如何在 Node.js 中使用`import`语句来组织和管理代码，以及如何通过导入模块来重用代码和功能。这些概念是现代 JavaScript 开发的基石，理解并掌握它们将帮助你构建更加模块化、可维护和高效的应用程序。

### [require](https://nodejs.org/docs/latest/api/esm.html#require)

好的，让我来详细解释一下 Node.js 中的 `require` 函数及其用法。

首先，`require` 是 Node.js 中用于导入模块的一种方式。在 Node.js 中，模块可以是一个库、文件或一组文件，它们提供了一些特定的功能。使用 `require` 函数，你可以加载这些模块，并在你的代码中使用它们提供的功能。

`require` 函数的基本语法是这样的：

```javascript
const module = require("module_name");
```

这里，`module_name` 是你想要导入的模块的名称。它可以是 Node.js 内置的模块名称，比如 `http`、`fs` 等，也可以是你自己写的文件或第三方库。

下面是一些具体的例子：

### 例子 1: 导入内置模块

假设你想在你的程序中创建一个简单的 HTTP 服务器，你可以使用 Node.js 的内置 `http` 模块。

```javascript
const http = require("http");

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World\n");
  })
  .listen(8080);

console.log("Server running at http://127.0.0.1:8080/");
```

在这个例子中，我们用 `require` 函数导入了 `http` 模块，并使用它创建了一个简单的服务器。

### 例子 2: 导入文件

如果你有一个叫 `myModule.js` 的文件，里面定义了一些功能，你可以这样导入它：

```javascript
// 假设 myModule.js 文件内容如下：
// function sayHello(name) {
//   console.log('Hello ' + name);
// }
// module.exports = sayHello;

const sayHello = require("./myModule.js");

sayHello("World"); // 输出: Hello World
```

这里，`./myModule.js` 表示当前目录下的 `myModule.js` 文件。我们导入这个文件，并使用其中定义的 `sayHello` 函数。

### 例子 3: 导入第三方库

如果你使用了第三方库，比如 `express`，你可以这样导入它：

```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
```

在这个例子中，我们使用 `require` 导入了 `express` 模块，然后用它来创建一个简单的 web 应用。

这就是 `require` 的基本用法。在 Node.js v21.7.1 版本中，`require` 仍然是导入模块的主要方式，特别是在使用 CommonJS 模块系统时。需要注意的是，随着 ES6 模块的普及，`import` 语法也越来越常见，但 `require` 依旧在很多项目和库中广泛使用。

### [CommonJS Namespaces](https://nodejs.org/docs/latest/api/esm.html#commonjs-namespaces)

当我们谈论 Node.js 中的`CommonJS Namespaces`，我们实际上是在讨论在 ESM（ECMAScript Modules）环境下如何处理 CommonJS 模块。这是因为 Node.js 支持两种模块系统：CommonJS 和 ESM。CommonJS 是 Node.js 早期采用的模块系统，而 ESM 是 JavaScript 语言标准化的模块系统。

在 Node.js v21.7.1 中，当使用 ESM（即通过`import`和`export`语法）加载 CommonJS 模块时，该模块被视为一个单一的默认导出。换句话说，整个 CommonJS 模块被当作一个对象，你可以通过默认导入来获取它。这里的重点是“命名空间”——它暗示了 CommonJS 模块被视为具有其所有导出作为属性的单个对象。

### 示例：

假设我们有一个 CommonJS 模块，名为`mathHelpers.cjs`，内容如下：

```javascript
// CommonJS模块格式
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };
```

在 CommonJS 体系中，我们通过`require`函数来导入这些函数。但在 ESM 中，整个模块被看作一个默认导出，所以导入方法会有所不同。

如果你想在一个 ESM 文件（例如，`calculator.mjs`）中使用这个 CommonJS 模块，你可以这样做：

```javascript
// ESM模块格式
import mathHelpers from "./mathHelpers.cjs";

console.log(mathHelpers.add(10, 5)); // 输出: 15
console.log(mathHelpers.subtract(10, 5)); // 输出: 5
```

在这个例子中，`mathHelpers`是一个命名空间对象，其中包含了`mathHelpers.cjs`模块的所有导出。我们通过`import`关键字将整个`mathHelpers`模块作为一个对象导入，然后就可以访问其内部定义的`add`和`subtract`函数了。

### 实际运用：

1. **兼容老项目**：在迁移旧项目至使用更现代的 ESM 模块系统时，这种方式允许开发者逐步迁移代码库，而不是一次性重写整个项目。

2. **利用 NPM 上的包**：由于 NPM 上大量的包仍然是用 CommonJS 格式编写的，这种机制使得在使用 ESM 的新项目中依然可以无缝地使用这些包。

3. **服务端脚本**：在 Node.js 服务端应用程序中，你可能需要引入一些只提供 CommonJS 接口的第三方模块，此时，了解如何在 ESM 代码中导入并使用它们就显得尤为重要。

理解 CommonJS 和 ESM 之间的互操作性对于现代 Node.js 开发来说很重要，它确保了代码的灵活性和未来的兼容性。

### [Differences between ES modules and CommonJS](https://nodejs.org/docs/latest/api/esm.html#differences-between-es-modules-and-commonjs)

好的，让我来详细解释一下 Node.js 中 ES 模块与 CommonJS 模块的区别，并举一些实际的例子。

### CommonJS 模块

1. **定义**: CommonJS 模块是 Node.js 最初的模块系统，主要用于服务器端编程。
2. **特点**:
   - **同步加载**: CommonJS 模块是同步加载的，这意味着代码在读取和执行模块时会暂停，直到模块加载完成。在服务器端，这种方式不会引起问题，因为模块通常已经在本地磁盘上。
   - **对象导出**: 模块通过 `module.exports` 对象导出，并通过 `require` 函数导入。
3. **例子**:

   ```javascript
   // math.js
   const add = (a, b) => a + b;
   module.exports = { add };

   // main.js
   const math = require("./math.js");
   console.log(math.add(2, 3)); // 输出 5
   ```

### ES 模块

1. **定义**: ES 模块是 ECMAScript 标准的一部分，用于前端和后端编程。
2. **特点**:
   - **异步加载**: ES 模块支持异步加载，适合大型应用和前端环境。
   - **静态结构**: 模块的导入和导出在文件的最顶层，这让 JavaScript 引擎可以在执行代码前分析模块结构。
   - **关键字导出**: 使用 `export` 关键字导出，并使用 `import` 导入。
3. **例子**:

   ```javascript
   // math.js
   export const add = (a, b) => a + b;

   // main.js
   import { add } from "./math.js";
   console.log(add(2, 3)); // 输出 5
   ```

### 主要区别

1. **语法差异**: CommonJS 使用 `require` 和 `module.exports`，而 ES 模块使用 `import` 和 `export`。
2. **加载机制**: CommonJS 是同步的，ES 模块是异步的。
3. **使用范围**: CommonJS 主要用于 Node.js 服务器端编程，而 ES 模块则更普遍，适用于现代前端和后端开发。

总的来说，ES 模块是一个更现代化、灵活且功能更丰富的模块系统。随着 Node.js 和前端生态的发展，ES 模块变得越来越流行。不过，在某些老项目或特定场景下，CommonJS 仍然是一个可靠的选择。

#### [No require, exports, or module.exports](https://nodejs.org/docs/latest/api/esm.html#no-require-exports-or-moduleexports)

在 Node.js 的历史上，`require`, `exports`, 和 `module.exports` 是 CommonJS 模块系统的核心组成部分，它允许 JavaScript 文件导入和导出模块。但是，随着 ES Module (ECMAScript Modules) 的推广，Node.js 也开始支持这一标准，从而在新版本中引入了一些变化，特别是在 v21.7.1 版本中关于模块系统的处理上做出了明显的调整。

### ES Module 简介

ES Module 是 JavaScript 官方的模块系统标准，提供了`import`和`export`语句来导入和导出模块。这种方式比 CommonJS 的`require`和`module.exports`更为现代，也更易于静态分析，从而有助于实现代码的优化，如摇树优化（tree-shaking）。

### Node.js v21.7.1 中的变化

在 Node.js v21.7.1 版本中，对于使用 ES Module 系统的文件，不再支持使用`require`, `exports`, 或 `module.exports`。这意味着你不能在使用 ES Module 语法的文件中使用这些 CommonJS 模块系统的关键词。这样的变化旨在鼓励开发者使用更现代的模块定义和导入方式，即使用`import`和`export`语句。

### 实际运用例子

#### 例子 1: 导出模块

- **CommonJS 方式（过时）**

```javascript
// message.js
module.exports = {
  sayHello() {
    console.log("Hello, world!");
  },
};
```

```javascript
// app.js
const message = require("./message");
message.sayHello(); // 输出: Hello, world!
```

- **ES Module 方式**

```javascript
// message.js
export function sayHello() {
  console.log("Hello, world!");
}
```

```javascript
// app.js
import { sayHello } from "./message.js";
sayHello(); // 输出: Hello, world!
```

#### 例子 2: 导入模块

- **CommonJS 方式（过时）**

```javascript
// 导入Express框架（假设Express支持CommonJS）
const express = require("express");
const app = express();
```

- **ES Module 方式**

```javascript
// 导入Express框架（假设Express支持ES Module）
import express from "express";
//文書は桜茶から来ています。商用目的では使用しないでください。
const app = express();
```

通过这些例子，你可以看到在 ES Module 中使用`import`和`export`不仅语法更简洁，而且更加符合 JavaScript 的发展趋势。Node.js v21.7.1 及以后的版本中推动使用 ES Module，是为了与 JavaScript 生态系统中的其他工具和库保持一致，从而使得开发更加高效和现代化。

#### [No **filename or **dirname](https://nodejs.org/docs/latest/api/esm.html#no-__filename-or-__dirname)

当你开始使用 Node.js 进行开发，尤其是在进入到模块化编程时，你可能会遇到两个非常有用的全局变量：`__filename`和`__dirname`。简单来说，`__filename`变量返回当前模块的绝对路径，而`__dirname`返回当前模块文件所在目录的绝对路径。

在 Node.js 的传统 CommonJS 模块系统中（即使用`require`语法加载模块），这两个变量是自动提供给每个模块的，可以直接使用，非常方便。它们的存在使得你可以轻松地获取文件或目录的绝对路径，这在处理文件路径、读写文件等场景下极为有用。

然而，随着 ECMAScript 模块（ESM）的引入和推广，Node.js 在处理`__filename`和`__dirname`上做了一些调整。在 Node.js v21.7.1（也包括其他近期版本中），如果你使用的是 ESM（意味着你的代码文件以`.mjs`扩展名结尾，或者你在 package.json 中指定了`"type": "module"`），那么`__filename`和`__dirname`这两个变量将不再直接可用。这是因为 ECMAScript 模块旨在与浏览器 JavaScript 模块保持更紧密的兼容性，而浏览器环境中并没有这两个变量的概念。

### 解决方法

虽然在 ESM 中不能直接使用`__filename`和`__dirname`，但我们可以通过其他方式来达到相同的目的：

#### 获取当前文件路径（`__filename`替代）

```javascript
import { fileURLToPath } from "url";
import { dirname } from "path";

// 当前文件的URL
const __filename = fileURLToPath(import.meta.url);

console.log(__filename);
```

#### 获取当前目录路径（`__dirname`替代）

```javascript
import { fileURLToPath } from "url";
import { dirname } from "path";

// 当前文件的URL
const __filename = fileURLToPath(import.meta.url);

// 利用dirname函数和__filename获取目录路径
const __dirname = dirname(__filename);

console.log(__dirname);
```

### 实际运用例子

想象你正在构建一个 Web 服务器，需要加载一个位于服务器文件系统中的 HTML 文件。在 CommonJS 模块中，你可能会这样做：

```javascript
const path = require("path");
const fs = require("fs");

const htmlFilePath = path.join(__dirname, "views", "index.html");
const htmlContent = fs.readFileSync(htmlFilePath, "utf8");

console.log(htmlContent);
```

而在 ESM 中，由于缺乏`__dirname`，你需要稍微调整方法：

```javascript
import { fileURLToPath } from "url";
import { dirname } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const htmlFilePath = new URL("views/index.html", import.meta.url);
const htmlContent = readFileSync(htmlFilePath, "utf8");

console.log(htmlContent);
```

通过这种方式，即便在 ESM 模块中，你仍然能够高效地获取到文件和目录的路径，实现功能需求。

#### [No Addon Loading](https://nodejs.org/docs/latest/api/esm.html#no-addon-loading)

Node.js 是一个运行在服务器端的 JavaScript 环境，它允许你使用 JavaScript 来编写服务器端的脚本。Node.js 有一个模块系统，使得开发者可以导入和使用其他文件或者模块中的功能。在 Node.js 中，有两种主要的模块系统：CommonJS 和 ECMAScript Modules (ESM)。

### Node.js v21.7.1 中的"No Addon Loading"

在 Node.js v21.7.1 的文档中提及的“无插件加载（No Addon Loading）”，特指在使用 ECMAScript Modules（即 ES 模块，通常是以`.mjs`文件扩展名或者在`package.json`中通过设置`"type": "module"`来定义的项目）时，不能直接加载原生插件（native addons）。原生插件是用 C++之类的语言编写的，然后通过 Node.js 的`N-API`、`nan`或直接使用 V8 引擎的 API 来与 Node.js 进行交互的代码。它们通常用于执行那些需要高性能计算或直接与系统底层交互的任务。

### 为什么禁止直接加载原生插件？

这样的设计主要是基于安全和模块生态的考虑。直接加载原生插件会使得模块系统更加复杂，并可能带来安全隐患。因为原生插件有直接访问内存和执行底层操作的能力，存在潜在的安全风险。

### 如何在 ESM 中使用原生插件？

尽管直接加载被限制，但我们仍可以在 ESM 中间接使用原生插件。方法通常是将原生插件的功能封装在一个 CommonJS 模块中，因为 CommonJS 模块可以加载原生插件。然后，我们可以在 ESM 中通过动态导入(`import()`)这个 CommonJS 模块来使用这些功能。

### 实际应用示例：

假设我们有一个原生插件`addon.node`，提供了一些高性能计算功能。我们不能直接在`.mjs`文件中使用`import 'addon.node'`来加载它。相反，我们可以创建一个`calculator.js`(CommonJS 模块)来封装`addon.node`提供的功能：

```javascript
// calculator.js (CommonJS style)
const addon = require("./addon.node");

module.exports = {
  add: function (a, b) {
    return addon.add(a, b);
  },
};
```

然后，在我们的 ES 模块中，我们可以这样动态导入`calculator.js`并使用它：

```javascript
// main.mjs
(async () => {
  const calculator = await import("./calculator.js");
  console.log(calculator.add(5, 3)); // 假设`add`是`addon.node`提供的一个函数
})();
```

这样，即使在 ESM 中，我们也能间接地使用原生插件提供的功能，既保证了模块系统的安全性和清晰性，又能够利用原生插件的高性能特性。

#### [No require.resolve](https://nodejs.org/docs/latest/api/esm.html#no-requireresolve)

了解 Node.js 的`require.resolve`功能和它在 ESM（ECMAScript 模块）环境中的变化是一个很好的起点，尤其是对于编程新手来说。

### 什么是`require.resolve`?

在 Node.js 中，`require`是 CommonJS (CJS) 模块系统中用于导入模块的函数。当你使用`require`函数导入模块时，Node.js 会查找并加载模块文件。`require.resolve`是一个与`require`相关的函数，但它不会加载模块。相反，它仅仅返回模块文件的完整路径。这个功能常被用来检查模块是否存在，以及确定模块的确切位置。

### Node.js v21.7.1 中的变化

从 Node.js 的某一版本开始（具体到 v21.7.1），ECMAScript 模块（简称 ESM）成为了支持的一种模块系统。ECMAScript 模块是 JavaScript 官方标准的模块系统，旨在提供一种在不同 JavaScript 环境中统一使用模块的方式。与之相比，CommonJS 模块是 Node.js 特有的。

在引入 ESM 后，`require.resolve`函数不再适用于 ESM 环境。这是因为 ESM 使用不同的解析和加载机制。也就是说，如果你正在使用基于 ESM 的`.mjs`文件或者在`package.json`中指定了"type": "module"，那么你将不能使用`require.resolve`来获取模块路径。

### 实际运用的例子

假设我们有一个项目，使用 CommonJS 模块系统，并且我们想知道某个第三方库（比如`lodash`）的实际安装路径。使用 CommonJS，我们可以这样做：

```javascript
const modulePath = require.resolve("lodash");
console.log(modulePath);
```

这将输出`lodash`模块的完整路径。

但是，在 ESM 环境下，尝试使用`require.resolve`将会导致错误，因为 ESM 不支持`require`或`require.resolve`。在 ESM 中，你通常不需要显式地找到模块的路径，因为 ESM 的导入机制是通过 URL 或路径的字符串完成的。如果确实需要解析模块路径，你可能需要查找或创建专门为 ESM 设计的工具或方法。

### 结论

随着 Node.js 和 JavaScript 生态系统向 ESM 转移，了解这些差异和限制变得十分重要。虽然`require.resolve`在 CommonJS 中很有用，但它不适用于 ESM，这意味着开发者需要适应新的模块解析方法。幸运的是，随着时间的推移，社区和工具链将继续发展，以更好地支持 ESM 的需求。

#### [No NODE_PATH](https://nodejs.org/docs/latest/api/esm.html#no-node_path)

在 Node.js 中，`NODE_PATH`是一个环境变量，曾经用来指定额外的目录，这些目录会被添加到模块查找路径中。简单来说，如果你有一些模块不在你的项目文件夹内，但你希望在你的项目中能够无需提供绝对路径就直接引用这些模块，那么你可以通过设置`NODE_PATH`环境变量来实现。

然而，从 Node.js 的某个版本开始（14.x 版本开始逐步弃用），在使用 ECMAScript 模块（ESM）时，`NODE_PATH`不再生效。这就意味着，你不能像以前那样通过设置`NODE_PATH`来告诉 Node.js 去哪些额外的地方寻找模块了。这是因为 ECMAScript 模块旨在提供一个更加标准化和静态的模块解析机制，以此来改进模块系统的兼容性和可靠性。

### 实际运用的例子

假设在早期版本的 Node.js 中，你有以下的项目结构：

```
/my-project
    /node_modules
        /lodash
    /src
        index.js
/other-modules
    /my-utils
        utils.js
```

如果你想要在`index.js`中引用`utils.js`，而不想使用相对路径或绝对路径，例如，不使用`require('../../other-modules/my-utils/utils.js')`，你可能会设置`NODE_PATH`环境变量为`/other-modules`，然后只需要`require('my-utils/utils.js')`。

但是，在使用 Node.js v21.7.1 或任何支持 ECMAScript 模块的版本时，这种方法不再有效。针对这种情况，你需要考虑其他的模块组织方式。比如将常用的模块发布到 npm 上或者使用符号链接（symlinks）来在物理层面上将模块链接到`node_modules`目录下。

### 替代方案

1. **使用 npm 链接（npm link）**：这是对符号链接的一种高级封装，可以在开发过程中将本地模块链接到全局模块，再从全局模块链接到项目的`node_modules`目录。

2. **将你的库发布到 npm**：如果你经常需要在多个项目之间共享代码，考虑将其发布为一个 npm 包。这样，你只需像其他依赖一样安装它即可。

3. **使用相对或绝对路径**：这是最直观的方式，即在 import 时直接指向模块的路径。

4. **使用 imports 字段**：在`package.json`中使用`imports`字段可以定义导入映射，为模块指定别名，这也是在大型项目中管理模块路径的一种方式。

总结，`NODE_PATH`不再被新版 Node.js（特别是在使用 ECMAScript 模块时）所支持，这迫使开发者采用更现代、更标准化的方法来组织他们的代码模块。

#### [No require.extensions](https://nodejs.org/docs/latest/api/esm.html#no-requireextensions)

在解释 Node.js v21.7.1 中的"No require.extensions"特性之前，让我们首先了解一下什么是 Node.js，以及它处理模块的一些基本概念。

### Node.js 简介

Node.js 是一个开源、跨平台的 JavaScript 运行环境，它允许您在服务器端运行 JavaScript 代码。Node.js 使用非阻塞、事件驱动的模型，使其轻量且高效，适合构建各种网络应用。

### 模块系统

在 Node.js 中，模块系统允许您将程序分割成可重用的片段。过去，Node.js 主要使用 CommonJS 模块规范，这意味着您会使用`require`函数来加载模块，例如：

```javascript
const fs = require("fs"); // 加载文件系统模块
```

### 过渡到 ESM

随着时间的推移，JavaScript 语言本身引入了 ECMAScript Modules (ESM)作为标准的模块系统。ESM 带来了`import`和`export`关键词，提供了一个更现代化和更静态的方式来处理模块之间的依赖关系。

### "No require.extensions" 解释

在过去，Node.js 通过`require.extensions`对象允许用户或者社区的库来注册对不同文件扩展名的处理逻辑，从而可以`require`非 JavaScript 模块，比如 JSON 文件或者自定义编译后的代码。这是一个非标准的功能，主要用于 CommonJS 模块系统。

然而，随着 ESM 成为 Node.js 中支持的一级公民，这种方式被认为是过时的。在 Node.js v21.7.1 版本中，明确指出在使用 ESM 时，`require.extensions`将不再被支持。

### 实际影响

这意味着如果你正在使用 ESM（即，你在使用`import`和`export`语法），你不能再依赖`require.extensions`来自定义加载逻辑。这进一步促进了向标准 ECMAScript 模块的转移，并鼓励开发人员使用标准化的方法处理模块和依赖关系。

### 示例

假设过去你可能依赖`require.extensions`来加载`.txt`文件：

```javascript
require.extensions[".txt"] = function (module, filename) {
  const content = fs.readFileSync(filename, "utf8");
  module.exports = content;
};
const myText = require("./example.txt");
```

在新版本的 Node.js 中，上述代码将不再有效。改为采用 ESM，你可以创建一个专门的加载器或者简单地使用内置的 API 或者工具来读取文件内容，然后通过标准的`import`/`export`方式进行使用。

### 结论

"No require.extensions"的变化是 Node.js 朝着更加现代和标准化的模块系统迈出的一步。虽然这可能要求开发人员调整他们的代码和习惯，但最终目的是为了提升模块管理的效率和一致性。

#### [No require.cache](https://nodejs.org/docs/latest/api/esm.html#no-requirecache)

在 Node.js v21.7.1 版本中，关于 `require.cache` 的提及表明，在使用 ES 模块（ECMAScript Modules）时，不再支持 `require.cache` 属性。为了更好地理解这个概念，让我们先从基础知识讲起。

Node.js 最初是以 CommonJS 模块系统为基础构建的，这个系统使用 `require()` 函数来加载模块。当你使用 `require()` 加载模块时，Node.js 会缓存该模块。这意味着，如果你在你的应用中多次 `require()` 同一个模块，实际上只有第一次是真正加载执行，之后的 `require()` 调用都会返回缓存中的模块实例，这个过程是通过 `require.cache` 对象管理的。

然而，随着 ES 模块的引入和逐渐成为标准，Node.js 也开始支持这种新的模块系统。ES 模块使用 `import` 和 `export` 语法来加载和导出模块，这与 CommonJS 的 `require()` 和 `module.exports` 有着本质的区别。

在引入 ES 模块的背景下，`require.cache` 这个概念不再适用，因为 ES 模块的加载和缓存机制与 CommonJS 不同。ES 模块的设计和缓存逻辑更加现代化和严格，遵循静态导入原则，这意味着你不能在运行时动态地加载模块，而是需要在文件的顶部静态声明所有依赖。由于这些区别，Node.js 在处理 ES 模块时不使用 `require.cache`。

实际运用的例子：

1. **CommonJS 模块加载和缓存：**

   ```javascript
   // 加载一个模块
   const myModule = require("./myModule");
   // 由于模块被缓存，无论调用多少次 require('./myModule')，都只有第一次是真正加载执行

   // 查看缓存
   console.log(require.cache);
   ```

2. **ES 模块的使用：**
   ```javascript
   // 使用 ES模块导入语法
   import myModule from "./myModule.mjs";
   // 注意：ES模块中不使用 require()，也没有 require.cache 机制
   // 模块的加载和缓存是自动管理的，不需要（也不能）手动干预
   ```

因此，当 Node.js 文档中提到在使用 ES 模块时 "No `require.cache`"，这意味着在采用 ES 模块系统的项目中，我们不能使用 `require.cache` 来查看或管理模块缓存，因为这个机制不再适用。开发者需要适应新的模块系统的规则和特性，而 Node.js 也提供了相应的工具和方法来支持这一转变。

## [JSON modules](https://nodejs.org/docs/latest/api/esm.html#json-modules)

Node.js v21.7.1 中对 JSON 模块的处理是一个相对直接且有用的功能。在详细解释之前，先了解一下 ESM（ECMAScript Module）和 JSON。

- **ESM**：即 ECMAScript 模块，是 JavaScript 官方的标准模块系统，用于替代旧的 CommonJS 模块系统。它提供了一种在不同文件间分享变量和函数的方式。
- **JSON**：全称为 JavaScript Object Notation，是一种轻量级的数据交换格式，易于人阅读和编写，也易于机器解析和生成。

在 Node.js 中，随着 ESM 的广泛支持，你可以更加灵活地导入和使用模块。而对于 JSON 模块的支持，则使得在 ESM 环境下直接导入 JSON 文件变成可能，并且操作起来非常简单直观。

假设你有一个名为`config.json`的文件，内容如下：

```json
{
  "name": "My App",
  "version": "1.0.0",
  "description": "This is a JSON example for Node.js"
}
```

在 Node.js v21.7.1 或以上版本中，如果你想在你的应用程序中使用这个配置文件，你可以很容易地通过 ES 模块系统来导入它。示例如下：

首先，确保你的 Node.js 项目类型设置为模块。你可以在你的`package.json`中添加 `"type": "module"` 来实现。

```json
{
  "type": "module",
  ...
}
```

然后，在你的 JavaScript 文件中，你可以使用`import`语句来导入 JSON 文件。假设我们的脚本文件名为`index.js`：

```javascript
// 导入JSON模块
import config from "./config.json" assert { type: "json" };

console.log(config);
// 输出: { name: 'My App', version: '1.0.0', description: 'This is a JSON example for Node.js' }
```

注意，在导入时使用`assert { type: 'json' }`是必须的，这是一个导入断言，告诉 Node.js 这个模块是 JSON 格式的。这样做可以避免安全和性能问题，因为 Node.js 可以直接知道该如何处理这个模块。

### 实际运用例子

1. **配置文件**：最直接的例子就是加载配置文件。假设你的应用程序有不同的配置环境（开发、测试、生产等），你可以为每个环境创建一个 JSON 配置文件，然后根据需要导入它们。

2. **多语言支持**：如果你正在构建一个需要多语言支持的应用程序，你可以将每种语言的翻译保存在不同的 JSON 文件中。运行时根据用户的语言偏好动态导入相应的 JSON 模块。

3. **静态数据**：对于需要加载大量静态数据的应用程序（比如游戏中的物品数据库、学术研究中的数据集），你可以将这些数据存储在一个或多个 JSON 文件中，按需导入。

通过支持 JSON 模块，Node.js 让开发者能够更加便捷地处理和共享数据，无论是配置信息、国际化内容还是其他任何形式的静态数据。这进一步增强了 Node.js 在构建现代应用程序时的灵活性和效率。

## [Wasm modules](https://nodejs.org/docs/latest/api/esm.html#wasm-modules)

Node.js 是一个强大的 JavaScript 运行时环境，允许你在服务器端运行 JavaScript 代码。从 Node.js v21.7.1 开始，Node.js 对 WebAssembly (Wasm) 模块的支持得到了扩展，这意味着你可以在 Node.js 应用中直接导入和使用 Wasm 模块。

### WebAssembly (Wasm) 是什么？

WebAssembly (Wasm) 是一种为网络开发的二进制指令格式。它允许开发者使用诸如 C/C++、Rust 等语言开发应用程序，然后将这些程序编译成 Wasm，进而在网页浏览器或 JavaScript 运行时环境（如 Node.js）中高效运行。Wasm 的主要优势在于它能够提供接近原生性能的执行效率，这对于需要大量计算资源的应用特别有用，如游戏、图像和视频处理等。

### Node.js 中的 Wasm 模块

在 Node.js v21.7.1 版本中，可以直接在 JavaScript 代码中导入 Wasm 模块。这一功能使得在 Node.js 应用中整合和使用经过优化的 Wasm 代码变得简单直接。你可以利用 Wasm 模块来执行密集型计算任务，同时依然享受到 Node.js 异步非阻塞 I/O 的优势。

### 实际运用的例子

1. **图像处理应用**: 假设你正在开发一个需要大量图像处理的 Node.js 应用。你可以使用 C/C++ 编写图像处理算法，然后将这些算法编译成 Wasm 模块。之后，在 Node.js 应用中直接导入并使用这些 Wasm 模块，以获得比纯 JavaScript 实现更高的执行效率。

2. **数据加密**: 如果你的应用需要高效地执行加密或哈希计算，可以考虑使用 Rust 编写这些计算逻辑，然后编译成 Wasm 模块。通过在 Node.js 中使用这些 Wasm 模块，你可以获得接近原生的性能，同时保持应用的灵活性和扩展性。

3. **机器学习**: 对于需要执行复杂数学运算和数据处理的机器学习应用，使用 Wasm 模块可以显著提高性能。你可以将核心的机器学习算法用 C/C++ 或 Rust 编写，编译为 Wasm，然后在 Node.js 应用中进行调用，从而快速处理大量数据。

### 如何使用

在 Node.js 中使用 Wasm 模块非常简单。首先，你需要有一个已经编译成 `.wasm` 格式的模块。然后，可以使用标准的 ES 模块语法直接导入 Wasm 模块：

```javascript
import wasmModule from "./path/to/module.wasm";

// 使用 wasmModule
```

这种直接支持 Wasm 模块的能力，为 Node.js 开发者打开了一扇通往高效、可扩展应用开发的大门，尤其是在处理计算密集型任务时。

## [Top-level await](https://nodejs.org/docs/latest/api/esm.html#top-level-await)

当我们说到 Node.js 中的 "Top-level await"，我们指的是在模块的顶层直接使用 `await` 关键字，而不需要将其包含在一个异步函数中。这是一个相对较新的特性，它极大地简化了使用异步操作的方式，特别是在初始化模块或设置项目配置时。

### 什么是 Top-level await?

首先，让我们分解一下术语：

- **Top-level** 指的是代码位于最外层作用域，不在任何函数内。
- **await** 是一个用于等待异步操作完成的关键字，通常与 `async` 函数一起使用。

在过去，如果你想在模块的最外层使用 `await` 来等待一个异步操作（比如读取文件、数据库查询等），你必须将 `await` 放在一个标记为 `async` 的函数内部。但是随着 Node.js v21.7.1 中引入的 Top-level `await`，你可以直接在模块顶层使用 `await`，无需将其包裹在异步函数中。

### 实际运用示例

#### 示例 1: 读取文件内容

假设你想在程序开始时读取配置文件的内容。使用 Top-level `await`，你可以这样做：

```javascript
import fs from "fs/promises";

const configContent = await fs.readFile("config.json", "utf8");
console.log(configContent);
```

在这个示例中，通过 `await` 直接等待文件读取操作完成，并将结果存储在 `configContent` 变量中。这一切都发生在模块的最顶层，无需额外的封装函数。

#### 示例 2: 数据库连接

考虑另一个常见场景：在应用启动时连接数据库。使用 Top-level `await`，这变得非常简单：

```javascript
import { connectToDatabase } from "./db.js";

const db = await connectToDatabase();
console.log("Database connected!");
```

在这里，`connectToDatabase` 是一个异步函数，可能会执行一些时间来建立数据库连接。使用 Top-level `await`，我们可以在继续执行后续代码前等待连接成功建立。

### 为什么这很重要？

Top-level `await` 提供了更多灵活性和简洁性，特别是在模块初始化或者执行一些依赖于异步结果的配置时。它使得代码更加直观，易于理解和维护，同时减少了之前必须使用自执行的异步函数（IIFE）的复杂性和样板代码。

总结，Top-level `await` 是一个强大的特性，它改善了 Node.js 中处理异步操作的能力，使得编写初始化逻辑和其他需要等待异步操作的代码段变得更加简单和直接。

## [HTTPS and HTTP imports](https://nodejs.org/docs/latest/api/esm.html#https-and-http-imports)

在 Node.js v21.7.1 中，一个引入的特性是能够通过 HTTPS 和 HTTP 协议来导入 ES 模块（ESM）。这意味着你现在可以直接从远程服务器上加载 JavaScript 模块，而不仅仅是从本地文件系统。这个功能对于一些特定场景非常有用，比如实时获取最新的库代码，或者在不同项目之间共享模块而不需要事先下载和安装。

### 如何工作？

当你在 import 语句中使用 HTTPS 或 HTTP URL 时，Node.js 会向该 URL 发出一个网络请求，下载模块代码，然后像处理本地模块一样处理这段代码。这里的关键点是模块是通过网络实时获取的。

### 实际运用例子

#### 例子 1：直接从 CDN 导入模块

假设有一个 JavaScript 模块托管在 GitHub 或任何支持 HTTPS 的 CDN 上，例如：

```javascript
// index.mjs
import { hello } from "https://example.com/some-module.mjs";

hello();
```

在这个例子中，`some-module.mjs`可能是一个简单的模块，它导出一个`hello`函数，当你运行这段代码时，Node.js 会通过 HTTPS 去`https://example.com/some-module.mjs`下载这个模块，然后执行`hello`函数。

#### 例子 2：动态加载依赖

考虑一个更复杂的场景，你可能想根据不同的条件加载不同的模块版本。例如，基于某个特性标志选择加载不同的库版本：

```javascript
// index.mjs
let library;

if (featureFlag) {
  library = await import("https://example.com/library-v2.mjs");
} else {
  library = await import("https://example.com/library-v1.mjs");
}

library.doSomething();
```

这里，`featureFlag`决定了加载哪个版本的库。这种动态导入方式（使用`await import()`）允许你根据运行时条件导入不同的模块。

### 注意事项

- **安全性**：从远端加载代码引入了额外的安全风险。例如，如果服务被劫持，恶意代码可能会被注入你的应用。因此，只从可信源加载模块非常重要。
- **性能**：网络请求通常比从磁盘读取文件慢，所以过度使用 HTTP/HTTPS 导入可能会影响应用的启动时间和性能。
- **缓存机制**：Node.js 提供了一定的缓存机制来缓存远程模块，减少重复下载。了解和合理利用这些缓存机制对于优化性能至关重要。

总结起来，HTTPS 和 HTTP 导入为 Node.js 项目带来了更多的灵活性和连通性，但同时也要注意管理与之相关的安全和性能问题。

### [Imports are limited to HTTP/1](https://nodejs.org/docs/latest/api/esm.html#imports-are-limited-to-http1)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，它让 JavaScript 可以在服务器端运行。在 Node.js v21.7.1 的版本中，提到了一个特定的特性：“Imports are limited to HTTP/1”，这意味着当你在使用 ES 模块（ECMAScript Modules）进行网络导入时，仅限于使用 HTTP/1 协议。

### 什么是 ES 模块？

ES 模块是 ECMAScript (即 JavaScript) 的一个标准，用于在不同的 JavaScript 文件之间导入和导出代码。这个特性让代码组织和模块化变得更加方便和强大。

### HTTP/1 的限制是什么？

HTTP/1 是一种网络通信协议的早期版本，它定义了浏览器（或其他客户端）与服务器之间如何交换数据。Node.js 在这个版本中限制 ES 模块只能通过 HTTP/1 协议进行网络导入，这可能是出于兼容性和稳定性的考虑。虽然 HTTP/2 和 HTTP/3 提供了更高效的数据传输方式，但它们在处理模块导入时可能还不够稳定或广泛支持。

### 实际运用的例子

1. **开发一个简单的网页应用**：假设你正在开发一个网页应用，需要从另一个服务器上动态导入一些 JavaScript 模块。在 Node.js v21.7.1 中，你必须确保这些模块通过 HTTP/1 协议可用。

2. **创建一个服务端项目**：如果你的项目依赖于从远程源导入模块，比如一个公共的 CDN（内容分发网络），这个限制意味着你需要确认这些资源通过 HTTP/1 提供服务，以保证兼容性。

### 如何应对这个限制？

- **检查资源兼容性**：在引入远程模块之前，确保这些模块可以通过 HTTP/1 访问。
- **本地化依赖**：如果可能，将远程依赖项下载并保存到你的项目中，这样可以避免网络导入的需求，同时也提高了项目的运行稳定性。
- **关注 Node.js 的更新**：随着 Node.js 的不断发展，对 HTTP/2 或 HTTP/3 的支持可能会改进，所以保持对 Node.js 更新的关注可以帮助你利用最新的特性和改进。

总的来说，这个特性是一个技术细节，但了解它对于确保你的 Node.js 应用能够稳定运行是很重要的。

### [HTTP is limited to loopback addresses](https://nodejs.org/docs/latest/api/esm.html#http-is-limited-to-loopback-addresses)

在 Node.js v21.7.1 版本中，引入了一个新的安全特性，这个特性是关于 HTTP 服务器的：当你使用 ES 模块（ECMAScript Modules）时，HTTP 服务器默认只监听回环地址（即本机访问地址）。这意味着，如果你没有明确指定其他行为，那么你创建的 HTTP 服务器只能通过本机来访问，外部网络无法直接访问到该服务器。

### 解释

首先，理解几个概念：

- **HTTP 服务器**：简单来说，就是在网络上监听来自客户端的请求，并向其发送响应的软件。
- **ES 模块**：一种 JavaScript 模块系统，允许你将大型程序拆分成小的、可重用的代码片段。
- **回环地址**：也称为本地回路接口，通常指的是`127.0.0.1`（IPv4）或者`::1`（IPv6）。这是预留给每台计算机用于指向自己的 IP 地址。任何发往这个地址的数据包都不会被送到局域网或互联网上，而是直接在本机进行处理。

这个安全特性的目的是提高默认配置下的应用程序安全性。很多时候，开发人员在开发阶段可能并不希望他们的 HTTP 服务器被外界访问，尤其是当他们还未对安全性进行充分考虑时。通过限制服务器只在回环地址上监听，Node.js 帮助开发者避免了潜在的安全风险。

### 实际运用的例子

假设你正在使用 Node.js 开发一个 Web 应用，并且你正在使用 ES 模块。以下是创建 HTTP 服务器的示例代码：

```javascript
import http from "http";

const hostname = "127.0.0.1"; // 回环地址
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

在这个例子中，服务器被设置为仅在`127.0.0.1:3000`上监听。这是因为我们指定了`hostname`变量为回环地址。但在 Node.js v21.7.1 中，默认情况下，即使你没有指定`hostname`，服务器也将只接受来自本机的连接。

如果你想要让服务器能够从外部网络接收请求，你需要明确指定一个外部可达的 IP 地址或者使用`0.0.0.0`来监听所有网络接口。例如：

```javascript
server.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});
```

在实践中，这个安全特性是一个重要的默认安全措施，它确保了在开发阶段不会无意间暴露未经充分测试和加固的服务给外部网络。然而，在生产环境部署时，根据你的需求选择适当的监听地址和端口是非常重要的。

### [Authentication is never sent to the destination server.](https://nodejs.org/docs/latest/api/esm.html#authentication-is-never-sent-to-the-destination-server)

理解 Node.js 中提到的"Authentication is never sent to the destination server"，首先，我们需要知道它是在讨论 ESM（ECMAScript Modules）加载过程中的一个特定的安全机制。

### 什么是 ESM?

ESM, 或 ECMAScript Modules, 是 JavaScript 标准的官方模块系统。自 Node.js 版本 12 以来，Node.js 开始支持 ESM，允许开发者使用`import`和`export`语句在不同的文件之间共享代码。这种方式比传统的 CommonJS 模块系统（使用`require()`和`module.exports`）更为现代化和高效。

### Authentication 问题

当你从互联网上加载模块时——比如说，你有一个依赖库存储在某个远程服务器上，你想要在你的项目中直接通过 URL 引入它。如果这个 URL 包含认证信息（比如用户名和密码），Node.js 在尝试通过这个 URL 加载模块时，会忽略这些认证信息。这意味着，认证信息**不会被发送到目的服务器**。

### 为什么要这样设计？

这个设计考虑主要基于安全性。通过网络请求发送认证信息，尤其是当这些请求可能被记录或被第三方看到时，是非常危险的。例如，如果你正在使用公共 Wi-Fi，或者你的请求经过一些不安全的中间人，那么你的认证信息可能就会被截获。因此，Node.js 选择了一条更安全的路径，即根本不发送这些认证信息。

### 实际运用的例子

假设你想要导入一个位于私有服务器的模块，这个服务器需要认证才能访问：

```javascript
// 假设的代码，不会真正工作
import myModule from "https://username:password@private-server.com/module.js";
```

按照 Node.js 的安全机制，这里的`username:password`认证信息会被忽略。也就是说，当 Node.js 尝试加载这个模块时，它实际上是向`https://private-server.com/module.js`发送请求，没有包含任何认证信息。结果很可能是服务器拒绝了这个请求，因为缺少了必要的认证。

### 怎么正确处理？

正确的做法是通过其他方式进行认证，比如使用 OAuth tokens、API keys 或其他认证机制，并且确保这些敏感信息不会通过不安全的方式（如硬编码在源代码中）泄露。你可以在服务器端设置这些认证机制，并在客户端以安全的方式存储和调用认证密钥。

总之，这个设计决策强调了在处理网络请求和数据交换时，安全性应该始终放在首位。开发者需要寻找更安全、更有效的认证和数据保护方法，而不是依赖于可能被泄露的 URL 内的认证信息。

### [CORS is never checked on the destination server](https://nodejs.org/docs/latest/api/esm.html#cors-is-never-checked-on-the-destination-server)

在 Node.js v21.7.1 中，关于 CORS (Cross-Origin Resource Sharing，跨源资源共享) 的一个重要说明是："CORS is never checked on the destination server"，意思是在目标服务器上永远不会检查 CORS。

CORS 是一种安全机制，用于控制一个网页能否从另一个域名（源）请求资源。通常，浏览器会阻止跨域请求，除非目标服务器在响应中包含适当的 CORS 头信息，如 `Access-Control-Allow-Origin`。

但在 Node.js 中，当你使用它作为服务器时，它不会自动检查或强制执行 CORS 策略。这意味着如果你的 Node.js 服务器接收到来自任何源的请求，它将处理这些请求，而不管请求的源是什么。

举个例子：

假设你有一个运行在 Node.js 上的 API 服务器，地址为 `http://api.example.com`。如果有一个前端网页（例如 `http://frontend.example.com`）试图通过 AJAX 请求访问这个 API，通常浏览器会执行 CORS 检查。但是，Node.js 服务器不会自行拒绝这个请求，即使它来自不同的源。

如果你想在 Node.js 服务器上实施 CORS 策略，你需要自己在代码中处理。这通常通过使用中间件来实现，例如 `cors` 包。例如：

```javascript
const express = require("express");
const cors = require("cors");

const app = express();

// 使用 CORS 中间件，允许所有来源
app.use(cors());

// 或者，你可以更细致地配置 CORS 策略
// app.use(cors({
//   origin: 'http://frontend.example.com'
// }));

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from the API" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

在这个例子中，我们使用了 `cors` 中间件来允许跨域请求。这样，即使 Node.js 服务器本身不检查 CORS，我们也可以通过中间件来控制哪些来源的请求是被允许的。

### [Cannot load non-network dependencies](https://nodejs.org/docs/latest/api/esm.html#cannot-load-non-network-dependencies)

理解 Node.js 中的"Cannot load non-network dependencies"问题，首先要明白一些基本概念。Node.js 是一个让 JavaScript 运行在服务器端的平台，而 ESM（ECMAScript Modules）是其使用的模块系统。简单来说，模块就是包含代码和功能的文件，它们可以被其他模块导入和使用。

在 Node.js v21.7.1 及其他版本中，当你使用 ESM 系统时，可能会碰到“Cannot load non-network dependencies”的错误。这个错误的意思是，你尝试加载的依赖项或模块不符合 Node.js 对于网络或文件路径的规定。具体来说，这通常发生在以下几种情况：

1. **导入模块时使用了不正确的协议**：在 ESM 中，如果你直接从网络上加载模块，需要使用正确的 URL 格式，例如`https://`。同样地，如果从本地文件系统加载模块，路径需要以`file://`开头。如果没有遵循这些协议规定，就会触发这个错误。

2. **尝试加载非网络（non-network）资源而未指定正确路径**：比如，你可能尝试加载本地的一个模块或包，但提供的路径格式不正确。导致 Node.js 不能正确识别这个路径，从而无法加载目标模块。

### 实际运用的例子

假设你有一个名为`example.mjs`的模块，你想要在另一个 ESM 模块中导入它。

**错误的导入示例**：

```js
import example from "path/to/example.mjs";
```

这可能导致“Cannot load non-network dependencies”错误，因为路径没有正确地使用`file://`前缀来指示这是一个文件系统上的资源。

**正确的导入方式**：

```js
import example from "file:///absolute/path/to/example.mjs";
```

注意这里使用了`file://`协议和绝对路径，这样 Node.js 就能正确地找到并加载`example.mjs`模块。

### 解决策略

- 确保在导入本地模块时使用完整的文件路径，并且路径以`file://`开头。
- 如果是从网络加载模块，请确认 URL 格式正确，使用了适当的协议（如 http 或 https）。
- 检查是否有打字错误或路径错误，确保路径正确无误。

通过以上步骤，应该能帮助你理解并避免在使用 Node.js 进行模块导入时出现的"Cannot load non-network dependencies"错误。

### [Network-based loading is not enabled by default](https://nodejs.org/docs/latest/api/esm.html#network-based-loading-is-not-enabled-by-default)

让我们深入了解这个概念：“Network-based loading is not enabled by default” 在 Node.js v21.7.1 的上下文中意味着什么，以及它是如何影响开发的。

首先，简单来说，Node.js 是一个运行时环境，允许你使用 JavaScript 来编写服务器端代码。它非常适合处理网络操作，如处理网站后端逻辑、APIs、与数据库通信等。

### 什么是 Network-based loading？

Network-based loading 指的是从网络（例如通过 HTTP 或 HTTPS 协议）加载模块或脚本的能力。在 Node.js 的语境下，这意味着你可以从远程服务器动态地下载并执行代码，而不仅仅是从你的本地文件系统。

### 默认情况

在 Node.js 版本 21.7.1 中，出于安全考虑，网络加载功能并不是默认启用的。由于从互联网加载代码可能会引入安全隐患（例如，恶意代码的注入），Node.js 开发团队选择了一种更为谨慎的做法，即除非明确启用，否则不允许此类操作。

### 实际运用例子

想象你正在开发一个应用程序，需要根据用户的输入动态加载不同的库或模块。如果这些模块位于互联网上的某个远程服务器：

1. **动态配置应用** - 假设你正在开发一个微服务架构的系统，其中一些服务需要根据最新的业务规则动态调整。这些规则可以被编写成 JavaScript 模块，存储在中心服务器上。使用网络加载功能，各个服务可以实时获取和更新这些规则，无需重启或重新部署。

2. **插件系统** - 你正在创建一个提供插件支持的平台，允许用户自定义功能。这些插件可以由社区贡献，并托管在互联网上。通过启用网络加载，你的平台可以直接从插件库中加载用户选定的插件，增加了灵活性和扩展性。

3. **即时代码更新** - 对于需要频繁更新逻辑或算法的应用程序，通过网络加载模块，你可以确保每次执行都使用最新版本的代码，而不需要每次更新都重新部署整个应用程序。

### 如何启用？

虽然默认情况下是禁用的，但你可以通过特定的方法来启用网络加载功能。具体实施方法可能随 Node.js 的版本和进化而变化，因此始终参考最新的官方文档是个好习惯。

重要的是要记住，启用网络加载时需要考虑到安全性。确保只从信任的源加载代码，并考虑实现额外的安全措施，如代码签名验证，以减少安全风险。

总之，“Network-based loading is not enabled by default”反映了 Node.js 对安全的重视，同时也提供了足够的灵活性给那些需要并知道如何安全利用该功能的开发者。

## [Loaders](https://nodejs.org/docs/latest/api/esm.html#loaders)

### Node.js 中的 Loaders

在 Node.js 中，`loaders`是一种特殊的机制，用于控制和自定义模块的加载过程。简单来说，当你在 Node.js 应用程序中通过`import`语句或`require()`函数请求加载一个模块时，Node.js 会按照一定的规则去查找、解析并执行这个模块。`loaders`允许你介入这个过程，以实现特定的逻辑，比如修改模块的源代码、改变模块加载的方式等。

从 Node.js v21.7.1 开始，Nodejs 提供了更加官方和标准化的方式来使用`loaders`。这意味着你可以编写自己的 loader 或使用社区构建的 loader 来影响模块的加载行为。

#### 实际运用示例

1. **自定义编译/转换步骤** - 假设你在项目中使用了一种非标准的 JavaScript 语法，或者你想要在代码运行之前对其进行某种转换（比如使用 Babel 进行 ES6 到 ES5 的转换）。你可以编写一个 loader 来实现这一点，该 loader 在模块被正式执行前，先对其进行所需的转换。

2. **Mocking 依赖** - 在进行单元测试时，有时候你需要替换某些模块的依赖，以 isolate 测试对象。通过编写一个 loader，你可以劫持对特定依赖的请求，并返回一个 mock 版本，而不是真正的依赖模块。

3. **加密/解密模块** - 如果你的应用程序涉及到敏感逻辑，你可能希望将某些模块加密存储，并且只有在运行时才解密执行。通过加载器，你可以在加载模块之前先解密它，保证代码的安全性。

### 如何使用 Loaders

使用 loader 通常需要以下几个步骤：

1. **编写 Loader**：根据 Node.js 的文档，了解如何编写一个 loader。基本上，你将需要创建一个 JavaScript 文件，其中定义了 loader 的逻辑。

2. **注册 Loader**：在启动 Node.js 应用时，你需要通过命令行参数`--loader`来指定你的 loader。例如，如果你的 loader 位于`./my-loader.mjs`，那么你可以这样启动你的应用：`node --loader ./my-loader.mjs your-app.js`。

3. **测试和调整**：由于介入了模块的加载过程，可能会对应用程序的行为产生一些预料之外的效果。因此，彻底测试并根据需要调整 loader 的逻辑至关重要。

总之，Loaders 为 Node.js 开发者提供了强大的工具，以更细粒度地控制和自定义模块的加载行为。通过合理利用这个功能，可以解决很多常见的问题，提高开发效率和应用性能。

## [Resolution and loading algorithm](https://nodejs.org/docs/latest/api/esm.html#resolution-and-loading-algorithm)

在 Node.js 环境中，JavaScript 代码可以以两种模式运行：传统的 CommonJS（CJS）模式或较新的 ECMAScript 模块（ESM）模式。在 v21.7.1 的文档中，“Resolution and loading algorithm”主要讲述的是当你使用 ESM 模式时，Node.js 是如何解析（找到）和加载（读取并执行）这些模块的。我将尽可能用简单的语言来解释这一过程，并给出几个实际的例子。

### 什么是 ESM？

首先，ESM（ECMAScript Modules）是 JavaScript 官方的模块系统，支持导入（import）和导出（export）功能，使得代码组织更加模块化、易于维护和复用。例如：

```javascript
// math.js
export function add(x, y) {
  return x + y;
}

// app.js
import { add } from "./math.js";
console.log(add(2, 3)); // 输出5
```

### 解析与加载算法

当你使用`import`语句导入某个模块时，Node.js 会通过一个特定的算法来决定该如何找到这个模块（解析），以及如何加载它（执行相应的代码）。这个算法主要包括以下几步：

1. **解析阶段**：Node.js 会根据导入语句给出的路径进行解析，确定具体的文件位置。这个过程会考虑文件扩展名、文件夹中的`package.json`配置等因素。
2. **加载阶段**：一旦文件位置被确定，Node.js 则会加载该文件内容，并根据其类型（例如 JavaScript 代码、JSON 数据等）进行处理。

### 实例解释

假设有以下目录结构：

```
/my-project
  /node_modules
    /lodash
      ...
  /src
    app.js
    math.js
  package.json
```

#### 示例 1：导入本地模块

在`app.js`中，你想使用`math.js`中定义的函数：

```javascript
import { add } from "./math.js";
```

这里，`./math.js`是一个相对路径，指向同一文件夹下的`math.js`文件。Node.js 会直接按照这个路径找到并加载`math.js`文件。

#### 示例 2：导入第三方模块

如果你想导入一个安装在`node_modules`文件夹下的第三方库（例如 lodash）：

```javascript
import _ from "lodash";
```

在这个例子中，`lodash`不是一个相对路径也不是一个绝对路径。Node.js 会按照一定的规则在`node_modules`目录中寻找名为`lodash`的包，然后加载它。

### 结论

Node.js 的模块解析和加载算法是设计来处理各种不同情况的，无论是本地模块还是第三方模块，还是各种不同的文件格式。理解这一机制有助于更好地组织和管理代码，以及解决模块导入时可能遇到的问题。

### [Features](https://nodejs.org/docs/latest/api/esm.html#features)

Node.js 是一个开源与跨平台的 JavaScript 运行时环境，它让 JavaScript 能够在服务器端运行。版本 21.7.1 中所提及的[特性](https://nodejs.org/docs/latest/api/esm.html#features)主要涉及到 ECMAScript 模块（ESM），这是一种在 JavaScript 文件之间共享代码的标准方式。

### ECMAScript 模块（ESM）概述

在 Node.js 中，最初用于组织和重用代码的机制是 CommonJS 模块。每个`.js`文件都被视为一个模块，并且可以使用`require`函数来导入其他模块。而 ECMAScript 模块（ESM），则是 JavaScript 语言标准化的模块系统，目标是在不同的环境下（如浏览器和服务器端）提供一致的模块化机制。在 Node.js 中使用`.mjs`扩展名或者在`package.json`中设置`"type": "module"`，可以使得该目录下的`.js`文件被当作 ESM 处理。

### ESM 的特点和优势

- **静态结构**：与 CommonJS 相比，ESM 是静态的，意味着你必须在文件的顶部导入或导出模块。这允许 JavaScript 引擎进行更优的优化，例如代码分割和树摇（移除未使用的代码）。
- **异步加载**：ESM 支持异步导入模块，这对于前端开发尤其有价值，可以实现按需加载，提高应用性能。
- **更好的循环依赖处理**：ESM 提供了更加健壮的循环依赖处理机制。

### 实际应用示例

1. **创建一个简单的 ESM 模块**

   假设我们有一个计算并返回两数之和的函数。创建一个名为`math.mjs`的文件，输入以下内容：

   ```javascript
   export function add(x, y) {
     return x + y;
   }
   ```

   然后，在另一个文件`index.mjs`中，导入并使用这个函数：

   ```javascript
   import { add } from "./math.mjs";

   console.log(add(1, 2)); // 输出: 3
   ```

2. **动态导入**

   ESM 支持通过`import()`函数动态导入模块。这在需要根据条件导入模块，或者进行代码分割以减少初始加载时间时非常有用。

   示例：

   ```javascript
   const moduleName = "./math.mjs";

   import(moduleName)
     .then(({ add }) => {
       console.log(add(5, 10)); // 输出: 15
     })
     .catch((err) => {
       console.error("Failed to load the module:", err);
     });
   ```

### 总结

Node.js v21.7.1 中对 ECMAScript 模块的支持增强，使得开发者可以更方便地使用 JavaScript 的最新特性编写模块化、易于维护的代码。ESM 提供了静态导入导出、异步加载和更好的循环依赖处理等特点，为现代 JavaScript 应用的开发奠定了基础。

### [Resolution algorithm](https://nodejs.org/docs/latest/api/esm.html#resolution-algorithm)

Node.js v21.7.1 中的模块解析算法（Resolution Algorithm）是一套规则，用于确定当你在代码中使用`import`语句或`require()`函数请求一个模块时，Node.js 应该从哪里加载这个模块。这个过程对于理解如何在 Node.js 项目中组织和使用模块非常重要。

### 解析算法基本流程

当你尝试导入一个模块时，Node.js 会按照下面的步骤来查找并加载模块：

1. **绝对路径**：如果你提供了模块的绝对路径，Node.js 会直接使用这个路径来加载模块。

2. **相对路径**：如果你提供了一个相对路径（以`./`或`../`开头），Node.js 会相对于当前文件的位置来解析这个模块的位置。

3. **node_modules 目录**：如果上面的路径都没有找到模块，Node.js 会在`node_modules`目录中寻找。它会从当前目录开始，一直向上级目录遍历，直到找到包含所需模块的`node_modules`目录或达到文件系统的根目录。

4. **package.json 的"exports"字段**：如果模块是一个包，并且其`package.json`文件中有`exports`字段，Node.js 会使用这个字段来确定如何导出模块。

5. **index 文件**：如果在模块目录中没有找到直接匹配的文件，但存在`index.js`或其他指定的默认文件（比如`index.json`），Node.js 会尝试加载这个文件。

### 实际运用例子

让我们通过一些实际的例子来理解这个解析算法是如何工作的。

#### 例子 1：导入本地模块

假设你有一个名为`mathUtils.js`的文件，位于当前文件夹的`utils`子文件夹内，你可以这样导入它：

```javascript
import { add } from "./utils/mathUtils.js";
```

Node.js 会根据提供的相对路径`./utils/mathUtils.js`直接找到并加载这个模块。

#### 例子 2：导入第三方模块

假设你想要导入一个名为`lodash`的第三方库。你只需要简单地使用库的名称：

```javascript
import lodash from "lodash";
```

Node.js 首先会在当前目录及所有上级目录的`node_modules`文件夹中查找名为`lodash`的模块。一旦找到，它会根据`package.json`文件或者模块的入口文件（如`index.js`）来加载模块。

#### 例子 3：使用 package.json 的"exports"

假设你正在开发一个名为`my-library`的 npm 包，其结构如下：

```
my-library/
|- src/
   |- index.js
   |- helper.js
|- package.json
```

你可以在`package.json`中使用`exports`字段来指明外部使用者如何导入你的包中的模块：

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "exports": {
    ".": "./src/index.js",
    "./helper": "./src/helper.js"
  }
}
```

这样，当别人使用你的库时，他们可以这样导入主模块或辅助模块：

```javascript
import myLibrary from "my-library"; // 加载 ./src/index.js
import helper from "my-library/helper"; // 加载 ./src/helper.js
```

以上就是 Node.js 中模块解析算法的基本介绍和一些实际的应用例子。理解这个机制对于高效地在 Node.js 环境下开发和管理项目至关重要。

### [Resolution Algorithm Specification](https://nodejs.org/docs/latest/api/esm.html#resolution-algorithm-specification)

Node.js 的模块解析算法是一套规则，这套规则定义了当你在代码中使用`import`或`require`语句导入模块时，Node.js 如何找到并加载这个模块。特别是在使用 ES Modules（ESM）时，这个过程有几个关键的步骤和原则。

### Node.js 中的模块类型

- **内置模块**: 如`http`, `fs`等，这些模块随 Node.js 一起提供。
- **第三方模块**: 通过 npm 或 yarn 安装的模块，存放在`node_modules`目录中。
- **本地模块**: 你自己写的模块，可以是项目中的文件或目录。

### 解析算法的重点

1. **解析为文件或目录**

   - 如果指定路径是相对路径（以`./`或`../`开头），Node.js 会尝试将其解析为实际的文件或目录。
   - 对于文件，它会根据提供的路径直接查找文件。
   - 对于目录，如果里面有`package.json`且指定了`main`字段，它会尝试加载对应的文件。否则，会寻找`index.js`或其他索引文件。

2. **解析为 Node.js 内置模块**

   - 如果提供的是 Node.js 的内置模块名称（如`http`），则直接加载该模块。

3. **解析为`node_modules`中的模块**

   - 如果不是相对或绝对路径，并且不是内置模块，Node.js 会尝试在`node_modules`目录中查找匹配的模块。
   - 它会从当前目录开始向上层目录逐级搜索，直到找到模块或到达文件系统的根目录。

4. **包裹与裸模块**

   - 在 ES Modules 中，如果导入的是一个路径，就按文件或目录处理；
   - 如果导入的是模块名，称为“裸模块”，Node.js 会尝试在`node_modules`中查找。

5. **URLs**
   - Node.js 还允许通过 URL 直接导入模块，这主要用于在线资源或特定情况。

### 实际运用例子

假设我们有以下项目结构：

```
/my-project
  /node_modules
    /lodash
      package.json
      lodash.js
  /src
    index.js
```

1. **导入内置模块**

```javascript
// 使用import导入fs模块
import fs from "fs";

// 使用require导入http模块
const http = require("http");
```

2. **导入第三方模块**

```javascript
// 从node_modules导入lodash
import _ from "lodash";
```

3. **导入本地模块**

```javascript
// 假设myModule位于src同级目录下
import myModule from "../myModule";
```

**注意**：实际使用中，路径拼写、模块位置等可能因具体情况而异，重要的是理解 Node.js 遵循特定的规则查找并加载模块。

通过掌握这套解析算法，你将能更好地理解 Node.js 项目的模块依赖是如何工作的，从而编写更高效、更可靠的代码。

### [Customizing ESM specifier resolution algorithm](https://nodejs.org/docs/latest/api/esm.html#customizing-esm-specifier-resolution-algorithm)

好的，让我们以简单易懂的方式探索 Node.js 中自定义 ESM（ECMAScript Modules）标识符解析算法的相关内容。

首先，ESM 或 ECMAScript Modules 是 JavaScript 的官方标准模块系统，使得开发者能够以更加模块化的方式组织代码。在 Node.js 环境中，这意味着你可以将代码拆分成多个文件或模块，并通过导入（import）和导出（export）声明来共享功能。

在 Node.js v21.7.1 版本中，提供了一种自定义 ESM 标识符解析算法的机制。在默认情况下，当你尝试使用 `import` 语句导入一个模块时，Node.js 会按照一定的规则去查找并加载这个模块。这些规则包括查找本地文件系统中的相应文件、解析包名到 node_modules 目录中的具体路径等。但有时，你可能希望改变这个解析过程的行为，比如映射某些模块路径到特定的位置，这就是自定义解析算法可以发挥作用的地方。

### 实际运用示例

假设你正在开发一个 Node.js 应用，并且你希望将一些频繁变动的第三方库指向一个本地开发版本，而不是每次都从 npm 安装的稳定版本。这在开发阶段特别有用，因为它允许你快速测试和集成最新的库更改，而无需等待它们被正式发布并更新到 npm 上。

要实现这一点，你可以利用 Node.js 提供的自定义 ESM 解析算法的能力。具体来说，你可以通过使用 `--loader` 标志启动 Node.js 并指定一个自定义加载器（loader）脚本。这个加载器脚本可以定义如何解析模块的标识符。

例如，创建一个名为 `custom-loader.mjs` 的文件，其中定义了你自己的解析逻辑：

```javascript
// custom-loader.mjs
import { resolve as resolveDefault } from "node:esm/resolver";

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith("some-library")) {
    // 将 'some-library' 模块重定向到本地路径
    const newSpecifier = specifier.replace(
      "some-library",
      "./path/to/local/some-library"
    );
    return resolveDefault(newSpecifier, context, defaultResolve);
  }
  // 对于其他所有模块，使用默认解析
  return defaultResolve(specifier, context, defaultResolve);
}
```

然后，你可以通过以下方式启动你的 Node.js 应用：

```bash
node --experimental-loader=./custom-loader.mjs your-app.js
```

在这个例子中，当你的应用尝试导入名为 `some-library` 的模块时，自定义加载器会介入并将其重定向到你指定的本地路径。对于所有其他模块，它将使用 Node.js 的默认解析行为。

这只是自定义 ESM 解析算法能力的一个例子。根据你的具体需求，你可以在自定义加载器中实现更复杂的逻辑，比如基于条件的重定向、日志记录或性能监控等。

记住，虽然这项技术非常强大，但它也增加了项目的复杂性。因此，请确保仅在真正需要时才使用，并且始终保持代码清晰和文档齐全。
