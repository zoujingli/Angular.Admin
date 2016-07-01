/* global require */

require.config({
    baseUrl: './',
    paths: {
        'application': 'script/application',
        'ng-tags-input': ['node_modules/ng-tags-input/build/ng-tags-input.min'],
        'angular': ['//cdn.bootcss.com/angular.js/1.5.7/angular.min', 'node_modules/angular/angular.min'],
        'oclazyload': ['//cdn.bootcss.com/oclazyload/1.0.9/ocLazyLoad.require.min', 'node_modules/oclazyload/dist/ocLazyLoad.require.min'],
        'angular-ui-router': ['//cdn.bootcss.com/angular-ui-router/0.3.1/angular-ui-router.min', 'node_modules/angular-ui-router/release/angular-ui-router.min'],
        'angular-ui-bootstrap': ['//cdn.bootcss.com/angular-ui-bootstrap/1.3.3/ui-bootstrap-tpls.min', 'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls'],
    },
    shim: {
        'angular': {exports: 'angular'},
        'ng-tags-input': {deps: ['angular']},
        'oclazyload': {deps: ['angular']},
        'angular-ui-router': {deps: ['angular']},
        'angular-ui-bootstrap': {deps: ['angular']},
    },
    deps: ['angular', 'application']
});

/**
 * 载入并 Angluar 模块
 * @param {type} angular
 * @returns {undefined}
 */
require(['angular', 'application', 'angular-ui-bootstrap'], function (angular) {
    angular.bootstrap(document, ['app']);
    angular.element(document).find('html').addClass('ng-app');
});

