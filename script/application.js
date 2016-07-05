define(['require', 'angular', 'angular-ui-router', 'angular-ui-bootstrap', 'angular-cookies'], function (require, angular) {

    /**
     * 定义模块
     * @type @exp;angular@call;module
     */
    var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngCookies']);

    /**
     * 初始化运行方法
     */
    app.run(function ($http, $cookies) {
        // 检查用户登录
        var user = $cookies.getObject('user');
        // 进入用户登录界面
        if (!(user && user.username && user.password)) {
            require(['app.login'], function (module) {
                module.bootstrap();
            });
        }
        // 进入后台管理界面
        else {
            require(['app.admin'], function (module) {
                $http.get('script/module/app.admin.layout.html').success(function (ret) {
                    document.body.innerHTML = ret;
                    module.bootstrap();
                });
            });
        }
    });

    /**
     * APP启动方法
     * @returns {undefined}
     */
    app.bootstrap = function () {
        angular.bootstrap(document.body, [app.name]);
        angular.element(document.body).addClass('ng-app');
    };

    /**
     * 返回模块对象
     */
    return app;
});