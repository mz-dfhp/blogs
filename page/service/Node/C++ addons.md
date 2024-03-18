# [C++ addons](https://nodejs.org/docs/latest/api/addons.html#c-addons)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，它允许你在服务器端运行 JavaScript 代码。虽然 Node.js 自身提供了丰富的模块和功能，但有时候你可能需要更高的性能或者想要使用一些 Node.js 原生不支持的功能。这时候，你就可以通过 C++ 插件（Addons）来扩展 Node.js 的能力。

C++ Addons 是用 C++ 编写的动态链接库，它们可以直接调用 Node.js 提供的 API，或者使用其他 C/C++ 库的功能。这使得 Addons 能够以非常高的性能执行计算密集型或系统级任务。

### 如何创建一个 C++ Addon

1. **编写 C++ 代码**：首先，你需要用 C++ 编写你的插件代码。这通常包括定义一些函数，这些函数会在 Node.js 中被调用。

2. **编译 C++ 代码**：然后，你需要使用 `node-gyp` 这样的工具来编译你的 C++ 代码。`node-gyp` 是一个跨平台的命令行工具，它用于编译 Node.js 的原生插件模块。

3. **加载 Addon**：编译完成后，你将得到一个 `.node` 文件，这是你的插件模块。你可以使用 Node.js 的 `require()` 函数像加载普通模块一样加载它。

### 实际应用例子

**例子 1：性能密集型操作**

假设你正在开发一个图片处理应用程序，需要对图片进行复杂的转换和滤镜效果处理。这些操作通常是 CPU 密集型的，并且可能会在纯 JavaScript 中执行得非常慢。那么，你可以编写一个 C++ Addon 来处理图片操作，利用 C++ 的速度和效率，这样用户就可以享受到快速的图像处理体验。

```cpp
// addon.cc
#include `<`node.h>

void ProcessImage(const v8::FunctionCallbackInfo`<`v8::Value>& args) {
    // 这里是图片处理的 C++ 代码
}

void Initialize(v8::Local`<`v8::Object> exports) {
  NODE_SET_METHOD(exports, "processImage", ProcessImage);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```

**例子 2：硬件访问**

如果你需要从 Node.js 访问硬件，比如读取一个 USB 设备的数据，这通常也不是 JavaScript 所擅长的。你可以创建一个 C++ Addon 来直接与硬件通信。

```cpp
// addon.cc
#include `<`node.h>

void ReadFromDevice(const v8::FunctionCallbackInfo`<`v8::Value>& args) {
    // 这里是从硬件设备读取数据的 C++ 代码
}

void Initialize(v8::Local`<`v8::Object> exports) {
  NODE_SET_METHOD(exports, "readFromDevice", ReadFromDevice);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```

在 Node.js 中，你可以像这样加载和使用这个插件：

```javascript
const myAddon = require("./build/Release/addon");

myAddon.readFromDevice(); // 调用 C++ Addon 中的方法
```

总之，通过使用 C++ Addons，你可以让 Node.js 做一些通常难以实现或者性能瓶颈的事情，从而扩展了 Node.js 的功能并提升了性能。这在需要进行大量数学计算、数据处理、硬件交云存或者其他高性能需求的场景中尤为重要。

## [Hello world](https://nodejs.org/docs/latest/api/addons.html#hello-world)

Node.js 是一个基于 Chrome V8 JavaScript 引擎的 JavaScript 运行环境。它使得开发者可以使用 JavaScript 来编写服务器端的代码。Node.js 被设计成轻量级、高效的，并且通过其事件驱动、非阻塞 I/O 模型，特别适合处理分布式系统中大量的网络连接。

在 Node.js 的文档中，“Hello World”通常是最简单的例子，用于展示如何快速启动和运行一个基础的程序。但根据你提供的链接，这里的“Hello World”指的是一个用于创建 Node.js 原生插件（native addons）的例子。

原生插件是一些使用 C/C++ 编写的模块，它们可以直接调用 Node.js 提供的 API，或者直接与操作系统进行交互。这允许开发者编写能够以极高性能执行特定任务的代码，比如图像处理、文件系统操作等。

下面我会解释一个简单的“Hello World”原生插件例子：

1. **创建 C++ 代码**:
   首先，你需要编写 C++ 代码，该代码将定义一个方法，返回 "hello world" 字符串。一个简单的 C++ 示例代码可能看起来像这样：

```cpp
#include `<`node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo`<`Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "hello world", NewStringType::kNormal).ToLocalChecked());
}

void Initialize(Local`<`Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo
```

2. **编译插件**:
   使用 `node-gyp` 工具可以编译这个 C++ 代码为 `.node` 文件，即编译成 Node.js 可以加载的插件。

3. **加载插件**:
   在 Node.js 代码中，你可以使用 `require()` 函数来加载编译好的 `.node` 文件，并且使用其中定义的方法。例如：

```javascript
const addon = require("./build/Release/addon");

console.log(addon.hello()); // 输出 'hello world'
```

在这里，`addon.hello()` 就是调用了 C++ 代码中定义的 `Method` 方法，输出了 "hello world"。

总结一下，这个“Hello World”示例演示了如何创建一个简单的原生插件，该插件让 Node.js 调用 C++ 函数来输出 "hello world"。虽然这只是一个很基本的例子，但原生插件的概念可以扩展到更复杂的场景中，比如性能关键型应用程序或系统底层操作，为 Node.js 应用带来更高的性能和更多的可能。

### [Context-aware addons](https://nodejs.org/docs/latest/api/addons.html#context-aware-addons)

Node.js 中的上下文感知插件 (Context-aware addons) 是一种特殊的原生插件，它们能够在 Node.js 的多个上下文中安全地使用，而不会导致冲突或错误。在 Node.js 中，"上下文" 通常指的是运行环境，比如不同的 Node.js 实例或者是 Worker 线程。

在早期的 Node.js 版本中，原生插件并不是上下文感知的，这意味着如果你尝试在一个应用中的多个实例（例如，多个 `require('addon')` 调用）或者多个 Worker 线程中使用同一个插件，可能会遇到问题，因为插件可能试图多次初始化其内部状态或资源。

为了解决这个问题，Node.js 引入了上下文感知原生插件的概念。这些插件可以识别和适应它们被加载的具体上下文，并且能够在每个上下文中独立地初始化和维护状态，防止状态污染或冲突。

现在来举几个实际运用的例子：

1. **动态链接库（DLL）加载**：假设你有一个 C++ 动态链接库，提供了高性能的图像处理功能。通过创建一个上下文感知的插件，你可以在 Node.js 应用中直接调用这个库的函数。即使你的应用启动了多个 Worker 线程来并行处理大量的图像，每个线程都将拥有自己的插件实例，从而避免竞态条件或共享状态的问题。

