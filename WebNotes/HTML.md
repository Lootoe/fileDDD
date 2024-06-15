# 标签：`<a></a>`

## 链接样式

CSS的书写顺序必须按照如下，`link`，`visited`顺序无所谓

- `link`：未访问状态，字体颜色为蓝色
- `visited`：已访问状态，字体颜色为紫色
- `focus`：聚焦时的状态，可通过`Tab`键聚焦元素，聚焦时会出现边框（不同浏览器样式不一致）
- `hover`：鼠标悬停状态，`a标签`聚焦后，如果鼠标悬浮在其上，应该展示悬浮样式，所以`hover`在`focus`后面才能覆盖`focus`样式
- `active`：鼠标点击时状态，字体颜色为红色，而在`a标签`被悬浮时，若此时点击鼠标不松开，则此时需要呈现点击的样式，因此`active`位于`hover`后面



## 链接打开方式

- `_self`：当前页面打开链接
- `_blank`：新窗口打开链接
- `_parent`：在当前框架的父框架打开页面
- `_top`：在当前框架的顶层框架打开页面



## 页内跳转

页面内跳转，如下将跳转至本页面的`h1`锚点位置

```javascript
<a href="#h1">a</a>
<h1 id="h1">h1<h1>
```

跳转至其他页面的指定位置，如下将跳转至`other.html`页面中的`p`锚点位置

```javascript
<a href="other.html#p">a</a>
```



## 打电话

拨打`10086`

```javascript
<a href="tel:10086">10086</a>
复制代码
```

拨打客服电话`400`

```javascript
<a href="tel:400-888-8888">400-888-8888</a>
```



## 发短信

发送短信至单个号码。

```javascript
<a href="sms:10086">10086</a>
```

发送短信至多个号码

```javascript
<a href="sms:10086,10000">10086,10000</a>
```

发送短信`DX`到`10086`，注意安卓系统使用`?`连接发送内容，`IOS`系统使用`&`连接发送内容

由于不同手机厂商或浏览器厂商对此标准支持度不同，最好还是不带`body`

```javascript
<a href="sms:10086?body=DX">DX</a>
```



## 下载文件

下载图片，其中`href`为图片路径

```javascript
<a href="./image.png" download>image</a>
```

下载图片并指定下载名

```javascript
<a href="./image.png" download="name.png">image</a>
```

`download`属性注意事项如下

- 浏览器不能直接打开的文件（如`txt`、`zip`等），不指定`download`属性也会直接下载
- 浏览器可以直接打开的文件（如`png`、`css`、`js`、`html`等），需指定`download`属性才能下载
- `download`属性值可以不指定后缀名，下载时浏览器会自动补充
- `download`属性值指定了错误的后缀名，文件下载后将无法打开预览

由于浏览器的限制，若下载的文件与页面不同源，浏览器不会执行下载而是直接打开

如下若页面地址为`http://127.0.0.1:3000`，点击`a`标签将不会下载而是在浏览器打开

```javascript
<a href="https://www.baidu.com/logo.png" download>baidu</a>
```



## 下载非同源图片：dataURL

资源没有设置跨域头时，即使设置了允许图片跨域也无法访问

如下使用`data：URLs`的方式下载图片，首先通过`canvas`绘制图片

然后再使用`canvas.toDataURL`获取图片`base64`编码，最后再通过`a`标签完成下载

```js
<a href="javascript:void(0);" onclick="downloadFile(event)" src='https://www.baidu.com/logo.png'>download</a>
<script>
  function downloadFile(e) {
    const url = e.target.getAttribute('src')
    const image = new Image()

    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = image.width
      canvas.height = image.height

      ctx.drawImage(image, 0, 0, image.width, image.height)

      const ext = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase()
      const name = image.src.substring(image.src.lastIndexOf('/') + 1)
      const dataURL = canvas.toDataURL('image/' + ext)

      const a = document.createElement('a')
      a.href = dataURL
      a.download = name
      a.click()
    }
  }
</script>
```



## 下载非同源图片：BlobURL

资源没有设置跨域头时，即使设置了允许图片跨域也无法访问

如下使用`blob：URLs`的方式下载图片，通过使用`canvas.toBlob`获取到`blob`对象

然后再通过`URL.createObjectURL`获取到`blob`对象的一个内存`URL`，并且一直存储在内存中

直到`document`触发了`unload`事件或者执行`revokeObjectURL`来释放

```js
<a href="javascript:void(0);" onclick="downloadFile(event)" src='https://www.baidu.com/logo.png'>download</a>
<script>
  function downloadFile(e) {
    const url = e.target.getAttribute('src')
    const image = new Image()

    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const name = image.src.substring(image.src.lastIndexOf('/') + 1)

      canvas.width = image.width
      canvas.height = image.height

      ctx.drawImage(image, 0, 0, image.width, image.height)

      canvas.toBlob(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')

        a.href = url
        a.download = name
        a.click()
        a.remove()

        window.URL.revokeObjectURL(url)
      })
    }
  }
</script>
```



