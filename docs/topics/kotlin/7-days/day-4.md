---
prev:
  text: Day3 类与数据类
  link: /topics/kotlin/7-days/day-3
next:
  text: Day5 OOP 与泛型
  link: /topics/kotlin/7-days/day-5
---

# Day4：集合与函数式编程

## 今日目标
- 熟练使用 `List`、`Set`、`Map`
- 掌握 `map`、`filter`、`groupBy`

## 核心知识点
- 不可变集合与可变集合
- 常见操作：`map`、`filter`、`find`、`any`、`all`
- 聚合统计：`sumOf`、`count`、`average`
- 分组统计：`groupBy`

## 学习建议
- 不要一上来就写循环，先想能否用集合操作表达业务意图。
- `map` 负责转换，`filter` 负责筛选，`groupBy` 负责归类，职责要分清。
- 这一天开始，代码的“可读性”比“能跑”更重要。

## 配套源码

```kotlin
data class Order(val id: Int, val type: String, val amount: Double)

data class Employee(val name: String, val dept: String)

fun main() {
    val orders = listOf(
        Order(1, "food", 25.0),
        Order(2, "book", 88.0),
        Order(3, "food", 42.0),
        Order(4, "tool", 120.0)
    )

    val foodAmounts = orders.filter { it.type == "food" }.map { it.amount }
    val total = orders.sumOf { it.amount }
    val groupedOrders = orders.groupBy { it.type }

    println("foodAmounts=$foodAmounts")
    println("total=$total")
    println("orderTypes=${groupedOrders.keys}")

    val scores = listOf(75, 82, 95, 61, 58)
    val avg = scores.average()
    val max = scores.maxOrNull()
    val passCount = scores.count { it >= 60 }

    println("avg=%.2f, max=$max, passCount=$passCount".format(avg))

    val employees = listOf(
        Employee("A", "RD"),
        Employee("B", "RD"),
        Employee("C", "QA")
    )
    println(employees.groupBy { it.dept }.mapValues { it.value.size })
}
```

## 练习任务
1. 对成绩列表求平均分、最高分、及格人数。
2. 按部门分组员工并统计人数。
3. 从商品列表筛选出价格区间内商品。

## 验收标准
- 能用链式调用完成数据处理。
- 知道什么时候应该回退到普通循环，而不是强行函数式链式调用。
