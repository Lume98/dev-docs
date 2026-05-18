---
title: 自定义编辑器 API
description: 使用自定义编辑器 API 在 Visual Studio Code 中创建可自定义的编辑器。
---

# 自定义编辑器 API

自定义编辑器允许扩展创建完全可自定义的读写编辑器，用于替代 VS Code 针对特定资源类型的标准文本编辑器。它们有着广泛的应用场景，例如：

- 直接在 VS Code 中预览资源，如着色器或 3D 模型。
- 为 Markdown 或 XAML 等语言创建所见即所得的编辑器。
- 为 CSV、JSON 或 XML 等数据文件提供替代的可视化渲染。
- 为二进制或文本文件构建完全可自定义的编辑体验。

本文档概述了自定义编辑器 API 以及实现自定义编辑器的基础知识。我们将了解两种类型的自定义编辑器及其差异，以及哪种类型适合你的使用场景。然后，对于每种自定义编辑器类型，我们将介绍构建一个行为良好的自定义编辑器的基础知识。

虽然自定义编辑器是一个强大的新扩展点，但实现一个基本的自定义编辑器其实并不困难！不过，如果你正在开发你的第一个 VS Code 扩展，你可能需要考虑先熟悉 VS Code API 的基础知识，然后再深入自定义编辑器。自定义编辑器建立在许多 VS Code 概念之上——例如 [webview](/vscode/extension/extension-guides/webview) 和文本文档——所以如果你同时学习所有这些新概念，可能会感到有些不知所措。

但如果你已经准备好了，并且正在构思你将要构建的各种酷炫自定义编辑器，那就让我们开始吧！请务必下载[自定义编辑器扩展示例][sample]，以便你可以跟随文档操作，了解自定义编辑器 API 是如何组合在一起的。

## 链接

- [自定义编辑器示例][sample]

### VS Code API 用法

