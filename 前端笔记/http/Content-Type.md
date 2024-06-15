# Content-Type

### Content-Type / Content-Encoding

`content-type`：内容类型，决定文件接收方以什么形式、什么编码读取这个文件，注重是浏览器如何**读取**文件

`content-encoding`：设置文件内容的编码格式，传输前什么格式，传输后接收到要以什么格式解析，注重如何**传输**文件



### Content-Type

如果是一个restful接口（json格式），一般将`Content-Type`设置为`application/json; charset=UTF-8`

如果是文件上传，一般`Content-Type`设置为`multipart/form-data`

如果普通表单提交，一般`Content-Type`设置为`application/x-www-form-urlencoded`


### application/x-www-form-urlencoded

Form表单的默认格式是这个，会将请求参数用`key1=val1&key2=val2`的方式进行组织，并放到请求实体里面

GET请求：`x-www-form-urlencoded`的编码方式把form数据转换成一个字串（name1=value1&name2=value2...）

​				  然后把这个字串append到url后面，用`?`分割，加载这个新的url

POST请求：浏览器把`form`数据封装到http body中，然后发送到server



### application/json

`json` 是一种轻量级的数据格式，以“键-值”对的方式组织的数据

这个使用这个类型，需要参数本身就是`json`格式的数据，参数会被直接放到请求实体里，不进行任何处理

`axios`中`POST`的默认请求体类型为`Content-Type:application/json`

如果想要设置类型为`Content-Type:application/x-www-form-urlencoded`

可以用`qs`这个库来格式化数据，默认情况下在安装完axios后就可以使用`qs`库



### multipart/form-data

常用来上传二进制数据

默认情况下，`enctype`的值是`application/x-www-form-urlencoded`，不能用于文件上传

只有使用了`multipart/form-data`，才能完整的传递文件数据

```js
const file = input.files[0]
const fd = new FormData()
fd.append(file)

const xhr = new XMLHttpRequest()
xhr.open('POST','http://www.abc.com/upload/avatar')
xhr.send(fd)
```



### application/octet-stream

这个字段由服务端设置

浏览器并不认得这是什么类型，也不知道应该如何展示，只知道这是一种二进制文件

因此遇到`Content-Type`为`application/octet-stream`的文件时，浏览器会直接把它下载下来

这个类型一般会配合另一个响应头`Content-Disposition`，该响应头指示回复的内容该以何种形式展示

是以内联的形式（即网页或者页面的一部分），还是以附件的形式下载并保存到本地



### Content-Disposition

这个字段由服务端设置

```js
// 正常解析渲染
Content-Disposition: inline

// 下载文件
Content-Disposition: attachment

// 下载文件，并将文件保存为filename.jpg
Content-Disposition: attachment; filename="filename.jpg"
```

