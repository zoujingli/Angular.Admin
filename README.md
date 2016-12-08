#Angular.Admin

[Angular.Admin](http://zoujingli.oschina.io/angular.admin) 是一个基于 `RequireJs`+`AngluarJs`+`Layui` 搭建的`Web`前端开发平台。

**大道至简，重剑无锋。**

[Angular.Admin](http://zoujingli.oschina.io/angular.admin) 清晰简洁的模块构建，让高端`WEB`搭建起步变得更简单。

**重构**：项目于2016年11月18日基于新架构进行重构，旧版本已经切换到 [old-master](https://git.oschina.net/zoujingli/Angular.Admin/tree/old-master/) 分支

更新日志
--
```
2016-11-23
-------------------------------------------------

1. 合并模块，移除模块 css 加载

2. 分离 provider与 plugs ，优化页面依赖


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
##### 1. 下载代码到你的`webroot`目录
```shell
git clone http://git.oschina.net/zoujingli/Angular.Admin.git

cd Angular.Admin
```

##### 2. 使用`HTTP`访问项目中的`index.html`
```link
http://zoujingli.oschina.io/angular.admin
```