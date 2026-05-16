---
prev:
  text: Day2 空安全与函数
  link: /topics/kotlin/7-days/day-2
next:
  text: Day4 集合与函数式
  link: /topics/kotlin/7-days/day-4
---

# Day3：类、对象、数据类与扩展函数

## 今日目标
- 会定义类和构造函数
- 会使用 `data class`
- 会写扩展函数

## 核心知识点
- 主构造函数
- 成员属性和成员函数
- `data class` 自动生成 `toString/equals/hashCode`
- 扩展函数：给已有类“加方法”

## 学习建议
- 普通类负责行为，`data class` 负责描述数据，这个边界要尽量清楚。
- 扩展函数只是在调用方式上更自然，不会真的修改原类。
- 先写最小类，再逐步补行为，避免一开始把结构写复杂。

## 配套源码

```kotlin
data class User(val id: Int, val name: String)
data class Book(val title: String, val author: String, val price: Double)

class BookService {
    private val books = mutableListOf<Book>()

    fun add(book: Book) {
        books.add(book)
    }

    fun list(): List<Book> = books.toList()
}

fun String.capFirst(): String {
    return if (isNotEmpty()) this[0].uppercase() + substring(1) else this
}

fun String.maskPhone(): String {
    return if (length >= 7) replaceRange(3, 7, "****") else this
}

fun main() {
    val user = User(1, "tom")
    val service = BookService()

    service.add(Book("Kotlin In Action", "Dmitry", 99.0))
    service.add(Book("Effective Kotlin", "Marcin", 128.0))

    println(user)
    println("13812345678".maskPhone())
    println(user.name.capFirst())
    println(service.list())
}
```

## 练习任务
1. 定义 `Book` 数据类，包含书名、作者、价格。
2. 写 `BookService` 类，实现新增和查询。
3. 给 `String` 写扩展函数：首字母大写。

## 验收标准
- 理解何时用普通类，何时用 `data class`。
- 能独立写出一个最小的服务类管理内存数据。
