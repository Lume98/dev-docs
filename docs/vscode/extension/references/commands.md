---
title: 内置命令
description: Visual Studio Code 内置命令参考。
---

# 内置命令

本文档列出了 Visual Studio Code 命令的一个子集，你可能会在 `vscode.commands.executeCommand` API 中使用这些命令。

阅读[命令指南](/vscode/extension/extension-guides/command)了解如何使用命令 API。

以下是在 VS Code 中打开新文件夹的示例：

```javascript
let uri = Uri.file('/some/path/to/folder');
let success = await commands.executeCommand('vscode.openFolder', uri);
```

>**注意**：你可以通过键盘快捷键编辑器（**文件** > **首选项** > **键盘快捷键**）查看 VS Code 命令的完整集合。键盘快捷键编辑器列出了 VS Code 内置的所有命令以及扩展贡献的命令，以及它们的按键绑定和可见性 when 子句。

## 命令

`vscode.executeDataToNotebook` - 调用 Notebook 序列化器

* _notebookType_ - Notebook 类型
* _data_ - 要转换为数据的字节
* _(返回值)_ - Notebook 数据

`vscode.executeNotebookToData` - 调用 Notebook 序列化器

* _notebookType_ - Notebook 类型
* _NotebookData_ - 要转换为字节的 Notebook 数据
* _(返回值)_ - 字节

`notebook.selectKernel` - 为指定的 Notebook 编辑器组件触发内核选择器

* _options_ - 选择内核选项
* _(返回值)_ - 无结果

`interactive.open` - 打开交互式窗口并返回 Notebook 编辑器和输入 URI

* _showOptions_ - 显示选项
* _resource_ - 交互式资源 Uri
* _controllerId_ - Notebook 控制器 ID
* _title_ - 交互式编辑器标题
* _(返回值)_ - Notebook 和输入 URI

`vscode.editorChat.start` - 启动新的编辑器聊天会话

* _Run arguments_ -
* _(返回值)_ - 无结果

`vscode.executeDocumentHighlights` - 执行文档高亮提供程序。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _(返回值)_ - 解析为 DocumentHighlight 实例数组的 Promise。

`vscode.executeDocumentSymbolProvider` - 执行文档符号提供程序。

* _uri_ - 文本文档的 Uri
* _(返回值)_ - 解析为 SymbolInformation 和 DocumentSymbol 实例数组的 Promise。

`vscode.executeFormatDocumentProvider` - 执行文档格式化提供程序。

* _uri_ - 文本文档的 Uri
* _options_ - 格式化选项
* _(返回值)_ - 解析为 TextEdit 数组的 Promise。

`vscode.executeFormatRangeProvider` - 执行范围格式化提供程序。

* _uri_ - 文本文档的 Uri
* _range_ - 文本文档中的范围
* _options_ - 格式化选项
* _(返回值)_ - 解析为 TextEdit 数组的 Promise。

`vscode.executeFormatOnTypeProvider` - 执行输入时格式化提供程序。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _ch_ - 触发字符
* _options_ - 格式化选项
* _(返回值)_ - 解析为 TextEdit 数组的 Promise。

`vscode.executeDefinitionProvider` - 执行所有定义提供程序。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _(返回值)_ - 解析为 Location 或 LocationLink 实例数组的 Promise。

`vscode.executeTypeDefinitionProvider` - 执行所有类型定义提供程序。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _(返回值)_ - 解析为 Location 或 LocationLink 实例数组的 Promise。

`vscode.executeDeclarationProvider` - 执行所有声明提供程序。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _(返回值)_ - 解析为 Location 或 LocationLink 实例数组的 Promise。

`vscode.executeImplementationProvider` - 执行所有实现提供程序。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _(返回值)_ - 解析为 Location 或 LocationLink 实例数组的 Promise。

`vscode.executeReferenceProvider` - 执行所有引用提供程序。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _(返回值)_ - 解析为 Location 实例数组的 Promise。

`vscode.executeHoverProvider` - 执行所有悬停提供程序。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _(返回值)_ - 解析为 Hover 实例数组的 Promise。

`vscode.executeSelectionRangeProvider` - 执行选区范围提供程序。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _(返回值)_ - 解析为范围数组的 Promise。

`vscode.executeWorkspaceSymbolProvider` - 执行所有工作区符号提供程序。

