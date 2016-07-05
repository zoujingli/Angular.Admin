/* global require */

/**
 * 配置require文件位置
 * @param {type} param
 */
require.config({
    baseUrl: './',
    paths: {
        'spin': 'node_modules/spin/dist/spin.min',
        'app': 'script/application',
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
    deps: ['angular', 'app'],
    urlArgs: "v=" + (new Date()).getTime()
});

/**
 * 载入并启动 Angluar 模块
 * @param {type} angular
 * @returns {undefined}
 */
require(['app', 'angular-ui-bootstrap'], function (app) {
    app.bootstrap();
});

