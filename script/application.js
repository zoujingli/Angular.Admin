define(['require', 'angular', 'angular-ui-router', 'angular-ui-bootstrap', 'angular-cookies', 'spin'], function (require, angular) {

    new Spinner({
        lines: 17 // The number of lines to draw
        , length: 0 // The length of each line
        , width: 11 // The line thickness
        , radius: 41 // The radius of the inner circle
        , scale: 1.75 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#000' // #rgb or #rrggbb or array of colors
        , opacity: 0.05 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'display-inline-block' // The CSS class to assign to the spinner
        , top: '50%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: true // Whether to render a shadow
        , hwaccel: true // Whether to use hardware acceleration
        , position: 'fixed' // Element positioning
    }).spin(document.getElementById('preloader'));

    /**
     * 定义模块
     * @type @exp;angular@call;module
     */
    var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngCookies']);

    /**
     * 初始化运行方法
     */
    app.run(function ($http, $cookies) {
        // 检查用户登录
        var user = $cookies.getObject('user');
        // 进入用户登录界面
        if (!(user && user.username && user.password)) {
            require(['app.login'], function (module) {
                module.bootstrap();
            });
        }
        // 进入后台管理界面
        else {
            require(['app.admin'], function (module) {
                $http.get('script/module/app.admin.layout.html').success(function (ret) {
                    document.body.innerHTML = ret;
                    module.bootstrap();
                });
            });
        }
    });

    /**
     * APP启动入口
     * @returns {undefined}
     */
    app.bootstrap = function () {
        angular.bootstrap(document.body, [app.name]);
        angular.element(document.body).addClass('ng-app');


    };

    /**
     * 返回模块对象
     */
    return app;
});