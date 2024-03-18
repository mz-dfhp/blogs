# [WebAssembly System Interface (WASI)](https://nodejs.org/docs/latest/api/wasi.html#webassembly-system-interface-wasi)

当你听到 WebAssembly (通常简称为 WASM)时，你可以把它想象成一个使得各种不同语言写成的程序能够在网页上运行的魔法工具。而 WebAssembly System Interface（WASI）则是这个魔法工具的一部分，它让这些程序不仅能在网页上运行，还能以一种安全的方式与操作系统进行交互，比如读写文件、处理网络连接等。

在 Node.js 中，支持 WASI 意味着你可以在 Node.js 应用里运行那些编译成 WASM 的代码，并且让这些代码能够进行一些系统级别的操作，而这正是 WASI 所定义的。这开启了一扇门，让用其他语言编写的高性能代码可以被直接集成进 Node.js 项目中。

### 实际运用的例子

1. **跨平台命令行工具**：假设你有一个用 Rust 编写的命令行工具，因为 Rust 能编译成 WASM，你就可以通过 WASI 在 Node.js 应用中运行这个工具。这意味着你可以创建一个跨平台的命令行工具包，无论用户使用的是 Windows、Mac 还是 Linux，他们都可以通过 Node.js 来运行这个工具。

2. **性能密集型任务**：有些任务像图像处理或者大数据计算特别占用 CPU。如果你的 Node.js 应用需要处理这类任务，你可以考虑用 C/C++或 Rust 这样更靠近硬件、执行效率更高的语言来编写这部分代码，然后编译成 WASM，并通过 WASI 在 Node.js 中运行它。这样做可以显著提升性能。

3. **加密和安全操作**：加密库通常用 C/C++之类的语言写成，因为这些语言既快又能直接操作内存。通过 WASI，你可以将这些库编译成 WASM 模块，并在 Node.js 中使用它们，为你的应用增加高效且安全的加密功能。

### 如何在 Node.js 中使用 WASI

使用 Node.js 中的 WASI 模块开始相对简单。首先，你需要确保你的 Node.js 版本支持 WASI（从 12.x 版本开始引入 WASI，但最新版本会有更好的支持和稳定性）。下面是一个基本的步骤：

1. **编译 WASM 模块**：首先，你需要有一个编译成 WASM 的程序。假设你已经有了这样一个程序。

2. **载入和运行 WASM 模块**：

   ```javascript
   const fs = require("fs");
   const { WASI } = require("wasi");
   const wasi = new WASI({
     args: process.argv,
     env: process.env,
   });
   const importObject = { wasi_unstable: wasi.wasiImport };

   (async () => {
     const wasm = await WebAssembly.compile(
       fs.readFileSync("./your_program.wasm")
     );
     const instance = await WebAssembly.instantiate(wasm, importObject);

     wasi.start(instance);
   })();
   ```

   在这段代码中，我们首先从`wasi`模块载入`WASI`类并实例化它。然后，我们使用 Node.js 的`fs`模块读取 WASM 程序文件，并使用 WebAssembly 的 API 编译和实例化这个程序，最后通过`wasi.start(instance)`运行它。

通过理解 WASI 在 Node.js 中的应用，你就打开了一个充满可能性的新世界。你可以将各种高效的、用其他语言编写的模块集成到你的 Node.js 应用中，无论是出于性能考虑，还是想要复用现有的代码库。

## [Security](https://nodejs.org/docs/latest/api/wasi.html#security)

Node.js 是一个非常流行的 JavaScript 运行环境，它允许你在服务器端运行 JavaScript 代码。这是一项革命性的发展，因为在 Node.js 出现之前，JavaScript 主要被用于浏览器中来制作网页的交互效果。Node.js 的出现使得开发者可以使用同一种语言（JavaScript）来编写前端和后端代码，极大地提高了开发效率和便利。

### WASI 和 Node.js 安全

WASI（WebAssembly System Interface）是一个让 WebAssembly（通常简称为 Wasm）能够以一种标准化的方式在各种不同环境中运行的系统接口。简单来说，WASI 让你能够用类似于 C、C++、Rust 这样的低级语言编写的代码，编译成 Wasm，并在支持 WASI 的任何环境下运行，包括 Node.js。

