---
prev:
  text: 模块 1：基础语法
  link: /topics/kotlin/modules/basics-syntax
next:
  text: 模块 3：面向对象
  link: /topics/kotlin/modules/oop
---

# 模块 2：类型系统（教程）

## 学习目标

- 掌握 Kotlin 空安全体系，避免常见 NPE。
- 理解类型判断与智能转换。
- 能编写基础泛型函数与泛型容器。

## 第 1 步：可空类型与非空类型

```kotlin
fun main() {
    val nonNullName: String = "Kotlin"
    val nullableName: String? = null

    println(nonNullName.length)
    println(nullableName)
}
```

讲解：

- `String` 不能存 `null`。
- `String?` 允许 `null`，访问成员前必须处理空值。

## 第 2 步：安全调用与 Elvis

```kotlin
fun normalize(input: String?): String {
    return input?.trim()?.lowercase() ?: "unknown"
}

fun main() {
    println(normalize(" Kotlin "))
    println(normalize(null))
}
```

讲解：

- `?.` 在对象为 `null` 时直接返回 `null`。
- `?:` 提供兜底值。

## 第 3 步：`let` 处理非空分支

```kotlin
fun printIfPresent(email: String?) {
    email?.let {
        println("email length = ${it.length}")
    } ?: println("email is missing")
}

fun main() {
    printIfPresent("dev@example.com")
    printIfPresent(null)
}
```

## 第 4 步：类型判断与智能转换

```kotlin
fun readValue(value: Any): String {
    return when (value) {
        is String -> "字符串长度: ${value.length}"
        is Int -> "整数平方: ${value * value}"
        is List<*> -> "列表大小: ${value.size}"
        else -> "未知类型"
    }
}
```

讲解：

- `is` 判断通过后，Kotlin 自动将 `value` 视为目标类型。

## 第 5 步：安全转换 `as?`

```kotlin
fun toIntOrNull(value: Any): Int? {
    return value as? Int
}

fun main() {
    println(toIntOrNull(7))
    println(toIntOrNull("7"))
}
```

## 第 6 步：泛型函数

```kotlin
fun <T> lastOrDefault(list: List<T>, defaultValue: T): T {
    return if (list.isEmpty()) defaultValue else list.last()
}

fun main() {
    println(lastOrDefault(listOf(1, 2, 3), 0))
    println(lastOrDefault(emptyList(), "N/A"))
}
```

## 第 7 步：泛型上界

```kotlin
fun <T : Number> sumNumbers(items: List<T>): Double {
    return items.sumOf { it.toDouble() }
}

fun main() {
    println(sumNumbers(listOf(1, 2, 3)))
    println(sumNumbers(listOf(1.2, 3.4)))
}
```

## 综合示例：安全 DTO 映射

```kotlin
data class UserEntity(
    val id: Long,
    val nickname: String?,
    val age: Int?
)

data class UserDTO(
    val id: Long,
    val displayName: String,
    val age: Int
)

fun toDTO(entity: UserEntity): UserDTO {
    val safeName = entity.nickname?.trim()?.takeIf { it.isNotEmpty() } ?: "anonymous"
    val safeAge = entity.age?.takeIf { it >= 0 } ?: 0

    return UserDTO(
        id = entity.id,
        displayName = safeName,
        age = safeAge
    )
}
```

## 常见误区与排错

- 误区：到处使用 `!!`。
  - 风险：运行时崩溃。
  - 改法：优先 `?.`、`?:`、`let`。
- 报错：`Only safe (?.) or non-null asserted (!!.) calls are allowed`。
  - 原因：在可空对象上直接访问成员。
  - 改法：先做空安全处理。
- 报错：`Unchecked cast`。
  - 原因：不安全强转。
  - 改法：改用 `as?` 并处理 `null` 分支。

## 练习

1. 写一个 `parsePort(value: String?): Int`，空或非法时返回 `8080`。
2. 写一个 `firstNonBlank(a: String?, b: String?): String`。
3. 写一个泛型函数 `headOrNull(list)` 返回首元素或 `null`。

## 验收标准

- 关键路径零 `!!`。
- 至少 2 处使用 `?:` 提供兜底策略。
- 至少 1 个泛型函数 + 1 个类型判断分支。

## 下一模块衔接

完成类型系统后进入「模块 3：面向对象」，将空安全与类型能力用于领域建模。
