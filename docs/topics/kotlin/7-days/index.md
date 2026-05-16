---
prev:
  text: Kotlin 专题
  link: /topics/kotlin/
next:
  text: Day1 基础语法
  link: /topics/kotlin/7-days/day-1
---

<script setup>
import { getTopicBySlug, getTrack } from '../../../.vitepress/site-data'

const topic = getTopicBySlug('kotlin')
const track = getTrack(topic, '7-days')
</script>

# Kotlin 7 天教程

<p class="portal-lead">{{ track.description }}</p>

## 适合人群

<div class="route-audience">
  <span
    v-for="audience in track.audience"
    :key="audience"
    class="audience-chip"
  >
    {{ audience }}
  </span>
</div>

## 学习说明

- 建议按 Day1 到 Day7 顺序推进，不要跳过前面的语法和集合基础。
- 每一节都包含今日目标、核心知识点、配套源码和练习任务。
- 这条路线追求连续性和可执行性，而不是追求一次覆盖 Kotlin 的所有高级主题。
- 当前路线周期为 {{ track.duration }}，归属于 {{ topic.title }} 专题。

## 课程目录

<div class="lesson-grid">
  <a
    v-for="lesson in track.lessons"
    :key="lesson.link"
    class="lesson-card"
    :href="lesson.link"
  >
    <div class="lesson-index">{{ lesson.text }}</div>
    <strong>{{ lesson.title }}</strong>
    <p>{{ lesson.summary }}</p>
  </a>
</div>

## 路线说明

<div class="portal-note">
  <p>建议每天先看今日目标，再跟着示例代码完成练习，最后回顾本节出现的新语法和常用写法。</p>
  <p>如果时间有限，可以先完成 Day1 到 Day4 建立基础，再继续 Day5 到 Day7 补齐进阶与实战。</p>
</div>