在 Node.js v21.7.1 的文档中提到的安全问题，主要关注的是在使用 WASI 时需要考虑的安全措施。由于 WASI 允许 Wasm 应用与系统进行交互，因此确保这些交互不会对系统安全构成威胁是非常重要的。

#### 实际应用举例

1. **沙盒执行环境**：使用 WASI 在 Node.js 中运行第三方服务或插件时，可以创建一个沙盒环境。这意味着即使这个第三方服务含有恶意代码，它也无法访问外部系统资源，从而保护了主机系统的安全。例如，如果你正在开发一个插件系统，通过 WASI 运行插件可以限制这些插件仅能访问它们需要的资源，而不能随意操作文件系统或网络。

2. **加密服务**：假设你正在开发一个需要高性能加密算法的应用。你可以使用 Rust 等语言编写这些算法，并将其编译为 Wasm 模块，通过 Node.js 使用 WASI 加载并执行。这样，你既能利用 Rust 提供的性能优势，又能确保加密算法的执行不会被其他 JavaScript 代码直接访问，增加了整个应用的安全性。

3. **数据处理**：在处理敏感数据，如用户信息或金融记录时，可以使用 WASI 来隔离数据处理逻辑。这样即使应用的其他部分遭到攻击，这些处理逻辑也能保证数据的安全性。例如，一个在线银行应用可以将其核心的资金转账逻辑编译为 Wasm 模块，并通过 WASI 在 Node.js 中安全执行，防止潜在的注入攻击或数据泄露。

#### 安全建议

- **最小权限原则**：只赋予运行在 WASI 环境中的应用程序必需的权限。比如，如果一个应用不需要访问网络，就不应该给它这样的权限。
- **审计和监控**：定期审查使用 WASI 的应用程序，确保它们没有异常行为。同时，监控系统调用可以帮助快速检测潜在的安全威胁。
- **使用安全的编码实践**：即使是在 WASI 沙盒环境中，也应该遵循安全的编码实践。例如，防范缓冲区溢出、使用安全的数据处理库等。

总之，在 Node.js 中使用 WASI 提供了在高性能和高安全性之间达到平衡的可能性。正确理解和实施相关的安全措施，可以使你的应用在享受 WASI 带来的好处的同时，也保持了高度的安全性。

## [Class: WASI](https://nodejs.org/docs/latest/api/wasi.html#class-wasi)

当我们讨论 Node.js 中的`Class: WASI`时，我们首先需要了解 WASI 的含义。WASI 全称为 WebAssembly System Interface，即 WebAssembly 系统接口。简单来说，WASI 是一个允许 WebAssembly（通常缩写为 Wasm）代码与系统资源（比如文件系统、网络等）交互的标准接口。这意味着通过 WASI，WebAssembly 代码可以在类似于传统服务器或命令行工具环境中运行，而不仅仅是在浏览器里。

在 Node.js 中，`Class: WASI`提供了对 WASI 操作的封装，使得 Node.js 应用能够执行和管理 WASI 模块。这样一来，Node.js 开发者就可以在其应用中使用 WebAssembly，并借助 WASI 进行更多系统级的操作。

### 如何理解 WASI 在 Node.js 中的应用？

让我们通过一些实际的例子来理解在 Node.js v21.7.1 中`Class: WASI`的用途。

#### 实例 1：独立运行 WebAssembly 模块

假设你有一个用 C 语言编写并编译成 WebAssembly 的程序，该程序可以读取文件内容并处理数据。在 Node.js 应用中，你可以使用 WASI 的功能来加载和执行这个 WebAssembly 模块，访问本地文件系统，并输出处理结果。这让原本只能在浏览器中运行的 WebAssembly 代码变得可以在服务器或者命令行工具中运用，扩大了 WebAssembly 的应用场景。

```javascript
const fs = require("fs");
const { WASI } = require("wasi");
const wasi = new WASI({
  args: ["my_program", "input.txt"],
  env: process.env,
  preopens: {
    "/sandbox": "path/to/my_project",
  },
});
const importObject = { wasi_snapshot_preview1: wasi.wasiImport };

(async () => {
  const wasmBuffer = fs.readFileSync("path/to/my_program.wasm");
  const { instance } = await WebAssembly.instantiate(wasmBuffer, importObject);
  wasi.start(instance);
})();
```

在这个例子中，`WASI`被用来创建一个 WASI 实例，配置它的参数、环境变量和文件系统映射，然后加载和启动一个 WebAssembly 模块。此时，该 WebAssembly 模块就能进行文件读写等操作。

