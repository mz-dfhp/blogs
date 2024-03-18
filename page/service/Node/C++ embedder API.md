# [C++ embedder API](https://nodejs.org/docs/latest/api/embedding.html#c-embedder-api)

Node.js 是一个基于 Chrome 的 V8 JavaScript 引擎的 JavaScript 运行环境。它允许你在服务器端运行 JavaScript 代码。Node.js 本身是用 C++编写的，因此它提供了一组 API，这些 API 使得其他 C++程序能够内嵌和控制 Node.js 的行为。

C++ embedder API 指的就是 Node.js 提供给 C++开发者的一套工具和函数，通过这些工具和函数，开发者可以在他们自己的 C++程序中嵌入 Node.js 的运行时（runtime），实现高级的集成。换句话说，这允许你在 C++程序中创建和管理 Node.js 实例，执行 JavaScript 代码，以及与 Node.js 的事件循环交互。

下面我会详细解释这个功能，并且给出一些实际应用的例子：

### 1. 创建 Node.js 上下文

首先，你需要在你的 C++程序中创建一个 Node.js 的上下文。这相当于是创建了一个 Node.js 实例的环境，在这个环境中，你可以运行 JavaScript 代码。

```cpp
#include `<`node.h>

int main(int argc, char* argv[]) {
    node::MultiIsolatePlatform* platform = node::CreatePlatform(argc, argv);
    v8::Isolate::CreateParams params;
    params.array_buffer_allocator = node::ArrayBufferAllocator::Create();
    v8::Isolate* isolate = v8::Isolate::New(params);
    // ...
}
```

### 2. 执行 JavaScript 代码

一旦你有了 Node.js 上下文，你就可以在这个上下文中执行 JavaScript 代码了。

```cpp
v8::Local`<`v8::Context> context = v8::Context::New(isolate);
context->Enter();
// 这里 'source' 是一个包含你想要执行的JavaScript代码的字符串
v8::Local`<`v8::String> source = v8::String::NewFromUtf8(isolate, "'Hello, World!'");
v8::Local`<`v8::Script> script = v8::Script::Compile(context, source).ToLocalChecked();
v8::Local`<`v8::Value> result = script->Run(context).ToLocalChecked();
context->Exit();
```

### 3. 与事件循环交互

Node.js 使用一个事件循环来处理异步操作。在 C++程序中，你也可以启动和停止 Node.js 的事件循环。

```cpp
node::Environment* env = node::CreateEnvironment(isolate, context, argc, argv, argc, argv);
node::LoadEnvironment(env);
// 启动 Node.js 的事件循环
uv_run(env->event_loop(), UV_RUN_DEFAULT);
```

### 实际应用的例子：

#### 嵌入式设备

如果你正在开发一个嵌入式设备，比如一个智能家居系统，你可能会用 C++来写底层的硬件控制代码，但希望用 Node.js 来处理网络通信、数据管理等任务。使用 C++ embedder API，你可以将 Node.js 嵌入到你的 C++程序中，利用 Node.js 强大的生态系统和 NPM 上成千上万的包来扩展你的设备功能。

#### 游戏引擎

假设你正在开发一个游戏引擎，而且你想要用 JavaScript 作为脚本语言来控制游戏逻辑。你可以使用 C++ embedder API 来嵌入 Node.js，这样游戏开发者就可以用 JavaScript 来编写游戏逻辑，同时还能利用 Node.js 的异步特性来处理诸如网络通信或者 I/O 操作。

#### 桌面应用

如果你正在构建一个桌面应用并且已经使用 C++为核心功能编写了大量的代码。你可能会发现，为了增加一些高级功能（例如，添加一个 Web 服务器或者处理 HTTP 请求），使用 Node.js 会更加方便快捷。此时，你可以通过 C++ embedder API 将 Node.js 集成到你的应用中，从而在原有的 C++基础上增强功能。

这些只是几个例子，C++ embedder API 的使用场景十分广泛，几乎任何想要结合 C++的性能和 Node.js 的灵活性的应用都可以考虑使用这个 API。

## [Example embedding application](https://nodejs.org/docs/latest/api/embedding.html#example-embedding-application)

Node.js 是一个基于 Chrome V8 JavaScript 引擎的 JavaScript 运行环境，它使得开发者可以使用 JavaScript 语言来编写服务器端的软件。与在浏览器中运行 JavaScript 不同，Node.js 提供了许多服务器级别的 API，例如文件系统访问、网络通信等。

其中，Node.js 的嵌入功能（Embedding）允许你将 Node.js 集成到其他应用程序中，这意味着你可以在非 Node.js 环境中使用 Node.js 的能力。例如，你可能有一个用 C++ 编写的桌面程序，但你想在其中执行一些 JavaScript 代码或者使用 Node.js 的某些特性，此时，你就可以嵌入 Node.js 来实现这个目标。

以下是一个简化的例子，解释了如何在一个非 Node.js 应用程序中嵌入 Node.js:

1. **初始化 Node.js**: 在你的应用程序中，首先需要初始化 Node.js 环境。这通常涉及到创建和配置一个 Node.js 实例，并且启动事件循环。

2. **执行 JavaScript**: 一旦 Node.js 环境准备就绪，你就可以加载并执行 JavaScript 代码。比如执行一个字符串中的代码，或者运行一个 JavaScript 文件。

3. **交互**: 你的应用程序可以与脚本之间交互，通过调用函数，传递数据等等。

4. **清理**: 最后，当你完成了对 Node.js 功能的使用，你需要正确地关闭 Node.js 环境，并清理资源。