* _query_ - 搜索字符串
* _(返回值)_ - 解析为 SymbolInformation 实例数组的 Promise。

`vscode.prepareCallHierarchy` - 在文档内的某个位置准备调用层次结构

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _(返回值)_ - 解析为 CallHierarchyItem 实例数组的 Promise

`vscode.provideIncomingCalls` - 计算某个项目的传入调用

* _item_ - 调用层次结构项
* _(返回值)_ - 解析为 CallHierarchyIncomingCall 实例数组的 Promise

`vscode.provideOutgoingCalls` - 计算某个项目的传出调用

* _item_ - 调用层次结构项
* _(返回值)_ - 解析为 CallHierarchyOutgoingCall 实例数组的 Promise

`vscode.prepareRename` - 执行重命名提供程序的 prepareRename。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _(返回值)_ - 解析为范围和占位符文本的 Promise。

`vscode.executeDocumentRenameProvider` - 执行重命名提供程序。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _newName_ - 新的符号名称
* _(返回值)_ - 解析为 WorkspaceEdit 的 Promise。

`vscode.executeLinkProvider` - 执行文档链接提供程序。

* _uri_ - 文本文档的 Uri
* _linkResolveCount_ - （可选）应解析的链接数量，仅在链接未解析时有效。
* _(返回值)_ - 解析为 DocumentLink 实例数组的 Promise。

`vscode.provideDocumentSemanticTokensLegend` - 为文档提供语义令牌图例

* _uri_ - 文本文档的 Uri
* _(返回值)_ - 解析为 SemanticTokensLegend 的 Promise。

`vscode.provideDocumentSemanticTokens` - 为文档提供语义令牌

* _uri_ - 文本文档的 Uri
* _(返回值)_ - 解析为 SemanticTokens 的 Promise。

`vscode.provideDocumentRangeSemanticTokensLegend` - 为文档范围提供语义令牌图例

* _uri_ - 文本文档的 Uri
* _range_ - （可选）文本文档中的范围
* _(返回值)_ - 解析为 SemanticTokensLegend 的 Promise。

`vscode.provideDocumentRangeSemanticTokens` - 为文档范围提供语义令牌

* _uri_ - 文本文档的 Uri
* _range_ - 文本文档中的范围
* _(返回值)_ - 解析为 SemanticTokens 的 Promise。

`vscode.executeCompletionItemProvider` - 执行补全项提供程序。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _triggerCharacter_ - （可选）当用户输入该字符时触发补全，例如 `,` 或 `(`
* _itemResolveCount_ - （可选）要解析的补全项数量（数值过大会降低补全速度）
* _(返回值)_ - 解析为 CompletionList 实例的 Promise。

`vscode.executeSignatureHelpProvider` - 执行签名帮助提供程序。

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _triggerCharacter_ - （可选）当用户输入该字符时触发签名帮助，例如 `,` 或 `(`
* _(返回值)_ - 解析为 SignatureHelp 的 Promise。

`vscode.executeCodeLensProvider` - 执行 Code Lens 提供程序。

* _uri_ - 文本文档的 Uri
* _itemResolveCount_ - （可选）应解析并返回的 Code Lens 数量。只返回已解析的 Code Lens，会影响性能
* _(返回值)_ - 解析为 CodeLens 实例数组的 Promise。

`vscode.executeCodeActionProvider` - 执行代码操作提供程序。

* _uri_ - 文本文档的 Uri
* _rangeOrSelection_ - 文本文档中的范围。某些重构提供程序需要 Selection 对象。
* _kind_ - （可选）要返回代码操作的代码操作类型
* _itemResolveCount_ - （可选）要解析的代码操作数量（数值过大会降低代码操作速度）
* _(返回值)_ - 解析为 Command 实例数组的 Promise。

`vscode.executeDocumentColorProvider` - 执行文档颜色提供程序。

* _uri_ - 文本文档的 Uri
* _(返回值)_ - 解析为 ColorInformation 对象数组的 Promise。

`vscode.executeColorPresentationProvider` - 执行颜色展示提供程序。

* _color_ - 要显示和插入的颜色
* _context_ - 包含 uri 和 range 的上下文对象
* _(返回值)_ - 解析为 ColorPresentation 对象数组的 Promise。

`vscode.executeInlayHintProvider` - 执行内联提示提供程序

