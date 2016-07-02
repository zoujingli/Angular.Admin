define(['angular', 'app', 'angular-cookies'], function (angular, app) {

    app.useModule('ngCookies');

    app.controller('app.menu.top', function ($rootScope, $scope, $http, $cookies) {
        // 加载应用数据
        $http.get('server/app.json').success(function (ret) {
            $rootScope.appInfo = ret;
        });
        // 加载用户数据
        $http.get('server/user.json').success(function (ret) {
            $rootScope.userInfo = ret;
        });
        // 加载菜单信息
        $rootScope.app.leftmenudata = false;

        $http.get('server/menu.json').success(function (ret) {
            $rootScope.app.layout.loaded = true;
            setMenuStat($rootScope.app.menudata = ret);
        });

        $scope.setLeftMenu = function (menu) {
            angular.forEach($rootScope.app.menudata, function (menu) {
                menu.active = false;
                $cookies.put('menu-active-' + menu.node, false);
            });
            menu.active = true;
            $cookies.put('menu-active-' + menu.node, true);
            if (menu.sub) {
                setMenuStat($rootScope.app.leftmenudata = menu.sub);
            } else {
                $rootScope.$location.spm = menu.node;
                $rootScope.app.leftmenudata = false;
            }
        };



        /**
         * 处理菜单状态
         * @param {type} menus
         * @returns {undefined}
         */
        function setMenuStat(menus) {
            menus && angular.forEach(menus, function (menu) {
                var statType = ['active', 'open'];
                for (var i in statType) {
                    var type = statType[i];
                    switch ($cookies.get('menu-' + type + '-' + menu.node)) {
                        case 'true':
                            menu[type] = true;
                            break;
                        case 'false':
                            menu[type] = false;
                            break;
                    }
                }
                menu.sub && setMenuStat(menu.sub);
            });
        }
    });

});