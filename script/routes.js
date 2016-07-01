/* global */

define(function (require) {
    var app = require('app');
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', function ($stateProvider, $urlRouterProvider, $controllerProvider) {
            app.$controllerProvider = $controllerProvider;
            $urlRouterProvider.rule(function ($injector, $location) {
                if (!$location.path()) {
                    return 'welcome';
                }
            });
            $stateProvider.state('root', {
                templateUrl: function () {
                    return 'pages' + app.$location.$$path + '.html';
                },
                controller: 'OtherCtrl',
                resolve: {
                    loadOtherCtrl: ["$q", function ($q) {
                            var deferred = $q.defer();
                            require(['pages' + app.$location.$$path + '.js'], function () {
                                deferred.resolve();
                            });
                            return deferred.promise;
                        }],
                }
            });
        }]).run(['$state', '$stateParams', '$rootScope', '$location', function ($state, $stateParams, $rootScope, $location) {
            app.$location = $location;
            app.$state = $state;
            app.$stateParams = $stateParams;
            $state.go('root', $stateParams);
        }]);
    return app;
});

