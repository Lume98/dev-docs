---
layout: home

hero:
  name: dev-docs
  text: Kotlin 学习文档
  tagline: 当前已上线 Kotlin 专题与 7 天入门路径，适合按顺序完成语法、空安全、集合、协程和综合实战。
  actions:
    - theme: brand
      text: 查看当前专题
      link: /topics/kotlin/
    - theme: alt
      text: 从 7 天教程开始
      link: /topics/kotlin/7-days/
---

<script setup>
import { learningPaths, topics } from './.vitepress/site-data'
</script>

## 已上线专题

<p class="portal-lead">
  现在可以直接查看 Kotlin 专题概览，先了解会学什么，再进入具体学习路径。
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

<div class="portal-note">
  <p>如果你想系统入门 Kotlin，建议先完成 7 天教程。每天都有明确目标、示例代码和练习，适合按顺序推进。</p>
</div>

<div class="lesson-grid">
  <a
    v-for="(path, index) in learningPaths"
    :key="path.slug"
    class="lesson-card"
    :href="path.link"
  >
    <div class="lesson-index">Path {{ String(index + 1).padStart(2, '0') }}</div>
    <strong>{{ path.title }}</strong>
    <p>{{ path.summary }}</p>
    <span class="card-link">查看路径目录</span>
  </a>
</div>
