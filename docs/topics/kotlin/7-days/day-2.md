---
prev:
  text: Day1 基础语法
  link: /topics/kotlin/7-days/day-1
next:
  text: Day3 类与数据类
  link: /topics/kotlin/7-days/day-3
---

# Day2：空安全、函数与流程控制

## 今日目标
- 熟练处理可空类型
- 会写带默认参数的函数
- 掌握 `if` 与 `when`

## 核心知识点
- 可空类型：`String?`
- 安全调用：`?.`
- Elvis 操作符：`?:`
- 谨慎使用：`!!`
- 默认参数和命名参数
- `when` 表达式

## 学习建议
- 这一天的重点不是记住符号，而是理解“空值是业务事实，不是异常”。
- 优先用 `?.` 和 `?:`，把 `!!` 当成最后手段。
- `when` 要当成表达式来用，不要只把它当成 `switch` 替代品。

## 配套源码

```kotlin
fun greet(name: String = "World"): String = "Hello, $name"

fun level(score: Int): String = when {
    score >= 90 -> "A"
    score >= 80 -> "B"
    score >= 60 -> "C"
    else -> "D"
}

fun normalizeNickname(nickname: String?): String = nickname?.trim()?.takeIf { it.isNotEmpty() } ?: "Anonymous"

fun calcBMI(heightMeters: Double, weightKg: Double): Double {
    require(heightMeters > 0) { "height must be > 0" }
    return weightKg / (heightMeters * heightMeters)
}

fun main() {
    val nickname: String? = null
    val displayName = normalizeNickname(nickname)
    val bmi = calcBMI(1.75, 68.0)

    println(greet(displayName))
    println("level=${level(85)}")
    println("BMI=%.2f".format(bmi))
}
```

## 练习任务
1. 写一个函数 `calcBMI(height, weight)` 返回 BMI。
2. 用 `when` 判断星期几并输出待办事项。
3. 写一个可空字符串处理函数，空值时返回默认文本。

## 验收标准
- 不使用 `!!` 完成可空值处理。
- 能解释默认参数比函数重载更适合什么场景。
