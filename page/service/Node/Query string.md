# [Query string](https://nodejs.org/docs/latest/api/querystring.html#query-string)

Node.js 中的 Query String 模块提供了一套用于解析和格式化 URL 查询字符串的实用工具。简单来说，查询字符串是位于 URL 中"?"后面的那部分文本，通常用来传递参数或数据给服务器。

假如你有一个网址（URL），比如：`http://example.com/over/there?name=ferret`，这里 `?name=ferret` 就是查询字符串，表示一个键值对，其中 `name` 是键，`ferret` 是值。

### 使用 Node.js 的 Query String 模块

首先，你需要引入 Node.js 的 querystring 模块：

```javascript
const querystring = require("querystring");
```

#### 解析查询字符串 (parse)

当你需要从查询字符串中获取数据时，你可以使用 `querystring.parse()` 方法。这个方法会将查询字符串转换为一个易于操作的对象。

例如：

```javascript
const qs = "name=ferret&color=purple";
const parsedQs = querystring.parse(qs);

console.log(parsedQs);
// 输出: { name: 'ferret', color: 'purple' }
```

在这个例子中，我们传递了一个查询字符串 `'name=ferret&color=purple'` 给 `querystring.parse()` 方法，并将返回的对象赋值给 `parsedQs`。这样，你就能通过 `parsedQs.name` 和 `parsedQs.color` 轻松访问到 `'ferret'` 和 `'purple'` 这两个值。

#### 格式化查询字符串 (stringify)

相反，如果你有一些数据（以对象的形式）并想将其转换成查询字符串的格式进行发送，你可以使用 `querystring.stringify()` 方法。

例如：

```javascript
const obj = { name: "ferret", color: "purple" };
const qs = querystring.stringify(obj);
//이 문서는 잉차오 차(Ying Chao Tea)에서 온 것입니다. 상업적으로 사용하지 마십시오.
console.log(qs);
// 输出: 'name=ferret&color=purple'
```

在这个例子中，我们将一个对象 `{ name: 'ferret', color: 'purple' }` 传递给 `querystring.stringify()` 方法，并将返回的查询字符串赋值给 `qs`。这样就生成了一个可用于 URL 的查询字符串。

### 实际运用示例

1. **Web 开发：** 在处理 GET 请求时，服务器可能需要解析 URL 中的查询字符串，以获取必要的参数。例如，用户筛选电商网站商品时的价格范围、颜色等筛选条件。

2. **API 请求：** 当你向一个提供 JSON 数据的 API 发送请求时，经常需要在查询字符串中携带搜索条件、分页信息等参数。

3. **日志记录与分析：** 跟踪 URL 请求中的查询参数，分析用户行为或优化网站结构。

使用 Node.js 的查询字符串模块，你可以方便地处理这些场景中的数据交互，使开发更加高效和灵活。

## [querystring.decode()](https://nodejs.org/docs/latest/api/querystring.html#querystringdecode)

Node.js 中的 `querystring.decode()` 函数是用来解析查询字符串（query string）的。查询字符串通常位于 URL 中`?`之后的部分，它们包含了一系列的键值对，每个键值对之间通常由`&`符号连接。

### 如何工作

具体到`querystring.decode()`函数，它将一个查询字符串转换成一个 JavaScript 对象，这样你就可以很方便地访问查询参数的值了。实际上，`querystring.decode()`函数是`querystring.parse()`函数的别名，两者的功能完全相同。

### 格式

假设我们有一个查询字符串：

```
"name=John%20Doe&age=30"
```

解码（decode）后应该得到：

```javascript
{
  name: 'John Doe', // 注意空格是如何被处理的
  age: '30'
}
```

### 示例

让我们通过具体的例子来展示`querystring.decode()`的使用。

#### 示例 1: 基本使用

假设您有一个 Web 应用程序，用户通过一个表单提交了他们的信息，这些信息随后被发送到服务器端的某个 API。URL 可能看起来像这样：

```
http://example.com/api/user?name=John%20Doe&age=30
```

