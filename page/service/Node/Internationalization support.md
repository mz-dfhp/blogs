# [Internationalization support](https://nodejs.org/docs/latest/api/intl.html#internationalization-support)
国际化（Internationalization），常缩写为i18n（因为从字母i到n之间有18个字母），在软件开发中是指让你的应用支持多种语言和地区，而不需要为每一种语言或地区重新设计或编写你的应用程序。这对于创建全球可用的软件非常重要。

Node.js通过`Intl`对象提供内置的国际化支持，这是ECMAScript Internationalization API的一部分。这意味着你可以在Node.js中处理日期、时间、数字以及字符串比较等，这些都会根据不同的语言和地区进行适当的格式化和排序。

### 示例

让我们通过几个实际的例子来看看Node.js中的国际化支持如何工作：

#### 1. 日期和时间的格式化

假设你正在开发一个全球性的网站，需要显示当前的日期和时间。在美国，日期格式通常是月/日/年，而在大多数欧洲国家，则是日/月/年。使用Node.js的`Intl.DateTimeFormat`，你可以轻松地根据用户的地区来格式化日期。

```javascript
const now = new Date();

// 美国英语格式
console.log(new Intl.DateTimeFormat('en-US').format(now)); // 输出可能是 "4/5/2023"

// 德国德语格式
console.log(new Intl.DateTimeFormat('de-DE').format(now)); // 输出可能是 "05.04.2023"
```

#### 2. 数字的格式化

当你想要在不同国家展示价格或其他数字时，格式也会有所不同。例如，北美地区使用逗号作为千位分隔符，而大多数欧洲国家使用点或空格。

```javascript
const number = 1234567.89;

// 美国英语格式
console.log(new Intl.NumberFormat('en-US').format(number)); // 输出 "1,234,567.89"

// 法国法语格式
console.log(new Intl.NumberFormat('fr-FR').format(number)); // 输出 "1 234 567,89"
```

#### 3. 比较字符串

在不同的语言中，字符排序规则会有所不同。例如，在瑞典语中，"ä" 被视为字母表中最后的字母之一，但在其他语言中可能不是。

```javascript
const names = ['äpple', 'banana', 'cherry'];

// 英语排序
console.log(names.sort(new Intl.Collator('en').compare)); // 输出 ["banana", "cherry", "äpple"]

// 瑞典语排序
console.log(names.sort(new Intl.Collator('sv').compare)); // 输出 ["banana", "cherry", "äpple"]
```

通过这些例子，你可以看到Node.js中的国际化支持如何帮助你创建可以自然地适应不同语言和文化的全球应用。无论是格式化日期和时间、处理数字还是比较字符串，`Intl`对象都为你提供了强大的工具。这样，你可以专注于创建出色的功能，而不必担心国际化的复杂性。

## [Options for building Node.js](https://nodejs.org/docs/latest/api/intl.html#options-for-building-nodejs)
在Node.js中，构建选项允许你定制Node.js的安装，特别是在国际化（国际化是指软件产品能够适应不同地区、语言和文化的能力）方面。Node.js使用了一个名为ICU（International Components for Unicode）的库来实现国际化功能，这个库提供了对Unicode的支持，日期、时间、数字的格式化和解析，以及双向文本等功能。根据你的应用需求，可能需要对这部分功能进行定制。下面是在Node.js v21.7.1版本中，与构建Node.js相关的几个选项，以及它们的实际应用例子：

1. **小型ICU（Small-ICU）**：默认情况下，Node.js可能只包含英语或者一小部分语言的ICU数据，这被称为小型ICU。如果你的应用主要是面向英语用户，并且你想减少Node.js的安装大小，这是一个很好的选择。

   实际应用例子：一个仅面向英语国家用户的小型Web应用或API服务，可以选择小型ICU，从而减少部署大小和内存占用。

2. **完整ICU（Full-ICU）**：如果你希望你的应用支持多种语言，你可以在构建Node.js时选择包含完整的ICU数据。这样，你的应用就能够支持全球数百种语言的日期、时间和数字格式化等功能。

   实际应用例子：一个全球化电商平台需要支持多种语言，以便在不同国家展示产品价格、日期和促销信息，这就需要构建时选择完整ICU。

