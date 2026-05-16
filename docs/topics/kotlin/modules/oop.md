---
prev:
  text: 模块 2：类型系统
  link: /topics/kotlin/modules/type-system
next:
  text: 模块 4：集合与函数式
  link: /topics/kotlin/modules/collections-functional
---

# 模块 3：面向对象（教程）

## 学习目标

- 能用类、接口、组合建模业务对象。
- 掌握 `data class`、`sealed class`、扩展函数的正确用法。

## 第 1 步：类与构造函数

```kotlin
class Account(
    val id: Long,
    var balance: Double
) {
    fun deposit(amount: Double) {
        require(amount > 0) { "amount must be > 0" }
        balance += amount
    }
}
```

讲解：

- 主构造函数可直接定义属性。
- `require` 用于参数前置校验。

## 第 2 步：`data class` 做数据载体

```kotlin
data class Product(
    val id: Long,
    val name: String,
    val price: Double
)
```

讲解：

- 自动生成 `equals/hashCode/toString/copy`。
- 适合 DTO、配置、查询结果。

## 第 3 步：接口与组合

```kotlin
interface PaymentGateway {
    fun pay(orderId: String, amount: Double): Boolean
}

class MockGateway : PaymentGateway {
    override fun pay(orderId: String, amount: Double): Boolean = amount < 1000
}

class OrderService(private val gateway: PaymentGateway) {
    fun checkout(orderId: String, amount: Double): String {
        return if (gateway.pay(orderId, amount)) "SUCCESS" else "FAILED"
    }
}
```

## 第 4 步：`sealed class` 表达状态

```kotlin
sealed class OrderState {
    data object Created : OrderState()
    data object Paid : OrderState()
    data class Failed(val reason: String) : OrderState()
}

fun nextAction(state: OrderState): String = when (state) {
    OrderState.Created -> "继续支付"
    OrderState.Paid -> "准备发货"
    is OrderState.Failed -> "重试原因: ${state.reason}"
}
```

## 第 5 步：扩展函数做非侵入增强

```kotlin
data class User(val firstName: String, val lastName: String)

fun User.fullName(): String = "$firstName $lastName"
```

讲解：

- 扩展函数不会修改原类定义。
- 适合工具能力补充，不适合承载核心状态逻辑。

## 综合示例：订单领域建模

```kotlin
data class OrderItem(val sku: String, val quantity: Int, val unitPrice: Double)

data class Order(
    val id: String,
    val items: List<OrderItem>,
    val state: OrderState
)

fun Order.totalAmount(): Double {
    return items.sumOf { it.quantity * it.unitPrice }
}

fun Order.canShip(): Boolean = state == OrderState.Paid
```

## 常见误区与排错

- 误区：过度继承。
  - 改法：优先接口 + 组合。
- 误区：把业务状态写成字符串。
  - 改法：用 `sealed class` 或枚举。
- 报错：`Class is not abstract and does not implement...`。
  - 原因：接口方法未实现。

## 练习

1. 设计 `InventoryService` 接口，支持 `reserve/release`。
2. 用密封类表达支付结果：成功、失败、超时。
3. 给 `Order` 增加 `isHighValue()` 扩展函数。

## 验收标准

- 至少 2 个 `data class` + 1 个接口。
- 核心状态使用 `sealed class`，无字符串魔法值。
- 对象职责划分清晰，避免“上帝类”。

## 下一模块衔接

完成对象建模后进入「模块 4：集合与函数式」，处理真实业务中的批量数据转换。
