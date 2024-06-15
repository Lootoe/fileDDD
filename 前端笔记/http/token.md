# token

### 工作原理

基于`OAuth2.0`的`token`方式

1. 前端页面进行登录操作, 将用户名与密码发给服务器;
2. 服务器进行效验, 通过后生成`token`, 包含信息有密钥, `uid`, 过期时间, 一些随机算法等 ,然后返回给前端
3. 前端将`token`保存在本地中, 建议使用`localstorage`进行保存.  下次对服务器发送请求时, 带上本地存储的`token`
4. 服务器端,进行对`token`的验证, 通过的话, 进行相应的增删改查操作, 并将数据返回给前端
5. 为通过则返回错误码, 提示保错信息, 然后跳转到登录页



### 流程

##### 第一次登录请求

首先第一次未登录时，不存在`access_token`，需要用账号密码登录获取`token`

进行认证时，在访问API时需要将参数以`application/x-www-form-urlencoded`的形式，进行`UTF-8`字符编码后向服务器发送

```js
{
  // 表示使用了Resource Owner Password Credential
  grant_type:'password',
  // 用户的用户名
  username:'xxx',
  // 用户的密码
  password:'xxx',
  // 由服务器自己定义
  scope:'允许访问的范围'
}
```

##### basic token

但是光有用户的账号密码还不行，还需要服务器给开发者的账号密码

经过`Base64`编码后，放在`Authorization`头部

对路由进行拦截，添加`Authorization`头部

```js
const service  = axios.create({...});
service.interceptors.request.use(
     config =>	{
         // basicToken是将账号密码合并后经过Base64编码生成的
         config.headers.Authorization = 'Basic ' + basicToken     
     }
)
```

这样第一个登录请求就像这样

```http
POST /v1/oauth2/token HTTP/1.1
Host: api.example.com
Authorization: Basic XXXXXXXXXXXXXXXXXXXXXXXXX
Content-Type: application/x-www-form-urlencoded
grant_type=password&username=zhang&password=zhang&scope=api
```

##### 第一次登录响应

在第一次登录成功后，会得到这样的响应

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
Pargma: no-cache

// response body
{
	"access_token": 'zskldjflsdjflksjdflkjsd'
  "token_type": "bearer",
  "expires_in": 2629743,
  "refresh_token": 'ajsldkjflskdfjldfg'
}
```

`Bearer`：`token_type`中的`bearer`是`RFC6750`中定义的`OAuth2.0`所用的`token`类型

`access_token`：是以后访问时每次都需要携带的`token`

`expires_in`：表示当前`access_token`会在多少秒后过期

`refresh_token`：当`access_token`过期时，会携带该`token`进行刷新，重新获取`token`

##### 携带token的方式

以后的每次请求都携带`token`

根据RFC6750的定义，客户端有3种方法将`bearer token`信息发送给服务器端：

- 添加到请求信息的首部
- 添加到请求消息体
- 以查询参数的形式添加到URL中

1、将token信息添加到请求消息的首部时，客户端要用到`Authorization`首部，并按下面的形式指定`token`的内容：

```vbnet
GET /v1/users/ HTTP/1.1
Host: api.example.com
Authorization: Bearer zskldjflsdjflksjdflkjsd
```

2、`token`信息添加到请求消息体中，则需要将请求消息里的`Content-Type`设定为`application/x-www-form-urlencoded`，并用`access_token`来命名消息体里的参数，然后附加上`token`信息

```bash
POST /v1/users HTTP/1.1
Host: api.example.com
Context-Type: application/x-www-form-urlencoded

access_token=zskldjflsdjflksjdflkjsd
```

3、以查询参数的形式添加`token`参数时，可以在名为`access_token`的查询参数后指定`token`信息

```bash
GET /v1/users?access_token=zskldjflsdjflksjdflkjsd HTTP/1.1
Host: api.example.com
```

##### token无效

当`access token`过期或者错误，如果客户端依然用它访问服务，服务端就会返回`invalid_token`的错误或`401`错误码

当访问的接口在scope定义的范围之外，那么会报`403`错误码

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache

{
	"error": "invaild_token"
}
```

##### 刷新token

在刷新`access token`的请求里，客户端可以在`grant_type`参数里指定`refresh_token`，并和`refresh_token`一起发送给服务器端

