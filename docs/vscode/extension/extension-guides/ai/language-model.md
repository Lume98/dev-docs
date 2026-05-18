---
title: Language Model API
description: 使用语言模型和自然语言理解为 VS Code 扩展添加 AI 驱动功能的指南。
---

# Language Model API

Language Model API 使你能够[使用语言模型](/vscode/extension/references/vscode-api#lm)，并在 Visual Studio Code 扩展中集成 AI 驱动功能和自然语言处理。

你可以在不同类型的扩展中使用 Language Model API。该 API 的典型用途是[聊天扩展](/vscode/extension/extension-guides/ai/chat)，在其中使用语言模型来解释用户请求并帮助提供答案。然而，Language Model API 的使用不限于这种场景。你可以在[语言扩展](/vscode/extension/language-extensions/overview)或[调试器扩展](/vscode/extension/extension-guides/debugger-extension)中使用语言模型，或将其作为自定义扩展中[命令](/vscode/extension/extension-guides/command)或[任务](/vscode/extension/extension-guides/task-provider)的一部分。例如，Rust 扩展可以使用 Language Model 来提供默认名称以改善其重命名体验。

使用 Language Model API 的过程包括以下步骤：

1. 构建语言模型提示
1. 发送语言模型请求
1. 解释响应

以下各节提供了有关如何在扩展中实现这些步骤的更多详细信息。

要开始使用，你可以浏览[聊天扩展示例](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample)。

## 构建语言模型提示

要与语言模型交互，扩展应首先精心设计提示，然后向语言模型发送请求。你可以使用提示向语言模型提供有关你使用模型的广泛任务的指令。提示还可以定义解释用户消息时的上下文。

Language Model API 在构建语言模型提示时支持两种类型的消息：

- **User** — 用于提供指令和用户请求
- **Assistant** — 用于将先前语言模型响应的历史作为上下文添加到提示中

> **注意**：目前，Language Model API 不支持使用系统消息。

你可以使用两种方法来构建语言模型提示：

- `LanguageModelChatMessage` — 通过提供一个或多个字符串消息来创建提示。如果你刚开始使用 Language Model API，可以使用此方法。
- [`@vscode/prompt-tsx`](https://www.npmjs.com/package/@vscode/prompt-tsx) — 使用 TSX 语法声明提示。

如果你想对语言模型提示的组合方式有更多控制，可以使用 `prompt-tsx` 库。例如，该库可以帮助动态调整提示的长度以适应每个语言模型的上下文窗口大小。了解更多关于 [`@vscode/prompt-tsx`](https://www.npmjs.com/package/@vscode/prompt-tsx) 的信息，或浏览[聊天扩展示例](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample)以开始使用。

要了解更多关于提示工程概念的信息，我们建议阅读 OpenAI 出色的[提示工程指南](https://platform.openai.com/docs/guides/prompt-engineering)。

>**提示：** 利用丰富的 VS Code 扩展 API 获取最相关的上下文并将其包含在提示中。例如，包含编辑器中活动文件的内容。

### 使用 `LanguageModelChatMessage` 类

Language Model API 提供了 `LanguageModelChatMessage` 类来表示和创建聊天消息。你可以分别使用 `LanguageModelChatMessage.User` 或 `LanguageModelChatMessage.Assistant` 方法来创建用户或助手消息。

在以下示例中，第一条消息提供了提示的上下文：

- 模型在回复中使用的人设（在本例中，是一只猫）
- 模型在生成响应时应遵循的规则（在本例中，使用猫的比喻以有趣的方式解释计算机科学概念）

第二条消息则提供了来自用户的具体请求或指令。它确定了在第一条消息提供的上下文中要完成的具体任务。

```typescript
const craftedPrompt = [
    vscode.LanguageModelChatMessage.User('You are a cat! Think carefully and step by step like a cat would. Your job is to explain computer science concepts in the funny manner of a cat, using cat metaphors. Always start your response by stating what concept you are explaining. Always include code samples.'),
    vscode.LanguageModelChatMessage.User('I want to understand recursion')
];
```

## 发送语言模型请求

一旦你构建了语言模型的提示，首先使用 [`selectChatModels`](/vscode/extension/references/vscode-api#lm.selectChatModels) 方法选择要使用的语言模型。此方法返回一个与指定条件匹配的语言模型数组。如果你正在实现 Chat Participant，我们建议你改用聊天请求处理器中 `request` 对象附带传递的模型。这确保你的扩展尊重用户在聊天模型下拉菜单中选择的模型。然后，使用 [`sendRequest`](/vscode/extension/references/vscode-api#LanguageModelChat) 方法将请求发送给语言模型。

要选择语言模型，你可以指定以下属性：`vendor`、`id`、`family` 或 `version`。使用这些属性可以广泛匹配给定供应商或系列的所有模型，或通过 ID 选择特定模型。在 [API 参考](/vscode/extension/references/vscode-api#LanguageModelChat)中了解更多关于这些属性的信息。

> **注意**：目前，`gpt-4o`、`gpt-4o-mini`、`o1`、`o1-mini`、`claude-3.5-sonnet` 是支持的语言模型系列。如果你不确定使用哪个模型，我们推荐 `gpt-4o`，因为它的性能和质量。对于直接在编辑器中的交互，我们推荐 `gpt-4o-mini`，因为它的性能。

如果没有与指定条件匹配的模型，`selectChatModels` 方法将返回空数组。你的扩展必须妥善处理这种情况。

以下示例展示了如何选择所有 `Copilot` 模型，无论系列或版本如何：

```typescript
const models = await vscode.lm.selectChatModels({
  vendor: 'copilot'
});

// 没有可用模型
if (models.length === 0) {
  // TODO: 处理没有可用模型的情况
}
```

> **重要**：Copilot 的语言模型需要用户同意后扩展才能使用。同意通过身份验证对话框实现。因此，`selectChatModels` 应作为用户发起的操作（如命令）的一部分来调用。

选择模型后，你可以通过在模型实例上调用 [`sendRequest`](/vscode/extension/references/vscode-api#LanguageModelChat) 方法向语言模型发送请求。你传递先前[构建的提示](#构建语言模型提示)，以及任何附加选项和取消令牌。

当你向 Language Model API 发出请求时，请求可能会失败。例如，因为模型不存在，用户未授权使用 Language Model API，或者超出了配额限制。使用 `LanguageModelError` 来区分不同类型的错误。

以下代码片段展示了如何发起语言模型请求：

```typescript
try {
    const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' });
    const request = model.sendRequest(craftedPrompt, {}, token);
} catch (err) {
    // 发起聊天请求可能会失败，因为
    // - 模型不存在
    // - 用户未授权
    // - 超出配额限制
    if (err instanceof vscode.LanguageModelError) {
        console.log(err.message, err.code, err.cause);
        if (err.cause instanceof Error && err.cause.message.includes('off_topic')) {
            stream.markdown(vscode.l10n.t('I\'m sorry, I can only explain computer science concepts.'));
        }
    } else {
        // 添加其他错误处理逻辑
        throw err;
    }
}
```

## 解释响应

发送请求后，你需要处理来自 Language Model API 的响应。根据你的使用场景，你可以直接将响应传递给用户，或者解释响应并执行额外逻辑。

来自 Language Model API 的响应（[`LanguageModelChatResponse`](/vscode/extension/references/vscode-api#LanguageModelChatResponse)）是基于流式传输的，这使你能够提供流畅的用户体验。例如，当与 [Chat API](/vscode/extension/extension-guides/ai/chat) 结合使用时，可以持续报告结果和进度。

在处理流式响应时可能会发生错误，例如网络连接问题。确保在代码中添加适当的错误处理来处理这些错误。

以下代码片段展示了扩展如何注册一个命令，该命令使用语言模型将活动编辑器中的所有变量名更改为有趣的猫名。注意扩展将代码流式传输回编辑器以提供流畅的用户体验。

```typescript
 vscode.commands.registerTextEditorCommand('cat.namesInEditor', async (textEditor: vscode.TextEditor) => {
    // 用猫名和词汇替换活动编辑器中的所有变量

    const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' });
    let chatResponse: vscode.LanguageModelChatResponse | undefined;

    const text = textEditor.document.getText();

    const messages = [
        vscode.LanguageModelChatMessage.User(`You are a cat! Think carefully and step by step like a cat would.
        Your job is to replace all variable names in the following code with funny cat variable names. Be creative. IMPORTANT respond just with code. Do not use markdown!`),
        vscode.LanguageModelChatMessage.User(text)
    ];

    try {
        chatResponse = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);
    } catch (err) {
        if (err instanceof vscode.LanguageModelError) {
            console.log(err.message, err.code, err.cause)
        } else {
            throw err;
        }
        return;
    }

    // 在插入新内容之前清除编辑器内容
    await textEditor.edit(edit => {
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(textEditor.document.lineCount - 1, textEditor.document.lineAt(textEditor.document.lineCount - 1).text.length);
        edit.delete(new vscode.Range(start, end));
    });

    try {
        // 将代码从语言模型流式传输到编辑器中
        for await (const fragment of chatResponse.text) {
            await textEditor.edit(edit => {
                const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
                const position = new vscode.Position(lastLine.lineNumber, lastLine.text.length);
                edit.insert(position, fragment);
            });
        }
    } catch (err) {
        // 异步响应流可能会失败，例如网络中断或服务器端错误
        await textEditor.edit(edit => {
            const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
            const position = new vscode.Position(lastLine.lineNumber, lastLine.text.length);
            edit.insert(position, (<Error>err).message);
        });
    }
});
```

## 注意事项

### 模型可用性

我们不期望特定模型会永远得到支持。当你在扩展中引用语言模型时，请确保在向该语言模型发送请求时采取"防御性"方法。这意味着你应该优雅地处理无法访问特定模型的情况。

### 选择合适的模型

扩展作者可以选择最适合其扩展的模型。我们推荐使用 `gpt-4o`，因为它的性能和质量。要获取可用模型的完整列表，你可以使用以下代码片段：

```typescript
const allModels = await vscode.lm.selectChatModels(MODEL_SELECTOR);
```

> [!NOTE]
> 推荐的 GPT-4o 模型有 `64K` token 的限制。从 `selectChatModels` 调用返回的模型对象有一个 `maxInputTokens` 属性，显示 token 限制。随着我们了解更多关于扩展如何使用语言模型的情况，这些限制将会扩大。

### 速率限制

扩展应负责任地使用语言模型并注意速率限制。VS Code 对用户是透明的，关于扩展如何使用语言模型以及每个扩展发送了多少请求及其对各自配额的影响。

由于速率限制，扩展不应使用 Language Model API 进行集成测试。在内部，VS Code 使用专用的非生产语言模型进行模拟测试，我们目前正在思考如何为扩展提供可扩展的语言模型测试解决方案。

## 测试你的扩展

Language Model API 提供的响应是非确定性的，这意味着相同的请求可能会得到不同的响应。这种行为对你的扩展测试可能带来挑战。

扩展中构建提示和解释语言模型响应的部分是确定性的，因此可以在不使用实际语言模型的情况下进行单元测试。然而，与语言模型交互并获取响应本身是非确定性的，不易测试。考虑以模块化方式设计扩展代码，使你能够对可测试的特定部分进行单元测试。

## 发布你的扩展

创建 AI 扩展后，你可以将扩展发布到 Visual Studio Marketplace：

- 在发布到 VS Marketplace 之前，我们建议你阅读 [Microsoft AI 工具和实践指南](https://www.microsoft.com/en-us/ai/tools-practices)。这些指南提供了负责任地开发和使用 AI 技术的最佳实践。
- 通过发布到 VS Marketplace，你的扩展需遵守 [GitHub Copilot 可扩展性可接受的开发和使用政策](https://docs.github.com/en/early-access/copilot/github-copilot-extensibility-platform-partnership-plugin-acceptable-development-and-use-policy)。
- 如果你的扩展已经贡献了使用 Language Model API 以外的功能，我们建议你不要在[扩展清单](/vscode/extension/references/extension-manifest)中引入对 GitHub Copilot 的扩展依赖。这确保不使用 GitHub Copilot 的扩展用户可以在不安装 GitHub Copilot 的情况下使用非语言模型功能。确保在访问语言模型时对此情况有适当的错误处理。
- 按照[发布扩展](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)中的说明上传到 Marketplace。

## 相关内容

- [Language Models API 参考](/vscode/extension/references/vscode-api#lm)
- [了解更多关于 @vscode/prompt-tsx](https://www.npmjs.com/package/@vscode/prompt-tsx)
- [构建 VS Code 聊天扩展](/vscode/extension/extension-guides/ai/chat)
