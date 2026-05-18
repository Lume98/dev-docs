---
title: 语言配置指南
description: 为 Visual Studio Code 中的任何语言配置语言支持的指南。
---

# 语言配置指南

[`contributes.languages`](/vscode/extension/references/contribution-points#contributes.languages) 贡献点允许你定义控制以下声明式语言功能的语言配置：

- 注释切换
- 括号定义
- 自动闭合
- 自动环绕
- 折叠
- 单词模式
- 缩进规则

这里有一个[语言配置示例](https://github.com/microsoft/vscode-extension-samples/tree/main/language-configuration-sample)，为 JavaScript 文件配置了编辑体验。本指南解释 `language-configuration.json` 的内容：

**注意：如果你的语言配置文件名是或以 `language-configuration.json` 结尾，你将在 VS Code 中获得自动补全和验证。**

```json
{
  "comments": {
    "lineComment": "//",
    "blockComment": ["/*", "*/"]
  },
  "brackets": [["{", "}"], ["[", "]"], ["(", ")"]],
  "autoClosingPairs": [
    { "open": "{", "close": "}" },
    { "open": "[", "close": "]" },
    { "open": "(", "close": ")" },
    { "open": "'", "close": "'", "notIn": ["string", "comment"] },
    { "open": "\"", "close": "\"", "notIn": ["string"] },
    { "open": "`", "close": "`", "notIn": ["string", "comment"] },
    { "open": "/**", "close": " */", "notIn": ["string"] }
  ],
  "autoCloseBefore": ";:.,=}])>` \n\t",
  "surroundingPairs": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["'", "'"],
    ["\"", "\""],
    ["`", "`"]
  ],
  "folding": {
    "markers": {
      "start": "^\\s*//\\s*#?region\\b",
      "end": "^\\s*//\\s*#?endregion\\b"
    }
  },
  "wordPattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)",
  "indentationRules": {
    "increaseIndentPattern": "^((?!\\/\\/).)*(\\{[^}\"'`]*|\\([^)\"'`]*|\\[[^\\]\"'`]*)$",
    "decreaseIndentPattern": "^((?!.*?\\/\\*).*\\*/)?\\s*[\\)\\}\\]].*$"
  }
}
```

## 注释切换

VS Code 提供两个注释切换命令：**切换行注释**和**切换块注释**。你可以指定 `comments.blockComment` 和 `comments.lineComment` 来控制 VS Code 如何注释行/块。

```json
{
  "comments": {
    "lineComment": "//",
    "blockComment": ["/*", "*/"]
  }
}
```

`lineComment` 属性支持两种格式以保持向后兼容性：

- 字符串值用于简单的行注释定义。
- 对象值用于配置注释行的缩进行为。

```json
{
  "comments": {
    "lineComment": {
      "comment": "//",
      "noIndent": true
    },
    "blockComment": ["/*", "*/"]
  }
}
```

## 括号定义

当光标移到此处定义的括号时，VS Code 会高亮该括号及其匹配的对括号。

```json
{
  "brackets": [["{", "}"], ["[", "]"], ["(", ")"]]
}
```

此外，当你运行**转到括号**或**选择到括号**时，VS Code 将使用上述定义来查找最近的括号及其匹配对。

## 自动闭合

当你输入 `'` 时，VS Code 创建一对单引号并将光标放在中间：`'|'`。本节定义了此类配对。

```json
{
  "autoClosingPairs": [
    { "open": "{", "close": "}" },
    { "open": "[", "close": "]" },
    { "open": "(", "close": ")" },
    { "open": "'", "close": "'", "notIn": ["string", "comment"] },
    { "open": "\"", "close": "\"", "notIn": ["string"] },
    { "open": "`", "close": "`", "notIn": ["string", "comment"] },
    { "open": "/**", "close": " */", "notIn": ["string"] }
  ]
}
```

`notIn` 键在特定代码范围内禁用此功能。例如，当你编写以下代码时：