在 Node.js 的服务器端代码中，您可能想要解析这个查询字符串以获取用户名和年龄：

```javascript
const querystring = require("querystring");

// 假设这是从URL获取的查询字符串
const qs = "name=John%20Doe&age=30";

// 使用querystring.decode()解析查询字符串
const parsedQs = querystring.decode(qs);

console.log(parsedQs);
// 输出: { name: 'John Doe', age: '30' }
```

#### 示例 2: 处理数组

如果查询字符串中包含数组，`querystring.decode()`也能够处理。假设查询字符串是这样的：

```
"item=apple&item=banana&item=cherry"
```

解析后会得到：

```javascript
const querystring = require("querystring");

const qs = "item=apple&item=banana&item=cherry";

const parsedQs = querystring.decode(qs);

console.log(parsedQs);
// 输出: { item: ['apple', 'banana', 'cherry'] }
```

#### 注意事项

- 解析出的值总是字符串，即使它们看起来像数字或其他类型。
- 如果你期望数字，你需要手动将它们转换成数字类型。
- `querystring.decode()`不会解析嵌套的对象，例如`user[name]=John&user[age]=30`。

### 结论

通过`querystring.decode()`，你可以轻松地将 URL 中的查询字符串转换为 JavaScript 对象，这在处理 HTTP 请求时非常有用。无论是在实现 API、读取页面参数还是任何需要解析查询字符串的场景中，它都是一个非常实用的工具。

## [querystring.encode()](https://nodejs.org/docs/latest/api/querystring.html#querystringencode)

Node.js 中的 `querystring.encode()` 函数是用于将一个对象序列化成一个查询字符串（也就是 URL 中问号`?`后面跟着的那部分）。这个功能在处理 Web 开发中的 GET 请求参数时特别有用。实际上，在 Node.js 的较新版本中，`querystring.encode()` 已经被认为是遗留的（legacy），并推荐使用新的 URLSearchParams API 来代替它。但理解 `querystring.encode()` 的工作原理仍然对于理解 Web 开发中 URL 的处理很有帮助。

### 基本概念

当您访问一个网页时，您的浏览器会向服务器发送一个请求。这个请求可以包含一些参数，告诉服务器您想要什么数据或者想要执行什么样的操作。这些参数通常以键值对的形式出现，并且通过查询字符串来传递。

### 例子

假设你正在开发一个电商网站，用户在搜索框里输入了要搜索的商品名称：“手机”。如果用户要通过 GET 请求（常见的 HTTP 请求类型之一，用于请求数据）发送这个搜索请求，您的应用需要生成包含搜索关键字的 URL，比如：

```
https://example.com/search?query=手机
```

在这个 URL 中，“`?query=手机`”就是查询字符串，它告诉服务器用户想要搜索“手机”。

### 使用 `querystring.encode()`

在 Node.js 中，如果你想从一个 JavaScript 对象生成这样的查询字符串，你可以使用 `querystring.encode()`。下面是如何使用它的一个示例：

```javascript
// 引入querystring模块
const querystring = require("querystring");

// 创建一个对象，代表要转换的键值对
let params = {
  query: "手机",
  limit: 10,
};

// 使用querystring.encode()生成查询字符串
let queryString = querystring.encode(params);

console.log(queryString);
// 输出: "query=%E6%89%8B%E6%9C%BA&limit=10"
```

在这个例子中，我们创建了一个名为`params`的对象，其中包含了两个键值对：`query`（用户搜索的内容）和`limit`（限制结果的数量）。调用`querystring.encode(params)`之后，我们得到了一个编码后的查询字符串："query=%E6%89%8B%E6%9C%BA&limit=10"。这里的编码（比如“手机”变成了“%E6%89%8B%E6%9C%BA”）是因为 URL 中只能包含有效的字符，因此对于中文和某些特殊字符进行了百分号编码。

### 总结

