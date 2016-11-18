/* global require */

/**
 * 应用启动文件
 *
 * @author Anyon <zoujingli@qq.com>
 * @date 2016/11/04 16:10
 */
require.config({
    waitSeconds: 0,
    baseUrl: './',
    map: {'*': {'css': '//cdn.bootcss.com/require-css/0.1.8/css.min.js'}},
    paths: {
        'app.config': ['script/config'],
        'plugs.debug': ['script/plugs/debug'],
        'plugs.message': ['script/plugs/message'],
        'plugs.validate': ['script/plugs/validate'],
        'myView': ['script/provider/myView'],
        'layui': ['script/plugs/layui/layui'],
        'pace': ['//cdn.bootcss.com/pace/1.0.2/pace.min'],
        'jquery': ['//cdn.bootcss.com/jquery/1.12.4/jquery.min'],
        'angular': ['//cdn.bootcss.com/angular.js/1.5.7/angular.min'],
        'sweetalert': ['//cdn.bootcss.com/sweetalert/1.1.3/sweetalert.min'],
        'ngCookies': ['//cdn.bootcss.com/angular.js/1.5.7/angular-cookies.min'],
        'ngSanitize': ['//cdn.bootcss.com/angular-sanitize/1.5.8/angular-sanitize.min'],
        'ngRoute': ['//cdn.bootcss.com/angular.js/1.5.8/angular-route.min'],
        'ui.bootstrap': ['//cdn.bootcss.com/angular-ui-bootstrap/1.3.3/ui-bootstrap-tpls.min']
    },
    shim: {
        'pace': {deps: ['css!//cdn.bootcss.com/pace/1.0.2/themes/green/pace-theme-loading-bar.min.css']},
        'sweetalert': {deps: ['css!//cdn.bootcss.com/sweetalert/1.1.3/sweetalert.min.css']},
        'layui': {deps: ['css!script/plugs/layui/css/layui.css', 'jquery']},
        'plugs.debug': {deps: ['jquery']},
        'angular': {exports: 'angular'},
        'ngRoute': {deps: ['angular']},
        'myView': {desp: ['angular', 'ngRoute']},
        'ngCookies': {deps: ['angular']},
        'ngSanitize': {deps: ['angular']},
        'ui.bootstrap': {deps: ['angular', 'css!//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css']}
    },
    deps: ['css!theme/css/animate.css', 'css!theme/css/common.css'],
    urlArgs: "v=" + (new Date()).getTime()
});

/**
 * 加载进度显示
 * @returns {undefined}
 */
require(['pace'], function (pace) {
    pace.start();
});

/**
 * 应用启动器
 * @param {type} angular
 * @returns {undefined}
 */
require(['angular', 'ngRoute', 'myView', 'ui.bootstrap'], function (angular) {
    // 创建APP应用
    var app = angular.module('app', ['ngRoute', 'myView', 'ui.bootstrap']);
    // 应用启动配置
    app.config(['$routeProvider', '$viewProvider', function ($routeProvider, $viewProvider) {
        var initPath = 'user/login.html';
        $viewProvider.registerView(initPath);
        $routeProvider.otherwise(initPath);
    }]);
    // 应用初始化动作
    app.run(['$location', '$view', '$rootScope', function ($location, $view, $rootScope) {
        // 页面全局属性定义
        $rootScope.app = {
            layout: {
                class: {body: 'login'}
            },
            site: {
                title: 'Angular.Admin',
                icon: 'http://static.cdn.cuci.cc/2016/0421/3586e898350c0890cf41a4828175d468.ico'
            }
        };
        // 动态注册PATH路由视图
        $view.registerView($location.$$path);
    }]);
    // 启动应用
    require(['layui'], function () {
        angular.bootstrap(document, [app.name]);
    });
});