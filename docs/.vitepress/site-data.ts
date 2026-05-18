import type { DefaultTheme } from 'vitepress'

export type Module = {
  slug: string
  text: string
  title: string
  summary: string
  description: string
  link: string
  objectives: string[]
  highlights: string[]
  outcomes: string[]
  prerequisites?: string[]
}

export type Topic = {
  slug: string
  title: string
  badge: string
  status: string
  summary: string
  description: string
  link: string
  highlights: string[]
  modules: Module[]
}

const kotlinModules: Module[] = [
  {
    slug: 'basics-syntax',
    text: '模块 1 基础语法',
    title: '模块 1：基础语法',
    summary: '掌握 Kotlin 的变量、流程控制、函数与字符串模板。',
    description: '从开发环境、变量声明、条件与循环、函数定义到常见语法糖，建立 Kotlin 编码基本功。',
    link: '/topics/kotlin/modules/basics-syntax',
    objectives: ['能独立编写基础 Kotlin 程序', '理解 val/var 与函数声明习惯', '能读懂并改写常见控制流代码'],
    highlights: ['变量与类型推断', '条件与循环控制', '函数、默认参数与命名参数'],
    outcomes: ['完成一个命令行输入输出小程序', '通过 10 道语法与流程控制练习']
  },
  {
    slug: 'type-system',
    text: '模块 2 类型系统',
    title: '模块 2：类型系统',
    summary: '系统掌握空安全、类型转换、泛型基础与类型约束。',
    description: '围绕 Kotlin 类型系统核心能力展开，重点理解可空类型、智能类型转换、泛型与常见陷阱。',
    link: '/topics/kotlin/modules/type-system',
    objectives: ['避免常见 NPE 问题', '掌握类型转换与判空策略', '具备基础泛型抽象能力'],
    highlights: ['可空类型与 Elvis 操作符', '智能类型转换与 is/when', '泛型与上界约束'],
    outcomes: ['实现一组空安全工具函数', '完成 1 次类型系统代码审查']
  },
  {
    slug: 'oop',
    text: '模块 3 面向对象',
    title: '模块 3：面向对象',
    summary: '掌握类、继承、接口、数据类、密封类与扩展函数。',
    description: '建立 Kotlin 面向对象建模能力，理解继承体系、组合优先和表达业务状态的常用写法。',
    link: '/topics/kotlin/modules/oop',
    objectives: ['能够进行领域对象建模', '掌握 interface/abstract/sealed 的适用场景', '理解扩展函数的边界'],
    highlights: ['类与构造函数', '数据类与密封类', '接口实现与扩展函数'],
    outcomes: ['完成一个订单领域模型', '实现状态机式业务分支处理']
  },
  {
    slug: 'collections-functional',
    text: '模块 4 集合与函数式',
    title: '模块 4：集合与函数式',
    summary: '高效使用集合操作与高阶函数完成数据处理。',
    description: '学习 map/filter/groupBy 等集合管道与高阶函数，形成可读、可维护的数据转换风格。',
    link: '/topics/kotlin/modules/collections-functional',
    objectives: ['熟练编写集合转换链路', '掌握常用高阶函数表达方式', '优化数据处理可读性与性能'],
    highlights: ['map/filter/flatMap', 'groupBy 与聚合统计', '序列 Sequence 的惰性计算'],
    outcomes: ['完成一份日志聚合分析脚本', '将命令式代码重构为函数式风格']
  },
  {
    slug: 'coroutines-engineering',
    text: '模块 5 协程与工程实践',
    title: '模块 5：协程与工程实践',
    summary: '掌握协程并发、结构化并发与项目组织实践。',
    description: '从协程基础到工程化组织，覆盖作用域、调度器、错误处理、测试与模块化结构设计。',
    link: '/topics/kotlin/modules/coroutines-engineering',
    objectives: ['理解结构化并发的核心原则', '能在项目中安全落地协程', '具备基础工程组织能力'],
    highlights: ['CoroutineScope 与 dispatcher', '取消、超时与异常处理', '分层架构与可测试性实践'],
    outcomes: ['实现一个并发任务编排示例', '完成 Kotlin 入门结项小项目']
  }
]

export const topics: Topic[] = [
  {
    slug: 'kotlin',
    title: 'Kotlin',
    badge: 'KT',
    status: '已上线专题',
    summary: '覆盖语法、类型系统、面向对象、集合函数式与协程工程实践的 Kotlin 模块化专题。',
    description: '面向想系统入门 Kotlin 的开发者，按 5 个模块循序推进，每个模块都包含目标、示例、练习与验收标准。',
    link: '/topics/kotlin/',
    highlights: [
      '5 模块学习体系，顺序明确，逐步递进',
      '每个模块均提供学习目标、核心概念、代码示例与练习验收',
      '覆盖从语言基础到协程与工程实践的完整入门链路'
    ],
    modules: kotlinModules
  }
]

export const siteTitle = 'dev-docs'
export const siteDescription = 'Kotlin 模块化学习专题与 VS Code 扩展开发文档，帮助你掌握 Kotlin 语法与 VS Code 扩展 API。'