* _uri_ - 文本文档的 Uri
* _range_ - 文本文档中的范围
* _(返回值)_ - 解析为 Inlay 对象数组的 Promise

`vscode.executeFoldingRangeProvider` - 执行折叠范围提供程序

* _uri_ - 文本文档的 Uri
* _(返回值)_ - 解析为 FoldingRange 对象数组的 Promise

`vscode.resolveNotebookContentProviders` - 解析 Notebook 内容提供程序

* _(返回值)_ - 解析为 NotebookContentProvider 静态信息对象数组的 Promise。

`vscode.executeInlineValueProvider` - 执行内联值提供程序

* _uri_ - 文本文档的 Uri
* _range_ - 文本文档中的范围
* _context_ - InlineValueContext
* _(返回值)_ - 解析为 InlineValue 对象数组的 Promise

`vscode.open` - 在编辑器中打开提供的资源。可以是文本或二进制文件，或 http(s) URL。如果你需要更多控制文本文件打开选项的方式，请改用 `vscode.window.showTextDocument`。

* _uri_ - 文本或二进制文件的 Uri，或 http(s) URL
* _columnOrOptions_ - （可选）打开的列号，或编辑器选项，参见 `vscode.TextDocumentShowOptions`
* _label_ - 编辑器标签（可选）
* _(返回值)_ - 无结果

`vscode.openWith` - 使用特定编辑器打开提供的资源。

* _resource_ - 要打开的资源
* _viewId_ - 自定义编辑器视图 ID 或 'default' 以使用 VS Code 的默认编辑器
* _columnOrOptions_ - （可选）打开的列号或编辑器选项，参见 vscode.TextDocumentShowOptions
* _(返回值)_ - 无结果

`vscode.diff` - 在差异编辑器中打开提供的资源以比较它们的内容。

* _left_ - 差异编辑器左侧资源
* _right_ - 差异编辑器右侧资源
* _title_ - 差异编辑器的可读标题
* _options_ - （可选）打开的列号，或编辑器选项（参见 vscode.TextDocumentShowOptions）

`vscode.changes` - 在变更编辑器中打开资源列表以比较它们的内容。

* _title_ - 变更编辑器的可读标题
* _resourceList_ - 要比较的资源列表

`vscode.prepareTypeHierarchy` - 在文档内的某个位置准备类型层次结构

* _uri_ - 文本文档的 Uri
* _position_ - 文本文档中的位置
* _(返回值)_ - 解析为 TypeHierarchyItem 实例数组的 Promise

`vscode.provideSupertypes` - 计算某个项目的父类型

* _item_ - 类型层次结构项
* _(返回值)_ - 解析为 TypeHierarchyItem 实例数组的 Promise

`vscode.provideSubtypes` - 计算某个项目的子类型

* _item_ - 类型层次结构项
* _(返回值)_ - 解析为 TypeHierarchyItem 实例数组的 Promise

`vscode.revealTestInExplorer` - 在资源管理器中显示测试实例

* _testItem_ - 一个 VS Code TestItem。
* _(返回值)_ - 无结果

`setContext` - 设置自定义上下文键值，可在 when 子句中使用。

* _name_ - 上下文键名称
* _value_ - 上下文键值
* _(返回值)_ - 无结果

`cursorMove` - 将光标移动到视图中的逻辑位置

* _Cursor move argument object_ - 可通过此参数传递的属性-值对：
  * 'to': 必需的逻辑位置值，指定光标移动的目标位置。
    ```
    'left', 'right', 'up', 'down', 'prevBlankLine', 'nextBlankLine',
    'wrappedLineStart', 'wrappedLineEnd', 'wrappedLineColumnCenter'
    'wrappedLineFirstNonWhitespaceCharacter', 'wrappedLineLastNonWhitespaceCharacter'
    'viewPortTop', 'viewPortCenter', 'viewPortBottom', 'viewPortIfOutside'
    ```
  * 'by': 移动单位。默认值根据 'to' 的值计算。
    ```
    'line', 'wrappedLine', 'character', 'halfLine'
    ```
  * 'value': 移动的单位数量。默认为 '1'。
  * 'select': 如果为 'true' 则进行选择。默认为 'false'。

`editorScroll` - 按给定方向滚动编辑器

