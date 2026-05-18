---
title: 测试扩展
description: 为你的 Visual Studio Code 扩展（插件）编写测试。
---

# 测试扩展

Visual Studio Code 支持运行和调试扩展测试。这些测试将在一个名为 **Extension Development Host** 的特殊 VS Code 实例中运行，并拥有对 VS Code API 的完整访问权限。我们将这些测试称为集成测试，因为它们超越了无需 VS Code 实例即可运行的单元测试。本文档主要介绍 VS Code 集成测试。

## 概述

如果你使用 [Yeoman 生成器](https://code.visualstudio.com/api/get-started/your-first-extension)来搭建扩展，集成测试已经为你创建好了。

在生成的扩展中，你可以使用 `npm run test` 或 `yarn test` 来运行集成测试，测试将会：

- 下载并解压最新版本的 VS Code。
- 运行由扩展测试运行脚本指定的 [Mocha](https://mochajs.org) 测试。

## 快速设置：测试 CLI

VS Code 团队发布了一个命令行工具来运行扩展测试。你可以在[扩展示例仓库](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-test-cli-sample)中找到一个示例。

测试 CLI 提供了快速的设置方式，还允许你使用 [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner) 轻松运行和调试 VS Code UI 的测试。该 CLI 底层专门使用 [Mocha](https://mochajs.org)。

开始之前，你需要先安装 `@vscode/test-cli` 模块，以及用于在 VS Code Desktop 中运行测试的 `@vscode/test-electron` 模块：

```bash
npm install --save-dev @vscode/test-cli @vscode/test-electron
```

安装这些模块后，你将拥有 `vscode-test` 命令行工具，可以将其添加到 `package.json` 的 `scripts` 部分：

```diff
{
  "name": "my-cool-extension",
  "scripts": {
+   "test": "vscode-test"
```

`vscode-test` 会在当前工作目录中查找 [`.vscode-test.js/mjs/cjs`](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-test-cli-sample/.vscode-test.mjs) 文件。此文件提供了测试运行器的配置，你可以在[这里](https://github.com/microsoft/vscode-test-cli/blob/main/src/config.cts)找到完整的定义。

常用选项包括：

- **（必填）** `files` - 包含要运行的测试的模式、模式列表或绝对路径。
- `version` - 用于运行测试的 VS Code 版本（默认为 `stable`）。
- `workspaceFolder` - 测试期间打开的工作区路径。
- `extensionDevelopmentPath` - 你的扩展文件夹路径（默认为配置文件所在的目录）。
- `mocha` - 包含要传递给 Mocha 的额外[选项](https://mochajs.org/api/mocha#Mocha)的对象。

配置可以很简单：

```js
// .vscode-test.js
const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig({ files: 'out/test/**/*.test.js' });
```

...也可以更高级：

```js
// .vscode-test.js
const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig([
  {
    label: 'unitTests',
    files: 'out/test/**/*.test.js',
    version: 'insiders',
    workspaceFolder: './sampleWorkspace',
    mocha: {
      ui: 'tdd',
      timeout: 20000,
    },
  },
  // 你也可以指定额外的测试配置
]);
```

如果你通过传入数组来定义多个配置，运行 `vscode-test` 时它们将按顺序执行。你可以使用 `--label` 标志按标签筛选并单独运行，例如 `vscode-test --label unitTests`。运行 `vscode-test --help` 可查看完整的命令行选项。

### 测试脚本

CLI 设置好之后，你就可以编写和运行测试了。测试脚本可以访问 VS Code API，并在 Mocha 下运行。以下是一个示例（[src/test/suite/extension.test.ts](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-test-sample/src/test/suite/extension.test.ts)）：

```ts
import * as assert from 'assert';

// 你可以导入并使用 'vscode' 模块中的所有 API
// 也可以导入你的扩展来进行测试
import * as vscode from 'vscode';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
  suiteTeardown(() => {
    vscode.window.showInformationMessage('All tests done!');
  });

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});
```

你可以使用 `npm test` 命令运行此测试，或者在安装 [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner) 后使用 VS Code 中的 **Test: Run All Tests** 命令。你也可以使用 **Test: Debug All Tests** 命令来调试测试。

## 高级设置：自定义运行器

你可以在 [helloworld-test-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-test-sample) 中找到本指南的配置。本文档的剩余部分将在示例的上下文中解释这些文件：

- **测试脚本**（[`src/test/runTest.ts`](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-test-sample/src/test/runTest.ts)）
- **测试运行器脚本**（[`src/test/suite/index.ts`](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-test-sample/src/test/suite/index.ts)）

VS Code 提供了两个 CLI 参数用于运行扩展测试：`--extensionDevelopmentPath` 和 `--extensionTestsPath`。

例如：

```bash
# - 启动 VS Code 扩展宿主
# - 加载 <EXTENSION-ROOT-PATH> 处的扩展
# - 执行 <TEST-RUNNER-SCRIPT-PATH> 处的测试运行器脚本
code \
--extensionDevelopmentPath=<EXTENSION-ROOT-PATH> \
--extensionTestsPath=<TEST-RUNNER-SCRIPT-PATH>
```

**测试脚本**（[`src/test/runTest.ts`](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-test-sample/src/test/runTest.ts)）使用 `@vscode/test-electron` API 来简化下载、解压和启动带有扩展测试参数的 VS Code 的过程：

```ts
import * as path from 'path';

import { runTests } from '@vscode/test-electron';

async function main() {
  try {
    // 包含 Extension Manifest package.json 的文件夹
    // 传递给 `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');

    // 扩展测试运行器脚本的路径
    // 传递给 --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, './suite/index');

    // 下载 VS Code，解压并运行集成测试
    await runTests({ extensionDevelopmentPath, extensionTestsPath });
  } catch (err) {
    console.error(err);
    console.error('Failed to run tests');
    process.exit(1);
  }
}

main();
```

`@vscode/test-electron` API 还支持：

- 使用指定的工作区启动 VS Code。
- 下载特定版本的 VS Code，而非最新稳定版。
- 使用额外的 CLI 参数启动 VS Code。

你可以在 [microsoft/vscode-test](https://github.com/microsoft/vscode-test) 找到更多 API 用法示例。

### 测试运行器脚本

运行扩展集成测试时，`--extensionTestsPath` 指向**测试运行器脚本**（[`src/test/suite/index.ts`](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-test-sample/src/test/suite/index.ts)），该脚本以编程方式运行测试套件。以下是 `helloworld-test-sample` 中使用 Mocha 运行测试套件的[测试运行器脚本](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-test-sample/src/test/suite/index.ts)。你可以以此作为起点，使用 [Mocha 的 API](https://mochajs.org/api/mocha) 自定义你的配置。你也可以将 Mocha 替换为任何其他可编程运行的测试框架。

```ts
import * as path from 'path';
import * as Mocha from 'mocha';
import { glob } from 'glob';

export function run(): Promise<void> {
  // 创建 mocha 测试
  const mocha = new Mocha({
    ui: 'tdd',
    color: true
  });

  const testsRoot = path.resolve(__dirname, '..');

  return new Promise((c, e) => {
    glob('**/**.test.js', { cwd: testsRoot }).then((files) => {
      // 将文件添加到测试套件
      files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // 运行 mocha 测试
        mocha.run(failures => {
          if (failures > 0) {
            e(new Error(`${failures} tests failed.`));
          } else {
            c();
          }
        });
      } catch (err) {
        e(err);
      }
    }).catch((err) => {
      return e(err);
    });
  });
}
```

测试运行器脚本和 `*.test.js` 文件都可以访问 VS Code API。

以下是一个示例测试（[src/test/suite/extension.test.ts](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-test-sample/src/test/suite/extension.test.ts)）：

```ts
import * as assert from 'assert';
import { after } from 'mocha';

// 你可以导入并使用 'vscode' 模块中的所有 API
// 也可以导入你的扩展来进行测试
import * as vscode from 'vscode';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
  after(() => {
    vscode.window.showInformationMessage('All tests done!');
  });

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});
```

### 调试测试

调试测试与调试扩展的方式类似。

以下是一个 `launch.json` 调试配置示例：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Extension Tests",
      "type": "extensionHost",
      "request": "launch",
      "runtimeExecutable": "${execPath}",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}",
        "--extensionTestsPath=${workspaceFolder}/out/test/suite/index"
      ],
      "outFiles": ["${workspaceFolder}/out/test/**/*.js"]
    }
  ]
}
```

