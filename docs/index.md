---
layout: home

hero:
  name: dev-docs
  text: Kotlin 学习文档
  tagline: 当前已上线 Kotlin 5 模块学习体系，适合按顺序完成语法、类型系统、面向对象、集合函数式与协程工程实践。
  actions:
    - theme: brand
      text: 查看 Kotlin 专题
      link: /topics/kotlin/
    - theme: alt
      text: 进入模块总览
      link: /topics/kotlin/modules/
---

<script setup>
import { topics } from './.vitepress/site-data'

const kotlinTopic = topics.find((topic) => topic.slug === 'kotlin')
</script>

## 已上线专题

<p class="portal-lead">
  现在可以直接查看 Kotlin 专题概览，先了解模块学习目标，再进入具体模块完成练习与验收。
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
