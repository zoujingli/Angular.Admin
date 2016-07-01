define(['angular'], function (angular) {
    return angular.module('app.welcome', []).run(function ($rootScope) {
        $rootScope.message = '3423432';
    });
//     aa.run(['$rootScope', function ($rootScope) {
//            $rootScope.message = '222';
//        }]);
});