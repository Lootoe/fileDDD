# Gzip

### Gzip背景

当用户访问我们的web站点时，前端资源通过`Gzip`压缩，传输给客户端，比**纯文本**体积减少大概60%左

能够节约客户端网络资源，提升响应速度，解决网络导致的资源加载瓶颈，和减小服务器压力



### Gzip效果

Gzip对于文本文件类型压缩效果最好，但是对于图片这种媒体类型的，压缩不好，反而浪费CPU资源



### Gzip工作原理

1、浏览器请求`url`，并在请求头中设置属性`Accept-Encoding：gzip`。表明浏览器支持`gzip`，这个参数是浏览器自动会携带的请求头信息

2、服务器收到浏览器发送的请求之后，服务器会返回压缩后的文件，并在响应头中包含`Content-Encoding: gzip`

​	  如果没有压缩文件，服务器会返回未压缩的请求文件

3、浏览器接收到到服务器的响应，根据`Content-Encoding: gzip` 响应头使用`gzip`策略去解压压缩后的资源

​	  通过`Content-Type`内容类型决定怎么编码读取该文件内容

`Content-Type`设置的类型是MIME类型

MIME类型表：[MIME 类型 | 菜鸟教程 (runoob.com)](https://www.runoob.com/http/mime-types.html)