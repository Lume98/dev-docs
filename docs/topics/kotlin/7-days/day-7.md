---
prev:
  text: Day6 协程基础
  link: /topics/kotlin/7-days/day-6
next: false
---

# Day7：综合项目实战

## 今日目标
- 用 Kotlin 完成一个完整小项目
- 形成“需求 -> 设计 -> 编码 -> 测试”的闭环

## 项目建议
- 命令行待办系统（TODO CLI）
- 学生成绩管理系统
- 记账小工具

## 项目最低要求
1. 至少 3 个数据类。
2. 至少 2 个业务服务类。
3. 使用集合做增删改查。
4. 至少 5 个函数。
5. 包含输入校验和异常处理。

## 学习建议
- 第 7 天的重点不是把项目做大，而是把结构做清楚。
- 先拆 `model`、`service`、`app`，再写具体逻辑。
- 任何需求都先写最小可运行版本，再逐步加功能。

## 配套源码

```kotlin
data class TodoItem(val id: Int, var title: String, var done: Boolean = false)

class TodoService {
    private val items = mutableListOf<TodoItem>()
    private var nextId = 1

    fun add(title: String): TodoItem {
        require(title.isNotBlank()) { "title cannot be blank" }
        val item = TodoItem(nextId++, title.trim())
        items.add(item)
        return item
    }

    fun list(): List<TodoItem> = items.toList()

    fun finish(id: Int): Boolean {
        val target = items.find { it.id == id } ?: return false
        target.done = true
        return true
    }

    fun remove(id: Int): Boolean = items.removeIf { it.id == id }
}

fun main() {
    val service = TodoService()

    service.add("学习 Kotlin data class")
    service.add("练习集合 map/filter")
    service.finish(1)

    println("all=${service.list()}")
    service.remove(2)
    println("after remove=${service.list()}")
}
```

## 练习任务
1. 给待办系统增加“按状态筛选”功能。
2. 补一个“修改标题”方法并处理非法输入。
3. 尝试把 `main.kt` 按 `model`、`service`、`app` 拆到多个文件。

## 验收标准
- 能运行。
- 能处理非法输入。
- 代码结构清晰。
- 关键逻辑有最小测试思路。
