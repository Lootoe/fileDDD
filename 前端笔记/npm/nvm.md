## 介绍

`nvm` 是管理 `node` 版本的工具

客户端程序下载地址：[Release 1.1.10 · coreybutler/nvm-windows · GitHub](https://github.com/coreybutler/nvm-windows/releases/tag/1.1.10)

安装完成后，打开命令行，输入 `nvm -v`，出现版本号即成功

可以输入`nvm -help`查看`nvm`的功能



## 操作nvm

```js
nvm arch 	// 判断node运行在32位还是64位处理器上
nvm on // 启用nvm
nvm off // 禁用nvm
nvm proxy [proxyUrl] // 采用代理下载node
nvm root // 显示node安装在了哪个文件夹
nvm root [path] // 设置node的安装文件夹
```



## 设置下载镜像

```js
nvm node_mirror [url] // 设置node的镜像地址，会从镜像下载node
nvm npm_mirror [url // 设置npm的镜像地址，会从镜像下载npm
```



## 显示node

```js
nvm current // 显示当前所使用的node版本
nvm list // 显示已经安装的可用的node版本
nvm list available // 显示node官网有哪些版本的ndoe可以下载
```



## 安装/使用node

```js
nvm install/use [version][arch] // 安装/使用 指定版本node
nvm install/use latest // 安装/使用 最新版本node
nvm install/use lts // 安装/使用 长期稳定版node
```



## 删除node

```js
nvm uninstall [version] // 删除指定版本node(包括32位，64位)
```

