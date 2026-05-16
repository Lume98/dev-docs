---
prev: false
next:
  text: Kotlin 模块总览
  link: /topics/kotlin/modules/
---

<script setup>
import { getTopicBySlug } from '../../.vitepress/site-data'

const topic = getTopicBySlug('kotlin')
</script>

# Kotlin 专题

<p class="portal-lead">{{ topic.description }}</p>

## 专题概览

<div class="topic-meta">
  <div class="meta-card">
    <strong>专题定位</strong>
    <p>{{ topic.summary }}</p>
  </div>
  <div class="meta-card">
    <strong>当前状态</strong>
    <p>{{ topic.status }}，当前共收录 {{ topic.modules.length }} 个学习模块。</p>
  </div>
  <div class="meta-card">
    <strong>推荐读法</strong>
    <p>先看模块总览明确学习顺序，再按模块逐一完成目标与练习，最后通过验收标准检查掌握程度。</p>
  </div>
</div>

## 你会学到什么

- Kotlin 适合准备进入 JVM、Android 或脚本化开发的读者，语法简洁，同时保留清晰的类型系统。
- 当前专题覆盖基础语法、类型系统、面向对象、集合与函数式、协程与工程实践五大模块。
- 如果你是第一次系统学习 Kotlin，按模块顺序推进会比零散查语法点更高效。

## 当前收录内容

<div class="lesson-grid">
  <a
    v-for="(module, index) in topic.modules"
    :key="module.slug"
    class="lesson-card"
    :href="module.link"
  >
    <div class="lesson-index">Module {{ String(index + 1).padStart(2, '0') }}</div>
    <strong>{{ module.title }}</strong>
    <p>{{ module.summary }}</p>
    <span class="card-link">进入 {{ module.title }}</span>
  </a>
</div>

## 阅读建议

<div class="portal-note">
  <p>第一次学习 Kotlin，建议先进入「模块总览」确认前置关系，再按照模块 1 到模块 5 顺序完成。</p>
  <p>如果你已经有部分基础，也可以直接从最需要补齐的模块开始查阅。</p>
</div>
