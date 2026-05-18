---
title: Testing API
description: VS Code 中的 Testing API 允许用户在工作区中发现和运行单元测试
---

# Testing API

Testing API 允许 Visual Studio Code 扩展在工作区中发现测试并发布结果。用户可以在测试资源管理器视图中、从装饰器中以及在命令中执行测试。借助这些新的 API，Visual Studio Code 支持比以往更丰富的输出和差异显示。

>**注意**：Testing API 在 VS Code 1.59 及更高版本中可用。

## 示例

VS Code 团队维护了两个测试提供者：

- [示例测试扩展](https://github.com/microsoft/vscode-extension-samples/tree/main/test-provider-sample)，为 Markdown 文件提供测试。
- [selfhost 测试扩展](https://github.com/microsoft/vscode-selfhost-test-provider)，我们用于在 VS Code 自身中运行测试。

## 发现测试

测试由 `TestController` 提供，它需要一个全局唯一的 ID 和人类可读的标签来创建：

```ts
const controller = vscode.tests.createTestController('helloWorldTests', 'Hello World Tests');
```

要发布测试，你需要将 `TestItem` 作为子项添加到控制器的 `items` 集合中。`TestItem` 是测试 API 中 `TestItem` 接口的基础，是一种通用类型，可以描述代码中存在的测试用例、测试套件或树项。它们本身也可以有 `children`，形成层次结构。例如，以下是示例测试扩展创建测试的简化版本：

```ts
parseMarkdown(content, {
  onTest: (range, numberA, mathOperator, numberB, expectedValue) => {
    // 如果这是顶级测试，添加到其父级的子项中。否则，
    // 添加到控制器的顶级项中。
    const collection = parent ? parent.children : controller.items;
    // 创建一个在父级子项中唯一的新 ID：
    const id = [numberA, mathOperator, numberB, expectedValue].join('  ');

    // 最后，创建测试项：
    const test = controller.createTestItem(id, data.getLabel(), item.uri);
    test.range = range;
    collection.add(test);
  },
  // ...
});
```

与诊断类似，控制何时发现测试主要由扩展决定。一个简单的扩展可能会监视整个工作区并在激活时解析所有文件中的所有测试。然而，对于大型工作区，立即解析所有内容可能会很慢。相反，你可以做两件事：

1. 通过监视 `vscode.workspace.onDidOpenTextDocument`，在文件于编辑器中打开时主动发现该文件的测试。
1. 设置 `item.canResolveChildren = true` 并设置 `controller.resolveHandler`。当用户采取操作要求发现测试时（例如在测试资源管理器中展开某个项），会调用 `resolveHandler`。

以下是在延迟解析文件的扩展中此策略的实现方式：

```ts
// 首先，创建 `resolveHandler`。它最初可能会以 "undefined" 被调用，
// 以请求发现工作区中的所有测试，通常发生在用户首次打开测试资源管理器时。
controller.resolveHandler = async test => {
  if (!test) {
    await discoverAllFilesInWorkspace();
  } else {
    await parseTestsInFileContents(test);
  }
};

// 当文本文档打开时，解析其中的测试。
vscode.workspace.onDidOpenTextDocument(parseTestsInDocument);
// 我们也可以监听文档更改以重新解析未保存的更改：
vscode.workspace.onDidChangeTextDocument(e => parseTestsInDocument(e.document));

// 在此函数中，如果我们已经找到了文件 TestItem，就获取它，
// 否则我们就创建一个，并设置 `canResolveChildren = true` 表示
// 它可以被传递给 `controller.resolveHandler` 来获取其子项。
function getOrCreateFile(uri: vscode.Uri) {
  const existing = controller.items.get(uri.toString());
  if (existing) {
    return existing;
  }

  const file = controller.createTestItem(uri.toString(), uri.path.split('/').pop()!, uri);
  file.canResolveChildren = true;
  return file;
}

function parseTestsInDocument(e: vscode.TextDocument) {
  if (e.uri.scheme === 'file' && e.uri.path.endsWith('.md')) {
    parseTestsInFileContents(getOrCreateFile(e.uri), e.getText());
  }
}

async function parseTestsInFileContents(file: vscode.TestItem, contents?: string) {
  // 如果文档已打开，VS Code 已经知道其内容。如果这是从 resolveHandler
  // 在文档未打开时调用的，我们需要自己从磁盘读取。
  if (contents === undefined) {
    const rawContent = await vscode.workspace.fs.readFile(file.uri);
    contents = new TextDecoder().decode(rawContent);
  }

  // 一些自定义逻辑，从内容中填充 test.children...
}
```

`discoverAllFilesInWorkspace` 的实现可以利用 VS Code 现有的文件监视功能。当 `resolveHandler` 被调用时，你应该继续监视更改，以便测试资源管理器中的数据保持最新。

```ts
async function discoverAllFilesInWorkspace() {
  if (!vscode.workspace.workspaceFolders) {
    return []; // 处理没有打开文件夹的情况
  }

  return Promise.all(vscode.workspace.workspaceFolders.map(async workspaceFolder => {
    const pattern = new vscode.RelativePattern(workspaceFolder, '**/*.md');
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);

    // 当文件被创建时，确保树中有对应的"文件"节点
    watcher.onDidCreate(uri => getOrCreateFile(uri));
    // 当文件更改时，重新解析它们。注意你可以优化这一点，
    // 使得只重新解析过去已解析过的子项。
    watcher.onDidChange(uri => parseTestsInFileContents(getOrCreateFile(uri)));
    // 最后，为已删除的文件删除 TestItem。这很简单，
    // 因为我们使用 URI 作为 TestItem 的 ID。
    watcher.onDidDelete(uri => controller.items.delete(uri.toString()));

    for (const file of await vscode.workspace.findFiles(pattern)) {
      getOrCreateFile(file);
    }

    return watcher;
  }));
}
```

`TestItem` 接口很简单，没有存放自定义数据的空间。如果你需要将额外信息与 `TestItem` 关联，可以使用 [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)：

```ts
const testData = new WeakMap<vscode.TestItem, MyCustomData>();

// 关联数据：
const item = controller.createTestItem(id, label);
testData.set(item, new MyCustomData());

// 稍后取回：
const myData = testData.get(item);
```

可以保证传递给所有 `TestController` 相关方法的 `TestItem` 实例与从 `createTestItem` 原始创建的实例是相同的，因此你可以确信从 `testData` 映射中获取项是有效的。

在这个例子中，我们只存储每个项的类型：

```ts
enum ItemType {
  File,
  TestCase,
}

const testData = new WeakMap<vscode.TestItem, ItemType>();

const getType = (testItem: vscode.TestItem) => testData.get(testItem)!;
```

## 运行测试

测试通过 `TestRunProfile` 执行。每个配置文件属于特定的执行 `kind`：运行、调试或覆盖率。大多数测试扩展在这些分组中每种最多有一个配置文件，但也允许更多。例如，如果你的扩展在多个平台上运行测试，你可以为平台和 `kind` 的每种组合设置一个配置文件。每个配置文件有一个 `runHandler`，当请求该类型的运行时会被调用。

```ts

function runHandler(shouldDebug: boolean, request: vscode.TestRunRequest, token: vscode.CancellationToken) {
  // todo
}

const runProfile = controller.createRunProfile('Run', vscode.TestRunProfileKind.Run, (request, token) => {
  runHandler(false, request, token);
});

const debugProfile = controller.createRunProfile('Debug', vscode.TestRunProfileKind.Debug, (request, token) => {
  runHandler(true, request, token);
});
```

`runHandler` 应该至少调用一次 `controller.createTestRun`，传入原始请求。请求包含要 `include` 在测试运行中的测试（如果用户要求运行所有测试则省略），以及可能要从运行中 `exclude` 的测试。扩展应使用返回的 `TestRun` 对象来更新参与运行的测试状态。例如：

```ts
async function runHandler(shouldDebug: boolean, request: vscode.TestRunRequest, token: vscode.CancellationToken) {
  const run = controller.createTestRun(request);
  const queue: vscode.TestItem[] = [];

  // 遍历所有包含的测试，或所有已知测试，并将它们加入队列
  if (request.include) {
    request.include.forEach(test => queue.push(test));
  } else {
    controller.items.forEach(test => queue.push(test));
  }

  // 对于队列中的每个测试，尝试运行它。调用 run.passed() 或 run.failed()。
  // `TestMessage` 可以包含额外信息，如失败位置或差异输出。
  // 这里我们只给它一个文本消息。
  while (queue.length > 0 && !token.isCancellationRequested) {
    const test = queue.pop()!;

    // 跳过用户要求排除的测试
    if (request.exclude?.includes(test)) {
      continue;
    }

    switch (getType(test)) {
      case ItemType.File:
        // 如果我们正在运行一个文件但还不知道它的内容，现在解析它
        if (test.children.size === 0) {
          await parseTestsInFileContents(test);
        }
        break;
      case ItemType.TestCase:
        // 否则，直接运行测试用例。注意我们不需要手动
        // 设置父测试的状态；它们会被自动设置。
        const start = Date.now();
        try {
          await assertTestPasses(test);
          run.passed(test, Date.now() - start);
        } catch (e) {
          run.failed(test, new vscode.TestMessage(e.message), Date.now() - start);
        }
        break;
    }

    test.children.forEach(test => queue.push(test));
  }

  // 确保在所有测试执行完毕后结束运行：
  run.end();
}
```

除了 `runHandler`，你还可以在 `TestRunProfile` 上设置 `configureHandler`。如果存在，VS Code 将提供 UI 允许用户配置测试运行，并在他们执行此操作时调用处理程序。在这里，你可以打开文件、显示快速选择或执行任何适合你测试框架的操作。

> VS Code 有意以不同于调试或任务配置的方式处理测试配置。这些传统上是编辑器或 IDE 中心的功能，在 `.vscode` 文件夹中的特殊文件中进行配置。然而，测试传统上是从命令行执行的，大多数测试框架都有现有的配置策略。因此，在 VS Code 中，我们避免重复配置，而是将其交给扩展来处理。

### 测试输出

除了传递给 `TestRun.failed` 或 `TestRun.errored` 的消息之外，你还可以使用 `run.appendOutput(str)` 追加通用输出。此输出可以通过 **Test: Show Output** 命令以及 UI 中的各种按钮（例如测试资源管理器视图中的终端图标）在终端中显示。

由于字符串在终端中渲染，你可以使用完整的 [ANSI 代码](https://en.wikipedia.org/wiki/ANSI_escape_code)集，包括 [ansi-styles](https://www.npmjs.com/package/ansi-styles) npm 包中可用的样式。请注意，由于是在终端中，行必须使用 CRLF (`\r\n`) 换行，而不能仅使用 LF (`\n`)，后者可能是某些工具的默认输出。

### 测试覆盖率

测试覆盖率通过 `run.addCoverage()` 方法与 `TestRun` 关联。按照惯例，这应该由 `TestRunProfileKind.Coverage` 类型配置文件的 `runHandler` 来完成，但也可以在任何测试运行期间调用。`addCoverage` 方法接受一个 `FileCoverage` 对象，它是该文件覆盖率数据的摘要：

```ts
async function runHandler(shouldDebug: boolean, request: vscode.TestRunRequest, token: vscode.CancellationToken) {
  // ...

  for await (const file of readCoverageOutput()) {
    run.addCoverage(new vscode.FileCoverage(file.uri, file.statementCoverage))
  }
}
```

`FileCoverage` 包含每个文件中语句、分支和声明的总体覆盖和未覆盖计数。根据你的运行时和覆盖率格式，你可能会看到语句覆盖率被称为行覆盖率，或声明覆盖率被称为函数或方法覆盖率。你可以为单个 URI 多次添加文件覆盖率，新的信息将替换旧的信息。

当用户打开具有覆盖率的文件或在 **Test Coverage** 视图中展开文件时，VS Code 会请求该文件的更多信息。它通过调用 `TestRunProfile` 上扩展定义的 `loadDetailedCoverage` 方法来实现，传入 `TestRun`、`FileCoverage` 和 `CancellationToken`。注意测试运行和文件覆盖率实例与 `run.addCoverage` 中使用的相同，这对于关联数据很有用。例如，你可以创建一个从 `FileCoverage` 对象到你自己数据的映射：

```ts
const coverageData = new WeakMap<vscode.FileCoverage, MyCoverageDetails>();

profile.loadDetailedCoverage = (testRun, fileCoverage, token) => {
  return coverageData.get(fileCoverage).load(token);
}

async function runHandler(shouldDebug: boolean, request: vscode.TestRunRequest, token: vscode.CancellationToken) {
  // ...

  for await (const file of readCoverageOutput()) {
    const coverage = new vscode.FileCoverage(file.uri, file.statementCoverage);
    coverageData.set(coverage, file)
    run.addCoverage(coverage);
  }
}
```

或者你可以子类化 `FileCoverage`，在实现中包含该数据：

```ts
class MyFileCoverage extends vscode.FileCoverage {
  // ...
}

profile.loadDetailedCoverage = async (testRun, fileCoverage, token) => {
  return fileCoverage instanceof MyFileCoverage ? await fileCoverage.load() : [];
}

async function runHandler(shouldDebug: boolean, request: vscode.TestRunRequest, token: vscode.CancellationToken) {
  // ...

  for await (const file of readCoverageOutput()) {
    // 'file' 是 MyFileCoverage：
    run.addCoverage(file);
  }
}
```

`loadDetailedCoverage` 预期返回一个解析为 `DeclarationCoverage` 和/或 `StatementCoverage` 对象数组的 Promise。两种对象都包含一个 `Position` 或 `Range`，指示它们在源文件中的位置。`DeclarationCoverage` 对象包含被声明事物的名称（如函数或方法名称）以及该声明被进入或调用的次数。语句包含它们被执行的次数，以及零个或多个关联的分支。有关更多信息，请参阅 `vscode.d.ts` 中的类型定义。

在很多情况下，你的测试运行可能会留下一些持久化文件。最佳做法是将此类覆盖率输出放在系统的临时目录中（可以通过 `require('os').tmpdir()` 获取），但你也可以通过监听 VS Code 不再需要保留测试运行的提示来主动清理它们：

```ts
import { promises as fs } from 'fs';

async function runHandler(shouldDebug: boolean, request: vscode.TestRunRequest, token: vscode.CancellationToken) {
  // ...

  run.onDidDispose(async () => {
    await fs.rm(coverageOutputDirectory, { recursive: true, force: true });
  });
}
```

### 测试标签

有时候测试只能在特定配置下运行，或者根本不能运行。对于这些用例，你可以使用测试标签。`TestRunProfile` 可以选择性地关联一个标签，如果关联了，只有拥有该标签的测试才能在该配置文件下运行。同样，如果没有可用的配置文件来运行、调试或收集特定测试的覆盖率，这些选项将不会在 UI 中显示。

```ts
// 创建一个 ID 为 "runnable" 的新标签
const runnableTag = new TestTag('runnable');

// 将其分配给一个配置文件。现在此配置文件只能执行带有该标签的测试。
runProfile.tag = runnableTag;

// 为所有适用的测试添加 "runnable" 标签。
for (const test of getAllRunnableTests()) {
  test.tags = [...test.tags, runnableTag];
}
```

用户还可以在测试资源管理器 UI 中按标签筛选。

### 仅发布控制器

运行配置文件的存在是可选的。控制器可以创建测试、在 `runHandler` 之外调用 `createTestRun`，以及在没有配置文件的情况下更新运行中测试的状态。常见的用例是从外部来源（如 CI 或摘要文件）加载结果的控制器。

在这种情况下，这些控制器通常应该将可选的 `name` 参数传递给 `createTestRun`，并将 `persist` 参数设为 `false`。此处传递 `false` 指示 VS Code 不要保留测试结果（就像编辑器中的运行那样），因为这些结果可以从外部来源重新加载。

```ts
const controller = vscode.tests.createTestController('myCoverageFileTests', 'Coverage File Tests');

vscode.commands.registerCommand('myExtension.loadTestResultFile', async file => {
  const info = await readFile(file);

  // 将控制器项设置为从文件中读取的项：
  controller.items.replace(readTestsFromInfo(info));

  // 创建你自己的自定义测试运行，然后你可以立即设置运行中
  // 项的状态并结束它以发布结果：
  const run = controller.createTestRun(new vscode.TestRunRequest(), path.basename(file), false);
  for (const result of info) {
    if (result.passed) {
      run.passed(result.item);
    } else {
      run.failed(result.item, new vscode.TestMessage(result.message));
    }
  }
  run.end();
});
```

## 从 Test Explorer UI 迁移

如果你有一个使用 Test Explorer UI 的现有扩展，我们建议你迁移到原生体验以获得更多功能和更高的效率。我们准备了一个仓库，其中包含 Test Adapter 示例迁移的过程，可在其 [Git 历史](https://github.com/connor4312/test-controller-migration-example/commits/master)中查看。你可以通过选择提交名称来查看每个步骤，从 `[1] Create a native TestController` 开始。

总的来说，一般步骤如下：

1. 不再获取 `TestAdapter` 并将其注册到 Test Explorer UI 的 `TestHub`，而是调用 `const controller = vscode.tests.createTestController(...)`。

1. 不是在发现或重新发现测试时触发 `testAdapter.tests`，而是创建测试并推入 `controller.items`，例如通过调用 `controller.items.replace` 传入由 `vscode.test.createTestItem` 创建的已发现测试数组。请注意，随着测试的变化，你可以修改测试项的属性并更新其子项，更改会自动反映在 VS Code 的 UI 中。

1. 要初始加载测试，不是等待 `testAdapter.load()` 方法调用，而是设置 `controller.resolveHandler = () => { /* 发现测试 */ }`。有关测试发现工作原理的更多信息，请参阅[发现测试](#discovering-tests)。

1. 要运行测试，你应该创建一个带有处理函数的[运行配置文件](#running-tests)，该函数调用 `const run = controller.createTestRun(request)`。不是触发 `testStates` 事件，而是将 `TestItem` 传递给 `run` 上的方法来更新它们的状态。

## 其他贡献点

`testing/item/context` [菜单贡献点](/vscode/extension/references/contribution-points#contributes.menus) 可用于向测试资源管理器视图中的测试添加菜单项。将菜单项放在 `inline` 分组中可使其内联显示。所有其他分组的菜单项将显示在上下文菜单中，可通过鼠标右键访问。

菜单项的 `when` 子句中还有其他可用的[上下文键](/vscode/extension/references/when-clause-contexts)：`testId`、`controllerId` 和 `testItemHasUri`。对于更复杂的 `when` 场景，当你希望操作可选择性地用于不同的测试项时，可以考虑使用 [`in` 条件运算符](/vscode/extension/references/when-clause-contexts#in-and-not-in-conditional-operators)。

如果你想在资源管理器中显示某个测试，可以将该测试传递给命令 `vscode.commands.executeCommand('vscode.revealTestInExplorer', testItem)`。
