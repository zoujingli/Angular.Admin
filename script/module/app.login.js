define(['require', 'angular', 'angular-ui-router', 'angular-ui-bootstrap', 'angular-cookies'], function (require, angular) {

    var app = angular.module('app.login', ['ui.router', 'ui.bootstrap', 'ngCookies']).config(config);

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
        this.$get = function () {

        };

    });

    config.$inject = ['$stateProvider', 'RouterHelperProvider'];
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

    app.provider('ngProviders', [
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',
        '$injector',
        function ($controllerProvider, $compileProvider, $filterProvider, $provide, $injector) {
            this.$get = function () {
                return {
                    $controllerProvider: $controllerProvider,
                    $compileProvider: $compileProvider,
                    $filterProvider: $filterProvider,
                    $provide: $provide,
                    $injector: $injector
                };
            };
        }
    ]);

    app.run([
        '$state',
        '$location',
        '$stateParams',
        '$rootScope',
        'ngProviders',
        '$injector',
        '$cookies',
        function ($state, $location, $stateParams, $rootScope, ngProviders, $injector, $cookies) {
            var $controllerProvider = ngProviders.$controllerProvider;
            var $compileProvider = ngProviders.$compileProvider;
            var $filterProvider = ngProviders.$filterProvider;
            var $provide = ngProviders.$provide;

            /**
             * 动态注入一个 Angular 模块
             * @param {type} name
             * @returns {application_L1.app}
             */
            app.useModule = function (name) {
                var module = angular.module(name);
                if (module.requires) {
                    for (var i = 0; i < module.requires.length; i++) {
                        app.useModule(module.requires[i]);
                    }
                }
                angular.forEach(module._invokeQueue, function (args) {
                    var provider = ngProviders[args[0]] || $injector.get(args[0]);
                    provider[args[1]].apply(provider, args[2]);
                });
                angular.forEach(module._configBlocks, function (args) {
                    var provider = ngProviders.$injector.get(args[0]);
                    provider[args[1]].apply(provider, args[2]);
                });
                angular.forEach(module._runBlocks, function (args) {
                    $injector.invoke(args);
                });
                return app;
            };

            app.get = function (name) {
                return $injector.get(name);
            };
            app.value = function (name, value) {
                $provide.value(name, value);
                return app;
            };
            app.constant = function (name, value) {
                $provide.constant(name, value);
                return app;
            };
            app.factory = function (name, factory) {
                $provide.factory(name, factory);
                return app;
            };
            app.service = function (name, service) {
                $provide.service(name, service);
                return app;
            };
            app.filter = function (name, filter) {
                $filterProvider.register(name, filter);
                return app;
            };
            app.directive = function (name, directive) {
                $compileProvider.directive(name, directive);
                return app;
            };
            app.controller = function (name, controller) {
                $controllerProvider.register(name, controller);
                return app;
            };
            app.decorator = function (name, decorator) {
                $provide.decorator(name, decorator);
                return app;
            };
            app.provider = function (name, provider) {
                $provide.provider(name, provider);
                return app;
            };

            // 样式显示
            $rootScope.app = {layout: {class: {}}};
            $rootScope.$state = $state;
            $rootScope.$location = $location;
            // URI访问处理
            app.path = $location.$$path;
            $rootScope.$on('$locationChangeSuccess', function () {
                app.path = $location.$$path;
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
                $state.go('root', $stateParams);
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