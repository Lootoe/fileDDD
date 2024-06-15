## 序言

[为什么选 Vite | Vite 官方中文文档 (vitejs.dev)](https://cn.vitejs.dev/guide/why.html)





## 预构建依赖

### 模块化规范

模块化规范的目的：将不同的模块化形式统一转换为 ESM

浏览器只支持 ESModule，NodeModule 与 CommonJs 规范浏览器都不认识，如下：

采用这种方式，浏览器支持。

```js
import counter from './counter.js'
```

当采用 NodeModule 规范导入的时候，浏览器是不支持的。

```js
// npm i loadash
import loadash from 'loadash' // 浏览器会找不到该依赖
```

Vite 将 NodeModule 转化为浏览器支持的 ESModule。

```
import loadash from 'loadash' ==> import loadash from '/node_modules/.vite/deps/loadash.js'
```

### 依赖搜寻

> 在开发环境，采用 Go 编写的 EsBuild，将不同的模块化方式转换为浏览器支持的 EsModule，并且速度比JS打包工具快 10-100 倍。

传统的依赖搜寻是，从当前目录依次向上查找依赖的模块，这个速度可能会很慢。

ESBuild 会将转换出来的 EsModule 放到  `node_modules/.vite/deps`。

并且，由于原先查找模块是从当前目录依次向上查找，而现在直接在 `node_modules/.vite/deps` 查找，速度很快。

> 你想要强制 Vite 重新构建依赖，可以用 `--force` 命令行选项启动开发服务器，或者手动删除 `node_modules/.vite` 目录

### 多依赖合并

一些包，内部有很多的 ESM 内置模块，例如：`loadash-es`  有超过600个内置模块。

当我们从源码中导入这个包时，浏览器同时发出 600 多个 HTTP 请求。

尽管服务器在处理这些请求时没有问题，但大量的请求会在浏览器端造成网络拥塞，导致页面的加载速度相当慢。

而 Vite，会将这几百个依赖统一合并为一个 `lodash-es` 模块，这样就只需要一个HTTP请求了。

### 依赖缓存

vite 解析后的依赖，会以 HTTP 头 `max-age=31536000,immutable` 强缓存，以提高在开发时的页面重载性能。

如果服务器启动后，源码里新增了一个模块，浏览器找不到这个模块，那么将重新进行依赖预构建过程，并重新渲染页面。





## 资源引用

### 路径别名

配置 `vite.config.js`

```js
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }
},
```

### 直接引用

```html
<img class="img" src="@/assets/images/pic.jpeg" />
```

### 背景图片

背景图片可以用别名

```css
.bg {
  width: 300px;
  height: 200px;
  background: url('@/assets/images/png/typeScript.png');
}
```

### 按需导入

```react
import logo from '@/assets/logo.png'

export default defineComponent({
  setup(){
    return () => {
      return <div>
        <img src={logo} />
      </div>
    }
  }
})
```

### 动态导入

在 vite 中不能使用 `require` 的方式引入图片，我们可以 `vite` 提供的方式来动态导入图片

这里需要注意的是，图片路径要**使用相对路径，不能使用别名（别名无法正确解析）**

```js
const imgUrl = new URL('../assets/images/png/year.png', import.meta.url).href
```

### import.meta.url

`import.meta.url` 表示当前模块的绝对路径

对于一个模块`main.mjs`

如果在`http://mysite.com` 的网页中添加`type="module"` 加载，那么`import.meta.url' = 'http://mysite.com/main.mjs'` 

但是如果作为一个`Node.js`脚本运行，那么`import.meta.url = 'file:///absolute-path/main.mjs'` 

### 其他

[URL - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)

[静态资源处理 | Vite 官方中文文档 (vitejs.dev)](https://cn.vitejs.dev/guide/assets.html)





## 环境变量

### 模式

创建不同环境的配置文件：

```
/*根目录*/
	.env			// 所有情况下都会加载，但是变量优先级最低
	.env.local 		// 所有情况都会加载，但是会被git忽略，但是变量优先级最低
	.env.beta		// --mode beta 会读取此文件
	.env.release	// --mode release 会读取此文件
	.env.dev		// --mode dev 会读取此文件
```

在`pages.json`中可以配置 `Vite` 执行不同参数的命令运行在不同环境

```json
{
  "name": "vite-mul-env-learn",
  "version": "0.0.0",
  "scripts": {
    "dev:local": "vite --mode local",
    "dev:test": "vite --mode test",
    "build:beta": "vite build --mode beta",
    "build:release": "vite build --mode release",
  }
}
```

默认情况下，开发服务器 (`dev` 命令) 运行在 `development` 模式，而 `build` 命令则运行在 `production` 模式

即，`dev` 命令会添加 `--mode development`，`build` 命令会添加 `--mode production`

### 变量读取

加载的环境变量会通过 `import.meta.env` 以字符串形式暴露给客户端源码

为了防止意外地将一些环境变量泄漏到客户端，只有以` VITE_` 为前缀的变量才会暴露给经过 `vite` 处理的代码

`Vite`内置了`dotenv`这个第三方库， `dotenv`会自动读取`.env`文件，如下：

我们在项目的根目录下，创建 **.env**文件，写入测试内容；

```ini
HELLO = "小伙子，我是base数据"
VITE_HELLO = "小伙子，我是base数据"
```

创建 **.env.development** 文件，写入测试内容；

```ini
HI = "小伙子，我是development数据"
VITE_HI = "小伙子，我是development数据"
```

然后再 `main.js` 中打印一下：

```js
console.log(' HI: ',  import.meta.env.HI); 					// undefined
console.log(' VITE_HI: ',  import.meta.env.VITE_HI);		// "小伙子，我是development数据"
console.log(' HELLO: ',  import.meta.env.HELLO);			// undefined
console.log(' VITE_HELLO: ',  import.meta.env.VITE_HELLO);	// "小伙子，我是base数据"
```

### 环境文件夹

我们现在的`.env`文件都是建立在根目录的，如果`.env.XX`的文件太多，会显得我们的项目目录很乱。

可以通过**envDir**配置来改变，如下：

```js
import { defineConfig } from "vite";
export default defineConfig( {
  envDir: "env"
});
```

### 更改环境变量前缀

参考：[共享配置 | Vite 官方中文文档 (vitejs.cn)](https://vitejs.cn/vite3-cn/config/shared-options.html#envdir)

如果你觉得**VITE_** 前缀不够舒服，想更换这个前缀，可以如下：

```js
import { defineConfig } from "vite";
export default defineConfig( {
  envPrefix:"myPrefix"
});
```

### 打包脚本

```
"dev": "vite --open"	// 默认打开浏览器
"preview": "vite preview --post 8088"	// 在本地端口预览dist产物
```





## 所有配置

```js
export default defineConfig({
  base: "./", //开发或生产环境服务的公共基础路径, 绝对 URL 路径名，例如 /foo/
  // 完整的 URL，例如 https://foo.com/
  // 空字符串或 ./（用于开发环境）
  // 通过命令指定：vite build --base=/my/public/path/
  // 代码中获取base：import.meta.env.BASE_URL全局变量在代码中使用，
  // 原样出现 (例如import.meta.env['BASE_URL']是无效的)
    
  plugins: [vue()], // 需要用到的插件数组
  publicDir: 'public', // 静态资源服务的文件夹。该目录中的文件在开发期间在 / 处提供
  //并在构建期间复制到 outDir 的根目录，并且始终按原样提供或复制而无需进行转换。
  //该值可以是文件系统的绝对路径，也可以是相对于项目的根目录的相对路径。默认'public'

  // 解析相关
  resolve: {
    alias: [ // 文件系统路径别名
      {
        "@": path.resolve(__dirname, "src"),
      },
      //或
      {
        find: /\/@\//, //字符串｜正则
        replacement: pathResolve('src') + '/'
      }
    ],
  },
 
  // JSON相关
  json: {
    namedExports: true, // 是否支持从.json文件中进行按名导入
    stringify: false, //  开启此项，导入的 JSON 会被转换为 export default JSON.parse("...") 会禁用按名导入
  },
 
  logLevel: 'info', // 调整控制台输出的级别 'info' | 'warn' | 'error' | 'silent'
  clearScreen: true, // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
  envDir: '/', // 用于加载 .env 文件的目录
  envPrefix: [], // 以 envPrefix 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中
 
  //server相关
  server: {
    host: '127.0.0.1', // 指定服务器应该监听哪个 IP 地址
    port: 5000, // 指定开发服务器端口
    strictPort: true, // 若端口已被占用则会直接退出
    https: false, // 启用 TLS + HTTP/2
    // 当为true：启用 TLS + HTTP/2。注意：当 server.proxy 选项 也被使用时，将会仅使用 TLS。
    open: true, // 启动时自动在浏览器中打开应用程序
    proxy: { // 配置自定义代理规则
      '/api': {
        target: 'http:// jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true, // WebSocket
      }
    },
    cors: true, // 配置 CORS
    force: true, // 强制使依赖预构建
  },
 
  //build构建相关
  build: {
    target: ['modules'], // 设置最终构建的浏览器兼容目标   默认：'modules'指支持原生 ES 模块的浏览器。
    //  "esnext" ：即假设有原生动态导入支持，并且将会转译得尽可能小：
    //  如果 build.minify 选项为 'terser'， 'esnext' 将会强制降级为 'es2019'。
    //  其他情况下将完全不会执行转译。
    // 'es2015'：自定义目标也可以是一个 ES 版本
    polyfillModulePreload: true, // 是否自动注入 module preload 的 polyfill true：此 polyfill 会被自动注入到每个 index.html 入口的 proxy 模块中
    outDir: 'dist', // 指定输出路径
    assetsDir: 'assets', // 指定生成静态文件目录
    assetsInlineLimit: '4096', // 小于此阈值的导入或引用资源将内联为 base64 编码
    sourcemap: false, // 构建后是否生成 source map 文件
  },
 
  // 构建预览preview相关
  preview: {
    port: 5000, // 指定开发服务器端口
    strictPort: true, // 若端口已被占用则会直接退出
    https: false, // 启用 TLS + HTTP/2
    open: true, // 启动时自动在浏览器中打开应用程序
    proxy: { // 配置自定义代理规则
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    cors: true, // 配置 CORS
  },
  optimizeDeps: {
    exclude: [], // 在预构建中强制排除的依赖项
    include: [], // 可强制预构建链接的包
  },
})
```





## Typescript配置

### 介绍

Vite 只会对ts文件进行转译，不会进行类型检查，也就是说不会抛出任何错误提示

类型检查以及代码提示需要IDE自己去完成，但是可以使用`tsc --noEmit`进行语法检查

如果存在错误，进程会直接退出，如下：

只有不报错的时候才会进行`vite build` 打包

```json
// package.json
{
    "scripts":{
        "build": "tsc --noEmit && vite build"
    }
}
```

### 错误输出

官方：[About vite-plugin-checker | vite-plugin-checker](https://vite-plugin-checker.netlify.app/introduction/introduction.html)

`vite-plugin-checkers`提供内置的检查器，它支持[TypeScript](https://vite-plugin-checker.netlify.app/checkers/typescript.html)，[ESLint](https://vite-plugin-checker.netlify.app/checkers/eslint.html)，[vue-tsc](https://vite-plugin-checker.netlify.app/checkers/vue-tsc.html)，[VLS](https://vite-plugin-checker.netlify.app/checkers/vls.html)，[Stylelint](https://vite-plugin-checker.netlify.app/checkers/stylelint.html)

如果希望代码报错输出在控制台或者浏览器，可以使用插件：[vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker)，步骤如下：

1、安装`typescript`，因为该插件需要它：

```
npm install -D typescript
```

2、新建并配置`tsconfig.json`或者运行命令：`tsc --init`，该文件去配置TS的检查手段跟规则

> [tsconfig.json · TypeScript中文网 · TypeScript——JavaScript的超集 (tslang.cn)](https://www.tslang.cn/docs/handbook/tsconfig-json.html)

```json
{
    "compilerOptions": {
        "skipLibCheck": true,	// 跳过对node_modules的检查,
        "module":'ESNext',	// 指定用哪个模块系统版本，这里用最新的，这样ts文件里能用import.meta
    }
}
```

3、安装插件：

```
npm i vite-plugin-checker -D
```

4、在`vite.config.js`里配置

```js
// vite.config.js
import checker from 'vite-plugin-checker'
export default {
  plugins: [
    checker({
      typescript: true,
    }),
  ],
}
```

### Vite的内置类型支持

当配置环境变量的时候，在项目中使用发现没有语法提示。

Vite 默认的类型定义是写给它的 Node.js API 的。

要将其补充到一个 Vite 应用的客户端代码环境中，请添加一个 `d.ts` 声明文件：

```ts
/// <reference types="vite/client" />
```

同时，你也可以将 `vite/client` 添加到 `tsconfig` 中的 `compilerOptions.types` 下：

```
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```





## unplugin-auto-import

### 介绍

`unplugin-auto-import `插件，可以帮助我们在项目中，**自动导入常用的使用的第三方库的 API**，就可以方便我们开发，提升开发效率

### 案例

以 Vue 为例，在没有使用自动导入前，需要手写以下的 `import` 语句：

```js
import { computed, ref } from 'vue'
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

使用 `unplugin-auto-import `插件后：

```js
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

### 使用预设

`unplugin-auto-import` 插件一般配合预设进行使用，预设负责**告诉插件应该自动引入哪些内容**

支持的预设如下：[unplugin-auto-import/src/presets at main · antfu/unplugin-auto-import · GitHub](https://github.com/antfu/unplugin-auto-import/tree/main/src/presets)

```ts
AutoImport({
  imports :[
    // 预设
    'vue',
    'vue-router',
    // 自定义预设
    {
      '@vueuse/core': [
        // 命名导入
        'useMouse', // import { useMouse } from '@vueuse/core',
        // 设置别名
        ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
      ],
      'axios': [
        // 默认导入
        ['default', 'axios'], // import { default as axios } from 'axios',
      ],
		}
  ],
})
```

### TS类型

如果使用 Typescript，需要设置 `dts` 为 true

```js
AutoImport({
  dts: true // or a custom path
})
```

插件会在项目根目录**生成类型文件** `auto-imports.d.ts` （需要确保该文件在 `tsconfig` 中被 `include`）

生成的内容如下：

```typescript
export {}
declare global {
  const h: typeof import('vue')['h']
  const reactive: typeof import('vue')['reactive']
  const ref: typeof import('vue')['ref']
  const watch: typeof import('vue')['watch']
  const watchEffect: typeof import('vue')['watchEffect']
  // 省略其他内容
}
```

`unplugin-auto-import` 插件会**根据预设内容，生成对应的全局类型声明**

有了这些全局类型声明，我们就能够像全局变量那样使用 `ref` 等 Vue API，不需要先 `import` 对应的内容，TS 编译也不会报错

### ESLint

如果使用了 eslint，需要设置 `eslintrc` 字段

```js
js复制代码AutoImport({
  eslintrc: {
    enabled: true,
  },
})
```

插件会在项目根目录**生成类型文件** `.eslintrc-auto-import.json` ，确保该文件在 `eslint` 配置中被 `extends`：

```js
// .eslintrc.js
module.exports = {
  extends: [
    './.eslintrc-auto-import.json',
  ],
}
```

生成的内容如下：

```json
{
  "globals": {
    "h": true,
    "reactive": true,
    "ref": true,
    "watch": true,
    "watchEffect": true,
  }
}
```

`unplugin-auto-import` 插件会**根据预设内容，生成对应的 eslint 配置文件**

该文件定义了 `h`、`ref` 这些为全局变量，不需要引入就能直接使用。这样 ESlint 就不会报变量没有定义的错误了

### 全部配置

[GitHub - antfu/unplugin-auto-import: Auto import APIs on-demand for Vite, Webpack and Rollup](https://github.com/antfu/unplugin-auto-import#configuration)





## unplugin-vue-components

### 介绍

我们开发 Vue 项目时，一般会使用组件库进行开发，组件库有两种加载方式：**全局引入**和**按需引入**

全局引入组件库，**使用起来就非常方便**，但是坏处就是**产物体积大**，对性能要求较高的项目不友好。

按需引入，可以减少体积大小，但需要通过以下方式加载组件：

```js
import Button from 'ant-design-vue/lib/button';
import 'ant-design-vue/lib/button/style'; 
// 或者 ant-design-vue/lib/button/style/css 加载 css 文件
```

**引入组件还需要引入样式**，非常麻烦，因此有了 [`babel-plugin-import`](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fant-design%2Fbabel-plugin-import) 来进行按需加载，加入这个插件后，可以省去 style 的引入。

```js
import { Button } from 'ant-design-vue';
```

但这种**仍然需要手动引入组件**，而且还必须使用 `babel`

而  `unplugin-vue-components` 可以不需要手动引入组件，能够让开发者就**像全局组件那样进行开发**

但实际上又是按需引入，且不限制打包工具，不需要使用 `babel`

### 案例

以 `Antd Vue` 和 `vite` 为例：

```js
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default {
  plugins: [
    AutoImport({
      resolvers: [
        AntDesignVueResolver()
      ],
    }),
    Components({
      resolvers: [
        AntDesignVueResolver()
      ],
    }),
  ],
};
```

这样就能自动引入 `Antd Vue` 的组件，不需要手动 import 组件以及组件样式，**使用起来就像全局组件一样**，但这是按需自动引入，可以减少产物大小。

```html
<template>
  <a-button>按钮</a-button>
</template>
```

### 解决非模板组件引入失效

什么叫非模板组件呢？其实就是 message 等纯粹通过 js 进行调用的组件

`unplugin-vue-components` 这个插件目前并不能扫描**不在模板 (template) 内使用的部分组件**，比如 `Ant-Design-Vue` 的 `Message` 组件

Message组件使用时是没有 `css 样式` 的，我们得手动去引入 它的css样式，但是这种行为是很麻烦的，为了解决这种需求，一个插件也就随之而生：

[vite-plugin-style-import](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fvbenjs%2Fvite-plugin-style-import)：自动引入 第三方组件库我们所使用到的 style 样式

```js
// vite.config.ts
import styleImport, { AndDesignVueResolve } from 'vite-plugin-style-import';

export default {
  plugins: [
    // ...
    styleImport({
      resolves: [AndDesignVueResolve()],
    }),
  ],
}
```

这样子配置完之后，我们手动 `import` 了组件库的某个组件，它的样式也就会自动被我们加载进来，是不是很方便呢。

### 支持的组件库

[GitHub - antfu/unplugin-vue-components: 📲 On-demand components auto importing for Vue](https://github.com/antfu/unplugin-vue-components#importing-from-ui-libraries)

### 全部配置

[GitHub - antfu/unplugin-vue-components: 📲 On-demand components auto importing for Vue](https://github.com/antfu/unplugin-vue-components#configuration)

