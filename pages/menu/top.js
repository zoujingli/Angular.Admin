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
                            $cookies.put('menu-active-' + menu.active, menu.active = true);
                            $cookies.put('menu-open-' + menu.open, menu.open = true);
                            if (level === 0) {
                                $rootScope.app.layout.menuleft = menu.sub;
                            }
                            self.setMenuStat(menu.sub, node, level + 1);
                        }
                    });
                },
                toggleLeftMenuType: function (menus) {
                    $rootScope.app.layout.full ? angular.forEach(menus, function (menu) {
                        menu.open = ($cookies.get('menu-open-' + menu.node) === "true");
                    }) : angular.forEach(menus, function (menu) {
                        menu.open = true;
                    });
                }
            };
        };
    });

    app.controller('app.menu.top', function ($rootScope, $scope, $http, $cookies, appMenuSetProvider) {

        // 加载应用数据
        $rootScope.app.info || $http.get('server/app.json').success(function (ret) {
            $rootScope.app.info = ret;
        });

        // 加载用户数据
        $rootScope.userInfo || $http.get('server/user.json').success(function (ret) {
            $rootScope.userInfo = ret;
        });

        // 加载菜单信息
        $rootScope.app.layout.menudata || $http.get('server/menu.json').success(function (ret) {
            //显示UI布局
            $rootScope.app.layout.loaded = true;
            //应用个性化属性
            appMenuSetProvider.initMenuStat(ret);
            // 首次加载时初始化左侧菜单 
            var spm = $rootScope.$location.search().spm;
            spm && appMenuSetProvider.setMenuStat(ret, spm, 0);
            //显示顶部菜单
            $rootScope.app.layout.menudata = ret;
        });

        // 设置左侧菜单是否显示
        $rootScope.app.layout.menuleft = $rootScope.app.layout.menuleft || false;

        // 点击顶部菜单时
        $scope.setLeftMenu = function (menu) {
            console.log('setLeftMenu : ' + menu.name);
            // 清除顶部菜单状态
            angular.forEach($rootScope.app.layout.menudata, function (menu) {
                $cookies.put('menu-active-' + menu.node, menu.active = false);
            });
            // 设置当前菜单状态
            $cookies.put('menu-active-' + menu.node, menu.active = true);
            if (menu.sub) {
                // 强制打开第一个二级或三级菜单
                var firstUriMenu = _getFirstUriMenu(menu.sub);
                if (firstUriMenu) {
                    $rootScope.app.layout.menuleft = menu.sub;
                    $rootScope.$location.spm = firstUriMenu.node;
                    return $rootScope.$location.path(firstUriMenu.uri);
                }
            }
            $rootScope.$location.spm = menu.node;
            $rootScope.app.layout.menuleft = false;
        };

        function _getFirstUriMenu(menus) {
            for (var i in menus) {
                var menu = menus[i];
                if (menu.sub) {
                    return _getFirstUriMenu(menu.sub);
                } else if (menu.uri) {
                    return menu;
                } else {
                    return false;
                }
            }
        }

        // 初始左侧菜单的模式
        $rootScope.app.layout.full = $cookies.get('layout-nav-full') === 'true' || false;
        // 切换左侧菜单模式
        $rootScope.toggleLeftMenuType = function (menus) {
            $cookies.put('layout-nav-full', $rootScope.app.layout.full = !$rootScope.app.layout.full);
            appMenuSetProvider.toggleLeftMenuType(menus);
        };
        // 切换侧子菜单
        $rootScope.toggleLeftItemMenuType = function (menu) {
            $rootScope.app.layout.full && $cookies.put('menu-open-' + menu.node, menu.open = !menu.open);
        };
    });
});