export const nav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  { text: '技术专题', link: topics[0].link },
  { text: '模块目录', link: '/topics/kotlin/modules/' },
  { text: 'VS Code 扩展', link: '/vscode/extension/' }
]

// ---- VS Code Extension API Docs ----

export type ApiPage = {
  title: string
  link: string
}

export type ApiSection = {
  name: string
  pages: ApiPage[]
  children?: ApiSection[]
}

const prefix = '/vscode/extension'

export const apiSections: ApiSection[] = [
  {
    name: 'Get Started',
    pages: [
      { title: 'Your First Extension', link: `${prefix}/get-started/your-first-extension` },
      { title: 'Extension Anatomy', link: `${prefix}/get-started/extension-anatomy` },
      { title: 'Wrapping Up', link: `${prefix}/get-started/wrapping-up` }
    ]
  },
  {
    name: 'Extension Capabilities',
    pages: [
      { title: 'Overview', link: `${prefix}/extension-capabilities/overview` },
      { title: 'Common Capabilities', link: `${prefix}/extension-capabilities/common-capabilities` },
      { title: 'Theming', link: `${prefix}/extension-capabilities/theming` },
      { title: 'Extending Workbench', link: `${prefix}/extension-capabilities/extending-workbench` }
    ]
  },
  {
    name: 'Extension Guides',
    pages: [
      { title: 'Overview', link: `${prefix}/extension-guides/overview` },
      { title: 'Command', link: `${prefix}/extension-guides/command` },
      { title: 'Color Theme', link: `${prefix}/extension-guides/color-theme` },
      { title: 'File Icon Theme', link: `${prefix}/extension-guides/file-icon-theme` },
      { title: 'Product Icon Theme', link: `${prefix}/extension-guides/product-icon-theme` },
      { title: 'Tree View', link: `${prefix}/extension-guides/tree-view` },
      { title: 'Webview', link: `${prefix}/extension-guides/webview` },
      { title: 'Notebook', link: `${prefix}/extension-guides/notebook` },
      { title: 'Custom Editors', link: `${prefix}/extension-guides/custom-editors` },
      { title: 'Virtual Documents', link: `${prefix}/extension-guides/virtual-documents` },
      { title: 'Virtual Workspaces', link: `${prefix}/extension-guides/virtual-workspaces` },
      { title: 'Web Extensions', link: `${prefix}/extension-guides/web-extensions` },
      { title: 'Workspace Trust', link: `${prefix}/extension-guides/workspace-trust` },
      { title: 'Task Provider', link: `${prefix}/extension-guides/task-provider` },
      { title: 'Source Control', link: `${prefix}/extension-guides/scm-provider` },
      { title: 'Debugger Extension', link: `${prefix}/extension-guides/debugger-extension` },
      { title: 'Markdown Extension', link: `${prefix}/extension-guides/markdown-extension` },
      { title: 'Test Extension', link: `${prefix}/extension-guides/testing` },
      { title: 'Custom Data Extension', link: `${prefix}/extension-guides/custom-data-extension` },
      { title: 'Telemetry', link: `${prefix}/extension-guides/telemetry` }
    ],
    children: [
      {
        name: 'AI',
        pages: [
          { title: 'AI Extensibility', link: `${prefix}/extension-guides/ai/ai-extensibility-overview` },
          { title: 'Language Model Tool', link: `${prefix}/extension-guides/ai/tools` },
          { title: 'MCP Dev Guide', link: `${prefix}/extension-guides/ai/mcp` },
          { title: 'Chat Participant', link: `${prefix}/extension-guides/ai/chat` },
          { title: 'Chat Tutorial', link: `${prefix}/extension-guides/ai/chat-tutorial` },
          { title: 'Language Model', link: `${prefix}/extension-guides/ai/language-model` },
          { title: 'Language Model Tutorial', link: `${prefix}/extension-guides/ai/language-model-tutorial` },
          { title: 'Language Model Chat Provider', link: `${prefix}/extension-guides/ai/language-model-chat-provider` },
          { title: 'Prompt TSX', link: `${prefix}/extension-guides/ai/prompt-tsx` }
        ]
      }
    ]
  },
  {
    name: 'UX Guidelines',
    pages: [
      { title: 'Overview', link: `${prefix}/ux-guidelines/overview` },
      { title: 'Activity Bar', link: `${prefix}/ux-guidelines/activity-bar` },
      { title: 'Sidebars', link: `${prefix}/ux-guidelines/sidebars` },
      { title: 'Panel', link: `${prefix}/ux-guidelines/panel` },
      { title: 'Status Bar', link: `${prefix}/ux-guidelines/status-bar` },
      { title: 'Views', link: `${prefix}/ux-guidelines/views` },
      { title: 'Editor Actions', link: `${prefix}/ux-guidelines/editor-actions` },
      { title: 'Quick Picks', link: `${prefix}/ux-guidelines/quick-picks` },
      { title: 'Command Palette', link: `${prefix}/ux-guidelines/command-palette` },
      { title: 'Notifications', link: `${prefix}/ux-guidelines/notifications` },
      { title: 'Webviews', link: `${prefix}/ux-guidelines/webviews` },
      { title: 'Context Menus', link: `${prefix}/ux-guidelines/context-menus` },
      { title: 'Walkthroughs', link: `${prefix}/ux-guidelines/walkthroughs` },
      { title: 'Settings', link: `${prefix}/ux-guidelines/settings` }
    ]
  },
  {
    name: 'Language Extensions',
    pages: [
      { title: 'Overview', link: `${prefix}/language-extensions/overview` },
      { title: 'Syntax Highlight Guide', link: `${prefix}/language-extensions/syntax-highlight-guide` },
      { title: 'Semantic Highlight Guide', link: `${prefix}/language-extensions/semantic-highlight-guide` },
      { title: 'Snippet Guide', link: `${prefix}/language-extensions/snippet-guide` },
      { title: 'Language Configuration Guide', link: `${prefix}/language-extensions/language-configuration-guide` },
      { title: 'Programmatic Language Features', link: `${prefix}/language-extensions/programmatic-language-features` },
      { title: 'Language Server Extension Guide', link: `${prefix}/language-extensions/language-server-extension-guide` },
      { title: 'Embedded Languages', link: `${prefix}/language-extensions/embedded-languages` }
    ]
  },
  {
    name: 'Testing and Publishing',
    pages: [
      { title: 'Testing Extensions', link: `${prefix}/working-with-extensions/testing-extension` },
      { title: 'Publishing Extensions', link: `${prefix}/working-with-extensions/publishing-extension` },
      { title: 'Bundling Extensions', link: `${prefix}/working-with-extensions/bundling-extension` },
      { title: 'Continuous Integration', link: `${prefix}/working-with-extensions/continuous-integration` }
    ]
  },
  {
    name: 'Advanced Topics',
    pages: [
      { title: 'Extension Host', link: `${prefix}/advanced-topics/extension-host` },
      { title: 'Remote Development and Codespaces', link: `${prefix}/advanced-topics/remote-extensions` },
      { title: 'Using Proposed API', link: `${prefix}/advanced-topics/using-proposed-api` },
      { title: 'Migrate from TSLint to ESLint', link: `${prefix}/advanced-topics/tslint-eslint-migration` },
      { title: 'Python Extension Template', link: `${prefix}/advanced-topics/python-extension-template` }
    ]
  },
  {
    name: 'References',
    pages: [
      { title: 'VS Code API', link: `${prefix}/references/vscode-api` },
      { title: 'Contribution Points', link: `${prefix}/references/contribution-points` },
      { title: 'Activation Events', link: `${prefix}/references/activation-events` },
      { title: 'Extension Manifest', link: `${prefix}/references/extension-manifest` },
      { title: 'Built-In Commands', link: `${prefix}/references/commands` },
      { title: 'When Clause Contexts', link: `${prefix}/references/when-clause-contexts` },
      { title: 'Theme Color', link: `${prefix}/references/theme-color` },
      { title: 'Product Icon Reference', link: `${prefix}/references/icons-in-labels` },
      { title: 'Document Selector', link: `${prefix}/references/document-selector` }
    ]
  }
]

