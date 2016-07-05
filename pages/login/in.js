define(['app', 'angular-cookies'], function (app) {

    app.useModule('ngCookies');

    app.controller('app.login', function ($rootScope, $scope, $cookies, $http) {
        // 显示界面
        $rootScope.app.layout.class.top = 'gray-bg full-height full-width login-container';
        // 加载应用数据
        $rootScope.app.info || $http.get('server/app.json').success(function (ret) {
            $rootScope.app.info = ret;
        });
        //表单处理
        var user = {username: '', password: ''}
        $scope.user = user;
        //登录，记录数据到cookie
        $scope.submit = function () {
            $cookies.putObject('user', user);
            $rootScope.$location.path('welcome/hello');
            window.location.reload();
        };
    });
});