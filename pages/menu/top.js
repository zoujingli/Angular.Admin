define(['angular'], function (angular) {
    return angular.module('app.menu.top', ['ui.bootstrap']).run(function ($rootScope, $http) {
        $rootScope.reload = function () {
            window.location.reload();
        };
        $http.get('server/app.json').success(function (ret) {
            $rootScope.appInfo = ret;
        });
        $http.get('server/user.json').success(function (ret) {
            $rootScope.userInfo = ret;
        });
        $http.get('server/menu.json').success(function (ret) {
            $rootScope.menuTopInfo = ret;
        });
    });
});