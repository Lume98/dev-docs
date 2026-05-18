---
title: 激活事件
description: 为了支持 Visual Studio Code 扩展（插件）的延迟激活，你的扩展通过一组激活事件来控制何时加载。
---

# 激活事件

**激活事件** 是你在 `package.json` [扩展清单](/vscode/extension/references/extension-manifest)的 `activationEvents` 字段中声明的一组 JSON 声明。当某个 **激活事件** 发生时，你的扩展将被激活。以下是所有可用的 **激活事件** 列表：

- [`onAuthenticationRequest`](/vscode/extension/references/activation-events#onAuthenticationRequest)
- [`onChatParticipant`](/vscode/extension/references/activation-events#onChatParticipant)
- [`onCommand`](/vscode/extension/references/activation-events#onCommand)
- [`onCustomEditor`](/vscode/extension/references/activation-events#onCustomEditor)
- [`onDebug`](/vscode/extension/references/activation-events#onDebug)
  - [`onDebugAdapterProtocolTracker`](/vscode/extension/references/activation-events#onDebugAdapterProtocolTracker)
  - [`onDebugDynamicConfigurations`](/vscode/extension/references/activation-events#onDebugDynamicConfigurations)
  - [`onDebugInitialConfigurations`](/vscode/extension/references/activation-events#onDebugInitialConfigurations)
  - [`onDebugResolve`](/vscode/extension/references/activation-events#onDebugResolve)
- [`onEditSession`](/vscode/extension/references/activation-events#onEditSession)
- [`onFileSystem`](/vscode/extension/references/activation-events#onFileSystem)
- [`onIssueReporterOpened`](/vscode/extension/references/activation-events#onIssueReporterOpened)
- [`onLanguage`](/vscode/extension/references/activation-events#onLanguage)
- [`onLanguageModelTool`](/vscode/extension/references/activation-events#onLanguageModelTool)
- [`onNotebook`](/vscode/extension/references/activation-events#onNotebook)
- [`onOpenExternalUri`](/vscode/extension/references/activation-events#onOpenExternalUri)
- [`onRenderer`](/vscode/extension/references/activation-events#onRenderer)
- [`onSearch`](/vscode/extension/references/activation-events#onSearch)
- [`onStartupFinished`](/vscode/extension/references/activation-events#onStartupFinished)
- [`onTaskType`](/vscode/extension/references/activation-events#onTaskType)
- [`onTerminal`](/vscode/extension/references/activation-events.md#onTerminal)
    - [`onTerminalProfile`](/vscode/extension/references/activation-events#onTerminalProfile)
    - [`onTerminalShellIntegration`](/vscode/extension/references/activation-events.md#onTerminalShellIntegration)
- [`onUri`](/vscode/extension/references/activation-events#onUri)
- [`onView`](/vscode/extension/references/activation-events#onView)
- [`onWalkthrough`](/vscode/extension/references/activation-events#onWalkthrough)
- [`onWebviewPanel`](/vscode/extension/references/activation-events#onWebviewPanel)
- [`workspaceContains`](/vscode/extension/references/activation-events#workspaceContains)
- [`*`](/vscode/extension/references/activation-events#Start-up)

我们还提供了 [`package.json` 扩展清单](/vscode/extension/references/extension-manifest)中所有字段的参考。

## onLanguage

当打开一个解析为特定语言的文件时，将触发此激活事件，相关扩展将被激活。

```json
"activationEvents": [
    "onLanguage:python"
]
```

`onLanguage` 事件接受一个[语言标识符](/docs/languages/identifiers)值。

可以在 `activationEvents` 数组中通过单独的 `onLanguage` 条目声明多种语言。

```json
"activationEvents": [
    "onLanguage:json",
    "onLanguage:markdown",
    "onLanguage:typescript"
]
```

> **注意**：从 VS Code 1.74.0 开始，你的扩展贡献的语言不再需要相应的 `onLanguage` 激活事件声明即可激活扩展。

此外，如果你的扩展需要在使用任何语言之前激活，可以使用通用的 `onLanguage` 激活事件来确保这一点：

```json
"activationEvents": [
    "onLanguage"
]
```

> **注意**：最佳实践是仅在用户需要你的扩展时才激活。如果你的扩展只适用于一部分语言，最好列出该子集，而不是在所有语言上激活。

## onCommand

当某个命令被调用时，将触发此激活事件，相关扩展将被激活：

```json
"activationEvents": [
    "onCommand:extension.sayHello"
]
```

> **注意**：从 VS Code 1.74.0 开始，你的扩展贡献的命令不再需要相应的 `onCommand` 激活事件声明即可激活扩展。

## onDebug

在调试会话启动之前，将触发此激活事件，相关扩展将被激活：

```json
"activationEvents": [
    "onDebug"
]
```

还有四个更细粒度的 `onDebug` 激活事件：

### onDebugAdapterProtocolTracker

当具有特定类型的调试会话即将启动且可能需要调试协议跟踪器时，`onDebugAdapterProtocolTracker` 被触发。

### onDebugDynamicConfigurations

当 `DebugConfigurationProvider` 的 `provideDebugConfigurations` 方法即将被调用以提供动态调试配置时（例如用户通过 UI 请求时，如使用"选择并开始调试"命令），此激活事件被触发。

此激活事件的存在被用作扩展贡献动态调试配置的信号。

### onDebugInitialConfigurations

当 `DebugConfigurationProvider` 的 `provideDebugConfigurations` 方法即将被调用以提供初始调试配置时（例如需要创建 `launch.json` 时），此激活事件被触发。

### onDebugResolve

`onDebugResolve:type` 在指定类型的 `DebugConfigurationProvider` 的 `resolveDebugConfiguration` 方法即将被调用之前触发。

**经验法则**：如果调试扩展的激活是轻量级的，使用 `onDebug`。如果是重量级的，则根据 `DebugConfigurationProvider` 是否实现了 `provideDebugConfigurations` 和/或 `resolveDebugConfiguration` 方法，使用 `onDebugInitialConfigurations` 和/或 `onDebugResolve`。有关这些方法的更多详细信息，请参阅[使用 DebugConfigurationProvider](/vscode/extension/extension-guides/debugger-extension#using-a-debugconfigurationprovider)。

## workspaceContains

`workspaceContains:path` 在打开文件夹且该文件夹包含至少一个与 [glob 模式](/docs/editor/glob-patterns)匹配的文件时被触发，相关扩展将被激活。

```json
"activationEvents": [
    "workspaceContains:**/.editorconfig"
]
```

## onFileSystem

`onFileSystem:scheme` 在读取特定 _scheme_ 的文件或文件夹时被触发，相关扩展将被激活。通常是 `file` 方案，但通过自定义文件系统提供程序会引入更多方案，例如 `ftp` 或 `ssh`。

```json
"activationEvents": [
    "onFileSystem:sftp"
]
```

## onView

当 VS Code 侧边栏中具有指定 ID 的视图被展开时，将触发此激活事件，相关扩展将被激活。内置视图不会触发激活事件。

以下激活事件将在 ID 为 `nodeDependencies` 的视图可见时触发：

```json
"activationEvents": [
    "onView:nodeDependencies"
]
```

> **注意**：从 VS Code 1.74.0 开始，你的扩展贡献的视图不再需要相应的 `onView` 激活事件声明即可激活扩展。

## onUri

当打开该扩展的系统级 Uri 时，将触发此激活事件，相关扩展将被激活。Uri 方案固定为 `vscode` 或 `vscode-insiders`。Uri 的 authority 必须是扩展的标识符。Uri 的其余部分是任意的。

```json
"activationEvents": [
    "onUri"
]
```

如果 `vscode.git` 扩展将 `onUri` 定义为激活事件，它将在打开以下任何 Uri 时被激活：

- `vscode://vscode.git/init`
- `vscode://vscode.git/clone?url=https%3A%2F%2Fgithub.com%2FMicrosoft%2Fvscode-vsce.git`
- `vscode-insiders://vscode.git/init`（适用于 VS Code Insiders）

## onWebviewPanel

当 VS Code 需要恢复具有匹配 `viewType` 的 [webview](/vscode/extension/extension-guides/webview) 时，将触发此激活事件，相关扩展将被激活。

例如，以下 `onWebviewPanel` 声明：

```json
"activationEvents": [
    "onWebviewPanel:catCoding"
]
```

将导致扩展在 VS Code 需要恢复 viewType 为 `catCoding` 的 webview 时被激活。viewType 在调用 `window.createWebviewPanel` 时设置，你需要有另一个激活事件（例如 onCommand）来初始激活你的扩展并创建 webview。

## onCustomEditor

当 VS Code 需要创建具有匹配 `viewType` 的[自定义编辑器](/vscode/extension/extension-guides/custom-editors)时，将触发此激活事件，相关扩展将被激活。

例如，以下 `onCustomEditor` 声明：

```json
"activationEvents": [
    "onCustomEditor:catCustoms.pawDraw"
]
```

将导致扩展在 VS Code 需要恢复 viewType 为 `catCustoms.pawDraw` 的自定义编辑器时被激活。viewType 在 [`customEditors` 贡献点](/vscode/extension/extension-guides/custom-editors#contribution-point)中设置，并通过 `registerCustomEditorProvider` 绑定到提供程序。

> **注意**：从 VS Code 1.74.0 开始，你的扩展贡献的自定义编辑器不再需要相应的 `onCustomEditor` 激活事件声明即可激活扩展。

## onAuthenticationRequest

当扩展请求具有匹配 `providerId` 的身份验证会话（通过 `authentication.getSession()` API）时，将触发此激活事件，相关扩展将被激活。

例如，以下 `onAuthenticationRequest` 声明：

```json
"activationEvents": [
    "onAuthenticationRequest:github"
]
```

将导致扩展在 VS Code 需要获取 `github` 类型的 `AuthenticationSession` 时被激活。

> **注意**：从 VS Code 1.74.0 开始，你的扩展贡献的身份验证提供程序不再需要相应的 `onAuthenticationRequest` 激活事件声明即可激活扩展。

## onStartupFinished

此激活事件在 VS Code 启动 **一段时间后** 触发，相关扩展将被激活。这与 `*` 激活事件类似，但不会减慢 VS Code 的启动速度。目前，此事件在所有 `*` 激活的扩展完成激活之后触发。

```json
"activationEvents": [
    "onStartupFinished"
]
```

## onTaskType

当需要列出或解析某种类型的任务时，`onTaskType:type` 被触发。

```json
"activationEvents": [
    "onTaskType:npm"
]
```

> **注意**：从 VS Code 1.76.0 开始，你的扩展贡献的任务不再需要相应的 `onTaskType` 激活事件声明即可激活扩展。

## onEditSession

当使用给定方案访问编辑会话时，`onEditSession:scheme` 被触发。

```json
"activationEvents": [
    "onEditSession:file"
]
```

## onSearch

在具有给定方案的文件夹中开始搜索时，`onSearch:scheme` 被触发。

```json
"activationEvents": [
    "onSearch:file"
]
```

## onOpenExternalUri

当打开外部 URI（例如 http 或 https 链接）时触发的激活事件。

```json
"activationEvents": [
    "onOpenExternalUri"
]
```

## onNotebook

当打开指定的 Notebook 文档类型时，`onNotebook:type` 被触发。

```json
"activationEvents": [
    "onNotebook:jupyter-notebook",
    "onNotebook:interactive"
]
```

## onRenderer

当使用 Notebook 输出渲染器时，`onRenderer:id` 被触发。

```json
"activationEvents": [
    "onRenderer:ms-toolsai.jupyter-renderers"
]
```

## onTerminal

当打开具有给定 shell 类型的特定终端时，`onTerminal:shellType` 被触发。

```json
"activationEvents": [
  "onTerminal:bash"
]
```

## onTerminalProfile

当启动特定的终端配置文件时，`onTerminalProfile:id` 被触发。

```json
"activationEvents": [
    "onTerminalProfile:terminalTest.terminal-profile"
]
```

## onTerminalShellIntegration

当具有给定 shell 类型的终端激活了 shell 集成时，`onTerminalShellIntegration:shellType` 被触发。

```json
"activationEvents": [
    "onTerminalShellIntegration:bash"
]
```

## onWalkthrough

当打开指定的演练指南时，`onWalkthrough:id` 被触发。

```json
"activationEvents": [
    "onWalkthrough:nodejsWelcome"
]
```

## onIssueReporterOpened

当问题报告器被打开时（例如使用 **帮助：报告问题**），此激活事件被触发。

```json
"activationEvents": [
    "onIssueReporterOpened"
]
```

## onChatParticipant

当调用指定的聊天参与者时触发的激活事件。

```json
"activationEvents": [
    "onChatParticipant:my-chat-participant"
]
```

## onLanguageModelTool

当调用指定的语言模型工具时触发的激活事件。

```json
"activationEvents": [
    "onLanguageModelTool:my-language-model-tool"
]
```

## 启动

`*` 激活事件在 VS Code 启动时触发，相关扩展将被激活。

> **注意**：为了确保良好的用户体验，请仅在没有其他激活事件组合适用于你的场景时，才在扩展中使用此激活事件。

```json
"activationEvents": [
    "*"
]
```

> **注意**：扩展可以监听多个激活事件，这比监听 `"*"` 更可取。

> **注意**：扩展 **必须** 从其主模块导出一个 `activate()` 函数，当任何指定的激活事件触发时，VS Code 将调用该函数且仅调用 **一次**。此外，扩展 **应当** 从其主模块导出一个 `deactivate()` 函数，以在 VS Code 关闭时执行清理任务。如果清理过程是异步的，扩展 **必须** 从 `deactivate()` 返回一个 Promise。如果清理是同步运行的，扩展可以从 `deactivate()` 返回 `undefined`。
