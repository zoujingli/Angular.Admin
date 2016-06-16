/* global angular */

define(["angular", 'angularRoute', 'angularCookies'], function (angular) {

    /**
     * 定义模块
     * @type @exp;angular@call;module
     */
    var app = angular.module('admin', ['ngRoute', 'ngCookies']);

    /**
     * 定义admin.main控制器
     */
    app.controller('admin.main', function ($scope, $cookies, $rootScope) {

    });

    /**
     * 构造方法
     */
    app.run(function ($cookies, $rootScope) {
        $rootScope.ptitle = '后台首页';
        function check_login() {
            if (!($cookies.get('username') && $cookies.get('password'))) {
                window.location.href = './index.html';
            }
        }
        $rootScope.$on("$routeChangeStart", check_login), check_login.call(this);
    });

    /**
     * 模块路由配置
     */
    app.config(function ($routeProvider) {
        $routeProvider.when('/main', {
            templateUrl: 'module/admin/index.html',
            controller: 'admin.main'
        }).otherwise({
            redirectTo: '/main'
        });
    });

    return app;

});

