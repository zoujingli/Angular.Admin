/* global require */

require.config({
    baseUrl: './',
    paths: {
        'app': 'script/application',
        'ng-tags-input': ['node_modules/ng-tags-input/build/ng-tags-input.min'],
        'angular': ['node_modules/angular/angular.min'],
        'angular-ui-router': ['node_modules/angular-ui-router/release/angular-ui-router.min'],
        'angular-ui-bootstrap': ['node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls'],
    },
    shim: {
        'angular': {exports: 'angular'},
        'ng-tags-input': {deps: ['angular']},
        'angular-ui-router': {deps: ['angular']},
        'angular-ui-bootstrap': {deps: ['angular']},
    },
    deps: ['angular', 'app']
});

/**
 * 载入并 Angluar 模块
 * @param {type} angular
 * @returns {undefined}
 */
require(['angular', 'app', 'angular-ui-bootstrap'], function (angular) {
    angular.bootstrap(document, ['app']);
    angular.element(document).find('html').addClass('ng-app');
});

