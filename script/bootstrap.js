/* global require */

/**
 * 配置require文件位置
 * @param {type} param
 */
require.config({
    baseUrl: './',
    paths: {
        'spin': 'node_modules/spin/dist/spin.min',
        'app.login': 'script/module/app.login',
        'app.admin': 'script/module/app.admin',
        'ng-tags-input': ['node_modules/ng-tags-input/build/ng-tags-input.min'],
        'angular': ['node_modules/angular/angular.min'],
        'angular-cookies': ["node_modules/angular-cookies/angular-cookies.min"],
        'angular-ui-router': ['node_modules/angular-ui-router/release/angular-ui-router.min'],
        'angular-ui-bootstrap': ['node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls'],
    },
    shim: {
        'angular': {exports: 'angular'},
        'ng-tags-input': {deps: ['angular']},
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
require(['spin'], function () {
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
require(['require', 'angular', 'angular-cookies'], function (require, angular) {
    /*! 定义模块 */
    var app = angular.module('app', ['ngCookies']);
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
//    angular.bootstrap(document.body, [app.name]);
    angular.element(document.body).addClass('ng-app');

});

