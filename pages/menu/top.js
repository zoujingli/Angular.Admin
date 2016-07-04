define(['angular', 'app', 'angular-cookies'], function (angular, app) {

    app.useModule('ngCookies');

    app.provider('appMenuSetProvider', function () {
        this.$get = function ($cookies) {
            return {
                _getMenuStat: function (menu, type) {
                    var key = 'menu-' + type + '-' + menu.node;
                    if ($cookies.get(key) === 'true') {
                        return true;
                    } else if ($cookies.get(key) === 'false') {
                        return false;
                    } else {
                        return menu[type] || false;
                    }
                },
                initMenuStat: function (menus) {
                    var self = this, isSetActive = false;
                    menus && angular.forEach(menus, function (menu) {
                        //处理 active 属性
                        menu.active = self._getMenuStat(menu, 'active');
                        isSetActive && (menu.active = false);
                        menu.active && (isSetActive = true);
                        $cookies.put('menu-active-' + menu.node, menu.active);
                        // 处理 open 属性
                        menu.open = self._getMenuStat(menu, 'open');
                        $cookies.put('menu-open-' + menu.node, menu.open);
                        // 处理子菜单
                        menu.sub && self.initMenuStat(menu.sub);
                    });
                }
            };
        };
    });

    app.controller('app.menu.top', function ($rootScope, $scope, $http, $cookies, appMenuSetProvider) {

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
            appMenuSetProvider.initMenuStat(ret);
            //显示顶部菜单
            $rootScope.app.menudata = ret;
            // 首次加载时初始化左侧菜单 
            var spm = $rootScope.$location.search().spm;
            spm && angular.forEach($rootScope.app.menudata, function (menu) {
                if (menu.sub && angular.toJson(menu).indexOf('"node":"' + spm + '"') !== -1) {
                    // 顶部菜单选中
                    menu.active = true;
                    // 显示左侧菜单
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
                $rootScope.app.leftmenudata = menu.sub;
            } else {
                $rootScope.$location.spm = menu.node;
                $rootScope.app.leftmenudata = false;
            }
        };
    });

});