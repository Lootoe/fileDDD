## 事件总线：eventBus

`eventBus`事件总线适用于**父子组件**、**非父子组件**等之间的通信

虽然看起来比较简单，但是这种方法也有不变之处，如果项目过大，使用这种方式进行通信，后期维护起来会很困难。

使用步骤如下：

1.创建事件中心管理组件之间的通信

```js
// event-bus.js

import Vue from 'vue'
export const EventBus = new Vue()
```

2.发送事件 假设有两个兄弟组件`firstCom`和`secondCom`：

```vue
在firstCom组件中发送事件：

<template>
  <div>
    <button @click="add">加法</button>    
  </div>
</template>

<script>
import {EventBus} from './event-bus.js' // 引入事件中心

export default {
  data(){
    return{
      num:0
    }
  },
  methods:{
    add(){
      EventBus.$emit('addition', {
        num:this.num++
      })
    }
  }
}
</script>
```

3.接收事件

```vue
<template>
  <div>求和: {{count}}</div>
</template>

<script>
import { EventBus } from './event-bus.js'
export default {
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    EventBus.$on('addition', param => {
      this.count = this.count + param.num;
    })
  }
}
</script>
```

