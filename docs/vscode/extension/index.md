---
title: Extension API
description: Visual Studio Code 拥有丰富的扩展 API。了解如何为 VS Code 创建你自己的扩展。
---

# Extension API

Visual Studio Code 从设计之初就将可扩展性作为核心理念。从 UI 到编辑体验，VS Code 的几乎所有部分都可以通过 Extension API 进行自定义和增强。事实上，VS Code 的许多核心功能本身就是以[扩展](https://github.com/microsoft/vscode/tree/main/extensions)的形式构建的，使用的也是同一套 Extension API。

本文档涵盖以下内容：

* 如何构建、运行、调试、测试和发布扩展
* 如何充分利用 VS Code 丰富的 Extension API
* 哪里可以找到帮助入门的[指南](https://code.visualstudio.com/api/extension-guides/overview)和[代码示例](https://github.com/microsoft/vscode-extension-samples)
* 遵循我们的 [UX 指南](/vscode/extension/ux-guidelines/overview)了解最佳实践

代码示例可在 [Microsoft/vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples) 获取。

如果你想查找已发布的扩展，请访问 [VS Code Extension Marketplace](https://marketplace.visualstudio.com/vscode)。

## 扩展能做什么？

以下是使用 Extension API 可以实现的一些示例：

* 通过颜色主题或文件图标主题改变 VS Code 的外观 - [主题](/vscode/extension/extension-capabilities/theming)
* 在 UI 中添加自定义组件和视图 - [扩展工作台](/vscode/extension/extension-capabilities/extending-workbench)
* 创建 Webview 以显示使用 HTML/CSS/JS 构建的自定义网页 - [Webview 指南](/vscode/extension/extension-guides/webview)
* 支持一种新的编程语言 - [语言扩展概览](/vscode/extension/language-extensions/overview)
* 支持调试特定运行时 - [调试器扩展指南](/vscode/extension/extension-guides/debugger-extension)

如果你想更全面地了解 Extension API，请参阅[扩展能力概览](/vscode/extension/extension-capabilities/overview)页面。[扩展指南概览](/vscode/extension/extension-guides/overview)也提供了代码示例和指南列表，展示了 Extension API 的各种用法。

## 如何构建扩展？

构建一个优秀的扩展可能需要大量的时间和精力。以下是 API 文档各部分能为你提供的帮助：

* **入门指南** 通过 [Hello World](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample) 示例教授构建扩展的基本概念。
* **扩展能力** 将 VS Code 庞大的 API 拆分为更小的类别，并引导你深入了解更详细的主题。
* **扩展指南** 包含解释 VS Code Extension API 特定用法的指南和代码示例。
* **UX 指南** 展示了在扩展中提供出色用户体验的最佳实践。
* **语言扩展** 通过指南和代码示例说明如何添加对编程语言的支持。
* **测试与发布** 包含关于各种扩展开发主题的深入指南，例如扩展的[测试](/vscode/extension/working-with-extensions/testing-extension)和[发布](/vscode/extension/working-with-extensions/publishing-extension)。
* **高级主题** 解释了诸如 [Extension Host](/vscode/extension/advanced-topics/extension-host)、[支持远程开发和 GitHub Codespaces](/vscode/extension/advanced-topics/remote-extensions) 以及 [Proposed API](/vscode/extension/advanced-topics/using-proposed-api) 等高级概念。
* **参考文档** 包含 [VS Code API](/vscode/extension/references/vscode-api)、[贡献点](/vscode/extension/references/contribution-points) 以及许多其他主题的详尽参考资料。

## 有哪些新特性？

VS Code 每月发布更新，Extension API 同样如此。每月都会推出新功能和 API，不断增强 VS Code 扩展的能力和范围。

要随时了解 Extension API 的最新动态，你可以查阅每月的发行说明，其中有专门的章节涵盖：

* [扩展开发](https://code.visualstudio.com/updates#_extension-authoring) - 了解最新版本中新增了哪些扩展 API。
* [提议中的扩展 API](https://code.visualstudio.com/updates#_proposed-extension-apis) - 审阅并对即将推出的提议 API 提供反馈。

## 寻求帮助

如果你在扩展开发方面有疑问，可以尝试在以下平台提问：

* [VS Code Discussions](https://github.com/microsoft/vscode-discussions)：GitHub 社区，用于讨论 VS Code 的扩展平台、提问、帮助社区其他成员并获取解答。
* [Stack Overflow](https://stackoverflow.com/questions/tagged/vscode-extensions)：已有[数千个问题](https://stackoverflow.com/questions/tagged/vscode-extensions)被标记为 `vscode-extensions`，其中超过一半已有答案。搜索你的问题、提问，或者通过回答 VS Code 扩展开发问题来帮助其他开发者！
* [VS Code Dev Slack](https://vscode-dev-community.slack.com)：面向扩展开发者的公共聊天室。VS Code 团队成员经常参与讨论。

如需对文档提供反馈，请在 [Microsoft/vscode-docs](https://github.com/microsoft/vscode-docs/issues) 创建新 issue。
如果你有找不到答案的扩展问题，或者遇到 VS Code Extension API 的相关 issue，请在 [Microsoft/vscode](https://github.com/microsoft/vscode/issues) 创建新 issue。
