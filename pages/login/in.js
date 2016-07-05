define(['app'], function (app) {
    app.controller('app.login', function ($rootScope, $http) {
        $rootScope.app.layout.class.top = 'gray-bg full-height full-width login-container';
        // 加载应用数据
        $rootScope.app.info || $http.get('server/app.json').success(function (ret) {
            $rootScope.app.info = ret;
        });
    });
});