- [`window.registerCustomEditorProvider`](/vscode/extension/references/vscode-api#window.registerCustomEditorProvider)
- [`CustomTextEditorProvider`](/vscode/extension/references/vscode-api#CustomTextEditorProvider)

## 自定义编辑器 API 基础

自定义编辑器是针对特定资源替代 VS Code 标准文本编辑器显示的替代视图。自定义编辑器由两部分组成：用户交互的视图，以及扩展用于与底层资源交互的文档模型。

自定义编辑器的视图部分使用 [webview](/vscode/extension/extension-guides/webview) 实现。这使你可以使用标准的 HTML、CSS 和 JavaScript 构建自定义编辑器的用户界面。Webview 无法直接访问 VS Code API，但它们可以通过来回传递消息与扩展通信。请查看我们的 [webview 文档](/vscode/extension/extension-guides/webview)，了解更多关于 webview 的信息和最佳实践。

自定义编辑器的另一部分是文档模型。此模型是你的扩展理解其所操作资源（文件）的方式。`CustomTextEditorProvider` 使用 VS Code 的标准 [TextDocument](/vscode/extension/references/vscode-api#TextDocument) 作为其文档模型，对文件的所有更改都使用 VS Code 的标准文本编辑 API 表达。而 `CustomReadonlyEditorProvider` 和 `CustomEditorProvider` 则允许你提供自己的文档模型，使它们可用于非文本文件格式。

自定义编辑器对每个资源有一个文档模型，但可能有多个编辑器实例（视图）。例如，假设你打开一个使用 `CustomTextEditorProvider` 的文件，然后运行 **View: Split editor** 命令。在这种情况下，仍然只有一个 `TextDocument`，因为工作区中仍然只有一份资源副本，但该资源现在有两个 webview。

### `CustomEditor` 与 `CustomTextEditor`

自定义编辑器分为两类：自定义文本编辑器和自定义编辑器。它们之间的主要区别在于如何定义其文档模型。

`CustomTextEditorProvider` 使用 VS Code 的标准 [`TextDocument`](https://code.visualstudio.com/api/references/vscode-api#TextDocument) 作为其数据模型。你可以将 `CustomTextEditor` 用于任何基于文本的文件类型。`CustomTextEditor` 实现起来要简单得多，因为 VS Code 已经知道如何处理文本文件，因此可以实现保存和为热退出备份文件等操作。

而 `CustomEditorProvider` 则由你的扩展自带文档模型。这意味着你可以将 `CustomEditor` 用于二进制格式（如图像），但也意味着你的扩展需要负责更多工作，包括实现保存和备份。如果你的自定义编辑器是只读的（例如用于预览的自定义编辑器），则可以跳过大部分复杂性。

在决定使用哪种类型的自定义编辑器时，决策通常很简单：如果你处理的是基于文本的文件格式，使用 `CustomTextEditorProvider`；对于二进制文件格式，使用 `CustomEditorProvider`。

### 贡献点

`customEditors` [贡献点](/vscode/extension/references/contribution-points)是你的扩展向 VS Code 告知其提供的自定义编辑器的方式。例如，VS Code 需要知道你的自定义编辑器适用于哪些类型的文件，以及如何在任何 UI 中标识你的自定义编辑器。

以下是[自定义编辑器扩展示例][sample]的一个基本 `customEditor` 贡献：

```json
"contributes": {
  "customEditors": [
    {
      "viewType": "catEdit.catScratch",
      "displayName": "Cat Scratch",
      "selector": [
        {
          "filenamePattern": "*.cscratch"
        }
      ],
      "priority": "default"
    }
  ]
}
```

`customEditors` 是一个数组，因此你的扩展可以贡献多个自定义编辑器。让我们分解一下自定义编辑器条目的各个部分：

- `viewType` - 自定义编辑器的唯一标识符。

    这是 VS Code 将 `package.json` 中的自定义编辑器贡献与代码中的自定义编辑器实现关联起来的方式。此标识符在所有扩展中必须唯一，因此不要使用诸如 `"preview"` 之类的通用 `viewType`，确保使用对你的扩展唯一的名称，例如 `"viewType": "myAmazingExtension.svgPreview"`

- `displayName` - 在 VS Code UI 中标识自定义编辑器的名称。

    显示名称会在 VS Code UI 中展示给用户，例如在 **View: Reopen with** 下拉菜单中。

- `selector` - 指定自定义编辑器对哪些文件生效。

    `selector` 是一个或多个 [glob 模式](/docs/editor/glob-patterns)的数组。这些 glob 模式与文件名匹配，以确定自定义编辑器是否可用于它们。像 `*.png` 这样的 `filenamePattern` 将为所有 PNG 文件启用自定义编辑器。

    你还可以创建更具体的模式来匹配文件或目录名称，例如 `**/translations/*.json`。

- `priority` - （可选）指定何时使用自定义编辑器。

    `priority` 控制打开资源时何时使用自定义编辑器。可能的值为：

    - `"default"` - 尝试对匹配自定义编辑器 `selector` 的每个文件使用自定义编辑器。如果给定文件有多个自定义编辑器，用户将需要选择要使用哪一个。
    - `"option"` - 默认不使用自定义编辑器，但允许用户切换到它或将其配置为默认值。

### 自定义编辑器激活

当用户打开你的某个自定义编辑器时，VS Code 会触发 `onCustomEditor:VIEW_TYPE` 激活事件。在激活期间，你的扩展必须调用 `registerCustomEditorProvider` 来注册具有预期 `viewType` 的自定义编辑器。

需要注意的是，`onCustomEditor` 仅在 VS Code 需要创建自定义编辑器实例时才会被调用。如果 VS Code 只是向用户显示关于可用自定义编辑器的一些信息——例如通过 **View: Reopen with** 命令——你的扩展不会被激活。

## 自定义文本编辑器

自定义文本编辑器允许你为文本文件创建自定义编辑器。这可以是从纯非结构化文本到 [CSV](https://en.wikipedia.org/wiki/Comma-separated_values)、JSON 或 XML 的任何内容。自定义文本编辑器使用 VS Code 的标准 [TextDocument](/vscode/extension/references/vscode-api#TextDocument) 作为其文档模型。

[自定义编辑器扩展示例][sample]包含一个用于 cat scratch 文件的简单自定义文本编辑器示例（这些文件只是以 `.cscratch` 文件扩展名结尾的 JSON 文件）。让我们来看看实现自定义文本编辑器的一些重要部分。

### 自定义文本编辑器生命周期

VS Code 管理自定义文本编辑器的视图组件（webview）和模型组件（`TextDocument`）的生命周期。VS Code 在需要创建新的自定义编辑器实例时调用你的扩展，并在用户关闭标签页时清理编辑器实例和文档模型。

要了解这一切在实践中是如何运作的，让我们从扩展的角度来看用户打开自定义文本编辑器以及关闭自定义文本编辑器时发生了什么。

**打开自定义文本编辑器**

使用[自定义编辑器扩展示例][sample]，当用户首次打开一个 `.cscratch` 文件时，会发生以下情况：

1. VS Code 触发 `onCustomEditor:catCustoms.catScratch` 激活事件。

    这会激活我们的扩展（如果尚未激活）。在激活期间，我们的扩展必须确保通过调用 `registerCustomEditorProvider` 为 `catCustoms.catScratch` 注册一个 `CustomTextEditorProvider`。

1. VS Code 然后对注册的 `catCustoms.catScratch` 的 `CustomTextEditorProvider` 调用 `resolveCustomTextEditor`。

    此方法接收正在打开的资源的 `TextDocument` 和一个 `WebviewPanel`。扩展必须填充此 webview 面板的初始 HTML 内容。

一旦 `resolveCustomTextEditor` 返回，我们的自定义编辑器就会显示给用户。webview 内绘制的内容完全由我们的扩展决定。

每次打开自定义编辑器时都会发生相同的流程，即使你拆分自定义编辑器也是如此。自定义编辑器的每个实例都有自己的 `WebviewPanel`，但如果多个自定义文本编辑器对应同一资源，它们将共享同一个 `TextDocument`。请记住：将 `TextDocument` 视为资源的模型，而 webview 面板是该模型的视图。

**关闭自定义文本编辑器**

当用户关闭自定义文本编辑器时，VS Code 在 `WebviewPanel` 上触发 `WebviewPanel.onDidDispose` 事件。此时，你的扩展应清理与该编辑器关联的所有资源（事件订阅、文件监视器等）。

当某个资源的最后一个自定义编辑器被关闭时，该资源的 `TextDocument` 也将被释放，前提是没有其他编辑器在使用它且没有其他扩展持有它。你可以检查 `TextDocument.isClosed` 属性来查看 `TextDocument` 是否已关闭。一旦 `TextDocument` 关闭，使用自定义编辑器再次打开同一资源将导致打开一个新的 `TextDocument`。

### 将更改与 TextDocument 同步

由于自定义文本编辑器使用 `TextDocument` 作为其文档模型，它们负责在自定义编辑器中发生编辑时更新 `TextDocument`，以及在 `TextDocument` 更改时更新自身。

**从 webview 到 `TextDocument`**

自定义文本编辑器中的编辑可以采取多种形式——点击按钮、更改文本、拖动项目等。每当用户在自定义文本编辑器内编辑文件本身时，扩展必须更新 `TextDocument`。以下是 cat scratch 扩展的实现方式：

1. 用户点击 webview 中的 **Add scratch** 按钮。这会从 webview 向扩展[发送一条消息](/vscode/extension/extension-guides/webview#scripts-and-message-passing)。

1. 扩展接收该消息。然后更新其内部文档模型（在 cat scratch 示例中，只需向 JSON 添加一个新条目）。

1. 扩展创建一个 `WorkspaceEdit`，将更新后的 JSON 写入文档。此编辑通过 `vscode.workspace.applyEdit` 应用。

尽量将工作区编辑保持在更新文档所需的最小更改范围内。还要注意，如果你使用的是 JSON 等语言，你的扩展应尽量遵循用户现有的格式约定（空格与制表符、缩进大小等）。

**从 `TextDocument` 到 webview**

当 `TextDocument` 更改时，你的扩展还需要确保其 webview 反映文档的新状态。TextDocument 可以通过用户操作（如撤销、重做或还原文件）、其他扩展使用 `WorkspaceEdit` 或用户在 VS Code 默认文本编辑器中打开文件来更改。以下是 cat scratch 扩展的实现方式：

1. 在扩展中，我们订阅 `vscode.workspace.onDidChangeTextDocument` 事件。此事件在 `TextDocument` 的每次更改时触发（包括我们自定义编辑器所做的更改！）

1. 当我们收到有编辑器的文档的更改时，我们向 webview 发送一条包含其新文档状态的消息。然后 webview 更新自身以渲染更新后的文档。

请务必记住，自定义编辑器触发的任何文件编辑都会导致 `onDidChangeTextDocument` 触发。确保你的扩展不会陷入更新循环：用户在 webview 中进行编辑，触发 `onDidChangeTextDocument`，导致 webview 更新，又导致 webview 触发对扩展的另一次更新，再次触发 `onDidChangeTextDocument`，如此循环。

还要记住，如果你使用 JSON 或 XML 等结构化语言，文档可能不总是处于有效状态。你的扩展必须能够优雅地处理错误，或向用户显示错误消息，让他们了解问题所在以及如何修复。

最后，如果更新 webview 的开销较大，可以考虑对 webview 的更新进行[防抖处理](https://davidwalsh.name/javascript-debounce-function)。

## 自定义编辑器

`CustomEditorProvider` 和 `CustomReadonlyEditorProvider` 允许你为二进制文件格式创建自定义编辑器。此 API 使你可以完全控制文件向用户的显示方式、编辑方式，并允许你的扩展接入 `save` 和其他文件操作。同样，如果你正在为基于文本的文件格式构建编辑器，强烈建议考虑使用 [`CustomTextEditor`](#custom-text-editor)，因为它的实现要简单得多。

[自定义编辑器扩展示例][sample]包含一个简单的 paw draw 文件自定义二进制编辑器示例（这些文件只是以 `.pawdraw` 文件扩展名结尾的 JPEG 文件）。让我们来看看构建二进制文件的自定义编辑器涉及哪些内容。

### CustomDocument

使用自定义编辑器，你的扩展负责通过 `CustomDocument` 接口实现自己的文档模型。这使得你的扩展可以自由地在 `CustomDocument` 上存储与自定义编辑器交互所需的任何数据，但也意味着你的扩展必须实现基本的文档操作，如保存和为热退出备份文件数据。

每个打开的文件对应一个 `CustomDocument`。用户可以为单个资源打开多个编辑器——例如通过拆分当前的自定义编辑器——但所有这些编辑器都由同一个 `CustomDocument` 支持。

### 自定义编辑器生命周期

**supportsMultipleEditorsPerDocument**

默认情况下，VS Code 只允许每个自定义文档有一个编辑器。此限制使得正确实现自定义编辑器变得更容易，因为你不必担心多个自定义编辑器实例之间的同步。

但如果你的扩展能够支持，我们建议在注册自定义编辑器时设置 `supportsMultipleEditorsPerDocument: true`，以便可以为同一文档打开多个编辑器实例。这将使你的自定义编辑器的行为更像 VS Code 的普通文本编辑器。

**打开自定义编辑器**
当用户打开匹配 `customEditor` 贡献点的文件时，VS Code 触发一个 `onCustomEditor` [激活事件](/vscode/extension/references/activation-events)，然后调用为提供的视图类型注册的提供程序。`CustomEditorProvider` 有两个角色：为自定义编辑器提供文档，然后提供编辑器本身。以下是[自定义编辑器扩展示例][sample]中 `catCustoms.pawDraw` 编辑器发生的步骤列表：

1. VS Code 触发 `onCustomEditor:catCustoms.pawDraw` 激活事件。

    这会激活我们的扩展（如果尚未激活）。我们还必须确保在激活期间为 `catCustoms.pawDraw` 注册一个 `CustomReadonlyEditorProvider` 或 `CustomEditorProvider`。

1. VS Code 对我们为 `catCustoms.pawDraw` 编辑器注册的 `CustomReadonlyEditorProvider` 或 `CustomEditorProvider` 调用 `openCustomDocument`。

    在这里，我们的扩展获得一个资源 URI，并且必须为该资源返回一个新的 `CustomDocument`。这是我们的扩展为该资源创建其文档内部模型的时刻。这可能涉及从磁盘读取和解析初始资源状态，或初始化我们新的 `CustomDocument`。

    我们的扩展可以通过创建一个实现 `CustomDocument` 的新类来定义此模型。请记住，此初始化阶段完全由扩展决定；VS Code 不关心扩展在 `CustomDocument` 上存储的任何额外信息。

1. VS Code 使用步骤 2 中的 `CustomDocument` 和一个新的 `WebviewPanel` 调用 `resolveCustomEditor`。

    在这里，我们的扩展必须填充自定义编辑器的初始 HTML。如果需要，我们还可以持有对 `WebviewPanel` 的引用，以便稍后（例如在命令中）使用它。

一旦 `resolveCustomEditor` 返回，我们的自定义编辑器就会显示给用户。

如果用户使用我们的自定义编辑器在另一个编辑器组中打开同一资源——例如通过拆分第一个编辑器——扩展的工作就简化了。在这种情况下，VS Code 只需使用打开第一个编辑器时创建的同一个 `CustomDocument` 调用 `resolveCustomEditor`。

**关闭自定义编辑器**

假设我们对同一资源打开了两个自定义编辑器实例。当用户关闭这些编辑器时，VS Code 会通知我们的扩展，以便它可以清理与编辑器关联的所有资源。

当第一个编辑器实例关闭时，VS Code 在已关闭编辑器的 `WebviewPanel` 上触发 `WebviewPanel.onDidDispose` 事件。此时，我们的扩展必须清理与该特定编辑器实例关联的所有资源。

当第二个编辑器关闭时，VS Code 再次触发 `WebviewPanel.onDidDispose`。但现在我们也已关闭了与 `CustomDocument` 关联的所有编辑器。当 `CustomDocument` 没有更多编辑器时，VS Code 调用其 `CustomDocument.dispose`。我们的扩展的 `dispose` 实现必须清理与文档关联的所有资源。

如果用户随后使用我们的自定义编辑器重新打开同一资源，我们将通过完整的 `openCustomDocument`、`resolveCustomEditor` 流程，使用一个新的 `CustomDocument` 重新开始。

### 只读自定义编辑器

以下许多章节仅适用于支持编辑的自定义编辑器。虽然听起来有些矛盾，但许多自定义编辑器根本不需要编辑功能。以图片预览为例，或者内存转储的可视化渲染。两者都可以使用自定义编辑器实现，但都不需要可编辑。这就是 `CustomReadonlyEditorProvider` 的用武之地。

`CustomReadonlyEditorProvider` 允许你创建不支持编辑的自定义编辑器。它们仍然可以是交互式的，但不支持撤销和保存等操作。与完全可编辑的自定义编辑器相比，实现只读自定义编辑器要简单得多。

### 可编辑自定义编辑器基础

可编辑自定义编辑器允许你接入标准的 VS Code 操作，如撤销和重做、保存以及热退出。这使得可编辑自定义编辑器非常强大，但也意味着正确实现它比实现可编辑的自定义文本编辑器或只读自定义编辑器要复杂得多。

可编辑自定义编辑器由 `CustomEditorProvider` 实现。此接口扩展了 `CustomReadonlyEditorProvider`，因此你需要实现基本操作（如 `openCustomDocument` 和 `resolveCustomEditor`），以及一组编辑特定的操作。让我们来看看 `CustomEditorProvider` 中编辑特定的部分。

**编辑**

对可编辑自定义文档的更改通过编辑来表达。编辑可以是文本更改、图像旋转、列表重排等任何操作。VS Code 将编辑的具体含义完全留给你的扩展，但 VS Code 确实需要知道何时发生了编辑。编辑是 VS Code 将文档标记为已修改的方式，这反过来启用了自动保存和备份。

每当用户在你的自定义编辑器的任何 webview 中进行编辑时，你的扩展必须从其 `CustomEditorProvider` 触发 `onDidChangeCustomDocument` 事件。根据你的自定义编辑器实现，`onDidChangeCustomDocument` 事件可以触发两种事件类型：`CustomDocumentContentChangeEvent` 和 `CustomDocumentEditEvent`。

**CustomDocumentContentChangeEvent**

`CustomDocumentContentChangeEvent` 是最基本的编辑。它唯一的 function 是告诉 VS Code 文档已被编辑。

当扩展从 `onDidChangeCustomDocument` 触发 `CustomDocumentContentChangeEvent` 时，VS Code 会将关联的文档标记为已修改。此时，文档变为未修改状态的唯一方法是用户保存或还原它。使用 `CustomDocumentContentChangeEvent` 的自定义编辑器不支持撤销/重做。

**CustomDocumentEditEvent**

`CustomDocumentEditEvent` 是一种更复杂的编辑，允许撤销/重做。你应该始终尝试使用 `CustomDocumentEditEvent` 来实现自定义编辑器，只有在无法实现撤销/重做时才回退到 `CustomDocumentContentChangeEvent`。

`CustomDocumentEditEvent` 具有以下字段：

- `document` — 编辑所针对的 `CustomDocument`。
- `label` — 描述所做编辑类型的可选文本（例如："Crop"、"Insert"、...）
- `undo` — 当需要撤销编辑时由 VS Code 调用的函数。
- `redo` — 当需要重做编辑时由 VS Code 调用的函数。

当扩展从 `onDidChangeCustomDocument` 触发 `CustomDocumentEditEvent` 时，VS Code 将关联的文档标记为已修改。要使文档不再处于已修改状态，用户可以保存或还原文档，或者通过撤销/重做回到文档上次保存的状态。

编辑器上的 `undo` 和 `redo` 方法在需要撤销或重新应用特定编辑时由 VS Code 调用。VS Code 维护一个内部编辑栈，因此如果你的扩展通过 `onDidChangeCustomDocument` 触发了三个编辑，假设分别称为 `a`、`b`、`c`：

```ts
onDidChangeCustomDocument(a);
onDidChangeCustomDocument(b);
onDidChangeCustomDocument(c);
```

以下用户操作序列会导致这些调用：

```
undo — c.undo()
undo — b.undo()
redo — b.redo()
redo — c.redo()
redo — no op, no more edits
```

要实现撤销/重做，你的扩展必须更新其关联自定义文档的内部状态，并更新文档的所有关联 webview 以反映文档的新状态。请记住，单个资源可能有多个 webview。它们必须始终显示相同的文档数据。例如，图像编辑器的多个实例必须始终显示相同的像素数据，但可以允许每个编辑器实例有自己的缩放级别和 UI 状态。

### 保存

当用户保存自定义编辑器时，你的扩展负责将资源的当前状态写入磁盘。你的自定义编辑器如何执行此操作很大程度上取决于扩展的 `CustomDocument` 类型以及扩展在内部如何跟踪编辑。

保存的第一步是获取要写入磁盘的数据流。常见的方法包括：

- 跟踪资源的状态，以便可以快速序列化。

    例如，一个基本的图像编辑器可能维护一个像素数据缓冲区。

- 从上次保存后重放编辑以生成新文件。

    例如，一个更高效的图像编辑器可能跟踪自上次保存以来的编辑，如 `crop`、`rotate`、`scale`。在保存时，它会将这些编辑应用于文件上次保存的状态以生成新文件。

- 向自定义编辑器的 `WebviewPanel` 请求要保存的文件数据。

    但请注意，自定义编辑器即使不可见时也可以被保存。因此，建议你的扩展的 `save` 实现不依赖于 `WebviewPanel`。如果无法做到这一点，你可以使用 `WebviewPanelOptions.retainContextWhenHidden` 设置，使 webview 即使在隐藏时也保持存活。`retainContextWhenHidden` 确实有显著的内存开销，因此请谨慎使用。

获取资源数据后，通常应使用 [workspace FS API](https://code.visualstudio.com/api/references/vscode-api#FileSystem) 将其写入磁盘。FS API 接受一个 `UInt8Array` 数据，可以写入二进制和基于文本的文件。对于二进制文件数据，只需将二进制数据放入 `UInt8Array`。对于文本文件数据，使用 `Buffer` 将字符串转换为 `UInt8Array`：

```ts
const writeData = Buffer.from("my text data", 'utf8');
vscode.workspace.fs.writeFile(fileUri, writeData);
```

## 后续步骤

如果你想了解更多关于 VS Code 可扩展性的内容，请尝试以下主题：

- [Extension API](/vscode/extension/) - 了解完整的 VS Code Extension API。
- [Extension Capabilities](/vscode/extension/extension-capabilities/overview) - 了解扩展 VS Code 的其他方式。

[sample]: https://github.com/microsoft/vscode-extension-samples/tree/main/custom-editor-sample
