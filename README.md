#Angular.Admin

基于 RequireJs+AngluarJs+Bootstrap 的管理平台界面

代码简洁、模块清晰，


**项目于2016年11月18日基于新架构重构，旧版本已经切换到 [old-master](https://git.oschina.net/zoujingli/Angular.Admin/tree/old-master/) 分支。**

更新日志
--
   
    ================ 2016-11-20 更新 ================
   
       1. 完成表单自定义组件`myForm`,支持自动验证与提交
       
       > 在form元素上添加属性`data-auto=true`，绑定自动提交事件
       
       > input元素上可设置 `data-tips` 属性，用于指定错误时的显示内容
   
    ================ 2016-11-19 更新 ================

        1. 完成require与angular组合启动应用

        2. 完成基于 ngRoute 的自动路由机制

        3. 完成Angular的模块自定加载入注册
   

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