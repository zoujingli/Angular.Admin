#Angular.Admin

基于 RequireJs+AngluarJs+Bootstrap 的管理平台

大道至简，清晰简洁的模块构建，让WEB起步变得更简单

**项目于2016年11月18日基于新架构重构，旧版本已经切换到 [old-master](https://git.oschina.net/zoujingli/Angular.Admin/tree/old-master/) 分支**

更新日志
--
```

2016-11-20
-------------------------------------------------

1. 完成表单自定义组件 myForm ,支持自动验证与提交
   
   在form元素上添加属性 data-auto=true ，绑定自动提交事件
   
   input元素上可设置 data-tips 属性，用于指定错误时的显示内容


2016-11-19
-------------------------------------------------

1. 完成 require 与 angular 组合启动应用

2. 完成基于 ngRoute 的自动路由机制

3. 完成 angular 模块自定加载与注册

``` 

使用方法
--
##### 1. 下载项目代码到你的WEB目录中
```shell
git clone http://git.oschina.net/zoujingli/Angular.Admin.git
cd Angular.Admin
```

##### 2. 使用HTTP访问项目中的index.html
```link
http://zoujingli.oschina.io/angular.admin
```