/**
 * 模块配置
 * @param {type} param
 */
require.config({
    baseUrl: 'module/login',
    paths: {
        bootcss: ['//cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min'],
        jquery: ['//cdn.bootcss.com/jquery/1.12.4/jquery.min', '../../vendor/jquery/jquery.min'],
        jquerySupersized: ['js/supersized.3.2.7.min'],
        angular: ['//cdn.bootcss.com/angular.js/1.5.6/angular.min'],
        angularRoute: ['//cdn.bootcss.com/angular.js/1.5.6/angular-route.min'],
        angularCookies: ['//cdn.bootcss.com/angular.js/1.5.6/angular-cookies.min'],
    },
    map: {'*': {css: '../../vendor/require/require.css.min'}},
    shim: {
        bootcss: {
            deps: ['css!//cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css'],
            exports: 'bootcss'
        },
        jquery: {
            exports: 'jquery',
        },
        jquerySupersized: {
            deps: ['jquery'],
            exports: 'jquerySupersized'
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
    deps: ['css!//cdn.bootcss.com/font-awesome/4.6.3/css/font-awesome.min.css'],
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
        angular.bootstrap(document, ['Login']);
    });
});
