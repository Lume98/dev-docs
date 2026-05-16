---
prev:
  text: Kotlin 专题
  link: /topics/kotlin/
next:
  text: 模块 1：基础语法
  link: /topics/kotlin/modules/basics-syntax
---

<script setup>
import { getTopicBySlug } from '../../../.vitepress/site-data'

const topic = getTopicBySlug('kotlin')
</script>

# Kotlin 模块总览

按模块顺序完成学习：先建立语法与类型系统，再进入面向对象与函数式处理，最后用协程与工程实践收口。

## 学习顺序与前置关系

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
    <span class="card-link">查看模块详情</span>
  </a>
</div>

## 预期产出

- 能编写结构清晰的 Kotlin 基础程序并处理常见类型问题。
- 能以对象建模和集合函数式方式组织业务逻辑。
- 能在小型项目中应用协程并完成基础工程化组织。
