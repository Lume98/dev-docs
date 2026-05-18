---
title: Markdown 扩展
description: 了解如何扩展 Visual Studio Code 内置的 Markdown 预览功能。
---

# Markdown 扩展

Markdown 扩展允许你扩展和增强 Visual Studio Code 内置的 Markdown 预览功能，包括更改预览的外观或添加对新 Markdown 语法的支持。

## 使用 CSS 更改 Markdown 预览的外观

扩展可以通过贡献 CSS 来更改 Markdown 预览的外观或布局。样式表通过扩展的 `package.json` 中的 `markdown.previewStyles` [贡献点](/vscode/extension/references/contribution-points) 进行注册：

```json
"contributes": {
    "markdown.previewStyles": [
        "./style.css"
    ]
}
```

`"markdown.previewStyles"` 是相对于扩展根目录的文件列表。

贡献的样式会在内置的 Markdown 预览样式之后、用户的 `"markdown.styles"` 之前添加。

[Markdown Preview GitHub Styling](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles) 扩展是一个很好的示例，它展示了如何使用样式表使 Markdown 预览看起来像 GitHub 的渲染效果。你可以在 [GitHub](https://github.com/mjbvz/vscode-github-markdown-preview-style) 上查看该扩展的源代码。

## 使用 markdown-it 插件添加对新语法的支持

VS Code Markdown 预览支持 [CommonMark 规范](https://spec.commonmark.org)。扩展可以通过贡献 [markdown-it 插件](https://github.com/markdown-it/markdown-it#syntax-extensions) 来添加对额外 Markdown 语法的支持。

要贡献 markdown-it 插件，首先在扩展的 `package.json` 中添加 `"markdown.markdownItPlugins"` 贡献声明：

```json
"contributes": {
    "markdown.markdownItPlugins": true
}
```

然后，在扩展的主 `activation` 函数中，返回一个包含名为 `extendMarkdownIt` 函数的对象。该函数接收当前的 markdown-it 实例，并且必须返回一个新的 markdown-it 实例：

```ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  return {
    extendMarkdownIt(md: any) {
      return md.use(require('markdown-it-emoji'));
    }
  };
}
```

要贡献多个 markdown-it 插件，可以链式返回多个 `use` 调用：

```ts
return md.use(require('markdown-it-emoji')).use(require('markdown-it-hashtag'));
```

贡献 markdown-it 插件的扩展会在首次显示 Markdown 预览时延迟激活。

[markdown-emoji](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-emoji) 扩展演示了如何使用 markdown-it 插件为 Markdown 预览添加 emoji 支持。你可以在 [GitHub](https://github.com/mjbvz/vscode-markdown-emoji) 上查看该 Emoji 扩展的源代码。

你可能还想了解：

- markdown-it 插件开发者的[指南](https://github.com/markdown-it/markdown-it/blob/master/docs/development.md)
- [现有的 markdown-it 插件](https://www.npmjs.com/browse/keyword/markdown-it-plugin)

## 使用脚本添加高级功能

对于高级功能，扩展可以贡献在 Markdown 预览内部执行的脚本。

```json
"contributes": {
    "markdown.previewScripts": [
        "./main.js"
    ]
}
```

贡献的脚本会异步加载，并在每次内容更改时重新加载。

[Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) 扩展演示了如何使用脚本为 Markdown 预览添加 [Mermaid](https://mermaid.js.org) 图表和流程图支持。你可以在 [GitHub](https://github.com/mjbvz/vscode-markdown-mermaid) 上查看该 Mermaid 扩展的源代码。
