---
layout: home

hero:
  name: dev-docs
  text: 开发者文档
  tagline: Kotlin 模块化学习体系与 VS Code 扩展开发完整指南，涵盖语法基础到扩展 API 参考。
  actions:
    - theme: brand
      text: 查看 Kotlin 专题
      link: /topics/kotlin/
    - theme: alt
      text: VS Code 扩展开发
      link: /vscode/extension/
---

<script setup>
import { topics } from './.vitepress/site-data'

const kotlinTopic = topics.find((topic) => topic.slug === 'kotlin')
</script>

## 已上线专题

<p class="portal-lead">
  Kotlin 模块化学习体系，按顺序掌握语法、类型系统、面向对象、集合函数式与协程工程实践。
</p>

<div class="portal-grid">
  <a
    v-for="topic in topics"
    :key="topic.slug"
    class="portal-card"
    :href="topic.link"
  >
    <div class="card-kicker">Topic</div>
    <div class="card-title-row">
      <span class="topic-badge">{{ topic.badge }}</span>
      <strong>{{ topic.title }}</strong>
    </div>
    <p>{{ topic.summary }}</p>
    <ul class="card-list">
      <li v-for="highlight in topic.highlights" :key="highlight">{{ highlight }}</li>
    </ul>
    <span class="card-link">进入 {{ topic.title }} 专题</span>
  </a>
</div>

## VS Code 扩展开发

<p class="portal-lead">
  从零开始学习 VS Code 扩展开发，涵盖入门指南、扩展能力、AI 集成、语言扩展、调试发布等完整内容。
</p>

<div class="portal-grid">
  <a class="portal-card" href="/vscode/extension/">
    <div class="card-kicker">Docs</div>
    <div class="card-title-row">
      <span class="topic-badge">VSCE</span>
      <strong>VS Code Extension API</strong>
    </div>
    <p>完整的 VS Code 扩展开发文档，包含 8 大章节 70+ 篇文档。</p>
    <ul class="card-list">
      <li>入门指南与扩展结构解析</li>
      <li>命令、主题、Webview 等扩展能力</li>
      <li>AI、MCP、Language Model 前沿集成</li>
      <li>语言服务器、调试器、测试与发布</li>
    </ul>
    <span class="card-link">进入 VS Code 扩展文档</span>
  </a>
</div>

## 从这里开始

<div class="portal-note" v-if="kotlinTopic">
  <p>建议从模块总览进入，按模块 1 到模块 5 的顺序推进。每个模块都包含学习目标、示例代码、常见误区与验收标准。</p>
</div>

<div class="lesson-grid" v-if="kotlinTopic">
  <a
    v-for="(module, index) in kotlinTopic.modules"
    :key="module.slug"
    class="lesson-card"
    :href="module.link"
  >
    <div class="lesson-index">Module {{ String(index + 1).padStart(2, '0') }}</div>
    <strong>{{ module.title }}</strong>
    <p>{{ module.summary }}</p>
    <span class="card-link">进入模块</span>
  </a>
</div>
