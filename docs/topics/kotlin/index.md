---
prev: false
next:
  text: Kotlin 7 天教程
  link: /topics/kotlin/7-days/
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
    <p>{{ topic.status }}，当前共收录 {{ topic.tracks.length }} 条学习路径。</p>
  </div>
  <div class="meta-card">
    <strong>推荐读法</strong>
    <p>先按学习路径完整走一遍，再回头按单日章节查缺补漏，会更容易建立整体理解。</p>
  </div>
</div>

## 你会学到什么

- Kotlin 适合准备进入 JVM、Android 或脚本化开发的读者，语法简洁，同时保留清晰的类型系统。
- 当前专题覆盖基础语法、空安全、类与扩展函数、集合操作、泛型、协程和一个可运行的小项目。
- 如果你是第一次系统学习 Kotlin，按路线顺序推进会比零散查语法点更高效。

## 当前收录内容

<div class="lesson-grid">
  <a
    v-for="(track, index) in topic.tracks"
    :key="track.slug"
    class="lesson-card"
    :href="track.link"
  >
    <div class="lesson-index">Track {{ String(index + 1).padStart(2, '0') }}</div>
    <strong>{{ track.title }}</strong>
    <p>{{ track.summary }}</p>
    <span class="card-link">进入 {{ track.title }}</span>
  </a>
</div>

## 阅读建议

<div class="portal-note">
  <p>第一次学习 Kotlin，建议先进入「Kotlin 7 天教程」按天完成。</p>
  <p>如果你已经有部分基础，也可以直接从最需要补齐的章节开始查阅。</p>
</div>
