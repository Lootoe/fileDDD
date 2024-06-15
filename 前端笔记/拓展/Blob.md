## 本地文件下载

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



## 本地图片显示

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



## 文件分片上传

通过`Blob.slice(start,end)`可以分割大`Blob`为多个小`Blob`

``xhr.send`是可以直接发送`Blob`对象的

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



## file/blob转base64

作用：比如腾讯云人脸识别的接口，需要图片或者视频的`Base64`格式

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



## base64转blob

```js
/**
 * Base64转Blob
 * @param dataURL   {String}  base64
 * @param mimeType	{String}  [可选]文件类型，默认为base64中的类型
 * @returns {File}
 */
function base64ToBlob(dataURL, mimeType = null) {
  const arr = dataURL.split(',')
  const defaultMimeType = arr[0].match(/:(.*?);/)[1]
  const bStr = atob(arr[1])
  let n = bStr.length
 	const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bStr.charCodeAt(n)
  }
  return new Blob([u8arr], {type: mimeType || defaultMimeType})
}
```



## blob转file

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



## file转blob

```js
function fileToBlob(file){
	return new Blob([file],{type:file.type})
}
```



## base64转file

浏览器写法：

```js
/**
 * Base64转File
 * @param dataURL   {String}  base64
 * @param fileName	{String}  文件名
 * @param mimeType	{String}  [可选]文件类型，默认为base64中的类型
 * @returns {File}
 */
function base64ToFile(dataURL, fileName, mimeType = null) {
  const arr = dataURL.split(',')
  const defaultMimeType = arr[0].match(/:(.*?);/)[1]
  const bStr = atob(arr[1])
 	const u8arr = new Uint8Array(n)
  let n = bStr.length
  while (n--) {
    u8arr[n] = bStr.charCodeAt(n)
  }
  return new File([u8arr], fileName, {type: mimeType || defaultMimeType})
}
```

`nodeJs`写法：

```js
const arr = dataURL.split(',')
const defaultMimeType = arr[0].match(/:(.*?);/)[1]
const bStr = Buffer.from(arr[1])
let n = bStr.length
const u8arr = new Uint8Array(n)
while (n--) {
   u8arr[n] = String.prototype.charAt(bStr[n])
}
```



## 前端图片压缩和裁剪

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



## blobUrl转Blob







## MIME

[MIME 类型 | 菜鸟教程 (runoob.com)](https://www.runoob.com/http/mime-types.html)

| 类型          | 描述                                                         | 典型示例                                                     |
| :------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `text`        | 表明文件是普通文本，理论上是人类可读                         | `text/plain`, `text/html`, `text/css, text/javascript`       |
| `image`       | 表明是某种图像。不包括视频，但是动态图（比如动态gif）也使用image类型 | `image/gif`, `image/png`, `image/jpeg`, `image/bmp`, `image/webp`, `image/x-icon`, `image/vnd.microsoft.icon` |
| `audio`       | 表明是某种音频文件                                           | `audio/midi`, `audio/mpeg, audio/webm, audio/ogg, audio/wav` |
| `video`       | 表明是某种视频文件                                           | `video/webm`, `video/ogg`                                    |
| `application` | 表明是某种二进制数据                                         | `application/octet-stream`, `application/pkcs12`, `application/vnd.mspowerpoint`, `application/xhtml+xml`, `application/xml`, `application/pdf` |
