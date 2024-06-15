## 基础

模板语法：[模板语法 — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/guide/syntax.html)

计算属性/侦听器：[计算属性和侦听器 — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/guide/computed.html)

样式绑定：[Class 与 Style 绑定 — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/guide/class-and-style.html)

事件处理：[事件处理 — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/guide/events.html)

组件注册：[组件注册 — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/guide/components-registration.html)

组件事件：[自定义事件 — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/guide/components-custom-events.html)

插槽：[插槽 — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/guide/components-slots.html)





## 进阶

自定义指令：[自定义指令 — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/guide/custom-directive.html)

$forceUpdate：[API — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/api/#vm-forceUpdate)

$NextTick：[API — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/api/#vm-nextTick)

$set：[API — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/api/#vm-set)

过度动画：[进入/离开 & 列表过渡 — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/guide/transitions.html)

动态创建组件：[API — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/api/#Vue-extend)

vuex：[状态管理Vuex | uni-app官网 (dcloud.net.cn)](https://uniapp.dcloud.net.cn/tutorial/vue-vuex.html)

vue-router：[入门 | Vue Router (vuejs.org)](https://router.vuejs.org/zh/guide/)

$route：[API 参考 | Vue Router (vuejs.org)](https://v3.router.vuejs.org/zh/api/#路由对象)

$router：[API 参考 | Vue Router (vuejs.org)](https://v3.router.vuejs.org/zh/api/#router-实例属性)






## 生命周期

### 单个组件

1. **beforeCreate**：`data`和`methods`中的数据都还没有初始化
2. **created**：`data` 和 `methods`都已经被初始化好了

3. **beforeMount**：在内存中已经编译好了模板了，但是还没有挂载，不能直接操作页面的`dom`和获取和`$el、$refs`

4. **mounted**：`Vue`实例已经初始化完成了，以上都可以访问

5. **beforeUpdate**： 页面中的显示的数据还是旧的
6. **updated**：页面显示的数据和`data`中的数据已经保持同步了

7. **beforeDestory**：`Vue`实例可访问，一般用于清除定时器，取消注册事件

8. **destroyed**：`Vue`实例都已销毁

###  父子组件

1. 父组件：beforeCreate
2. 父组件：created
3. 父组件：beforeMount
4. 子组件：beforeCreate
5. 子组件：created
6. 子组件：beforeMount
7. 子组件：mounted
8. 父组件：mounted

### 其他用法

不想创建定时器实例，创建的定时器代码和销毁定时器的代码没有放在一起

通常很容易忘记去清理这个定时器，不容易维护

```js
setTimer(){
  const timeout = setTimeout(()=>{
    ...
	},1000)
  this.$once('hook:beforeDestory',()=>{
    clearTimeout(timeout)
	})
}
```





## 封装高级组件

`inheritAttrs: false`的含义是不希望本组件的根元素继承父组件的`attribute`

```vue
<comp-a attrA="hello" attrB="world" class="red"></comp-a>

// inheritAttrs: false
<div class="red"></div>

// inheritAttrs: true
<div attrA="hello" attrB="world" class="red"></div>
```

`$listenners、$attrs`将不存在于当前组件的父组件的监听器跟方法传给子组件

```vue
<template>
    <el-button v-on="$listeners" v-bind="$attrs" :loading="loading" @click="myClick">
        <slot></slot>
    </el-button>
</template>

<script>
export default {
    name: 'mButton',
    inheritAttrs: false,
    props: {
        debounce: {
            type: [Boolean, Number]
        }
    },
    data() {
        return {
            timer: 0,
            loading: false
        }
    },
    methods: {
        myClick() {
            if (!this.debounce) return
            this.loading = true
            clearTimeout(this.timer)
            this.timer = setTimeout(
                () => {
                    this.loading = false
                },
                typeof this.debounce === 'boolean' ? 500 : this.debounce
            )
        }
    }
}
</script>
```





## 页面缓存（keep-alive）

### 属性

`include` ：字符串或正则表达式，只有名称匹配的组件会被缓存

`exclude` ： 字符串或正则表达式，任何名称匹配的组件都不会被缓存

`max `：最多可以缓存多少组件实例

### 缓存所有页面

```vue
<template>
  <div id="app">
  	<keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
```

### 根据条件缓存页面

```vue
<template>
  <div id="app">
  	// 1. 将缓存 name 为 test 的组件
  	<keep-alive include='test'>
      <router-view/>
    </keep-alive>
	
	// 2. 将缓存 name 为 a 或者 b 的组件，结合动态组件使用
	<keep-alive include='a,b'>
  	  <router-view/>
	</keep-alive>
	
	// 3. 缓存匹配正则的
	<keep-alive :include='/a|b/'>
  	  <router-view/>
	</keep-alive>	
	
	// 5.缓存a和b
	<keep-alive :include='[a,b]'>
  	  <router-view/>
	</keep-alive>
	
	// 5. 将不缓存 name 为 test 的组件
	<keep-alive exclude='test'>
  	  <router-view/>
	</keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
```

### 结合路由缓存页面

```vue
<template>
  <div id="app">
  	<keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

// router
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: 'goods',
      children: [
        {
          path: 'goods',
          name: 'goods',
          component: Goods,
          meta: {
        		keepAlive: false // 不需要缓存
      	  }
        },
        {
          path: 'ratings',
          name: 'ratings',
          component: Ratings,
          meta: {
        		keepAlive: true  // 需要缓存
      	  }
        },
        {
          path: 'seller',
          name: 'seller',
          component: Seller,
          meta: {
        		keepAlive: true  // 需要缓存
      	  }
        }
      ]
    }
  ]
})
```





## SPA

**优点**

1. 页面切换无需刷新页面，用户体验好
2. 前后端分离，后端无需渲染模板，开发方便
3. 服务器压力小

**缺点**

1. 首屏加载慢：可以用路由懒加载...
2. 不利于SEO，搜索引擎请求到的html是模型页面而不是最终数据的渲染页面，这样就很不利于内容被搜索引擎搜索到：
3. 无法使用浏览器的前进后退功能，需要自己建立堆栈





## 路由规则

### 前端路由

我们在使用 Vue 或者 React 等前端渲染时，通常会有 hash 路由和 history 路由两种路由方式。

1. hash 路由：监听 url 中 hash 的变化，然后渲染不同的内容，这种路由不向服务器发送请求，不需要服务端的支持
2. history 路由：监听 url 中的路径变化，需要客户端和服务端共同的支持

### hash 路由

`hash` 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对后端完全没有影响，因此改变 `hash` 不会重新加载页面

### history 路由

在 history 路由中，我们一定会使用`window.history`中的方法，常见的操作有：

1. `back()`：后退到上一个路由
2. `forward()`：前进到下一个路由，如果有的话
3. `go(number)`：进入到任意一个路由，正数为前进，负数为后退
4. `pushState(obj, title, url)`：前进到指定的 URL，不刷新页面
5. `replaceState(obj, title, url)`：用 url 替换当前的路由，不刷新页面

调用这几种方式时，都会只是修改了当前页面的 URL，页面的内容没有任何的变化

但前 3 个方法只是路由历史记录的前进或者后退，无法跳转到指定的 URL

而`pushState`和`replaceState`可以跳转到指定的 URL





## 路由元信息

### 为什么需要路由元信息

我们在做网站登录验证的时候，可以使用到`beforeEach`钩子函数进行验证操作

如下面代码 ，如果页面path为`/goodsList`，那么就让它跳转到登录页面，实现了验证登录

```js
router.beforeEach((to, from, next) => {
  if (to.path === '/goodsList') {
    next('/login')
  } else 
    next()
})
```

如果需要登录验证的网页多了怎么办

1、这里是对比path，如果需要验证的网页很多，那么在`if`条件里得写下所有的路由地址，将会是非常麻烦的一件事情

2、如果像刚才例子中这样对比`to.path === ‘/goodsList`，就非常单一，其他的路径压根不会限制（验证）到，照样能正常登陆

3、我们所理想的就是把`/goodsList`限制了，其他所有的以`/goodsList`开头的那些页面都给限制到

### matched

匹配到的路由数组，它的第一项就是`{path: “/goodslist”}`，一直到最为具体的当前path （例如：{path: “/goodslist/online/edit”}）

这里可以循环matched这个数组，看每一项的path 有没有等于’/goodsList’,只要其中一个有，那么就让它跳转到登录状态

```js
router.beforEach((to,from,next)=>{
    if(to.matched.some(function(item){return item.path=="/goodlist"})){
        next("/login")
    }else{
        next()
    }
})
```

那么这里只是对`goodsList`进行验证判断，且限制的还是`path`

如果页面中还有会员列表、资讯列表、广告列表都需要进行验证的时候，用`path`来做限制似乎有点不好用

### meta

直接在路由配置的时候，给每个路由添加一个自定义的`meta`对象，在`meta`对象中可以设置一些状态，来进行一些操作

```js
{
    path:'/article',
    name:'Active',
    component:Article,
    meta:{
    	login_require:false
    },
}

{
    path:'/goodlist',
        name:'gooldlist',
        componet:Goodlist,
        meta:{
        	login_require:false
        }
    	children:[
        	{
            	path:"online,
            	component:GoodslistOnline"
       		}
    	]
}

```

这里我们只需要判断`item`下面的`meta`对象中的`login_require`是不是`true`，就可以做一些限制了

```js
router.beforEach((to,from,next)=>{
    if(to.matched.some(function(item){return item.meta.login_require})){
        next("/login")
    }else{
        next()
    }
})
```





## 命名视图

有时候想同时 (同级) 展示多个视图，而不是嵌套展示，例如创建一个布局，有 `sidebar` (侧导航) 和 `main` (主内容) 两个视图

这个时候命名视图就派上用场了

你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口

如果 `router-view` 没有设置名字，那么默认为 `default`

```js
<router-view class="view left-sidebar" name="LeftSidebar"></router-view>
<router-view class="view main-content"></router-view>
<router-view class="view right-sidebar" name="RightSidebar"></router-view>
```

一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件

确保正确使用 `components` 配置 (带上 **s**)：

```js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      components: {
        default: Home,
        // LeftSidebar: LeftSidebar 的缩写
        LeftSidebar,
        // 它们与 `<router-view>` 上的 `name` 属性匹配
        RightSidebar,
      },
    },
  ],
})
```





## 项目中跨域解决方案

当后端接口出现跨域问题，我们前端Vue项目想要解决时，可以在 `vue.config.js` 中：

```js
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: '填写你请求的baseURL地址',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
} 
```

然后将原本的拦截器改为：

```js
const instance = axios.create({
    // baseURL: "填写你请求的baseURL地址",
    baseURL: "/api",
    timeout: 5000
})    
```





## scoped穿透

scoped看起来很好用，当时在Vue项目中，当我们引入第三方组件库时

需要在局部组件中修改第三方组件库的样式，而又不想去除scoped属性造成组件之间的样式覆盖

这时我们可以通过特殊的方式穿透`scoped`

```css
外层 /deep/ 第三方组件 {
    样式
}
.wrapper /deep/ .swiper-pagination-bullet-active{
    background: #fff;
}
```

或者在vue组建中使用两个style标签，一个加上scoped属性，一个不加scoped属性

把需要覆盖的css样式写在不加scoped属性的style标签里

```vue
<template>
	<view class="box">
		<u--input placeholder="请输入内容" border="surround" class="ipt"></u--input>
	</view>
</template>

<script>
	export default {}
</script>

<style lang="scss">
	.ipt {
		width: 200px;

    /* 内容框 */
		/deep/.u-input__content {
			background-color: skyblue;
		}

    /* placeholder */
		/deep/.uni-input-placeholder {
			color: black !important;
		}
	}
</style>
```

