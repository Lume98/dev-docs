---
prev:
  text: 模块 4：集合与函数式
  link: /topics/kotlin/modules/collections-functional
next: false
---

# 模块 5：协程与工程实践（教程）

## 学习目标

- 掌握协程基础 API 与结构化并发原则。
- 能处理超时、取消与异常传播。
- 能组织一个可测试的小型 Kotlin 工程结构。

## 先决条件

- 已完成前 4 个模块。
- 项目已引入 `kotlinx-coroutines-core` 依赖。

## 第 1 步：`launch` 与 `async` 区别

```kotlin
import kotlinx.coroutines.async
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    launch {
        println("launch: fire and forget")
    }

    val deferred = async {
        21 * 2
    }

    println("async result = ${deferred.await()}")
}
```

讲解：

- `launch` 返回 `Job`，用于不直接返回结果的任务。
- `async` 返回 `Deferred<T>`，用于有结果的并发任务。

## 第 2 步：结构化并发

```kotlin
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope

suspend fun loadDashboard(): Pair<String, String> = coroutineScope {
    val profile = async { "profile" }
    val metrics = async { "metrics" }
    profile.await() to metrics.await()
}
```

讲解：

- 子协程与父作用域生命周期绑定。
- 父作用域结束前会等待所有子任务完成。

## 第 3 步：超时与取消

```kotlin
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeoutOrNull

fun main() = runBlocking {
    val result = withTimeoutOrNull(200) {
        delay(500)
        "OK"
    }

    println(result ?: "TIMEOUT")
}
```

## 第 4 步：异常处理

```kotlin
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope

suspend fun fetchAll(): List<String> = coroutineScope {
    val jobs = listOf(
        async { "A" },
        async { error("B failed") },
        async { "C" }
    )

    try {
        jobs.awaitAll()
    } catch (e: Exception) {
        listOf("fallback")
    }
}
```

## 第 5 步：工程实践建议

- 分层：`api`、`service`、`repository`、`model`。
- 协程边界：在 `service` 层组织并发，在 `repository` 层封装 IO。
- 禁止在业务代码直接使用 `GlobalScope`。
- 为超时、重试、降级定义统一策略。

## 综合示例：并发聚合命令行程序

```kotlin
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.runBlocking

suspend fun loadProfile(): String = "profile"
suspend fun loadOrders(): String = "orders"
suspend fun loadNotice(): String = "notice"

suspend fun buildHome(): String = coroutineScope {
    val profile = async { loadProfile() }
    val orders = async { loadOrders() }
    val notice = async { loadNotice() }

    "${profile.await()} | ${orders.await()} | ${notice.await()}"
}

fun main() = runBlocking {
    println(buildHome())
}
```

## 常见误区与排错

- 误区：业务层随处开协程。
  - 改法：限定在明确作用域内创建。
- 误区：忽略取消传播。
  - 改法：所有耗时任务都应可取消。
- 报错：`Suspension functions can be called only within coroutine body`。
  - 原因：在非协程环境调用 `suspend` 函数。
  - 改法：使用 `runBlocking` 或在已有协程中调用。

## 练习

1. 并发请求 3 个数据源，任一超时则降级为缓存值。
2. 给并发任务加统一日志（开始、成功、失败、耗时）。
3. 为 `buildHome()` 增加基础单元测试桩。

## 验收标准

- 至少使用 `async/await` 一次并发聚合。
- 至少使用一个超时控制 API。
- 关键并发流程有异常兜底分支。
- 目录分层清晰，协程边界明确。

## 下一步建议

你已完成 Kotlin 5 模块主线教程，可以进入完整项目实战：从需求、建模、并发到测试闭环执行一遍。
