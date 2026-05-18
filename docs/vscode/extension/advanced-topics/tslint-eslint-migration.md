---
title: 从 TSLint 迁移到 ESLint
description: 将扩展项目从 TSLint 代码检查工具迁移到 ESLint 的指南。
---
# 从 TSLint 迁移到 ESLint

[TSLint](https://palantir.github.io/tslint/) 曾经是推荐的代码检查工具，但如今 TSLint 已被弃用，[ESLint](https://eslint.org/) 将接替其职责。本文将帮助你从 TSLint 迁移到 ESLint。

## ESLint：安装

你需要安装 ESLint。ESLint 原生不支持 TypeScript，因此还需要安装 eslint-typescript 支持包：

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

如果你使用 yarn 作为包管理器：

```bash
yarn add eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --dev
```

上面的命令会安装 ESLint，添加一个让 ESLint 能够理解 TypeScript 的解析器，以及一些 TypeScript 特定的规则。

现在，为了让实际的迁移更简单，可以运行 [tslint-to-eslint-config](https://github.com/typescript-eslint/tslint-to-eslint-config) 工具。该工具会读取你的 TSLint 配置，并从中生成"最接近"的 ESLint 配置。

```bash
npx tslint-to-eslint-config
```

此命令会[下载并执行](https://www.npmjs.com/package/npx)该工具来完成迁移。更多选项请查看该工具的[使用指南](https://github.com/typescript-eslint/tslint-to-eslint-config#usage)。

此时应该会生成一个新的 `.eslintrc.js` 文件、一个日志文件（`tslint-to-eslint-config.log`），以及可能对其他文件（如 `.vscode/settings.json`）的修改。请仔细审查这些变更，尤其是对已有文件的修改，并检查日志文件。

## ESLint：配置

`.eslintrc.js` 文件通常足以开始使用，但 `parserOptions.project` 属性可能仍然指向你的 `tsconfig.json` 文件。这意味着 ESLint 规则可以使用语义信息，例如判断某个变量是字符串还是数字数组。此配置能启用一些强大的规则，但也会导致 ESLint 的计算时间大幅增加。扩展的默认规则不需要语义信息，除非你添加了需要语义信息的规则，否则我们建议你移除 `parserOptions.project` 属性。

## ESLint：运行

你现在可以运行 ESLint 了，但在此之前，我们建议你先禁用 TSLint。为此，请打开扩展视图，在 TSLint 扩展的上下文菜单中选择 **禁用**。

是时候进行代码检查了！使用以下命令：`eslint -c .eslintrc.js --ext .ts <mySrcFolder>`（注意 `--ext .ts` 选项，它告诉 ESLint 检查 TypeScript 文件）。我们建议将该命令放在 `package.json` 文件的 `scripts` 部分，如下所示：

```json
"lint": "eslint -c .eslintrc.js --ext .ts <mySrcFolder>"
```

要将 ESLint 集成到 Visual Studio Code 中，请执行以下操作：

* 安装 [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 扩展。
* 通过 **任务：配置任务** 命令创建一个任务，并选择 **npm: lint**。
* 在生成的 `tasks.json` 文件中，将问题匹配器配置为 `$eslint-stylish`。

**提示**：ESLint 在某些方面"更加严格"，你可能会看到之前没有的警告，例如指出缺少分号。尝试使用 `--fix` 选项让 ESLint 自动修复这些问题。

## TSLint：移除

恭喜！你现在应该已经有了一个可用的 ESLint 配置，接下来是清理工作。

移除 TSLint 的步骤取决于你的项目，但通常包括以下操作：

* 更新 `.vscode/extensions.json`，推荐使用 ESLint 扩展而不是 TSLint：

  ```json
  "recommendations": [
    "dbaeumer.vscode-eslint"
  ]
  ```

* 删除 `tslint.json` 文件。
* 在 `package.json` 文件中移除对 `tslint` 的依赖。
* 使用 `npm uninstall tslint` 卸载 TSLint。