## 下载非同源图片：Axios

```js
<a href="javascript:void(0);" onclick="downloadFile(event)" src='http://www.baidu.com/txt.txt'>download</a>
<script>
  function downloadFile(e) {
    const url = e.target.getAttribute('src')
    const name = url.substring(url.lastIndexOf('/') + 1)

    axios.get(url, { responseType: 'blob' }).then(res => {
      const blob = res.data
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = name
      a.click()
      a.remove()

      window.URL.revokeObjectURL(url)
    })
  }
</script>
```





# 标签：`<img></img>`

## 可替换元素

`HTML`元素可分为可替换元素和不可替换元素

绝大多数的`HTML`元素都是不可替换元素，其内容由`DOM`内容决定，例如`<p>hello world</p>`，展示的内容就是文本节点`hello world`

而对于可替换元素，其内容则由元素的标签和属性决定，例如`<img>`元素的内容实际是由`src`属性读取的图片的原始宽高来确定的

可替换元素一般有内在尺寸，所以具有`width`和`height`，因此可以修改，默认显示为图片的原始宽高



## 常用属性

`src`：指定嵌入图片的路径

`alt`：指定图像无法显示或用户禁用时的替代文本

`width`：指定图像的宽度，单位为`px`或者百分比

`height`：指定图片的高度，单位为`px`或者百分比



## 为什么给图片指定宽高

通常不指定图片宽高，浏览器在解析时无法知晓图片的尺寸，也就无法为图像保留合适的空间

因此图像加载完成时，页面的布局就会发生变化，造成页面重排

而指定图片宽高，浏览器在解析时就预留了位置

图片加载完成时，浏览器则自动调整图片，使其适应此预留空间，避免了页面某些内容的移动

但同时指定`width`和`height`是可能会造成图片拉伸扭曲的

若要图片正常显示，可以使用标准宽高的图片或者利用`CSS`的 [object-fit - CSS（层叠样式表） | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit) 来调整



## crossOrigin

当我们需要在Canvas中中对**第三方站点**图片进行`toBlob() 、 toDataURL() 、 getImageData()` 操作时就会跨域

当然前提条件是这个第三方站点允许跨域请求图片

`crossorigin`有两个参数：

- `anonymous`：跨域请求，但不携带认证信息
- `use-credentials`：跨域请求，携带认证信息

>响应头中`access-control-allow-credentials`为`true`，表示允许请求中携带凭证信息
>
>而其它情况，不符合要求，浏览器将不会把响应内容返回



## loading

指定浏览器加载图片的方式，

- `eager`：立即加载图像
- `lazy`：延迟加载图像，图片到可视视口时才会加载



## align

指定图像相对于周围上下文的对齐方式

`left`：左浮动，等价于`float: left`

`right`：右浮动，等价于`float: right`

`middle`：中央对齐，等价于`vertical-align: -moz-middle-with-baseline`

`top`：顶部对齐，等价于`vertical-align: top`

`bottom`：底部对齐，等价于`vertical-align: baseline`



## 事件

`onload`：图像加载完成，会触发`onload`属性指定的回调函数

```js
// HTML 代码为 <img src="example.jpg" onload="loadImage()">
function loadImage() {
  console.log('Image is loaded');
}
```

`onerror`：图像加载过程中发生错误，会触发`onerror`属性指定的回调函数

```
// HTML 代码为 <img src="image.gif" onerror="myFunction()">
function myFunction() {
  console.log('There is something wrong');
}
```







# 标签：`<input></input>`

## 类型

```html
<form action = "111.php" method = "get">
  姓名：<input type = "text" name = "username" value = "请输入用户名"/><br />
  
  密码：<input type = "password"" name = "password" value = "请输入密码"/><br />
  
  性别： 男<input type = "radio" name = "sex" value = "男"/> 
         女<input type = "radio" name = "sex" value = "女"/><br />
         
  爱好：篮球<input type = "checkbox"" name = "爱好" value = "篮球"/> 
        足球<input type = "checkbox"" name = "爱好" value = "足球"/><br />

  <input type = "submit" name = "submit" value = "免费注册"/> <br />
          
  // submit类型用于定义一个重置页面按钮，点击按钮后，会将页面重置到刚打开的状态
  <input type = "reset" name = "reset" value = "重置页面"/> <br />
  
  <input type = "button" name = "button" value = "登录"/> <br />
  
  <input type = "file" name = "file" value = "上传图片"/> <br />
          
  // image类型用于定义一个图片提交按钮，功能与submit类型一致，只是按钮形式为图片
  <input type = "image" name = "image"  src = "草莓.jpg" value = "图片提交按钮"/> <br />
</form>
```



## hidden类型

