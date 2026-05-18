---
title: Extension Host
description: Visual Studio Code 的 Extension Host 负责管理扩展，并确保 Visual Studio Code 的稳定性和性能。
---

# Extension Host

**Extension Host** 负责运行扩展。

## Extension Host 配置

根据 VS Code 的配置，会有多个 Extension Host 以不同的运行时、在不同的位置同时运行。

* local — 在本地运行的 Node.js Extension Host，与用户界面位于同一台机器上。
* web — 在浏览器中或本地运行的 Web Extension Host，与用户界面位于同一台机器上。
* remote — 在容器或远程位置远程运行的 Node.js Extension Host。

下表展示了在不同 VS Code 配置下可用的 Extension Host：

| 配置 | 本地 Extension Host | Web Extension Host | 远程 Extension Host |
--- | --- | --- | ---
| 桌面版 VS Code | ✔️ | ✔️ |  |
| [带远程功能的 VS Code](/docs/remote/remote-overview)（容器、SSH、WSL、GitHub Codespace、Tunnel） | ✔️ | ✔️ | ✔️ |
| 网页版 VS Code（vscode.dev、github.dev） |  | ✔️ |   |
| 使用 Codespaces 的网页版 VS Code |  | ✔️ | ✔️ |

### Extension Host 运行时

* Node.js — 扩展运行在 Node.js 运行时中。由本地和远程 Extension Host 使用。扩展需要一个 `main` 入口文件才能在其中运行。
* Browser — 扩展运行在 [Browser WebWorker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API) 运行时中。由 Web Extension Host 使用。扩展需要一个 `browser` 入口文件才能在其中运行。有关更多详情，请参阅 [Web 扩展指南](/vscode/extension/extension-guides/web-extensions)。

### 首选扩展位置

扩展加载到哪个 Extension Host 取决于以下因素：

* VS Code 配置所决定的可用 Extension Host。
* 扩展的能力：能否在 Node.js 和/或 Web 中运行，如果未指定，它提供了哪些贡献（contributions）？
* 扩展安装在哪里：本地机器、远程机器，还是两者都有。
* 扩展首选的运行位置：`extensionKind` 属性。

`extensionKind` 是[扩展清单](/vscode/extension/references/extension-manifest)中的一个属性。它允许扩展指定首选的运行位置。可以是拥有工作区（workspace）的机器，也可以是拥有用户界面（ui）的机器。如果扩展可以在两者上运行，可以指定优先顺序。

* `"extensionKind": ["workspace"]` — 表示扩展需要访问工作区内容，因此需要在工作区所在的位置运行。可以是本地机器、远程机器或 Codespace。大多数扩展属于这一类别。
* `"extensionKind": ["ui", "workspace"]` — 表示扩展**首选**作为 UI 扩展运行，但对本地资源、设备或能力没有硬性要求。使用 VS Code 时，如果扩展存在于本地，则将在 VS Code 的本地 Extension Host 中运行，这样用户就不必在远程安装该扩展。否则，如果扩展存在于远程工作区，则将在 VS Code 的工作区 Extension Host 中运行。使用 Codespaces 的网页版 VS Code 时，由于没有本地 Extension Host，扩展将始终在远程 Extension Host 中运行。
* `"extensionKind": ["workspace", "ui"]` — 表示扩展**首选**作为工作区扩展运行，但对访问工作区内容没有硬性要求。使用 VS Code 时，如果扩展存在于远程工作区，则将在 VS Code 的工作区 Extension Host 中运行，否则如果存在于本地，则将在 VS Code 的本地 Extension Host 中运行。使用 Codespaces 的网页版 VS Code 时，由于没有本地 Extension Host，扩展将始终在远程 Extension Host 中运行。
* `"extensionKind": ["ui"]` — 表示扩展**必须**在靠近 UI 的位置运行，因为需要访问本地资源、设备或能力，或者对低延迟有要求。在使用 Codespaces 的网页版 VS Code 的情况下，由于没有本地 Extension Host，此类扩展将无法加载，除非它同时也是一个 [Web 扩展](/vscode/extension/extension-guides/web-extensions)。此时它将在 Web Extension Host 中加载，但有一个限制：无法实例化 Web Worker。

**注意：** 早期版本的 VS Code（<1.40）允许扩展以字符串形式指定单个位置，但这已被弃用，现在推荐使用数组形式指定多个位置。

如果扩展可以同时在 Node.js 和浏览器中运行，在可用的情况下将选择 Node.js Extension Host。有一个例外：当配置为使用 Codespaces 的网页版 VS Code 且 `extensionKind` 设置为 `ui` 时，Web Extension Host 将优先于远程 Extension Host。

如果扩展仅支持 Web，它将始终在 Web Extension Host 上运行，无论 `extensionKind` 设置如何。在这种情况下，建议不定义 `extensionKind`。

## 稳定性和性能

VS Code 致力于为用户提供稳定且高性能的编辑器，行为不当的扩展不应影响用户体验。VS Code 的 Extension Host 可以防止扩展：

* 影响启动性能
* 拖慢 UI 操作
* 修改 UI

此外，VS Code 允许扩展声明其[激活事件（Activation Events）](/vscode/extension/references/activation-events)并以懒加载方式加载。例如，Markdown 扩展只应在用户打开 Markdown 文件时才加载。这确保了扩展不会消耗不必要的 CPU 和内存资源。
