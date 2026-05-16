---
prev:
  text: Day5 OOP 与泛型
  link: /topics/kotlin/7-days/day-5
next:
  text: Day7 综合实战
  link: /topics/kotlin/7-days/day-7
---

# Day6：协程与并发基础

## 今日目标
- 理解协程的作用
- 会写 `launch` 和 `async`

## 核心知识点
- 协程与线程区别
- `runBlocking`、`launch`、`async/await`
- `Dispatchers.IO` 和 `Dispatchers.Default`
- 超时控制：`withTimeoutOrNull`

## 学习建议
- 协程的重点是“更便宜地组织并发任务”，不是“让代码自动更快”。
- 先理解串行和并行的差异，再写 `async`。
- 如果业务没有等待多个独立任务，就不要为了用协程而用协程。

## 配套源码

```kotlin
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeoutOrNull

suspend fun mockApi(name: String, ms: Long): Int {
    delay(ms)
    println("$name done")
    return ms.toInt()
}

fun main() = runBlocking {
    val cost = withTimeoutOrNull(2000) {
        val a = async(Dispatchers.Default) { mockApi("apiA", 600) }
        val b = async(Dispatchers.Default) { mockApi("apiB", 700) }
        a.await() + b.await()
    }

    println("result=$cost")
}
```

## 练习任务
1. 并发执行两个“模拟接口调用”并汇总结果。
2. 为任务增加超时控制。
3. 对比串行与并行的耗时。

## 验收标准
- 知道何时用协程，何时不需要并发。
- 能解释 `async/await` 和普通函数调用的差别。
