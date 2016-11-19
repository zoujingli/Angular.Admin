/* global require */

/**
 * 应用视图扩展模块
 * @param {type} angular
 */
define(['angular', 'jquery'], function (angular, $) {
    angular.module('myView', []).provider('$view', [
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',
        '$injector',
        '$routeProvider',
        function ($controllerProvider, $compileProvider, $filterProvider, $provide, $injector, $routeProvider) {
            this.views = {};
            var self = this, ngProviders = {
                $controllerProvider: $controllerProvider,
                $compileProvider: $compileProvider,
                $filterProvider: $filterProvider,
                $provide: $provide,
                $injector: $injector
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
                viewConfig.path = viewConfig.path.replace(/^\/|\/$/, '') || 'user/login.html';
                var moduleName = viewConfig.path.replace(/\//ig, '.').replace(/\.html$/, '');
                viewConfig.viewUrl = viewConfig.viewUrl || ('/' + viewConfig.path);
                viewConfig.templateUrl = viewConfig.templateUrl || ('pages/' + moduleName.replace(/\./ig, '/') + '.html');
                viewConfig.cssUrl = viewConfig.cssUrl || ( 'pages/' + moduleName.replace(/\./ig, '/') + '.css');
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
                            require(['css!' + viewConfig.cssUrl]);
                            require([viewConfig.requireJs], function (module) {
                                module(viewConfig.module, viewConfig.controller);
                                self.registerModule(viewConfig.module);
                                $timeout(function () {
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }]
                    }
                });
            };
            this.$get = function () {
                return {
                    views: self.views,
                    useModule: self.registerModule,
                    registerModule: self.registerModule,
                    useView: self.registerView,
                    registerView: self.registerView,
                    formValidateBuild: self.formValidateBuild,
                };
            };
        }
    ]).directive('form', function () {

        function getRandName(type) {
            return (type || 'default') + Math.ceil(Math.random() * 1000000000000);
        }

        return {
            restrict: 'E',
            compile: function (element, attr) {
                element.attr('novalidate', 'novalidate');
                var checkAttrs = ['$error-minlength', '$error-maxlength', '$error-required', '$invalid'];
                if (attr.auto) {
                    element.off('submit', submit).on('submit', submit);
                    function submit() {
                        alert(22);
                        return false;
                    }
                }
                for (var i in element[0].elements) {
                    var input = element[0].elements[i];
                    if (typeof input === 'object' && input.tagName && input.tagName.toLowerCase() !== 'button') {
                        if ($(input).next('.form-error-tips').size() < 1) {
                            // 提交按钮处理
                            var $submitbtn = $(element[0]).find('[type=submit]');
                            if (!$submitbtn.attr('data-ng-disabled') && !$submitbtn.attr('ng-disabled')) {
                                $submitbtn.attr("data-ng-disabled", attr.name + ".$invalid")
                            }
                            // 自动验证标签解析
                            !input.name && ($(input).attr('name', getRandName('input')));
                            var first = attr.name + '.' + input.name + '.';
                            var css = 'right:0;animation-duration:.2s;padding-right:20px;color:#a94442;position:absolute;font-size:12px;z-index:2;display:block;text-align:center;pointer-events:none';
                            for (var j in checkAttrs) {
                                var checkAttr = 'data-tips-' + checkAttrs[j];
                                if ($(input).attr(checkAttr)) {
                                    var data = {
                                        attr: [first + checkAttrs[j].replace(/-/g, '.')],
                                        title: $(input).attr(checkAttr)
                                    };
                                    if ($(input).attr('data-tips-$error-required') && checkAttr !== 'data-tips-$error-required') {
                                        data.attr.push('!' + first + '$error.required');
                                    }
                                    // 当表单修改后再显示提示
                                    data.attr.push(first + '$dirty');
                                    var tpl = '<span style="' + css + '" class="form-error-tips" data-ng-show="' + data.attr.join(' && ') + '">' + data.title + '</span>';
                                    $(input).after($(tpl).css({
                                        top: $(input).position().top + 'px',
                                        marginTop: $(input).css('marginTop'),
                                        paddingBottom: $(input).css('paddingBottom'),
                                        lineHeight: $(input).css('height'),
                                        paddingRight: (parseFloat($(input).css('marginRight')) + parseFloat($(input).css('paddingRight')) + 30) + 'px'
                                    }));
                                }
                            }
                        }
                    }
                }
            }
        }
    })
});
