define(['app', 'angular-cookies'], function (app) {

    app.useModule('ngCookies');

    app.controller('app.menu', function ($rootScope, $scope, $cookies) {

        var spm = $rootScope.$location.search().spm;

        $rootScope.toggleLeftNav = function () {
            console.log('toggleLeftNav');
            var menuClass = $rootScope.app.layout.class.main;
            if (menuClass.indexOf(' framework-sidebar-full') !== -1) {
                $rootScope.app.layout.class.main = menuClass.replace(' framework-sidebar-full', ' framework-sidebar-mini');
            } else {
                $rootScope.app.layout.class.main = menuClass.replace(' framework-sidebar-mini', ' framework-sidebar-full');
            }
        };
        $scope.toggleLeftItemNav = function (menu) {
            console.log('toggleLeftItemNav : ' + menu.name);
            $cookies.put('menu-open-' + menu.node, menu.open = !menu.open);
        };
        $scope.openMenuUri = function (menu) {

        };
    });

});