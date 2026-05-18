---
title: 任务提供程序
description: 了解如何通过扩展（插件）向 Visual Studio Code 贡献任务。
---

# 任务提供程序

用户通常在 Visual Studio Code 中通过 `tasks.json` 文件定义[任务](/docs/debugtest/tasks)。然而，在软件开发过程中，有些任务可以被带有任务提供程序的 VS Code 扩展自动检测到。当从 VS Code 运行 **Tasks: Run Task** 命令时，所有活动的任务提供程序都会贡献用户可以运行的任务。虽然 `tasks.json` 文件让用户可以为特定文件夹或工作区手动定义任务，但任务提供程序可以检测工作区的详细信息，然后自动创建相应的 VS Code 任务。例如，任务提供程序可以检查是否存在特定的构建文件（如 `make` 或 `Rakefile`），并创建一个构建任务。本主题介绍扩展如何自动检测并向最终用户提供任务。

本指南教你如何构建一个自动检测 [Rakefiles](https://ruby.github.io/rake/) 中定义的任务的任务提供程序。完整的源代码位于：[https://github.com/microsoft/vscode-extension-samples/tree/main/task-provider-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/task-provider-sample)。

## 任务定义

为了在系统中唯一标识任务，贡献任务的扩展需要定义标识任务的属性。在 Rake 示例中，任务定义如下：

```json
"taskDefinitions": [
    {
        "type": "rake",
        "required": [
            "task"
        ],
        "properties": {
            "task": {
                "type": "string",
                "description": "The Rake task to customize"
            },
            "file": {
                "type": "string",
                "description": "The Rake file that provides the task. Can be omitted."
            }
        }
    }
]
```

这为 `rake` 任务贡献了一个任务定义。任务定义有两个属性：`task` 和 `file`。`task` 是 Rake 任务的名称，`file` 指向包含该任务的 `Rakefile`。`task` 属性是必需的，`file` 属性是可选的。如果省略 `file` 属性，则使用工作区文件夹根目录中的 `Rakefile`。

### When 子句

任务定义可以可选地具有一个 `when` 属性。`when` 属性指定了此类型任务可用的条件。`when` 属性的工作方式与 [VS Code 中其他具有 `when` 属性的地方](/vscode/extension/references/when-clause-contexts)相同。创建任务定义时应始终考虑以下上下文：

- `shellExecutionSupported`：当 VS Code 可以运行 `ShellExecution` 任务时为 True，例如 VS Code 作为桌面应用运行或使用远程扩展（如 Dev Containers）时。
- `processExecutionSupported`：当 VS Code 可以运行 `ProcessExecution` 任务时为 True，例如 VS Code 作为桌面应用运行或使用远程扩展（如 Dev Containers）时。目前，它始终与 `shellExecutionSupported` 具有相同的值。
- `customExecutionSupported`：当 VS Code 可以运行 `CustomExecution` 时为 True。此值始终为 True。

## 任务提供程序

类似于让扩展支持代码补全的语言提供程序，扩展可以注册一个任务提供程序来计算所有可用的任务。这通过 `vscode.tasks` 命名空间完成，如下面的代码片段所示：

```ts
import * as vscode from 'vscode';

let rakePromise: Thenable<vscode.Task[]> | undefined = undefined;
const taskProvider = vscode.tasks.registerTaskProvider('rake', {
  provideTasks: () => {
    if (!rakePromise) {
      rakePromise = getRakeTasks();
    }
    return rakePromise;
  },
  resolveTask(_task: vscode.Task): vscode.Task | undefined {
		const task = _task.definition.task;
		// A Rake task consists of a task and an optional file as specified in RakeTaskDefinition
		// Make sure that this looks like a Rake task by checking that there is a task.
		if (task) {
			// resolveTask requires that the same definition object be used.
			const definition: RakeTaskDefinition = <any>_task.definition;
			return new vscode.Task(definition, _task.scope ?? vscode.TaskScope.Workspace, definition.task, 'rake', new vscode.ShellExecution(`rake ${definition.task}`));
		}
		return undefined;  }
});
```

与 `provideTasks` 一样，`resolveTask` 方法由 VS Code 调用来从扩展获取任务。可以调用 `resolveTask` 代替 `provideTasks`，旨在为实现了它的提供程序提供可选的性能提升。例如，如果用户有一个运行扩展提供任务的快捷键绑定，VS Code 调用该任务提供程序的 `resolveTask` 并快速获取那一个任务，会比调用 `provideTasks` 并等待扩展提供其所有任务更好。设置一个允许用户关闭各个任务提供程序的选项是一种良好的实践，因此这很常见。用户可能会注意到某个提供程序的任务获取较慢，从而关闭该提供程序。在这种情况下，用户可能仍然在其 `tasks.json` 中引用该提供程序的一些任务。如果未实现 `resolveTask`，则会显示警告，指出 `tasks.json` 中的任务未被创建。有了 `resolveTask`，扩展仍然可以为 `tasks.json` 中定义的任务提供支持。

`getRakeTasks` 的实现执行以下操作：

- 对每个工作区文件夹，使用 `rake -AT -f Rakefile` 命令列出 `Rakefile` 中定义的所有 rake 任务。
- 解析标准输出。
- 为每个列出的任务创建一个 `vscode.Task` 实现。

由于 Rake 任务实例化需要 `package.json` 文件中定义的任务定义，VS Code 还使用 TypeScript 接口定义了其结构，如下所示：

```typescript
interface RakeTaskDefinition extends vscode.TaskDefinition {
  /**
   * The task name
   */
  task: string;

  /**
   * The rake file containing the task
   */
  file?: string;
}
```

假设输出来自第一个工作区文件夹中名为 `compile` 的任务，相应的任务创建如下：

```typescript
let task = new vscode.Task(
  { type: 'rake', task: 'compile' },
  vscode.workspace.workspaceFolders[0],
  'compile',
  'rake',
  new vscode.ShellExecution('rake compile')
);
```

对于输出中列出的每个任务，使用上述模式创建相应的 VS Code 任务，然后从 `getRakeTasks` 调用中返回所有任务的数组。

`ShellExecution` 在操作系统特定的 Shell 中执行 `rake compile` 命令（例如在 Windows 下命令将在 PowerShell 中执行，在 Ubuntu 下将在 bash 中执行）。如果任务应直接执行进程（不启动 Shell），可以使用 `vscode.ProcessExecution`。`ProcessExecution` 的优势在于扩展可以完全控制传递给进程的参数。使用 `ShellExecution` 则利用了 Shell 命令解释（如 bash 下的通配符扩展）。如果 `ShellExecution` 使用单个命令行创建，则扩展需要确保命令内的正确引用和转义（例如处理空格）。

## CustomExecution

通常，最好使用 `ShellExecution` 或 `ProcessExecution`，因为它们很简单。但是，如果你的任务在运行之间需要大量保存的状态、不适合作为单独的脚本或进程运行，或者需要大量处理输出，那么 `CustomExecution` 可能是一个不错的选择。`CustomExecution` 的现有用途通常用于复杂的构建系统。`CustomExecution` 只有一个回调，在任务运行时执行。这为任务的功能提供了更大的灵活性，但也意味着任务提供程序需要负责任何需要进行的进程管理和输出解析。任务提供程序还负责实现 `Pseudoterminal` 并从 `CustomExecution` 回调中返回它。

```typescript
return new vscode.Task(definition, vscode.TaskScope.Workspace, `${flavor} ${flags.join(' ')}`,
  CustomBuildTaskProvider.CustomBuildScriptType, new vscode.CustomExecution(async (): Promise<vscode.Pseudoterminal> => {
    // When the task is executed, this callback will run. Here, we setup for running the task.
    return new CustomBuildTaskTerminal(this.workspaceRoot, flavor, flags, () => this.sharedState, (state: string) => this.sharedState = state);
  }));
```

完整示例（包括 `Pseudoterminal` 的实现）位于 [https://github.com/microsoft/vscode-extension-samples/tree/main/task-provider-sample/src/customTaskProvider.ts](https://github.com/microsoft/vscode-extension-samples/tree/main/task-provider-sample/src/customTaskProvider.ts)。
