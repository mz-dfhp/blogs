# [Permissions](https://nodejs.org/docs/latest/api/permissions.html#permissions)

Node.js v21.7.1 引入的 Permissions API 为开发者提供了一种方式来查询和请求代码的权限。这个功能对于构建更安全、更透明的应用程序非常有帮助，尤其是在处理敏感信息或设备功能时。

### 基本概念

在 Node.js 中，"权限"指的是代码执行某些操作的能力，比如访问文件系统、网络通信等。传统上，Node.js 应用一旦启动，就拥有几乎所有权限，这可能会带来安全风险。Permissions API 的引入使得开发人员可以更细粒度地控制和管理这些权限。

### 使用 Permissions API

Permissions API 通过`navigator.permissions`对象暴露给开发者。主要包含两个方法：`query()`和`request()`。

- **`query()`方法**：允许你查询一个权限的状态。它返回一个 Promise，解析为一个包含权限状态的对象。

- **`request()`方法**：允许你请求一个权限。这同样返回一个 Promise，但是解析为一个表示请求结果的对象。

### 实际运用示例

假设你正在开发一个 Node.js 应用，需要读取用户的某个目录的内容：

1. **查询权限**：
   首先，你可能想确保你的应用有权访问文件系统。你可以使用`query()`方法来检查。

```javascript
async function checkFileSystemAccess() {
  try {
    const result = await navigator.permissions.query({ name: "file-system" });
    console.log(result.state); // 'granted', 'denied', 'prompt'
  } catch (error) {
    console.error("Error checking permissions:", error);
  }
}
```

2. **请求权限**：
   如果你发现权限未被授予，你可以尝试使用`request()`方法请求该权限。

```javascript
async function requestFileSystemAccess() {
  try {
    const result = await navigator.permissions.request({ name: "file-system" });
    if (result.state === "granted") {
      console.log("Permission granted");
      // 你现在可以安全地读写文件
    } else {
      console.log("Permission denied");
      // 处理没有权限的情况
    }
  } catch (error) {
    console.error("Error requesting permission:", error);
  }
}
```

### 注意事项

- Node.js 中引入的 Permissions API 可能与浏览器中实现的 API 有所不同，因此使用时需注意 API 的具体行为和支持状况。
- 对于一些高风险权限，即使使用`request()`方法请求，系统也可能自动拒绝或要求用户手动确认。
- 开发过程中应当密切关注 Node.js 文档的更新，以便了解最新的 API 变动和最佳实践。

通过合理使用 Permissions API，开发者可以更好地保护用户的隐私和数据安全，同时也使得应用能够在需要额外权限时及时反馈给用户，增强用户信任。

## [Module-based permissions](https://nodejs.org/docs/latest/api/permissions.html#module-based-permissions)

Node.js v21.7.1 引入了一项新功能，称为“模块基权限”（Module-based permissions）。这是一个安全功能，使得 Node.js 应用程序可以在更细粒度的级别上控制模块（即 JavaScript 文件和包）的权限。在这之前，Node.js 应用程序一旦启动，它内部的所有代码都具有相同的权限，这意味着任何模块理论上都能访问文件系统、网络等资源，这可能导致安全问题。

### 什么是模块基权限？

简单来说，模块基权限允许你为每个独立模块指定不同的权限。例如，你可以允许某个特定模块访问网络，而其他模块则不能。或者，你可以限制只有少数几个模块能够读写文件系统。

### 如何工作？

当你使用 Node.js 运行一个应用程序时，通过使用特定的命令行标志（如`--policy`）或者在代码中明确声明，你可以定义哪些模块可以做什么。Node.js 会根据这些规则，在运行时强制实施这些权限。如果一个没有被授权访问特定资源的模块试图进行访问，Node.js 将阻止它，并且可能抛出错误。

### 实际运用的例子

假设你正在开发一个 Web 服务器应用程序，其中包含以下模块：

- `server.js`：负责处理 HTTP 请求。
- `database.js`：负责数据库操作。
- `util.js`：提供一些辅助函数，比如格式化数据。

在没有模块基权限的情况下，所有这些模块都能自由地访问网络、文件系统等。但是，你可能不希望`util.js`直接访问数据库或发送网络请求。使用模块基权限，你可以设置如下策略：

1. `server.js`有发送和接收网络请求的权限。
2. `database.js`有访问数据库所需的特定权限，例如访问特定的数据库端口，但不能直接与外部网络通信。
3. `util.js`没有访问网络或文件系统的权限。

如果`util.js`尝试执行不被允许的操作（如尝试建立网络连接），Node.js 将会拒绝这一操作并抛出错误。

### 总结

模块基权限是 Node.js 中的一个重要的安全功能，通过允许开发者为每个模块指定精确的权限，从而增加了应用程序的安全性。这有助于减少恶意代码的风险，限制潜在的安全漏洞，并确保应用程序的各个部分只能访问它们需要的资源。

### [Policies](https://nodejs.org/docs/latest/api/permissions.html#policies)

Node.js v21.7.1 引入了一个特性叫做“策略”（Policies），这是用于增强安全性的一种机制。通过使用策略，你可以定义哪些 JavaScript 或 WASM（WebAssembly）模块可以被加载以及如何加载，从而提升应用的安全防护层级。下面我会简单解释什么是策略，以及举一些实际运用的例子。

### 策略 (Policies) 简介

在 Node.js 中，策略允许你定义一个规则集，这些规则控制着代码在运行时的行为。比如，你可以限制只有来自特定来源的代码才能被执行，或者某些 API 只能在特定的条件下被调用。这样做的目的是为了增加应用程序在处理外部模块和代码时的安全性。

### 使用场景

1. **限制模块来源**: 你可以指定哪些 URL 或路径是可信的，来限制只有经过认证的模块才能被加载。这对于避免恶意代码注入非常有用。
2. **限制 API 使用**: 在某些情况下，你可能不想让第三方模块使用敏感或危险的 Node.js API。通过策略，你可以精确地控制哪些 API 是禁用的，哪些是允许的。
3. **内容安全策略(CSP)**: 尽管 CSP 通常与浏览器环境相关，但 Node.js 中的策略机制也可以用来实现类似的功能，通过定义一系列的规则来防止跨站脚本攻击(XSS)等安全威胁。

### 实际运用例子

假设你正在开发一个 Web 服务，它依赖于数个第三方库。出于安全考虑，你希望确保这些第三方库不能随意读写文件系统或者访问网络。你可以通过定义以下策略来实现：

1. **创建一个策略文件** (`policies.json`):

```json
{
  "resources": {
    "default": {
      "integrity": true,
      "allowedProtocols": ["https:"]
    }
  },
  "dependencies": {
    "/path/to/your/app/node_modules/some-third-party-module": {
      "canLoad": false,
      "defaultIntegrity": true
    }
  }
}
```

在这个例子中，我们为所有的资源定义了默认策略，要求必须使用 HTTPS 协议，并且对于指定的第三方模块，我们禁止它被加载。

2. **启动 Node.js 应用时指定策略文件**:

```bash
node --policy=policies.json your-app.js
```

当你这样做时，Node.js 将根据`policies.json`文件中定义的规则来加载模块和执行代码。如果某个操作违反了策略规则，它会被拒绝，从而保护你的应用免受未经授权的访问和潜在的安全威胁。

通过使用策略，Node.js 应用的开发者和管理员可以更好地控制代码的行为，加强应用安全。这就是 Node.js 中策略的基本概念和几个实际的应用示例。

