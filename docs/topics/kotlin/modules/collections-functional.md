---
prev:
  text: 模块 3：面向对象
  link: /topics/kotlin/modules/oop
next:
  text: 模块 5：协程与工程实践
  link: /topics/kotlin/modules/coroutines-engineering
---

# 模块 4：集合与函数式（教程）

## 学习目标

- 熟练使用 Kotlin 集合 API。
- 掌握高阶函数处理筛选、映射、聚合与分组。
- 能识别何时使用 `Sequence` 优化中间开销。

## 第 1 步：筛选与映射

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val users = listOf(
        User("Alice", 20),
        User("Ben", 16),
        User("Cindy", 23)
    )

    val adultNames = users
        .filter { it.age >= 18 }
        .map { it.name }

    println(adultNames)
}
```

## 第 2 步：扁平化

```kotlin
fun main() {
    val groups = listOf(
        listOf("a", "b"),
        listOf("c"),
        listOf("d", "e")
    )

    val all = groups.flatMap { it }
    println(all)
}
```

## 第 3 步：分组与聚合

```kotlin
data class LogEvent(val module: String, val costMs: Long)

fun summary(events: List<LogEvent>): Map<String, Long> {
    return events
        .groupBy { it.module }
        .mapValues { (_, list) -> list.sumOf { it.costMs } }
}
```

## 第 4 步：`fold` 和 `reduce`

```kotlin
fun main() {
    val nums = listOf(2, 4, 6)

    val sumByFold = nums.fold(0) { acc, n -> acc + n }
    val sumByReduce = nums.reduce { acc, n -> acc + n }

    println(sumByFold)
    println(sumByReduce)
}
```

讲解：

- `fold` 有初始值，空集合可用。
- `reduce` 无初始值，空集合会异常。

## 第 5 步：`Sequence` 惰性计算

```kotlin
fun main() {
    val result = (1..1_000_000)
        .asSequence()
        .filter { it % 2 == 0 }
        .map { it * it }
        .take(5)
        .toList()

    println(result)
}
```

## 综合示例：订单统计报表

```kotlin
data class Order(val id: String, val city: String, val amount: Double)

data class CityReport(val city: String, val total: Double, val count: Int)

fun buildReport(orders: List<Order>): List<CityReport> {
    return orders
        .groupBy { it.city }
        .map { (city, list) ->
            CityReport(
                city = city,
                total = list.sumOf { it.amount },
                count = list.size
            )
        }
        .sortedByDescending { it.total }
}
```

## 常见误区与排错

- 误区：链式调用过长不拆变量。
  - 改法：按业务语义分段命名。
- 误区：超大集合仍直接 `List` 链式多次转换。
  - 改法：考虑 `Sequence`。
- 报错：`No value passed for parameter...`。
  - 原因：高阶函数 lambda 参数写错。

## 练习

1. 从订单列表中找出金额 Top 3 用户。
2. 对日志按天分组并统计错误率。
3. 把命令式循环重构为 `filter + map + fold`。

## 验收标准

- 至少使用 `filter/map/groupBy/fold` 各 1 次。
- 能解释一段链式调用每一步意图。
- 至少 1 处展示 `Sequence` 场景。

## 下一模块衔接

完成本模块后进入「模块 5：协程与工程实践」，把同步处理升级为并发任务编排。
