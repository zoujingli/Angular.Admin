define(['require', 'angular', 'oclazyload', 'angular-ui-router', 'angular-ui-bootstrap'], function (require, angular) {
    /**
     * 定义应用模块
     * @type @exp;angular@call;module
     */
    var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'oc.lazyLoad']);

    /**
     * 创建文件加载器
     */
    app.provider('RouterHelper', function () {
        this.filter = function (uri) {
            if (uri === '' || uri === '/')
                return '/welcome/hello';
        };
        
        this.loadTemplate = function (uri) {
            return  'pages' + this.filter(uri) + '.html'
        };
        this.loadScript = function (uri) {
            return 'pages' + this.filter(uri) + '.js';
        };

        this.$get = [''];
    });

    /**
     * 应用路由配置
     */
    app.config(['$ocLazyLoadProvider', '$stateProvider', 'RouterHelperProvider', function ($ocLazyLoadProvider, $stateProvider, helper) {
            $ocLazyLoadProvider.config({asyncLoader: require});
            $stateProvider.state('root', {
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
            });
        }]).run(['$state', '$stateParams', '$rootScope', '$location', function ($state, $stateParams, $rootScope, $location) {
            app.$location = $location;
            app.$state = $state;
            app.$stateParams = $stateParams;
            $state.go('root', $stateParams);
        }]);
    return app;
});