虽然现代开发中推荐使用`URLSearchParams`API 来处理查询字符串，了解`querystring.encode()`的工作方式仍对于理解 Web 开发中的 URL 处理非常有用。正如上面的例子所展示的，它允许我们从一个对象生成一个格式正确的、编码适当的查询字符串，这在处理 Web 请求中是非常常见的需求。

## [querystring.escape(str)](https://nodejs.org/docs/latest/api/querystring.html#querystringescapestr)

在解释`querystring.escape(str)`之前，让我们先理解一下什么是 Query String（查询字符串）以及为什么需要对其进行转义。

### 什么是 Query String

当你在浏览器中输入网址的时候，有时会看到 URL（统一资源定位符）的末尾附加了一些额外的信息，这部分以"?"开始，后面跟着一系列的参数，每个参数由键和值组成，通常用"&"分隔。这部分就是查询字符串，主要用于传递参数或者信息给服务器。

例如，在 URL `https://example.com/search?query=nodejs&sort=recent` 中，查询字符串为 `query=nodejs&sort=recent`，包含了两个参数：`query` 的值为 `nodejs` 和 `sort` 的值为 `recent`。

### 为什么需要转义 Query String

因为 URL 有一定的格式要求，而查询字符串可能包含特殊字符，如空格、"&"、"="等，这些特殊字符在 URL 中有特别的含义，如果直接使用它们会破坏 URL 的结构，导致服务器无法正确解析。所以，需要通过转义将这些特殊字符转换成服务器能够理解的形式。

### querystring.escape(str)

Node.js 中的`querystring.escape(str)`函数正是用于这种转义的。它将传入的字符串中的特殊字符转换成 URL 编码，使其可以安全地嵌入到 URL 的查询字符串中。

来看一个简单的例子：

```javascript
const querystring = require("querystring");

let param = "Hello World! & Goodbye.";
let escapedString = querystring.escape(param);

console.log(escapedString);
// 输出: Hello%20World%21%20%26%20Goodbye.
```

在这个例子中，我们试图将字符串`"Hello World! & Goodbye."`作为查询参数的一部分发送。由于该字符串中包含空格(" ")、感叹号("!")和与号("&")，直接使用会造成问题。使用`querystring.escape`处理后，得到的输出是`Hello%20World%21%20%26%20Goodbye.`，这样就可以安全地将其作为查询字符串的一部分了。

### 实际应用示例

假设你正在开发一个 Web 应用，用户需要通过表单搜索书籍名称，搜索项可能包含特殊字符。为了安全地将搜索项作为查询参数发送到服务器，你可以使用`querystring.escape`来转义用户的输入。

```javascript
const querystring = require("querystring");
const http = require("http");

http
  .createServer((req, res) => {
    let userInput = "The Great Gatsby & others"; // 假设这是用户输入
    let escapedInput = querystring.escape(userInput);

    let queryUrl = `https://example.com/search?query=${escapedInput}`;
    // 使用转义后的查询字符串构建请求URL

    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`` < `p>Encoded URL: ${queryUrl}` < `/p>`);
    res.end();
  })
  .listen(8080);
```

在这个例子中，通过将用户的输入转义后嵌入到查询 URL 中，就可以确保特殊字符不会破坏 URL 的结构，同时服务器也能够正确解析查询字符串中的参数。

## [querystring.parse(str[, sep[, eq[, options]]])](https://nodejs.org/docs/latest/api/querystring.html#querystringparsestr-sep-eq-options)

当然，让我来帮你深入理解 `querystring.parse()` 方法在 Node.js 中的应用。

### 什么是 Query String？

首先，我们得知道什么是 Query String。简单来说，Query String 是 URL（统一资源定位符）中的一部分，用于传递额外的参数给网页。它通常出现在 URL 的 "?" 后面，各个参数之间用 "&" 分隔。例如，在 URL `http://example.com/page?name=John&age=30` 中，`name=John&age=30` 就是 Query String，表示传递了两个参数：`name` 和 `age`。

### Node.js 中的 `querystring.parse()`