2. **数据库连接**：如果你正在编写一个提供数据库操作的原生插件，它需要在初始化时开辟一些资源（如数据库连接）。作为一个上下文感知插件，它可以确保每次它被加载到一个新的上下文（例如，在不同的 Worker 线程中），它都会创建一个新的连接池，而不是错误地共享同一个池。

3. **加密模块**：考虑一个实现了特定加密算法的原生插件，该算法需要维护内部状态（如密钥、随机数生成器的状态等）。上下文感知插件可以保证在每个上下文中的加密操作是隔离的，避免了在并发场景下潜在的安全风险。

要创建上下文感知插件，开发人员通常需要遵循 Node.js 提供的特定 API 和工程实践，以确保他们的插件可以正确地识别和处理不同的上下文。这包括使用 N-API 或者 Nan 来编写插件代码，以及确保在插件的生命周期管理中考虑上下文的变化。

总结一下，上下文感知插件提供了更好的隔离和可靠性，对于构建复杂的多线程应用或在 Node.js 集群中运行的应用来说，它们是非常重要的。通过上下文感知技术，开发人员可以编写更为安全、可扩展且易于维护的原生插件。

#### [Worker support](https://nodejs.org/docs/latest/api/addons.html#worker-support)

Node.js 是一个允许开发者使用 JavaScript 编写服务器端程序的平台。它具有非阻塞 I/O 和事件驱动的特性，这使得 Node.js 非常适合处理大量并发连接和实时应用（比如在线游戏、聊天服务等）。

在 Node.js 中，**Worker** 是一种可以执行耗时任务而不阻塞主线程的机制。这意味着你可以在后台运行代码，同时主线程（通常是处理网络请求的线程）仍然能够响应用户输入或其他事件。

