---
title: Language Model Chat Provider API
description: 了解如何实现 LanguageModelChatProvider，为 VS Code 的聊天体验贡献自定义语言模型供扩展使用。
---

# Language Model Chat Provider API

Language Model Chat Provider API 使你能够在 Visual Studio Code 的聊天中贡献自己的语言模型。

> [!NOTE]
> 如果你是 Copilot Business 或 Enterprise 用户，你的管理员可以在 GitHub.com 的 [Copilot 策略设置](https://github.com/settings/copilot/features)中禁用**Bring Your Own Language Model Key**策略，以限制通过此 API 提供的模型。

## 概述

`LanguageModelChatProvider` 接口遵循一对多的关系，即一个提供者可以提供多个模型。每个提供者负责：

- 发现和准备可用的语言模型
- 处理其模型的聊天请求
- 提供 token 计数功能

## 语言模型信息

每个语言模型必须通过 `LanguageModelChatInformation` 接口提供元数据。`provideLanguageModelChatInformation` 方法返回这些对象的数组，以告知 VS Code 可用的模型。

```typescript
interface LanguageModelChatInformation {
    readonly id: string;                    // 模型的唯一标识符 - 在提供者内唯一
    readonly name: string;                  // 语言模型的人类可读名称 - 显示在模型选择器中
    readonly family: string;                // 模型系列名称
    readonly version: string;               // 版本字符串
    readonly maxInputTokens: number;        // 模型可接受的最大输入 token 数
    readonly maxOutputTokens: number;       // 模型能够生成的最大输出 token 数
    readonly tooltip?: string;              // 在 UI 中悬停模型时显示的可选工具提示文本
    readonly detail?: string;               // 与模型一起渲染的人类可读文本
    readonly capabilities: {
        readonly imageInput?: boolean;      // 支持图片输入
        readonly toolCalling?: boolean | number; // 支持工具调用
    };
}
```

## 注册提供者

1. 第一步是在 `package.json` 的 `contributes.languageModelChatProviders` 部分注册提供者。提供一个唯一的 `vendor` ID 和一个 `displayName`。

    ```json
    {
        "contributes": {
            "languageModelChatProviders": [
                {
                    "vendor": "my-provider",
                    "displayName": "My Provider"
                }
            ]
        }
    }
    ```

1. 接下来，在扩展激活函数中，使用 `lm.registerLanguageModelChatProvider` 方法注册你的语言模型提供者。

    提供你在 `package.json` 中使用的提供者 ID 和提供者类的实例：

    ```typescript
    import * as vscode from 'vscode';
    import { SampleChatModelProvider } from './provider';

    export function activate(_: vscode.ExtensionContext) {
        vscode.lm.registerLanguageModelChatProvider('my-provider', new SampleChatModelProvider());
    }
    ```

1. 可选地，在 `package.json` 中提供 `contributes.languageModelChatProviders.managementCommand`，以允许用户管理语言模型提供者。

    `managementCommand` 属性的值必须是 `package.json` 的 `contributes.commands` 部分中定义的命令。在你的扩展中，注册该命令（`vscode.commands.registerCommand`）并实现管理提供者的逻辑，例如配置 API 密钥或其他设置。

    ```json
    {
        "contributes": {
            "languageModelChatProviders": [
                {
                    "vendor": "my-provider",
                    "displayName": "My Provider",
                    "managementCommand": "my-provider.manage"
                }
            ],
            "commands": [
                {
                    "command": "my-provider.manage",
                    "title": "Manage My Provider"
                }
            ]
        }
    }
    ```

## 实现提供者

语言模型提供者必须实现 `LanguageModelChatProvider` 接口，该接口有三个主要方法：

- `provideLanguageModelChatInformation`：返回可用模型列表
- `provideLanguageModelChatResponse`：处理聊天请求并流式传输响应
- `provideTokenCount`：实现 token 计数功能

### 准备语言模型信息

`provideLanguageModelChatInformation` 方法由 VS Code 调用以发现可用模型，返回 `LanguageModelChatInformation` 对象列表。

使用 `options.silent` 参数来控制是否提示用户输入凭据或额外配置：

```typescript
async provideLanguageModelChatInformation(
    options: { silent: boolean },
    token: CancellationToken
): Promise<LanguageModelChatInformation[]> {
    if (options.silent) {
        return []; // 静默模式下不提示用户
    } else {
        await this.promptForApiKey(); // 提示用户输入凭据
    }

    // 从你的服务获取可用模型
    const models = await this.fetchAvailableModels();

    // 将你的模型映射为 LanguageModelChatInformation 格式
    return models.map(model => ({
        id: model.id,
        name: model.displayName,
        family: model.family,
        version: '1.0.0',
        maxInputTokens: model.contextWindow - model.maxOutput,
        maxOutputTokens: model.maxOutput,
        capabilities: {
            imageInput: model.supportsImages,
            toolCalling: model.supportsTools
        }
    }));
}
```

### 处理聊天请求

`provideLanguageModelChatResponse` 方法处理实际的聊天请求。提供者以 `LanguageModelChatRequestMessage` 格式接收消息数组，你可以选择将其转换为语言模型 API 所需的格式（参见[消息格式和转换](#消息格式和转换)）。

使用 `progress` 参数流式传输响应块。响应可以包含文本部分、工具调用和工具结果（参见[响应部分](#响应部分)）。

```typescript
async provideLanguageModelChatResponse(
    model: LanguageModelChatInformation,
    messages: readonly LanguageModelChatRequestMessage[],
    options: ProvideLanguageModelChatResponseOptions,
    progress: Progress<LanguageModelResponsePart>,
    token: CancellationToken
): Promise<void> {

    // TODO: 实现消息转换、处理和响应流式传输

    // 可选地，根据模型 ID 区分行为
    if (model.id === "my-model-a") {
        progress.report(new LanguageModelTextPart("This is my A response."));
    } else {
        progress.report(new LanguageModelTextPart("Unknown model."));
    }
}
```

### 提供 token 计数

`provideTokenCount` 方法负责估算给定文本输入中的 token 数量：

```typescript
async provideTokenCount(
    model: LanguageModelChatInformation,
    text: string | LanguageModelChatRequestMessage,
    token: CancellationToken
): Promise<number> {
    // TODO: 为你的模型实现 token 计数

    // 字符串估算示例
    return Math.ceil(text.toString().length / 4);
}
```

## 消息格式和转换

你的提供者以 `LanguageModelChatRequestMessage` 格式接收消息，通常需要将其转换为你的服务 API 格式。消息内容可以是文本部分、工具调用和工具结果的混合。

```typescript
interface LanguageModelChatRequestMessage {
    readonly role: LanguageModelChatMessageRole;
    readonly content: ReadonlyArray<LanguageModelInputPart | unknown>;
    readonly name: string | undefined;
}
```

可选地，为你的语言模型 API 适当转换这些消息：

```typescript
private convertMessages(messages: readonly LanguageModelChatRequestMessage[]) {
    return messages.map(msg => ({
        role: msg.role === vscode.LanguageModelChatMessageRole.User ? 'user' : 'assistant',
        content: msg.content
            .filter(part => part instanceof vscode.LanguageModelTextPart)
            .map(part => (part as vscode.LanguageModelTextPart).value)
            .join('')
    }));
}
```

## 响应部分

你的提供者可以通过 progress 回调报告不同类型的响应部分，类型为 `LanguageModelResponsePart`，可以是以下之一：

- `LanguageModelTextPart` — 文本内容
- `LanguageModelToolCallPart` — 工具/函数调用
- `LanguageModelToolResultPart` — 工具结果内容

## 入门指南

你可以通过一个[基础示例项目](https://github.com/microsoft/vscode-extension-samples/blob/main/chat-model-provider-sample)开始。

## 相关内容

- [VS Code API 参考](/vscode/extension/references/vscode-api)
- [Language Model API 指南](/vscode/extension/extension-guides/ai/language-model)
- [Chat API 扩展](/vscode/extension/extension-guides/ai/chat)
