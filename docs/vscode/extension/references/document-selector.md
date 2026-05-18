---
title: 文档选择器
description: Visual Studio Code 扩展可以基于文档选择器，按语言、文件类型和位置来筛选其功能。
---

# 文档选择器

扩展可以基于文档选择器，按语言、文件类型和位置来筛选其功能。本主题讨论文档选择器、文档方案以及扩展作者需要注意的事项。

## 不在磁盘上的文本文档

并非所有文本文档都存储在磁盘上，例如新创建的文档。除非特别指定，文档选择器适用于**所有**文档类型。使用 [DocumentFilter](/vscode/extension/references/vscode-api#DocumentFilter) 的 `scheme` 属性可以限定到特定的方案，例如 `{ scheme: 'file', language: 'typescript' }` 仅匹配存储在磁盘上的 TypeScript 文件。

## 文档选择器

Visual Studio Code 扩展 API 通过 [DocumentSelector](/vscode/extension/references/vscode-api#DocumentSelector) 类型将语言特定功能（如 IntelliSense）与文档选择器相结合。这是一种将功能限定到特定语言的简便机制。

下面的代码片段为 TypeScript 文件注册了一个 [HoverProvider](/vscode/extension/references/vscode-api#HoverProvider)，文档选择器是 `typescript` 语言标识符字符串。

```ts
vscode.languages.registerHoverProvider('typescript', {
  provideHover(doc: vscode.TextDocument) {
    return new vscode.Hover('For *all* TypeScript documents.');
  }
});
```

文档选择器不仅可以是语言标识符，更复杂的选择器可以使用 [DocumentFilter](/vscode/extension/references/vscode-api#DocumentFilter) 来基于 `scheme` 和文件位置（通过 `pattern` 路径 glob 模式）进行筛选：

```ts
vscode.languages.registerHoverProvider(
  { pattern: '**/test/**' },
  {
    provideHover(doc: vscode.TextDocument) {
      return new vscode.Hover('For documents inside `test`-folders only');
    }
  }
);
```

下面的代码片段使用 `scheme` 筛选器并结合语言标识符。`untitled` 方案用于尚未保存到磁盘的新文件。

```ts
vscode.languages.registerHoverProvider(
  { scheme: 'untitled', language: 'typescript' },
  {
    provideHover(doc: vscode.TextDocument) {
      return new vscode.Hover('For new, unsaved TypeScript documents only');
    }
  }
);
```

## 文档方案

文档的 `scheme` 常被忽视，但它是一条重要信息。大多数文档保存在磁盘上，扩展作者通常假设自己操作的是磁盘上的文件。例如，使用简单的 `typescript` 选择器时，隐含的假设是**磁盘上的 TypeScript 文件**。然而在某些场景下，这种假设过于宽松，应该使用更明确的选择器，如 `{ scheme: 'file', language: 'typescript' }`。

这一点的重要性体现在功能依赖于从磁盘读写文件时。请看下面的代码片段：

```ts
// 👎 过于宽松
vscode.languages.registerHoverProvider('typescript', {
  provideHover(doc: vscode.TextDocument) {
    const { size } = fs.statSync(doc.uri.fsPath); // ⚠️ 'untitled:/Untitled1.ts' 或其他方案怎么办？
    return new vscode.Hover(`Size in bytes is ${size}`);
  }
});
```

上面的悬停提供程序想要显示文档在磁盘上的大小，但它没有检查文档是否确实存储在磁盘上。例如，文档可能是新创建的、尚未保存的。正确的做法是告诉 VS Code 该提供程序只能处理磁盘上的文件。

```ts
// 👍 仅处理磁盘上的文件
vscode.languages.registerHoverProvider(
  { scheme: 'file', language: 'typescript' },
  {
    provideHover(doc: vscode.TextDocument) {
      const { size } = fs.statSync(doc.uri.fsPath);
      return new vscode.Hover(`Size in bytes is ${size}`);
    }
  }
);
```

## 小结

文档通常存储在文件系统上，但并非总是如此：还有未保存的文档、Git 使用的缓存文档、来自 FTP 等远程来源的文档等等。如果你的功能依赖于磁盘访问，请务必使用带有 `file` 方案的文档选择器。

## 后续步骤

要了解更多关于 VS Code 扩展性模型的内容，请参阅以下主题：

- [扩展清单文件](/vscode/extension/references/extension-manifest) - VS Code package.json 扩展清单文件参考
- [贡献点](/vscode/extension/references/contribution-points) - VS Code 贡献点参考
