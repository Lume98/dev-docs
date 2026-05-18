---
title: 扩展能力概述
description: 了解 Visual Studio Code 丰富的扩展（插件）API 能够实现哪些功能。
---

# 扩展能力概述

Visual Studio Code 为扩展提供了多种增强其能力的方式。有时很难找到合适的[扩展点](/vscode/extension/references/contribution-points)和 [VS Code API](/vscode/extension/references/vscode-api) 来使用。本主题将扩展能力分为以下几个类别。每个类别描述了：

- 你的扩展可以使用的一些功能
- 指向这些功能更详细主题的链接
- 一些扩展灵感

不过，为了确保 VS Code 的稳定性和性能，我们也对扩展施加了一些[限制](#restrictions)。例如，扩展无法访问 VS Code UI 的 DOM。

## 通用能力

[通用能力](./common-capabilities)是你可以在任何扩展中使用的核心功能。

这些能力包括：

- 注册命令、配置、键盘快捷键或上下文菜单项。
- 存储工作区或全局数据。
- 显示通知消息。
- 使用 Quick Pick 收集用户输入。
- 打开系统文件选择器，让用户选择文件或文件夹。
- 使用 Progress API 指示长时间运行的操作。

## 主题

[主题](./theming)控制 VS Code 的外观，包括编辑器中源代码的颜色和 VS Code UI 的颜色。如果你曾经想让 VS Code 变成《黑客帝国》那样不同层次的绿色，或者只是想创建一个极致简约的灰度工作区，那么主题就是为你准备的。

**扩展灵感**

- 更改源代码的颜色。
- 更改 VS Code UI 的颜色。
- 将现有的 TextMate 主题移植到 VS Code。
- 添加自定义文件图标。

## 声明式语言特性

[声明式语言特性](/vscode/extension/language-extensions/overview#declarative-language-features)为编程语言添加基本的文本编辑支持，例如括号匹配、自动缩进和语法高亮。这是以声明式方式完成的，无需编写任何代码。对于更高级的语言特性（如 IntelliSense 或调试），请参阅[编程式语言特性](#programmatic-language-features)。

**扩展灵感**

- 将常用的 JavaScript 代码片段打包成扩展。
- 让 VS Code 识别一种新的编程语言。
- 为编程语言添加或替换语法规则。
- 通过语法注入扩展现有语法。
- 将现有的 TextMate 语法移植到 VS Code。

## 编程式语言特性

[编程式语言特性](/vscode/extension/language-extensions/overview#programmatic-language-features)添加了丰富的编程语言支持，例如悬停提示、转到定义、诊断错误、IntelliSense 和 CodeLens。这些语言特性通过 [`vscode.languages.*`](/vscode/extension/references/vscode-api#languages) API 暴露。扩展可以直接使用这些 API，也可以编写 Language Server 并使用 VS Code [Language Server 库](https://github.com/microsoft/vscode-languageserver-node)将其适配到 VS Code。

虽然我们提供了[语言特性](/vscode/extension/language-extensions/programmatic-language-features)及其预期用法的列表，但没有什么能阻止你创造性地使用这些 API。例如，CodeLens 和悬停提示是内联展示额外信息的绝佳方式，而诊断错误则可以用来高亮拼写或代码风格错误。

**扩展灵感**

- 添加显示 API 示例用法的悬停提示。
- 使用诊断报告源代码中的拼写或 Linter 错误。
- 为 HTML 注册新的代码格式化器。
- 提供丰富的、上下文感知的 IntelliSense。
- 为某种语言添加折叠、面包屑导航和大纲支持。

## 工作台扩展

[工作台扩展](./extending-workbench)扩展 VS Code 的工作台 UI。你可以为文件资源管理器添加新的右键操作，甚至使用 VS Code 的 [TreeView](/vscode/extension/extension-guides/tree-view) API 构建自定义的资源管理器。如果你的扩展需要完全自定义的用户界面，可以使用 [Webview API](/vscode/extension/extension-guides/webview) 通过标准的 HTML、CSS 和 JavaScript 构建自己的文档预览或 UI。

**扩展灵感**

- 为文件资源管理器添加自定义上下文菜单操作。
- 在侧边栏中创建新的交互式 TreeView。
- 定义新的活动栏视图。
- 在状态栏中显示新信息。
- 使用 `WebView` API 渲染自定义内容。
- 提供源代码管理提供程序。

## 调试

你可以通过编写[调试器扩展](/vscode/extension/extension-guides/debugger-extension)来利用 VS Code 的[调试](/docs/debugtest/debugging)功能，将 VS Code 的调试 UI 连接到特定的调试器或运行时。

**扩展灵感**

- 通过提供 [Debug Adapter 实现](https://microsoft.github.io/debug-adapter-protocol/implementors/adapters/)将 VS Code 的调试 UI 连接到调试器或运行时。
- 指定调试器扩展支持的语言。
- 为调试器使用的调试配置属性提供丰富的 IntelliSense 和悬停信息。
- 提供调试配置代码片段。

另一方面，VS Code 还提供了一套[调试扩展 API](/vscode/extension/references/vscode-api#debug)，你可以利用它在任何 VS Code 调试器之上实现调试相关功能，从而自动化用户的调试体验。

**扩展灵感**

- 基于动态创建的调试配置启动调试会话。
- 跟踪调试会话的生命周期。
- 以编程方式创建和管理断点。

<!-- Add below content back after writing ./extending-core-functionalities.md  -->
<!-- ## Core Extensions

[Core Extensions](extending-core-functionalities) are for very advanced users. These let you build a custom back end for many of VS Code's low-level functionality. For example, the `FileSystem` API can be used to support working with files over FTP or other protocols. Core extensions typically work transparently from a user's point of view.

**Extension Ideas**

- Add support for working with remote files over FTP or SFTP.
- Register new source control provider, such as Mercurial.
- Implement a custom file search provider. -->

## UX 指南

为了让你的扩展无缝融入 VS Code 用户界面，请参考 [UX 指南](/vscode/extension/ux-guidelines/overview)，你将在其中学习创建扩展 UI 的最佳实践以及遵循 VS Code 首选工作流的约定。

## 限制

我们对扩展施加了一些限制。以下是这些限制及其目的。

### 无 DOM 访问

扩展无法访问 VS Code UI 的 DOM。你**不能**编写将自定义 CSS 应用到 VS Code 或向 VS Code UI 添加 HTML 元素的扩展。

在 VS Code，我们不断尝试优化底层 Web 技术的使用，以提供一个始终可用、高度响应的编辑器，并且随着这些技术和产品的发展，我们将继续调整我们对 DOM 的使用。为了确保扩展不会影响 VS Code 的稳定性和性能，以及我们能够继续改进 VS Code 的 DOM 而不破坏现有扩展，我们在 [Extension Host](/vscode/extension/advanced-topics/extension-host) 进程中运行扩展，并阻止对 DOM 的直接访问。

### 无自定义样式表

由用户或扩展提供的自定义样式表会依赖于 DOM 结构和类名。这些并没有被文档化，因为我们将其视为内部实现。为了演进、重构或改进 VS Code，我们需要自由地对用户界面进行更改。DOM 的任何更改都可能破坏现有的自定义样式表，导致样式表提供者的挫败感，以及因样式表损坏而出现的 UI 显示异常所带来的糟糕用户体验。

相反，VS Code 致力于提供设计良好的扩展 API 来支持 UI 自定义。该 API 有完善的文档、配套的工具和示例，并在 VS Code 的所有未来版本中保持稳定。
