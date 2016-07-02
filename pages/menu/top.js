define(['angular', 'app', 'angular-cookies'], function (angular, app) {

    app.useModule('ngCookies');

    app.controller('app.menu.top', function ($rootScope, $scope, $http, $cookies) {

        // 加载应用数据
        $rootScope.appInfo || $http.get('server/app.json').success(function (ret) {
            $rootScope.appInfo = ret;
        });

        // 加载用户数据
        $rootScope.userInfo || $http.get('server/user.json').success(function (ret) {
            $rootScope.userInfo = ret;
        });

        // 加载菜单信息
        $rootScope.app.menudata || $http.get('server/menu.json').success(function (ret) {
            //显示UI布局
            $rootScope.app.layout.loaded = true;
            //应用个性化属性
            setMenuStat(ret);
            //显示顶部菜单
            $rootScope.app.menudata = ret;
            // 首次加载时初始化左侧菜单 
            var spm = $rootScope.$location.search().spm;
            spm && angular.forEach($rootScope.app.menudata, function (menu) {
                if (menu.sub && angular.toJson(menu).indexOf('"node":"' + spm + '"') !== -1) {
                    return $rootScope.app.leftmenudata = menu.sub;
                }
            });
        });

        // 设置左侧菜单
        $rootScope.app.leftmenudata = $rootScope.app.leftmenudata || false;
        $scope.setLeftMenu = function (menu) {
            console.log('setLeftMenu : ' + menu.name);
            angular.forEach($rootScope.app.menudata, function (menu) {
                menu.active = false;
                $cookies.put('menu-active-' + menu.node, false);
            });
            menu.active = true;
            $cookies.put('menu-active-' + menu.node, true);
            if (menu.sub) {
                $rootScope.app.leftmenudata = menu.sub
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