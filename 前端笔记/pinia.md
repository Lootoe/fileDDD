## 安装

`src/store/index.js`

```js
import { createPinia } from 'pinia'
const pinia = createPinia()

export function setupStore(app) {
  app.use(pinia)
}
```

`src/main.js`

```js
import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from '@/store'

const app = createApp(App)
setupStore(app)

app.mount('#app')
```





## 基本使用

#### 选项式

`counter.js`

```js
import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', {
      state: () => ({ count: 10 }),
      getters: {
        double: (state) => state.count * 2,
      },
      actions: {
        add(){
          this.count++
        },
      },
 })
```

`app.vue`

```vue
<template>
  <div>count:{{ count }}</div>
  <div>double:{{ double }}</div>
  <button @click="increament">增加</button>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/store/counter'
const store = useCounterStore()
// 不使用storeToRefs解构出来的变量会丢失响应性
const { count, double } = storeToRefs(store)
// actions不能直接解构
const increament = () => {
  store.add()
}
```



#### 组合式

`counter.js`

```js
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', () => {
  //state写法
  const count = ref(10)
  //getters写法
  const double = computed(() => {
    return count.value * 2
  })
  //action写法
  const add = () => {
    count.value++
  }
  return { count, add, double }
})

```

`app.vue`

```vue
<template>
  <div class="num">count:{{ count }}</div>
  <div class="num">double:{{ double }}</div>
  <button @click="increament">增加</button>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/store/counter'
const store = useCounterStore()
// 不使用storeToRefs解构出来的变量会丢失响应性
const { count, double } = storeToRefs(store)
// actions不能直接解构
const increament = () => {
  store.add()
}
</script>
```





## 在setup外使用store

**注意：**

在`main.js`中使用`app.use(store)`时会自动提供`(provide) store`实例

在`setup`函数使用`useXxxStore`会自动注入`(inject)store`

所以，我们使用`const store = useCounterStore()`时，不需要传参

但是如果在外部使用，我们就需要提供`store`实例了

**代码示例：**

`src/store/index.js`

```js
import { createPinia } from 'pinia'
export const store = createPinia()

export function setupStore(app) {
  app.use(store)
}
```

`src/store/counter.js`

```js
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { store } from './index'
export const useCounterStore = defineStore('counter', () => {
	...
})

// 需要手动注入store
export const useCounterStoreHook = () => {
  return useCounterStore(store)
}
```

`src/app.vue`

```vue
<template>
  <div class="num">count:{{ count }}</div>
  <div class="num">double:{{ double }}</div>
  <button @click="increament">增加</button>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStoreHook } from '@/store/counter'
// 取代原始的自动注入的方法
const store = useCounterStoreHook()
// 不使用storeToRefs解构出来的变量会丢失响应性
const { count, double } = storeToRefs(store)
// 方法不能直接解构
const increament = () => {
  store.add()
}
</script>
```





## 模块化

`src/store/index.js`

```js
import useDemoStore from './modules/demo';
import useNumberStore from './modules/useNumberStore';
import { createPinia } from 'pinia'

const pinia = createPinia()

export function setupStore(app) {
  app.use(pinia)
}

export const useStore = () => ({
    useDemoStore: useDemoStore(),
    useNumberStore: useNumberStore(),
})
```

`src/app.vue`

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useStore } from '@/store/index'
const store = useStore()

const { useNumberStore } = store;
const { number, increment } = storeToRefs(useNumberStore)
</script>
```





## 持久化

[快速开始 | pinia-plugin-persistedstate (prazdevs.github.io)](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/)





## API

#### $reset

[State | Pinia 中文文档 (web3doc.top)](https://pinia.web3doc.top/core-concepts/state.html#重置状态)

将store回复到初始值（setup语法无法使用，需要手动实现）

```js
const store = useStore()
store.$reset()
```



#### $patch

[State | Pinia 中文文档 (web3doc.top)](https://pinia.web3doc.top/core-concepts/state.html#改变状态)

对`store`的属性批量修改

```js
// 修改一个属性
store.name = 'hello world'

// 批量修改：方式一
store.$patch({
  counter: store.counter + 1,
  name: 'Abalam',
})

// 批量修改：方式二
cartStore.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```



#### $subscribe

[State | Pinia 中文文档 (web3doc.top)](https://pinia.web3doc.top/core-concepts/state.html#订阅状态)

当使用`$patch`时，捕获其改变

```js
store.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // 与 cartStore.$id 相同
  mutation.storeId // 'cart'
  // 仅适用于 mutation.type === 'patch object'
  mutation.payload // 补丁对象传递给 to store.$patch()

  // 每当它发生变化时，将整个状态持久化到本地存储
  localStorage.setItem('cart', JSON.stringify(state))
})
```