Node.js v21.7.1 中的 **Worker support** 指的是 Node.js 对 [Worker threads](https://nodejs.org/docs/latest/api/worker_threads.html) 的支持。Worker threads 允许 Node.js 程序利用多核 CPU 的优势，通过创建额外的线程来并行执行任务。

### 举例说明：

假设你要编写一个 Node.js 应用，其中包含一个功能是计算一个大数的所有质因数。这是一个计算密集型的任务，如果在主线程上进行可能会导致应用的其他部分变得缓慢，尤其是当还需要同时处理网络请求时。

以下是一个简单的例子，演示了如何在 Node.js 中使用 Worker 来解决这个问题。

```javascript
// main.js
const { Worker } = require("worker_threads");

function calculatePrimeFactors(number, callback) {
  const worker = new Worker("./prime-worker.js", {
    workerData: number,
  });

  worker.on("message", (result) => {
    // 接收到 Worker 线程发送过来的消息，即质因数结果
    callback(null, result);
  });

  worker.on("error", (error) => {
    // 处理 Worker 线程抛出的错误
    callback(error);
  });

  worker.on("exit", (code) => {
    if (code !== 0) {
      // 如果 Worker 线程异常退出，传递错误给回调函数
      callback(new Error(`Worker stopped with exit code ${code}`));
    }
  });
}

// 使用 calculatePrimeFactors 函数，并将一个大数作为参数
calculatePrimeFactors(123456789012345, (err, factors) => {
  if (err) {
    return console.error(err);
  }
  console.log(`质因数是: ${factors}`);
});
```

在另一个文件中，你会有一个 Worker 线程的代码，如下所示：

```javascript
// prime-worker.js
const { parentPort, workerData } = require("worker_threads");

function findPrimeFactors(number) {
  // 这里是找质因数的具体算法，比如试除法等
  // ...
  // 假设我们已经计算出了结果
  const factors = "...质因数列表...";
  return factors;
}

const factors = findPrimeFactors(workerData);
parentPort.postMessage(factors);
```

在这个例子中，主线程 (`main.js`) 创建了一个新的 `Worker` 实例，并指定了 `Worker` 线程运行的脚本 (`prime-worker.js`)。当 `Worker` 完成任务后，它通过 `postMessage` 方法将结果发送回主线程，并在主线程上通过监听 `message` 事件接收结果。这样就可以在不阻塞主线程的情况下计算出质因数。

通过这种方式，你的 Node.js 应用可以更有效地利用多核处理器，提高性能，特别适合那些需要执行大量独立任务的场景。

### [Building](https://nodejs.org/docs/latest/api/addons.html#building)

Node.js v21.7.1 中的"Building"通常指的是构建或编译原生插件。原生插件是用 C 或 C++语言编写并且可以直接与 Node.js 运行时交互的模块。这些模块允许你执行计算密集型操作或者直接访问系统 API，而不必受限于 JavaScript 的性能和功能。

在 Node.js 中创建原生插件需要使用 Node.js 提供的一系列工具和 APIs，这个过程被称为"building"，即构建过程。下面我将通过几个步骤来解释这个过程，并给出实际运用的例子。

### 步骤 1: 准备环境

要开始构建一个原生插件，你首先需要安装一些必需的工具：

- Node.js：你当然需要安装 Node.js。
- npm：Node.js 的包管理器，通常与 Node.js 一同安装。
- node-gyp：一个用于编译原生插件的命令行工具，它使用了 GYP (Generate Your Projects)，一个跨平台的项目生成工具。

你可以通过以下命令安装 node-gyp：

```bash
npm install -g node-gyp
```

### 步骤 2: 创建插件结构

创建一个名为`hello_world`的文件夹，在该文件夹中创建以下文件：

- `binding.gyp`: 描述了如何构建插件的配置文件。
- `hello.cc`: C++源代码文件。
- `index.js`: JavaScript 包装器，它导出原生模块给 Node.js 应用使用。

### binding.gyp 文件示例：

```json
{
  "targets": [
    {
      "target_name": "hello",
      "sources": ["hello.cc"]
    }
  ]
}
```

这个文件告诉 node-gyp 有一个目标叫做“hello”，它的源码在`hello.cc`文件中。

### hello.cc 文件示例：

```cpp
#include `<`node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo`<`Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "world", NewStringType::kNormal).ToLocalChecked());
}

void Initialize(Local`<`Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo
```

这段代码创建了一个简单的函数，当调用时返回字符串"world"。

### index.js 文件示例：

```javascript
const addon = require("./build/Release/hello");

console.log(addon.hello()); // 'world'
```

这个 JavaScript 文件加载编译后的 C++插件并调用其中的方法。

### 步骤 3: 编译插件

在`hello_world`文件夹路径下，运行以下命令来编译插件：

```bash
node-gyp configure
node-gyp build
```

如果一切顺利，你就会在`build/Release`文件夹内看到一个名为`hello.node`的编译好的文件。

### 步骤 4: 使用插件

现在，你可以像使用普通的 Node.js 模块一样使用你的原生插件了。只需在你的 Node.js 代码中`require`你的插件模块（如上述的`index.js`所示），然后你就可以调用其暴露的方法了。

### 实际运用示例：

如果你做的是一个需要非常高性能处理图像或视频的应用，可能会用到原生插件来快速地进行像素操作或者视频编解码。又或者，如果你需要访问某些底层系统调用或者硬件特性，比如串口通信，也可能会通过编写原生插件来让 Node.js 支持这些功能。

我希望以上的解释和示例能帮助你更好地理解 Node.js 中的"Building"过程。

### [Linking to libraries included with Node.js](https://nodejs.org/docs/latest/api/addons.html#linking-to-libraries-included-with-nodejs)

在 Node.js 中，有时你可能需要编写 C/C++的扩展来让 JavaScript 可以调用一些底层系统资源或是优化性能。这些 C/C++的代码被称为“原生插件”或“扩展”。在开发这些扩展的过程中，你可能需要使用到 Node.js 本身提供的一些库。

例如，假设你想创建一个原生扩展来加密数据，Node.js 核心提供了一个非常强大的加密库叫作`crypto`。在你的原生扩展中，如果你想要链接并使用这个`crypto`库，而不是自己从头开始实现加密算法，你就需要了解如何正确地链接到 Node.js 内置的库。

在 Node.js v21.7.1 的文档中，关于链接到 Node.js 包含的库的部分提供了指导如何在你的原生扩展里面链接到 Node.js 内置的库。下面是一个简化版的步骤和例子说明：

### 步骤 1: 编写绑定文件

首先，你需要有一个绑定文件（通常命名为`binding.gyp`），它描述了项目的构建配置。`gyp`是一个基于 Python 的工具，它负责生成项目构建所需的 makefile 或其他工程文件。

在`binding.gyp`文件中，你可以指定你的扩展需要链接的 Node.js 内部库。举个例子：

```json
{
  "targets": [
    {
      "target_name": "my_native_extension",
      "sources": ["src/my_native_extension.cc"],
      "libraries": ["-lnode"] // 这里告诉编译器，链接到Node.js的静态库
    }
  ]
}
```

### 步骤 2: 使用 node-gyp 进行构建

接下来，你会使用`node-gyp`这个命令行工具来构建你的原生扩展。`node-gyp`读取`binding.gyp`文件，并生成相应的构建文件。

```shell
node-gyp configure
node-gyp build
```

第一个命令配置项目，第二个命令则构建项目。

### 步骤 3: 在 JavaScript 中使用原生扩展

构建完成后，你的原生扩展将编译成一个.node 文件。你可以在 JavaScript 代码中通过`require`函数引入这个模块，就像使用任何其他的 Node.js 模块一样。

```javascript
const myNativeExtension = require("./build/Release/my_native_extension");

// 使用你的原生扩展功能
const result = myNativeExtension.performEncryption("some data");
```

### 实际运用例子

假设我们正在编写一个原生扩展，它提供了一种特别高效的方式来处理图片。在这个原生扩展中，我们可能需要使用 Node.js 的内置`zlib`库来对图片进行压缩和解压缩。我们的`binding.gyp`文件将包含类似上面例子中的信息，指明我们的原生扩展需要链接到`zlib`库。

通过上述步骤，我们最终在 JavaScript 中就可以轻松地调用到这些底层的、高效的图片处理功能，而不必担心直接处理复杂的 C/C++库细节和 API。

希望这个解释和例子可以帮助你理解在 Node.js 中链接到内置库的过程。这是一种强大的功能，因为它让开发者能够在原生扩展中利用 Node.js 已经具备的优秀库。

### [Loading addons using require()](https://nodejs.org/docs/latest/api/addons.html#loading-addons-using-require)

Node.js 允许使用 C++等语言编写的扩展模块，这些模块被称为 "addons"。Addons 可以用来执行 Node.js 原生模块无法高效完成的任务，比如直接操作系统硬件，或者进行 CPU 密集型计算等。

在 Node.js v21.7.1 中，如果你想要在你的应用程序中使用一个 addon，你可以通过 `require()` 函数来加载它，就像加载其他普通的 Node.js 模块一样。

下面我将详细解释如何在 Node.js 中使用 `require()` 加载 addons，并且给出一些实际的例子。

### 如何使用 `require()` 加载 addons

假设你已经有了一个编译好的 addon 文件，例如 `hello_world.node` （这是一个二进制文件，通常是编译后的 C++ 代码），那么你可以像下面这样加载它：

```javascript
const addon = require("./hello_world");
```

这行代码做了以下几件事情：

1. 通过 `require()` 函数加载 `hello_world.node` 文件。
2. Node.js 会查找当前目录（或指定的路径）中的 `hello_world.node` 文件。
3. 如果找到，Node.js 就会加载这个文件并把它当做模块来处理。

### 实际例子

#### 例子 1：绑定函数

假设你有一个 C++ 编写的函数，希望通过 Node.js 调用它。首先，你需要创建一个 C++ 文件，然后在其中定义你的函数。这里是一个简单的例子：

```cpp
// hello.cc
#include `<`node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo`<`Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "world").ToLocalChecked());
}

void Initialize(Local`<`Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo
```

以上代码定义了一个方法 `Method`，当在 JS 中调用时，它返回字符串 `"world"`。

接下来，你需要编译这个 C++ 文件，生成 `.node` 扩展文件。通常，你会使用 `node-gyp` 来编译这个文件——一个跨平台的命令行工具，用于编译 Node.js 的 addons。

编译完成后，你可以在 Node.js 中这样使用它：

```javascript
// app.js
const addon = require("./hello_world");

console.log(addon.hello()); // 输出: 'world'
```

#### 例子 2：更复杂的操作

C++ addons 可以进行一些 JavaScript 难以有效执行的操作，比如与底层硬件交互，或者执行密集型数学运算。例如，你可能有一个 C++ 编写的图像处理函数，它能够非常快速地处理大量图像数据。

编译成 `.node` 文件后，你可以这样加载和使用它：

```javascript
// app.js
const imageAddon = require("./image_processor");

let processedImage = imageAddon.process(myImageData);
// 进行图像处理的相关操作...
```

总结来说，通过 `require()` 加载 addons 是在 Node.js 应用中引入和使用原生 C++ 功能的一种方式。借助 addons，开发者可以在性能敏感的领域中扩展 Node.js 的能力。不过，对于新手来说，编写和编译 addons 相对复杂，通常建议先尝试使用现有的 npm 包，或者在真正需要时再考虑开发自己的 addons。

## [Native abstractions for Node.js](https://nodejs.org/docs/latest/api/addons.html#native-abstractions-for-nodejs)

好的，Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。它允许你使用 JavaScript 来编写服务器端代码。Node.js 很受欢迎，因为它性能高效，并且拥有丰富的生态系统。

在 Node.js 中，“Native abstractions for Node.js”通常指的是一组工具和接口（APIs），用来编写能够与 Node.js 本身紧密集成的本地插件。这些本地插件是用 C 或者 C++ 编写的，它们可以直接调用 Node.js 提供的底层 API 以及其他系统级别的功能。

现在来详细解释一下，并给出几个实际运用的例子：

1. **为什么需要 Native abstractions？**

   - JavaScript 是一个高级语言，而有些任务需要更接近硬件的操作，比如内存管理、文件系统操作等，这些需要用到更底层的语言如 C/C++ 来实现。
   - 比如，如果我们想要开发一个图形处理库，或者需要和某些硬件设备交互（比如 USB 设备），这类工作在 JavaScript 中可能做不到或者效率不高，因此需要用 C/C++ 来编写一个扩展模块。

2. **N-API 和 NaN：**

   - N-API 是一个稳定的 Node.js API 层，它的目标是减少维护本地扩展时因 Node.js 版本更新而带来的麻烦。使用 N-API 编写的扩展理论上可以在不同版本的 Node.js 中运行，无需修改代码。
   - `NaN` (Native Abstractions for Node.js) 是一个早期为了简化本地插件开发而创建的库。它提供了一套抽象，让插件作者不必每次 Node.js 更新时都需要更新他们的代码。但是随着 N-API 的推出，`NaN` 的使用逐渐减少，因为 N-API 提供了官方支持和更好的兼容性保证。

3. **实际运用例子：**

   - **数据库驱动**：很多流行的数据库如 MongoDB、Redis 都提供了 Node.js 的库来与数据库进行交互。虽然有些数据库驱动是完全用 JavaScript 写的，但是为了性能优化，它们经常会包含一些用 C/C++ 编写的部分，比如解析二进制协议。

   - **图像处理**：在 Node.js 中处理图像，比如压缩图片、改变尺寸等，通常会使用到一些本地扩展，例如 `sharp` 库，在幕后就是通过调用 libvips 图像处理库（C 库）来完成高效的图片处理任务。

   - **加密和安全**：密码学运算通常要求非常高的性能，因此很多加密算法会用 C/C++ 实现，并且在 Node.js 中通过本地扩展暴露给 JavaScript 使用。比如，Node.js 核心的 `crypto` 模块，就在底层用到了 OpenSSL（一个开源的安全套接字层协议库）。

要开始编写这样的本地扩展，你需要了解 C/C++，以及如何将 C/C++ 代码与 Node.js 结合起来。你还需要熟悉 Node.js 提供的一些工具，比如 node-gyp，这是一个用于编译 Node.js 本地扩展的命令行工具。具体的编程流程包括编写 C/C++ 代码、配置编译脚本、编译成可被 Node.js 加载的模块，然后在 JavaScript 代码中加载和使用这个模块。

## [Node-API](https://nodejs.org/docs/latest/api/addons.html#node-api)

Node-API（原名为 N-API）是 Node.js 的一个功能，它允许你编写能直接和 Node.js 本身交互的本地插件。这些插件是用 C 或 C++语言编写的，并且可以在不修改代码的情况下在不同的 Node.js 版本间运行。这是因为 Node-API 提供了一个抽象层，保护了插件开发者免受 Node.js 底层引擎变化的影响。

通俗来说，如果你想要在 Node.js 中使用一些操作系统级别的功能，或者需要执行一些高性能计算，而这些计算是用 JavaScript 写起来效率不高或难以实现的，那么你可能会想要用 C 或 C++ 来写这部分代码。Node-API 就是连接 Node.js 和这些本地代码的桥梁。

### Node-API 实际应用例子

1. **性能密集型任务**:
   假如你需要进行图像处理，比如图片的缩放、格式转换等。这些操作在 JavaScript 中运行效率并不高，可以通过 Node-API 编写本地插件来加速处理流程。例如，使用 C++编写一个插件，然后从 Node.js 调用这个插件来处理图像。

2. **硬件访问**:
   如果你的应用需要直接和计算机的硬件交互，比如读取 USB 设备的数据，那么你可以用 Node-API 编写一个本地插件来实现这一功能。JavaScript 不直接支持低级硬件访问，但是你可以通过 Node-API 在 Node.js 中实现这种访问。

3. **已有库的集成**:
   让我们假设你想在 Node.js 应用中使用一个强大的 C++ 数学库。你可以创建一个 Node-API 插件来将这个数学库包装起来，使其可以在 Node.js 项目中被调用，这样就能结合该库的功能和 Node.js 的便捷性。

4. **系统级操作**:
   某些系统级操作，如文件监视、网络通信等，在 Node.js 中虽然可行，但也许存在性能瓶颈或特定限制。利用 Node-API，开发者可以编写针对特定平台优化的模块，以提高性能或实现特殊功能。

### 如何使用 Node-API

使用 Node-API 编写插件需要较高的技术水平，因为涉及到 C/C++ 编程以及对 Node.js 内部工作方式的理解。这里只简单介绍步骤：

1. **设置构建环境**:
   安装必要的 C/C++编译器和工具链，比如在 Windows 上安装 Visual Studio，Linux 上安装 GCC。

2. **编写 C/C++代码**:
   使用 Node-API 提供的方法编写你的插件代码。你需要包含 `napi.h` 头文件并实现所需的功能。

3. **配置节点插件构建**:
   使用 `node-gyp` 或其他构建工具来编译你的插件，配置 `binding.gyp` 文件来指定构建参数。

4. **从 Node.js 中调用**:
   一旦编译完成，就可以在 Node.js 代码中通过 `require()` 方法加载你的插件模块，并像调用普通 Node.js 模块一样使用它。

Node-API 是高级功能，如果你是编程新手，你可能不会立即需要它。但了解它的存在非常重要，这样当你遇到一些 JavaScript 无法有效解决的问题时，你就知道还有其他的选择。

## [Addon examples](https://nodejs.org/docs/latest/api/addons.html#addon-examples)

Node.js 是一个开源的、跨平台的 JavaScript 运行环境，它允许你在服务器端运行 JavaScript 代码。通常说到 Node.js，人们会谈论其非阻塞 I/O 和事件驱动的特性，这使得 Node.js 特别适合构建高性能的网络应用程序。

当你开发 Node.js 应用时，大部分时间你会使用 JavaScript 来编写代码。然而，有些情况下，你可能需要执行一些更底层的操作，比如直接与操作系统交互或执行计算密集型任务。这时候，仅靠 JavaScript 可能不够高效或者甚至无法实现某些功能。于是，Node.js 提供了一个被称为"Addons"的机制，允许你使用 C/C++等语言来扩展 Node.js 的功能。

### Addon Examples

Addon 示例指的是用 C/C++编写的代码片段，这些代码通过 Node.js 的 API 与 JavaScript 代码进行交互。基本上，Addons 允许你做以下几点：

1. 提升性能：对使用 JavaScript 处理速度过慢的任务进行优化。
2. 调用系统级 API：执行不能或者难以通过纯 JavaScript 实现的系统任务。
3. 重用现有的 C/C++库：如果已经有执行某些任务的 C/C++库，你可以通过 Addons 让 Node.js 调用这些库。

##### 实际例子：

**1. 性能优化例子：**
假设我们需要进行大量的数值计算，比如计算斐波那契数列。在 JavaScript 中实现可能会相对慢，但是使用 C++编写一个 Addon，然后从 Node.js 调用这个 Addon，就能显著提高计算速度。

**C++ Addon 代码片段（fibonacci.cc）:**

```cpp
#include `<`node.h>

void CalculateFibonacci(const v8::FunctionCallbackInfo`<`v8::Value>& args) {
    int n = args[0].As`<`v8::Number>()->Value();
    int a = 0, b = 1, sum = 0;
    for (int i = 0; i `<` n; i++) {
        sum = a + b;
        a = b;
        b = sum;
    }
    args.GetReturnValue().Set(v8::Number::New(args.GetIsolate(), sum));
}

void Initialize(v8::Local`<`v8::Object> exports) {
    NODE_SET_METHOD(exports, "calculate", CalculateFibonacci);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```

**JavaScript 代码调用 Addon:**

```javascript
const addon = require("./build/Release/fibonacci");

console.log(addon.calculate(10)); // 使用C++编写的Addon计算第10个斐波那契数
```

**2. 系统级 API 调用例子：**
想象一下，我们需要获取操作系统的内存信息。虽然 Node.js 提供了`os`模块，但还不足以满足所有需求。你可以编写一个 C++ Addon 来调用系统级 API 获取详细的内存状态。

**C++ Addon 代码片段（memory_info.cc）:**

```cpp
#include `<`node.h>
#include `<`sys/types.h>
#include `<`sys/sysinfo.h>

void GetSystemMemoryInfo(const v8::FunctionCallbackInfo`<`v8::Value>& args) {
    struct sysinfo memInfo;
    sysinfo (&memInfo);
    long long totalVirtualMem = memInfo.totalram;
    totalVirtualMem += memInfo.totalswap;
    totalVirtualMem *= memInfo.mem_unit;

    args.GetReturnValue().Set(v8::Number::New(args.GetIsolate(), totalVirtualMem));
}

void Initialize(v8::Local`<`v8::Object> exports) {
    NODE_SET_METHOD(exports, "getMemoryInfo", GetSystemMemoryInfo);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```

**JavaScript 代码调用 Addon:**

```javascript
const memoryAddon = require("./build/Release/memory_info");

console.log(memoryAddon.getMemoryInfo()); // 输出系统的总虚拟内存大小
```

注意事项：

- Addons 的编写和编译比起纯 JavaScript 要复杂得多，需要配置编译环境，并且理解 Node.js 的 C/C++ API。
- 使用 Addons 会增加代码的复杂性，并且可能会对跨平台兼容性产生影响，因为 C/C++代码通常需要根据不同操作系统作出调整。
- 在编写 Addons 时还要小心内存管理和性能问题，错误的手动内存管理可能引入安全漏洞或者性能瓶颈。

总之，Node.js 的 Addons 提供了一种强大的方式来扩展 Node.js 的能力，但应该在确实需要时才使用，并且需要谨慎处理扩展部分的开发和维护。

### [Function arguments](https://nodejs.org/docs/latest/api/addons.html#function-arguments)

Node.js 支持使用 C++ 编写扩展，这些扩展称为插件或 addon。在 Node.js 中与 C++ 模块交互通常是通过 N-API 或更旧的 nan（原生抽象层）来实现的。当你在 JavaScript 中调用一个 C++ 函数时，你需要能够将函数参数从 JavaScript 传递到 C++，这就是 Function arguments 在这个上下文中的意义。

在 Node.js 的 addons 文档中，Function arguments 部分解释了如何在编写本地插件时处理来自 JavaScript 函数调用的参数。

下面我会详细解释如何在 C++ addon 中获取 JavaScript 函数参数，并给出一些示例。

### 获取函数参数

当 JavaScript 调用一个 C++ 写的函数时，参数会按照它们被提供的顺序排列。在 C++ 代码中，你通常通过`Napi::CallbackInfo`对象访问这些参数。这个对象包含了所有你需要的信息，比如参数数量以及一个方法来获取每个参数。

以下是一个简单的例子，演示如何在 C++ addon 中获取函数参数：

```cpp
##include `<`napi.h>

// 这是我们的 C++ 函数，它将被暴露给 JavaScript
Napi::Value Add(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // 检查参数的数量
    if (info.Length() `<` 2) {
        throw Napi::TypeError::New(env, "Expected two arguments");
    }

    // 检查参数类型
    if (!info[0].IsNumber() || !info[1].IsNumber()) {
        throw Napi::TypeError::New(env, "Expected number arguments");
    }

    // 获取参数并执行操作
    double arg0 = info[0].As`<`Napi::Number>().DoubleValue();
    double arg1 = info[1].As`<`Napi::Number>().DoubleValue();
    double sum = arg0 + arg1;

    // 返回结果
    return Napi::Number::New(env, sum);
}

// 初始化模块并导出 Add 函数
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("add", Napi::Function::New(env, Add));
    return exports;
}

NODE_API_MODULE(addon, Init)
```

在上面的例子中，我们定义了一个名为 `Add` 的 C++ 函数，它获取两个数字作为输入参数，返回它们的和。这个函数首先检查是否接收到了两个参数，然后检查这两个参数是否都是数字类型。如果有任何错误发生，它会抛出 type error 异常。如果没有错误，它则计算两个参数的和并返回。

要在 JavaScript 中使用这个函数，你可以编译这个 C++ 代码为一个 Node.js 插件，然后像这样在 JavaScript 代码中调用：

```javascript
const addon = require("./build/Release/addon");

console.log(addon.add(3, 5)); // 输出: 8
```

在这个 JavaScript 代码片段中，我们加载了编译好的插件，然后调用了 `add` 函数并打印了结果。

这就是 Node.js v21.7.1 文档中 Function arguments 部分的基础概念。编写 C++ addon 允许你将高性能的 C++ 代码和 Node.js 的事件驱动非阻塞特性结合起来，使 Node.js 应用程序能够执行更加复杂和性能密集型的任务。

### [Callbacks](https://nodejs.org/docs/latest/api/addons.html#callbacks)

Node.js 中的 Callbacks（回调函数）是一个非常重要的概念，它允许你处理异步操作。在 Node.js 的上下文中，"异步"意味着某个操作可能会耗费一些时间来完成，比如读写文件、网络请求或者任何可能会延迟返回结果的操作。

当你触发一个异步操作时，你并不需要停下来等待它完成，这意味着 Node.js 可以同时处理很多其他事情。为了得到异步操作的结果，你提供一个函数（即回调函数），这个函数会在异步操作完成时被调用。

下面通过几个例子来说明如何在 Node.js 中使用回调函数：

### 1. 读取文件

假设你想要读取一个文件的内容，在 Node.js 中，你可以使用 `fs.readFile` 函数，它接受一个回调函数作为参数，这个函数会在文件读取完毕后被调用。

```javascript
// 引入 fs 模块，用于文件系统操作
const fs = require("fs");

// 使用 fs.readFile 读取文件
fs.readFile("example.txt", "utf8", (err, data) => {
  if (err) {
    // 如果出现错误，err 参数会包含错误信息
    console.error("读取文件时发生错误:", err);
  } else {
    // 成功读取文件，data 参数包含文件内容
    console.log("文件内容:", data);
  }
});
```

### 2. 网络请求

在 Node.js 中，你可以使用核心模块 `http` 来发起网络请求，例如请求一个网页的内容。

```javascript
// 引入 http 模块
const http = require("http");

// 发起 GET 请求
http
  .get("http://example.com", (res) => {
    let data = "";

    // 接收数据片段
    res.on("data", (chunk) => {
      data += chunk;
    });

    // 数据接收完毕
    res.on("end", () => {
      console.log("响应内容:", data);
    });
  })
  .on("error", (err) => {
    // 处理请求过程中的错误
    console.error("请求遇到问题:", err);
  });
```

### 3. 定时执行任务

在 JavaScript 和 Node.js 中，`setTimeout` 是一个常用的函数，它允许你设置一个定时器，并在指定的时间后执行回调函数。

```javascript
// 设置一个定时器，1000 毫秒后执行回调函数
setTimeout(() => {
  console.log("一秒钟后打印这个消息");
}, 1000);
```

回调函数是 Node.js 异步编程的基石。然而，它们也有缺点：复杂的异步代码可能会导致所谓的 "回调地狱"（Callback Hell），即大量嵌套的回调函数使得代码难以阅读和维护。因此，现代的 Node.js 开发中常常使用 Promise 或 async/await 来管理异步流程，从而更优雅地处理异步操作。

### [Object factory](https://nodejs.org/docs/latest/api/addons.html#object-factory)

Node.js 中的 Object Factory 是在 Node.js 的原生插件（也叫作 Addons）中使用的一个概念。原生插件是用 C++编写的模块，可以直接调用 Node.js 的底层 API。当你想要在 Node.js 中执行一些超出 JavaScript 性能或者直接操作硬件和操作系统底层功能时，就会用到原生插件。

在 v21.7.1 的文档里，"Object factory" 指的是一种方式，允许开发者从 C++代码中创建 JavaScript 对象。这通常是通过定义一个工厂函数来完成的，此函数负责构建新的 JavaScript 对象，并将它们与 C++对象关联起来。

举个例子，假设我们有一个 C++类用于表示一个“汽车”，并且我们希望在 Node.js 中也能够创建和操作这样的对象。首先我们需要定义这个 C++类：

```cpp
// car.h
#ifndef CAR_H
#define CAR_H

class Car {
 public:
  Car(const std::string& brand, int year) : brand_(brand), year_(year) {}

  void Honk() {
    std::cout `<``<` "Beep! This is a " `<``<` year_ `<``<` " " `<``<` brand_ `<``<` std::endl;
  }

 private:
  std::string brand_;
  int year_;
};

#endif  // CAR_H
```

然后，我们需要编写绑定代码，这些代码将 C++的 Car 类映射为 Node.js 中的对象。这里我们需要使用 Node.js 的 N-API 来创建一个“工厂函数”，该函数会被 JavaScript 调用以实例化一个 Car 对象：

```cpp
##include `<`napi.h>
#include "car.h"

Napi::Object CreateCarInstance(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() `<` 2) {
    throw Napi::TypeError::New(env, "Invalid number of arguments");
  }

  std::string brand = info[0].As`<`Napi::String>();
  int year = info[1].As`<`Napi::Number>().Int32Value();

  Car* car = new Car(brand, year);

  Napi::Object obj = Napi::Object::New(env);
  // 这里我们将C++对象与JavaScript对象关联起来
  obj.Set("honk", Napi::Function::New(env, [car](const Napi::CallbackInfo& info){
    car->Honk();
  }));

  return obj;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("createCar", Napi::Function::New(env, CreateCarInstance));
  return exports;
}

NODE_API_MODULE(car, Init)
```

上面的代码定义了一个`CreateCarInstance`函数，它接收两个参数：品牌和年份，并创建一个新的`Car`对象。然后创建一个新的 JavaScript 对象，赋予它一个方法`honk`，当在 JavaScript 中调用这个方法时，它会触发 C++对象的`Honk()`方法。

最后，在 Node.js 中，你可以像这样使用你的 Object factory 来创建和使用 Car 对象：

```javascript
const addon = require("./build/Release/car");

let myCar = addon.createCar("Toyota", 2020);
myCar.honk(); // 输出: Beep! This is a 2020 Toyota //来源：doc.cherrychat.org 请勿商用
```

总结来说，Object Factory 在 Node.js 原生插件中是一种构建 JavaScript 对象的机制，它允许 JavaScript 代码和 C++代码之间进行交互。通过使用 N-API 提供的接口，开发者可以在 C++中创建对象，并且将它们暴露给 JavaScript 代码，进而实现更复杂的操作和更高效的性能。

### [Function factory](https://nodejs.org/docs/latest/api/addons.html#function-factory)

Node.js 中的 Function Factory 是指在使用原生插件（native addons）时，我们可以通过 C++创建动态链接的共享对象，并通过 Function Factory 将 C++中的函数暴露给 Node.js 的 JavaScript 环境，这样 JavaScript 代码就能够调用这些 C++编写的函数。

在谈论 Function Factory 之前，让我们先了解一下什么是原生插件。原生插件（native addons）是一种特殊类型的模块，允许 Node.js 的 JavaScript 代码直接与系统级别的 C++代码交互。这通常用于性能敏感的操作或者需要直接与底层系统进行交互的情况，比如文件系统操作、加密、压缩等。

下面我会通过一个简单的例子来说明如何使用 Function Factory：

首先，你需要有 C++的知识并且安装了 Node.js 的构建工具`node-gyp`。假设我们要创建一个简单的原生插件，它提供一个函数`hello`，当从 JavaScript 中调用时，它返回字符串"Hello from C++!"。

1. 创建 C++源文件 (hello.cpp)：

```cpp
#include `<`node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

// 这个是我们的Function Factory，它创建了一个新的函数。
void Hello(const FunctionCallbackInfo`<`Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // 这里我们返回我们的字符串"Hello from C++!"给JavaScript。
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Hello from C++!").ToLocalChecked());
}

// 此方法用于将我们的hello方法暴露给外部JavaScript使用。
void Initialize(Local`<`Object> exports) {
  NODE_SET_METHOD(exports, "hello", Hello);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo
```

2. 创建 binding.gyp 文件，这是一个描述项目构建配置的文件：

```json
{
  "targets": [
    {
      "target_name": "addon",
      "sources": ["hello.cpp"]
    }
  ]
}
```

3. 构建原生插件:

```sh
$ node-gyp configure
$ node-gyp build
```

4. 现在，你可以创建一个 JavaScript 文件来加载并使用这个原生插件了：

```js
const addon = require("./build/Release/addon");

console.log(addon.hello()); // 输出 "Hello from C++!"
```

在上述例子中：

- 我们首先创建了一个 C++文件，定义了函数`Hello`和初始化函数`Initialize`。
- `Hello`函数是我们的 Function Factory，它生成了一个 JavaScript 可调用的函数。
- 在`Initialize`函数中，我们使用`NODE_SET_METHOD`宏将`Hello`函数绑定到 exports 对象上，使得这个函数可以作为模块被导出。
- 通过编译这个 C++代码并加载到 Node.js 中，我们的 JavaScript 代码现在可以调用这个 C++函数`hello`，并收到它返回的字符串。

这样，我们就实现了用 C++编写函数并在 Node.js 中通过 Function Factory 暴露给 JavaScript 的过程。这种方法常用于提升性能，或者在 JavaScript 中不能直接完成的低级操作。

### [Wrapping C++ objects](https://nodejs.org/docs/latest/api/addons.html#wrapping-c-objects)

在 Node.js 中，你可以使用 C++来编写扩展，这样做可以让你执行一些 JavaScript 本身无法高效完成的任务，比如直接与操作系统底层 API 进行交互，或者实现计算密集型操作。这些扩展通常被称为插件（addons）。

当你创建一个 C++插件时，经常需要在 C++代码和 JavaScript 之间共享复杂的数据结构或对象。为了做到这一点，你可以将 C++类的实例“包装”为 JavaScript 对象，从而允许 JavaScript 代码通过这个对象与 C++类的实例互动。这就是所谓的包装 C++对象（Wrapping C++ objects）。

下面将给出一个简单的例子来解释这个概念。

### 例子：包装一个 C++计数器对象

假设我们有一个 C++的计数器类，如下所示：

```cpp
// counter.h file
class Counter {
public:
    Counter() : count(0) {}

    void Increment() { ++count; }
    int GetValue() const { return count; }

private:
    int count;
};
```

在上面的`Counter`类中，我们有一个`Increment`方法用于增加计数器的值，以及一个`GetValue`方法用于获取当前的计数器值。

现在，我们想要在 Node.js 中使用这个计数器。首先，我们需要创建一个 Node.js 插件来包装这个 C++对象。

1. 首先，我们需要引入 Node.js 的头文件，以及相关的命名空间：

```cpp
##include `<`napi.h>

using namespace Napi;
```

2. 然后，我们定义一个包装 Counter 类的新类：

```cpp
class CounterWrapper : public ObjectWrap`<`CounterWrapper> {
public:
    // 初始化函数，用于设置原型链
    static void Init(Napi::Env env, Napi::Object exports);

    // 构造函数
    CounterWrapper(const Napi::CallbackInfo& info);

private:
    static Napi::FunctionReference constructor;

    // 包装的C++ Counter对象
    Counter counter_;

    // 暴露给JavaScript的Increment和GetValue方法
    Napi::Value Increment(const Napi::CallbackInfo& info);
    Napi::Value GetValue(const Napi::CallbackInfo& info);
};
```

3. 接着我们实现`Init`方法和两个暴露给 JavaScript 的方法：

```cpp
Napi::FunctionReference CounterWrapper::constructor;

void CounterWrapper::Init(Napi::Env env, Napi::Object exports) {
    Napi::HandleScope scope(env);

    Napi::Function func = DefineClass(env, "Counter", {
        CounterWrapper::InstanceMethod("increment", &CounterWrapper::Increment),
        CounterWrapper::InstanceMethod("getValue", &CounterWrapper::GetValue),
    });

    constructor = Napi::Persistent(func);
    constructor.SuppressDestruct();

    exports.Set("Counter", func);
}

CounterWrapper::CounterWrapper(const Napi::CallbackInfo& info)
: ObjectWrap(info) {
    this->counter_ = Counter();
}

Napi::Value CounterWrapper::Increment(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    counter_.Increment();
    return env.Undefined();
}

Napi::Value CounterWrapper::GetValue(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    return Napi::Number::New(env, counter_.GetValue());
}
```

4. 最后，在插件的初始化函数中调用`CounterWrapper::Init`：

```cpp
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    CounterWrapper::Init(env, exports);
    return exports;
}

NODE_API_MODULE(addon, Init)
```

在上述代码中，我们创建了一个`CounterWrapper`类来包装我们的 C++ `Counter`类，并且定义了`Increment`和`GetValue`方法以供 JavaScript 调用。同时，`Init`函数用于注册这个包装器，使得它在模块加载时可用。

现在，Node.js 应用程序可以像这样使用这个包装好的 C++对象：

```javascript
const addon = require("./build/Release/addon");

let myCounter = new addon.Counter();
myCounter.increment();
console.log(myCounter.getValue()); // 输出 1
```

在 JavaScript 端，我们导入了编译好的插件并创建了一个`Counter`对象。然后我们调用了`increment`方法来增加计数，并使用`getValue`来获取当前计数器的值。

希望这个详细的步骤能够帮助你理解 Node.js 中包装 C++对象的过程。

### [Factory of wrapped objects](https://nodejs.org/docs/latest/api/addons.html#factory-of-wrapped-objects)

Node.js 中的“Factory of wrapped objects”指的是一个创建包装对象的机制。所谓的包装对象，就是一个将原生 C++代码功能封装，在 JavaScript 环境中可以调用的对象。这有助于将一些性能关键或底层操作的代码用 C++编写，并通过 Node.js 提供的插件系统暴露给 JavaScript 使用。

要理解这个概念，我们需要先了解几个关键点：

1. **原生模块：** Node.js 的一个强大功能是能够加载和执行原生模块。原生模块是用 C 或 C++编写的模块，它们可以直接与操作系统交互，提供一些 JavaScript 本身不能做到或者效率不高的功能。

2. **N-API：** 这是一个 Node.js 的 API，它提供了在原生模块中创建和操作 JavaScript 值的方法。N-API 的目的是保持跨 Node.js 版本的稳定性，这样用 C 或 C++编写的模块就不需要因为 Node.js 版本的升级而频繁地进行更新。

3. **包装对象：** 在你提到的 Factory of wrapped objects 上下文中，包装对象是指用 C++编写的类实例被封装成 JavaScript 可操作的对象。这样，JavaScript 代码就可以像操作普通 JavaScript 对象一样操作这些 C++类实例。

现在，让我们通过一个简单的示例来说明如何创建一个 wrapped object factory。

设想我们有一个 C++类，它提供了某种功能，比如一个简单计数器：

```cpp
// counter.h
#ifndef COUNTER_H
#define COUNTER_H

class Counter {
public:
    Counter(int start) : value(start) {}
    void increment() { value++; }
    int getValue() const { return value; }

private:
    int value;
};

#endif
```

然后，我们希望在 Node.js 中使用这个计数器。我们需要编写绑定代码来创建包装对象：

```cpp
// counter_wrap.cc
##include `<`napi.h>
#include "counter.h"

class CounterWrap : public Napi::ObjectWrap`<`CounterWrap> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    CounterWrap(const Napi::CallbackInfo& info);

private:
    static Napi::FunctionReference constructor;
    Napi::Value Increment(const Napi::CallbackInfo& info);
    Napi::Value GetValue(const Napi::CallbackInfo& info);

    Counter counter_;
};

Napi::FunctionReference CounterWrap::constructor;

Napi::Object CounterWrap::Init(Napi::Env env, Napi::Object exports) {
    // 创建一个新的类构造函数
    Napi::HandleScope scope(env);

    Napi::Function func = DefineClass(env, "Counter", {
        InstanceMethod("increment", &CounterWrap::Increment),
        InstanceMethod("getValue", &CounterWrap::GetValue),
    });

    constructor = Napi::Persistent(func);
    constructor.SuppressDestruct();

    exports.Set("Counter", func);
    return exports;
}

CounterWrap::CounterWrap(const Napi::CallbackInfo& info) : Napi::ObjectWrap`<`CounterWrap>(info), counter_(0) {
    if (info.Length() > 0 && info[0].IsNumber()) {
        counter_ = Counter(info[0].As`<`Napi::Number>().Int32Value());
    }
}

Napi::Value CounterWrap::Increment(const Napi::CallbackInfo& info) {
    counter_.increment();
    return Napi::Value();
}

Napi::Value CounterWrap::GetValue(const Napi::CallbackInfo& info) {
    int value = counter_.getValue();
    return Napi::Number::New(info.Env(), value);
}

// 初始化模块
Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    return CounterWrap::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)
```

在 JavaScript 中，我们使用这个包装器会非常直观：

```javascript
const addon = require("./build/Release/addon");

let myCounter = new addon.Counter(10);
console.log(myCounter.getValue()); // 输出: 10
myCounter.increment();
console.log(myCounter.getValue()); // 输出: 11
```

在上面的例子中，我们创建了一个 C++类`Counter`，然后在 Node.js 中创建了一个包装器`CounterWrap`来使得 JavaScript 代码能够使用。当 JavaScript 代码 `new addon.Counter(10)` 被执行时，其实是在调用 `CounterWrap` 的构造函数，从而创建了一个 `Counter` 实例。

这只是一个很基础的例子，实际应用可能会涉及更复杂的数据处理和性能优化方案。原生扩展的用途非常广泛，例如文件系统访问、加密解密、图像处理、数据库连接等等。

### [Passing wrapped objects around](https://nodejs.org/docs/latest/api/addons.html#passing-wrapped-objects-around)

在 Node.js 中，"wrapped objects"（封装对象）通常是指由 C++层面创建并与 JavaScript 代码互操作的对象。这些对象可以让你在 Node.js 的编程环境下使用 C++ 的能力，比如直接操作系统资源或者执行高性能计算。

Node.js 通过插件（addons）提供了一个方式让你可以用 C++ 来扩展 Node.js 的功能。在插件中，你可能会创建一个 C++ 类，并希望把它的实例传递给 JavaScript 代码使用。为了安全和方便地管理这种跨语言边界的交互，Node.js 提供了一套封装和解封机制。

### 封装对象

当你在 C++ 中创建了一个类的实例，并想在 JavaScript 中访问它时，你需要将这个实例“封装”到一个 JavaScript 对象中。Node.js 提供了一个叫做 `N-API` 的 API 来帮助你完成这个任务。你可以创建一个新的对象，并将你的 C++ 实例与这个 JavaScript 对象关联起来。

例如（伪代码表示）:

```cpp
class MyCppClass {
  // ... 类的成员和方法 ...
};

// 创建一个新的封装对象
Napi::Object WrapMyCppClass(Napi::Env env, MyCppClass* obj) {
  // 这里的代码用于创建一个 N-API 对象，并将其与你的 C++ 实例关联起来
}
```

### 在 JavaScript 中使用封装对象

一旦你在 C++ 层面封装了对象，你就可以通过定义的 JavaScript 方法来使用这个对象了。你可以调用 C++ 实现的方法，或者获取和设置属性，就像使用普通的 JavaScript 对象一样。

```js
const addon = require("./build/Release/addon");

// 假设`createObject`是我们在C++模块中定义的一个方法
// 它返回了一个封装了我们C++对象的JavaScript对象
let myObj = addon.createObject();

// 现在我们可以使用这个对象，就好像它完全是在JavaScript中创建的一样
myObj.someMethod();
```

### 在多个组件间传递封装对象

有时候，你可能想在多个不同的 JavaScript 模块或者 C++ 组件之间传递封装的对象。Node.js 让这成为可能，你可以轻松地取得封装对象的引用，并在你的应用各处传递和使用它。

举个实际的例子：

假设你正在编写一个图像处理库。在 C++ 中，你可能有一个 `ImageProcessor` 类来处理图像数据。在 Node.js 插件中，你可以暴露一个函数来创建这个 `ImageProcessor` 的实例，并将其封装在一个 JavaScript 对象中。

然后，在你的 Node.js 应用程序中，你可能会这样使用它：

```js
const imageProcessorAddon = require("image-processor-addon");

// 创建一个封装了C++ 'ImageProcessor'实例的JavaScript对象
let processor = imageProcessorAddon.createProcessor();

// 调用一个方法来处理图像
processor.processImage("path/to/image.png", (err, result) => {
  if (err) {
    console.error("处理图像时发生错误:", err);
  } else {
    console.log("图像处理结果:", result);
  }
});
```

在上面的例子中，`createProcessor` 是在你的插件中定义的，它创建了一个封装的 `ImageProcessor` 实例。`processImage` 方法可能是在 C++ 中实现的，但可以被 JavaScript 代码像调用本地 JavaScript 函数一样调用。

总而言之，"Passing wrapped objects around" 允许你创建一个强大的、跨语言边界的系统，你可以在 C++ 层面利用高性能和底层系统的访问能力，在 JavaScript 层面保持开发效率和灵活性。通过插件系统的封装和解封接口，Node.js 确保了这两个世界能够安全、有效地协作。
