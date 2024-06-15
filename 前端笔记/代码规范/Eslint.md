## ESLint

[Getting Started with ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/getting-started)



### 安装和初始化

环境要求：必须在Node环境下、Node版本大于6.14、npm版本大于等于3+

全局安装（不推荐）：`npm install eslint -g`

局部安装：`npm install eslint --save-dev`

初始化配置文件：`npx eslint --init / npm init @eslint/config`



### 配置文件查找规则

在要检测的文件同一目录里寻找` .eslintrc.*` 和 `package.json`

紧接着在父级目录里寻找，一直到文件系统的根目录

如果在前两步发现有 `root：true` 的配置，停止在父级目录中寻找 `.eslintrc`

如果以上步骤都没有找到，则回退到用户主目录 `~/.eslintrc` 中自定义的默认配置



### 配置指南

整体：[Configuring ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/configuring)

配置文件：[Configuring ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/configuring#extending-configuration-files)

添加忽略文件：[Configuring ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/configuring#ignoring-files-and-directories)



### 各配置项介绍

##### Processor

处理器可以从非JavaScript 文件中提取 JavaScript 代码，然后让 ESLint 检测 JavaScript 代码

[Configuring ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/configuring#specifying-processor)

```js
{
    "plugins": ["a-plugin"],
    "overrides": [
        {
        // 针对于 .md 结尾的文件使用 a-plugin 的 processor 进行处理
            "files": ["*.md"],
            "processor": "a-plugin/markdown"
        },
        {
        // 上述提到过本质上会将 .md 文件通过 processor 转化为一个个具名的代码块
            "files": ["**/*.md/*.js"],
            "rules": {
                "strict": "off"
            }
        }
    ]
}
```

##### Overrides

针对不同的文件进行不同的 Lint 配置

```js
module.exports = {
  rules: {
      'no-console': 2
  },
  overrides: [
    // *.test.js 以及 *.spec.js 结尾的文件特殊定义某些规则
    {
      files: ['*-test.js', '*.spec.js'],
      rules: {
        'no-unused-expressions': 2,
      },
    },
  ],
};
```

##### Extends

在项目内继承于另一份 EsLint 配置文件来扩展

[Configuring ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/configuring#extending-configuration-files)

```js
// .eslintrc.js
module.exports = {
   "extends": [
     // 继承于 @typescript-eslint 插件下的推荐配置
     "plugin:@typescript-eslint/recommended",     
   ]
}

// 上述的配置完全等价于
module.exports = {
    // 继承而来
    parser: '@typescript-eslint/parser',
    parserOptions: { sourceType: 'module' },
   "plugins": [
       "@typescript-eslint"
   ],
   "rules": [
       // ...
      // 省略@typescript-eslint/recommended 中 N 多种规则的声明
   ]
}
```

##### Plugins

对官方内置规则的扩展

[Configuring ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/configuring#configuring-plugins)

```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  env: {
    browser: true,
  },
  rules: {
    '@typescript-eslint/array-type': 2
  },
};
```

##### Globals

定义全局变量，防止ESLINT报错

[Configuring ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/configuring#specifying-globals)

```js
// .eslintrc
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 5,
  },
  env: {
    browser: true,
  },
  // 通过 globals 定义额外的全局变量
  globals: {
    var1:'writable',
    var2:'readonly',
    var3；'off'
  },
  rules: {
     // 禁止使用未定义的变量
    'no-undef': ['error'],
  },
};
```

##### Environments

设置支持的环境，也就是说当前环境下的全局变量

[Configuring ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/configuring#specifying-environments)

```js
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
  },
  env: {
    browser: true,
  },
  rules: {
    'no-unused-vars': ['error'],
     // 禁止使用未定义的变量
    'no-undef': ['error'],
  },
};
```

##### Parser

指定以何种解析器解析文件

[Configuring ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/configuring#specifying-parser)

```js
// .eslint.js
module.exports = {
  parser: 'espree', // 使用默认 espree 解析器
  rules: {
    'no-unused-vars': ['error'], // 定义规则禁止声明未使用的变量
  },
};
```

##### ParserOptions

配置语言的校验规则，使用ES6检验规则

[Configuring ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/configuring#specifying-parser)

```js
{
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "semi": "error"
    }
}
```

##### Rules

ESLINT对语法的具体的校验规则

[Configuring ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/configuring#configuring-rules)

```
"off" 或 0 - 关闭规则
"warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
"error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
```



### 在文件中禁用ESLINT

[Configuring ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/configuring#disabling-rules-with-inline-comments)

可以在你的文件中使用以下格式的块注释来临时禁止规则出现警告：

```js
/* eslint-disable */

alert('foo');

/* eslint-enable */
```

如果在整个文件范围内禁止规则出现警告，将 `/* eslint-disable */` 块注释放在文件顶部：

```
/* eslint-disable */

alert('foo');
```



### 开源配置

[Shareable Configs - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/developer-guide/shareable-configs)

Rules：[List of available rules - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/rules/)

推荐的规则：规则强度是 airbnb > standard > recommended

想要使用别人的配置通常只需要下载对应的依赖并且加入到`extends`继承下来即可，可以配置为字符串或者数组均可

市面上目前最为流行的开源配置使用最多的是`airbnb团队`的配置

下面这些配置值得推荐：

1. [eslint:recommended](https://eslint.org/docs/latest/rules/) ESLint内置的推荐规则在么有讲到 所有打钩的就是内置规则
2. [eslint:all](https://eslint.org/docs/latest/rules/)：ESLint 内置的所有规则
3. [eslint-config-standard](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fstandard%2Feslint-config-standard)：standard 的 JS 规范
4. [eslint-config-prettier](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprettier%2Feslint-config-prettier)：关闭和 ESLint 中以及其他扩展中有冲突的规则
5. [eslint-config-airbnb-base](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript%2Ftree%2Fmaster%2Fpackages%2Feslint-config-airbnb-base)：airbab 的 JS 规范
6. [eslint-config-alloy](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAlloyTeam%2Feslint-config-alloy)：腾讯 AlloyTeam 前端团队出品，可以很好的针对你项目的技术栈进行配置选择



### 使用开源配置

想要使用别人的配置通常只需要下载对应的依赖并且加入到`extends`继承下来即可，可以配置为字符串或者数组均可

```js
{
    extends: [
        'eslint:recommended', // 是 ESLint 官方的扩展,内置推荐规则
        'plugin:vue/essential', // 是插件类型扩展
        'eslint-config-standard', // eslint-config 开头的都可以省略掉前面 直接使用standard即可
        '@vue/prettier', // @开头扩展和 eslint-config 一样，只是在 npm 包上面加了一层作用域 scope；
        './node_modules/coding-standard/.eslintrc-es6' // 一个执行配置文件的路径
    ]
}
```



### 修改插件规则

```js
{
    plugins: [
        'jquery',   // eslint-plugin-jquery
        '@foo/foo', // @foo/eslint-plugin-foo
        '@bar,      // @bar/eslint-plugin
    ],
    extends: [
        'plugin:jquery/recommended',
        'plugin:@foo/foo/recommended',
        'plugin:@bar/recommended'
    ],
    // 在插件名后写规则名
    rules: {
        'jquery/a-rule': 'error',
        '@foo/foo/some-rule': 'error',
        '@bar/another-rule': 'error'
    },
}
```



### 命令

`--fix` 只能修复可以修复的格式问题，代码错误无法修复

```shell
// 校验单个文件
npx eslint a.js b.js
// 校验一个目录
npx eslint src
// 校验src目录下的指定格式文件
npx eslint --ext .js src
// 校验并修复
npx eslint --fix src
```



### 定义.eslintignore

当 ESLint 运行时，在确定哪些文件要检测之前，它会在当前工作目录中查找一个 `.eslintignore` 文件

如果发现了这个文件，当遍历目录时，将会应用这些偏好设置

一次只有一个 `.eslintignore` 文件会被使用，所以，不是当前工作目录下的 `.eslintignore` 文件将不会被用到

eslint通过`.eslintignore` 文件或者在 package.json 文件中查找 `eslintIgnore` 键，来检查要忽略的文件

1、在项目根目录创建一个 `.eslintignore` 文件告诉 ESLint 去忽略特定的文件和目录

`.eslintignore` 文件是一个纯文本文件，其中的每一行都是一个 glob 模式表明哪些路径应该忽略检测

```
/logs
/server/mockData
/node_modules
/dist
/onlinedist
/src/assets/js
/src/lib/achieve/KSWebBridge.js
/package-lock.json
.DS_Store
fis-conf.js
```

2、package.json 文件中定义 `eslintIgnore` 字段

```
{
  "name": "mypackage",
  "version": "0.0.1",
  "eslintConfig": {
      "env": {
          "browser": true,
          "node": true
      }
  },
  "eslintIgnore": ["hello.js", "world.js"]
}
```