在 Node.js 中，`querystring.parse()` 函数用于将这样的 Query String 转换成一个易于操作的对象形式。这对于服务器处理客户端发来的查询字符串非常有用。

#### 参数解释

- **str**: 要被解析的 query string。
- **sep** (可选): 用于界定不同键值对的分隔符，默认为 `&`。
- **eq** (可选): 用于分隔键和值的字符，默认为 `=`。
- **options** (可选): 一个包含附加配置的对象。比如，可以通过设置 `maxKeys` 来限制解析出来的键的数量。

#### 使用示例

假设我们有一个 URL 的 Query String: `name=John&age=30`

如果你想在 Node.js 程序中解析这个字符串，代码大概长这样：

```javascript
const querystring = require("querystring");

// Query String
let str = "name=John&age=30";

// 使用 querystring.parse() 解析
let parsed = querystring.parse(str);

console.log(parsed);
```

输出会是：

```javascript
{ name: 'John', age: '30' }
```

你会得到一个对象，其中包含两个属性 `name` 和 `age`，它们分别对应着 Query String 中的键和值。

#### 更改分隔符

如果你的 Query String 使用不同的分隔符，比如使用 `;` 而非 `&`，你也可以这样解析：

```javascript
// 如果 Query String 是 "name=John;age=30"
let str = "name=John;age=30";
let parsed = querystring.parse(str, ";");
console.log(parsed);
```

这将正确解析使用 `;` 作为分隔符的字符串。

### 实际运用例子

1. **Web 应用程序中获取用户信息**：如果你正在开发一个 Web 应用，并希望根据 URL 中的 Query String 获取用户提供的信息，比如他们的偏好设置或者页面请求的特定部分。

2. **API 开发时过滤数据**：开发 RESTful API 时，你可能需要根据 URL 参数过滤返回的数据，例如 `/api/users?age=30` 可能意味着需要获取所有年龄为 30 的用户。这时 `querystring.parse()` 就可以派上用场了。

3. **日志分析与处理**：处理和分析网络日志时，经常会遇到需要从大量 URL 中提取特定信息的情况，使用 `querystring.parse()` 可以简化这一过程。

总之，`querystring.parse()` 是处理 HTTP 查询字符串的强大工具，无论是在开发 Web 应用、API 还是进行数据分析时都非常有用。

## [querystring.stringify(obj[, sep[, eq[, options]]])](https://nodejs.org/docs/latest/api/querystring.html#querystringstringifyobj-sep-eq-options)

当然，让我帮你理解 `querystring.stringify` 方法在 Node.js 中的用途和如何使用它。

### 什么是 `querystring.stringify`?

在 Web 开发中，我们经常需要在 URL 的查询字符串中发送数据。`querystring.stringify` 方法就是用来将一个对象转换成一个 URL 查询字符串的。这个方法来源于 Node.js 的 `querystring` 模块。

简单地说，如果你有一些数据（以键值对的形式组织）需要被附加到 URL 后面以便进行 GET 请求或其他操作，你就可以使用 `querystring.stringify` 方法来生成合适的查询字符串。

### 参数解释

- `obj`: 需要转换成查询字符串的对象。
- `sep` (可选): 用于分隔不同键值对的字符，默认为 `'&'`。
- `eq` (可选): 用于连接键和值的字符，默认为 `'='`。
- `options` (可选): 一个配置对象，用于进一步定制行为。

### 实际运用例子

#### 基本使用

假设你想将下面的对象：

```javascript
let myObject = {
  name: "John Doe",
  age: 30,
  city: "New York",
};
```

转换成一个查询字符串，以便将这些信息作为参数传递给一个网页或 API，你可以这样做：

```javascript
const querystring = require("querystring");

let queryString = querystring.stringify(myObject);

console.log(queryString);
// 输出: "name=John%20Doe&age=30&city=New%20York"
```

#### 使用自定义分隔符和连接符

如果你出于某种原因（如 API 要求）需要使用不同的分隔符和连接符，比如分隔符为 `;` 而连接符为 `:`，你可以这样做：

