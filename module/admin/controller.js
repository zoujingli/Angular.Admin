/* global angular */

define(['require', "angular", 'angularRoute', 'angularCookies'], function (require, angular) {

    var app = angular.module('admin', ['ngRoute', 'ngCookies']).controller('admin.main', function ($scope, $cookies, $rootScope) {

    });

    app.run(function ($cookies, $rootScope) {
        $rootScope.ptitle = '后台首页';
        $rootScope.body = 'module/admin/index.html';
        $rootScope.username = $cookies.get('username');
        $rootScope.password = $cookies.get('password');
        // 菜单控制
        $rootScope.menu = {
            showLeft: function (node) {
                $('[data-menu-box]').not($('[data-menu-box="' + node + '"]').show()).hide();
            },
            toggleLeft: function () {
                $('.framework-body').toggleClass('framework-sidebar-mini framework-sidebar-full')
            }
        };
        // 退出登录
        $rootScope.logout = function () {
            if (window.confirm('确定要退出登录吗？')) {
                $cookies.remove('username');
                $cookies.remove('password');
                window.location.href = './index.html';
            }
        };
        // 检查登录
        function check_login() {
            if (!($cookies.get('username') && $cookies.get('password'))) {
                window.location.href = './index.html';
            }
        }
        $rootScope.$on("$routeChangeStart", check_login), check_login.call(this);
    });

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