<video autoplay loop muted playsinline controls>
  <source src="/assets/api/working-with-extensions/testing-extension/debug.mp4" type="video/mp4">
</video>

## 提示

### 使用 Insiders 版本进行扩展开发

由于 VS Code 的限制，如果你使用 VS Code 稳定版并尝试在 **命令行** 中运行集成测试，会抛出以下错误：

```
Running extension tests from the command line is currently only supported if no other instance of Code is running.
```

通常情况下，如果你从命令行运行扩展测试，运行测试的 VS Code 版本不能已经处于运行状态。作为替代方案，你可以在 VS Code 稳定版中运行测试，而使用 [VS Code Insiders](https://code.visualstudio.com/insiders/) 进行开发。只要你不是在 VS Code Insiders 中而是在 VS Code 稳定版中从命令行运行测试，这个方案就可以正常工作。

另一种方法是从 VS Code 内部通过调试启动配置来运行扩展测试。这样做还有一个额外的好处，就是你甚至可以调试测试。

### 调试时禁用其他扩展

当你在 VS Code 中调试扩展测试时，VS Code 会使用全局安装的 VS Code 实例并加载所有已安装的扩展。你可以在 `launch.json` 中添加 `--disable-extensions` 配置，或者在 `@vscode/test-electron` 的 `runTests` API 的 `launchArgs` 选项中添加。

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Extension Tests",
      "type": "extensionHost",
      "request": "launch",
      "runtimeExecutable": "${execPath}",
      "args": [
        "--disable-extensions",
        "--extensionDevelopmentPath=${workspaceFolder}",
        "--extensionTestsPath=${workspaceFolder}/out/test/suite/index"
      ],
      "outFiles": ["${workspaceFolder}/out/test/**/*.js"]
    }
  ]
}
```

```ts
await runTests({
  extensionDevelopmentPath,
  extensionTestsPath,
  /**
   * 传递给 VS Code 可执行文件的启动参数列表，除 `--extensionDevelopmentPath`
   * 和 `--extensionTestsPath` 之外，这两个参数由 `extensionDevelopmentPath`
   * 和 `extensionTestsPath` 选项提供。
   *
   * 如果第一个参数是文件/文件夹/工作区的路径，则启动的 VS Code 实例
   * 将打开它。
   *
   * 参见 `code --help` 了解可能的参数。
   */
  launchArgs: ['--disable-extensions']
});
```

### 使用 `@vscode/test-electron` 进行自定义设置

有时你可能需要运行自定义设置，例如在开始测试之前运行 `code --install-extension` 来安装另一个扩展。`@vscode/test-electron` 提供了更细粒度的 API 来满足这种需求：

```ts
import * as cp from 'child_process';
import * as path from 'path';
import {
  downloadAndUnzipVSCode,
  resolveCliArgsFromVSCodeExecutablePath,
  runTests
} from '@vscode/test-electron';

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
    const extensionTestsPath = path.resolve(__dirname, './suite/index');
    const vscodeExecutablePath = await downloadAndUnzipVSCode('1.40.1');
    const [cliPath, ...args] = resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);

    // 使用 cp.spawn / cp.exec 进行自定义设置
    cp.spawnSync(cliPath, [...args, '--install-extension', '<EXTENSION-ID-OR-PATH-TO-VSIX>'], {
      encoding: 'utf-8',
      stdio: 'inherit'
    });

    // 运行扩展测试
    await runTests({
      // 使用指定的 `code` 可执行文件
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath
    });
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}

main();
```

## 下一步

- [持续集成](/vscode/extension/working-with-extensions/continuous-integration) - 在 Azure DevOps 等持续集成服务中运行扩展测试。
