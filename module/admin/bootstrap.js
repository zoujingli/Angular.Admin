/**
 * 模块配置
 * @param {type} param
 */
require.config({
    baseUrl: 'module/admin',
    map: {'*': {css: '../../vendor/require/require.css.min'}},
    paths: {
        admin: ['//cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min'],
        jquery: ['//cdn.bootcss.com/jquery/1.12.4/jquery.min', '../../vendor/jquery/jquery.min'],
        angular: ['//cdn.bootcss.com/angular.js/1.5.6/angular.min'],
        angularRoute: ['//cdn.bootcss.com/angular.js/1.5.6/angular-route.min'],
        angularCookies: ['//cdn.bootcss.com/angular.js/1.5.6/angular-cookies.min'],
    },
    shim: {
        jquery: {
            exports: 'jquery',
        },
        admin: {
            exports: 'admin',
            deps: [
                'jquery',
                'css!//cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css',
                'css!//cdn.bootcss.com/font-awesome/4.6.3/css/font-awesome.min.css',
                'css!//basic.demo.cuci.cc/static/theme/css/console.css',
            ],
        },
        angular: {
            exports: 'angular'
        },
        angularRoute: {
            deps: ['angular'],
            exports: 'angularRoute'
        },
        angularCookies: {
            deps: ['angular'],
            exports: 'angularCookies'
        }
    },
    deps: ['admin'],
    urlArgs: "t=" + (new Date()).getTime()
});
/**
 * 启动应用
 * @param {type} require
 * @param {type} angular
 * @returns {undefined}
 */
define(['require', 'angular', 'controller'], function (require, angular) {
    'use strict';
    require(['controller'], function () {
        angular.bootstrap(document, ['Admin']);
    });
});
