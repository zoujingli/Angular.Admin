define(['app'], function (app) {
    app.controller('app.login', function ($rootScope) {
        $rootScope.app.layout.class.body = 'gray-bg full-height full-width login-container';
    });
});