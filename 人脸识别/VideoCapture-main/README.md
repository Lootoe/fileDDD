# VideoCapture

## 介绍

使用`getUserMedia`、`MedaiRecorder`等 API 进行视频录制的工具（兼容IOS上的`Safari`与`腾讯X5`内核浏览器）



## 功能

1. 写这个类主要是为了解决Video标签在IOS与微信各种不兼容问题
2. 使用前置摄像头进行媒体捕获并录屏（下载`mp4`文件）或者获取录制好的文件（`File`对象）
3. 检测当前设备是否支持`getUserMedia`、`MediaRecorder`等API，如果不存在则报告错误原因
4. 我是一个前端萌新，各位大佬如果有问题请到`Issuses`提，我会及时处理



## 在线测试API兼容性

🍪（请点击）：**https://lootoe.github.io/VideoCapture**



## TODO

- [x] 兼容uniapp的Video组件
- [ ] 拍照（兼容IOS与微信）
- [ ] 全屏播放视频（兼容IOS与微信）



## 兼容性问题

- [x] IOS的版本兼容性：IOS 13.7及以下无法使用(亲测 IOS 15.3以上能正常使用)

- [x] IOS无法内嵌播放，IOS只展示视频首帧，必须手动操作才能使用**原生相机**播放

- [x] IOS无法正常使用`getUserMedia`

- [x] IOS/微信无法同层渲染，视频会浮于页面顶层

- [x] IOS不支持`CaptureStream`

- [x] 微信&IOS无法自动播放：手动点击按钮触发播放

  微信可通过以下方式解决：

  ```js
  document.addEventListener("WeixinJSBridgeReady", function () {
       video.play()
  }, false);
  ```

  

## 兼容性

- [x] PC
- [x] IOS 13.4+
- [x] 安卓



## API

**构造函数**

`VideoCapture(video: <VideoElement>, msgHandle <Callback>) VideoCapture`：检测兼容性时，所有的信息都可以从`msgHandle`的参数拿到

**方法**

`sleep(time) void`：休眠`time`毫秒

`start() void`：开始录制

`stop() void`：结束录制，此时可以获取到录制好的视频文件或者干脆下载视频

`getFile() File`：获取录制好的文件，可以用来发送给服务器，服务器获取`Buffer`进行操作

`downloadFile() void`：利用浏览器下载录制好的视频

**事件**

`onstart`：开始录制

`onstop`：结束录制



## 案例

```html
<div class="wrapper">
  <div class="tips-box">
    <ul class="tips-content"></ul>
  </div>
  <div class="video-box">
    <video></video>
  </div>
  <div class="btn-box">
    <button type="default" class="start">开始</button>
    <button type="default" class="stop">结束</button>
  </div>
</div>
<script src="./videoCapture.js"></script>
<script>
  const video = document.querySelector("video");
  const text = document.querySelector(".tips-content");
  const btn_start = document.querySelector(".start");
  const btn_stop = document.querySelector(".stop");
  const msgHandle = (msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    text.appendChild(li);
  };
  const vc = new VideoCapture(video, msgHandle);
  btn_start.onclick = () => {
    vc.start();
  };
  btn_stop.onclick = () => {
    vc.stop();
  };
  vc.onstart = async () => {
    await vc.sleep(4000);
    vc.stop();
  };
  vc.onstop = () => {
    vc.getFile();
    vc.downloadFile();
  };
</script>
```

