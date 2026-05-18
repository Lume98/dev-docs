---
title: 扩展剖析
description: 解析 Visual Studio Code 扩展（插件）的结构
---

# 扩展剖析

在上一节中，你已经成功运行了一个基础扩展。它是如何工作的呢？

`Hello World` 扩展做了 3 件事：

- 注册了 [`onCommand`](/vscode/extension/references/activation-events#onCommand) [**Activation Event**](/vscode/extension/references/activation-events)：`onCommand:helloworld.helloWorld`，这样当用户运行 `Hello World` 命令时，扩展就会被激活。
  > **注意：** 从 [VS Code 1.74.0](https://code.visualstudio.com/updates/v1_74#_implicit-activation-events-for-declared-extension-contributions) 开始，在 `package.json` 的 `commands` 部分声明的命令在被调用时会自动激活扩展，无需在 `activationEvents` 中显式添加 `onCommand` 条目。
- 使用 [`contributes.commands`](/vscode/extension/references/contribution-points#contributes.commands) [**Contribution Point**](/vscode/extension/references/contribution-points) 使 `Hello World` 命令出现在命令面板中，并将其绑定到命令 ID `helloworld.helloWorld`。
- 使用 [`commands.registerCommand`](/vscode/extension/references/vscode-api#commands.registerCommand) [**VS Code API**](/vscode/extension/references/vscode-api) 将一个函数绑定到已注册的命令 ID `helloworld.helloWorld`。

理解这三个概念对于编写 VS Code 扩展至关重要：

- [**Activation Event**](/vscode/extension/references/activation-events)：触发扩展激活的事件。
- [**Contribution Point**](/vscode/extension/references/contribution-points)：你在 `package.json` [Extension Manifest](#extension-manifest) 中做出的静态声明，用于扩展 VS Code。
- [**VS Code API**](/vscode/extension/references/vscode-api)：你可以在扩展代码中调用的一组 JavaScript API。

通常，你的扩展会组合使用 Contribution Point 和 VS Code API 来扩展 VS Code 的功能。[扩展能力概览](/vscode/extension/extension-capabilities/overview)主题可以帮助你找到适合自己扩展的 Contribution Point 和 VS Code API。

让我们仔细看看 `Hello World` 示例的源代码，了解这些概念是如何应用的。

## 扩展文件结构

```
.
├── .vscode
│   ├── launch.json     // 启动和调试扩展的配置
│   └── tasks.json      // 编译 TypeScript 的构建任务配置
├── .gitignore          // 忽略构建输出和 node_modules
├── README.md           // 扩展功能的可读描述
├── src
│   └── extension.ts    // 扩展源代码
├── package.json        // Extension Manifest
├── tsconfig.json       // TypeScript 配置
```

你可以进一步了解这些配置文件：

- `launch.json` 用于配置 VS Code [调试](/docs/debugtest/debugging)
- `tasks.json` 用于定义 VS Code [任务](/docs/debugtest/tasks)
- `tsconfig.json` 请参阅 TypeScript [手册](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

不过，让我们把重点放在 `package.json` 和 `extension.ts` 上，它们是理解 `Hello World` 扩展的关键。

### Extension Manifest

每个 VS Code 扩展都必须有一个 `package.json` 作为其 [Extension Manifest](/vscode/extension/references/extension-manifest)。`package.json` 中既包含 Node.js 的字段（如 `scripts` 和 `devDependencies`），也包含 VS Code 专用的字段（如 `publisher`、`activationEvents` 和 `contributes`）。你可以在 [Extension Manifest 参考](/vscode/extension/references/extension-manifest)中找到所有 VS Code 专用字段的说明。以下是一些最重要的字段：

- `name` 和 `publisher`：VS Code 使用 `<publisher>.<name>` 作为扩展的唯一 ID。例如，Hello World 示例的 ID 是 `vscode-samples.helloworld-sample`。VS Code 使用该 ID 来唯一标识你的扩展。
- `main`：扩展的入口文件。
- `activationEvents` 和 `contributes`：[Activation Event](/vscode/extension/references/activation-events) 和 [Contribution Point](/vscode/extension/references/contribution-points)。
- `engines.vscode`：指定扩展所依赖的 VS Code API 最低版本。

```json
{
  "name": "helloworld-sample",
  "displayName": "helloworld-sample",
  "description": "HelloWorld example for VS Code",
  "version": "0.0.1",
  "publisher": "vscode-samples",
  "repository": "https://github.com/microsoft/vscode-extension-samples/helloworld-sample",
  "engines": {
    "vscode": "^1.51.0"
  },
  "categories": ["Other"],
  "activationEvents": [],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "helloworld.helloWorld",
        "title": "Hello World"
      }
    ]
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./"
  },
  "devDependencies": {
    "@types/node": "^8.10.25",
    "@types/vscode": "^1.51.0",
    "tslint": "^5.16.0",
    "typescript": "^3.4.5"
  }
}
```

> **注意**：如果你的扩展目标版本是 VS Code 1.74 之前的版本，则必须在 `activationEvents` 中显式列出 `onCommand:helloworld.helloWorld`。

## 扩展入口文件

扩展入口文件导出两个函数：`activate` 和 `deactivate`。`activate` 在你注册的 **Activation Event** 发生时执行。`deactivate` 让你有机会在扩展被停用之前进行清理。对于许多扩展来说，可能不需要显式清理，可以删除 `deactivate` 方法。但是，如果扩展需要在 VS Code 关闭、扩展被禁用或卸载时执行某些操作，就应该在此方法中完成。

VS Code 扩展 API 声明在 [@types/vscode](https://www.npmjs.com/package/@types/vscode) 类型定义中。`vscode` 类型定义的版本由 `package.json` 中 `engines.vscode` 字段的值控制。`vscode` 类型为你的代码提供 IntelliSense、转到定义以及其他 TypeScript 语言功能。

```ts
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "helloworld-sample" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World!');
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
```
