# Promise

## 基本使用

```js
function sendAJAX(url) {
        return new Promise((res, rej) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    // 如果响应成功
                    if (xhr.status >= 200 && xhr.status < 300) {
                        res(xhr.response)
                    } else {
                        rej(xhr.status)
                    }
                }
            }
        })
}
```





## resolve

### 作用

`Promise.resolve`用于将现有对象包装成一个`fullfilled`状态的`Promise`对象

`Promise.resolve(‘foo’)`等价于`new Promise(resolve => resolve(‘foo’))`

> 需要注意的是，立即`resolve`的 `Promise` 对象，是在本轮 “事件循环“ 的结束时执行执行
>
> 不是马上执行,也不是在下一轮 “事件循环” 的开始时执行

### 对不同参数的行为

`Promise.resolve`方法的参数分成四种情况：

如果参数是` Promise` 实例，那么`Promise.resolve`将不做任何修改、原封不动地返回这个实例

```js
const p1 = new Promise(res=>{...})
const p2 = Promise.resolve(p1)
console.log(p1 === p2)	//	true
```

`Promise.resolve`方法会将`thenable`对象转为 `Promise` 对象，然后就立即执行`then`方法

```js
let thenable = {
  then: function (resolve, reject) {
    console.log(777);
    resolve(888);
  },
};

let p1 = Promise.resolve(thenable);
p1.then(function (value) {
  console.log(value);
});

console.log('999');

// 999
// 777
// 888
```

如果参数是一个原始值，或者是一个不具有`then`方法的对象，则`Promise.resolve`方法返回一个新的 `Promise` 对象，状态为`fullfilled`

```js
Promise.resolve('hello').then(console.log);
console.log('world');

// world
// hello
```

`Promise.resolve`方法允许调用时不带参数，直接返回一个`resolved`状态的 `Promise` 对象

```js
Promise.resolve().then(()=>{console.log('hello')})
console.log('world');

// world
// hello
```





## reject

`Promise.resolve`用于将现有对象包装成一个`rejected`状态的`Promise`对象

`Promise.reject()`方法的参数，会原封不动地作为`reject`的理由，变成后续方法的参数，这一点与`Promise.resolve`方法不一致

```js
let thenable = {
  then: function (resolve, reject) {
    console.log(777);
    reject(888);
  },
};

let p1 = Promise.reject(thenable);
p1.catch(function (value) {
  console.log(value);
});

console.log('999');

// 999
// {then: ƒ}
```





## then

### then返回值

`then`方法会返回一个`Promise`，`Promise`的状态根据参数的返回值决定

返回一个值：返回`fullfilled`状态的`Promise`，回调函数的参数值为返回值

没有返回值：返回`fullfilled`状态的`Promise`，回调函数的参数值为`undefined`

返回接受/拒绝状态的`Promise`：

```js
Promise.resolve()
  .then(() => {
    return Promise.resolve(111);
  })
  .then(console.log);

console.log(222);

// 222
// 111
```

返回未定状态的`Promise`：

```js
Promise.resolve()
  .then(() => {
    return new Promise((res) => {
      setTimeout(() => {
        res('111');
      }, 2000);
    });
  })
  .then(console.log);

// 2秒后输出：111
```

### then可以同时注册多个回调

```js
let p = Promise.resolve("OK");

p.then(value => {
    console.log("第1个回调", value);
})

p.then(value => {
    console.log("第2个回调", value);
})

p.then(value => {
    console.log("第3个回调", value);
})
```

### 链式调用

```js
let p1 = Promise.resolve('ok')
p1.then(
    value => {
        console.log(value);
        return Promise.resolve('All right')
    }
).then(
    value => {
        console.log(value);
    }
)

// ok
// all right
```

### catch

```js
let p2 = Promise.resolve('OK')
p2.then(
    value => {
        console.log("第1个then:", value);
        return Promise.reject('All right')
    }
).then(
    value => {
        console.log("第2个then:", value);
    }
).catch(
    value => {
        console.log("最终catch:", value);
    }
)

//	第1个then:ok
//	最终catch:All right
```

### 中断任务链

```js
// 中断Promise链,返回pending状态的Promise
let p3 = Promise.resolve('ok')
p3.then(
    value => {
        console.log("111");
        return Promise.resolve('All right')
    }
).then(
    value => {
        return new Promise(() => {});
    }
).then(
    value => {
        console.log("222");
    }
)

// 111
```





## all

接受一个`promise`数组，返回一个新的`promise`

只有所有`promise`都成功，新的`promise`才成功只要有一个失败，新的`promise`失败

```js
let a1 = Promise.resolve("success-1")
let a2 = Promise.resolve("success-2")
let a3 = Promise.reject("failed-1")
// 当都成功时
Promise.all([a1, a2]).then(
    value => {
        console.log("all检测都成功", value);
    },
    reason => {
        console.log(reason);
    }
)
// all检测都成功：["success-1", "success-2"]

// 当有一个失败时
Promise.all([a1, a2, a3]).then(
    value => {
        console.log("all检测都成功", value);
    },
    reason => {
        console.log("all检测有一个失败", reason);
    }
)
// all检测有一个失败：failed-1
```





## race

接受一个`promise`数组，返回一个新的`promise`返回一个新的`Promise`对象，最后的状态取决于第一个完成的`Promise`的状态

```js
let r1 = new Promise((res, rej) => {
    setTimeout(() => {
        res("success-1");
    }, 2000);
})
let r2 = new Promise((res, rej) => {
    setTimeout(() => {
        res("success-2");
    }, 3000);
})
let r3 = new Promise((res, rej) => {
    setTimeout(() => {
        rej("failed-1")
    }, 1000);
})

Promise.race([r1, r2]).then(
    value => {
        console.log("race检测第一个成功", value);
    },
    reason => {
        console.log(reason);
    }
)
// race检测第一个失败：failed-1

Promise.race([r1, r2, r3]).then(
    value => {
        console.log(value);
    },
    reason => {
        console.log("race检测第一个失败", reason);
    }
)
// race检测第一个成功：success-1
```





## allSettled

接受一个`promise`数组，返回一个新的`promise`，不论数组里的Promise状态怎么样，都能拿到结果

当数组里的每个`Promise`都完成时，才会`resolve`

```js
let r1 = new Promise((res, rej) => {
  setTimeout(() => {
    res('success-1');
  }, 2000);
});
let r2 = new Promise((res, rej) => {
  setTimeout(() => {
    res('success-2');
  }, 3000);
});
let r3 = new Promise((res, rej) => {
  setTimeout(() => {
    rej('failed-1');
  }, 1000);
});

Promise.allSettled([r1, r2, r3]).then((value) => {
  console.log(value);
});

/*
[
  {
    status: "fulfilled",
		value: "success-1"
  }，
  {
  	status: "fulfilled"，
		value: "success-2"
  }，
  {
  	status: "rejected"
    reason: "failed-1"，
  }
]
*/
```

