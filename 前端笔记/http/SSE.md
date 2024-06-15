# SSE

### 介绍

SSE：Server-sent events

HTTP/2是新一代HTTP协议，若干年前，服务器并没有主动推送的能力，主要是通过轮询的方式来达到近似于服务器推送的能力

现在不需要这么麻烦，轮询只作为向下兼容的方案即可，当前主流的服务器推送是使用 SSE 或者 WebSocket 来实现的



### 服务器：响应头配置

SSE的响应，需要配置以下响应头，缺一不可

`Content-Type: text/event-stream`
`Cache-Control: no-cache`
`Connection: keep-alive`

```js
// express
app.get('/stream', (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });
}
```



### 服务器：消息格式

SSE 推送的消息必须是`UTF-8`编码的纯文本

每次推送有若干个消息组成，消息用`'\n\n'`结尾

每个消息由若干行组成，行之间以键值对分割

服务器：

```js
// express
app.get('/stream', (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });
  
  res.write("data: " + '1' + "\n\n");
	res.write("data: " + '2' + "\n\n");
	res.write(`id: 51465161651\n`);
	res.write(`data: helloworld\n`);
	res.write("retry: 1000\n");
	res.write("\n\n");
}
```

客户端：

```js
// 省略了一些字段
{isTrusted: true, data: '1', origin: 'http://localhost:3000'}
{isTrusted: true, data: '2', origin: 'http://localhost:3000'}
{isTrusted: true, data: 'helloworld', origin: 'http://localhost:3000'}
```



### 支持的键值对

`data`: 消息内容

`event`: 消息事件名称，默认为 message，浏览器可以用 `addEventListener()`监听该事件

`id`: 消息编号，浏览器用`lastEventId`属性读取这个值

​		一旦连接断线，浏览器会发送一个 HTTP 头，里面包含一个特殊的`Last-Event-ID`头信息

​		将这个值发送回来，用来帮助服务器端重建连接，因此，这个头信息可以被视为一种同步机制

`retry`: 浏览器重新发起连接的时间间隔



### 如何响应Json数据

由于消息只能发送文本，所以服务端的数据可以转成`JSON`发送

```js
// express
app.get('/stream', (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });
  msg = JSON.stringify({
    id: '5616146eakkm44458',
    data: '========================'
	})
	res.write("data: " + msg + "\n\n");
}
```



### 如何实时推送

由于所有的响应都是在某个路由下做的，一般做法是无法在程序的任何位置推送消息的

但是可以在全局保存一个响应方法的引用，在其他地方使用

```js
// 存一个全局引用
let pipe = null

app.get('/stream', (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });
  pip = res
  res.write(`id: 51465161651\n`);
  res.write(`data: helloworld\n`);
  res.write("retry: 1000\n");
  res.write("\n\n");
}
        
setTimeout(()=>{
  pipe.write("data: " + 'hellow world' + "\n\n")
},3000)
```



### 前端接入

```js
// 参数url就是服务器网址，必须与当前网页的网址在同一个网域（domain），而且协议和端口都必须相同
var source = new EventSource(url)

// 建立连接后，触发`open` 事件
source.onopen = (event)=>{
  // ...
}

// 收到消息，触发`message` 事件
source.onmessage = (event)=>{
  // ...
}

// 发生错误，触发`error` 事件
source.onerror = (event)=>{
  // ...
}

// 自定义事件
source.addEventListener('eventName', event => {
  // ...
}, false)

source.close()
```



### SSE与Websocket区别

|            | SSE        | WS       |
| ---------- | ---------- | -------- |
| 双向通信   | 否         | 是       |
| 是否可跨域 | 否         | 是       |
| 数据类型   | UTF8字符串 | 任意     |
| 断线重连   | 自动重连   | 需要配置 |
| 接入成本   | 低         | 高       |



### SSE不支持跨域解决方案

引入第三方的库即可，API跟原生一模一样

解决办法一：`github`地址：[polyfills/EventSource.js at master · remy/polyfills (github.com)](https://github.com/remy/polyfills/blob/master/EventSource.js)

解决办法二：[Yaffle/EventSource: a polyfill for http://www.w3.org/TR/eventsource/ (github.com)](https://github.com/Yaffle/EventSource)
