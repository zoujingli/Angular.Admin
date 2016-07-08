define(['angular'], function (angular) {
    function _extends(app) {

        this.version = '1.0';

        app.provider('appRouter', appRouter);

        function appRouter() {
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
        }

        app.provider('appExtends', appExtends);
        appExtends.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$injector'];

        function appExtends($controllerProvider, $compileProvider, $filterProvider, $provide, $injector) {
            this.$get = function () {
                return {
                    apply: apply
                };
            };
            var ngProviders = {
                $controllerProvider: $controllerProvider,
                $compileProvider: $compileProvider,
                $filterProvider: $filterProvider,
                $provide: $provide,
                $injector: $injector
            };
            function apply($injector) {
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
            }

        }
    }
    return _extends;
});