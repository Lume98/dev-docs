---
title: 总结与展望
description: 完成入门部分学习后的下一步建议
---

# 总结与展望

在 [你的第一个扩展](/vscode/extension/get-started/your-first-extension) 一节中，你学会了如何创建、运行和调试扩展。在 [扩展剖析](/vscode/extension/get-started/extension-anatomy) 一节中，你学习了 Visual Studio Code 扩展开发的基本概念。然而，这些只是冰山一角，以下是一些帮助你进一步提升 VS Code 扩展开发技能的建议方向。

## 扩展能力

在本节中，我们将 [VS Code API](/vscode/extension/references/vscode-api) 和 [Contribution Point](/vscode/extension/references/contribution-points) 分为几个类别，每个类别都简要说明了你的扩展可以实现哪些功能。你可以通过查阅 [VS Code API](/vscode/extension/references/vscode-api) 来验证你的扩展想法是否可行，或者阅读 [扩展能力](/vscode/extension/extension-capabilities/overview) 章节来获取新的扩展创意。

## 指南与示例

我们收集了大量示例扩展供你参考借鉴，其中一些还附有详细解释源代码的指南。你可以在 [扩展指南列表](/vscode/extension/extension-guides/overview) 或 [vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples) 仓库中找到所有示例和指南。

## UX 指南

为了让你的扩展完美融入 VS Code 用户界面，请参考 [UX 指南](/vscode/extension/ux-guidelines/overview)，其中介绍了创建扩展 UI 的最佳实践以及遵循 VS Code 首选工作流的约定。

## 问题报告

VS Code 用户可以通过 **Help: Report Issue...** 命令 (`workbench.action.openIssueReporter`) 报告问题，或者在 Quick Open (`workbench.action.quickOpen`) 中输入 `issue  ` 然后选择一个已安装的扩展。这为用户报告核心产品或已安装扩展的问题提供了一致的体验。

作为扩展作者，你可以将扩展集成到 **Help: Report Issue...** 问题报告流程中，而不是单独提供一个问题报告命令。这种集成还允许你在用户报告问题时附加额外的信息。

要集成到问题报告流程中，你需要注册一个自定义命令和一个 `issue/reporter` 菜单 Contribution Point。这个自定义命令将调用 `openIssueReporter`。

以下是在 `package.json` 的 `contributes` 中注册命令和菜单的示例（关于添加菜单 Contribution 和命令，请参阅 [Contribution Point](/vscode/extension/references/contribution-points)）：

``` json
"commands": [
    {
        "command": "extension.myCommand",
        "title": "Report Issue"
    }
],
    "menus": {
        "issue/reporter": [
            {
                "command": "extension.myCommand"
            }
        ]
    }

```

我们建议之前在命令面板中注册了 `workbench.action.openIssueReporter` 命令的扩展开始使用这种新的问题报告流程。

## 测试与发布

本节包含帮助你开发高质量 VS Code 扩展的主题。例如，你可以学习

- 如何为扩展添加[集成测试](/vscode/extension/working-with-extensions/testing-extension)
- 如何将扩展[发布](/vscode/extension/working-with-extensions/publishing-extension)到 VS Code [Marketplace](https://marketplace.visualstudio.com/)
- 如何为扩展设置[持续集成](/vscode/extension/working-with-extensions/continuous-integration)