3. **使用系统ICU**：如果你的系统（如Linux发行版）已经安装了ICU，并且是最新或兼容版本，你可以配置Node.js在运行时使用系统ICU而不是内嵌的ICU。这可以帮助减少Node.js的安装大小，并利用系统级的更新和安全补丁。

   实际应用例子：在一些企业级部署中，系统管理员可能更倾向于管理系统级别的库，以确保所有应用都使用最新的安全补丁。在这种情况下，使用系统ICU会是一个更好的选择。

4. **Intl API的扩展**：Node.js通过ICU库提供了ECMAScript Internationalization API (Intl) 的实现。你可以根据需要在构建Node.js时选择启用或禁用特定的Intl API特性。

   实际应用例子：如果你正在开发一个需要进行复杂货币计算和展示的金融分析工具，可能会依赖Intl API提供的货币格式化功能。在这种情况下，确保构建Node.js时启用了这些特性会很重要。

理解这些构建选项和它们的实际应用对于开发能够高效运行在不同国家和文化环境中的Node.js应用至关重要。这不仅可以帮助提升用户体验，还可以确保应用的功能在全球范围内的一致性和可用性。

### [Disable all internationalization features (none)](https://nodejs.org/docs/latest/api/intl.html#disable-all-internationalization-features-none)
Node.js的国际化功能主要是指那些支持多种语言和地区设置的功能，比如日期、时间、货币格式的本地化，以及字符串的国际化处理等。这些功能对于开发需要在全球范围内使用的应用程序非常重要，因为它们能够让应用程序根据用户的地理位置和语言偏好来调整显示的信息。

然而，在某些情况下，你可能不需要这些国际化功能，或者为了简化你的应用程序、减少内存使用或提升性能，你可能想要禁用它们。在Node.js v21.7.1版本中，提供了一个选项来禁用所有的国际化功能，即通过设置一个特定的编译选项（none）。

这是一个比较高级和特殊的用法，一般来说，新手可能不太需要直接接触到这个功能。但是了解它存在，并知道如何在需要的时候使用它，是很有帮助的。

举个例子：

1. **性能优化**：如果你的Node.js应用程序主要针对一个语言区域，且不需要国际化支持，禁用这些功能可以减少Node.js运行时的内存占用和提升启动速度。

2. **简化部署**：在某些环境中，可能由于硬件资源限制，你希望尽可能减少应用的复杂度和资源占用。在这种情况下，去除不必要的国际化支持可以是一个选项。

要禁用所有国际化功能，你需要在编译Node.js的时候设置`--with-intl=none`选项。这意味着你需要从源代码编译Node.js，而不是直接使用预编译的二进制文件。这个过程比较复杂，通常只有对Node.js的构建和部署有深入了解的开发者才需要进行。

简单来说，这个功能让有特定需求的开发者能够优化他们的Node.js应用程序，虽然对于大多数应用和开发者来说，默认的国际化支持就已经足够好了。

### [Build with a pre-installed ICU (system-icu)](https://nodejs.org/docs/latest/api/intl.html#build-with-a-pre-installed-icu-system-icu)
Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，让你可以在服务器端运行 JavaScript 代码。Node.js 版本 21.7.1 中的 "Build with a pre-installed ICU (system-icu)" 是一个与国际化（Internationalization，简称 i18n）相关的特性。ICU 代表国际组件库（International Components for Unicode），是一个广泛使用的国际化库，提供了 Unicode 和全球化支持，如字符编码转换、日期/时间格式化、复数和性别规则处理等。

在 Node.js 中，ICU 使得处理多语言内容变得更加简单。默认情况下，Node.js 会内置一个较小的 ICU 数据集，以支持一些基本的国际化功能。但是，如果你需要更全面的国际化支持（例如，更多语言的日期格式化、货币格式化等），你可能需要使用一个预安装的、更完整的 ICU 库。

