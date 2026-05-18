---
title: 遥测扩展作者指南
description: 了解 Visual Studio Code 扩展如何启用遥测并尊重用户的遥测选择。
---

# 遥测扩展作者指南

Visual Studio Code 会收集使用数据并将其发送给 Microsoft，以帮助改进我们的产品和服务。请阅读我们的[隐私声明](https://go.microsoft.com/fwlink/?LinkID=528096&clcid=0x409)和[遥测文档](/docs/getstarted/telemetry)以了解更多信息。

本主题为扩展作者提供了指南，使他们的扩展能够符合 VS Code 的遥测要求和最佳实践。

>**注意**：如果你不希望将使用数据发送给 Microsoft，可以将 `telemetry.telemetryLevel` 用户[设置](/docs/configure/settings)为 `off`。

## 遥测模块

VS Code 团队维护了 [@vscode/extension-telemetry](https://www.npmjs.com/package/@vscode/extension-telemetry) npm 模块，它提供了一种一致且安全的方式来在 VS Code 中收集遥测数据。该模块将遥测数据报告给 [Azure Monitor 和 Application Insights](https://azure.microsoft.com/services/monitor/)，并保证与先前版本的 VS Code 向后兼容。

请按照本指南设置 [Azure Monitor](https://learn.microsoft.com/azure/azure-monitor/app/nodejs) 并获取你的 Application Insights 检测密钥。

## 不使用遥测模块

不希望使用 Application Insights 的扩展作者可以利用自己的自定义方案来发送遥测数据。在这种情况下，扩展作者仍需通过使用 `isTelemetryEnabled` 和 `onDidChangeTelemetryEnabled` API 来尊重用户的选择。这样，用户就能在一个集中的位置控制其遥测设置。

## 自定义遥测设置

扩展可能希望为用户提供独立于 VS Code 遥测的扩展特定遥测控制。在这种情况下，我们建议你引入一个特定的扩展设置。建议自定义遥测设置标记 `telemetry` 和 `usesOnlineServices` 标签，以便用户能在设置 UI 中更方便地查询。添加自定义遥测设置并不意味着可以不尊重用户的决定，`isTelemetryEnabled` 和 `onDidChangeTelemetryEnabled` 标志必须始终被遵守。如果 `isTelemetryEnabled` 报告为 false，即使你的设置已启用，也不能发送遥测数据。

## telemetry.json

我们理解遥测对许多用户来说是一个敏感话题，我们致力于尽可能透明。VS Code 核心产品和大多数第一方扩展在其根目录中都附带一个 `telemetry.json` 文件。这使得用户可以使用带有 `--telemetry` 标志的 VS Code CLI 来获取 VS Code 生成的所有遥测数据的转储。扩展作者可以在其根目录中包含一个 `telemetry.json` 文件，该文件也会出现在 CLI 转储中。

## 宜与忌

✔️ 宜

* 如果 Application Insights 适合你，请使用 [@vscode/extension-telemetry](https://www.npmjs.com/package/@vscode/extension-telemetry) npm 模块。
* 否则，请遵守 `isTelemetryEnabled` 和 `onDidChangeTelemetryEnabled` API。
* 如果你拥有自定义遥测设置，请为其标记 `telemetry` 和 `usesOnlineServices` 标签。
* 尽可能少地收集遥测数据。
* 对用户尽可能透明地说明你收集了什么。

❌ 忌

* 引入不征求用户同意的自定义遥测收集方案。
* 收集个人身份信息（PII）。
* 收集超出必要范围的遥测数据。
* 仅使用 `telemetry.telemetryLevel` 设置，因为它与 `isTelemetryEnabled` 相比有时可能不准确。