当某一个表单项的内容仅供展示，不可让用户编辑时

可以通过添加`disabled="disabled"`属性实现，使得该表单项变灰，整体被禁用不可编辑

`<input type="hidden" name="id" value="1001" disable/>`

但是，加上该属性之后，进行表单提交时，该表单项的内容会被忽略掉，解决方法是再添加一个隐藏的表单项，进行数据的临时保存

```html
<input type="hidden" name="id" value="1001" disable/>
<input type="text" name="id" value="1001"/>
```



## input搜索框在移动端的兼容

在移动端中，我们会发现，回车键只是普通的回车键标识。

为了让回车键变为搜索标志，我们可以在input标签中加入`type="search"`的属性，即：

```html
<input type="search" />
```

然而在ios系统中，回车键仍然是普通的回车键标识，为了让ios系统也变成搜索标志，我们需要将input标签用form包裹起来

但是我们只想要做搜索框时，会触发表单的提交，从而不能有效地结合回车键事件

所以必须阻止表单的默认行为，我们可以这样做

```html
<form action="JavaScript:return true;">
    <input type="search"/>
</form>
```



## 阻止浏览器拼写检查

很简单，只需要在**输入框**标签上加上一个属性`spellcheck=false`即可

```html
<input spellcheck=false />
<textarea spellcheck=false />
```



## 修改Placeholder样式

```css
input::-webkit-input-placeholder{
   color:red;
}
```

针对不同浏览器或不同版本的浏览器要添加对应的前缀

```css
/* Mozilla Firefox 19+ */
input::-moz-placeholder{ 
	color:red;
}

/* Mozilla Firefox 4 to 18 */
input:-moz-placeholder{
	color:red;
}

/* Internet Explorer 10-11 */
input:-ms-input-placeholder{ 
	color:red;
}
```



## Accept属性

目前浏览器拉起手机相机的有两种方式`MediaDevices.getUserMedia()`和使用`input`标签

可以通过`input.files`拿到获取的文件

```html
只调相机：<input type="file" accept="image/*" capture="camera">
调前置相机：<input type="file" accept="image/*" capture="user">
只调摄像机：<input type="file" accept="video/*" capture="camcorder">
调前置摄像机：<input type="file" accept="video/*" capture="user">
只调录音机：<input type="file" accept="audio/*" capture="microphone">
```



## 功能属性

```html
聚焦文本框：	<input type='number' autofocus="autofocus" />
禁用文本框：	<input type="text" disabled="disabled" />
限制输入长度：	<input type="text" maxlength="6" />
只读文本框：	<input type="text" readonly="readonly" value="只读" />
复选框默认选中：<input type="checkbox" checked="checked"/>
只选择word文档<input type="file" accept=".doc" onchange="inputFn(event)"/>
只选择excel文档<input type="file" accept=".xlsx" onchange="inputFn(event)"/>
只选择png图片文件<input type="file" accept=".png" onchange="inputFn(event)"/>
只选择jpg图片文件<input type="file" accept=".jpg" onchange="inputFn(event)"/>
```

看了上面的代码，相信大家就理解了，`accept`是定义选择文件类型的一个属性

而且也只适用于 `file`类型，而`file`类型默认一次只选择一个文件，要是想一次选择多个文件呢

这时，又一个和`file`类型配合使用的属性出场，那就是 `multiple`

```html
<input type="file" accept="image/*" onchange="inputFn(event)" multiple="multiple"/>
```



## input事件汇总

`onfocus`：当input 获取到焦点时触发

`onblur`：当input失去焦点时触发，注意：这个事件触发的前提是已经获取了焦点再失去焦点的时候才会触发该事件，用于判断标签为空。

`onchange`：当input失去焦点并且它的value值发生变化时触发，个人感觉可以用于注册时的确认密码。

`onkeydown`：按下按键时的事件触发，

`onkeyup`：当按键抬起的时候触发的事件，在该事件触发之前一定触发了onkeydown事件--相当于一个按键，两个事件，没怎么用过

`onclick`：主要是用于 input type=button，input作为一个按钮使用时的鼠标点击事件

`onselect`：当input里的内容文本被选中后执行，只要选择了就会触发，不是全部选中

`oninput`：当input的value值发生变化时就会触发，（与onchange的区别是不用等到失去焦点就可以触发了）

时间顺序：`mousedown -> focus -> mouseup -> click`







# 标签：`<meta></meta>`

## 属性大全