### 实际运用的例子：

1. **日期格式化**：如果你的应用程序需要支持多种语言环境，显示对应语言的日期格式。使用系统 ICU，你可以很容易地按照用户的语言偏好来格式化日期。

   ```javascript
   // 假设系统 ICU 支持德语和中文
   const { DateTimeFormat } = Intl;

   const dateFormatterDE = new DateTimeFormat('de-DE');
   console.log(dateFormatterDE.format(new Date())); // 输出德语日期格式
  // The document is from Ying Chao Tea.Do not use for commercial purposes.
   const dateFormatterZH = new DateTimeFormat('zh-CN');
   console.log(dateFormatterZH.format(new Date())); // 输出中文日期格式
   ```

2. **货币格式化**：在显示产品价格时，根据不同国家显示不同的货币格式。

   ```javascript
   const { NumberFormat } = Intl;

   const priceFormatterUS = new NumberFormat('en-US', { style: 'currency', currency: 'USD' });
   console.log(priceFormatterUS.format(1234567.89)); // "$1,234,567.89"

   const priceFormatterJP = new NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });
   console.log(priceFormatterJP.format(1234567.89)); // "￥1,234,568"
   ```

3. **字符串比较**：在进行字符串排序时，考虑到不同语言的字符排序规则，系统 ICU 能提供正确的字符串比较机制。

   ```javascript
   const { Collator } = Intl;
   const collator = new Collator('de');
   const words = ['ä', 'a', 'z'];
   words.sort(collator.compare);
   console.log(words); // 输出按德语排序的字符 ["a", "ä", "z"]
   ```

使用系统预安装的 ICU 而不是 Node.js 内置的小型 ICU，可以让你的应用更好地支持多语言环境，为全球用户提供更佳的体验。要启用这个功能，你可能需要在编译 Node.js 时指定使用系统 ICU，或者通过配置来指定使用系统级别的 ICU 库。

### [Embed a limited set of ICU data (small-icu)](https://nodejs.org/docs/latest/api/intl.html#embed-a-limited-set-of-icu-data-small-icu)
在Node.js中，ICU（International Components for Unicode）是一个非常重要的组件，用于提供国际化支持。这意味着借助ICU，Node.js可以处理不同语言和地区的数据，如日期、时间、数字的格式化和解析，以及字符串的比较和转换等。

在Node.js的v21.7.1版本中，`small-icu`提供了一种方式来嵌入一套有限的ICU数据。这是因为完整的ICU数据集非常庞大，而在很多应用场景中，我们只需要支持少数几种语言，而不是全部。通过使用`small-icu`，我们可以显著减小Node.js应用的体积，同时仍然保留对国际化的基本支持。

### 实际运用的例子

1. **全球化的Web应用**：假设你正在开发一个全球化的网站，需要支持英语和中文。你可以使用`small-icu`来嵌入这两种语言的数据，从而在不显著增加应用体积的情况下，实现日期和时间的正确格式化展示。

2. **命令行工具**：如果你正在开发一个命令行工具，该工具需要在不同地区根据用户的语言偏好来显示信息。通过使用`small-icu`，你可以选择性地包含几种主要的语言支持，以确保工具能够在不增加太多额外负担的情况下，正确地显示地区特定的日期、时间和数字格式。

3. **企业级应用**：在企业级应用中，通常需要对来自不同地区的数据进行处理和分析。使用`small-icu`可以帮助应用在处理特定地区的数据时，正确地进行格式化和解析，同时避免将整个ICU数据集包含在应用中，这对于维持应用的轻量化和高效运行至关重要。

### 如何使用`small-icu`

在Node.js中使用`small-icu`通常涉及到在编译Node.js时，使用特定的配置选项来指定包含哪些语言的ICU数据。这样，当你的应用运行时，它将只能支持那些已经嵌入的语言。这对于开发者来说，意味着需要在开发初期就明确哪些语言是应用必须支持的，以确保选择正确的ICU数据集。

