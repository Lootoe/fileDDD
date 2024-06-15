## 基础

cookie：[Cookie，document.cookie (javascript.info)](https://zh.javascript.info/cookie)

storage：[LocalStorage，sessionStorage (javascript.info)](https://zh.javascript.info/localstorage)

生命周期：[页面生命周期：DOMContentLoaded，load，beforeunload，unload (javascript.info)](https://zh.javascript.info/onload-ondomcontentloaded)

自定义事件：[创建自定义事件 (javascript.info)](https://zh.javascript.info/dispatch-events)

模块化：[导出和导入 (javascript.info)](https://zh.javascript.info/import-export)





## this指向

想象一下函数调用栈就能知道`this`指向

```js
var name = 222;
var a = {
    name: 111,
    say() {
        console.log(this.name);
    }
}

var fn = a.say;
fn();

a.say()

var b = {
    name: 333,
    say(fn) {
        fn()
    }
}

b.say(a.say)

b.say = a.say;
b.say();
```

1、`fn() => fn.call(window)	=> a.say.call(window)`：222

2、`a.say()	=>	a.say.call(a)`：111

3、`b.say(a.say) => b.say.call(b,a.say)	=> fn() => fn.call(window) => a.say.call(window)` ：222

4、`b.say() => b.say.call(b) =>	a.say.call(b)`：333





## 事件循环

**任务类型**

宏任务：浏览器的任务：如`script`，定时器，I/O，UI交互事件，AJAX

微任务：`Promise.then之类`

**事件循环机制**

1、判断宏任务是同步任务还是异步任务

​		同步：顺序执行至调用栈为空

​		异步：向事件注册表注册

2、异步任务是宏任务还是微任务

​		宏任务：先利用浏览器API执行，再将回调函数放入宏任务队列，等待事件循环轮询

​		微任务：直接放入微任务对列

3、执行微任务队列里的所有任务

4、渲染DOM

5、轮询宏任务队列，取出至调用栈执行，回到第一步





# ArrayBuffer Blob

### 概述

`ArrayBuffer`：前端的一个二进制缓冲区（数组存储在堆，`ArrayBuffer`存储在栈，因为数据是连续的）

`Blob`：用于文件操作的二进制对象



### Blob文件下载

通过`URL.createObjectURL(blob)`生成`BLob URL`，赋值给`a`标签`download`属性

`Blob URL`示例：`blob:d3958f5c-0777-0845-9dcf-2cb28783acaf`，它指向`Blob`，没有在服务端存储的意义

```html
<!-- html部分 -->
<a id="h">点此进行下载</a>
<!-- js部分 -->
<script>
  var blob = new Blob(["Hello World"]);
  var url = window.URL.createObjectURL(blob);
  var a = document.getElementById("h");
  a.download = "helloworld.txt";
  a.href = url;
</script> 
```

### Blob本地图片显示

`URL.createObjectURL(blob)`生成的`Blob URL`还可以赋给`img.src`，从而实现图片的显示

```html
<!-- html部分 -->
<input type="file" id='f' />
<img id='img' style="width: 200px;height:200px;" />
<!-- js部分 -->
<script>
  document.getElementById('f').addEventListener('change', function (e) {
    var file = this.files[0];
    const img = document.getElementById('img');
    const url = window.URL.createObjectURL(file);
    img.src = url;
    img.onload = function () {
        // 释放一个之前通过调用 URL.createObjectURL创建的 URL 对象
        window.URL.revokeObjectURL(img.src);
    }
  }, false);
</script>
```

### Blob文件分段上传

通过`Blob.slice(start,end)`可以分割大`Blob`为多个小`Blob`，`xhr.send`是可以直接发送`Blob`对象的

```html
<!-- html部分 -->
<input type="file" id='f' />
<!-- js部分 -->
<script>
function upload(blob) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/ajax', true);
    xhr.setRequestHeader('Content-Type', 'text/plain')
    xhr.send(blob);
}

document.getElementById('f').addEventListener('change', function (e) {
    var blob = this.files[0];
    const CHUNK_SIZE = 20; .
    const SIZE = blob.size;
    var start = 0;
    var end = CHUNK_SIZE;
    while (start < SIZE) {
        upload(blob.slice(start, end));
        start = end;
        end = start + CHUNK_SIZE;
    }
}, false);
</script>
```





## FileReader

### 实例属性

`FileReader.error` : 表示在读取文件时发生的错误

`FileReader.readyState` : 整数，表示读取文件时的当前状态：0(未加载) | 1(正在加载) | 2(加载完成)

`FileReader.result` 读取完成后的文件内容

### 实例事件

`FileReader.onabort` : 该事件在读取操作被中断时触发

`FileReader.onerror` : 该事件在读取操作发生错误时触发

`FileReader.onload` : 该事件在读取操作完成时触发

`FileReader.onloadstart` : 该事件在读取操作开始时触发

`FileReader.onloadend` : 该事件在读取操作结束时（要么成功，要么失败）触发

`FileReader.onprogress` : 该事件在读取Blob时触发

### 实例方法

`FileReader.readAsText(Blob)：`将Blob转化为文本字符串

`FileReader.readAsArrayBuffer(Blob)：` 将`Blob`转为`ArrayBuffer`格式数据

`FileReader.readAsDataURL(blob): `将`Blob`转化为`Base64`格式的`Data URL`

### BASE64的DataURL

避免使用`DataURL`，这里不再赘述



# 类型互转

`ArrayBuffer`转`Blob`：`const blob = new Blob([buffer])`

`Blob`转`ArrayBuffer`：`const buffer = new FileReader().readAsBuffer(blob)`

`File`转`BASE64`：

```js
/**
 * 获取文件的Base64
 * @param file      {File}      文件
 * @param callback  {Function}  回调函数，参数为获取到的base64
 */
function fileToBase64(file, callback) {
  const fileReader = new FileReader()
  fileReader.readAsDataURL(file)
  fileReader.onload = function () {
    callback(this.result)
  }
}
```

base64转Blob

```js
/**
 * Base64转Blob
 * @param dataURL   {String}  base64
 * @param mimeType	{String}  [可选]文件类型，默认为base64中的类型
 * @returns {File}
 */
function base64ToBlob(dataURL, mimeType = null) {
  const arr = dataURL.split(','),
  	defaultMimeType = arr[0].match(/:(.*?);/)[1],
  	bStr = atob(arr[1]),
  	n = bStr.length,
  	u8arr = new Uint8Array(n)
  let n = bStr.length
  while (n--) {
    u8arr[n] = bStr.charCodeAt(n)
  }
  return new Blob([u8arr], {type: mimeType || defaultMimeType})
}
```

blob转file

```js
/**
 * Blob转File
 * @param blob     {Blob}   blob
 * @param fileName {String} 文件名
 * @param mimeType {String} 文件类型
 * @return {File}
 */
function blobToFile (blob, fileName, mimeType) {
  return new File([blob], fileName, {type: mimeType})
}
```

base64直接转file

```js
/**
 * Base64转File
 * @param dataURL   {String}  base64
 * @param fileName	{String}  文件名
 * @param mimeType	{String}  [可选]文件类型，默认为base64中的类型
 * @returns {File}
 */
function base64ToFile(dataURL, fileName, mimeType = null) {
  const arr = dataURL.split(','),
  	defaultMimeType = arr[0].match(/:(.*?);/)[1],
  	bStr = atob(arr[1]),
  	n = bStr.length,
  	u8arr = new Uint8Array(n)
  let n = bStr.length
  while (n--) {
    u8arr[n] = bStr.charCodeAt(n)
  }
  return new File([u8arr], fileName, {type: mimeType || defaultMimeType})
}
```

```js
/**
 * 图片压缩和尺寸裁剪
 * @param file          {File}      图片文件
 * @param quality       {Number}    生成图片质量，0.0~1.0之间，质量越小、文件越小、图片越模糊
 * @param callback      {Function}  回调方法，参数为原文件(小于阈值的情况下)或压缩后的新文件
 * @param sizeThreshold {Number}    [可选]大小阈值，单位：B，默认500K
 * @param targetWidth   {Number}    [可选]生成图片的宽度，单位：px，默认800
 * @param targetHeight  {Number}    [可选]生成图片的高度，单位：px，默认值按宽度自适应获取
 */
function pressImg (file, quality, callback, sizeThreshold = 512000, targetWidth = 800, targetHeight = null) {
  if (!file || !callback) {
    console.error('pressImg参数不完整！')
    return
  }
  if (!file.type.includes('image')) {
    console.error('文件格式非图片')
    return
  }

  fileToBase64(file, function (base64) {
    if (base64) {
      const image = new Image()
      image.src = base64
      image.onload = function () {
        if (file.size <= sizeThreshold && this.width <= targetWidth) {// 大小、宽度均小于阈值，则不需处理，返回原文件
          return callback(file)
        }
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const scale = this.width / this.height
        canvas.width = targetWidth
        canvas.height = targetHeight || (targetWidth / scale)
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        const dataURL = canvas.toDataURL(file.type, quality)
        const newFile = base64ToFile(dataURL, file.name)
        callback(newFile)
      }
    }
  })
}
```



# encodeURIComponent

`encodeURI`：不会对本身属于URL的特殊字符进行编码，例如冒号、正斜杠、问号和井字号，除了空格之外的其他字符都原封不动

`encodeURIComponent`：会对整个URL的非法字符进行编码

一般来说,我们使用`encodeURIComponent`方法的时候要比使用`encodeURI`更多

因为在实践中更常见的是对查询字符串参数而不是对基础URL进行编码

```js
var uri="http://www.jxbh.cn/illegal value.htm#start"

//”http://www.jxbh.cn/illegal%20value.htm#start”
alert(encodeURI (uri))

//”http%3A%2F%2Fwww.jxbh.cn%2Fillegal%20value.htm%23start”
alert( encodeURIComponent (uri))
```
