define(['app', 'angular', 'angular-cookies'], function (app, angular) {

    app.useModule('ngCookies');

    app.controller('app.menu.left', function ($rootScope, $scope, $cookies, appMenuSetProvider) {
        $scope.openMenu = function (menu) {
            console.log('openMenu : ' + menu.name);
            //去除所有菜单的选择
            appMenuSetProvider.clearMenuStat($rootScope.app.layout.menudata, 0, 'active');
            //记录当前点击菜单的选择
            $cookies.put('menu-active-' + menu.node, menu.active = true);
            $rootScope.$location.spm = menu.node;
        };
    });

});