#### [Enabling](https://nodejs.org/docs/latest/api/permissions.html#enabling)

Node.js v21.7.1 中提到的“Enabling”主要指的是如何启用和配置新引入的权限 API。这个 API 旨在给 Node.js 应用提供一种更细粒度的权限控制机制，允许开发者限制代码运行时可以使用的 Node.js API 和系统资源。下面我会详细解释这个概念，并且举几个实际运用的例子。

### 什么是权限 API？

在之前的版本中，Node.js 应用在启动时就拥有了操作系统层面几乎所有的权限，比如文件系统访问、网络请求等。这意味着如果应用被恶意利用，攻击者可以通过应用访问和操作系统资源。权限 API 的引入，使得我们可以更精细地控制应用权限，增强了安全性。

### 如何启用？

在 Node.js v21.7.1 中，可以通过 CLI 选项或环境变量来启用并配置权限 API。这包括：

- **CLI 选项**：你可以在启动 Node.js 应用时，通过 CLI 传递特定的参数来启用和配置权限。例如，`node --experimental-permissions-policy=... your-app.js`，其中`--experimental-permissions-policy=`后面跟的是具体的权限配置。

- **环境变量**：同样可以设置环境变量来达到相似的效果。例如，在 Linux 或 macOS 上使用`export NODE_OPTIONS='--experimental-permissions-policy=...'`，在 Windows 上则使用`set NODE_OPTIONS=--experimental-permissions-policy=...`。

### 实际运用例子

#### 1. 文件系统访问限制

假设你正在开发一个 Web 应用，这个应用需要读取某个特定目录下的文件，但你不希望它能够访问系统中的其他文件。通过配置权限 API，你可以限制应用只能访问指定的目录。

```shell
node --experimental-permissions-policy='{"fs": ["read", "/path/to/allowed/directory"]}' your-app.js
```

这样，即便应用中存在未知的安全漏洞，攻击者也难以通过该应用访问到系统中的其他文件。

#### 2. 网络请求限制

如果你的应用只需要与特定的几个外部服务进行交互，那么你可以通过权限 API 限制应用只能向这些服务发起网络请求。

```shell
node --experimental-permissions-policy='{"net": ["connect", "api.example.com", "db.example.net"]}' your-app.js
```

这能有效防止应用被恶意用于发起对其他目标的网络请求，例如参与 DDoS 攻击。

### 结语

通过这种方式，Node.js v21.7.1 的权限 API 为 Node.js 应用提供了更强大、更灵活的安全管理手段。虽然目前可能还处于实验阶段，但未来这将成为提高 Node.js 应用安全性的重要工具。在开发过程中合理利用这一功能，能极大地减少安全风险。

#### [Features](https://nodejs.org/docs/latest/api/permissions.html#features)

Node.js 是一个开源的、跨平台的 JavaScript 运行环境，它使得开发者可以使用 JavaScript 来编写服务端软件。从根本上来说，Node.js 让 JavaScript 能够脱离浏览器环境运行。这在过去是不可想象的，因为 JavaScript 传统上被视为一种只能在浏览器中运行的语言。

关于 Node.js v21.7.1 中的特性（Features），你提到的 URL 指向的是 Node.js 的权限管理系统的文档页面。基于你的要求，我将以通俗易懂的方式解释其中的一些概念，并给出实际应用的例子。

### 特性解释

Node.js v21.7.1 及其之后版本引入了一个新的权限管理系统。这个系统的设计目的是为了让 Node.js 应用运行时在安全方面有更细粒度的控制。通过这个系统，开发者能够限制代码执行期间对系统资源的访问，比如文件系统、网络请求等。

权限管理系统主要包含以下几个特性：

1. **文件系统访问权限**：这意味着你可以限制你的 Node.js 应用访问操作系统中的哪些文件和目录。这在处理用户上传的文件或者读取敏感信息时非常有用。

2. **网络请求权限**：你可以控制你的应用能否发起 HTTP/HTTPS 请求，以及它们能访问哪些网站或 API。这对于防止数据泄露或限制外部 API 调用很有帮助。

3. **进程创建权限**：这允许你限制 Node.js 应用创建新的系统进程的能力。这在避免恶意代码执行额外命令时非常重要。

### 实际应用例子

#### 文件系统访问权限

假设你正在构建一个在线文档编辑器，用户可以上传他们自己的文档进行编辑。为了保证系统的安全，你不希望你的 Node.js 应用能够访问服务器上的任意文件，仅限于用户上传的文件目录。通过设置文件系统访问权限，你可以确保即使有安全漏洞，攻击者也不能随意访问服务器上的其他文件。

```javascript
// 示例代码，假设我们使用某种假设的 API 设置权限
const permissions = require("node-permissions");

permissions.setFileSystemAccess("/path/to/uploaded/files", {
  read: true,
  write: true,
  execute: false,
});
```

#### 网络请求权限

考虑到另一个场景，你的应用需要从第三方服务获取天气信息。然而，为了防止代码中可能存在的安全问题导致应用被利用发起恶意请求，你希望限制应用只能向特定的几个 API 发送请求。

```javascript
// 示例代码，假设我们使用某种假设的 API 设置权限
const permissions = require("node-permissions");

permissions.setNetworkAccess(["https://api.weather.com"], {
  http: true,
  https: true,
});
```

#### 进程创建权限

如果你的 Node.js 应用需要对外提供某些转码服务，比如用户上传视频后转码。在这个过程中，你可能会借助系统命令调用转码工具。出于安全考虑，你希望限制应用只能调用特定的几个命令。

```javascript
// 示例代码，假设我们使用某种假设的 API 设置权限
const permissions = require("node-permissions");

permissions.setProcessCreation(["ffmpeg"], {
  allowed: true,
});
```

### 总结

通过上面的解释和示例，你可以看到 Node.js 中权限管理系统的作用是增加了一层安全性，使得开发者能够更细致地控制应用对系统资源的访问。这对于构建更加安全的应用和服务至关重要。请注意，上述代码示例并非真实存在的 API 调用，而是用于说明权限管理概念的假设代码。在实际开发中，你可能需要查阅最新的 Node.js 文档来了解如何正确实现类似功能。

##### [Error behavior](https://nodejs.org/docs/latest/api/permissions.html#error-behavior)

在 Node.js 中，处理错误是编写健壽、可靠应用程序的关键部分。Node.js v21.7.1 文档中的"Error behavior"部分专门讨论了如何处理在使用 Node.js 权限 API 时遇到的错误。

首先，我们来简单理解一下什么是 Node.js 的权限 API。Node.js 引入了一个权限 API，允许开发者在代码中检查和管理对操作系统特定功能的访问权限。这意味着你可以查询或限制你的 Node.js 应用程序可以执行哪些系统级别的操作（比如访问文件系统、网络通信等）。

### 错误行为

当你使用权限 API，尤其是当你查询或尝试修改权限时，可能会遇到错误。这些错误一般发生于以下几种情形：

1. **权限不足**：当你的应用尝试执行它没有被授权的操作时。
2. **API 不支持**：当你的代码运行在一个不支持某个权限 API 特性的平台上时。
3. **其他运行时错误**：包括但不限于系统资源不足、网络问题等。

### 实际运用的例子

#### 示例 1: 文件读取权限

假设你的 Node.js 应用需要读取系统里的一个文件，你可能会首先检查是否有权限读取该文件：

```javascript
const { access } = require("fs").promises;
const { constants } = require("fs");

async function checkReadAccess(file) {
  try {
    await access(file, constants.R_OK);
    console.log("可以读取文件");
  } catch (err) {
    console.error("没有读取文件的权限");
  }
}

checkReadAccess("./somefile.txt");
```

