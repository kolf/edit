# VCG 编审系统.

## 项目目录

|--app 																 // 开发目录
|  |--components													// 组件目录
|  |--containers 													// 页面目录
|--api （mock数据）
|--node_module （nodejs模块）
|--web （打包之后的生产目录）
|--.babelrc （babel配置文件）
|--.gitignore （git忽略配置文件）
|--apiServer.js （mock服务器，开发
|--faviocn.icon （项目浏览器图标）
|--package.json （npm 配置文件）
|--README.md （项目说明文件）
|--webpack.config.dev.js （开发环境webpack 配置文件）
|--webpack.config.prod.js （正式环境webpack 配置文件）

## 下载
```
git@gitlab.vcg.com:website_front/edit.git
```

## 开始使用
安装
```
npm install
```
开发
```
npm run dev
```
打包
```
npm run build
```

## 部署
开发环境
1. 打开jenkins http://192.168.3.128:8080/jenkins/view/nodejs/, `帐号 wjh, 密码 cc#dd%2`,
2. 找到项目dev_edit，点击`立即构建`按钮执行build命令，代码即会被部署到开发环境 dev.edit.vcg.com。

正式环境
1. 找到项目prod_edit，点击`立即构建`按钮执行build命令
2. 等build完成约5分钟后，打开http://101.201.70.24:8080/jenkins/ `帐号 test， 密码 cc#ddJJa`
3. 点击`立即构建`按钮，完成线上部署