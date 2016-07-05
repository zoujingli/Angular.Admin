#Angular.Admin

基于 RequireJs+AngluarJs+Bootstrap 的管理平台界面

### 开发日志

##### ================ 2016-07-01 更新 ================

    1.搭建基于NPM基础代码框架

    2.完成require与angular组合启动应用

##### ================ 2016-07-02 更新 ================
    
    1.完成基于ui-router的自动路由机制

    2.完成Angular的控制器自动加载

    3.完成Angular模块依赖动态注入, 如：app.useModule('ngCookies')
    
    4.完成后台菜单显示, 基于cookie与server控制

##### ================ 2016-07-03 更新 ================

    1. 修改并优化前一天的模块

##### ================ 2016-07-04 更新 ================

    1. 合并封装菜单状态处理代码

    2. 增加菜单缓存机制

##### ================ 2016-07-05 更新 ================

    1. 增加登录模块，并使用Cookie记录状态

    2. 分离入口|后台|登录模块（app|app.admin|app.login）

    3. 增加表单验证样式（见登录页面）
    
    4. 优化页面加载过程的提示

##### ============================================


### 使用方法
##### 1. 下载项目代码到你的WEB目录中
```shell
git clone http://git.oschina.net/zoujingli/Angular.Admin.git
cd Angular.Admin
```
##### 2. 运行NPM命令安装相关依赖组件
```shell
npm install
```
##### 3. 使用HTTP访问项目中的index.html
```link
http://angular.html.ctolog.com/index.html
```


### 技术领域

服务端：PHP CodeIgnite3 + MySQL

客户端：RequireJs + AngluarJs + Bootstrap


### 阶段里程碑

一. 前端UI构建

二. 后端Oauth权限机制

三. 数据动态化 