/* global require */

require.config({
    baseUrl: './',
    paths: {
        'app': 'app',
        'angular': 'node_modules/angular/angular.min',
        'angular-ui-router': 'node_modules/angular-ui-router/release/angular-ui-router.min',
        'angular-async-loader': 'node_modules/angular-async-loader/angular-async-loader.min',
        'angular-ui-mask': 'node_modules/angular-ui-mask/dist/mask.min',
        'ng-tags-input': 'node_modules/ng-tags-input/build/ng-tags-input.min',
        'ng-file-upload': 'node_modules/ng-file-upload/dist/ng-file-upload-all.min'
    },
    shim: {
        'angular': {exports: 'angular'},
        'angular-ui-router': {deps: ['angular']}
    }
});

require(['angular', 'routes'], function (angular) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
        angular.element(document).find('html').addClass('ng-app');
    });
});

