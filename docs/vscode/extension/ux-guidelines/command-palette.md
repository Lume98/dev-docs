---
title: Command Palette
description: VS Code 扩展中 Command Palette 的 UX 指南。
---

# Command Palette

[Command Palette](/vscode/extension/references/contribution-points#contributes.commands) 是查找所有命令的入口。请确保命令命名清晰恰当，以便用户能够轻松找到它们。

**✔️ 建议**

* 在适当的情况下添加键盘快捷键
* 使用清晰明确的命令名称
* 将相关命令归入同一类别

❌ 不建议

* 覆盖已有的键盘快捷键
* 在命令名称中使用表情符号

![Command Palette](images/examples/command-palette.png)

*此示例中的每个命令都显示了清晰的 `category` 前缀，例如"GitHub Issues"。*

## 链接

* [Commands API 参考](/vscode/extension/references/contribution-points#contributes.commands)
* [Commands 扩展指南](/vscode/extension/extension-guides/command)
* [Hello World 扩展示例](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample)
