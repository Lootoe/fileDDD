## 数组

### 无法监听数组的变化

Vue不能检测以下数组的变动：

- 利用索引值直接设置一个数组项时，例如`vm.list[0] = newValue`
- 修改数组长度时，例如`vm.list.length = newLength`

```js
const vm = new Vue({
  el: '#root',
  data: {
    list: ['cat', 'dog', 'pig'],
  },
});
vm.list[1] = 'fish'; // 不会重新渲染视图
```

### 解决：替换整个数组

实际上这不是监听数组的变化，而是`list`属性变化了，所以DOM重新渲染了

```js
const vm = new Vue({
  el: '#root',
  data: {
    list: ['cat', 'dog', 'pig'],
  },
});
vm.list = ['cat', 'fish', 'pig'];
```

### 解决：$set

```js
const vm = new Vue({
  el: '#root',
  data: {
    list: ['cat', 'dog', 'pig'],
  },
});
Vue.set(vm.list, 1, 'fish')
```



## 对象

### 无法监听对象属性的增删

```js
const vm = new Vue({
  el: '#root',
  data: {
    price: 10,
  },
});
vm.price = 20; // 重新渲染视图
vm.discount = 10; // 并不是响应式的数据
```

### 解决：$set

```js
const vm = new Vue({
  el: '#root',
  data: {
    price: 10,
  },
});
Vue.set(vm, 'discount', 10)
```



## 数组的重写方法原理



## $set原理