在这个例子中，如果没有读取文件`somefile.txt`的权限，错误处理机制会捕获到这一点，并且通过控制台输出相应的错误信息。

#### 示例 2: 网络访问权限

考虑另一个场景，你的应用试图向外部服务发起 HTTP 请求，但是没有足够的权限：

```javascript
const https = require("https");

https
  .get("https://example.com", (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      console.log(data);
    });
  })
  .on("error", (err) => {
    console.error("请求失败，可能是由于网络访问权限受限：", err.message);
  });
```

在这个例子里，如果网络请求因为权限问题而失败，错误处理逻辑将捕获这一错误并打印出来。

### 结论

错误处理是 Node.js 编程中一个非常重要的方面，尤其是当涉及到权限管理时。通过预先检查权限，以及优雅地处理可能发生的错误，可以显著提高应用的稳定性和用户体验。记住，不同的操作系统可能会有不同的权限模型，所以在跨平台开发时要特别注意。

##### [Integrity checks](https://nodejs.org/docs/latest/api/permissions.html#integrity-checks)

Node.js v21.7.1 中的“Integrity Checks”（完整性检查）是一项安全特性，用于确保你的应用程序只加载和执行那些未被篡改、且来源可信的代码。这一机制通过验证文件的完整性来工作，通常是通过比较文件的哈希值来完成的。如果文件在传输或存储过程中被修改，其哈希值也会发生变化，从而在进行完整性检查时被发现。

### 完整性检查的工作原理

1. **生成哈希值**：首先，对原始文件内容计算一个哈希值（例如，使用 SHA-256 算法）。这个哈希值被视为文件的数字指纹，可以唯一标识文件的内容。
2. **验证哈希值**：当需要使用该文件时（比如加载一个模块），将计算当前文件的哈希值，并与原始哈希值进行对比。如果两个哈希值匹配，说明文件未被篡改；如果不匹配，则会抛出错误，防止文件被加载或执行。

### 实际运用例子

#### 1. 安装第三方库或模块时的安全性验证

假设你正在开发一个 Node.js 应用程序，并想要安装一个第三方库，比如`lodash`。通过 npm 或 Yarn 等包管理器安装时，包管理器可以利用完整性检查来确保下载的`lodash`代码库未被篡改。这通常通过比对库的预计算哈希值与下载文件的哈希值来完成。

#### 2. 法规遵从和审计

某些应用程序可能需要遵守严格的数据处理和安全标准（如金融服务或医疗信息系统）。在这些场合，完整性检查提供了一个机制来证明系统中使用的所有代码都是已知且未经篡改的，有助于满足监管审核的需求。

#### 3. 自动化部署脚本的安全执行

当自动化部署应用到服务器时，通常会涉及到执行多个脚本，比如配置环境、安装依赖等。通过为这些脚本实施完整性检查，可以确保部署过程中执行的是正确且未被篡改的脚本代码，从而防止潜在的安全威胁。

通过这种方式，Node.js v21.7.1 的完整性检查功能为开发人员提供了一种机制，旨在增强应用程序和代码库的安全性，保护免受篡改和潜在的恶意攻击。

##### [Dependency redirection](https://nodejs.org/docs/latest/api/permissions.html#dependency-redirection)

Node.js 中的“Dependency Redirection”（依赖重定向）是一个相对较新的功能，使得开发者和应用程序能够以更细粒度的方式控制和管理它们所依赖的包或模块。在传统的 Node.js 环境中，当你安装并引入一个包时，这个包可能会依赖于其他多个包，形成一个复杂的依赖树。通常情况下，这个过程是透明的，但它可能导致一些问题，如版本冲突、难以追踪的安全问题等。

依赖重定向允许开发者显式地控制这些依赖关系，比如重定向到特定的版本，或者替换某些包以满足特定的安全性、兼容性要求。这增加了项目的灵活性和控制力，同时也有助于优化应用程序的性能和安全性。

### 实际运用示例：

#### 1. 版本冲突解决

假设你的项目依赖两个包：`packageA`和`packageB`。其中`packageA`依赖`lodash`版本为 4.17.15，而`packageB`依赖`lodash`的一个更高版本 4.17.20，这可能会导致版本冲突。通过使用依赖重定向，你可以强制所有的依赖都使用`lodash`的 4.17.20 版本，确保项目中`lodash`的调用都是一致的。

#### 2. 替换不再维护的包

设想你的项目依赖一个名为`old-library`的包，但这个包已经不再维护，并且存在已知的安全漏洞。幸运的是，社区中有一个名为`new-library`的替代品，不仅修复了这些安全漏洞，还提供了更好的性能。通过依赖重定向，你可以无缝地将`old-library`重定向到`new-library`，而不需要修改项目中任何原有的引用代码。

#### 3. 环境特定的依赖

在某些场景下，可能需要根据不同的运行环境（例如开发环境、测试环境和生产环境）来使用不同版本的包。例如，在开发环境中，你可能会使用一个包含额外调试信息的库的版本，而在生产环境中，则需要一个去除了调试信息、更优化的版本。通过依赖重定向，可以根据当前的运行环境动态地选择合适的包版本，从而在不牺牲开发效率的前提下，优化生产环境的性能和安全性。

### 如何实现依赖重定向

依赖重定向通常通过修改项目的配置文件（如`package.json`）来实现。具体的实现方式可能会随着 Node.js 的版本变化而变化，因此建议查阅最新的 Node.js 文档来获取准确的指导。

总结来说，依赖重定向是一个非常实用的机制，能够帮助开发者更好地控制和管理他们项目中的依赖关系，同时解决了一系列由依赖引起的问题，如版本冲突、安全漏洞等。通过恰当地使用这个功能，可以使项目保持更高的灵活性、稳定性和安全性。

##### [Example: Patched dependency](https://nodejs.org/docs/latest/api/permissions.html#example-patched-dependency)

Node.js 是一个非常流行的 JavaScript 运行环境，它允许你在服务器端运行 JavaScript 代码。Node.js 不仅仅是为了构建网站，它还可以用来开发各种工具和桌面应用程序。

首先，让我们来理解一下什么是依赖（Dependency）。在软件开发中，当我们创建项目时，往往会利用到一些已经被其他开发者编写好的代码库或者框架，这些就称为“依赖”。使用这些依赖可以帮助我们更快地完成开发任务，避免重复造轮子。

现在，假设有这样一个场景：我们的项目使用了一个名为 `libraryX` 的依赖库，但是在一次安全审计中发现 `libraryX` 存在安全漏洞。不幸的是，这个漏洞尚未被 `libraryX` 的维护者修复，或者修复了但是需要时间来发布新版本。作为项目负责人，我们自然不希望因为等待而暴露在安全风险之下，这时候我们可以通过打补丁的方式来解决问题。

在 Node.js v21.7.1 的文档中提到了一个关于如何给依赖打补丁的例子，“Patched dependency”，即“打补丁的依赖”：