```html
<!-- 定义文档的字符编码 -->
<meta charset="utf-8" /> 
<!-- 强制Chromium内核，作用于360浏览器、QQ浏览器等国产双核浏览器 -->
<meta name="renderer" content="webkit"/>
<!-- 强制Chromium内核，作用于其他双核浏览器 -->
<meta name="force-rendering" content="webkit"/>
<!-- 如果有安装 Google Chrome Frame 插件则强制为Chromium内核，否则强制本机支持的最高版本IE内核，作用于IE浏览器 -->
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1"/>
<!-- 
    设置视窗大小
    width	设置layout viewport  的宽度，为一个正整数，或字符串"width-device"
    initial-scale	设置页面的初始缩放值，为一个数字，可以带小数
    minimum-scale	允许用户的最小缩放值，为一个数字，可以带小数
    maximum-scale	允许用户的最大缩放值，为一个数字，可以带小数
	shrink-to-fit=no IOS9中要想前面的属性起作用需要加上这个
    height	设置layout viewport  的高度，这个属性对我们并不重要，很少使用
    user-scalable	是否允许用户进行缩放，值为"no"或"yes", no 代表不允许，yes代表允许
-->
<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<!-- 页面描述 -->
<meta name="description" content="不超过150个字符"/>
<!-- 页面关键词 -->
<meta name="keywords" content=""/>
<!-- 网页作者 -->
<meta name="author" content="name, email@gmail.com"/>
<!-- 
    搜索引擎抓取
    all：文件将被检索，且页面上的链接可以被查询； 
    none：文件将不被检索，且页面上的链接不可以被查询；
    index：文件将被检索； 
    follow：页面上的链接可以被查询； 
    noindex：文件将不被检索； 
    nofollow：页面上的链接不可以被查询。 
-->
<meta name="robots" content="index,follow"/>
<!-- 忽略页面中的数字识别为电话，忽略email识别-->
<meta name="format-detection" content="telphone=no, email=no"/>

<!-- IOS begin -->
<!-- 添加到主屏后的标题（iOS 6 新增） -->
<meta name="apple-mobile-web-app-title" content="标题">
<!-- 当网站添加到主屏幕快速启动方式，可隐藏地址栏，仅针对ios的safari (ios7.0版本以后，safari上已看不到效果) -->
<meta name="apple-mobile-web-app-capable" content="yes"/>
<!-- 是否启用 WebApp 全屏模式，删除苹果默认的工具栏和菜单栏 -->
<meta name="apple-touch-fullscreen" content="yes"/>
<!-- 添加智能 App 广告条 Smart App Banner（iOS 6+ Safari） -->
<meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL">
<!-- 设置苹果工具栏颜色:默认值为 default（白色），可以定为 black（黑色）和 black-translucent（灰色半透明） -->
<meta name="apple-mobile-web-app-status-bar-style" content="black"/>
<!-- 不让百度转码 -->
<meta http-equiv="Cache-Control" content="no-siteapp" />
<!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
<meta name="HandheldFriendly" content="true">
<!-- 微软的老式浏览器 -->
<meta name="MobileOptimized" content="320">
<!-- uc强制竖屏 -->
<meta name="screen-orientation" content="portrait">
<!-- QQ强制竖屏 -->
<meta name="x5-orientation" content="portrait">
<!-- UC强制全屏 -->
<meta name="full-screen" content="yes">
<!-- QQ强制全屏 -->
<meta name="x5-fullscreen" content="true">
<!-- UC应用模式 -->
<meta name="browsermode" content="application">
<!-- QQ应用模式 -->
<meta name="x5-page-mode" content="app">
<!-- windows phone 点击无高光 -->
<meta name="msapplication-tap-highlight" content="no">

<!-- 
    iOS 图标 begin 
    网站添加至ios桌面时的图标
-->
<!-- iPhone 和 iTouch，默认 57x57 像素，必须有 -->
<link rel="apple-touch-icon-precomposed" sizes="57x57" href="table_ico57.png">
<!-- Retina iPhone 和 Retina iTouch，114x114 像素，可以没有，但推荐有 -->
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="table_ico72.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="table_ico114.png">
<!-- Retina iPad，144x144 像素，可以没有，但推荐有 -->
<link rel="apple-touch-icon-precomposed" sizes="144x144" href="table_ico144.png">

<!-- iOS 启动画面 begin -->
<!-- iPad 竖屏 768 x 1004（标准分辨率） -->
<link rel="apple-touch-startup-image" sizes="768x1004" href="/splash-screen-768x1004.png"/>
<!-- iPad 横屏 1024x748（标准分辨率） -->
<link rel="apple-touch-startup-image" sizes="1024x748" href="/Default-Portrait-1024x748.png"/>
<!-- iPad 竖屏 1536x2008（Retina） -->
<link rel="apple-touch-startup-image" sizes="1536x2008" href="/splash-screen-1536x2008.png"/>
<!-- iPad 横屏 2048x1496（Retina） -->
<link rel="apple-touch-startup-image" sizes="2048x1496" href="/splash-screen-2048x1496.png"/>
<!-- iPhone/iPod Touch 竖屏 320x480 (标准分辨率) -->
<link rel="apple-touch-startup-image" href="/splash-screen-320x480.png"/>
<!-- iPhone/iPod Touch 竖屏 640x960 (Retina) -->
<link rel="apple-touch-startup-image" sizes="640x960" href="/splash-screen-640x960.png"/>
<!-- iPhone 5/iPod Touch 5 竖屏 640x1136 (Retina) -->
<link rel="apple-touch-startup-image" sizes="640x1136" href="/splash-screen-640x1136.png"/>
<!-- IOS end -->

<!-- Windows 8 磁贴颜色 -->
<meta name="msapplication-TileColor" content="#000"/>
<!-- Windows 8 磁贴图标 -->
<meta name="msapplication-TileImage" content="icon.png"/>
<!-- 添加 RSS 订阅 -->
<link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml"/>

<!-- sns 社交标签 begin -->
<!-- 参考微博API -->
<meta property="og:type" content="类型" />
<meta property="og:url" content="URL地址" />
<meta property="og:title" content="标题" />
<meta property="og:image" content="图片" />
<meta property="og:description" content="描述" />
<!-- sns 社交标签 end -->
```