总的来说，`small-icu`为Node.js应用提供了一种高效的方式来支持国际化，使得开发者可以根据自己的需要，灵活选择支持的语言范围，从而在保持应用轻量化的同时，不牺牲国际化的能力。

#### [Providing ICU data at runtime](https://nodejs.org/docs/latest/api/intl.html#providing-icu-data-at-runtime)
在 Node.js v21.7.1 中，ICU（International Components for Unicode）数据的运行时提供功能允许你在应用程序运行时动态地加载 ICU 数据。这意味着，你可以根据需要加载特定的国际化支持数据，而不是在构建 Node.js 时就包含所有可能的 ICU 数据。这样做的好处包括减少内存使用和应用程序的体积，以及提供更灵活的国际化支持。

### 为什么重要？

在全球化的应用开发中，支持多种语言和区域设置变得越来越重要。ICU 是一个常用于提供这种支持的库，因为它包含了大量的语言和文化规范数据。然而，全面支持所有语言和区域设置需要大量的数据，这可能会不必要地增加应用程序的大小和内存占用。

### 实际运用例子

1. **按需加载语言包：** 假设你正在开发一个多语言的网站，你可以根据用户的偏好或浏览器设置，只加载用户需要的语言数据。比如，如果一个用户指定他们偏好中文，你的应用可以在运行时仅加载中文的 ICU 数据，而不是所有支持的语言。

2. **动态国际化支持：** 在一个全球化的电商平台，你可能需要根据用户的地理位置显示不同的货币和日期格式。通过在运行时提供 ICU 数据，你的应用可以根据用户的位置动态地调整这些设置，而无需重启或重新部署。

3. **减少应用体积：** 如果你的应用只需要支持几种语言，则无需在构建时包含对所有语言的支持。通过在运行时加载所需的 ICU 数据，你可以显著减少应用的初始下载大小，使得首次加载速度更快。

### 如何实现？

在 Node.js 中，你可以使用 `full-icu` 包或通过 Node.js 的 `--icu-data-dir` 选项指定一个包含 ICU 数据的目录来动态加载 ICU 数据。这意味着你需要在你的应用初始化过程中确定哪些国际化数据是必需的，并确保这些数据在使用前被加载。

```javascript
// 示例：动态加载ICU数据
const icuDataDir = '/path/to/icu/data/';
process.env.NODE_ICU_DATA = icuDataDir; // 设置环境变量以指定ICU数据目录

// 然后，你可以正常使用国际化功能，如 Intl.DateTimeFormat 等
```

这种方法使得 Node.js 应用更加灵活，能够更好地适应多语言环境的需求，同时也优化了性能和资源利用。

### [Embed the entire ICU (full-icu)](https://nodejs.org/docs/latest/api/intl.html#embed-the-entire-icu-full-icu)
首先，让我们理解一下什么是ICU。ICU代表“国际化组件Unicode（International Components for Unicode）”，它是一套广泛使用的库，用于支持软件的国际化，比如处理多种语言文本、日期、时间格式等。

Node.js作为一个JavaScript运行环境，默认包含了一部分ICU功能，称之为“small-icu”。这就像是ICU的一个简化版本，能够满足基本的国际化需求，例如格式化日期和数字等。但是，对于更复杂的国际化需求，比如支持多种不同语言的排序、搜索以及额外的日期、数字格式化选项，这时候你就需要完整版的ICU了。

### Embed the entire ICU (full-icu)

当我们谈到在Node.js中嵌入完整的ICU（即full-icu），我们指的是将整个ICU库集成到你的Node.js应用程序中，这样就可以支持更广泛的国际化功能。

默认情况下，Node.js可能没有包括完整的ICU，因为这会显著增加二进制文件的大小。但是，如果你的应用程序需要丰富的国际化支持，那么添加full-icu就变得非常重要了。

### 如何嵌入完整的ICU

在Node.js v21.7.1，你可以通过几种方式来实现这一点:

1. **在编译Node.js时直接嵌入**: 如果你从源代码编译Node.js，可以使用配置选项来嵌入完整的ICU。这通常通过在编译命令中添加`--with-intl=full-icu`来完成。

