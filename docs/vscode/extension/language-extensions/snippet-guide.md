---
title: 代码片段指南
description: 了解如何将代码片段打包为 Visual Studio Code 扩展（插件）
---

# 代码片段指南

[`contributes.snippets`](/vscode/extension/references/contribution-points#contributes.snippets) 贡献点允许你将代码片段打包为 Visual Studio Code 扩展进行分享。

[创建代码片段](https://code.visualstudio.com/docs/editing/userdefinedsnippets#_creating-your-own-snippets)主题包含了创建代码片段的所有信息。本指南/示例仅展示如何将你自己的代码片段转换为可分享的扩展。建议的工作流程是：

- 使用 `Snippets: Configure User Snippets` 命令创建并测试你的代码片段
- 当你对代码片段满意后，将整个 JSON 文件复制到扩展文件夹中，例如 `snippets.json`
- 在你的 `package.json` 中添加以下代码片段贡献

```json
{
  "contributes": {
    "snippets": [
      {
        "language": "javascript",
        "path": "./snippets.json"
      }
    ]
  }
}
```

**提示**：在 `package.json` 中使用以下配置将你的扩展标记为代码片段扩展：

```json
{
  "categories": ["Snippets"]
}
```

你可以在以下地址找到完整的源代码：[https://github.com/microsoft/vscode-extension-samples/tree/main/snippet-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/snippet-sample)。

## 使用 TextMate 代码片段

你还可以使用 [yo code](/vscode/extension/get-started/your-first-extension) 扩展生成器将 TextMate 代码片段（.tmSnippets）添加到你的 VS Code 安装中。生成器有一个 `New Code Snippets` 选项，让你指向包含多个 .tmSnippets 文件的文件夹，它们将被打包为 VS Code 代码片段扩展。生成器还支持 Sublime 代码片段（.sublime-snippets）。

最终生成器输出两个文件：扩展清单 `package.json`（包含将代码片段集成到 VS Code 的元数据）和 `snippets.json` 文件（包含转换为 VS Code 代码片段格式的代码片段）。

```bash
.
├── snippets                    // VS Code integration
│   └── snippets.json           // The JSON file w/ the snippets
└── package.json                // extension's manifest
```

将生成的 snippets 文件夹复制到 `.vscode/extensions` 文件夹下的一个新文件夹中，然后重启 VS Code。
