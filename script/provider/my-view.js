/* global require */

/**
 * 应用视图扩展模块
 * @param {type} angular
 * @author Anyon <zoujingli@qq.com>
 * @date 2016/11/20 01:23
 */
define(['angular'], function (angular) {
    angular.module('myView', []).provider('$view', ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$injector', '$routeProvider',
        function ($controllerProvider, $compileProvider, $filterProvider, $provide, $injector, $routeProvider) {
            this.views = {};
            var self = this, ngProviders = {
                $controllerProvider: $controllerProvider,
                $compileProvider: $compileProvider,
                $filterProvider: $filterProvider,
                $injector: $injector,
                $provide: $provide
            };
            /*! 动态注入模块 */
            this.registerModule = function (name) {
                var module = angular.module(name);
                if (module.requires) {
                    for (var i = 0; i < module.requires.length; i++) {
                        self.registerModule(module.requires[i]);
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
            };
            /*! 动态注入视图 */
            this.registerView = function (viewConfig) {
                if (typeof viewConfig === 'string') {
                    viewConfig = {path: viewConfig};
                }
                viewConfig.path = viewConfig.path.replace(/^\/|\/$/, '') || 'login.html';
                var moduleName = viewConfig.path.replace(/\//ig, '.').replace(/\.html$/, '');
                if (moduleName.split('.').length < 2) {
                    moduleName += '.index';
                }
                viewConfig.viewUrl = viewConfig.viewUrl || ('/' + viewConfig.path);
                viewConfig.templateUrl = viewConfig.templateUrl || ('pages/' + moduleName.replace(/\./ig, '/') + '.html');
//                viewConfig.cssUrl = viewConfig.cssUrl || ('pages/' + moduleName.replace(/\./ig, '/') + '.css');
                viewConfig.requireJs = viewConfig.requireJs || ('pages/' + moduleName.replace(/\./ig, '/') + '.js');
                viewConfig.controller = viewConfig.controller || 'Construct';
                if (!viewConfig.module) {
                    viewConfig.module = moduleName.replace(/\w\S*/g, function (txt) {
                        var tem = txt.split('.'), str = '';
                        for (var i in tem) {
                            str += (tem[i].charAt(0).toUpperCase() + tem[i].substr(1).toLowerCase());
                        }
                        return str;
                    });
                }
                if (this.views[viewConfig.viewUrl]) {
                    return false;
                }
                this.views[viewConfig.viewUrl] = viewConfig;
                $routeProvider.when(viewConfig.viewUrl, {
                    templateUrl: viewConfig.templateUrl,
                    controller: viewConfig.controller,
                    resolve: {
                        resolver: ['$q', '$timeout', function ($q, $timeout) {
                                var deferred = $q.defer();
//                                require(['css!' + viewConfig.cssUrl]);
                                require([viewConfig.requireJs], function (module) {
                                    module(viewConfig.module, viewConfig.controller);
                                    self.registerModule(viewConfig.module);
                                    $timeout(function () {
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }
                        ]
                    }
                });
            };
            /*! 跳转页面 */
            this.goto = function (uri) {
                angular.$location.path(uri);
                console.log("Go : " + angular.$location.$$path);
                !angular.$rootScope.$$phase && angular.$rootScope.$apply();
            };
            this.$get = function () {
                return {
                    views: self.views,
                    useModule: self.registerModule,
                    registerModule: self.registerModule,
                    useView: self.registerView,
                    registerView: self.registerView,
                    goto: self.goto
                };
            };
        }
    ]);
});