function buildApiSidebar(): DefaultTheme.SidebarItem[] {
  const result: DefaultTheme.SidebarItem[] = [
    { text: 'VS Code Extension API', link: `${prefix}/` }
  ]

  for (const section of apiSections) {
    const items: DefaultTheme.SidebarItem[] = [
      ...section.pages.map((page) => ({
        text: page.title,
        link: page.link
      })),
      ...(section.children?.map((child) => ({
        text: child.name,
        items: child.pages.map((page) => ({
          text: page.title,
          link: page.link
        }))
      })) ?? [])
    ]
    result.push({ text: section.name, items })
  }

  return result
}

function buildTopicSidebar(topic: Topic): DefaultTheme.SidebarItem[] {
  return [
    {
      text: `${topic.title} 专题`,
      items: [
        { text: '专题首页', link: topic.link },
        { text: '模块总览', link: '/topics/kotlin/modules/' }
      ]
    },
    {
      text: '模块目录',
      items: topic.modules.map((module) => ({
        text: module.text,
        link: module.link
      }))
    }
  ]
}

const sidebarEntries: Array<[string, DefaultTheme.SidebarItem[]]> = [
  ...topics.flatMap((topic) => [
    [`/topics/${topic.slug}/`, buildTopicSidebar(topic)],
    [`/topics/${topic.slug}/modules/`, buildTopicSidebar(topic)]
  ]),
  ['/vscode/extension/', buildApiSidebar()]
]

export const sidebar: DefaultTheme.Sidebar = Object.fromEntries(sidebarEntries)

export function getTopicBySlug(slug: string): Topic {
  const topic = topics.find((item) => item.slug === slug)

  if (!topic) {
    throw new Error(`Unknown topic slug: ${slug}`)
  }

  return topic
}

export function getModule(topic: Topic, moduleSlug: string): Module {
  const module = topic.modules.find((item) => item.slug === moduleSlug)

  if (!module) {
    throw new Error(`Unknown module slug: ${moduleSlug}`)
  }

  return module
}
