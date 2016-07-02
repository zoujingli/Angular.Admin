define(['app'], function (app) {

    app.controller('app.menu.top', function ($rootScope, $http) {
        // 页面刷新
        $rootScope.reload = function () {
            app.$state.reload();
        };
        // 加载应用数据
        $http.get('server/app.json').success(function (ret) {
            $rootScope.appInfo = ret;
        });
        // 加载用户数据
        $http.get('server/user.json').success(function (ret) {
            $rootScope.userInfo = ret;
        });
        // 加载菜单信息
        $http.get('server/menu.json').success(function (ret) {
            $rootScope.menuTopInfo = ret;
        });
    });

});