举个例子：

假设你有一个 C++ 写的图形界面应用程序，这个应用程序需要处理一些复杂的数学计算，并显示结果。而你已经有一个用 JavaScript 编写的库来完成这些计算，这个库在 Node.js 上运行得很好。你不想重写整个库到 C++，所以你决定将 Node.js 嵌入到你的 C++ 应用程序中。

在你的 C++ 应用程序里：

- 你会初始化一个 Node.js 实例。
- 加载你的 JavaScript 数学库。
- 每当需要进行计算时，你的 C++ 程序会调用这个数学库中相应的 JavaScript 函数，并传递必要的参数。
- 计算结果会返回给 C++ 程序，并在图形界面中展示出来。
- 当应用程序结束时，你会关闭并清理 Node.js 环境。

希望这个解释帮助你理解 Node.js 中的嵌入功能和它的一些基本应用场景。

### [Setting up per-process state](https://nodejs.org/docs/latest/api/embedding.html#setting-up-per-process-state)

Node.js v21.7.1 的文档里提到了“Setting up per-process state”，意思是在使用 Node.js 嵌入 API（embedding API）时，设置每个进程的状态。这通常用于当你想要将 Node.js 作为一个库嵌入到其他程序中去，比如 C++ 应用程序。

首先解释一下什么是“进程”：进程可以被理解为正在运行的程序的实体。在操作系统中，每个运行的应用程序或者任务都会有自己的进制，它们互相隔离，拥有自己的内存空间和资源。

对于嵌入 Node.js 到其他程序中来说，“per-process state”指的是每个独立的 Node.js 环境或上下文都有自己的状态（例如全局变量、环境变量等），这样它们可以在同一个宿主程序中相互隔离地运行。

具体的步骤包括：

1. `node::Init` & `node::Start`: 这些函数用来初始化和启动 Node.js 引擎。你需要先调用 `node::Init` 初始化必要的结构和准备运行环境，然后通过 `node::Start` 来启动 Node.js 实例。

2. `node::MultiIsolatePlatform`: 这是一个用于管理多个隔离环境的平台层。如果你需要在同一个宿主程序中运行多个 Node.js 实例（每个都在自己的隔离环境中），你就需要使用这个平台层。

3. `uv_loop_t`: 是 libuv 事件循环的句柄，libuv 是 Node.js 用于异步 I/O 操作的底层库。每个 Node.js 实例通常需要自己的 `uv_loop_t` 以处理异步事件和回调。

4. `v8::Isolate`: 在 V8 （Node.js 使用的 JavaScript 引擎）中，隔离环境是执行 JavaScript 代码的独立环境。每个隔离环境都有自己的堆内存和微任务队列。

5. 创建和配置: 创建新的 `v8::Isolate` 和 `uv_loop_t` 实例，并将它们与 `node::MultiIsolatePlatform` 相关联。

6. 执行代码: 使用创建的隔离环境来加载和执行 JavaScript 代码。

现在我们来看几个实际运用的例子：

- **嵌入式设备**: 如果你开发一个智能家居控制系统，这个系统可能是用 C++ 写的，但你希望能够使用 JavaScript 来编写设备的控制逻辑。你可以将 Node.js 嵌入到你的 C++ 程序中，并为每个设备创建一个 Node.js 环境，从而用 JavaScript 控制每个设备。

- **桌面软件**: 假设你在开发一个视频编辑器软件，界面用 C++ 编写，性能很好。但是你想让用户能写小脚本来批量处理视频文件，那你可以嵌入 Node.js ，让用户用 JavaScript 来编写这些脚本。

- **游戏开发**: 一款游戏的引擎可能是用 C++ 编写的，但游戏设计师可能不是很擅长 C++ 。你可以在游戏中嵌入 Node.js，允许设计师用 JavaScript 来编写游戏逻辑和事件。

这种嵌入方法使得 Node.js 不仅限于运行在服务器或命令行工具中，它也可以成为其他应用程序的强大扩展，使其能够利用 JavaScript 的灵活性和生态系统。

### [Per-instance state](https://nodejs.org/docs/latest/api/embedding.html#per-instance-state)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，它允许你使用 JavaScript 来编写服务器端代码。在 Node.js 的不同版本中，会有各种功能的更新和改进。

在 Node.js v21.7.1 文档中提到的“Per-instance state”指的是在嵌入 Node.js 到其他应用程序时，每个 Node.js 实例可以维护自己独立的状态。这意味着如果你在一个应用程序中创建了多个 Node.js 实例，每个实例都可以有它自己的全局变量、模块缓存等，它们之间互不影响。

举个例子来解释“Per-instance state”，假设你正在开发一个桌面应用程序，该程序允许用户打开多个项目，在每个项目中他们可以运行不同的 Node.js 脚本。如果这些脚本都在同一个 Node.js 实例中运行，那么它们共享的状态（比如全局变量）可能会导致一些意料之外的冲突或错误。但是，如果每个项目在不同的 Node.js 实例中运行，每个项目就拥有自己的环境，不会受到其他项目运行的脚本的影响。

再比如，你可能在开发一个 Web 服务器，希望为每个连接的客户端创建一个隔离的环境。通过为每个客户端分配一个单独的 Node.js 实例，你可以确保客户端之间的数据和状态完全隔离，提高安全性和稳定性。

这项功能对于需要在同一个进程中运行多个 Node.js 环境的开发者来说非常重要，因为它可以避免实例间的潜在冲突，并且使得每个实例能够独立管理其状态。