## 强制低版本IE更新浏览器

我们可以使用 if IE 语句给网站添加IE升级提示，提示用户进行浏览器升级，或者切换更先进的浏览器再访问

我们可以在刚刚的meta标签下添加一段跳转到IE升级提示页的代码（当IE版本低于IE11时跳转），实现低版本IE用户访问时提示他们进行升级或者更换浏览器

强制Webkit内核和提示低版本IE访问用户升级完整代码如下所示，把这段代码添加到头部模板文件标签下即可：

```html
<meta name="renderer" content="webkit"/>
<meta name="force-rendering" content="webkit"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
<script>/*@cc_on window.location.href="http://support.dmeng.net/upgrade-your-browser.html?referrer="+encodeURIComponent(window.location.href); @*/</script>
```

@cc_on 是 IE10 及更旧版IE特有的条件编译语句，因此可以用来判断是否除 IE11 以外的其他IE版本

因为低版本IE访问时因为不兼容CSS3和HTML5网站往往是错版的，添加了上面这段代码

当低版本IE用户访问时就会跳转到升级提示页，避免不必要的资源加载，降低网站服务器开销



## 厂商定制

同样分享页面到 QQ 的聊天窗口，有些页面直接就是一个链接，但是有些页面有标题，图片，还有文字介绍

为什么区别这么明显呢？其实就是看有没有设置下面这三个内容

```html
<meta itemprop="name" content="这是分享的标题" />
<meta
  itemprop="image"
  content="http://imgcache.qq.com/qqshow/ac/v4/global/logo.png"
/>
<meta name="description" itemprop="description" content="这是要分享的内容" />
```



## 获取自定义meta

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta custom="diyProp" content="my name is ttw" />
    <title>Document</title>
  </head>
  <body>
    <script>
      const metas = document.getElementsByTagName("meta");
      let ctx = "";
      for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("custom") === "diyProp") {
          ctx = metas[i].getAttribute("content");
        }
      }
      console.log(ctx);
    </script>
  </body>
