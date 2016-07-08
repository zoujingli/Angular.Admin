define(['require', 'angular', 'app.extends', 'angular-ui-router', 'angular-ui-bootstrap', 'angular-cookies'], function (require, angular, appExtends) {

    var app = angular.module('app.login', ['ui.router', 'ui.bootstrap', 'ngCookies']).config(config);
    appExtends(app);

    config.$inject = ['$stateProvider', 'appRouterProvider'];
    function config($stateProvider, helper) {
        $stateProvider.state('login', {
            templateUrl: function () {
                return helper.loadTemplate('/login/in');
            },
            resolve: {
                load: ["$q", function ($q) {
                        var deferred = $q.defer();
                        require([helper.loadScript('/login/in')], function () {
                            deferred.resolve();
                        });
                        return deferred.promise;
                    }]
            }
        });
    }


    app.run(['$state', '$location', '$stateParams', '$rootScope', '$injector', '$cookies', 'appExtends',
        function ($state, $location, $stateParams, $rootScope, $injector, $cookies, appExtends) {
            appExtends.apply($injector);
            // 样式显示
            $rootScope.app = {layout: {class: {}}};
            $rootScope.$state = $state;
            $rootScope.$location = $location;
            // URI访问处理
            $rootScope.$on('$locationChangeSuccess', function () {
                $state.current.name && $state.reload($state.current);
                $location.spm && $location.search('spm', null);
            });
            // 检查用户登录
            var user = $cookies.getObject('user');
            if (!(user && user.username && user.password)) {
                $location.path('login/in');
                $location.spm = '';
                $state.go('login', $stateParams);
            } else {
                $location.path('welcome/hello');
                window.location.reload();
            }
        }]);

    /**
     * APP启动入口
     * @returns {undefined}
     */
    app.bootstrap = function () {
        angular.bootstrap(document, [app.name]);
        angular.element(document).addClass('ng-app');
    };

    /**
     * 返回模块对象
     */
    return app;
});