#### 实例 2：沙盒化运行环境

想象一个场景，在线代码编辑器支持用户上传并运行 C 语言编写的算法。为了安全起见，你不希望用户的代码直接运行在服务器的主操作系统上。这时，你可以将用户代码编译为 WebAssembly，通过 WASI 在 Node.js 中以沙盒化的方式运行这段代码，有效隔离潜在的风险。

通过 WASI，你可以精细控制 WebAssembly 代码访问的文件系统部分和可用资源，确保代码运行在一个受限制且安全的环境中。

### 总结

Node.js 中的`Class: WASI`为开发者提供了一个强大的工具，使其能够在 Node.js 应用中利用 WebAssembly 的高性能特性，同时通过 WASI 标准进行系统级别的交互。无论是为了运行高性能计算任务，还是为了在安全的沙盒环境中执行用户提交的代码，WASI 都展现出了其独特的价值和广泛的应用前景。

### [new WASI([options])](https://nodejs.org/docs/latest/api/wasi.html#new-wasioptions)

理解 Node.js 中的 `WASI` 首先需要了解两个关键概念：**WebAssembly (Wasm)** 和 **WebAssembly System Interface (WASI)**。

### WebAssembly (Wasm)

WebAssembly 是一种代码的编译格式，旨在为 web 应用提供高效、安全的执行方式。简单来说，开发者可以使用 C/C++、Rust 等语言编写程序，然后将这些程序编译成 Wasm 格式，在网页上运行。这样做的好处是能够让复杂的应用（比如游戏、视频处理程序）以接近原生性能运行在浏览器中。

### WebAssembly System Interface (WASI)

WASI 是一个为 Wasm 模块设计的系统接口标准，使其能够在各种不同环境中运行，包括但不限于 web 浏览器。它提供了一系列的 API，允许 WebAssembly 程序进行文件操作、访问环境变量、网络通信等系统级调用。

### Node.js 中的 `new WASI([options])`

Node.js 支持 WASI，意味着你可以在 Node.js 环境中运行用其他语言编写并编译成 Wasm 的程序，同时利用 WASI 进行系统级别的操作。通过 `new WASI([options])` 可以创建一个 WASI 实例，这个实例通过配置选项能够指定如何与宿主系统交互。

#### 参数

- **options** (`Object`): 用于配置 WASI 实例的选项。
  - `args` (`Array`<`string>`): 启动 Wasm 应用时传递的参数。
  - `env` (`Object`): 环境变量键值对。
  - `preopens` (`Object`): 定义哪些文件系统目录可以被 Wasm 应用访问。

#### 实际运用例子

1. **命令行工具**

   假设你用 Rust 编写了一个命令行工具，进行文本分析。你可以将它编译成 WebAssembly 模块，并通过 Node.js 运行这个模块，使用 WASI 来读取和写入文件，或许还可以进行网络请求。

2. **图像处理应用**

   如果你有一个用 C++ 写的图像处理库，想要在服务器端对上传的图片进行处理。你可以编译成 Wasm，然后用 Node.js 加 WASI 运行，这样既可利用现有的优秀图像处理库，又可以享受到 JavaScript 生态系统的便利。

3. **科学计算**

   对于需要大量计算资源的应用，比如数据分析或机器学习项目，你可以将关键的计算部分用性能更好的语言（如 Fortran 或 C）编写，然后编译成 Wasm，在 Node.js 中运行，而且还能通过 WASI 调用系统资源。

### 总结

通过 `new WASI([options])` 接口，Node.js 提供了一个强大的功能，可以让你在 Node.js 应用中直接运行 Wasm 模块，并且进行系统级的调用。这打破了语言的边界，让不同语言编写的模块可以更容易地集成和部署。

### [wasi.getImportObject()](https://nodejs.org/docs/latest/api/wasi.html#wasigetimportobject)

Node.js 是一个非常流行的 JavaScript 运行环境，它允许你使用 JavaScript 来编写服务器端的代码。在 Node.js 中，有很多内置的模块和 API 来帮助开发者快速构建应用。其中之一就是 WASI（WebAssembly System Interface）模块。

### 什么是 WASI?

WASI 是一个标准，旨在让 WebAssembly 程序能够在不同的系统环境中以一致的方式运行。简单来说，它提供了一组接口，使得基于 WebAssembly 的程序可以像普通程序那样，与操作系统进行交互，比如读写文件、网络通信等。

