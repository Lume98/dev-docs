---
title: 扩展清单
description: Visual Studio Code 可扩展性模型的核心是扩展（插件）清单文件，你的扩展在其中声明其扩展类型、激活规则和运行时资源。
---

# 扩展清单

每个 Visual Studio Code 扩展都需要在扩展目录结构的根目录下有一个清单文件 `package.json`。

## 字段

| 名称                                                    | 必填 | 类型                                       | 详情                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------- | :------: | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                                                  |    Y     | `string`                                   | 扩展的名称 - 应全部小写且不含空格。<br>名称在 Marketplace 中必须唯一。                                                                                                                                                                                                                                                                                |
| `version`                                               |    Y     | `string`                                   | [SemVer](https://semver.org/) 兼容的版本号。                                                                                                                                                                                                                                                                      |
| `publisher`                                             |    Y     | `string`                                   | [发布者标识符](/vscode/extension/working-with-extensions/publishing-extension#publishing-extensions)                                                                                                                                                                                                          |
| `engines`                                               |    Y     | `object`                                   | 包含至少 `vscode` 键的对象，用于匹配扩展[兼容](/vscode/extension/working-with-extensions/publishing-extension#visual-studio-code-compatibility)的 VS Code 版本。不能为 `*`。例如：`^0.10.5` 表示兼容最低 VS Code 版本 `0.10.5`。 |
| `license`                                               |          | `string`                                   | 参见 [npm 文档](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#license)。如果你的扩展根目录下有 `LICENSE` 文件，`license` 的值应为 `"SEE LICENSE IN <filename>"`。                                                                                                     |
| `displayName`                                           |          | `string`                                   | 扩展在 Marketplace 中使用的显示名称。<br>显示名称在 Marketplace 中必须唯一。                                                                                                                                                                                                                                                            |
| `description`                                           |          | `string`                                   | 对你的扩展是什么以及做什么的简短描述。                                                                                                                                                                                                                                                                |
| `categories`                                            |          | `string[]`                                 | 你要用于扩展的分类。允许的值：`[Programming Languages, Snippets, Linters, Themes, Debuggers, Formatters, Keymaps, SCM Providers, Other, Extension Packs, Language Packs, Data Science, Machine Learning, Visualization, Notebooks, Education, Testing]`                                                                                                          |
| `keywords`                                              |          | `array`                                    | 一组 **关键字**，用于更容易地找到该扩展。这些关键字会与 Marketplace 上的其他扩展 **标签** 一起显示。此列表目前限制为 30 个关键字。                                                                                                                                   |
| `galleryBanner`                                         |          | `object`                                   | 帮助格式化 Marketplace 页头以匹配你的图标。详见下文。                                                                                                                                                                                                                                             |
| `preview`                                               |          | `boolean`                                  | 将扩展设置为在 Marketplace 中标记为预览版。                                                                                                                                                                                                                                                      |
| `main`                                                  |          | `string`                                   | 扩展的入口点。                                                                                                                                                                                                                                                                                     |
| `browser`                                               |          | `string`                                   | [Web 扩展](/vscode/extension/extension-guides/web-extensions)的入口点。                                                                                                                                                                                                                                                                                     |
| [`contributes`](/vscode/extension/references/contribution-points)    |          | `object`                                   | 描述扩展[贡献](/vscode/extension/references/contribution-points)的对象。                                                                                                                                                                                                                             |
| [`activationEvents`](/vscode/extension/references/activation-events) |          | `array`                                    | 此扩展的[激活事件](/vscode/extension/references/activation-events)数组。                                                                                                                                                                                                                             |
| `badges`                                                |          | `array`                                    | 在 Marketplace 扩展页面侧边栏中显示的[已批准](/vscode/extension/references/extension-manifest#approved-badges)徽章数组。每个徽章是一个包含 3 个属性的对象：`url` 为徽章图片 URL，`href` 为用户点击徽章时跳转的链接，`description` 为描述。       |
| `markdown`                                              |          | `string`                                   | 控制 Marketplace 中使用的 Markdown 渲染引擎。可选 `github`（默认）或 `standard`。                                                                                                                                                                                                               |
| `qna`                                                   |          | `marketplace`（默认）、`string`、`false` | 控制 Marketplace 中的 **问答** 链接。设为 `marketplace` 启用默认的 Marketplace 问答网站。设为字符串提供自定义问答网站的 URL。设为 `false` 完全禁用问答功能。                                                                                              |
| `sponsor` |                                             | `object` | 指定用户可以赞助你的扩展的位置。这是一个包含单个属性 `url` 的对象，该链接指向用户可以赞助你的扩展的页面。                                                                                                                                                                                                                                                     |
| `dependencies`                                          |          | `object`                                   | 你的扩展需要的任何运行时 Node.js 依赖。与 [npm 的 `dependencies`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies) 完全相同。                                                                                                                                                            |
| `devDependencies`                                       |          | `object`                                   | 你的扩展需要的任何开发 Node.js 依赖。与 [npm 的 `devDependencies`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#devdependency) 完全相同。                                                                                                                                                   |
| `extensionPack`                                         |          | `array`                                    | 包含可一起安装的扩展 ID 的数组。扩展的 ID 格式始终为 `${publisher}.${name}`。例如：`vscode.csharp`。                                                                              |
| `extensionDependencies`                                 |          | `array`                                    | 包含此扩展所依赖的扩展 ID 的数组。扩展的 ID 格式始终为 `${publisher}.${name}`。例如：`vscode.csharp`。                                                                           |
| `extensionKind` | | `array` | 指示扩展在远程配置中应在哪里运行的数组。值为 `ui`（本地运行）、`workspace`（远程机器上运行）或两者兼有，顺序设置优先级。例如：`[ui, workspace]` 表示扩展可以在任一位置运行但优先在本地机器上运行。详见[此处](/vscode/extension/advanced-topics/extension-host#preferred-extension-location)。                                                                   |
| `scripts`                                               |          | `object`                                   | 与 [npm 的 `scripts`](https://docs.npmjs.com/misc/scripts) 完全相同，但增加了 VS Code 特定字段，如 [vscode:prepublish](/vscode/extension/working-with-extensions/publishing-extension#prepublish-step) 或 [vscode:uninstall](/vscode/extension/references/extension-manifest#extension-uninstall-hook)。                   |
| `icon`                                                  |          | `string`                                   | 图标的路径，至少 128x128 像素（Retina 屏幕为 256x256）。                                                                                                                                                                                                                                          |
| `pricing`                                               |         | `string`                                   | 扩展的定价信息。允许的值：`Free`、`Trial`。默认：`Free`。详见[此处](/vscode/extension/working-with-extensions/publishing-extension#extension-pricing-label)。 |
| `capabilities`                                               |         | `object`                                   | 描述扩展在受限工作区中的能力的对象：[`untrustedWorkspaces`](/vscode/extension/extension-guides/workspace-trust#static-declarations)、[`virtualWorkspaces`](/vscode/extension/extension-guides/virtual-workspaces#signal-whether-your-extension-can-handle-virtual-workspaces)。 |

另请参见 [npm 的 `package.json` 参考](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)。

## 示例

以下是一个完整的 `package.json`

```json
{
  "name": "wordcount",
  "displayName": "Word Count",
  "version": "0.1.0",
  "publisher": "ms-vscode",
  "description": "Markdown Word Count Example - reports out the number of words in a Markdown file.",
  "author": {
    "name": "sean"
  },
  "categories": ["Other"],
  "icon": "images/icon.png",
  "galleryBanner": {
    "color": "#C80000",
    "theme": "dark"
  },
  "pricing": "Free",
  "activationEvents": ["onLanguage:markdown"],
  "engines": {
    "vscode": "^1.0.0"
  },
  "main": "./out/extension",
  "scripts": {
    "vscode:prepublish": "node ./node_modules/vscode/bin/compile",
    "compile": "node ./node_modules/vscode/bin/compile -watch -p ./"
  },
  "devDependencies": {
    "@types/vscode": "^0.10.x",
    "typescript": "^1.6.2"
  },
  "license": "SEE LICENSE IN LICENSE.txt",
  "bugs": {
    "url": "https://github.com/microsoft/vscode-wordcount/issues",
    "email": "sean@contoso.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode-wordcount.git"
  },
  "homepage": "https://github.com/microsoft/vscode-wordcount/blob/main/README.md"
}
```

## Marketplace 展示技巧

以下是一些让扩展在 [VS Code Marketplace](https://marketplace.visualstudio.com/VSCode) 上展示效果更好的技巧和建议。

始终使用最新版本的 `vsce`，运行 `npm install -g @vscode/vsce` 确保你已安装。

在扩展根目录下放置一个 `README.md` Markdown 文件，我们会将其内容包含在扩展详情的正文中（在 Marketplace 上）。你可以在 `README.md` 中提供相对路径的图片链接。

以下是几个示例：

1. [Word Count](https://marketplace.visualstudio.com/items?itemName=ms-vscode.wordcount)
2. [MD Tools](https://marketplace.visualstudio.com/items/seanmcbreen.MDTools)

提供良好的显示名称和描述。这对 Marketplace 和产品内展示非常重要。这些字符串也用于 VS Code 中的文本搜索，包含相关的关键字会很有帮助。

```json
    "displayName": "Word Count",
    "description": "Markdown Word Count Example - reports out the number of words in a Markdown file.",
```

图标和对比鲜明的横幅颜色在 Marketplace 页头看起来效果很好。`theme` 属性指的是横幅中使用的字体颜色 - `dark` 或 `light`。

```json
{
  "icon": "images/icon.png",
  "galleryBanner": {
    "color": "#C80000",
    "theme": "dark"
  }
}
```

你可以设置几个可选的链接（`bugs`、`homepage`、`repository`），这些链接会显示在 Marketplace 的 **资源** 部分。

```json
{
  "license": "SEE LICENSE IN LICENSE.txt",
  "homepage": "https://github.com/microsoft/vscode-wordcount/blob/main/README.md",
  "bugs": {
    "url": "https://github.com/microsoft/vscode-wordcount/issues",
    "email": "sean@contoso.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode-wordcount.git"
  }
}
```

| Marketplace 资源链接 | package.json 属性 |
| -------------------------- | ---------------------- |
| 问题                     | `bugs:url`             |
| 代码仓库                 | `repository:url`       |
| 主页                   | `homepage`             |
| 许可证                    | `license`              |

为你的扩展设置 `category`（分类）。相同 `category` 的扩展在 Marketplace 上会分组在一起，这有助于筛选和发现。

> **注意**：只使用对你的扩展有意义的值。允许的值为 `[Programming Languages, Snippets, Linters, Themes, Debuggers, Formatters, Keymaps, SCM Providers, Other, Extension Packs, Language Packs, Data Science, Machine Learning, Visualization, Notebooks, Education, Testing]`。对于语法高亮和代码补全等通用语言功能，请使用 `Programming Languages`。`Language Packs` 类别保留给显示语言扩展（例如保加利亚语本地化）。

```json
{
  "categories": ["Linters", "Programming Languages", "Other"]
}
```

### 已批准的徽章

出于安全考虑，我们只允许来自可信服务的徽章。

我们允许来自以下 URL 前缀的徽章：

- api.travis-ci.com
- app.fossa.io
- badge.buildkite.com
- badge.fury.io
- badgen.net
- badges.frapsoft.com
- badges.gitter.im
- cdn.travis-ci.com
- ci.appveyor.com
- circleci.com
- cla.opensource.microsoft.com
- codacy.com
- codeclimate.com
- codecov.io
- coveralls.io
- david-dm.org
- deepscan.io
- dev.azure.com
- docs.rs
- flat.badgen.net
- github.com（仅限 Workflows）
- gitlab.com
- godoc.org
- goreportcard.com
- img.shields.io
- isitmaintained.com
- marketplace.visualstudio.com
- nodesecurity.io
- opencollective.com
- snyk.io
- travis-ci.com
- visualstudio.com
- vsmarketplacebadges.dev

注意：请将 vsmarketplacebadge.apphb.com 徽章替换为 vsmarketplacebadges.dev 徽章。

如果你有其他想使用的徽章，请在 GitHub 上提交一个 [issue](https://github.com/microsoft/vscode/issues)，我们很乐意查看。

## 合并扩展贡献

`yo code` 生成器可以让你轻松打包 TextMate 主题、着色器和代码片段，并创建新的扩展。运行生成器时，它会为每个选项创建一个完整的独立扩展包。然而，拥有一个合并多种贡献的单一扩展通常更加方便。例如，如果你要添加对新语言的支持，你可能希望同时为用户提供带有着色功能的语言定义以及代码片段，甚至调试支持。

要合并扩展贡献，请编辑现有扩展清单 `package.json`，添加新的贡献和关联的文件。

以下是一个包含 LaTex 语言定义（语言标识符和文件扩展名）、着色器（`grammars`）和代码片段的扩展清单。

```json
{
  "name": "language-latex",
  "description": "LaTex Language Support",
  "version": "0.0.1",
  "publisher": "someone",
  "engines": {
    "vscode": "0.10.x"
  },
  "categories": ["Programming Languages", "Snippets"],
  "contributes": {
    "languages": [
      {
        "id": "latex",
        "aliases": ["LaTeX", "latex"],
        "extensions": [".tex"]
      }
    ],
    "grammars": [
      {
        "language": "latex",
        "scopeName": "text.tex.latex",
        "path": "./syntaxes/latex.tmLanguage.json"
      }
    ],
    "snippets": [
      {
        "language": "latex",
        "path": "./snippets/snippets.json"
      }
    ]
  }
}
```

注意，扩展清单的 `categories` 属性现在同时包含 `Programming Languages` 和 `Snippets`，以便在 Marketplace 上更容易发现和筛选。

> **提示**：确保合并后的贡献使用相同的标识符。在上面的示例中，所有三个贡献都使用 "latex" 作为语言标识符。这让 VS Code 知道着色器（`grammars`）和代码片段是为 LaTeX 语言提供的，并将在编辑 LaTeX 文件时处于活动状态。

## 扩展包

你可以将单独的扩展捆绑在一起形成 **扩展包**（Extension Pack）。扩展包是一组将一起安装的扩展。这让你可以轻松与他人分享你最喜欢的扩展，或者为特定场景（如 PHP 开发）创建一组扩展，帮助 PHP 开发者快速上手 VS Code。

扩展包使用 `package.json` 文件中的 `extensionPack` 属性来捆绑其他扩展。

例如，以下是一个包含调试器和语言服务的 PHP 扩展包：

```json
{
  "extensionPack": [
    "xdebug.php-debug",
    "zobo.php-intellisense"
  ]
}
```

安装扩展包时，VS Code 现在还会安装其扩展依赖。

扩展包应在 Marketplace 的 `Extension Packs` 分类中进行分类：

```json
{
  "categories": ["Extension Packs"]
}
```

要创建扩展包，你可以使用 `yo code` Yeoman 生成器并选择 **New Extension Pack** 选项。有一个选项可以用你当前在 VS Code 实例中安装的扩展集来填充扩展包。这样，你可以轻松创建包含你最喜欢扩展的扩展包，将其发布到 Marketplace，并与他人分享。

扩展包与其捆绑的扩展之间不应有功能依赖关系，捆绑的扩展应独立于扩展包进行管理。如果某个扩展依赖于另一个扩展，该依赖应使用 `extensionDependencies` 属性声明。

## 扩展卸载钩子

如果你的扩展在从 VS Code 卸载时需要进行一些清理工作，可以在扩展的 package.json 的 `scripts` 部分中向卸载钩子 `vscode:uninstall` 注册一个 `node` 脚本。

```json
{
  "scripts": {
    "vscode:uninstall": "node ./out/src/lifecycle"
  }
}
```

当扩展从 VS Code 完全卸载时（即在卸载扩展后重新启动 VS Code（关闭再启动）时），此脚本将被执行。

**注意**：仅支持 Node.js 脚本。

## 实用的 Node 模块

npmjs 上有几个 Node.js 模块可以帮助编写 VS Code 扩展。你可以将它们包含在扩展的 `dependencies` 部分中。

- [vscode-nls](https://www.npmjs.com/package/vscode-nls) - 支持国际化和本地化。
- [vscode-uri](https://www.npmjs.com/package/vscode-uri) - VS Code 及其扩展使用的 URI 实现。
- [jsonc-parser](https://www.npmjs.com/package/jsonc-parser) - 用于处理带或不带注释的 JSON 的扫描器和容错解析器。
- [request-light](https://www.npmjs.com/package/request-light) - 支持代理的轻量级 Node.js 请求库
- [vscode-extension-telemetry](https://www.npmjs.com/package/@vscode/extension-telemetry) - VS Code 扩展的一致遥测报告。
- [vscode-languageclient](https://www.npmjs.com/package/vscode-languageclient) - 轻松集成遵循[语言服务器协议](https://microsoft.github.io/language-server-protocol)的语言服务器。

## 后续步骤

要了解更多关于 VS Code 可扩展性模型的内容，请尝试以下主题：

- [贡献点](/vscode/extension/references/contribution-points) - VS Code 贡献点参考
- [激活事件](/vscode/extension/references/activation-events) - VS Code 激活事件参考
- [扩展市场](/docs/configure/extensions/extension-marketplace) - 了解更多关于 VS Code 扩展市场的信息
