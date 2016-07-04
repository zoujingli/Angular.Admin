define(['angular', 'app', 'angular-cookies'], function (angular, app) {

    app.useModule('ngCookies');
    app.provider('appMenuSetProvider', function () {
        this.$get = function ($cookies, $rootScope) {
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
                },
                clearMenuStat: function (menus, level, type) {
                    (type = type || 'active'), (level = level || 0);
                    var self = this;
                    menus && angular.forEach(menus, function (menu) {
                        var key = 'menu-' + type + '-' + menu.node;
                        if (level >= 0) {
                            $cookies.put(key, menu[type] = false);
                        }
                        menu.sub && self.clearMenuStat(menu.sub, level + 1);
                    });
                },
                setMenuStat: function (menus, node, level) {
                    level = level || 0;
                    var self = this;
                    angular.forEach(menus, function (menu) {
                        if (menu.sub && (angular.toJson(menu.sub).indexOf('"node":"' + node + '"') !== -1 || menu.node === node)) {
                            menu.active = true;
                            menu.open = true;
                            if (level === 0) {
                                $rootScope.app.leftmenudata = menu.sub;
                            }
                            self.setMenuStat(menu.sub, node, level + 1);
                        }
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
            // 首次加载时初始化左侧菜单 
            var spm = $rootScope.$location.search().spm;
            spm && appMenuSetProvider.setMenuStat(ret, spm, 0);
            //显示顶部菜单
            $rootScope.app.menudata = ret;
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