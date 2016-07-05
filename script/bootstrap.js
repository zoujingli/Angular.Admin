/* global require */

/**
 * 配置require文件位置
 * @param {type} param
 */
require.config({
    baseUrl: './',
    paths: {
        'spin': 'node_modules/spin/dist/spin.min',
//        'app': 'script/application',
        'app.login': 'script/module/app.login',
        'app.admin': 'script/module/app.admin',
        'ng-tags-input': ['node_modules/ng-tags-input/build/ng-tags-input.min'],
        'angular': ['node_modules/angular/angular.min'],
        'angular-cookies': ["node_modules/angular-cookies/angular-cookies.min"],
        'angular-ui-router': ['node_modules/angular-ui-router/release/angular-ui-router.min'],
        'angular-ui-bootstrap': ['node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls'],
    },
    shim: {
        'angular': {exports: 'angular'},
        'ng-tags-input': {deps: ['angular']},
        'angular-cookies': {deps: ['angular']},
        'angular-ui-router': {deps: ['angular']},
        'angular-ui-bootstrap': {deps: ['angular']},
    },
    deps: ['angular', 'angular-ui-bootstrap'],
    urlArgs: "v=" + (new Date()).getTime()
});

/**
 * 加载进度显示
 * @returns {undefined}
 */
require(['spin'], function () {
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
        , position: 'absolute' // Element positioning
    }).spin(document.getElementById('preloader'));
});


require(['require', 'angular', 'angular-ui-router', 'angular-ui-bootstrap', 'angular-cookies'], function (require, angular) {

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

    app.bootstrap();

});

