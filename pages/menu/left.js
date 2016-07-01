define(['angular'], function (angular) {
    return angular.module('app.menu.left', ['ui.bootstrap']).run(function ($rootScope, $http) {
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