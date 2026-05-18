---
title: 编写 Python 扩展
description: 使用 Python 扩展模板和 API 将代码检查工具、格式化工具和语言功能集成到 Visual Studio Code 中
---
# 编写 Python 扩展

>**注意**：如果你是首次编写 VS Code 扩展，建议先阅读[你的第一个扩展](/vscode/extension/get-started/your-first-extension)教程，并尝试创建一个简单的 Hello World 扩展。

[Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) 扩展提供了 API，使其他扩展能够与用户机器上可用的 Python 环境进行交互。请查看 [@vscode/python-extension](https://www.npmjs.com/package/@vscode/python-extension) npm 模块，其中包含类型定义和辅助工具，方便你从扩展中访问这些 API。

## Python 扩展模板

[Python 扩展模板](https://github.com/microsoft/vscode-python-tools-extension-template)可帮助你快速开始为你喜爱的 Python 工具构建 Visual Studio Code 扩展。它可以是一个代码检查工具、格式化工具、代码分析工具，或者将以上功能组合在一起。该模板提供了构建扩展所需的基本模块，使你的工具能够集成到 VS Code 中，并且已经可以访问上文提到的 Python API。

## 编程语言和框架

扩展模板包含两部分：扩展部分和语言服务器部分。扩展部分使用 TypeScript 编写，语言服务器部分使用 Python 编写，基于 `pygls`（Python 语言服务器）库。

使用此模板时，你主要会在代码的 Python 部分进行开发。你将使用 [Language Server Protocol](https://microsoft.github.io/language-server-protocol) 将你的工具与扩展部分集成。`pygls` 目前基于 [LSP 3.16 版本](https://microsoft.github.io/language-server-protocol/specifications/specification-3-16)。

TypeScript 部分负责与 VS Code 及其 UI 进行交互。扩展模板内置了一些可供你的工具使用的设置。如果需要添加新设置来支持你的工具，则需要处理一些 TypeScript 代码。扩展模板中有一些设置的示例，你也可以查看我们团队为一些流行工具[开发的扩展](#示例)。

## 环境要求

1. VS Code 1.64.0 或更高版本
1. Python 3.7 或更高版本
1. node >= 14.19.0
1. npm >= 8.3.0（`npm` 随 node 一起安装，请检查 npm 版本，使用 `npm install -g npm@8.3.0` 来更新）
1. 用于 VS Code 的 [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) 扩展

你应该了解如何创建和使用 Python 虚拟环境。

## 入门指南

要开始使用，请按照模板 [README](https://github.com/microsoft/vscode-python-tools-extension-template#readme) 中的说明操作。在那里你将了解如何[使用模板创建你的仓库](https://docs.github.com/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)，以及如何安装必要的工具（例如 [nox](https://nox.thea.codes) 任务运行器）和可选依赖（测试支持）。

[README](https://github.com/microsoft/vscode-python-tools-extension-template#readme) 包含最新的说明，并详细介绍了如何自定义扩展 `package.json` 中的占位符（`<pythontool-module>`、`<pythontool-display-name>` 等）。

## 模板功能

通过模板创建扩展后，它将包含以下扩展贡献。假设 `<pytool-module>` 被替换为 `mytool`，`<pytool-display-name>` 被替换为 `My Tool`：

1. 一个命令 **My Tool: Restart Server**（命令 ID：`mytool.restart`）。
1. 以下设置：
    * `mytool.logLevel`
    * `mytool.args`
    * `mytool.path`
    * `mytool.importStrategy`
    * `mytool.interpreter`
    * `mytool.showNotification`
1. 以下扩展激活触发条件：
    * 语言为 `python` 时。
    * 打开的工作区中存在 `.py` 扩展名的文件时。
    * 执行命令 `mytool.restart` 时。
1. 用于日志记录的输出通道 **输出** > **My Tool**。

## 集成你的工具

生成的 `bundled/tool/server.py` 文件是你进行大部分修改的地方。文件中的 `TODO` 注释指出了各种自定义点。同时也要在模板的其他位置搜索 `TODO` 注释，例如其他 Python 和 Markdown 文件。你应该审查 LICENSE 文件，即使你打算继续使用 MIT 许可证。

## 示例

以下是基于该模板创建的几个示例实现：

* [Pylint](https://github.com/microsoft/vscode-pylint/tree/main/bundled/tool) — 在文件 `打开`、`保存` 和 `关闭` 时实现代码检查和代码操作（Code Actions）。
* [Flake8](https://github.com/microsoft/vscode-flake8/tree/main/bundled/tool) — 实现代码检查和代码操作。
* [Black Formatter](https://github.com/microsoft/vscode-black-formatter/tree/main/bundled/tool) — 集成 [*Black*](https://github.com/python/black) 格式化工具。
* [autopep8](https://github.com/microsoft/vscode-autopep8/tree/main/bundled/tool) — 集成 [autopep8](https://pypi.org/project/autopep8) 格式化工具。
* [isort](https://github.com/microsoft/vscode-isort/blob/main/bundled/tool) — 添加排序 import 的代码操作。

你还可以查阅 [Language Server Protocol 规范](https://microsoft.github.io/language-server-protocol/specifications/specification-3-16)，以更好地理解 `pygls` 语言服务器集成。

## 扩展开发

模板的 README 详细介绍了模板自带的[开发周期支持](https://github.com/microsoft/vscode-python-tools-extension-template#debugging)。模板提供了相应的命令和配置，方便你构建、运行、调试和测试扩展。

如果在开发过程中遇到问题，可以参考[故障排除](https://github.com/microsoft/vscode-python-tools-extension-template#troubleshooting)部分来帮助解决常见问题。

## 打包和发布

在发布扩展之前，你需要更新扩展 `package.json` 中的字段（如 `publisher` 和 `license`）。你还应更新辅助的 Markdown 文件（`CODE_OF_CONDUCT.md`、`CHANGELOG.md` 等）。

扩展准备就绪后，可以使用 `nox` 的 `build-package` 任务来创建 `.vsix` 文件，然后将其上传到扩展的[管理页面](https://marketplace.visualstudio.com/manage)。

如果你是首次创建和发布 VS Code 扩展，我们建议你遵循 VS Code 主要的[扩展开发](/vscode/extension/working-with-extensions/publishing-extension#advanced-usage)主题中概述的最佳实践。在那里你可以找到让扩展在 Marketplace 上脱颖而出的指导，以及如何成为经过验证的发布者，让用户放心安装你的扩展。