2. **使用npm包**: 存在一个名为`full-icu`的npm包，它可以让你在不重新编译Node.js的情况下，将完整的ICU添加到你的项目中。安装该npm包后，你需要设置`NODE_ICU_DATA`环境变量，使其指向`full-icu`包提供的数据路径。

### 实际运用的例子

假设你正在开发一个全球化的网站，需要显示多种语言的内容，并且根据用户的地区显示相应的日期、时间格式和货币格式。

1. **日期格式化**: 在不同的国家/地区，日期的格式有很大差异。使用full-icu，你可以轻松地按照用户的本地习惯格式化日期。

```javascript
const { DateTimeFormat } = Intl;

const formatter = new DateTimeFormat('de-DE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
console.log(formatter.format(new Date())); // 输出: "9. Oktober 2023"（假设今天是2023年10月9日）
```

2. **多语言排序**: 当你的应用需要根据用户的语言偏好来排序字符串时，full-icu提供的本地化字符串比较功能非常有用。

```javascript
const names = ['Österreich', 'Andorra', 'Vietnam'];

// 在德语中排序
console.log(names.sort(new Intl.Collator('de').compare));
// 输出: ['Andorra', 'Österreich', 'Vietnam']

// 在越南语中排序
console.log(names.sort(new Intl.Collator('vi').compare));
// 输出: ['Andorra', 'Vietnam', 'Österreich']
```

通过这些例子，我们可以看到，嵌入完整的ICU为Node.js应用程序提供了强大的国际化支持，让你能够为全球用户创建更友好、更易于本地化的应用体验。

## [Detecting internationalization support](https://nodejs.org/docs/latest/api/intl.html#detecting-internationalization-support)
在 Node.js v21.7.1 中，`intl` 模块提供了用于确定环境是否支持国际化（Internationalization，简称 i18n）的功能。国际化是指软件的设计与开发，使其可以适应不同地区的语言和文化。了解你的 Node.js 环境是否支持国际化特别重要，因为这直接影响到你的应用能否正确处理不同地区的日期、时间、货币等。

### 如何检测国际化支持？

在 Node.js 中，可以通过检查 `Intl` 对象来确定环境是否支持国际化。`Intl` 对象是 ECMAScript 国际化 API 的一部分，提供了强大的字符串比较、数字格式化和日期/时间格式化能力。

以下是几个实用的例子：

#### 1. 检查基本的国际化支持

你可以简单地检查 `Intl` 对象是否存在来确定基本的国际化支持：

```javascript
if (typeof Intl !== 'undefined') {
  console.log('国际化支持已启用');
} else {
  console.log('国际化支持未启用');
}
```

#### 2. 检查特定功能的支持

国际化的不同方面（如日期时间格式化、数字格式化）可能需要检查具体的 `Intl` 对象的子对象，如 `Intl.DateTimeFormat` 或 `Intl.NumberFormat`。

```javascript
if (typeof Intl.DateTimeFormat !== 'undefined') {
  console.log('支持日期时间格式化');
}

if (typeof Intl.NumberFormat !== 'undefined') {
  console.log('支持数字格式化');
}
```

#### 3. 使用国际化功能的例子

##### 日期时间格式化

```javascript
const now = new Date();
console.log(new Intl.DateTimeFormat('zh-CN').format(now));
// 输出类似于 "2021/7/28"，具体格式根据你的环境和语言设置可能不同
```

##### 数字格式化

```javascript
console.log(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1234567.89));
// 输出 "$1,234,567.89"
```

##### 字符串比较（用于排序）

```javascript
const names = ['李明', 'Ángel', 'John', 'Jörg'];
console.log(names.sort(new Intl.Collator('zh-CN').compare));
// 根据中文排序规则对名字进行排序
```

### 小结

通过检查 `Intl` 对象及其子对象，你可以轻松确定 Node.js 环境对国际化的支持程度，并使用其提供的功能来处理多语言环境下的数据格式化和比较。这对开发面向全球用户的应用尤其重要。