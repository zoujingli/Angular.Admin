define(['require', 'angular', 'oclazyload', 'angular-ui-router', 'angular-ui-bootstrap'], function (require, angular) {

    var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'oc.lazyLoad']);

    app.provider('RouterHelper', function () {
        this.filter = function (uri) {
            return  (uri === '' || uri === '/') ? '/welcome/hello' : uri;
        };
        this.loadTemplate = function (uri) {
            return  'pages' + this.filter(uri) + '.html'
        };
        this.loadScript = function (uri) {
            return 'pages' + this.filter(uri) + '.js';
        };
        this.$get = {};

    });

    app.config(['$ocLazyLoadProvider', '$stateProvider', 'RouterHelperProvider', '$urlRouterProvider', function ($ocLazyLoadProvider, $stateProvider, helper, $urlRouterProvider) {
            $ocLazyLoadProvider.config({asyncLoader: require});
            $urlRouterProvider.deferIntercept(true);
            $stateProvider.state('root', {
                views: {
                    'menu.top': {
                        templateUrl: function () {
                            return helper.loadTemplate('/menu/top');
                        },
                        resolve: {
                            load: function ($ocLazyLoad) {
                                return $ocLazyLoad.load(helper.loadScript('/menu/top'));
                            }
                        }
                    },
                    'menu.left': {
                        templateUrl: function () {
                            return helper.loadTemplate('/menu/left');
                        },
                        resolve: {
                            load: function ($ocLazyLoad) {
                                return $ocLazyLoad.load(helper.loadScript('/menu/left'));
                            }
                        }
                    },
                    "main": {
                        templateUrl: function () {
                            return helper.loadTemplate(app.$location.$$path);
                        },
                        resolve: {
                            load: function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    files: [helper.loadScript(app.$location.$$path)]
                                });
                            }
                        }
                    }
                }
            });
        }]);

    app.run(['$state', '$stateParams', '$rootScope', '$location', '$timeout', function ($state, $stateParams, $rootScope, $location, $timeout) {
            $rootScope.ptitle = 'Angular.Admin';
            // 默认状态
            $state.go('root', $stateParams);
            // 地址变化处理
            $rootScope.$on('$locationChangeSuccess', function () {
                $state.current.name && $state.reload($state.current);
            });
            $rootScope.app = {};
            $rootScope.app.loyout = false;
            $timeout(function () {
                $rootScope.app.loyout = true;
            }, 2000);

            // 变量全局绑定
            app.$location = $location;
            app.$state = $state;
            app.$stateParams = $stateParams;
        }]);

    return app;
});