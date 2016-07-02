define(['require', 'angular', 'angular-ui-router', 'angular-ui-bootstrap'], function (require, angular) {

    var app = angular.module('app', ['ui.router', 'ui.bootstrap']).config(config);

    app.provider('RouterHelper', function () {
        this.filter = function (uri) {
            return  (uri === '' || uri === '/') ? '/welcome/hello' : uri;
        };
        this.loadTemplate = function (uri) {
            return  'pages' + this.filter(uri) + '.html';
        };
        this.loadScript = function (uri) {
            return 'pages' + this.filter(uri) + '.js';
        };
        this.$get = {};

    });

    config.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$stateProvider', 'RouterHelperProvider'];
    function config($controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider, helper) {
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;

        $stateProvider.state('root', {
            views: {
                'main.top': {
                    templateUrl: function () {
                        return helper.loadTemplate('/menu/top');
                    },
                    resolve: {
                        load: ["$q", function ($q) {
                                var deferred = $q.defer();
                                require([helper.loadScript('/menu/top')], function () {
                                    deferred.resolve();
                                });
                                return deferred.promise;
                            }]
                    }
                },
                'main.left': {
                    templateUrl: function () {
                        return helper.loadTemplate('/menu/left');
                    },
                    resolve: {
                        load: ["$q", function ($q) {
                                var deferred = $q.defer();
                                require([helper.loadScript('/menu/left')], function () {
                                    deferred.resolve();
                                });
                                return deferred.promise;
                            }]
                    }
                },
                "main.content": {
                    templateUrl: function () {
                        return helper.loadTemplate(app.path);
                    },
                    resolve: {
                        load: ["$q", function ($q) {
                                var deferred = $q.defer();
                                require([helper.loadScript(app.path)], function () {
                                    deferred.resolve();
                                });
                                return deferred.promise;
                            }]
                    }
                }
            }
        });

    }

    app.run(['$state', '$stateParams', '$rootScope', '$location', '$timeout', function ($state, $stateParams, $rootScope, $location) {
            $rootScope.ptitle = 'Angular.Admin';
            $rootScope.app = app;
            app.layout = {
                'menu': 'framework-topbar',
                'main': 'framework-body framework-sidebar-full',
                loaded: true
            };
            // URI访问处理
            app.path = $location.$$path;
            $rootScope.$on('$locationChangeSuccess', function () {
                app.path = $location.$$path;
                $state.current.name && $state.reload($state.current);
            });
            // 启用默认路由
            $state.go('root', $stateParams);
        }]);

    return app;
});