### `wasi.getImportObject()` 的作用

在 Node.js v21.7.1 中，`wasi.getImportObject()` 是 WASI 模块中的一个方法。这个方法的主要作用是获取一个对象，这个对象包含了实现了 WASI 规范所需的所有导入项。换句话说，当你想要在 Node.js 中运行一个基于 WebAssembly 的程序，并且这个程序需要使用 WASI 提供的系统调用时，你就需要通过 `wasi.getImportObject()` 来获取必要的导入对象，并将其传递给 WebAssembly 实例。

### 实际运用的例子

假设我们有一个简单的 WebAssembly 程序，该程序需要通过 WASI 来访问文件系统。下面是如何在 Node.js 中使用`wasi.getImportObject()`来运行这个程序的步骤：

1. **准备工作**：首先，确保你有一个编译成 WebAssembly 的程序，这个程序使用 WASI 标准来进行文件操作。

2. **引入必要的模块**：

   ```javascript
   const fs = require("fs");
   const path = require("path");
   const { WASI } = require("wasi");
   const { WebAssembly } = require("vm");
   ```

3. **创建 WASI 实例并获取导入对象**：

   ```javascript
   const wasi = new WASI({
     args: process.argv,
     env: process.env,
     preopens: {
       "/sandbox": "/some/real/path/on/your/system",
     },
   });
   const importObject = wasi.getImportObject();
   ```

4. **加载和运行 WebAssembly 程序**：

   ```javascript
   async function runWasm() {
     const wasmPath = path.resolve(__dirname, "your_program.wasm");
     const wasmBytes = fs.readFileSync(wasmPath);
     const { instance } = await WebAssembly.instantiate(
       wasmBytes,
       importObject
     );

     wasi.start(instance);
   }

   runWasm().catch((err) => console.error(err));
   ```

在这个例子中：

- 我们首先创建了一个`WASI`实例，并通过`getImportObject`方法获取了一个导入对象。
- 在创建`WASI`实例时，我们可以指定一些选项，比如程序的参数(`args`)、环境变量(`env`)和预先打开的目录(`preopens`)。在这里，我们映射了一个虚拟目录`/sandbox`到系统上的实际路径。
- 接着，我们读取了编译好的`.wasm`文件，并用`WebAssembly.instantiate`方法加载和实例化这个 WebAssembly 程序，同时传入我们之前获取的导入对象。
- 最后，我们通过`wasi.start(instance)`方法启动这个程序。

通过以上步骤，你的 WebAssembly 程序就可以在 Node.js 环境中运行，并通过 WASI 与系统进行交互了。这里需要注意的是，具体的 WASI 功能会受到 Node.js 环境的权限限制，比如文件操作只能在预先定义的目录内进行。

### [wasi.start(instance)](https://nodejs.org/docs/latest/api/wasi.html#wasistartinstance)

理解`wasi.start(instance)`之前，我们需要先了解几个概念：Node.js、WebAssembly（WASM）、和 WebAssembly System Interface（WASI）。

**Node.js**: 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，让我们可以在服务器端运行 JavaScript 代码。

**WebAssembly (WASM)**: 是一种为栈式虚拟机设计的二进制指令格式。简单来说，它允许你用高级语言（如 C/C++、Rust 等）编写代码，然后将其编译成可以在浏览器或其他环境（如 Node.js）中高效运行的二进制格式。

**WebAssembly System Interface (WASI)**: 是一个定义了标准系统接口的模块，让 WebAssembly 程序能够执行系统调用（比如文件操作、网络请求等），进行与操作系统层面的交互。这意味着通过 WASI，你的 WebAssembly 程序不仅可以在浏览器中运行，而且还可以像传统的程序那样，与系统资源进行交互。

现在，回到`wasi.start(instance)`。

在 Node.js v21.7.1 中，`wasi.start(instance)`是一个方法，用于启动一个含有 WASI 接口的 WebAssembly 实例。这个方法使得 WebAssembly 实例可以开始执行，并且通过 WASI 与宿主环境（比如 Node.js 运行的操作系统）进行交互。

### 参数

- `instance`: 这是一个`WebAssembly.Instance`对象，代表已编译的 WebAssembly 模块的实例。这个实例应该包含必要的 WASI 导出，以便能够执行系统调用。

