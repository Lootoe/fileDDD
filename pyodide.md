## 前端与Python混编方案

### Pyodide

官方文档：https://pyodide.org/en/stable/

在JS中调用C/C++程序时，可以通过安装Emscripten，将C/C++编译成webassembly(.wasm)文件，在JS中进行调用，但Emscripten无法编译python文件。

pyodide以python化的emscripten类库cpython-emscripten为基础，提供胶水文件pyodide.js，使js代码可以调用python的.whl文件。

### Python与Javascript混编示例

```js
// 导入模块
import { loadPyodide } from 'pyodide'

// 初始化pyodide
const pyodide = await loadPyodide()

// 加载python库
await pyodide.loadPackage(['numpy', 'scipy'])

// 导入python库
numpy = pyodide.pyimport('numpy')
scipy = pyodide.pyimport('scipy')

// 直接将python的函数当做JS使用
const points = [...]
const tri = scipy.spatial.Delaunay(points)
const hull = tri.convex_hull.toJs()
```

### Python与Javascript的类型转换

首先python的变量类型和javascript的类型是不互通的，就比如上面的示例代码中，使用了toJs这个方法。

toJs可以将python类型转换为js类型，同样的toPy可以让js类型转换为python类型。

以上是显示转换，实际上pyodide在使用时会做很多隐式转换。

比如scipy.spatial.Delaunay(points)，实际上就是把js的数组转换成了python的list

具体js的类型和python的类型是怎么对应的，可以看官方文档的**类型转换**：https://pyodide.org/en/stable/usage/type-conversions.html

### 集成Pyodide到Vite项目（开发环境）

首先pyodide官方给出了在vite的开发环境使用的示例，直接安装pyodide的npm库即可。

但是我们如果要使用python的第三方库，那就需要做很多事了。

需要去github的release里下载编译好的python第三方库文件。

release地址：https://github.com/pyodide/pyodide/releases/tag/0.26.1

我们用到什么库，就从里面把相关文件单独拿出来。

然后在vite项目的node_modules里找到pyodide的文件夹，将拿出来的文件放到根目录。

这样做完以后，在开发环境就不会有什么问题了。

### 集成Pyodide到Vite项目（生产环境）

在打包时，我们是无法将pyodide的第三方库文件打包进去的，所以我们需要额外做很多事。

首先就是将整个pyodide的npm包拷贝到src/assets（这个路径可以自定义）目录下。

放到src目录下我们在开发时是用不到的，但在打包时我们需要将它打包到dist/assets目录下。

也就是和pyodide.js的产物同目录，这样它才能正确找到python的第三方库文件。

问题是，我们怎么拷贝？

我们可以使用rollup-plugin-copy或者vite-plugin-copy，但是插件都有问题，无法正常使用，所以我们自己编写插件。

### 编写拷贝pydide的vite插件

这里是简单实现，利用nodejs的fs模块而已。

关键是，我们需要在roullup的generateBundle钩子里调用，不然拷贝到assets里的pyodide产物会被vite产物覆盖。

```js
import fs from 'fs-extra'
import path from 'path'

const copyFolderContents = async (src, dest) => {
  try {
    await fs.copy(src, dest)
    console.log('文件夹内容已成功拷贝')
  } catch (err) {
    console.error('拷贝文件夹内容时出错:', err)
  }
}

export default function copyPyodide() {
  return {
    name: 'copyPyodide',
    generateBundle() {
      const pyodideSrc = path.resolve(__dirname, '../src/assets/pyodide')
      const pyodideDest = path.resolve(__dirname, '../dist/assets')
      copyFolderContents(pyodideSrc, pyodideDest)
    },
  }
}
```

然后，我们在vite.config.js里使用

```js
import copyPyodide from './vite-plugin-copyPyodide.js'

defineConfig({
	plugins:[copyPyodide()]
})
```

### pyodide兼容webworker使用

首先，初始化pyodide，加载第三方库都需要个好几秒的时间，总计时间就很长了，所以我们需要使用webworker并行加载。

我们的关键不是如何使用webworkers，而是如果vite项目里有多个worker，打包就会因为worker的产物是umd的形式报错。

我们需要在vite.config.js额外配置一下，让worker以esm的形式打包。

```js
defineConfig({
    worker: {
      format: 'es',
    },
})
```

