---
title: 文件图标主题
description: 在 Visual Studio Code 中创建文件图标主题的指南
---

# 文件图标主题

Visual Studio Code 在整个 UI 中的文件名旁边显示图标，扩展可以贡献新的文件图标集供用户选择。

## 添加新的文件图标主题

你可以使用图标（最好是 SVG）和图标字体来创建自己的文件图标主题。例如，可以查看两个内置主题：[Minimal](https://github.com/microsoft/vscode/tree/main/extensions/theme-defaults) 和 [Seti](https://github.com/microsoft/vscode/tree/main/extensions/theme-seti)。

首先，创建一个 VS Code 扩展并添加 `iconTheme` 贡献点。

```json
{
  "contributes": {
    "iconThemes": [
      {
        "id": "turtles",
        "label": "Turtles",
        "path": "./fileicons/turtles-icon-theme.json"
      }
    ]
  }
}
```

`id` 是图标主题的标识符。它在设置中作为标识符使用，因此要保证唯一且可读。`label` 显示在文件图标主题选择器下拉菜单中。`path` 指向扩展中定义图标集的文件。如果你的图标集名称遵循 `*icon-theme.json` 命名方案，你将在 VS Code 中获得补全支持和悬停提示。

### 文件图标集文件

文件图标集文件是一个 JSON 文件，由文件图标关联和图标定义组成。

图标关联将文件类型（'file'、'folder'、'json-file' 等）映射到图标定义。图标定义定义了图标的位置：可以是图片文件，也可以是字体中的字形。

### 图标定义

`iconDefinitions` 部分包含所有定义。每个定义都有一个 ID，用于引用该定义。一个定义也可以被多个文件关联引用。

```json
{
  "iconDefinitions": {
    "_folder_dark": {
      "iconPath": "./images/Folder_16x_inverse.svg"
    }
  }
}
```

上面的图标定义包含一个标识符为 `_folder_dark` 的定义。

支持以下属性：

- `iconPath`：使用 svg/png 时：图片的路径。
- `fontCharacter`：使用字形字体时：字体中要使用的字符。
- `fontColor`：使用字形字体时：用于字形的颜色。
- `fontSize`：使用字体时：字体大小。默认使用字体规范中指定的大小。应该是相对于父字体大小的相对大小（例如 150%）。
- `fontId`：使用字体时：字体的 ID。如果未指定，将选取字体规范部分中指定的第一个字体。

### 文件关联

图标可以关联到文件夹、文件夹名称、文件、文件扩展名、文件名和[语言 ID](/vscode/extension/references/contribution-points#contributes.languages)。

此外，这些关联中的每一个都可以针对"light"和"highContrast"颜色主题进行细化。

每个文件关联指向一个图标定义。

```json
{
  "file": "_file_dark",
  "folder": "_folder_dark",
  "folderExpanded": "_folder_open_dark",
  "folderNames": {
    ".vscode": "_vscode_folder"
  },
  "fileExtensions": {
    "ini": "_ini_file"
  },
  "fileNames": {
    "win.ini": "_win_ini_file"
  },
  "languageIds": {
    "ini": "_ini_file"
  },
  "light": {
    "folderExpanded": "_folder_open_light",
    "folder": "_folder_light",
    "file": "_file_light",
    "fileExtensions": {
      "ini": "_ini_file_light"
    }
  },
  "highContrast": {}
}
```

- `file` 是默认文件图标，用于所有不匹配任何扩展名、文件名或语言 ID 的文件。当前，文件图标定义中的所有属性都会被继承（仅与字体字形相关，对 fontSize 有用）。
- `folder` 是折叠文件夹的图标，如果未设置 `folderExpanded`，也用于展开的文件夹。可以使用 `folderNames` 属性关联特定文件夹名称的图标。
  文件夹图标是可选的。如果未设置，文件夹将不显示图标。
- `folderExpanded` 是展开文件夹的图标。展开文件夹图标是可选的。如果未设置，将显示为 `folder` 定义的图标。
- `folderNames` 将文件夹名称关联到图标。集合的键是文件夹名称，可选地以单个父路径段为前缀（*）。不支持模式或通配符。文件夹名称匹配不区分大小写。
- `folderNamesExpanded` 将文件夹名称关联到展开文件夹的图标。集合的键是文件夹名称，可选地以单个父路径段为前缀（*）。不支持模式或通配符。文件夹名称匹配不区分大小写。
- `rootFolder` 是折叠的工作区根文件夹的图标，如果未设置 `rootFolderExpanded`，也用于展开的工作区根文件夹。如果未设置，工作区根文件夹将显示为 `folder` 定义的图标。
- `rootFolderExpanded` 是展开的工作区根文件夹的图标。如果未设置，展开的工作区根文件夹将显示为 `rootFolder` 定义的图标。
- `rootFolderNames` 将根文件夹名称关联到图标。集合的键是文件夹名称。不支持模式或通配符。根文件夹名称匹配不区分大小写。
- `rootFolderNamesExpanded` 将根文件夹名称关联到展开文件夹的图标。集合的键是文件夹名称。不支持模式或通配符。根文件夹名称匹配不区分大小写。
- `languageIds` 将语言关联到图标。集合中的键是[语言贡献点](/vscode/extension/references/contribution-points#contributes.languages)中定义的语言 ID。文件的语言根据语言贡献中定义的文件扩展名和文件名进行评估。注意：不考虑语言贡献中的"首行匹配"。
- `fileExtensions` 将文件扩展名关联到图标。集合中的键是文件扩展名。扩展名是点号后的文件名段（不包括点号）。具有多个点的文件名（如 `lib.d.ts`）可以匹配多个扩展名；'d.ts' 和 'ts'。可选地，文件扩展名可以以单个父路径段为前缀（*）。扩展名比较不区分大小写。
- `fileNames` 将文件名关联到图标。集合中的键是完整文件名，不包括任何路径段。可选地，文件扩展名可以以单个父路径段为前缀（*）。不支持模式或通配符。文件名匹配不区分大小写。'fileName' 匹配是最强匹配，关联到文件名的图标将优先于匹配的 fileExtension 图标和匹配的语言 ID 图标。

(*) 某些属性键（`folderNames`、`folderNamesExpanded`、`fileExtensions`、`fileNames`）可以以单个父路径段为前缀。只有当资源的直接父文件夹与父路径文件夹匹配时，才会使用该图标。这可以用来为特定文件夹（例如 `system`）中的资源赋予不同的外观：

```json
  "fileNames": {
    "system/win.ini": "_win_ini_file"
  },
```

`system/win.ini` 表示该关联匹配直接位于 `system` 文件夹中名为 `win.ini` 的文件

```json
  "fileExtensions": {
    "system/ini": "_ini_file"
  },
```

`system/ini` 表示该关联匹配直接位于 `system` 文件夹中名为 `*.ini` 的文件

文件扩展名匹配优先于语言匹配，但弱于文件名匹配。带有父路径段的匹配优先于不带父路径段的同类型匹配。

`文件名匹配（带父路径） > 文件名匹配 > 文件扩展名匹配（带父路径） > 文件扩展名匹配 > 语言匹配 ...`

`light` 和 `highContrast` 部分具有与上述相同的文件关联属性。它们允许为相应主题覆盖图标。

### 字体定义

`fonts` 部分允许你声明任意数量的要使用的字形字体。
之后你可以在图标定义中引用这些字体。如果图标定义未指定字体 ID，则第一个声明的字体将用作默认字体。

将字体文件复制到扩展中并相应地设置路径。
建议使用 [WOFF](https://developer.mozilla.org/docs/Web/Guide/WOFF) 字体。

- 将 'woff' 设置为格式。
- weight 属性值在[此处](https://developer.mozilla.org/docs/Web/CSS/font-weight#Values)定义。
- style 属性值在[此处](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-style#Values)定义。
- 大小应该是相对于使用图标的字体大小的相对值。因此，始终使用百分比。

```json
{
  "fonts": [
    {
      "id": "turtles-font",
      "src": [
        {
          "path": "./turtles.woff",
          "format": "woff"
        }
      ],
      "weight": "normal",
      "style": "normal",
      "size": "150%"
    }
  ],
  "iconDefinitions": {
    "_file": {
      "fontCharacter": "\\E002",
      "fontColor": "#5f8b3b",
      "fontId": "turtles-font"
    }
  }
}
```

### 文件图标主题中的文件夹图标

文件图标主题可以指示文件资源管理器在文件夹图标足以表示文件夹的展开状态时，不显示默认的文件夹图标（旋转三角形或"折叠箭头"）。通过在文件图标主题定义文件中设置 `"hidesExplorerArrows":true` 来启用此模式。

### 语言默认图标

语言贡献者可以为语言定义图标。

```jsonc
{
  "contributes": {
    "languages": [
      {
        "id": "latex",
        // ...
        "icon": {
          "light": "./icons/latex-light.png",
          "dark": "./icons/latex-dark.png"
        }
      }
    ]
  }
}
```

当文件图标主题仅有该语言的通用文件图标时，会使用此图标。

语言默认图标仅在以下条件下显示：
- 文件图标主题具有特定的文件图标。例如，`Minimal` 没有特定的文件图标，因此不使用语言默认图标
- 文件图标主题不包含给定语言、文件扩展名或文件名的图标。
- 文件图标主题未定义 `"showLanguageModeIcons":false`

当以下条件满足时，语言默认图标始终显示：
- 文件图标主题定义了 `"showLanguageModeIcons":true`
