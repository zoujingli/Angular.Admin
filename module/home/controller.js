/* global angular */

define(['jquery', "angular", 'angularRoute', 'angularCookies'], function ($, angular) {
    return angular.module('Admin', ['ngRoute', 'ngCookies']).controller('main', function ($scope, $cookies, $rootScope) {
        $rootScope.menu = {
            showLeft: function (node) {
                $('[data-menu-box]').not($('[data-menu-box="' + node + '"]').show()).hide();
            },
            toggleLeft: function () {
                $('.framework-body').toggleClass('framework-sidebar-mini framework-sidebar-full')
            }
        };
        $rootScope.username = $cookies.get('username');
        $rootScope.password = $cookies.get('password');
        $rootScope.logout = function () {
            if (window.confirm('确定要退出登录吗？')) {
                $cookies.remove('username');
                $cookies.remove('password');
                window.location.href = './login.html';
            }
        };
    }).config(function ($routeProvider) {
        $routeProvider.when('/main', {
            templateUrl: 'module/home/index.html',
            controller: 'main'
        }).otherwise({
            redirectTo: '/main'
        });
    }).run(function ($cookies, $rootScope) {
        $rootScope.ptitle = '后台首页';
        function check_login() {
            if (!($cookies.get('username') && $cookies.get('password'))) {
                window.location.href = './login.html';
            }
        }
        $rootScope.$on("$routeChangeStart", check_login), check_login.call(this);
    });

});