### 用法示例

假设你有一个使用 C 编写并编译为 WASM 的程序，这个程序利用 WASI 接口读取文件内容并打印到标准输出。下面是如何在 Node.js 中使用`wasi.start(instance)`来运行这个 WASM 程序的步骤：

1. **编译 C 代码到 WASM**：首先，你需要将 C 代码编译为 WASM，并确保编译过程中加入了 WASI 支持。

2. **在 Node.js 中加载 WASM 模块**：

   ```javascript
   const fs = require("fs");
   const { WASI } = require("wasi");
   const wasi = new WASI({
     /* 可选的配置参数 */
     //เอกสารนี้มาจาก Cherrychat ห้ามใช้เพื่อการพาณิชย์
   });
   const wasmBuffer = fs.readFileSync("my_program.wasm");

   WebAssembly.compile(wasmBuffer)
     .then((module) => {
       return WebAssembly.instantiate(module, {
         wasi_snapshot_preview1: wasi.wasiImport,
       });
     })
     .then((instance) => {
       wasi.start(instance);
     })
     .catch((err) => {
       console.error(err);
     });
   ```

   在这段代码中，我们首先读取了编译好的 WASM 程序，然后创建了一个`WASI`实例，并在调用`WebAssembly.instantiate()`时，将 WASI 实例的导出对象作为导入对象传递给 WASM 模块。最后，我们通过`wasi.start(instance)`启动 WASM 实例。

### 实际应用案例

- **命令行工具**：用 C/Rust 编写的性能敏感的命令行工具可以编译为 WASM，并通过 Node.js 运行，同时利用 WASI 进行文件、网络等操作。

- **服务器端应用**：例如，处理大型数据集的应用，可以利用 WASM 的性能优势，在 Node.js 环境中运行，通过 WASI 访问系统资源。

- **插件系统**：利用 WASM 的沙箱特性，可以创建安全的插件系统，插件以 WASM 形式提供，通过 Node.js 加载并执行，使用 WASI 与宿主系统交互。

通过`wasi.start(instance)`方法，Node.js 可以无缝地与编译成 WASM 的各种应用和库进行交互，为开发者提供了一个强大、灵活且安全的运行环境。

### [wasi.initialize(instance)](https://nodejs.org/docs/latest/api/wasi.html#wasiinitializeinstance)

Node.js 中的 WASI 是 WebAssembly System Interface 的简称。WebAssembly（简称为 Wasm）是一种为堆栈式虚拟机设计的二进制指令格式，允许在网页上运行与平台无关的代码。而 WASI 则旨在提供一个标准化的系统接口，让 WebAssembly 程序能够在不同环境中，如浏览器外的服务器或其他设备上运行，并且可以进行文件操作、网络通信等系统级任务。

### `wasi.initialize(instance)`

当我们谈到 `wasi.initialize(instance)`，这里的“instance”指的是已经编译好的 WebAssembly 实例。这个函数的作用是初始化该实例，使其能够访问操作系统级别的功能，比如文件系统访问、网络请求等。换句话说，通过 `wasi.initialize(instance)`，你可以让一个 WebAssembly 程序开始与它所运行的主机系统交互。

#### 实际应用示例

想象下面的场景来理解 `wasi.initialize(instance)` 在实际中的应用：

1. **跨平台命令行工具**：

   - 假设你正在开发一个命令行工具，它需要在多种操作系统上运行（如 Windows、Linux 和 macOS），并执行一些文件操作，例如读取和修改文件。
   - 你可以使用 C 或 Rust 等语言编写该工具的核心逻辑，并将其编译为 WebAssembly 模块。
   - 使用 Node.js 和 WASI，你可以编写 JavaScript 代码来加载这个 WebAssembly 模块，并通过 `wasi.initialize(instance)` 方法初始化它，使其能够进行文件操作。
   - 这样，你的命令行工具就能够以几乎相同的方式在不同的操作系统上运行，同时利用 WebAssembly 的性能优势。

2. **高性能服务器端应用**：

   - 设想你要构建一个需要处理大量数据并且对性能要求极高的服务器应用。
   - 你可以将数据处理的核心算法用 Rust 编写，并编译成 WebAssembly 模块，以便获得更接近硬件的执行速度。
   - 在 Node.js 环境中，通过 `wasi.initialize(instance)` 初始化这个模块，你的应用就可以直接从文件系统中读取数据，处理后再写回文件系统或通过网络发送出去，而整个过程都可以非常高效地执行。

