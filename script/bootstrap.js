/* global require */

/**
 * 配置require文件位置
 * @param {type} param
 */
require.config({
    baseUrl: './',
    map: {'*': {'css': '//cdn.bootcss.com/require-css/0.1.8/css.min'}},
    paths: {
        'app.login': 'script/module/app.login',
        'app.admin': 'script/module/app.admin',
        'spin': ['//cdn.bootcss.com/spin.js/2.3.2/spin.min', 'node_modules/spin/dist/spin.min'],
        'angular': ['//cdn.bootcss.com/angular.js/1.5.7/angular.min', 'node_modules/angular/angular.min'],
        'ng-tags-input': ['//cdn.bootcss.com/ng-tags-input/3.1.1/ng-tags-input.min', 'node_modules/ng-tags-input/build/ng-tags-input.min'],
        'angular-animate': ["//cdn.bootcss.com/angular.js/1.5.7/angular-animate.min", 'node_modules/angular-animate/angular-animate.min'],
        'angular-cookies': ['//cdn.bootcss.com/angular.js/1.5.7/angular-cookies.min', "node_modules/angular-cookies/angular-cookies.min"],
        'angular-ui-router': ['//cdn.bootcss.com/angular-ui-router/0.3.1/angular-ui-router.min', 'node_modules/angular-ui-router/release/angular-ui-router.min'],
        'angular-ui-bootstrap': ['//cdn.bootcss.com/angular-ui-bootstrap/1.3.3/ui-bootstrap-tpls.min', 'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls'],
    },
    shim: {
        'angular': {exports: 'angular'},
        'ng-tags-input': {deps: ['angular']},
        'angular-animate': {deps: ['angular']},
        'angular-cookies': {deps: ['angular']},
        'angular-ui-router': {deps: ['angular']},
        'angular-ui-bootstrap': {deps: ['angular']},
    },
    deps: ['angular', 'angular-ui-bootstrap'],
    urlArgs: "v=" + (new Date()).getTime()
});

/**
 * 加载进度显示
 * @returns {undefined}
 */
require(['spin'], function (Spinner) {
    new Spinner({
        lines: 7, length: 0, width: 12, radius: 25, scale: 1, corners: 1, color: '#000', opacity: 0.15,
        rotate: 0, direction: 1, speed: 1, trail: 60, fps: 20, zIndex: 2e9, className: 'display-inline-block',
        top: '50%', left: '50%', shadow: true, hwaccel: true, position: 'absolute'
    }).spin(document.getElementById('preloader'));
});

/**
 * 定义并启动基础应用模块
 * @param {type} require
 * @param {type} angular
 * @returns {undefined}
 */
require(['require', 'angular', 'angular-cookies', 'angular-animate'], function (require, angular) {
    /*! 定义模块 */
    var app = angular.module('app', ['ngCookies', 'ngAnimate']);
    /*! 全局运行 */
    app.run(function ($http, $cookies) {
        /*! 检查用户登录 */
        var user = $cookies.getObject('user');
        /*! 进入用户登录界面 */
        if (!(user && user.username && user.password)) {
            require(['app.login'], function (module) {
                module.bootstrap();
            });
        }
        /*! 进入后台管理界面 */
        else {
            require(['app.admin'], function (module) {
                $http.get('script/module/app.admin.layout.html').success(function (ret) {
                    document.body.innerHTML = ret;
                    module.bootstrap();
                });
            });
        }
    });
    /*! 启用动态模块 */
    angular.bootstrap(document.body, [app.name]);
    angular.element(document.body).addClass('ng-app');

});