```javascript
let customQueryString = querystring.stringify(myObject, ";", ":");

console.log(customQueryString);
// 输出: "name:John%20Doe;age:30;city:New%20York"
```

#### 使用 options 参数

从 Node.js 14.0.0 版本开始，`querystring.stringify` 方法支持一个新的可选参数 `options`。其中一个有用的选项是 `encodeURIComponent`，这允许你指定一个自定义的函数来编码 URI 组件。

```javascript
let optionsQueryString = querystring.stringify(myObject, null, null, {
  encodeURIComponent: (string) => querystring.unescape(string), // 使用 unescape 对字符串进行解码
});

console.log(optionsQueryString);
// 注意输出可能会与期望不同，因为这里选择了一个特定于示例的编码方式。
```

### 小结

`querystring.stringify` 是 Node.js 中一个非常有用的工具，尤其是在处理 Web 应用和 API 时。它使得从复杂数据到 URL 查询字符串的转换变得简单快捷。通过调整参数和选项，你可以轻松定制生成的查询字符串，以满足各种需求。

## [querystring.unescape(str)](https://nodejs.org/docs/latest/api/querystring.html#querystringunescapestr)

理解 `querystring.unescape(str)` 的概念之前，首先要明白几个关键点：

1. **什么是 Query String？** 简单来说，Query String 是 URL（网址）中用于传递数据的一部分，紧跟在问号`?`后面，可以包含多个参数，各参数之间通常以`&`分隔。例如，在 URL `https://example.com/search?q=javascript&lang=en` 中，`q=javascript&lang=en` 就是 Query String。

2. **为什么要对字符进行转义和反转义？** 在 URI（统一资源标识符，如 URL）中，某些字符有特殊意义，如`?`、`&`、空格等。为了安全地传输那些可能被误解析的数据或特殊字符，我们需要将这些字符转换成一个由数字和字母组成的字符串（即*转义*）。相应地，接收方需要将这些转义后的字符*反转义*回原始形式以正确读取数据。

3. **Node.js 中的 `querystring.unescape` 函数作用是什么？** 它就是用于执行上述提到的反转义操作，即将转义后的 URL 查询字符串转换回它原本的形式。

现在，让我们通过具体的例子来看 `querystring.unescape(str)` 是如何工作的：

假设你有一个经过转义的 Query String，其中包含有特殊字符的数据，例如：

```
name=John%20Doe&city=New%20York
```

在这个例子中，`%20` 是空格字符的转义形式。如果你想在 Node.js 应用程序中处理这样的 Query String，获取实际的参数值（即将 `%20` 转换回空格），你可以使用 `querystring.unescape()` 方法。

### 使用步骤

1. **引入 `querystring` 模块：** 首先，需要引入 Node.js 中的 `querystring` 模块，因为 `unescape` 函数是这个模块提供的。

```javascript
const querystring = require("querystring");
```

2. **使用 `querystring.unescape()` 函数：** 然后，使用这个函数来反转义字符串。

```javascript
const qs = "name=John%20Doe&city=New%20York";
const unescapedQS = querystring.unescape(qs);

console.log(unescapedQS);
```

运行以上代码，输出结果将会是：

```
name=John Doe&city=New York
```

你可以看到，`%20` 被成功转换回空格，从而使得 Query String 更加易读和处理。

### 实际应用场景

- **API 调用：** 当你开发一个需要与其他服务交互的应用时，往往需要构造请求的 URL，包括 Query String。如果请求的参数中包含特殊字符，那么在发送请求之前需要对这些参数进行转义。而当你在服务端接收到这些请求时，可能又需要将 Query String 反转义，以便正确处理数据。
- **日志记录与分析：** 在处理或分析网站的访问日志时，URL 中的 Query String 往往是被转义的。为了更好地理解用户的搜索意图和行为，你可能需要将这部分数据反转义。

总结来说，`querystring.unescape()` 方法在处理那些包含特殊字符的 URL 数据时非常有用，它帮助开发者能够正确解析和使用这些数据。