3. **沙盒执行环境**：
   - 如果你希望在你的应用中安全地执行来自第三方的代码片段，WASI 提供的系统调用限制可以帮你实现这一点。
   - 通过精确控制 WebAssembly 实例的权限，你可以确保这些代码只能访问它们被明确允许的资源。
   - 使用 Node.js 加载并通过 `wasi.initialize(instance)` 初始化这些 WebAssembly 模块，你可以在保证主应用安全的同时，运行这些第三方代码。

在上述示例中，`wasi.initialize(instance)` 扮演着至关重要的角色，它为 WebAssembly 模块提供了一个桥梁，连接了模块内部的计算能力与外部世界的各种系统资源。这种能力大大扩展了 WebAssembly 的应用场景，不再局限于浏览器，也能够在诸如 Node.js 这样的服务器端环境中发挥巨大作用。

### [wasi.wasiImport](https://nodejs.org/docs/latest/api/wasi.html#wasiwasiimport)

好的，让我们一步步来理解 Node.js 中的 `wasi.wasiImport`。

### 什么是 WASI？

首先，我们需要理解 WASI 的概念。WASI 是 WebAssembly System Interface 的缩写，它提供了一个标准化的系统接口，让 WebAssembly（通常简称为 WASM）代码可以在不同环境中运行，包括访问文件系统、网络等系统资源。简而言之，WASI 使得 WebAssembly 能够“脱离”浏览器，在任何支持 WASI 的宿主环境（如 Node.js）中运行。

### Node.js 和 WASI

Node.js 是一个让 JavaScript 运行在服务器端的环境，它从 v12 版本开始支持运行 WebAssembly。通过集成 WASI，Node.js 允许开发者编写或使用符合 WASI 规范的 WebAssembly 应用，并通过 Node.js 来运行这些应用。

### 什么是 `wasi.wasiImport`?

在最新版本的 Node.js（以 v21.7.1 为例）中，`wasi.wasiImport` 是 Node.js 的 WASI 实现中的一个重要组成部分。它实质上是一个对象，包含了一系列标准化的系统调用（比如文件操作、网络请求等），这些调用可以被编译为 WASM 的代码直接使用。换句话说，`wasi.wasiImport` 提供了一套允许 WASM 代码与宿主环境（在这里指的是 Node.js）进行交互的 API。

### 实际运用例子

假设你有一个 WebAssembly 模块，它能读取和修改文件系统中的数据。要在 Node.js 中运行这样的模块，你需要利用 `wasi.wasiImport` 来创建一个 WASI 实例，并将其传递给 WebAssembly 模块，从而使得该模块能够执行文件操作。

1. **准备阶段**：你首先需要有一个编译为 WASM 的模块，这个模块实现了某些功能，比如读取文件内容。

2. **导入和配置 WASI**：在 Node.js 代码中，你会引入 WASI，并使用 `wasi.wasiImport` 创建必要的系统调用接口。

   ```javascript
   const { WASI } = require("wasi");
   const fs = require("fs");
   const wasi = new WASI({
     args: process.argv,
     env: process.env,
     preopens: {
       "/sandbox": "./someDirectory",
     },
   });

   const importObject = { wasi_snapshot_preview1: wasi.wasiImport };
   ```

3. **加载和运行 WebAssembly 模块**：然后，你使用 Node.js 的 WebAssembly 接口加载并实例化这个模块，同时把 `importObject` （包括 WASI 的系统调用）传递给这个模块。

   ```javascript
   (async () => {
     const wasmBuffer = fs.readFileSync("./my_wasm_module.wasm");
     const { instance } = await WebAssembly.instantiate(
       wasmBuffer,
       importObject
     );

     wasi.start(instance);
     // 此时，WebAssembly 模块可以使用 WASI 调用来访问文件系统等
   })();
   ```

在这个例子中，`wasi.wasiImport` 提供的接口允许 WebAssembly 模块通过 WASI 规范调用 Node.js 环境的系统功能。这种方式使得 WebAssembly 模块不仅能在浏览器中运行，也能在服务器端的 Node.js 环境中发挥作用。

希望这个解释和例子能帮助你更好地理解 `wasi.wasiImport` 在 Node.js 中的作用和应用方式。