1. **找到问题所在**：首先，我们需要确切知道 `libraryX` 中的哪部分代码存在问题。
2. **创建补丁**：接下来，基于对问题的理解，我们编写一个补丁。这个补丁是修改后的代码段，目的是修复这个安全漏洞而不影响 `libraryX` 的正常功能。
3. **应用补丁**：在 Node.js 中，我们可以使用多种方法来应用这个补丁。最简单的方式是直接修改 `node_modules/libraryX` 下的相应文件，但这种做法并不推荐，因为它会影响到版本控制和后续的依赖更新。更合适的方式是使用像 [`patch-package`](https://www.npmjs.com/package/patch-package) 这样的工具，它允许我们在项目中保留一个补丁文件(.patch)，并且在每次安装依赖时自动应用这个补丁。

### 实际例子

假设 `libraryX` 的 `utils.js` 文件中有一个函数 `parseData` 存在漏洞。以下是应用补丁的大致步骤：

1. **识别问题**：通过阅读代码、社区讨论或者安全通告，我们定位到 `parseData` 函数是问题根源。
2. **编写补丁**：我们编写了一个新的 `parseData` 函数，修复了原有的问题。
3. **使用 `patch-package` 工具**：
   - 首先，我们在本地修改 `node_modules/libraryX/utils.js` 文件，替换 `parseData` 函数。
   - 然后运行 `npx patch-package libraryX`，`patch-package` 会帮我们生成一个补丁文件，名为 `patches/libraryX+版本号.patch`。
   - 最后，我们将这个补丁文件加入版本控制系统，并确保在每次安装依赖时自动应用。具体地，我们可以在项目的 `package.json` 文件中的 `scripts` 部分添加 `"postinstall": "patch-package"`，这样每次运行 `npm install` 后都会自动执行 `patch-package`，应用所有补丁。

通过上述步骤，我们可以有效地解决依赖中的安全问题，同时不需要等待官方修复发布，也不会影响到项目的稳定性和可维护性。

#### [Scopes](https://nodejs.org/docs/latest/api/permissions.html#scopes)

Node.js v21.7.1 中的"Scopes"是在其权限 API 框架中的一个概念，它主要用于定义和控制代码运行时可以访问的资源和操作的范围。简单地说，Scope（作用域）就像是给你的代码分配了一个可以活动的小“园地”，在这个园地里，你的代码可以自由地执行操作，但如果想要访问或者执行园地外的东西，就需要得到额外的允许。

### Scopes 的实际运用例子

假设我们正在构建一个 Node.js 应用，这个应用需要从互联网上下载一些数据，并且处理这些数据。基于安全考虑，我们不希望这个过程中的任何代码能随意访问服务器上的文件系统，也不希望它能随意发起网络请求到未经批准的地址。这时，Scopes 就派上用场了。

#### 例子 1: 限制文件系统访问

当你的应用需要读取特定目录下的文件时，你可以通过设置一个适当的 Scope 来确保你的应用只有权限访问那个特定目录。这样，即使应用中有一段恶意代码试图访问其他目录的文件，由于没有相应的权限，这种访问会被阻止。

```javascript
const { readFileSync } = require("fs");

// 假设你的应用只允许读取'/allowed/directory' 目录下的文件
let safeReadFile = function (filePath) {
  if (!filePath.startsWith("/allowed/directory")) {
    throw new Error("Access denied");
  }
  return readFileSync(filePath);
};

// 此函数将成功读取指定目录下的文件
safeReadFile("/allowed/directory/info.txt");

// 但是尝试读取其他目录下的文件就会抛出错误
safeReadFile("/not/allowed/directory/secret.txt");
```

#### 例子 2: 控制网络请求

如果你的应用需要与外部服务进行通信，例如获取天气信息或发送电子邮件，你可以配置 Scope 以仅允许对这些已知和信任的服务进行网络请求。

```javascript
const https = require("https");

// 定义一个函数，只允许向特定的服务地址发起GET请求
function safeHttpGet(url) {
  const allowedHosts = ["api.weather.com", "mail.service.com"];

  const urlObj = new URL(url);
  if (!allowedHosts.includes(urlObj.host)) {
    throw new Error("Access denied to host: " + urlObj.host);
  }

  // 如果URL合法，继续发起请求
  https
    .get(url, (resp) => {
      let data = "";

      // 接收数据片段
      resp.on("data", (chunk) => {
        data += chunk;
      });

      // 数据接收完毕
      resp.on("end", () => {
        console.log(data);
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
}

// 此请求会成功，因为它请求了列表中的一个地址
safeHttpGet("https://api.weather.com/data");

// 这个请求则会失败，因为它尝试访问未经授权的地址
safeHttpGet("https://untrusted.source.com/data");
```

在以上例子中，我们手动控制了 Scope 的范围，但在 Node.js 的权限 API 中，这种权限控制可以更加细粒度化，甚至可以通过配置去管理，使得你的应用更加安全。这种机制对于构建大型应用、微服务或者在多租户环境下非常重要，因为它帮助确保了代码运行在一个受限制的环境中，从而降低了潜在的安全风险。

##### [Example](https://nodejs.org/docs/latest/api/permissions.html#example)

Node.js 是一种在服务器端运行 JavaScript 的平台，它允许开发者使用 JavaScript 来编写后端代码。这是一件很酷的事情，因为它意味着如果你已经熟悉 JavaScript，那么你就可以非常快速地开始开发全栈应用程序。Node.js v21.7.1 是 Node.js 的一个版本。

在 Node.js 中有一个相对较新的概念叫做权限 API（Permissions API）。这个 API 允许开发者在他们的应用中更细致地控制和管理权限。这是特别重要的，比如，在构建需要访问用户文件、网络资源或者其他敏感操作的应用时，确保安全性是至关重要的。

现在，让我们深入了解一个实际的例子来看看这是如何工作的：

```javascript
import { open } from "fs/promises";
import { permissions } from "node:permissions";

async function run() {
  if (
    (await permissions.query({
      name: "fs",
      path: "/some/file.txt",
      mode: "read",
    })) === "granted"
  ) {
    // 如果获得了读取 /some/file.txt 文件的权限
    const file = await open("/some/file.txt");
    console.log(await file.readFile({ encoding: "utf8" }));
    file.close();
  } else {
    // 如果没有获取权限
    console.error("Permission to read /some/file.txt was denied.");
  }
}

run();
```

在这个例子中，我们首先导入了必要的模块，包括文件系统 (`fs/promises`) 和新的权限 API (`node:permissions`)。

接下来，我们定义了一个异步函数 `run`，在这个函数里，我们首先尝试查询是否有权限读取位于 `/some/file.txt` 的文件。这是通过 `permissions.query()` 方法完成的，该方法接收一个对象，指定要查询的权限类型（在这个例子中是 `fs` 表示文件系统），路径以及访问模式（`read`）。

如果获得了相应的权限（即返回值为 `'granted'`），我们则通过 `open()` 方法打开文件，并读取其内容显示在控制台上。如果未获得权限，我们在控制台上打印一条错误消息。

这个例子展示了如何在 Node.js 应用中使用权限 API 来询问和根据用户权限执行不同的操作，这对于增强应用的安全性非常有帮助。

再举一个实际应用场景，想象你正在开发一个命令行工具，该工具需要访问系统上的某些文件进行读写操作。使用权限 API，你可以在尝试访问这些文件之前先查询用户是否给予了相应的权限，从而避免在权限不足时执行可能导致程序崩溃或不良行为的操作。这样既保护了用户的数据安全，又提升了用户体验。

##### [Integrity using scopes](https://nodejs.org/docs/latest/api/permissions.html#integrity-using-scopes)

Node.js v21.7.1 引入的“Integrity using scopes”是一个安全相关的特性，旨在通过限定代码运行时的权限来增强程序的安全性。这个功能基于一种叫做“最小权限原则”的概念，即每个部分（比如函数、模块）只应该有它执行所必需的最小权限集合。这样可以大大降低安全风险，比如减少恶意代码的攻击面。

#### 什么是作用域？

在 Node.js 中，作用域通常指的是变量和函数的可访问范围。在这里，“Integrity using scopes”指的是给特定的代码片段（比如一个模块或者一个函数）分配一个特定的权限集合，这些权限决定了这段代码可以做什么，不能做什么。

#### 如何使用"Integrity using scopes"

为了使用这个特性，你需要在你的 Node.js 应用中指定哪些代码需要哪些权限。这通常涉及到两个步骤：

1. **定义权限**：首先，你需要定义代码运行所需要的权限。这可能是文件系统的访问权限、网络请求的权限等等。

2. **应用权限**：然后，将这些权限应用到具体的代码块上。这样做的目的是确保代码块不会超出其被赋予的权限范围进行操作。

#### 实际运用例子

现在让我们通过一个简单的例子来理解这个概念：

假设你正在开发一个 Node.js 应用，这个应用需要完成两项任务：

1. 读取系统上的一个文件。
2. 发送一个网络请求。

根据最小权限原则，读取文件的代码块不应该有发送网络请求的权限，反之亦然。使用"Integrity using scopes"特性，你可以分别为这两个操作定义并应用不同的权限。

```javascript
const fs = require("fs").promises;
const https = require("https");

// 假设这个权限作用域对象是Node.js提供的方式来定义权限
let readFileScope = new PermissionScope({
  fileSystem: ["read"],
});

let httpRequestScope = new PermissionScope({
  network: ["http", "https"],
});

// 读文件操作，仅有文件系统读权限
readFileScope.run(async () => {
  let content = await fs.readFile("/path/to/file.txt", "utf8");
  console.log(content);
});

// 发送HTTP请求，仅有网络请求权限
httpRequestScope.run(() => {
  https
    .get("https://example.com", (resp) => {
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("end", () => {
        console.log(data);
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});
```

请注意，上述代码示例是概念性的，`PermissionScope` 和 `.run` 方法并不是真实存在的 API。实际的实现细节可能会有所不同，但核心思想是通过定义和应用权限作用域来限制代码片段的行为。

通过这种方式，即使某部分代码被恶意修改或者存在漏洞，由于它只拥有完成任务所必需的最小权限集合，其造成的潜在损害也会被最小化。这对于构建安全的应用程序来说至关重要。

##### [Dependency redirection using scopes](https://nodejs.org/docs/latest/api/permissions.html#dependency-redirection-using-scopes)

了解 Node.js 中的“Dependency redirection using scopes”之前，我们先梳理几个基本概念。

**Node.js** 是一个让 JavaScript 可以在服务器端运行的环境。它允许开发者使用 JavaScript 来写后端代码，从而实现前后端使用同一种语言。

**依赖（Dependency）**是指在你的项目中需要用到的外部代码库或包（package）。比如，如果你的项目需要处理时间，你可能会使用一个叫做`moment.js`的库来帮你更方便地处理时间。

在 Node.js v21.7.1 版本中提出的**依赖重定向（Dependency Redirection）**功能，特别地，在这里我们说的是通过作用域（scopes）进行重定向。这个功能让你有能力重新定义某个依赖包的来源。

### 为什么需要依赖重定向？

在大型项目中，可能会遇到需要使用不同版本的同一个依赖或从不同源获取依赖的情况。这时，直接管理这些依赖会变得复杂和困难。依赖重定向允许你更灵活地控制依赖来源及其版本，确保项目的稳定性和安全性。

### 如何工作？

依赖重定向通过修改项目的`package.json`文件或使用 Node.js 的配置来实现。你可以指定一个作用域（scope），它是 npm 包的命名空间，通常用于组织相关联的包。通过指定作用域，你可以控制来自该作用域的所有依赖项的来源。

### 实际运用例子

假设你正在开发一个 Node.js 应用，需要使用一个名为`example-package`的包，但是你希望从你的内部服务器而不是公共 npm 仓库加载它。

1. **创建作用域**: 首先，你可以为你的内部依赖创建一个作用域。例如，你可以命名为`@internal`.

2. **配置`package.json`**: 在你的`package.json`文件中，你可以添加以下配置：

   ```json
   {
     "name": "your-project",
     "version": "1.0.0",
     "dependencies": {
       "@internal/example-package": "1.0.0"
     },
     "imports": {
       "#internal/*": "https://your-internal-server.com/*"
     }
   }
   ```

   这里，`"@internal/example-package": "1.0.0"`指定了你希望使用的内部包及其版本。`"imports"`部分则告诉 Node.js 当遇到以`#internal/`开始的模块时，都从你的内部服务器加载。

3. **使用依赖**: 在你的代码中，你可以像使用其他依赖一样使用这个包：

   ```javascript
   import example from "#internal/example-package";
   ```

   这行代码会根据之前的配置，从你指定的内部服务器加载`example-package`包。

通过这种方式，你能确保你的应用总是使用正确的依赖版本，同时能够从你信任的源加载代码，增强了项目的安全性和可维护性。

总结起来，通过使用作用域对依赖进行重定向，Node.js 为开发人员提供了更高级别的控制权，使得管理复杂的依赖关系变得更加简单和安全。

##### [Example: import maps emulation](https://nodejs.org/docs/latest/api/permissions.html#example-import-maps-emulation)

要详细且通俗易懂地解释 Node.js 中的 import maps 模拟示例，我们首先需理解几个关键概念：Node.js、ES Modules（ESM）、以及 Import Maps 本身。

### 关键概念

#### Node.js

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，让开发者能够使用 JavaScript 来编写服务器端的代码。它是非阻塞的，事件驱动的，适合构建高性能的网络应用。

#### ES Modules (ESM)

ES Modules 是 ECMAScript 的官方标准模块系统。在此之前，CommonJS 是 Node.js 中主要使用的模块系统。与 CommonJS 不同，ESM 支持静态导入和导出，这使得代码更加高效和易于分析。

#### Import Maps

Import Maps 是一种浏览器功能，允许开发者控制模块标识符如何映射到具体的模块 URL。简而言之，通过 Import Maps，你可以指定导入语句中使用的名称应该如何被解析为实际的模块路径。这对于避免模块路径硬编码、实现模块别名或调整依赖项版本特别有用。然而，这是一个浏览器功能，并不直接由 Node.js 支持。

### Import Maps 模拟示例

在 Node.js v21.7.1 文档提及的“Import Maps 模拟”示例中，目标是在 Node.js 环境下模拟浏览器的 Import Maps 功能。

假设我们有以下场景：

- 项目中使用了一个名为`lodash-es`的库，它提供了很多实用的工具函数。
- 出于某些原因（比如减少项目大小），我们决定只使用该库的一个子集。

使用 Import Maps，我们可以创建一个映射，让所有对`lodash-es`的引用都转向我们自己定义的一个模块，在这个模块中，只导出`lodash-es`的一个子集。

在 Node.js 中，我们可以利用`--experimental-loader`标志和自定义的加载器脚本来实现这一点。加载器脚本会告诉 Node.js 如何处理特定的导入请求。

```javascript
// lodash-subset.js
export { chunk, compact } from "lodash-es";
```

上面的脚本创建了一个新的模块`lodash-subset.js`，它只从`lodash-es`中导出了`chunk`和`compact`两个函数。

接下来，我们使用 Node.js 的加载器功能来重写对`lodash-es`的所有导入请求，让它们指向我们的`lodash-subset.js`。

```javascript
// loader-script.mjs
import { pathToFileURL } from "url";

export async function resolve(specifier, context, defaultResolve) {
  if (specifier === "lodash-es") {
    return {
      url: pathToFileURL("./lodash-subset.js").href,
    };
  }
  //Le document provient de Ying Chao Tea. Ne pas utiliser à des fins commerciales.
  return defaultResolve(specifier, context, defaultResolve);
}
```

最后，在启动 Node.js 应用时，使用`--loader`标志指定我们的加载器脚本：

```
node --experimental-loader=./loader-script.mjs main.js
```

以上就是在 Node.js 中模拟 Import Maps 的一个实际例子。通过这种方式，我们可以控制模块的解析过程，实现类似于浏览器 Import Maps 的功能，从而增强代码的灵活性和可维护性。

#### [Guarantees](https://nodejs.org/docs/latest/api/permissions.html#guarantees)

Node.js v21.7.1 的文档中提到的"Guarantees"（保证）部分，是关于 Node.js 权限 API 的一个重要概念。这个权限 API 提供了一种方式来查询和控制 Node.js 程序可以进行哪些操作，例如访问文件系统、网络通信等。在解释这个概念之前，先简单介绍一下为什么会需要权限管理。

在软件开发中，尤其是网络应用和服务的开发过程中，安全性是一个非常重要的考虑因素。恶意代码或者滥用资源的情况可能会导致数据泄露、服务不可用等严重问题。因此，限制程序能够执行的操作范围，只允许它们执行必要的操作，就成了一个非常重要的安全措施。

Node.js 的权限 API 就是为了提供这样的功能。通过这个 API，开发者可以明确地控制他们的程序可以执行哪些类型的操作。"Guarantees"这个词在这里的意思是，Node.js 承诺会按照你通过权限 API 设置的规则来执行操作，从而保证程序的安全性。

### 实际运用的例子

1. **文件系统访问控制：** 假设你正在开发一个网页应用，这个应用需要读取服务器上的一些配置文件，但你不希望这个应用可以修改或者删除这些配置文件。通过 Node.js 的权限 API，你可以明确地限制这个应用只有读取文件的权限，没有写入或删除文件的权限。

2. **网络请求限制：** 如果你的应用包含了向外部 API 发送请求的功能，你可能想限制这个功能，使其只能访问特定的几个域名。通过权限 API，你可以实现这样的限制，确保你的应用不会被用来进行恶意网络活动。

3. **环境变量访问：** 环境变量通常用于存储敏感信息，比如数据库连接字符串等。使用 Node.js 的权限 API，你可以限制应用访问环境变量的能力，确保只有那些真正需要知道这些信息的部分代码才能访问它们。

总结来说，"Guarantees"在 Node.js 权限 API 文档中指的是 Node.js 承诺将遵循开发者通过 API 设置的规则，以确保程序按预期安全地运行。这为开发者提供了一个强大的工具，帮助他们构建更安全的应用。

## [Process-based permissions](https://nodejs.org/docs/latest/api/permissions.html#process-based-permissions)

Node.js v21.7.1 引入了一个新的功能：**进程基权限（Process-based permissions）**。这是一个安全特性，旨在提供更细粒度的权限控制来增强应用的安全性。

### 解释

在传统的 Node.js 应用中，所有代码都以相同的权限运行，通常是启动该应用的用户的权限。这种方式简单直接，但存在一定的安全风险。如果应用中的某一部分被恶意利用，整个应用及其执行环境可能都会受到影响。

为了解决这一问题，Node.js 引入了进程基权限。这允许开发者对不同的操作设置不同的权限。例如，你可以限制只有特定的代码能够访问文件系统、网络或者设置环境变量等。通过这种方式，即使应用的一部分遭到攻击，也能最大限度地减少潜在的损害。

### 实际运用举例

1. **文件读写权限控制**

   假设你正在开发一个 Web 应用，其中需要从服务器上读取一些敏感数据，如用户信息。你可以通过进程基权限确保只有负责处理用户请求的那部分代码具有读取该数据的权限。其他部分，例如处理用户界面的代码，则没有这样的权限，这就大大降低了敏感信息被泄露的风险。

2. **网络请求权限控制**

   如果你的应用需要向外部 API 发送请求获取数据，你可能不希望应用中的所有部分都能进行这种操作。通过设置适当的权限，你可以限制只有负责与外部服务通信的代码拥有发送网络请求的能力。这样一来，即使应用的其他部分被攻击，这些攻击者也无法利用你的应用发送恶意请求。

3. **环境变量访问控制**

   环境变量常用于存储敏感信息，如数据库密码或 API 密钥。通过进程基权限，你可以限制只有需要这些信息来建立连接的代码才能访问这些环境变量。这样，即使某个部分的代码被注入了恶意代码，攻击者也难以获取这些敏感信息。

### 如何使用

进程基权限通常涉及到使用 Node.js 的`permissions`模块。你可以通过这个模块查询和修改运行中进程的权限。这包括创建具有不同权限集的子进程，并限制这些子进程能执行哪些操作。

例如，创建一个只能进行网络请求的子进程可能看起来是这样：

```javascript
const { spawn } = require("child_process");
const { PermissionSet } = require("permissions");

// 定义一个只允许网络请求的权限集
const permissions = new PermissionSet(["net"]);

// 使用指定的权限集启动子进程
const child = spawn("node", ["some-script.js"], {
  env: { ...process.env, permissions: JSON.stringify(permissions) },
});

child.stdout.on("data", (data) => {
  console.log(`子进程输出：${data}`);
});
```

以上代码仅作示例，实际的`permissions` API 使用方法可能与此有所不同，具体请参考最新的 Node.js 文档。

### 结论

进程基权限是 Node.js 中的一项重要安全功能，它允许开发者为不同的操作分配不同的权限，从而在保持应用功能的同时，最大限度地提高安全性。这对于开发高安全性要求的应用尤为重要。

### [Permission Model](https://nodejs.org/docs/latest/api/permissions.html#permission-model)

Node.js v21.7.1 引入了一个新的权限模型，这是为了增加 Node.js 应用程序的安全性。在理解这个权限模型之前，让我们先简单了解一下为什么需要这样的模型。

在软件开发中，保护用户数据和系统安全是至关重要的。随着 JavaScript 和 Node.js 在网络应用、桌面应用、服务器端等领域的广泛使用，确保代码以安全的方式运行变得更加重要。传统上，Node.js 应用访问文件系统、网络等资源时，并没有严格限制，这意味着恶意代码或者第三方库可能会滥用这些权限，导致数据泄露或其他安全问题。

因此，Node.js v21.7.1 引入的权限模型旨在为开发人员提供更细粒度的控制，来限制代码对系统资源的访问。现在，我将通过几个实际运用的例子，来详细说明这个权限模型是如何工作的。

### 示例 1：文件系统访问限制

假设你正在开发一个 Node.js 应用程序，这个程序需要读取某个配置文件，但你不希望这个程序能够随意读取系统中的其他文件。

在引入权限模型之前，你可能只能依赖于操作系统的权限设置来限制访问，或者完全信任你的代码不会误操作。但是，利用新的权限模型，你可以显式地限制你的 Node.js 应用程序只能访问特定的文件。

### 示例 2：网络请求限制

想象一下，你的应用需要从外部 API 获取数据，但为了安全起见，你希望限制应用程序只能与特定的几个 API 进行通信。

使用新的权限模型，你可以设置策略，仅允许向指定的域名或 IP 地址发起网络请求。这样，即使应用程序中引入了未知的第三方库，也可以有效防止它们连接到未经授权的地址。

### 示例 3：子进程创建限制

在某些情况下，Node.js 应用可能需要创建子进程来执行其他任务。默认情况下，Node.js 允许应用程序自由地创建任何子进程，这可能被利用执行恶意程序。

利用新的权限模型，开发者可以限制应用程序只能启动白名单上的可信程序作为子进程。这为防止潜在的恶意行为提供了一层额外的安全防护。

### 如何实施？

实施这个新的权限模型涉及到在你的 Node.js 应用中明确定义哪些操作是被允许的。Node.js 文档中有详细的指南和 API 参考，可以帮助你设置这些权限。基本步骤包括：

1. **识别和定义**：首先，识别你的应用需要访问哪些资源（如文件系统、网络、子进程等），然后定义相应的权限策略。
2. **实施策略**：使用 Node.js 提供的 API 来实施这些策略。这可能包括编写配置文件或代码，明确指出哪些操作是被允许的。
3. **测试**：最后，通过测试来验证这些权限设置是否符合你的预期，确保它们既满足应用程序的需求，又不会过度限制，影响功能。

通过引入这种权限模型，Node.js v21.7.1 为开发者提供了更多的工具来构建安全的应用程序，同时给予了更细粒度的控制权，确保应用程序按照预期的方式安全地运行。

#### [Runtime API](https://nodejs.org/docs/latest/api/permissions.html#runtime-api)

Node.js 的版本 21.7.1 中的 Runtime API 主要关注于权限管理的功能。这是一个重要的特性，它让你能够更精细地控制和管理你的 Node.js 应用程序能够访问系统资源的权限。这意味着，你可以限制脚本对文件系统、网络、环境变量等的访问，以提高应用的安全性。

### 权限 API 的基本概念

在 Node.js 中，当你想要执行一些对系统资源有影响的操作时（比如读写文件、发送网络请求等），Runtime API 允许你检查和修改运行时的权限。这样，即使是在代码运行过程中，你也能够动态地控制权限，而不是让所有权限在应用启动时就完全打开。

### 实际运用示例

#### 示例 1：限制文件系统访问

假设你的 Node.js 应用需要读取一个配置文件，但你不希望这个应用读取或写入其他任何文件。你可以通过 Runtime API 设置权限，仅允许读取特定的文件路径。

```javascript
const fs = require("fs");
const { permissions } = require("node:permissions");

async function readConfigFile(filePath) {
  // 试图获取文件系统读权限
  const status = await permissions.query({
    name: "fs",
    path: filePath,
    mode: "read",
  });

  if (status.state === "granted") {
    // 如果权限被授予，则读取文件
    const data = fs.readFileSync(filePath, "utf8");
    console.log(data);
  } else {
    console.log("没有读取文件的权限");
  }
}

// 假设配置文件路径为'/path/to/config.json'
readConfigFile("/path/to/config.json");
```

#### 示例 2：网络请求限制

如果你的应用需要向外部 API 发送请求，但你想限制这些请求只能发送到特定的域名。你可以使用 Runtime API 来实现这个需求。

```javascript
const https = require("https");
const { permissions } = require("node:permissions");

async function fetchData(url) {
  // 分析URL以确定目标域名
  const hostname = new URL(url).hostname;

  // 试图获取网络访问权限
  const status = await permissions.query({ name: "net", host: hostname });

  if (status.state === "granted") {
    // 如果权限被授予，则发起请求
    https
      .get(url, (resp) => {
        let data = "";
        // 接收数据片段
        resp.on("data", (chunk) => {
          data += chunk;
        });
        // 所有数据接收完毕
        resp.on("end", () => {
          console.log(data);
        });
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
      });
  } else {
    console.log("没有网络请求的权限");
  }
}

// 试图从"https://example.com/api/data"获取数据
fetchData("https://example.com/api/data");
```

### 小结

通过以上示例，我们可以看到 Node.js 中的 Runtime API 如何在运行时动态地管理权限，从而提升应用的安全性。这种权限控制机制尤其适合那些需要高安全性、访问控制的应用场景。通过细粒度的权限管理，开发者能太显著减轻安全漏洞的风险。

##### [permission.has(scope[, reference])](https://nodejs.org/docs/latest/api/permissions.html#permissionhasscope-reference)

Node.js 是一个非常强大的 JavaScript 运行时环境，它允许你在服务器端运行 JavaScript。这意味着你可以用 JavaScript 创建网站后端、构建 API 等等。Node.js 的一个新特性是权限管理系统（Permissions API），它在 Node.js v16.5.0 中引入，并随后不断更新和改进。这个特性是为了增强安全性，使得开发者能更细致地控制代码对系统资源的访问。

### permission.has(scope[, reference])

在 Node.js v21.7.1 的文档中，`permission.has(scope[, reference])` 是 Permissions API 的一部分。这个方法用于检查程序是否具有执行特定操作的权限。这里的“权限”指的是对系统资源的访问权限，比如文件系统、网络请求等。

#### 参数详解

- `scope`: 这是一个字符串，表示所请求的权限范围。例如，如果你想检查应用是否有访问网络的权限，这个参数可能是 `'net'`。
- `reference`: 这个可选参数提供额外的上下文信息，帮助判断权限。根据不同类型的 `scope`，`reference` 的形式会有所不同。例如，若 `scope` 为文件系统访问（`'fs'`），`reference` 可能包含一个特定的文件或目录路径。

#### 使用例子

1. **检查文件系统访问权限**

假设你正在编写一个 Node.js 应用，需要读取某个文件：

```javascript
import { access } from "node:fs/promises";

async function checkFileAccess(filePath) {
  try {
    const permissions = await import("node:permissions");
    if (await permissions.default.has("fs", filePath)) {
      // 有权限访问 filePath 指向的文件
      console.log(`Access to ${filePath} is allowed.`);
      // 你可以在这里执行对文件的操作，比如读取文件内容
    } else {
      // 没有权限访问 filePath 指向的文件
      console.log(`Access to ${filePath} is denied.`);
    }
  } catch (err) {
    console.error(`An error occurred: ${err.message}`);
  }
}

// 使用此函数检查对特定文件的访问权限
checkFileAccess("./somefile.txt");
```

2. **检查网络访问权限**

如果你的 Node.js 应用需要连接到互联网上的某个 API，你可能想先确保你有进行网络请求的权限：

```javascript
async function checkNetworkAccess() {
  try {
    const permissions = await import("node:permissions");
    if (await permissions.default.has("net")) {
      // 有权限进行网络访问
      console.log("Network access is allowed.");
      // 在这里发起网络请求
    } else {
      // 没有权限进行网络访问
      console.log("Network access is denied.");
    }
  } catch (err) {
    console.error(`An error occurred: ${err.message}`);
  }
}

// 使用此函数检查网络访问权限
checkNetworkAccess();
```

通过这些示例，你可以看到 `permission.has(scope[, reference])` 方法是如何在实际应用中被使用来增强应用安全性的。这种基于权限的控制机制尤其重要，因为它有助于防止恶意软件或脚本未经授权地访问或修改系统资源。在开发 Node.js 应用时，合理利用这类安全特性能显著提升应用的安全性。

#### [File System Permissions](https://nodejs.org/docs/latest/api/permissions.html#file-system-permissions)

Node.js v21.7.1 中引入的文件系统权限是一个重要的概念，尤其对于在开发应用时需要处理文件操作的开发者来说。为了确保你可以理解这个概念，我会从它的基本含义开始讲起，并提供一些实际应用的例子。

### 什么是文件系统权限？

文件系统权限涉及到操作系统层面上对文件和目录的访问权限设置。这些权限决定了哪些用户和进程可以读取、写入或执行特定的文件和目录。在 Node.js 中，处理文件系统权限意味着你可以查询和修改这些权限，以符合你的应用需求。

### Node.js 中如何处理文件系统权限

Node.js 提供了`fs`模块（其中包括`fsPromises`API），允许你在 JavaScript 代码中直接与文件系统进行交互。这意味着你可以读写文件、创建目录、更改文件权限等。

#### 实际运用例子

1. **读取文件权限**

假设你正在开发一个应用，需要检查日志文件的权限，以确保它们只有应用本身可以读取和写入：

```javascript
const fs = require("fs/promises");

async function checkLogFilePermissions(path) {
  try {
    const stats = await fs.stat(path);
    // 使用掩码0o400判断文件是否可读
    if (stats.mode & 0o400) {
      console.log(`${path} is readable.`);
    } else {
      console.log(`${path} is not readable.`);
    }
  } catch (error) {
    console.error(`Error checking permissions for ${path}:`, error);
  }
}

checkLogFilePermissions("./log.txt");
```

2. **更改文件权限**

如果你发现一个文件的权限不是你所期望的，你可能想更改它，比如确保一个脚本文件是可执行的：

```javascript
const fs = require("fs/promises");

async function makeFileExecutable(path) {
  try {
    await fs.chmod(path, 0o755); // 设置文件为可读可执行
    console.log(`${path} is now executable.`);
  } catch (error) {
    console.error(`Error changing permissions for ${path}:`, error);
  }
}

makeFileExecutable("./script.sh");
```

3. **安全性考虑**

当你的应用需要修改文件权限时，务必小心谨慎。错误的权限设置可能导致安全漏洞，例如，如果你无意中将敏感文件设置为所有人都可以读写，那么这可能会被恶意用户利用。

### 总结

在 Node.js 中处理文件系统权限，让你能够构建更加安全、灵活的应用。通过使用`fs`模块，你可以读取和修改文件权限，为你的应用增加一层保护。记住，在修改任何文件或目录的权限时，都要考虑到潜在的安全风险。

#### [Permission Model constraints](https://nodejs.org/docs/latest/api/permissions.html#permission-model-constraints)

理解 Node.js 中的权限模型和其约束对于编写安全高效的代码至关重要。在 Node.js v21.7.1 版本中，引入了一种新的权限模型，目的是提供更细致、更可控的方式来限制 Node.js 程序可能获得的系统权限。这个模型有助于防止恶意代码执行不期望的操作或访问敏感数据。

### 权限模型的基本概念

简单来说，Node.js 的权限模型允许你限定代码运行时可以使用哪些系统资源（如文件系统、网络等）。通过这种方式，即使代码被恶意利用，攻击者也难以对系统造成严重损害，因为程序的执行权限被明确限制在了一个安全的范围内。

### 权限模型约束

权限模型的约束主要体现在以下几个方面：

1. **文件系统访问**：你可以指定代码对哪些文件或目录有读取、写入或执行权限。这样，即便是某个部分被攻破，攻击者也无法访问未授权的文件。

2. **网络请求**：可以控制代码能否发起网络请求，以及允许请求的目标地址。例如，你可以允许代码只与特定的 API 通信，避免数据泄露或恶意软件的传播。

3. **环境变量**：限定代码可以访问的环境变量。环境变量常用于存储敏感信息（如数据库密码），通过约束访问，增加了应用的安全性。

4. **子进程创建**：可以限制代码是否有权限启动新的子进程。这对于防止恶意代码执行额外的未授权命令非常有效。

### 实例应用

想象你正在开发一个 Web 应用，其中包含一个图片处理功能，用户上传图片，服务器进行处理后返回。使用 Node.js 的权限模型，你可以做到：

- **限制文件系统访问**：确保这个处理功能只能读取和写入指定的上传目录，即使存在漏洞，攻击者也无法通过这个功能访问服务器上的其他文件。

- **限制网络请求**：如果图片处理依赖于外部服务（比如发送图片到一个 API 进行分析），你可以限制只允许向这个特定 API 发出请求，避免被恶意利用发起对其他目标的攻击。

- **限制子进程创建**：如果图片处理需调用外部程序或脚本，通过限制子进程的创建，即便攻击者通过某些手段注入命令，也无法执行非授权的外部程序。

通过以上设置，即使应用出现安全漏洞，攻击者能够利用的空间也大为缩小，从而保护了系统的安全。

总结来说，Node.js 的权限模型为开发者提供了一个强大的工具，可以用来细粒度地控制应用的权限，极大地提升了应用的安全性。作为开发者，合理利用这些约束，可以帮助我们构建更加安全、可靠的应用。

#### [Limitations and Known Issues](https://nodejs.org/docs/latest/api/permissions.html#limitations-and-known-issues)

好的，开始解释 Node.js 的“限制和已知问题”，我们将重点放在 v21.7.1 版本中关于权限的部分。首先，简单明了地理解 Node.js：它是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，允许你在服务器端运行 JavaScript 代码。这意味着利用 Node.js，你可以构建后端服务（或者称为 API），这些服务可以被前端网页应用调用，来完成各种任务，例如读取数据库、处理文件等。

### 限制和已知问题

在 Node.js 的文档中提到的“限制和已知问题”特别指的是一些当前版本所面临的局限性或尚未解决的问题。对于编程新手而言，理解这些问题有助于避免在开发过程中遇到意外的挑战。

v21.7.1 中关于权限方面的限制和已知问题可能会涉及以下几个方面（注意，由于条目具体内容未直接给出，以下内容是根据常见的上下文进行推测的）：

1. **文件系统权限**:

   - 例子：当你的 Node.js 应用尝试访问系统中的文件或目录时，可能会因为没有足够的权限而失败。比如，尝试读取一个仅管理员有权限访问的文件时，如果 Node.js 进程没有以管理员身份运行，操作就会失败。

2. **网络请求权限**:

   - 例子：如果你的 Node.js 应用需要去请求外部的 API 或服务，可能会遇到跨域资源共享（CORS）的问题。虽然这更多是浏览器的安全策略，但是在某些情况下，Node.js 端也需要正确处理头信息，以确保请求能够成功。

3. **进程管理和权限**:

   - 例子：启动或停止系统级别的服务通常需要较高权限。如果你的 Node.js 应用包含了这类操作，那么在没有相应权限的情况下，这些操作就无法执行。

4. **第三方模块的权限限制**:
   - 例子：使用某些第三方模块时，可能会因为这些模块内部的权限要求而导致问题。比如，一个用于修改系统设置的模块可能需要管理员权限才能正常工作。

### 解决方案和建议

- 对于文件系统权限问题，确保你的 Node.js 应用运行在有适当权限的账户下，或通过代码逻辑检查和提示用户。

- 关于网络请求，熟悉并正确处理 CORS 相关的问题，可能需要设置适当的请求头或使用代理服务器绕过这些限制。

- 对于涉及到高权限的操作，考虑使用操作系统提供的机制（例如 sudo 在 Unix/Linux 系统）来提升权限，或者设计应用逻辑避免直接执行这些操作。

- 使用第三方模块时，仔细阅读其文档，了解其权限要求，并根据实际情况调整你的应用设计或部署策略。

理解这些限制和问题，可以帮助你在使用 Node.js 开发应用时更加灵活和有效地规遍问题，同时也有助于提升应用的安全性和稳定性。
