---
title: 工作区信任扩展指南
description: 更新 Visual Studio Code 扩展以支持工作区信任的指南
---

# 工作区信任扩展指南

## 什么是工作区信任？

[工作区信任](/docs/editor/workspace-trust)是一项由安全性驱动的功能，旨在应对用户在 VS Code 中打开工作区时可能发生的意外代码执行风险。例如，考虑一个语言扩展，为了提供功能，可能会执行当前加载工作区中的代码。在此场景下，用户应信任工作区的内容不是恶意的。工作区信任将此决定集中在 VS Code 中，并支持[受限模式](/docs/editor/workspace-trust#_restricted-mode)来防止自动代码执行，这样扩展作者就不必自行处理此基础设施。VS Code 提供静态声明和 API 支持来帮助扩展快速适配，无需在各扩展中重复代码。

## 适配

### 静态声明

在扩展的 `package.json` 中，VS Code 支持以下新的 `capabilities` 属性 `untrustedWorkspaces`：

```typescript
capabilities:
  untrustedWorkspaces:
    { supported: true } |
    { supported: false, description: string } |
    { supported: 'limited', description: string, restrictedConfigurations?: string[] }
```

对于 `supported` 属性，接受以下值：

* `true` - 扩展在受限模式下完全受支持，因为它不需要工作区信任来执行任何功能。它将像以前一样被启用。
* `false` - 扩展在受限模式下不受支持，因为没有工作区信任它无法运行。它将保持禁用状态，直到被授予工作区信任。
* `'limited'` - 扩展的部分功能在受限模式下受支持。受信任约束的功能应在授予工作区信任之前被禁用。扩展可以使用 VS Code API 来隐藏或禁用这些功能。工作区设置可以通过 `restrictedConfigurations` 属性自动受信任约束。

对于 `description` 属性，必须提供为什么需要信任的描述，以帮助用户了解哪些功能将被禁用，或者他们在授予或拒绝工作区信任之前应审查什么。如果 `supported` 设为 `true`，则忽略此属性。

`description` 属性的值应添加到 `package.nls.json` 中，然后在 `package.json` 文件中引用，以支持本地化。

`restrictedConfigurations` 属性接受一组配置设置 ID 的数组。对于列出的设置，扩展在不受信任工作区的受限模式下将不会获得工作区定义的值。

## 如何支持受限模式？

为了帮助扩展作者理解工作区信任的范围以及受限模式下哪些类型的功能是安全的，以下是需要考虑的问题列表。

### 我的扩展有主入口点吗？

如果扩展没有 `main` 入口点（例如主题和语言语法），则扩展不需要工作区信任。扩展作者不需要为这类扩展做任何操作，它们将继续正常运行，不受工作区是否受信任的影响。

### 我的扩展是否依赖打开的工作区中的文件来提供功能？

这可能包括可以由工作区设置的设置，或工作区中的实际代码。如果扩展从不使用工作区的任何内容，它可能不需要信任。否则，请查看其他问题。

### 我的扩展是否将工作区的任何内容视为代码？

最常见的例子是使用项目的工作区依赖项，例如存储在本地工作区中的 Node.js 模块。恶意工作区可能会签入被篡改版本的模块。因此，这对用户和扩展都是安全风险。此外，扩展可能依赖 JavaScript 或其他配置文件来控制扩展或其他模块的行为。还有很多其他例子，例如执行打开的代码文件来确定其输出以进行错误报告。

### 我的扩展是否使用可在工作区中定义的、决定代码执行的设置？

你的扩展可能使用设置值作为扩展执行的 CLI 的标志。如果这些设置被恶意工作区覆盖，它们可能被用作攻击你的扩展的向量。另一方面，如果设置值仅用于检测某些条件，则可能不是安全风险，不需要工作区信任。例如，扩展可能检查首选 Shell 设置的值是 `bash` 还是 `pwsh` 来决定显示什么文档。下面的[配置（设置）](#configurations-settings)部分提供了有关设置的指导，帮助你找到扩展的最佳配置。

这不是可能需要工作区信任的详尽案例列表。随着我们审查更多扩展，我们将更新此列表。请在考虑工作区信任时，使用此列表来思考你的扩展可能存在的类似行为。

### 如果我不修改扩展会怎样？

如上所述，不在 `package.json` 中做任何贡献的扩展将被视为不支持工作区信任。当工作区处于受限模式时，它将被禁用，用户将收到一些扩展因工作区信任而无法工作的通知。此措施是对用户最注重安全的方式。尽管这是默认行为，但设置适当的值表明作为扩展作者，你已经努力保护用户和你的扩展免受恶意工作区内容的影响，这是一种最佳实践。

## 工作区信任 API

如上所述，使用 API 的第一步是在 `package.json` 中添加静态声明。最简单的适配方法是为 `supported` 属性使用 `false` 值。再次说明，即使你什么都不做，这也是默认行为，但这向用户发出了你已经做出审慎选择的良好信号。在这种情况下，你的扩展不需要做任何其他事情。在信任被授予之前它不会被激活，然后你的扩展将知道它是在用户同意的情况下执行的。但是，如果你的扩展仅部分功能需要信任，这可能不是最佳选择。

对于希望根据工作区信任来控制其功能的扩展，应为 `supported` 属性使用 `'limited'` 值，VS Code 提供以下 API：

```typescript
export namespace workspace {
  /**
    * When true, the user has explicitly trusted the contents of the workspace.
    */
  export const isTrusted: boolean;

  /**
    * Event that fires when the current workspace has been trusted.
    */
  export const onDidGrantWorkspaceTrust: Event<void>;
}
```

使用 `isTrusted` 属性来确定当前工作区是否受信任，使用 `onDidGrantWorkspaceTrust` 事件来监听工作区何时被授予信任。你可以使用此 API 来阻止特定的代码路径，并在工作区被信任后执行任何必要的注册。

VS Code 还暴露了一个上下文键 `isWorkspaceTrusted`，用于 `when` 子句中，如下所述。

## 贡献点

### 命令、视图或其他 UI

当用户尚未信任工作区时，他们将在受限模式下操作，功能仅限于浏览代码。你在受限模式下禁用的任何功能都应向用户隐藏。这可以通过 [when 子句上下文](/vscode/extension/references/when-clause-contexts)和上下文键 `isWorkspaceTrusted` 来实现。即使命令未在 UI 中呈现，仍然可以被调用，因此你应在扩展代码中基于上述 API 阻止执行或不注册命令。

### 配置（设置）

首先，你应该审查你的设置，确定它们是否需要考虑信任。如上所述，工作区可能为你的扩展使用的设置定义一个值，该值对你来说可能是恶意的。如果你识别出易受攻击的设置，应为 `supported` 属性使用 `'limited'`，并在 `restrictedConfigurations` 数组中列出设置 ID。

当你将设置 ID 添加到 `restrictedConfigurations` 数组时，VS Code 在受限模式下将仅返回该设置的用户定义值。你的扩展随后不需要做任何额外的代码更改来处理该设置。当信任被授予时，除了工作区信任事件外，还将触发配置更改事件。

### 调试扩展

VS Code 将阻止在受限模式下进行调试。因此，调试扩展通常不需要要求信任，应为 `supported` 属性选择 `true`。但是，如果你的扩展提供了不属于内置调试流程的额外功能、命令或设置，则应使用 `'limited'` 并遵循上述指导。

### 任务提供程序

与调试类似，VS Code 阻止在受限模式下运行任务。如果你的扩展提供了不属于内置任务流程的额外功能、命令或设置，则应使用 `'limited'` 并遵循上述指导。否则，你可以指定 `supported: true`。

## 测试工作区信任

有关启用和配置工作区信任的详细信息，请参阅[工作区信任用户指南](/docs/editor/workspace-trust)。
