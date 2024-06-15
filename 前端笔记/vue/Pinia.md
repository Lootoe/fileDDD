## 集成入项目

### 全局注册

创建一个 `pinia` 并将其传递给应用程序

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from "./App.vue"

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.mount('#app')
```

### 定义Store(组合式)

在这种语法中，`ref` 与 `state` 对应、`computed` 与 `getters` 对应、`function` 与 `actions` 对应。

```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

### 使用Store(组合式)

```vue
<script setup lang="ts" name="component-test">
	import { storeToRefs } from 'pinia';
	import useCounterStore from '@/store/counter';
  const counterStore = useCounterStore()

	// 防止丢失响应式需要使用storeToRefs
	const { count } = storeToRefs(counterStore);
	const { increment, doubleCount } = counterStore;
</script>
```





## state

### $state

[State | Pinia (vuejs.org)](https://pinia.vuejs.org/zh/core-concepts/state.html#replacing-the-state)

`$state`会返回整个`state`对象

不能完全替换掉 `store` 的 `state`，因为那样会破坏其响应性,但是，可以 `patch` 它

```js
// 这实际上并没有替换`$state`
store.$state = { count: 24 }
// 在它内部调用 `$patch()`：
store.$patch({ count: 24 })
```

### $patch

[State | Pinia (vuejs.org)](https://pinia.vuejs.org/zh/core-concepts/state.html#mutating-the-state)

除了用 `store.count++` 直接改变 store，你还可以调用 `$patch` 方法。它允许你用一个 `state` 的补丁对象在同一时间更改多个属性

直接修改 `state`，`$patch()` 也会出现在 devtools 中

```js
// mutation.type === 'patch object'
store.$patch({
  count: store.count + 1,
  age: 120,
  name: 'DIO',
})

// mutation.type === 'patch function'
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

### $reset

[State | Pinia (vuejs.org)](https://pinia.vuejs.org/zh/core-concepts/state.html#resetting-the-state)

调用 store 的 `$reset()` 方法将 state 重置为初始值

```js
const store = useStore()
store.$reset()
```

### $subscribe

[State | Pinia (vuejs.org)](https://pinia.vuejs.org/zh/core-concepts/state.html#subscribing-to-the-state)

可以通过 store 的 `$subscribe()` 方法查看状态及其变化

 与常规的 `watch()` 相比，使用 `$subscribe()` 的优点是只会在 `$patch`之后触发一次

```js
cartStore.$subscribe((mutation, state) => {
  mutation.type // 'direct' | 'patch object' | 'patch function'
  mutation.storeId // 'cart'
  mutation.payload // 传递给 cartStore.$patch() 的补丁对象
  // 每当状态发生变化时，将整个 state 持久化到本地存储。
  localStorage.setItem('cart', JSON.stringify(state))
})
```





## getters

### 无参数

```js
// 定义
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  return { count, doubleCount }
})

// 使用
const counterStore = useCounterStore()
console.log(counterStore.doubleCount)
```

### 有参数(无缓存)

当返回函数时，`getters`将不再缓存数据

```js
// 定义
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  
  // 返回一个函数
  const getCount = computed(() => {
    return (num) => count.value * num
  })
  
  return { count, getCount }
})

// 使用
const counterStore = useCounterStore()
console.log(counterStore.getCount(2))
```

### 有参数（带缓存）

可以采用闭包，在内部缓存一些数据

```js
// 定义
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  
  // 返回一个函数
  const getCount = computed(() => {
    const seed = Math.random()
    return (num) => count.value * num * seed
  })
  
  return { count, doubleCount, increment }
})
```





## Actions

### 基本使用

```js
// 定义
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment(num) {
    return new Promise(async (resolve)=>{
      const result = await api.post('xxx',num)
    	count += result
      resolve(count)
    })
  }
  return { count, increment }
})

// 使用
const counterStore = useCounterStore()
counterStore.increment(9).then(res=>console.log(res))
```

### $onAction

可以使用 `store.$onAction()` 订阅 action 及其结果。 

传递给它的回调在 action 之前执行。

 `after` 处理 Promise 并允许您在 action 完成后执行函数。

`onError` 允许您在处理中抛出错误。

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // action 的名字
    store, // store 实例
    args, // 调用这个 action 的参数
    after, // 在这个 action 执行完毕之后，执行这个函数
    onError, // 在这个 action 抛出异常的时候，执行这个函数
  }) => {
    
    // 记录开始的时间变量
    const startTime = Date.now()
    // 这将在 `store` 上的操作执行之前触发
    console.log(`Start "${name}" with params [${args.join(', ')}].`)
    
    // 如果 action 成功并且完全运行后，after 将触发。
    // 它将等待任何返回的 promise
    after((result) => {})

    // 如果 action 抛出或返回 Promise.reject ，onError 将触发
    onError((error) => {})
  }
)

// 手动移除订阅
unsubscribe()
```





## 在setup外使用store

在 main.ts 中使用`app.use(store)`时会（提供）provide store实例

在 setup 函数使用`useXxxStore`会自动（注入）inject store

所以，对开发者来说，我们看不到传递store实例参数

但是如果我们想在setup外使用，就要手动传参了

```js
/** store/counter.js */
import store from "@/store"
export function useCounterStoreHook() {
  return useCounterStore(store)
}S

/** store/xxx.js */
import { useCounterStoreHook } from "@/store/counter.js"
const counterStore = useCounterStoreHook()
```





## 持久化

[快速开始 | pinia-plugin-persistedstate (prazdevs.github.io)](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/)