* _Editor scroll argument object_ - 可通过此参数传递的属性-值对：
  * 'to': 必需的方向值。
    ```
    'up', 'down'
    ```
  * 'by': 移动单位。默认值根据 'to' 的值计算。
    ```
    'line', 'wrappedLine', 'page', 'halfPage', 'editor'
    ```
  * 'value': 移动的单位数量。默认为 '1'。
  * 'revealCursor': 如果为 'true'，当光标不在可视区域内时将其显示出来。

`revealLine` - 在给定逻辑位置显示指定行

* _Reveal line argument object_ - 可通过此参数传递的属性-值对：
  * 'lineNumber': 必需的行号值。
  * 'at': 行显示的逻辑位置。
    ```
    'top', 'center', 'bottom'
    ```

`editor.unfold` - 在编辑器中展开折叠内容

* _Unfold editor argument_ - 可通过此参数传递的属性-值对：
  * 'levels': 要展开的层级数。如果未设置，默认为 1。
  * 'direction': 如果为 'up'，则向上展开指定层级数，否则向下展开。
  * 'selectionLines': 要应用展开操作的编辑器选区的起始行（从 0 开始）数组。如果未设置，将使用活动选区。

`editor.fold` - 在编辑器中折叠内容

* _Fold editor argument_ - 可通过此参数传递的属性-值对：
  * 'levels': 要折叠的层级数。
  * 'direction': 如果为 'up'，则向上折叠指定层级数，否则向下折叠。
  * 'selectionLines': 要应用折叠操作的编辑器选区的起始行（从 0 开始）数组。如果未设置，将使用活动选区。
  如果未设置层级数或方向，则折叠当前位置的折叠区域；如果已经折叠，则折叠第一个未折叠的父级区域。

`editor.toggleFold` - 根据当前状态在编辑器中折叠或展开内容

`editor.actions.findWithArgs` - 使用特定选项打开新的编辑器内查找小部件。

* searchString - 预填充查找输入框的字符串
* replaceString - 预填充替换输入框的字符串
* isRegex - 启用正则表达式
* preserveCase - 替换时尝试保持相同的大小写
* findInSelection - 将查找范围限制为当前选区
* matchWholeWord
* isCaseSensitive

`editor.action.goToLocations` - 从文件中的某个位置跳转到目标位置

* _uri_ - 起始文本文档
* _position_ - 起始位置
* _locations_ - 位置数组。
* _multiple_ - 定义有多个结果时的行为，可选 `peek`、`gotoAndPeek` 或 `goto
* _noResultsMessage_ - 当位置为空时显示的可读消息。

`editor.action.peekLocations` - 从文件中的某个位置速览目标位置

* _uri_ - 起始文本文档
* _position_ - 起始位置
* _locations_ - 位置数组。
* _multiple_ - 定义有多个结果时的行为，可选 `peek`、`gotoAndPeek` 或 `goto

`workbench.action.quickOpen` - 快速访问

* _prefix_ -

`notebook.cell.toggleOutputs` - 切换输出显示

* _options_ - 单元格范围选项

`notebook.fold` - 折叠单元格

* _index_ - 单元格索引

`notebook.unfold` - 展开单元格

* _index_ - 单元格索引

`notebook.selectKernel` - Notebook 内核参数

* _kernelInfo_ - 内核信息

`notebook.cell.changeLanguage` - 更改单元格语言

* _range_ - 单元格范围
* _language_ - 目标单元格语言

`notebook.execute` - 全部运行

* _uri_ - 文档 URI

`notebook.cell.execute` - 执行单元格

* _options_ - 单元格范围选项

`notebook.cell.executeAndFocusContainer` - 执行单元格并聚焦容器

* _options_ - 单元格范围选项

`notebook.cell.cancelExecution` - 停止单元格执行

* _options_ - 单元格范围选项

`workbench.action.findInFiles` - 打开工作区搜索

* _A set of options for the search_ -

`_interactive.open` - 打开交互式窗口

* _showOptions_ - 显示选项
* _resource_ - 交互式资源 Uri
* _controllerId_ - Notebook 控制器 ID
* _title_ - Notebook 编辑器标题

`interactive.execute` - 执行输入框中的内容

* _resource_ - 交互式资源 Uri

`search.action.openNewEditor` - 打开新的搜索编辑器。传递的参数可以包含变量，如 ${relativeFileDirname}。

