## 简述

vue 实现响应式并不是数据发生变化后 DOM 立即变化，而是按照一定策略异步执行 DOM 更新的

vue 在修改数据后，视图不会立刻进行更新，而是要等**同一事件循环机制**内所有数据变化完成后，再统一进行DOM更新

`nextTick` 可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM



## 场景

分析代码：当点击按钮时，改变msg之后，获取DOM里的数据，发现还是变化之前的

```vue
<template>
  <div class="test">
    <p ref='msg' id="msg">{{msg}}</p>
  </div>
</template>
 
<script>
export default {
  name: 'Test',
  data () {
    return {
      msg:"hello world",
    }
  },
  methods: {
    changeMsg() {
      this.msg = "hello Vue"
      let msgEle = this.$refs.msg.innerText
      console.log(msgEle)  // hello world
    },
  }
}
</script>
```



## 使用nextTick

`nextTick` 可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM

nextTick的调用方式

1. 回调函数方式：`Vue.nextTick(callback)`
2. Promise方式：`Vue.nextTick().then(callback)`
3. 实例方式：`vm.$nextTick(callback)`

所以上述代码，可以通过`nextTick`拿到更新之后的值，如下：

```vue
<template>
  <div class="test">
    <p ref='msg' id="msg">{{msg}}</p>
  </div>
</template>
 
<script>
export default {
  name: 'Test',
  data () {
    return {
      msg:"hello world",
    }
  },
  methods: {
    changeMsg() {
      this.msg = "hello Vue"
      let msgEle = this.$refs.msg.innerText
      console.log(msgEle)  // hello world
      this.$nextTick(() => {
        console.log(this.$refs.msg.innerText) // hello Vue
      })
    },
  }
}
</script>
```



## DOM异步更新原理

1. 当某个响应式数据发生变化的时候，它的setter函数会通知闭包中的Dep，Dep则会调用它管理的所有Watcher对象，触发Watcher对象的update实现
2. 而update函数会将Watcher放到观察者队列（ID相同的Watcher不会放入队列）
3. 之后调用nextTick函数，将`flushSchedulerQueue`作为nextTick的回调函数，放到微任务/宏任务里异步执行
4. 最后`flushSchedulerQueue`会遍历调用所有Watcher的run函数，更新DOM
5. 为什么要异步更新视图呢？如下！



## Vue内部对数据变化的处理

分析代码：当点击按钮时，count会被循环改变10000次。那么每次count+1，都会触发count的`setter`方法，然后修改真实DOM

按此逻辑，这整个过程，DOM会被更新10000次，我们都知道DOM的操作是非常昂贵的，而且这样的操作完全没有必要

所以需要异步更新！

```vue
<template>
  <div>
    <div>{{count}}</div>
    <div @click="handleClick">click</div>
  </div>
</template>
<script>
export default {
    data () {
        return {
            number: 0
        };
    },
    methods: {
        handleClick () {
            for(let i = 0; i < 10000; i++) {
                this.count++;
            }
        }
    }
}
</script>
```



## nextTick原理

我们的nextTick的回调函数为什么会在DOM更新之后执行？

从上面知道，更新DOM的`flushSchedulerQueue`，在nextTick的回调函数队列里

而我们自己声明的回调函数实际上也会被放入这个队列，所以当`flushSchedulerQueue`更新DOM后，再执行我们的回调函数就能拿到结果了

但是，`nextTick`不一定能拿到DOM更新结果，因为`flushSchedulerQueue`跟自己声明的回调函数的入队列顺序是看书写顺序

如下：`nextTick`在DOM改变之前书写，所以拿不到更新之后的DOM，输出的依旧是hello World

```vue
<template>
  <div class="test">
    <p ref='msg' id="msg">{{msg}}</p>
  </div>
</template>
 
<script>
export default {
  name: 'Test',
  data () {
    return {
      msg:"hello world",
    }
  },
  methods: {
    changeMsg() {
      this.$nextTick(() => {
        console.log(this.$refs.msg.innerText) // hello world
      })
      this.msg = "hello Vue"
      let msgEle = this.$refs.msg.innerText
      console.log(msgEle)  // hello world
    },
  }
}
</script>
```



## 参考链接

[从Vue.js源码看异步更新DOM策略及nextTick - 掘金 (juejin.cn)](https://juejin.cn/post/6844903497649881096)