```js
// ES6's Template String
`ES6's Template String`;
```

单引号不会被自动闭合。

不需要 `notIn` 属性的配对也可以使用更简单的语法：
```json
{
  "autoClosingPairs": [ ["{", "}"], ["[", "]"] ]
}
```

用户可以通过 `editor.autoClosingQuotes` 和 `editor.autoClosingBrackets` 设置调整自动闭合行为。

### 自动闭合前置字符

默认情况下，VS Code 仅在光标后面是空白字符时才自动闭合配对。因此当你在以下 JSX 代码中输入 `{` 时，不会触发自动闭合：

```js
const Component = () =>
  <div className={>
                  ^ Does not get autoclosed by default
  </div>
```

但是，以下定义会覆盖该行为：

```json
{
  "autoCloseBefore": ";:.,=}])>` \n\t"
}
```

现在当你在 `>` 之前输入 `{` 时，VS Code 会用 `}` 自动闭合它。

## 自动环绕

当你在 VS Code 中选择一个范围并输入左括号时，VS Code 会用一对括号环绕所选内容。此功能称为自动环绕，你可以在此定义特定语言的自动环绕配对：

```json
{
  "surroundingPairs": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["'", "'"],
    ["\"", "\""],
    ["`", "`"]
  ]
}
```

用户可以通过 `editor.autoSurround` 设置调整自动环绕行为。

## 折叠

在 VS Code 中，折叠可以基于缩进定义，也可以通过贡献的折叠范围提供者来定义：

- 基于缩进的折叠（带标记）：如果给定语言没有可用的折叠范围提供者，或者用户将 `editor.foldingStrategy` 设置为 `indentation`，则使用基于缩进的折叠。当一行的缩进小于一行或多行后续行时，折叠区域开始；当出现缩进相同或更小的行时，折叠区域结束。空行被忽略。
此外，语言配置可以定义开始和结束标记。这些标记在 `folding.markers` 中定义为 `start` 和 `end` 正则表达式。当找到匹配的行时，会在配对之间创建折叠范围。折叠标记必须非空，通常类似于 `//#region` 和 `//#endregion`。

以下 JSON 为 `//#region` 和 `//#endregion` 创建折叠标记。

```json
{
  "folding": {
    "markers": {
      "start": "^\\s*//\\s*#?region\\b",
      "end": "^\\s*//\\s*#?endregion\\b"
    }
  }
}
```

- Language Server 折叠：Language Server 响应 [`textDocument/foldingRange`](https://microsoft.github.io/language-server-protocol/specification#textDocument_foldingRange) 请求，返回折叠范围列表，VS Code 会将这些范围渲染为折叠标记。在[编程式语言功能](/vscode/extension/language-extensions/programmatic-language-features)主题中了解更多关于 Language Server Protocol 中折叠支持的信息。

## 单词模式

`wordPattern` 定义了编程语言中什么被视为一个单词。如果设置了 `wordPattern`，代码建议功能将使用此设置来确定单词边界。请注意，此设置不会影响与单词相关的编辑器命令，这些命令由编辑器设置 `editor.wordSeparators` 控制。

```json
{
  "wordPattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)"
}
```

## 缩进规则

`indentationRules` 定义了编辑器在输入、粘贴和移动行时应如何调整当前行或下一行的缩进。

```json
{
  "indentationRules": {
    "increaseIndentPattern": "^((?!\\/\\/).)*(\\{[^}\"'`]*|\\([^)\"'`]*|\\[[^\\]\"'`]*)$",
    "decreaseIndentPattern": "^((?!.*?\\/\\*).*\\*/)?\\s*[\\)\\}\\]].*$"
  }
}
```

例如，`if (true) {` 匹配 `increaseIndentPattern`，那么如果你在左括号 `{` 后按 `kbstyle(Enter)`，编辑器将自动缩进一次，你的代码将变成：

```javascript
if (true) {
  console.log();
```

除了 `increaseIndentPattern` 和 `decreaseIndentPattern`，还有两个额外的缩进规则：

- `indentNextLinePattern` - 如果一行匹配此模式，则**只有其下一行**应该缩进一次。
- `unIndentedLinePattern` - 如果一行匹配此模式，则其缩进不应被更改，也不应根据其他规则进行评估。

如果编程语言没有设置缩进规则，编辑器会在行以左括号结尾时缩进，在你输入右括号时减少缩进。此处的括号由 `brackets` 定义。

注意，`editor.formatOnPaste` 设置由 [`DocumentRangeFormattingEditProvider`](/vscode/extension/references/vscode-api#DocumentRangeFormattingEditProvider) 控制，不受自动缩进影响。

## 回车规则

`onEnterRules` 定义了一组规则，当在编辑器中按下 `kbstyle(Enter)` 时会进行评估。

```json
{
  "onEnterRules": [{
    "beforeText": "^\\s*(?:def|class|for|if|elif|else|while|try|with|finally|except|async).*?:\\s*$",
    "action": { "indent": "indent" }
  }]
}
```

当按下 `kbstyle(Enter)` 时，会根据以下属性检查光标前、后或上一行的文本：

- `beforeText`（必填）。一个正则表达式，匹配光标前的文本（限于当前行）。
- `afterText`。一个正则表达式，匹配光标后的文本（限于当前行）。
- `previousLineText`。一个正则表达式，匹配光标上方一行的文本。

如果所有指定的属性都匹配，则认为该规则匹配，不再评估后续的 `onEnterRules`。`onEnterRule` 可以指定以下操作：

- `indent`（必填）。取值为 `none, indent, outdent, indentOutdent` 之一。
  - `none` 表示新行将继承当前行的缩进。
  - `indent` 表示新行将相对于当前行缩进。
  - `outdent` 表示新行将相对于当前行减少缩进。
  - `indentOutdent` 表示将插入两个新行，一个缩进，第二个减少缩进。
- `appendText`。一个字符串，将追加到新行之后、缩进之后。
- `removeText`。要从新行缩进中移除的字符数。
