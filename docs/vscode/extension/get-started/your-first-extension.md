---
title: 你的第一个扩展
description: 通过一个简单的 Hello World 示例，创建你的第一个 Visual Studio Code 扩展（插件）。
---

# 你的第一个扩展

在本节中，我们将教你构建扩展的基本概念。请确保已安装 [Node.js](https://nodejs.org) 和 [Git](https://git-scm.com/)。

首先，使用 [Yeoman](https://yeoman.io/) 和 [VS Code Extension Generator](https://www.npmjs.com/package/generator-code) 来搭建一个可直接开发的 TypeScript 或 JavaScript 项目。

- 如果你不想安装 Yeoman 以便后续使用，运行以下命令：

  ```bash
  npx --package yo --package generator-code -- yo code
  ```

- 如果你希望全局安装 Yeoman 以便反复使用，运行以下命令：

  ```bash
  npm install --global yo generator-code

  yo code
  ```

对于 TypeScript 项目，填写以下字段：

```bash
# ? What type of extension do you want to create? New Extension (TypeScript)
# ? What's the name of your extension? HelloWorld
### Press <Enter> to choose default for all options below ###

# ? What's the identifier of your extension? helloworld
# ? What's the description of your extension? LEAVE BLANK
# ? Initialize a git repository? Y
# ? Which bundler to use? unbundled
# ? Which package manager to use? npm

# ? Do you want to open the new folder with Visual Studio Code? Open with `code`

```

在编辑器中打开 `src/extension.ts`，然后按 `kb(workbench.action.debug.start)` 或从命令面板 (`kb(workbench.action.showCommands)`) 运行 **Debug: Start Debugging** 命令。这将在一个新的 **Extension Development Host** 窗口中编译并运行扩展。

在新窗口中从命令面板 (`kb(workbench.action.showCommands)`) 运行 **Hello World** 命令：

<video loop muted playsinline controls title="Launch your first VS Code extension video">
  <source src="/assets/api/get-started/your-first-extension/launch.mp4" type="video/mp4">
</video>

你应该会看到 `Hello World from HelloWorld!` 通知弹出。成功了！

如果你在调试窗口中看不到 **Hello World** 命令，请检查 `package.json` 文件，确保 `engines.vscode` 版本与已安装的 VS Code 版本兼容。

## 开发扩展

让我们修改一下消息内容：

1. 在 `extension.ts` 中将消息从 "Hello World from HelloWorld!" 改为 "Hello VS Code"。
1. 在新窗口中运行 **Developer: Reload Window**。
1. 再次运行 **Hello World** 命令。

你应该会看到更新后的消息。

<video loop muted playsinline controls title="Reload VS Code extension video">
  <source src="/assets/api/get-started/your-first-extension/reload.mp4" type="video/mp4">
</video>

以下是一些你可以尝试的内容：

- 在命令面板中为 **Hello World** 命令指定一个新名称。
- [注册](/vscode/extension/references/contribution-points)另一个命令，在信息消息中显示当前时间。Contribution Point 是你在 `package.json` [Extension Manifest](/vscode/extension/references/extension-manifest) 中做出的静态声明，用于扩展 VS Code，例如为扩展添加命令、菜单或快捷键绑定。
- 将 `vscode.window.showInformationMessage` 替换为另一个 [VS Code API](/vscode/extension/references/vscode-api) 调用来显示警告消息。

## 调试扩展

VS Code 内置的调试功能让调试扩展变得非常简单。点击代码行号旁边的边栏即可设置断点，VS Code 会在断点处暂停执行。你可以在编辑器中悬停查看变量，或使用左侧的 **Run and Debug** 视图检查变量值。Debug Console 允许你求值表达式。

<video loop muted playsinline controls title="Debug VS Code extension video">
  <source src="/assets/api/get-started/your-first-extension/debug.mp4" type="video/mp4">
</video>

你可以在 [Node.js 调试专题](/docs/nodejs/nodejs-debugging)中了解更多关于在 VS Code 中调试 Node.js 应用的内容。

## 下一步

在下一节 [扩展剖析](/vscode/extension/get-started/extension-anatomy) 中，我们将深入查看 `Hello World` 示例的源代码，并解释关键概念。

你可以在以下地址找到本教程的源代码：[https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample)。[扩展指南](/vscode/extension/extension-guides/overview)主题包含更多示例，每个示例演示不同的 VS Code API 或 Contribution Point，并遵循我们的 [UX 指南](/vscode/extension/ux-guidelines/overview)中的建议。

### 使用 JavaScript

在本指南中，我们主要介绍如何使用 TypeScript 开发 VS Code 扩展，因为我们认为 TypeScript 能为 VS Code 扩展开发提供最佳体验。不过，如果你更偏好 JavaScript，仍然可以参照 [helloworld-minimal-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-minimal-sample) 进行学习。

### UX 指南

现在也是回顾我们的 [UX 指南](/vscode/extension/ux-guidelines/overview)的好时机，这样你就可以从一开始就按照 VS Code 最佳实践来设计扩展的用户界面。
