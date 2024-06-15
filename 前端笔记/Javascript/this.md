# This

### 默认绑定

函数独立调用，`this`指向`window`，严格模式下`this`为`undefined`

##### 直接调用

```js
const name = '111'
function foo(){
	console.log(this.name)
}

foo()	// 111
```

##### 赋值给全局变量调用

```js
const name = '111'
const obj = {
  name:'222',
  foo(){
  	console.log(this.name)
	}
}

const bar = obj.foo	
bar()	// 111
```

##### 高阶函数调用

```js
const name = '111'
function foo(fn){
	fn()
}

const obj = {
  name:'222',
  bar(){
  	console.log(this.name)
	}
}

foo(obj.bar)	// 111
```



### new绑定

` JavaScript`中的函数也可以当作一个构造函数来使用，也就是通过`new`关键字

```js
const name = '111'
function person(name) {
    this.name = name
    console.log(this.name);
}
new person('222') // 222
```



### 隐式绑定

通过对象调用函数，`this`指向调用的对象

##### 普通对象调用

```js
const name = '111'
let obj ={
    name:'222',
    bar(){
       console.log(this.name);
    }
}

obj.bar() // 222
```

##### 对象高阶函数调用

这种情况很常见，比如事件回调，`setTimeout`回调

```js
function foo(){
    console.log(this);
}
setTimeout(foo,1000) // Window

let btn = document.querySelector('button')
btn.addEventListener('click',foo) // button
```

##### 完整对象的场景如下

```js
const name = '111'
function foo(){
	console.log(this.name)
}

const obj = {
  name:'222',
  bar(fn){
  	fn()
	}
}

obj.bar(foo)	// 222
```



### 显示绑定

##### call  apply

`call`、`apply`用来临时改变函数的`this`指向，并且执行一次

这两者的区别就是，`call`传入一个参数列表，`apply`传入一个数组

```js
var name = "111";	// const/let 声明的变量不属于window
function say(...args){
   console.log(this.name, args);
}
var obj = {
    name:"222",
};
// 想要传参可以如下用法
setTimeout(say.apply(null, [1,2]), 0); // 111，[1,2]

say.call(obj, 1, 2); // 222，[1,2]

say.apply(obj, [1,2])	// 222，[1,2]

say.apply(null ,[1,2]) // 111，[1,2]
```

##### bind

`bind`传入一个参数列表，永久改变函数的`this`指向，不会立即执行

```js
var name = "111";
function say(...args){
   console.log(this.name, args);
}
var obj = {
    name:"222",
};

const sayFn = say.bind(obj)
sayFn(1,2)	//222, [1,2]
```