define(['app', 'angular-cookies'], function (app) {

    app.useModule('ngCookies');

    app.controller('app.menu', function ($rootScope, $scope, $cookies) {

        // 初始左侧菜单的模式
        var layoutMainClass = $cookies.get('layout-main-class');
        layoutMainClass && ($rootScope.app.layout.class.main = layoutMainClass);
        // 切换左侧菜单的模式
        $rootScope.toggleLeftNav = function () {
            console.log('toggleLeftNav');
            var menuClass = $rootScope.app.layout.class.main;
            if (menuClass.indexOf(' framework-sidebar-full') !== -1) {
                $rootScope.app.layout.class.main = menuClass.replace(' framework-sidebar-full', ' framework-sidebar-mini');
            } else {
                $rootScope.app.layout.class.main = menuClass.replace(' framework-sidebar-mini', ' framework-sidebar-full');
            }
            $cookies.put('layout-main-class', $rootScope.app.layout.class.main);
        };
        $scope.toggleLeftItemNav = function (menu) {
            console.log('toggleLeftItemNav : ' + menu.name);
            $cookies.put('menu-open-' + menu.node, menu.open = !menu.open);
        };
        $scope.openMenu = function (menu) {
            console.log('openMenu : ' + menu.name);
            $rootScope.$location.spm = menu.node;
        };
    });

});