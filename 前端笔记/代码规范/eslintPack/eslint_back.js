require('@rushstack/eslint-patch/modern-module-resolution')
require('./removeLog.js')('./logs')
require('saveconsole')()
module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:vue/essential'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  globals: {
    // 支持uni的全局变量
    uni: 'readonly',
    plus: 'readonly',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        //  每行最大宽度
        printWidth: 120,
        // 缩进长度
        tabWidth: 2,
        // 用制表符而不是空格缩进行。
        useTabs: false,
        // 单引号
        singleQuote: true,
        // 结尾无分号
        semi: false,
        // 行首逗号
        trailingComma: 'es5',
        // 将多行HTML（HTML、JSX、Vue、Angular）元素的>放在最后一行的末尾，而不是单独放在下一行
        bracketSpacing: true,
        // 在唯一的箭头函数参数周围包含括号
        arrowParens: 'avoid',
        endOfLine: 'auto',
      },
    ],
    'no-unused-vars': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-components': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
