define(['angular'], function (angular) {
    return angular.module('app.welcome', []).run(function ($rootScope) {
        $rootScope.message = '别着急嘛 ... ^_^ ... Angluar.Admin 正在工厂加班加点进行拼装...';
    });
});