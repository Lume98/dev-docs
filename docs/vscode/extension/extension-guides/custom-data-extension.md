---
title: 自定义数据扩展
description: 了解如何扩展 Visual Studio Code 的 HTML 和 CSS 语言支持。
---

# 自定义数据扩展

[自定义数据格式](https://github.com/microsoft/vscode-custom-data)允许扩展作者轻松扩展 VS Code 的 HTML / CSS 语言支持，而无需编写代码。

在扩展中使用自定义数据的两个[贡献点](/vscode/extension/references/contribution-points)是：

- `contributes.html.customData`
- `contributes.css.customData`

例如，在扩展的 `package.json` 中包含以下配置：

```json
{
  "contributes": {
    "html": {
      "customData": ["./html.html-data.json"]
    },
    "css": {
      "customData": ["./css.css-data.json"]
    }
  }
}
```

VS Code 将加载这两个文件中定义的 HTML/CSS 实体，并为这些实体提供语言支持，如自动补全和悬停信息。

你可以在 [microsoft/vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples) 中找到 [custom-data-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/custom-data-sample) 示例。
