---
prev:
  text: Kotlin 模块总览
  link: /topics/kotlin/modules/
next:
  text: 模块 2：类型系统
  link: /topics/kotlin/modules/type-system
---

# 模块 1：基础语法（教程）

## 学习目标

- 理解 Kotlin 程序最小结构与常见编译运行方式。
- 掌握变量、类型推断、字符串模板与流程控制。
- 能写出包含函数拆分的基础命令行程序。

## 课前准备

- 安装 JDK 17+。
- 安装 Kotlin 编译器或使用 IntelliJ IDEA。
- 能在命令行执行 `kotlinc` 与 `kotlin`（或在 IDE 内运行）。

## 第 1 步：写出第一个 Kotlin 程序

```kotlin
fun main() {
    println("Hello Kotlin")
}
```

讲解：

- 入口函数是 `main`。
- 语句结尾通常不需要分号。
- 字符串使用双引号。

## 第 2 步：理解 `val` 和 `var`

```kotlin
fun main() {
    val language = "Kotlin"
    var version = 2

    println("$language $version")

    version = 3
    println("$language $version")
}
```

讲解：

- `val` 只读，初始化后不可重新赋值。
- `var` 可变，适合状态会变化的场景。
- 优先使用 `val`，只在必须变化时用 `var`。

## 第 3 步：类型推断与显式类型

```kotlin
fun main() {
    val count = 10              // Int
    val rate: Double = 0.82     // 显式类型
    val enabled = true          // Boolean

    println("count=$count, rate=$rate, enabled=$enabled")
}
```

讲解：

- Kotlin 默认做类型推断。
- 对外部接口、复杂表达式建议显式标注类型，提高可读性。

## 第 4 步：条件与分支

```kotlin
fun grade(score: Int): String {
    return when {
        score < 0 || score > 100 -> "非法分数"
        score >= 90 -> "A"
        score >= 80 -> "B"
        score >= 70 -> "C"
        score >= 60 -> "D"
        else -> "E"
    }
}

fun main() {
    println(grade(95))
    println(grade(61))
    println(grade(120))
}
```

讲解：

- `when` 可替代多层 `if-else`。
- 条件分支从上到下匹配，先命中先返回。

## 第 5 步：循环与集合遍历

```kotlin
fun main() {
    val names = listOf("Ada", "Bob", "Cindy")

    for ((index, name) in names.withIndex()) {
        println("#${index + 1}: $name")
    }

    var sum = 0
    for (i in 1..5) {
        sum += i
    }
    println("sum=$sum")
}
```

讲解：

- `1..5` 是闭区间。
- `withIndex()` 适合同时拿下标和元素。

## 第 6 步：函数拆分与默认参数

```kotlin
fun discount(price: Double, rate: Double = 0.9): Double {
    return price * rate
}

fun printBill(name: String, price: Double) {
    val finalPrice = discount(price)
    println("商品: $name, 应付: $finalPrice")
}

fun main() {
    printBill(name = "键盘", price = 299.0)
    println(discount(price = 200.0, rate = 0.75))
}
```

讲解：

- 默认参数减少重载函数数量。
- 命名参数提升调用可读性。

## 综合示例：成绩统计 CLI

```kotlin
data class Student(val name: String, val score: Int)

fun level(score: Int): String = when {
    score >= 90 -> "A"
    score >= 80 -> "B"
    score >= 70 -> "C"
    score >= 60 -> "D"
    else -> "E"
}

fun average(students: List<Student>): Double {
    if (students.isEmpty()) return 0.0
    return students.sumOf { it.score }.toDouble() / students.size
}

fun main() {
    val students = listOf(
        Student("Alice", 91),
        Student("Ben", 78),
        Student("Coco", 85)
    )

    for (student in students) {
        println("${student.name}: ${student.score} -> ${level(student.score)}")
    }

    println("平均分: ${"%.2f".format(average(students))}")
}
```

## 常见误区与排错

- 误区：所有变量都用 `var`。
  - 改法：默认 `val`，无法满足再改 `var`。
- 报错：`Type mismatch`。
  - 原因：返回值类型与声明不一致。
  - 改法：检查函数签名和每个分支返回类型。
- 报错：`Unresolved reference`。
  - 原因：拼写错误或作用域不可见。
  - 改法：确认变量在当前块已声明。

## 练习

1. 写一个 `tax(price, rate = 0.13)` 函数，返回含税价格。
2. 写一个 `classifyAge(age: Int)`，输出 `child/teen/adult`。
3. 输入 5 个整数，输出最大值、最小值、平均值。

## 验收标准

- 代码中 `val` 使用率高于 `var`。
- 至少写出 3 个函数并完成职责拆分。
- 使用 `when` 处理多分支条件。
- 完成一个可运行的命令行小程序。

## 下一模块衔接

完成本模块后进入「模块 2：类型系统」，重点解决空安全、类型转换和泛型约束。
