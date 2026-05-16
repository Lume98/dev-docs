---
prev: false
next:
  text: Day2 空安全与函数
  link: /topics/kotlin/7-days/day-2
---

# Day1：Kotlin 基础语法与开发环境

## 今日目标
- 能运行 Kotlin 程序
- 理解 `val` / `var`、基本类型、字符串模板

## 核心知识点
- 入口函数：`fun main()`
- 变量：`val` 不可变，`var` 可变
- 常见类型：`Int`、`Long`、`Double`、`Boolean`、`String`
- 字符串模板：`"name=$name"`

## 学习建议
- 先手敲一遍 `main` 函数，确认本地能跑通。
- 区分“重新赋值”和“只读变量”这两个概念，不要只记语法。
- 字符串模板要多写几次，后面几乎每天都会用到。

## 配套源码

```kotlin
fun main() {
    val name = "Kotlin"
    var version = 1
    version += 1

    val myName = "你的名字"
    val age = 18
    val city = "Shanghai"

    val a = 20
    val b = 6

    println("Hello, $name")
    println("version=$version")
    println("我叫$myName，今年$age岁，来自$city。")
    println("a+b=${a + b}, a-b=${a - b}, a*b=${a * b}, a/b=${a / b}")
}
```

## 练习任务
1. 输出你的姓名、年龄、城市。
2. 定义两个数字并输出它们的和、差、积、商。
3. 用字符串模板输出：`我叫XXX，今年XX岁。`

## 验收标准
- 不看资料能写出 `main` 和变量定义。
- 知道什么时候该用 `val`，什么时候必须用 `var`。