</html>
```







# 存储

[Window.localStorage - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)

[Window.localStorage - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)

[Window.localStorage - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)

cookie 是网站为了标示用户身份而储存在用户本地终端（Client Side）上的数据（通常经过加密）

cookie 数据始终在同源的 http 请求中携带（即使不需要），记会在浏览器和服务器间来回传递

sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地保存

sessionStorage 不能共享，localStorage 在同源文档之间共享，cookie 在同源且符合 path 规则的文档之间共享

存储大小：

- cookie 数据大小不能超过 4k。
- sessionStorage 和 localStorage 虽然也有存储大小的限制，但比 cookie 大得多，可以达到 5M 或更大

有效期（生命周期）：

- localStorage: 存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；
- sessionStorage: 数据在当前浏览器窗口关闭后自动删除
- cookie: 设置的 cookie 过期时间之前一直有效，即使窗口或浏览器关闭







# 浏览器工作原理

## 地址栏输入URL

- 浏览器根据输入的URL进行DNS解析，查找域名的IP地址，
- 浏览器与对应Web服务器建立TCP连接
- 浏览器发送HTTP请求
- Web服务器返回HTML文件
- 浏览器解析渲染网页



## 浏览器解析HTML

- 解析`head`标签，关于页面的一些配置标签，例如`<title>、<meta>`等，以后再进行剖析
- 遇到内联CSS与JS立即解析执行
- 碰到外部CSS和JS会并发请求相关资源，然后解析执行
- 接着，浏览器开始解析`<body>`里的内容
- 碰到需要获取其他地址内容的标签，例如`<img>、<script>`，会并发请求相关资源
- 当HTML解析器遇到`<script>`标签时，默认必须先执行脚本，然后再恢复文档的解析和渲染



### 脚本解析

- 遇到`script`标签，暂停解析HTML，阻塞地下载脚本，然后执行，执行完成后恢复解析
- defer属性，先异步下载脚本，等待HTML解析完毕后再执行脚本
- async属性，先异步下载脚本，下载完成后暂停解析HTML，等待脚本执行后恢复解析
- 延迟脚本会按照他们在文档里的出现顺序来执行
- 异步脚本在他们载入后执行，可能会无序执行



### 浏览器渲染流程

- 解析HTML生成DOM树
- 解析CSS生成CSS规则树
- 将DOM树和CSS规则树合并生成渲染树
- 根据渲染树来布局，以计算每个节点（标签/元素）的几何信息
- 将各个节点绘制到屏幕上

| 概念      | 说明                                                       |
| --------- | ---------------------------------------------------------- |
| DOM树     | 浏览器解析HTML成树形的数据结构                             |
| CSS规则树 | 浏览器解析CSS成树形的数据结构                              |
| 渲染树    | DOM树和CSS规则树合并后生成渲染树                           |
| 布局      | 根据渲染树所确定的每个节点的几何信息                       |
| 重排      | 当某个部分变化影响到布局时，需要重新解析该部分渲染树       |
| 重绘      | 改变某个元素的颜色时，不影响布局，此时会重绘，重新绘制颜色 |



### 如何减少发生重排

- 使DOM脱离文档流

- 修改CSS时采用文本批量修改或者修改类

- 修改DOM时，先使用`display:none`，再使用`display:block`

- 批量操作DOM

- 避免反复操作样式

- 使用文档片段







## SEO

### 合理的TDK

TDK（title、description、keywords）有利于SEO（搜索引擎优化）

```html
<title>website</title>
<meta name="keywords" content="fruits animals">
<meta name="description" content="you can buy anithing">
```

### 合理的LOGO

1、最外层包裹h1标签

2、img包裹a标签连接到首页

3、img标签添加alt

### 标签权重表

| 标签           | 权重 |
| -------------- | ---- |
| 内部链接文字   | 10   |
| 标题           | 10   |
| 域名           | 7    |
| h1-2           | 5    |
| 段首           | 5    |
| 路径或者文件名 | 4    |
| 加粗/斜体      | 1    |
| alt            | 1    |
| title          | 0.5  |
| description    | 0.5  |
| keywords       | 0.05 |







# 其他

## DOCTYPE

`HTML`：超文本标记语言

在`HTML 4.01`中，`<!DOCTYPE>`声明引用`DTD`，因为`HTML 4.01`基于`SGML`

`DTD`规定了标记语言的规则，这样浏览器才能正确地呈现内容

除非你的`HTML`确定了一个正确的`DOCTYPE`，否则标识和`CSS`都不会生效

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```

`DOCTYPE`是`document type`(文档类型)的简写，用来说明使用的`HTML`是什么版本，让浏览器识别如何解析文档

`HTML5` 不基于 `SGML`，所以不需要引用 `DTD`

```html
<!DOCTYPE html>
<html>
    <head>
        <title></title>
    </head>
    <body>

    </body>
</html>
```





## HTML语义化

1、用正确的标签做正确的事情

2、让页面的内容结构化，结构更清晰，便于SEO与浏览器解析

3、即使在没有样式 CSS 情况下也以一种文档格式显示，并且是容易阅读的

4、便于开发者阅读维护理解





## 行内元素、块级元素

### 常见的元素

常见的块级元素：`p、div、form、ul、li、ol、table、h1、h2、h3、h4、h5、h6、dl、dt、dd`

常见的行级元素：`span、a、img、button、input、select`

### 块级元素

- 总是在新行上开始，就是每个块级元素独占一行，默认从上到下排列
- 宽度缺少时是它的容器的100%，除非设置一个宽度
- 高度、行高以及外边距和内边距都是可以设置的
- 块级元素可以容纳其它行级元素和块级元素

### 行内元素

- 和其它元素都会在一行显示
- 宽度和高度适应内容宽度，不可设置宽高
- 设置`margin`只有左右有效，上下无效
- 设置`padding`只有左右有效，上下无效
- 行级元素只能容纳文本或者其它行内元素





## 怪异模式

页面如果写了DTD，就意味着这个页面采用对CSS支持更好的布局，而如果没有，则采用兼容之前的布局方式

这就是Quirks模式，有时候也叫怪癖模式、诡异模式、怪异模式

区别：总体会有布局、样式解析、脚本执行三个方面区别，这里列举一些比较常见的区别：

- `盒模型`：在W3C标准中，如果设置一个元素的宽度和高度，指的是元素内容的宽度和高度，然而在Quirks模式下，IE的宽度和高度还包含了padding和border
- `设置行内元素的高宽`：在Standards模式下，给行内元素设置width和height都不会生效，而在Quriks模式下会生效
- `用margin：0 auto设置水平居中`:在Standards模式下，设置margin：0 auto；可以使元素水平居中，但是在Quriks模式下失效
- `设置百分比高度`:在Standards模式下，元素的高度是由包含的内容决定的，如果父元素没有设置百分比的高度，子元素设置百分比的高度是无效的





