define(['require', 'angular', 'app.extends', 'angular-ui-router', 'angular-ui-bootstrap', 'angular-cookies'], function (require, angular, appExtends) {

    var app = angular.module('app.admin', ['ui.router', 'ui.bootstrap', 'ngCookies']).config(config);

    appExtends(app);

    config.$inject = ['$stateProvider', 'appRouterProvider'];
    function config($stateProvider, helper) {
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

    app.run(['$state', '$location', '$stateParams', '$rootScope', '$injector', '$cookies', 'appExtends',
        function ($state, $location, $stateParams, $rootScope, $injector, $cookies, appExtends) {
            // app扩展 
            appExtends.apply($injector);
            // 样式显示
            $rootScope.app = {
                layout: {
                    class: {
                        'top': 'framework-topbar',
                        'fullmain': 'framework-body framework-sidebar-full',
                        'minimain': 'framework-body framework-sidebar-mini'
                    },
                    loaded: false
                }
            };
            $rootScope.$state = $state;
            $rootScope.$location = $location;
            // URI访问处理
            app.path = $location.$$path;
            $rootScope.$on('$locationChangeSuccess', function () {
                app.path = $location.$$path;
                $state.current.name && $state.reload($state.current);
                $location.spm && $location.search('spm', $location.spm);
            });

            // 检查用户登录
            var user = $cookies.getObject('user');
            if (!(user && user.username && user.password)) {
                $rootScope.logout();
            } else {
                $state.go('root', $stateParams);
            }
            // 退出登录
            $rootScope.logout = function () {
                if (window.confirm('确定要退出系统吗？')) {
                    $cookies.remove('user');
                    $location.spm = null;
                    window.location.reload();
                }
            };
            // 加载用户数据
            $rootScope.app.user = $cookies.getObject('user');
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