---
prev:
  text: Day4 集合与函数式
  link: /topics/kotlin/7-days/day-4
next:
  text: Day6 协程基础
  link: /topics/kotlin/7-days/day-6
---

# Day5：面向对象进阶与泛型

## 今日目标
- 掌握继承与接口
- 理解泛型与约束

## 核心知识点
- `open`、`override`
- 接口默认实现
- 泛型类与泛型函数
- 上界约束：`where T : ...`

## 学习建议
- 先问自己“这是 is-a 关系还是 can-do 关系”，再决定用继承还是接口。
- 泛型的价值不是语法炫技，而是减少重复代码并保持类型安全。
- 如果一个类只有一套很简单的复用逻辑，不要急着设计复杂继承结构。

## 配套源码

```kotlin
open class Animal(open val name: String) {
    open fun sound() = "..."
}

class Dog(override val name: String) : Animal(name) {
    override fun sound() = "wang"
}

interface Payable {
    fun pay(amount: Double): Boolean
}

class Wallet(private var balance: Double) : Payable {
    override fun pay(amount: Double): Boolean {
        if (amount <= 0 || amount > balance) return false
        balance -= amount
        return true
    }

    fun currentBalance(): Double = balance
}

class Cache<T> {
    private val map = mutableMapOf<String, T>()

    fun put(key: String, value: T) {
        map[key] = value
    }

    fun get(key: String): T? = map[key]
}

fun main() {
    val dog = Dog("Lucky")
    println("${dog.name}: ${dog.sound()}")

    val wallet = Wallet(100.0)
    println("pay 30 -> ${wallet.pay(30.0)}, balance=${wallet.currentBalance()}")

    val cache = Cache<Int>()
    cache.put("count", 42)
    println("cache[count]=${cache.get("count")}")
}
```

## 练习任务
1. 设计图形层次：`Shape`、`Circle`、`Rectangle`。
2. 用接口抽象“可支付”行为。
3. 写一个泛型缓存类 `Cache<T>`。

## 验收标准
- 能清晰区分“继承”和“接口”的使用场景。
- 能解释泛型为什么比 `Any` 更安全。
