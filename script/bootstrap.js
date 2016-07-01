/* global require */

require.config({
    baseUrl: './',
    paths: {
        'app.router': 'script/routes',
        'angular': ['//cdn.bootcss.com/angular.js/1.5.7/angular.min', 'node_modules/angular/angular.min'],
        'angular-ui-router': ['//cdn.bootcss.com/angular-ui-router/0.3.1/angular-ui-router.min', 'node_modules/angular-ui-router/release/angular-ui-router.min'],
        'angular-ui-bootstrap': ['//cdn.bootcss.com/angular-ui-bootstrap/1.3.3/ui-bootstrap-tpls.min', 'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls'],
    },
    shim: {
        'angular': {exports: 'angular'},
        'angular-i18n': {deps: ['angular']},
        'angular-ui-router': {deps: ['angular']},
        'angular-ui-bootstrap': {deps: ['angular']},
    }
});

/**
 * 定义基础模块
 * @param {type} require
 * @returns {unresolved}
 */
define('app', ['angular', 'angular-ui-router', 'angular-ui-bootstrap'], function (angular) {
    return angular.module('app', ['ui.router', 'ui.bootstrap']);
});

/**
 * 启用 Angluar 模块
 * @param {type} angular
 * @returns {undefined}
 */
require(['angular', 'app.router'], function (angular) {
    angular.bootstrap(document, ['app']);
    angular.element(document).find('html').addClass('ng-app');
});

