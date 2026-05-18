---
title: 构建语言模型提示
description: 使用 prompt-tsx 库构建语言模型提示的指南
---

# 构建语言模型提示

你可以使用字符串拼接来构建语言模型提示，但很难组合各种功能并确保提示保持在语言模型的上下文窗口内。为了克服这些限制，你可以使用 [`@vscode/prompt-tsx`](https://github.com/microsoft/vscode-prompt-tsx) 库。

`@vscode/prompt-tsx` 库提供以下功能：

- **基于 TSX 的提示渲染**：使用 TSX 组件组合提示，使其更易读、更易维护
- **基于优先级的裁剪**：自动裁剪提示中较不重要的部分，以适应模型的上下文窗口
- **灵活的 token 管理**：使用 `flexGrow`、`flexReserve` 和 `flexBasis` 等属性来协作使用 token 预算
- **工具集成**：与 VS Code 的语言模型工具 API 集成

有关所有功能和详细使用说明的完整概述，请参阅[完整 README](https://github.com/microsoft/vscode-prompt-tsx/blob/main/README.md)。

本文介绍了使用该库进行提示设计的实际示例。这些示例的完整代码可以在 [prompt-tsx 仓库](https://github.com/microsoft/vscode-prompt-tsx/tree/main/examples)中找到。

## 管理对话历史中的优先级

在提示中包含对话历史很重要，因为它使用户能够对之前的消息提出后续问题。然而，你需要确保其优先级得到适当处理，因为历史会随时间增长。我们发现通常最有意义的模式是按以下顺序排列优先级：

1. 基本提示指令
2. 当前用户查询
3. 最近几轮对话历史
4. 任何支持数据
5. 尽可能多的剩余历史

因此，在提示中将历史分为两部分，其中最近的提示轮次优先于一般上下文信息。

在此库中，树中的每个 TSX 节点都有一个优先级，在概念上类似于 zIndex，数值越大优先级越高。

### 第 1 步：定义 HistoryMessages 组件

要列出历史消息，请定义一个 `HistoryMessages` 组件。此示例提供了一个良好的起点，但如果你处理更复杂的数据类型，可能需要扩展它。

此示例使用了 `PrioritizedList` 辅助组件，它会自动为其每个子元素分配升序或降序的优先级。

```tsx
import {
	UserMessage,
	AssistantMessage,
	PromptElement,
	BasePromptElementProps,
	PrioritizedList,
} from '@vscode/prompt-tsx';
import { ChatContext, ChatRequestTurn, ChatResponseTurn, ChatResponseMarkdownPart } from 'vscode';

interface IHistoryMessagesProps extends BasePromptElementProps {
	history: ChatContext['history'];
}

export class HistoryMessages extends PromptElement<IHistoryMessagesProps> {
	render(): PromptPiece {
		const history: (UserMessage | AssistantMessage)[] = [];
		for (const turn of this.props.history) {
			if (turn instanceof ChatRequestTurn) {
				history.push(<UserMessage>{turn.prompt}</UserMessage>);
			} else if (turn instanceof ChatResponseTurn) {
				history.push(
					<AssistantMessage name={turn.participant}>
						{chatResponseToMarkdown(turn)}
					</AssistantMessage>
				);
			}
		}
		return (
			<PrioritizedList priority={0} descending={false}>
				{history}
			</PrioritizedList>
		);
	}
}
```

### 第 2 步：定义 Prompt 组件

接下来，定义一个 `MyPrompt` 组件，包含基本指令、用户查询和历史消息及其适当的优先级。优先级值在同级元素之间是局部的。记住你可能希望在裁剪提示中的其他内容之前先裁剪历史中的旧消息，因此需要将两个 `<HistoryMessages>` 元素分开：

```tsx
import {
	UserMessage,
	PromptElement,
	BasePromptElementProps,
} from '@vscode/prompt-tsx';

interface IMyPromptProps extends BasePromptElementProps {
	history: ChatContext['history'];
	userQuery: string;
}

export class MyPrompt extends PromptElement<IMyPromptProps> {
	render() {
		return (
			<>
				<UserMessage priority={100}>
					Here are your base instructions. They have the highest priority because you want to make
					sure they're always included!
				</UserMessage>
				{/* 历史中较旧的消息优先级最低，因为它们的相关性较低 */}
				<HistoryMessages history={this.props.history.slice(0, -2)} priority={0} />
				{/* 最近 2 条历史消息优先于下面的任何工作区上下文 */}
				<HistoryMessages history={this.props.history.slice(-2)} priority={80} />
				{/* 用户查询的优先级仅次于基本指令 */}
				<UserMessage priority={90}>{this.props.userQuery}</UserMessage>
				<UserMessage priority={70}>
					With a slightly lower priority, you can include some contextual data about the workspace
					or files here...
				</UserMessage>
			</>
		);
	}
}
```

现在，所有较旧的历史消息会在库尝试裁剪提示的其他元素之前被裁剪。

### 第 3 步：定义 History 组件

为了使使用更加方便，定义一个 `History` 组件来包装历史消息，并使用 `passPriority` 属性作为透传容器。使用 `passPriority` 后，其子元素在优先级排序时被视为包含元素的直接子元素。

```tsx
import { PromptElement, BasePromptElementProps } from '@vscode/prompt-tsx';

interface IHistoryProps extends BasePromptElementProps {
	history: ChatContext['history'];
	newer: number; // last 2 message priority values
	older: number; // previous message priority values
	passPriority: true; // require this prop be set!
}

export class History extends PromptElement<IHistoryProps> {
	render(): PromptPiece {
		return (
			<>
				<HistoryMessages history={this.props.history.slice(0, -2)} priority={this.props.older} />
				<HistoryMessages history={this.props.history.slice(-2)} priority={this.props.newer} />
			</>
		);
	}
}
```

现在，你可以使用和复用这个单独的元素来包含聊天历史：

```tsx
<History history={this.props.history} passPriority older={0} newer={80}/>
```

## 按需扩展文件内容

在此示例中，你希望在提示中包含用户当前正在查看的所有文件的内容。这些文件可能很大，以至于包含所有文件会导致其文本被裁剪！此示例展示了如何使用 `flexGrow` 属性来协作调整文件内容大小以适应 token 预算。

### 第 1 步：定义基本指令和用户查询

首先，定义一个包含基本指令的 `UserMessage` 组件。

```tsx
<UserMessage priority={100}>Here are your base instructions.</UserMessage>
```

然后使用 `UserMessage` 组件包含用户查询。此组件具有较高的优先级，以确保它紧跟在基本指令之后被包含。

```tsx
<UserMessage priority={90}>{this.props.userQuery}</UserMessage>
```

### 第 2 步：包含文件内容

现在你可以使用 `FileContext` 组件来包含文件内容。为其分配 [`flexGrow`](https://github.com/microsoft/vscode-prompt-tsx?tab=readme-ov-file#flex-behavior) 值 `1`，以确保它在基本指令、用户查询和历史之后渲染。

```tsx
<FileContext priority={70} flexGrow={1} files={this.props.files} />
```

设置了 `flexGrow` 值后，元素会在其 `PromptSizing` 对象中获得任何_未使用的_ token 预算，该对象会传递给其 `render()` 和 `prepare()` 调用。你可以在 [prompt-tsx 文档](https://github.com/microsoft/vscode-prompt-tsx?tab=readme-ov-file#flex-behavior)中了解更多关于 flex 元素行为的信息。

### 第 3 步：包含历史

接下来，使用你之前创建的 `History` 组件包含历史消息。这稍微复杂一些，因为你确实希望显示一些历史，但也希望文件内容占据提示的大部分空间。

因此，为 `History` 组件分配 `flexGrow` 值 `2`，以确保它在包括 `<FileContext />` 在内的所有其他元素之后渲染。但同时设置 `flexReserve` 值为 `"/5"`，为历史预留总预算的 1/5。

```tsx
<History
	history={this.props.history}
	passPriority
	older={0}
	newer={80}
	flexGrow={2}
	flexReserve="/5"
/>
```

### 第 4 步：组合提示的所有元素

现在，将所有元素组合到 `MyPrompt` 组件中。

```tsx
import {
	UserMessage,
	PromptElement,
	BasePromptElementProps,
} from '@vscode/prompt-tsx';
import { History } from './history';

interface IFilesToInclude {
	document: TextDocument;
	line: number;
}

interface IMyPromptProps extends BasePromptElementProps {
	history: ChatContext['history'];
	userQuery: string;
	files: IFilesToInclude[];
}

export class MyPrompt extends PromptElement<IMyPromptProps> {
	render() {
		return (
			<>
				<UserMessage priority={100}>Here are your base instructions.</UserMessage>
				<History
					history={this.props.history}
					passPriority
					older={0}
					newer={80}
					flexGrow={2}
					flexReserve="/5"
				/>
				<UserMessage priority={90}>{this.props.userQuery}</UserMessage>
				<FileContext priority={70} flexGrow={1} files={this.props.files} />
			</>
		);
	}
}
```

### 第 5 步：定义 FileContext 组件

最后，定义一个 `FileContext` 组件来包含用户当前正在查看的文件内容。因为你使用了 `flexGrow`，你可以实现逻辑，利用 `PromptSizing` 中的信息获取每个文件"有趣"行周围尽可能多的行。

为简洁起见，`getExpandedFiles` 的实现逻辑已省略。你可以在 [prompt-tsx 仓库](https://github.com/microsoft/vscode-prompt-tsx/blob/5501d54a5b9a7608582e8419cd968a82ca317cc9/examples/file-contents.tsx#L103)中查看。

```tsx
import { PromptElement, BasePromptElementProps, PromptSizing, PromptPiece } from '@vscode/prompt-tsx';

class FileContext extends PromptElement<{ files: IFilesToInclude[] } & BasePromptElementProps> {
	async render(_state: void, sizing: PromptSizing): Promise<PromptPiece> {
		const files = await this.getExpandedFiles(sizing);
		return <>{files.map(f => f.toString())}</>;
	}

	private async getExpandedFiles(sizing: PromptSizing) {
		// 实现细节在此概述。
		// 完整实现请参阅仓库。
	}
}
```

## 总结

在这些示例中，你创建了一个 `MyPrompt` 组件，包含基本指令、用户查询、历史消息和文件内容，并为其设置了不同的优先级。你使用了 `flexGrow` 来协作调整文件内容大小以适应 token 预算。

通过遵循此模式，你可以确保提示中最重要的部分始终被包含，而较不重要的部分会根据需要裁剪以适应模型的上下文窗口。有关 `getExpandedFiles` 方法和 `FileContextTracker` 类的完整实现细节，请参阅 [prompt-tsx 仓库](https://github.com/microsoft/vscode-prompt-tsx/tree/main/examples)。
