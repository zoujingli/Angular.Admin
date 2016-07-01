/* global */

define(function (require) {
    var app = require('app');

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.rule(function ($injector, $location) {
                if (!$location.path()) {
                    return 'welcome';
                }
            });
            $stateProvider.state('root', {
                templateUrl: function () {
                    return 'pages' + app.$location.$$path + '.html';
                },
                controller: function ($scope, $injector) {
                    require(['pages' + app.$location.$$path + '.js'], function (module) {
                        $injector.invoke(module, this, {'$scope': $scope});
                    });
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