## 常用浏览器及其内核

| 浏览器  | 内核           |
| ------- | -------------- |
| Chrome  | Chromium/Blink |
| Firefox | Presto         |
| Opera   | Gecko          |
| Safari  | Webkit         |
| IE      | Trident        |
|         |                |





## encodeURIComponent

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





## Base64编码问题

[Base64 的编码与解码 - 术语表 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Glossary/Base64#solution_.232_.e2.80.93_rewriting_atob_and_btoa_using_typedarrays_and_utf-8)





## 随机数

### TypeArray

包含 [`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array), [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray), [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array), [`Uint16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array), [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array), [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array), [`BigInt64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array), [`BigUint64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigUint64Array) 

但是不包含浮点数的数组

构造函数：

```js
const array = new Int8Array(4);
console.log(array);  //[0,0,0,0],返回一个长度为10的数组，数组中每一项都是8位2进制补码产生的10进制数
```

### getRandomValues

将TypeArray中的所有数据进行替换为随机数

```js
const array = new Int8Array(4);
const num = crypto.getRandomValues(array);
console.log(num); //[-41,25,112,-51]
```

### randomUUID

包含随机生成的36个字符长v4 UUID的字符串

```js
let uuid = crypto.randomUUID();
console.log(uuid); // for example "36b8f84d-df4e-4d49-b662-bcde71a8764f"
```







# H5API

## Blob

### 概述

`ArrayBuffer`：前端的一个二进制缓冲区（数组存储在堆，`ArrayBuffer`存储在栈，因为数据是连续的）

`Blob`：浏览器内部数据的引用，用于文件操作的二进制对象

### 类型互转

`ArrayBuffer`转`Blob`：`const blob = new Blob([buffer])`

`Blob`转`ArrayBuffer`：`const buffer = new FileReader().readAsBuffer(blob)`

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

**实例属性**：均只读

- `FileReader.error` : 表示在读取文件时发生的错误
- `FileReader.readyState` : 整数，表示读取文件时的当前状态：0(未加载) | 1(正在加载) | 2(加载完成)
- `FileReader.result` 读取完成后的文件内容

**实例事件**

`FileReader.onabort` : 该事件在读取操作被中断时触发

`FileReader.onerror` : 该事件在读取操作发生错误时触发

`FileReader.onload` : 该事件在读取操作完成时触发

`FileReader.onloadstart` : 该事件在读取操作开始时触发

`FileReader.onloadend` : 该事件在读取操作结束时（要么成功，要么失败）触发

`FileReader.onprogress` : 该事件在读取Blob时触发

**实例方法**

`FileReader.readAsText(Blob)：`将Blob转化为文本字符串

```html
<input type="file" id='f' />
<script>
  document.getElementById('f').addEventListener('change', function (e) {
    var file = this.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        const content = reader.result;
        console.log(content);
    }
    reader.readAsText(file);
  }, false);
</script>
```

`FileReader.readAsArrayBuffer(Blob)：` 将Blob转为ArrayBuffer格式数据

`FileReader.readAsDataURL(): `将Blob转化为Base64格式的Data URL

```js
let preview  = document.querySelector("img")
let file = document.querySelector("input[type=file]").files[0]
let reader = new FileReader()
reader.addEventListener('load',()=>{
    preview.src = reader.result
})
reader.readAsDataURL(file)
```





## CreateObjectURL / ReadAsText

**主要区别**

- 通过`FileReader.readAsDataURL(file)`可以获取一段`data:base64`的字符串

- 通过`URL.createObjectURL(blob)`可以获取当前文件的一个内存URL

  > 内存URL：`blob:http://localhost:8080/1ece2bb1-b426-4261-89e8-c3bec43a4020`

**执行时机**

- `createObjectURL`是同步执行
- `FileReader.readAsDataURL`是异步执行

**内存使用**

- `createObjectURL`返回一段带hash的url，并且一直存储在内存中，直到document触发了`unload`事件或者执行`revokeObjectURL`来释放
- `FileReader.readAsDataURL`则返回包含很多字符的base64，并会比blob url消耗更多内存，通过垃圾回收机制清除





## Notification

Notification API 是 HTML5 新增的桌面通知 API，用于向用户显示通知信息

该通知是脱离浏览器的，即使用户没有停留在当前标签页，甚至最小化了浏览器，该通知信息也一样会置顶显示出来

**Notification.permission**：该属性用于表明当前通知显示的授权状态

- default ：不知道用户的选择，默认
- granted ：用户允许
- denied ：用户拒绝

```js
if(Notification.permission === 'granted'){
    console.log('用户允许通知');
}else if(Notification.permission === 'denied'){
    console.log('用户拒绝通知');
}else{
    console.log('用户还没选择，去向用户申请权限吧');
}
```

**Notification.requestPermission()**：向用户去请求权限

```js
Notification.requestPermission().then(function(permission) {
    if(permission === 'granted'){
        console.log('用户允许通知');
    }else if(permission === 'denied'){
        console.log('用户拒绝通知');
    }
});
```

**推送通知**

- title：通知的标题
- options：通知的设置选项（可选）
- - body：通知的内容
  - tag：代表通知的一个识别标签，相同tag时只会打开同一个通知窗口
  - icon：要在通知中显示的图标的URL
  - image：要在通知中显示的图像的URL
  - data：想要和通知关联的任务类型的数据。
  - requireInteraction：通知保持有效不自动关闭，默认为false


 ```js
 var n = new Notification('状态更新提醒',{
     body: '你的朋友圈有3条新状态，快去查看吧',
     tag: 'linxin',
     icon: 'http://blog.gdfengshuo.com/images/avatar.jpg',
     requireInteraction: true
 })
 ```

**关闭通知**

```js
var n = new Notification('状态更新提醒',{
    body: '你的朋友圈有3条新状态，快去查看吧'
})

setTimeout(function() {
    n.close();
}, 3000);
```

**事件**

Notification 接口的 onclick属性指定一个事件侦听器来接收 click 事件

当点击通知窗口时会触发相应事件，比如打开一个网址，引导用户回到自己的网站去

```js
var n = new Notification('状态更新提醒',{
    body: '你的朋友圈有3条新状态，快去查看吧',
    data: {
        url: 'http://blog.gdfengshuo.com'
    }
})
n.onclick = function(){
    window.open(n.data.url, '_blank');      // 打开网址
    n.close();                              // 并且关闭通知
}
```





## Clipboard

**向剪切板写入文字数据**

```js
function testWriteText(str){
    navigator.clipboard.writeText(str)
    .then(res=> {
        console.log('写入文本成功res: ', res)
    })
    .catch(err => {
        console.log('写入文本失败err：', err)
    })
}
```

**向剪切板读取写入的文字**

```js
function testRedText(){
    navigator.clipboard.readText()
    .then(res => {
        console.log('读取文本res: ', res)
    })
    .catch(err => console.error('读取文本失败err: ', err))
}
```

**向剪切板写入blob数据**

```js
function testWrite(blob){
    console.log(blob)
    // new ClipboardItem 键名类型 必须同 blob 类型相同
    let clipboardItem = new ClipboardItem({"text/plain": blob})
    navigator .clipboard.write([clipboardItem])
    .then(res => { 
        console.log('写入blob 成功res： ', res)
    })
    .catch(err => console.error('写入blob失败error: ', err))
}
```

**从剪切板读取blob数据**

```js
function testRead(){
    navigator.clipboard.read()
    .then(clipboardItems=> {
        return clipboardItems[0].getType('text/plain')
    })
    .then(blob => {
        return blob.text()
    })
    .then(text => {
        console.log('获取blob数据成功： ', text)
    })
    .catch(err => console.error('获取剪切板数据失败err: ', err))
}
```

**事件**

用户向剪贴板放入数据时，将触发**copy**事件

用户使用剪贴板数据，进行粘贴操作时，会触发**paste**事件

**cut**事件则是在用户进行剪切操作时触发，它的处理跟copy事件完全一样，也是从`Event.clipboardData`属性拿到剪切的数据

`Event.clipboardData.setData(type, data)`：修改剪贴板数据，需要指定数据类型

`Event.clipboardData..getData(type)`：获取剪贴板数据，需要指定数据类型

`Event.clipboardData.clearData([type])`：清除剪贴板数据，可以指定数据类型，如果不指定类型，将清除所有类型的数据

`Event.clipboardData.items`：一个类似数组的对象，包含了所有剪贴项，不过通常只有一个剪贴项

下面的示例是将用户放入剪贴板的文本，转为大写

```js
const source = document.querySelector('.source');
source.addEventListener('copy', async (event) => {
	const text = await navigator.clipboard.readText()
	event.clipboardData.setData('text/plain', text.toString().toUpperCase());
    event.preventDefault();
});
```





## API

URL解析：[URL - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)

[Blob - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)

[File API - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/File_API)

[Notifications API - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Notifications_API)

[Clipboard - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard)

[Web Speech API - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Speech_API)

[Web Audio API - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API)

[屏幕捕捉 API - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Screen_Capture_API)

[WebSocket - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)

[XMLHttpRequest() - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/XMLHttpRequest)

[FormData - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)

[ProgressEvent - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/ProgressEvent)

[Lootoe/VideoCapture: 使用getUserMedia、MedaiRecorder API 进行视频录制的工具 (github.com)](https://github.com/Lootoe/VideoCapture)

[SubtleCrypto - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
