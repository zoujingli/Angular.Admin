/* global */

define(function (require) {
    var app = require('app');

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/index');
            $stateProvider.state('root', {
                templateUrl: 'pages/welcome.html',
//                templateUrl: function () {
//                    return 'pages' + app.$location.$$path + '.html';
//                },
////                controllerUrl: 'sdfa',
////                controller: 's222',
            });

        }]).run(['$state', '$stateParams', '$rootScope', '$location', function ($state, $stateParams, $rootScope, $location) {
//            app.$location = $location;
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $state.go('root', $stateParams);
        }]);
    return app;
});