* _Open new Search Editor args_ -

`search.action.openEditor` - 打开新的搜索编辑器。传递的参数可以包含变量，如 ${relativeFileDirname}。

* _Open new Search Editor args_ -

`search.action.openNewEditorToSide` - 在侧边打开新的搜索编辑器。传递的参数可以包含变量，如 ${relativeFileDirname}。

* _Open new Search Editor args_ -

`vscode.openFolder` - 根据 newWindow 参数在当前窗口或新窗口中打开文件夹或工作区。注意，在同一窗口中打开会关闭当前的扩展宿主进程，并在给定的文件夹/工作区上启动新进程，除非将 newWindow 参数设置为 true。

* _uri_ - （可选）要打开的文件夹或工作区文件的 Uri。如果未提供，将通过原生对话框询问用户选择文件夹
* _options_ - （可选）选项。包含以下属性的对象：`forceNewWindow`：是否在新窗口中打开文件夹/工作区。默认在当前窗口打开。`forceReuseWindow`：是否强制在当前窗口中打开文件夹/工作区。默认为 false。`noRecentEntry`：打开的 URI 是否出现在"最近打开"列表中。默认为 false。注意，为了向后兼容，options 也可以是布尔类型，表示 `forceNewWindow` 设置。

`vscode.newWindow` - 根据 newWindow 参数打开新窗口。

* _options_ - （可选）选项。包含以下属性的对象：`reuseWindow`：是否在当前窗口打开而非新窗口。默认打开新窗口。

`vscode.removeFromRecentlyOpened` - 从最近打开列表中移除具有给定路径的条目。

* _path_ - 要从最近打开列表中移除的 URI 或 URI 字符串。

`moveActiveEditor` - 通过标签页或编辑器组移动活动编辑器

* _Active editor move argument_ - 参数属性：
  * 'to': 提供移动目标位置的字符串值。
  * 'by': 提供移动单位的字符串值（按标签页或按编辑器组）。
  * 'value': 提供移动多少个位置或绝对位置编号的数字值。

`copyActiveEditor` - 通过编辑器组复制活动编辑器

* _Active editor copy argument_ - 参数属性：
  * 'to': 提供复制目标位置的字符串值。
  * 'value': 提供复制多少个位置或绝对位置编号的数字值。

`vscode.getEditorLayout` - 获取编辑器布局

* _(返回值)_ - 编辑器布局对象，格式与 vscode.setEditorLayout 相同

`workbench.action.files.newUntitledFile` - 新建无标题文本文件

* _New Untitled Text File arguments_ - 编辑器视图类型或语言 ID（如果已知）

`workbench.extensions.installExtension` - 安装指定的扩展

* _extensionIdOrVSIXUri_ - 扩展 ID 或 VSIX 资源 URI
* _options_ - （可选）安装扩展的选项。包含以下属性的对象：`installOnlyNewlyAddedFromExtensionPackVSIX`：启用后，VS Code 仅安装扩展包 VSIX 中新增的扩展。此选项仅在安装 VSIX 时有效。

`workbench.extensions.uninstallExtension` - 卸载指定的扩展

* _Id of the extension to uninstall_ -

`workbench.extensions.search` - 搜索特定扩展

* _Query to use in search_ -

`workbench.action.tasks.runTask` - 运行任务

* _args_ - 筛选快速选择中显示的任务

`workbench.action.openIssueReporter` - 打开问题报告器，并可选择预填充部分表单。

* _options_ - 用于预填充问题报告器的数据。

`vscode.openIssueReporter` - 打开问题报告器，并可选择预填充部分表单。

* _options_ - 用于预填充问题报告器的数据。

`workbench.action.openLogFile` - workbench.action.openLogFile

* _logFile_ -

`workbench.action.openWalkthrough` - 打开演练指南。

* _walkthroughID_ - 要打开的演练指南 ID。
* _toSide_ - 在侧边的新编辑器组中打开演练指南。

## 简单命令

不需要参数的简单命令可以在默认 `keybindings.json` 文件的键盘快捷键列表中找到。未绑定的命令列在该文件底部的注释块中。

要查看默认的 `keybindings.json`，请从命令面板（`kb(workbench.action.showCommands)`）运行 **首选项：打开默认键盘快捷键 (JSON)**。
