---
title: VS Code 中的 AI 可扩展性
description: 概述如何通过使用 Language Model、Tools 和 Chat API 来扩展 Visual Studio Code 扩展中的 AI 功能。
---
# VS Code 中的 AI 可扩展性

本文概述了 Visual Studio Code 中的 AI 可扩展性选项，帮助你为扩展选择合适的方法。

VS Code 包含强大的 AI 功能，可增强编码体验：

- **代码补全**：在输入时提供内联代码建议
- **Agent 模式**：使 AI 能够使用专业工具自主规划和执行开发任务
- **Chat**：让开发者通过聊天界面使用自然语言提问或在代码库中进行编辑
- **智能操作**：使用 AI 增强的操作来处理常见开发任务，集成在整个编辑器中

你可以扩展和自定义上述每一项内置功能，创建满足用户特定需求的定制化 AI 体验。

## 为什么要扩展 VS Code 中的 AI？

为扩展添加 AI 功能可为用户带来多项好处：

- **Agent 模式中的领域特定知识**：让 Agent 模式访问你公司的数据源和服务
- **增强用户体验**：提供针对扩展领域量身定制的智能辅助
- **领域专业化**：创建针对特定编程语言、框架或领域的 AI 功能
- **扩展聊天功能**：向聊天界面添加专业工具或助手，实现更强大的交互
- **提升开发者生产力**：通过 AI 功能增强调试、代码审查或测试等常见开发任务

## 扩展聊天体验

### Language Model Tool

Language Model Tool 使你能够使用领域特定的功能来扩展 VS Code 中的 Agent 模式。在 Agent 模式中，这些工具会根据用户的聊天提示自动调用，以执行专业任务或从数据源或服务中检索信息。用户也可以通过 #-引用工具的方式在聊天提示中显式引用这些工具。

要实现 Language Model Tool，请在 VS Code 扩展中使用 [Language Model Tools API](/vscode/extension/extension-guides/ai/tools)。Language Model Tool 可以访问所有 VS Code 扩展 API，并与编辑器深度集成。

**主要优势**：

- 作为自主编码工作流一部分的领域特定功能
- 你的工具实现可以使用 VS Code API，因为它在扩展宿主进程中运行
- 通过 Visual Studio Marketplace 轻松分发和部署

**主要考量**：

- 远程部署需要扩展实现客户端-服务器通信
- 跨不同工具复用需要模块化的设计和实现

### MCP Tool

Model Context Protocol (MCP) 工具提供了一种通过标准化协议将外部服务与语言模型集成的方式。在 Agent 模式中，这些工具会根据用户的聊天提示自动调用，以执行专业任务或从外部数据源检索信息。

MCP 工具在 VS Code 之外运行，可以在用户机器上本地运行，也可以作为远程服务运行。用户可以通过 JSON 配置添加 MCP 工具，或者 VS Code 扩展可以通过编程方式配置它们。你可以通过各种语言 SDK 和部署选项来实现 MCP 工具。

由于 MCP 工具在 VS Code 之外运行，它们无法访问 VS Code 扩展 API。

**主要优势**：

- 作为自主编码工作流一部分添加领域特定功能
- 支持本地和远程部署选项
- 可以在其他 MCP 客户端中复用 MCP 服务器

**主要考量**：

- 无法访问 VS Code 扩展 API
- 分发和部署需要用户自行设置 MCP 服务器

### Chat Participant

Chat Participant 是专业助手，使用户能够通过领域专家扩展 Ask 模式。在聊天中，用户可以通过 @-引用 Chat Participant 并传入关于特定主题或领域的自然语言提示来调用它。Chat Participant 负责处理整个聊天交互。

要实现 Chat Participant，请在 VS Code 扩展中使用 [Chat API](/vscode/extension/extension-guides/ai/chat)。Chat Participant 可以访问所有 VS Code 扩展 API，并与编辑器深度集成。

**主要优势**：

- 控制端到端的交互流程
- 在扩展宿主进程中运行，可访问 VS Code 扩展 API
- 通过 Visual Studio Marketplace 轻松分发和部署

**主要考量**：

- 远程部署需要扩展实现客户端-服务器通信
- 跨不同工具复用需要模块化的设计和实现

## 构建你自己的 AI 驱动功能

VS Code 让你能够直接以编程方式访问 AI 模型，在扩展中创建自定义的 AI 驱动功能。这种方法使你能够构建利用 AI 功能的编辑器特定交互，而无需依赖聊天界面。

要直接使用语言模型，请在 VS Code 扩展中使用 [Language Model API](/vscode/extension/extension-guides/ai/language-model)。你可以将这些 AI 功能集成到任何扩展功能中，例如代码操作、悬停提供者、自定义视图等。

**主要优势**：

- 将 AI 功能集成到现有扩展功能中或构建新功能
- 在扩展宿主进程中运行，可访问 VS Code 扩展 API
- 通过 Visual Studio Marketplace 轻松分发和部署

**主要考量**：

- 跨不同体验复用需要模块化的设计和实现

## 选择合适的方案

在为 VS Code 扩展选择合适的 AI 扩展方法时，请考虑以下指南：

1. **选择 Language Model Tool 的场景**：
    - 你想在 VS Code 中使用专业功能扩展聊天
    - 你希望在 Agent 模式中根据用户意图自动调用
    - 你希望访问 VS Code API 以实现深度集成
    - 你希望通过 VS Code Marketplace 分发你的工具

1. **选择 MCP Tool 的场景**：
    - 你想在 VS Code 中使用专业功能扩展聊天
    - 你希望在 Agent 模式中根据用户意图自动调用
    - 你不需要与 VS Code API 集成
    - 你的工具需要跨不同环境工作（不仅仅是 VS Code）
    - 你的工具需要远程或本地运行

1. **选择 Chat Participant 的场景**：
    - 你想通过领域专家来扩展 Ask 模式
    - 你需要自定义整个交互流程和响应行为
    - 你希望访问 VS Code API 以实现深度集成
    - 你希望通过 VS Code Marketplace 分发你的工具

1. **选择 Language Model API 的场景**：
    - 你想将 AI 功能集成到现有扩展功能中
    - 你正在聊天界面之外构建 UI 体验
    - 你需要对 AI 模型请求的直接编程控制

## 后续步骤

选择最适合你扩展目标的方案：

- [实现 Language Model Tool](/vscode/extension/extension-guides/ai/tools)
- [在 VS Code 扩展中注册 MCP 工具](/vscode/extension/extension-guides/ai/mcp)
- [使用 Language Model API 在扩展中集成 AI](/vscode/extension/extension-guides/ai/language-model)
- [实现 Chat Participant](/vscode/extension/extension-guides/ai/chat)
- [使用 Inline Completions API 扩展代码补全](/vscode/extension/references/vscode-api#InlineCompletionItemProvider)

### 示例项目

- [Chat 示例](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample)：包含 Agent 模式工具和 Chat Participant 的扩展
- [代码辅导 Chat Participant 教程](/vscode/extension/extension-guides/ai/chat-tutorial)：构建专业聊天助手
- [AI 驱动的代码标注教程](/vscode/extension/extension-guides/ai/language-model-tutorial)：使用 Language Model API 的分步指南
- [MCP 扩展示例](https://github.com/microsoft/vscode-extension-samples/blob/main/mcp-extension-sample)：注册 MCP 工具的扩展
