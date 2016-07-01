define(['angular'], function (angular) {
    return angular.module('app.table', []).run(function ($rootScope) {
        $rootScope.message = '表格';
    });
});