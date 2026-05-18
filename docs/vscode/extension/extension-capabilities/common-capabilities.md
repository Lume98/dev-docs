---
title: 通用能力
description: Visual Studio Code 扩展（插件）可以利用的通用能力
---

# 通用能力

通用能力是扩展的重要构建模块。几乎所有的扩展都会使用其中一些功能。以下是你可以利用它们的方式。

## 命令

命令是 VS Code 工作方式的核心。你通过命令面板执行命令，将自定义键盘快捷键绑定到命令，以及右键单击在上下文菜单中调用命令。

扩展可以：

- 使用 [`vscode.commands`](/vscode/extension/references/vscode-api#commands) API 注册和执行命令。
- 通过 [`contributes.commands`](/vscode/extension/references/contribution-points#contributes.commands) 扩展点使命令在命令面板中可用。

在[扩展指南 / 命令](/vscode/extension/extension-guides/command)主题中了解更多关于命令的信息。

## 配置

扩展可以通过 [`contributes.configuration`](/vscode/extension/references/contribution-points#contributes.configuration) 扩展点提供扩展专属的设置，并使用 [`workspace.getConfiguration`](/vscode/extension/references/vscode-api#workspace.getConfiguration) API 读取这些设置。

## 键盘快捷键

扩展可以添加自定义键盘快捷键。在 [`contributes.keybindings`](/vscode/extension/references/contribution-points#contributes.keybindings) 和[键盘快捷键](/docs/getstarted/keybindings)主题中了解更多。

## 上下文菜单

扩展可以注册自定义上下文菜单项，这些菜单项将在右键单击 VS Code UI 的不同部分时显示。在 [`contributes.menus`](/vscode/extension/references/contribution-points#contributes.menus) 扩展点中了解更多。

## 数据存储

存储数据有五个选项：

- [`ExtensionContext.workspaceState`](/vscode/extension/references/vscode-api#ExtensionContext.workspaceState)：一个工作区存储，你可以在其中写入键值对。VS Code 负责管理该存储，并在再次打开相同工作区时恢复数据。
- [`ExtensionContext.globalState`](/vscode/extension/references/vscode-api#ExtensionContext.globalState)：一个全局存储，你可以在其中写入键值对。VS Code 负责管理该存储，并在每次扩展激活时恢复数据。你可以通过在 `globalState` 上使用 `setKeysForSync` 方法设置同步键，来选择性地同步全局存储中的键值对。
- [`ExtensionContext.storageUri`](/vscode/extension/references/vscode-api#ExtensionContext.storageUri)：一个指向本地目录的工作区专属存储 URI，你的扩展对其有读写权限。如果你需要存储只能从当前工作区访问的大文件，这是一个很好的选择。
- [`ExtensionContext.globalStorageUri`](/vscode/extension/references/vscode-api#ExtensionContext.globalStorageUri)：一个指向本地目录的全局存储 URI，你的扩展对其有读写权限。如果你需要存储可从所有工作区访问的大文件，这是一个很好的选择。
- [`ExtensionContext.secrets`](/vscode/extension/references/vscode-api#ExtensionContext.secrets)：一个用于机密信息（或任何敏感信息）的全局存储，数据将被加密。这些数据不会在机器之间同步。对于 VS Code 桌面版，这利用了 Electron 的 [safeStorage API](https://www.electronjs.org/docs/latest/api/safe-storage)。对于 VS Code Web 版，这使用了双密钥加密（DKE）实现。

扩展上下文在[扩展入口文件](/vscode/extension/get-started/extension-anatomy#extension-entry-file)的 `activate` 函数中可用。

### setKeysForSync 示例

如果你的扩展需要在不同的机器之间保留某些用户状态，可以使用 `vscode.ExtensionContext.globalState.setKeysForSync` 将状态提供给[设置同步](/docs/configure/settings-sync)。

你可以使用以下模式：

```TypeScript
// 在激活时
const versionKey = 'shown.version';
context.globalState.setKeysForSync([versionKey]);

// 稍后在展示页面时
const currentVersion = context.extension.packageJSON.version;
const lastVersionShown = context.globalState.get(versionKey);
if (isHigher(currentVersion, lastVersionShown)) {
    context.globalState.update(versionKey, currentVersion);
}
```

通过共享已关闭或已查看的标记，跨机器共享状态有助于避免用户多次看到欢迎页面或更新页面的问题。

## 显示通知

几乎所有扩展都需要在某个时刻向用户展示信息。VS Code 提供了三个 API 来显示不同严重程度的通知消息：

- [`window.showInformationMessage`](/vscode/extension/references/vscode-api#window.showInformationMessage)
- [`window.showWarningMessage`](/vscode/extension/references/vscode-api#window.showWarningMessage)
- [`window.showErrorMessage`](/vscode/extension/references/vscode-api#window.showErrorMessage)

## Quick Pick

使用 [`vscode.QuickPick`](/vscode/extension/references/vscode-api#QuickPick) API，你可以轻松地收集用户输入或让用户从多个选项中进行选择。[QuickInput 示例](https://github.com/microsoft/vscode-extension-samples/tree/main/quickinput-sample)展示了该 API 的用法。

## 文件选择器

扩展可以使用 [`window.showOpenDialog`](/vscode/extension/references/vscode-api#window.showOpenDialog) API 打开系统文件选择器，选择文件或文件夹。

## 输出通道

输出面板显示一组 [`OutputChannel`](/vscode/extension/references/vscode-api#OutputChannel)，非常适合用于日志记录。你可以通过 [`window.createOutputChannel`](/vscode/extension/references/vscode-api#window.createOutputChannel) API 轻松使用它。

## Progress API

你可以使用 [`vscode.Progress`](/vscode/extension/references/vscode-api#Progress) API 向用户报告进度更新。

可以使用 [`ProgressLocation`](/vscode/extension/references/vscode-api#ProgressLocation) 选项在不同的位置显示进度：

- 在通知区域
- 在源代码管理视图中
- VS Code 窗口中的通用进度

[Progress 示例](https://github.com/microsoft/vscode-extension-samples/tree/main/progress-sample)展示了此 API 的用法。
