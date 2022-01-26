# yoyoliveweb 
此项目为哟哟组桌面应用程序

## 运行项目
```js 
安装node环境
1. git clone 项目路径
// 进入项目文件
2. 安装依赖（使用 npm 或者 yarn）
npm install 或 yarn
3. 启动项目
// 网页打开
npm start 或者 yarn start 
4. 共同启动网页并展示 electron 窗口
yarn dev

5. electron 窗口
yarn electron-start

6. 打包 
(1)需要先build 文件 因为electron 打包是根据build打包出来得文件打包的
yarn build - 环境命令
(2)electron-packager 配置相应得打包库 
yarn package
```

## 项目环境配置
```
// 开发服(dev)环境 .env.development
 REACT_APP_API='http://47.106.112.61:5000'
//测试服环境 .env.test
//正式服环境 .env.prod

```

#### 项目目录

```
yoyoliveweb
├─ .env
├─ .env.development  开发服
├─ .env.prod         正式环境
├─ .env.test         测试环境
├─ craco.config.js   antd craco 配置文件
├─ main.js            electron主进程窗口配置项
├─ package-lock.json
├─ package.json
├─ public
│  ├─ css
│  │  └─ reset.css   重写样式
│  ├─ favicon.ico
│  ├─ index.html
│  ├─ logo.png
│  ├─ logo192.png
│  ├─ logo512.png
│  ├─ manifest.json
│  └─ robots.txt
├─ src
│  ├─ api              主要写接口请求
│  │  ├─ background.js
│  │  ├─ goods.js
│  │  ├─ help.js
│  │  ├─ index.js
│  │  └─ user.js
│  ├─ App.js            
│  ├─ components
│  │  ├─ formModal      公共表单弹窗
│  │  │  ├─ FormModal.jsx
│  │  │  └─ style.less
│  │  ├─ header         公共header
│  │  │  ├─ Header.jsx
│  │  │  └─ style.less
│  │  ├─ leftMenu       左菜单栏
│  │  │  ├─ LeftMenu.jsx
│  │  │  └─ style.less
│  │  └─ UploadOss.jsx  公共上传oss 组件
│  ├─ config
│  │  └─ MenuConfig.js   菜单配置项
│  ├─ grpc
│  │  ├─ connect.proto
│  │  ├─ connect_grpc_pb.js
│  │  └─ connect_pb.js
│  ├─ images            放图片静态资源
│  │  ├─ commit.png
│  │  ├─ goods.png
│  │  ├─ help.png
│  │  ├─ logo.png
│  │  ├─ playvideo.png
│  │  ├─ setting.png
│  │  ├─ shop.png
│  │  └─ user.png
│  ├─ index.js
│  ├─ Main.js           加上视窗操作栏的主渲染组件
│  ├─ main.less
│  ├─ models              状态管理 reduce
│  │  ├─ goods.js
│  │  ├─ index.js
│  │  └─ user.js
│  ├─ pages
│  │  ├─ autoLive         自动直播模块
│  │  │  ├─ AutoLive.jsx   自动直播 模型 放基本架子
│  │  │  ├─ components
│  │  │  │  ├─ AddPlayList.jsx   增加播放列表
│  │  │  │  ├─ BgPane.jsx          背景模块设置
│  │  │  │  ├─ InteractiveSet.jsx   互动设置模块
│  │  │  │  ├─ LiveRoomMsg.jsx       弹幕信息 主要用websocket
│  │  │  │  ├─ LiveRoute.jsx          负责自动直播的路由管理模块
│  │  │  │  ├─ RoleModal.jsx            角色设置
│  │  │  │  └─ ShopList.jsx             播放列表选定后的商品显示
│  │  │  └─ style.less
│  │  ├─ commodity         商品管理模块
│  │  │  ├─ Commodity.jsx           商品管理模型
│  │  │  ├─ commponents             
│  │  │  │  ├─ AllList.jsx          所有商品 模型
│  │  │  │  ├─ ChangePlayList.jsx   编辑商品列表
│  │  │  │  ├─ GoodsInfo.jsx        编辑、新增商品
│  │  │  │  └─ PlayList.jsx         商品列表模型
│  │  │  └─ style.less
│  │  ├─ help           帮助中心
│  │  │  ├─ components
│  │  │  │  └─ QuFeedback.jsx       反馈窗口
│  │  │  ├─ Help.jsx                帮助中心主面板
│  │  │  ├─ images
│  │  │  │  └─ customerService.png
│  │  │  └─ style.less
│  │  ├─ livePane       界面总面板 负责路由控制
│  │  │  ├─ LivePane.jsx
│  │  │  └─ style.less
│  │  ├─ login          登录页
│  │  │  ├─ components
│  │  │  │  ├─ EnterPwd.jsx             重置输入密码
│  │  │  │  ├─ ForgetPwd.jsx            忘记密码
│  │  │  │  ├─ LoginByPwd.jsx           密码登录
│  │  │  │  └─ PhoneLogin.jsx           手机号登录
│  │  │  ├─ images
│  │  │  │  ├─ login_left.png
│  │  │  │  ├─ login_lock.png
│  │  │  │  ├─ login_phone.png
│  │  │  │  ├─ pwd_eye.png
│  │  │  │  └─ pwd_head.png
│  │  │  ├─ Login.jsx               用户登录主模型
│  │  │  └─ style.less
│  │  ├─ system        系统模块
│  │  │  ├─ style.less
│  │  │  └─ System.jsx
│  │  └─ user           用户中心
│  │     ├─ components
│  │     │  ├─ ConfirmPhone.jsx      验证手机号   
│  │     │  └─ UpdatePhone.jsx      修改手机号 
│  │     ├─ style.less
│  │     └─ User.jsx                用户中心主模型
│  ├─ store.js
│  └─ utils             工具类
│     └─ request.js
└─ yarn.lock

```

### 技术栈
基本 html5 css es6 axios 

框架  react creat-react-app 

ui antd 组件库

状态管理方案 rematch hook/usestate

路由 react-router

打包 electron-packager

头部frame-title frameless-titlebar

