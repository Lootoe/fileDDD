## Prettier

### 为什么使用

要想提高代码质量和开发效率，首先就想到从代码风格入手

不同开发人员用不同的 IDE，用相同 IDE 的又因为设置不同默认的缩进也不同，自己又懒得去设置，或者不会设置

这样代码风格始终都得不到统一

Prettier 也郑重提出：大家不要吵！用这种风格还是那种风格是半斤八两的关系，但是最后用没用上却是 0 和 1 的关系

咱们先提高代码的可读性和可维护性再说，具体什么风格我给你们定

大家都遵循 Prettier 给出的方案就好了，保证一切顺利进行下去，这就是 Prettier 的**opinionated**（固执己见的）

也就是说，要么你按照我说的办，要么就别用，这样才能确保统一



### 配置文件

[Configuration File · Prettier 中文网](https://www.prettier.cn/docs/configuration.html)

Prettier 故意不支持任何类型的全局配置，这是为了确保当一个项目被复制到另一台计算机时，Prettier的行为保持不变

否则，Prettier将无法保证团队中的每个人都能获得相同的一致结果

常用类型：`.prettierrc.js / prettier.config.js / .prettierrc.json / .prettierrc`



### VSCODE配置

```json
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript|react]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript|react]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```



### 忽略文件

[Ignoring Code · Prettier 中文网](https://www.prettier.cn/docs/ignore.html)

```
# 忽略的文件夹:
build
coverage

# 忽略所有html文件:
*.html
```



### 配置选项

[Options · Prettier 中文网](https://www.prettier.cn/docs/options.html)

Prettier 附带了一些可定制的格式选项，可在 CLI 和 API 中使用

**printWidth**： 每一行代码允许的字符数，默认 80,超过设定的字符数，会换行

**tabWidth** ：指定每行缩进的空格数

**tabs** `true` ：使用制表符(tab键)缩进行,  `false` 使用空格缩进行

**semicolons** ：`true` 在语句末尾添加分号, `false` 语句末尾不添加分号

**quotes**： `true` 使用单引号, `false` 使用双引号

**quoteProps**： `as-needed` 只有在对象属性需要引号时，为其添加双引号， `consistent` 当对象的所有属性中存在一个属性必须添加引号，则将其所有属性添加引号，`preserve` 对象属性声明时加了引号，格式化后就有引号

**jsxQuotes**： `true` 在 JSX 文件里使用单引号，`false` 在 JSX 文件里使用双引号

**trailingCommas**： `es5` 遵循 es5 语法中定义的尾逗号， `none` 无尾逗号,  `all` 尽可能在结尾处加上尾逗号

**bracketSpacing**： `true` 对象字面量两边有空格，`false` 对象字面量两边没有空格

**jsxBrackets**： `true` JSX 文件里组件里 `>` 换行, `false` JSX 文件里组件里 `>` 不换行,

**arrowParens**： `always` 始终保留括号，`avoid` 不保留括号

**rangeStart**： 表示从那一行开始格式化

**rangeEnd**： 表示从那一行结束格式化

**filepath**： 详见 Parser

**requirePragma**： 是否启用注解格式化，即配置注解的格式化，不配置的不格式化，默认值：false（类似 @prettier

**insertPragma**： `true` 当格式化时，会在文件头添加 `/** @format */`,  `false` 不会添加 `/** @format */`

**proseWrap**： 与 markdown 有关系 默认值 `preserve`

**htmlWhitespaceSensitivity**： 指定 HTML 文件的全局空白区域敏感度,默认值 css

**endOfLine**： 结尾类型，默认值为 auto



### 安装

这里不介绍怎么使用`VsCode`插件，IDE的插件只能处理单个文件，而CLI能批处理等更多功能

```shell
npm install --save-dev --save-exact prettier
```

添加`.prettierrc.js（配置文件）`，`.prettierignore(忽略文件)`



### 命令

```shell
// 格式化所有文件
npx prettier --write .	
// 格式化src的子文件夹下所有js文件
npx prettier --write "/src/**/*.js"
// 格式化src下所有文件
npx prettier --write "src/."

// 检查src下的文件是否格式化
prettier --check "src/."
```