```http
POST /v1/oauth2/token HTTP/1.1
Host: api.example.com
Authorization: Bearer zskldjflsdjflksjdflkjsd
Content-Type: application/x-www-form-urlencoded

grent_type=refresh_token&refresh_tokne=ajsldkjflskdfjldfg
```



### 无感刷新token

##### 路由鉴权

在路由添加自定义`mate`字段, 来记录该页面是否需要身份验证

```js
//router.js
{
    path: "/index",
    name: "index",
    component: resolve => require(['./index.vue'], resolve),
    meta: { 
        requiresAuth: true 
    }
}
```

##### 路由拦截

对于需要鉴权的路由，判断`token`是否存在，存在则访问，不存在则跳转到登录页

```js
router.beforeEach((to, from, next) => {
    //matched的数组中包含$route对象的检查元字段
    //arr.some() 表示判断该数组是否有元素符合相应的条件, 返回布尔值
    if (to.matched.some(record => record.meta.requiresAuth)) {
        //判断当前是否有登录的权限
        if (!hasAccessToken()) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next() // 确保一定要调用 next()
    }
})
```

##### token工具类

`utils/oauth.js`

```js
import token from 'basic-auth-token'

const TokenKey = 'access_token'
const ExpiresKey = 'expires_in'
const TokenTypeKey = 'bearer'
const RefreshTokenKey = 'refresh_token'

export function getToken () {
  return localStorage.getItem(TokenTypeKey) + ' ' + localStorage.getItem(TokenKey)
}

export function getRefreshToken () {
	return localStorage.getItem(RefreshTokenKey)
}

export function getBasicToken () {
	const password = 'xxx'
  const username = 'xxx'
  // 这个token方法将账号密码合并转为base64
  return token(password,username)
}

export function getExpireTime(){
  return localStorage.getItem('expires_in')
}

export function setToken (data) {
  const ExpiresTime = new Date().getTime() + data.expires_in * 1000

  localStorage.setItem(TokenKey, data.access_token)
  localStorage.setItem(ExpiresKey, ExpiresTime)
  localStorage.setItem(TokenTypeKey, data.token_type)
  localStorage.setItem(RefreshTokenKey, data.refresh_token)
}

export function removeToken () {
  localStorage.removeItem(TokenKey)
  localStorage.removeItem(ExpiresKey)
  localStorage.removeItem(TokenTypeKey)
  localStorage.removeItem(RefreshTokenKey)
}
```

##### 请求/响应拦截

`utils/request.js`

```js
import axios from 'axios'
import Vue from 'vue'
import * from '@/utils/oauth'

const server = axios.create({
  baseURL: baseUrl,
  withCredentials: true
})

// 用于记录是否正在刷新token，以免同时刷新
let tokenLock = false

function refreshToken () {
  if (!window.tokenLock) {
    server.post('/oauth/refresh',{
      refresh_token: getRefreshToken(),
    	grant_type: 'refresh_token',
    }).then(({data}) => {
      setToken(data)
    })
    tokenLock = true
  }
}


// http request 拦截器
axios.interceptors.request.use(
    config => {
         const urlArray = config.url.split('/')
   			 // 检查url(除了获取token的请求，其他请求在请求头内需要加token信息)
    		 if (urlArray.length > 0 && urlArray[urlArray.length - 1] !== 'token') {
     				 config.headers.Authorization = 'Bearer ' + getToken()
    		 } else {
      			 config.headers.Authorization = 'Basic ' + getBasicToken()
   			 }
    		 return config
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
server.interceptors.response.use(rep => {
  // 如果距离过期时间还有10分钟就使用refresh_token刷新token
  const expiresTimeStamp = new Date(Number(getExpireTime())).getTime() - new Date().getTime()
  if (expiresTimeStamp < 10 * 60 * 1000 && expiresTimeStamp > 0) {
      refreshToken()
  }
  return rep
}, error => {
  if (error.response.status === 401) {
    // 401错误:token失效或登录失败
    // 如果是在登录页报错的话直接显示报错信息，其他页面则清除token
    if (location.href.indexOf('login') > 0) {
      console.log(error.response.data.message)
      return
    }
    removeToken()
    location.reload()
  }
  return Promise.reject(error)
})

export default server
```



