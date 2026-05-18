---
title: 打包扩展
description: 使用 webpack 打包 Visual Studio Code 扩展（插件）。
---

# 打包扩展

打包 Visual Studio Code 扩展的首要原因是确保它能在任何平台上为所有 VS Code 用户正常工作。只有打包后的扩展才能在 [github.dev](https://github.dev/) 和 [vscode.dev](https://vscode.dev/) 等 VS Code Web 环境中使用。当 VS Code 在浏览器中运行时，它只能为你的扩展加载一个文件，因此扩展代码需要被打包成一个对 Web 友好的 JavaScript 文件。这也适用于 [Notebook 输出渲染器](/vscode/extension/extension-guides/notebook#notebook-renderer)，VS Code 同样只会为你的渲染器扩展加载一个文件。

此外，扩展的规模和复杂度可能会快速增长。它们可能由多个源文件编写而成，并依赖 [npm](https://www.npmjs.com) 上的模块。模块化拆分和复用是开发的最佳实践，但在安装和运行扩展时会带来额外的开销。加载 100 个小文件比加载一个大文件要慢得多。这就是我们推荐打包的原因。打包是将多个小源文件合并为单个文件的过程。

对于 JavaScript，有多种打包工具可供选择。流行的有 [rollup.js](https://rollupjs.org)、[Parcel](https://parceljs.org)、[esbuild](https://esbuild.github.io/) 和 [webpack](https://webpack.js.org/)。

## 使用 esbuild

`esbuild` 是一个快速的 JavaScript 打包工具，配置简单。要安装 esbuild，请打开终端并输入：

```bash
npm i --save-dev esbuild
```

### 运行 esbuild

你可以从命令行运行 esbuild，但为了减少重复操作并启用问题报告，建议使用构建脚本 `esbuild.js`：

```js
const esbuild = require("esbuild");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
	const ctx = await esbuild.context({
		entryPoints: [
			'src/extension.ts'
		],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outfile: 'dist/extension.js',
		external: ['vscode'],
		logLevel: 'warning',
		plugins: [
			/* 添加到 plugins 数组末尾 */
			esbuildProblemMatcherPlugin,
		],
	});
	if (watch) {
		await ctx.watch();
	} else {
		await ctx.rebuild();
		await ctx.dispose();
	}
}

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
                if (location == null) return;
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	}
};

main().catch(e => {
	console.error(e);
	process.exit(1);
});
```

构建脚本执行以下操作：
- 使用 esbuild 创建构建上下文。该上下文配置为：
  - 将 `src/extension.ts` 中的代码打包到单个文件 `dist/extension.js` 中。
  - 如果传入了 `--production` 标志，则压缩代码。
  - 除非传入了 `--production` 标志，否则生成 source map。
  - 将 'vscode' 模块排除在打包之外（因为它由 VS Code 运行时提供）。
- 使用 esbuildProblemMatcherPlugin 插件来报告阻止打包器完成的错误。此插件以 `esbuild` 问题匹配器能检测的格式输出错误，同时还需要将其作为扩展安装。
- 如果传入了 `--watch` 标志，它会监视源文件的变化，并在检测到变化时重新打包。

esbuild 可以直接处理 TypeScript 文件。但是，esbuild 只会简单地移除所有类型声明，而不会进行任何类型检查。只有语法错误会被报告并可能导致 esbuild 失败。

因此，我们单独运行 TypeScript 编译器（`tsc`）来检查类型，但不输出任何代码（使用 `--noEmit` 标志）。

`package.json` 中的 `scripts` 部分如下所示：

```json
"scripts": {
    "compile": "npm run check-types && node esbuild.js",
    "check-types": "tsc --noEmit",
    "watch": "npm-run-all -p watch:*",
    "watch:esbuild": "node esbuild.js --watch",
    "watch:tsc": "tsc --noEmit --watch --project tsconfig.json",
    "vscode:prepublish": "npm run package",
    "package": "npm run check-types && node esbuild.js --production"
}
```

`npm-run-all` 是一个 Node 模块，可以并行运行名称匹配指定前缀的脚本。对我们来说，它运行 `watch:esbuild` 和 `watch:tsc` 脚本。你需要将 `npm-run-all` 添加到 `package.json` 的 `devDependencies` 部分。

`compile` 和 `watch` 脚本用于开发阶段，它们会生成带有 source map 的打包文件。`package` 脚本由 `vscode:prepublish` 脚本使用，而 `vscode:prepublish` 被 `vsce`（VS Code 打包和发布工具）调用，在发布扩展前运行。向 esbuild 脚本传入 `--production` 标志会使其压缩代码并创建更小的包，但也会使调试变得困难，因此开发阶段使用其他标志。要运行上述脚本，请打开终端并输入 `npm run watch`，或从命令面板（`kb(workbench.action.showCommands)`）中选择 **Tasks: Run Task**。

如果你按以下方式配置 `.vscode/tasks.json`，每个监视任务将有独立的终端：

```json
{
	"version": "2.0.0",
	"tasks": [
		{
            "label": "watch",
            "dependsOn": [
                "npm: watch:tsc",
                "npm: watch:esbuild"
            ],
            "presentation": {
                "reveal": "never"
            },
            "group": {
                "kind": "build",
                "isDefault": true
            }
        },
        {
            "type": "npm",
            "script": "watch:esbuild",
            "group": "build",
            "problemMatcher": "$esbuild-watch",
            "isBackground": true,
            "label": "npm: watch:esbuild",
            "presentation": {
                "group": "watch",
                "reveal": "never"
            }
        },
		{
            "type": "npm",
            "script": "watch:tsc",
            "group": "build",
            "problemMatcher": "$tsc-watch",
            "isBackground": true,
            "label": "npm: watch:tsc",
            "presentation": {
                "group": "watch",
                "reveal": "never"
            }
        }
    ]
}
```

此监视任务依赖于扩展 [`connor4312.esbuild-problem-matchers`](https://marketplace.visualstudio.com/items?itemName=connor4312.esbuild-problem-matchers) 来进行问题匹配，你需要安装此扩展才能让任务在问题视图中报告问题。启动过程也需要安装此扩展才能完成。

为了不遗漏这一点，请在工作区中添加一个 `.vscode/extensions.json` 文件：

```json
{
  "recommendations": ["connor4312.esbuild-problem-matchers"]
}
```

最后，你需要更新 `.vscodeignore` 文件，使编译后的文件包含在已发布的扩展中。有关更多详情，请参阅[发布](#publishing)部分。

跳转到[测试](#tests)部分继续阅读。

## 使用 webpack

Webpack 是一个可从 [npm](https://www.npmjs.com) 获取的开发工具。要安装 webpack 及其命令行界面，请打开终端并输入：

```bash
npm i --save-dev webpack webpack-cli
```

这将安装 webpack 并更新扩展的 `package.json` 文件，将 webpack 添加到 `devDependencies` 中。

Webpack 是一个 JavaScript 打包工具，但许多 VS Code 扩展是用 TypeScript 编写的，然后编译为 JavaScript。如果你的扩展使用 TypeScript，你可以使用 `ts-loader` 加载器，使 webpack 能够理解 TypeScript。使用以下命令安装 `ts-loader`：

```bash
npm i --save-dev ts-loader
```

所有文件可在 [webpack-extension](https://github.com/microsoft/vscode-extension-samples/blob/main/webpack-sample) 示例中找到。

### 配置 webpack

安装好所有工具后，就可以配置 webpack 了。按照惯例，`webpack.config.js` 文件包含指导 webpack 打包扩展的配置。以下示例配置适用于 VS Code 扩展，可以作为良好的起点：

```javascript
//@ts-check

'use strict';

const path = require('path');
const webpack = require('webpack');

/**@type {import('webpack').Configuration}*/
const config = {
    target: 'webworker', // VS Code 扩展在 VS Code Web 中运行于 webworker 上下文 📖 -> https://webpack.js.org/configuration/target/#target

    entry: './src/extension.ts', // 此扩展的入口点 📖 -> https://webpack.js.org/configuration/entry-context/
    output: { // 打包文件存储在 'dist' 文件夹中（参见 package.json）📖 -> https://webpack.js.org/configuration/output/
        path: path.resolve(__dirname, 'dist'),
        filename: 'extension.js',
        libraryTarget: "commonjs2",
        devtoolModuleFilenameTemplate: "../[resource-path]",
    },
    devtool: 'source-map',
    externals: {
        vscode: "commonjs vscode" // vscode 模块是动态创建的，必须排除。添加其他无法被 webpack 打包的模块 📖 -> https://webpack.js.org/configuration/externals/
    },
    resolve: { // 支持读取 TypeScript 和 JavaScript 文件 📖 -> https://github.com/TypeStrong/ts-loader
        mainFields: ['browser', 'module', 'main'], // 在导入的 Node 模块中查找 `browser` 入口点
        extensions: ['.ts', '.js'],
        alias: {
            // 为 Node 模块和源文件提供替代实现
        },
        fallback: {
            // Webpack 5 不再自动填充 Node.js 核心模块。
            // 参见 https://webpack.js.org/configuration/resolve/#resolvefallback
            // 获取 Node.js 核心模块填充列表。
        }
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [{
                loader: 'ts-loader',
            }]
        }]
    },
}
module.exports = config;
```

此文件[可在](https://github.com/microsoft/vscode-extension-samples/blob/main/webpack-sample/webpack.config.js) [webpack-extension](https://github.com/microsoft/vscode-extension-samples/blob/main/webpack-sample) 示例中找到。Webpack 配置文件是普通的 JavaScript 模块，必须导出一个配置对象。

在上面的示例中，定义了以下内容：

* `target` 指示扩展将运行的上下文。我们推荐使用 `webworker`，这样你的扩展可以同时在 VS Code Web 版和桌面版中正常工作。
* webpack 应使用的入口点。这与 `package.json` 中的 `main` 属性类似，区别在于你为 webpack 提供的是一个"源"入口点（通常是 `src/extension.ts`），而不是"输出"入口点。webpack 打包器理解 TypeScript，因此单独的 TypeScript 编译步骤是多余的。
* `output` 配置告诉 webpack 将生成的打包文件放在哪里。按照惯例，这是 `dist` 文件夹。在此示例中，webpack 将生成 `dist/extension.js` 文件。
* `resolve` 和 `module/rules` 配置用于支持 TypeScript 和 JavaScript 输入文件。
* `externals` 配置用于声明排除项，例如不应包含在打包中的文件和模块。`vscode` 模块不应该被打包，因为它不存在于磁盘上，而是由 VS Code 在需要时动态创建的。根据扩展使用的 Node 模块，可能需要更多排除项。

最后，你需要更新 `.vscodeignore` 文件，使编译后的文件包含在已发布的扩展中。有关更多详情，请参阅[发布](#publishing)部分。

### 运行 webpack

创建好 `webpack.config.js` 文件后，就可以调用 webpack 了。你可以从命令行运行 webpack，但为了减少重复操作，使用 npm 脚本会更方便。

将以下条目合并到 `package.json` 的 `scripts` 部分：

```json
"scripts": {
    "compile": "webpack --mode development",
    "watch": "webpack --mode development --watch",
    "vscode:prepublish": "npm run package",
    "package": "webpack --mode production --devtool hidden-source-map",
},
```

`compile` 和 `watch` 脚本用于开发阶段，它们生成打包文件。`vscode:prepublish` 由 `vsce`（VS Code 打包和发布工具）使用，在发布扩展前运行。区别在于[模式](https://webpack.js.org/concepts/mode/)，它控制优化级别。使用 `production` 可以生成最小的包，但耗时更长，因此其他情况下使用 `development`。要运行上述脚本，请打开终端并输入 `npm run compile`，或从命令面板（`kb(workbench.action.showCommands)`）中选择 **Tasks: Run Task**。

## 运行扩展

在运行扩展之前，`package.json` 中的 `main` 属性必须指向打包文件，对于上面的配置来说是 [`"./dist/extension"`](https://github.com/microsoft/vscode-references-view/blob/d649d01d369e338bbe70c86e03f28269cbf87027/package.json#L26)。完成此更改后，扩展就可以执行和测试了。

## 测试

扩展作者通常会为扩展源代码编写单元测试。在正确的架构分层下（扩展源代码不依赖测试代码），webpack 和 esbuild 生成的打包文件不应包含任何测试代码。运行单元测试只需要简单的编译。

将以下条目合并到 `package.json` 的 `scripts` 部分：

```json
"scripts": {
    "compile-tests": "tsc -p . --outDir out",
    "pretest": "npm run compile-tests",
    "test": "vscode-test"
}
```

`compile-tests` 脚本使用 TypeScript 编译器将扩展编译到 `out` 文件夹中。有了这些中间 JavaScript 文件，以下 `launch.json` 配置就足以运行测试。

```json
{
    "name": "Extension Tests",
    "type": "extensionHost",
    "request": "launch",
    "runtimeExecutable": "${execPath}",
    "args": [
        "--extensionDevelopmentPath=${workspaceFolder}",
        "--extensionTestsPath=${workspaceFolder}/out/test"
    ],
    "outFiles": [
        "${workspaceFolder}/out/test/**/*.js"
    ],
    "preLaunchTask": "npm: compile-tests"
}
```

此运行测试的配置与未打包的扩展相同。没有必要打包单元测试，因为它们不是扩展已发布部分的一部分。

## 发布

发布之前，你应该更新 `.vscodeignore` 文件。所有已打包到 `dist/extension.js` 文件中的内容都可以排除，通常是 `out` 文件夹（如果你还没有删除的话），以及最重要的是 `node_modules` 文件夹。

一个典型的 `.vscodeignore` 文件如下所示：

```bash
.vscode
node_modules
out/
src/
tsconfig.json
webpack.config.js
esbuild.js
```

## 迁移现有扩展

将现有扩展迁移为使用 esbuild 或 webpack 很简单，与上面的入门指南类似。一个采用 webpack 的真实案例是 VS Code 的 References 视图，通过这个[拉取请求](https://github.com/microsoft/vscode-references-view/pull/50)完成迁移。

从中你可以看到：

* 添加 `esbuild` 或 `webpack`、`webpack-cli` 和 `ts-loader` 作为 `devDependencies`。
* 更新 npm 脚本以使用打包工具，如上所示
* 更新任务配置 `tasks.json` 文件。
* 添加并调整 `esbuild.js` 或 `webpack.config.js` 构建文件。
* 更新 `.vscodeignore` 以排除 `node_modules` 和中间输出文件。
* 享受安装和加载速度更快的扩展！

## 故障排除

### 代码压缩

在 `production` 模式下打包还会执行代码压缩。压缩通过移除空白和注释、将变量和函数名替换为简短但可读性差的名称来精简源代码。使用 `Function.prototype.name` 的源代码行为会有所不同，因此你可能需要禁用压缩。

### webpack 关键依赖

运行 webpack 时，你可能会遇到类似 **Critical dependencies: the request of a dependency is an expression** 的警告。此类警告必须认真对待，你的打包很可能无法正常工作。此消息意味着 webpack 无法静态确定如何打包某个依赖。这通常由动态 `require` 语句引起，例如 `require(someDynamicVariable)`。

要解决此警告，你应该：

* 尝试使依赖变为静态的，以便它可以被打包。
* 通过 `externals` 配置排除该依赖。同时确保这些 JavaScript 文件不会从打包的扩展中被排除，可以在 `.vscodeignore` 中使用取反的 [glob 模式](/docs/editor/glob-patterns)，例如 `!node_modules/mySpecialModule`。

## 下一步

* [Extension Marketplace](/docs/configure/extensions/extension-marketplace) - 了解更多关于 VS Code 公共 Extension Marketplace 的信息。
* [测试扩展](/vscode/extension/working-with-extensions/testing-extension) - 为你的扩展项目添加测试以确保高质量。
* [持续集成](/vscode/extension/working-with-extensions/continuous-integration) - 了解如何在 Azure Pipelines 上运行扩展 CI 构建。
