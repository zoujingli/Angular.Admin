/* global require */
var script = document.scripts[document.scripts.length - 1].src, baseUrl = script.substring(0, script.lastIndexOf("/"));
/**
 * 应用启动文件
 *
 * @author Anyon <zoujingli@qq.com>
 * @date 2016/11/04 16:10
 */
require.config({
    waitSeconds: 0,
    baseUrl: './',
    map: {'*': {'css': '//cdn.bootcss.com/require-css/0.1.8/css.min.js'}},
    paths: {
        'app.config': ['script/config'],
        'myView': ['script/provider/my-view'],
        'myForm': ['script/provider/my-form'],
        'myDebug': ['script/provider/my-debug'],
        'myDialog': ['script/provider/my-dialog'],
        'layui': ['script/plugs/layui/layui'],
        'pace': ['//cdn.bootcss.com/pace/1.0.2/pace.min'],
        'jquery': ['//cdn.bootcss.com/jquery/1.12.4/jquery.min'],
        'angular': ['//cdn.bootcss.com/angular.js/1.5.8/angular.min'],
        'sweetalert': ['//cdn.bootcss.com/sweetalert/1.1.3/sweetalert.min'],
        'ngCookies': ['//cdn.bootcss.com/angular.js/1.5.7/angular-cookies.min'],
        'ngSanitize': ['//cdn.bootcss.com/angular-sanitize/1.5.8/angular-sanitize.min'],
        'ngRoute': ['//cdn.bootcss.com/angular.js/1.5.8/angular-route.min'],
        'ui.bootstrap': ['//cdn.bootcss.com/angular-ui-bootstrap/1.3.3/ui-bootstrap-tpls.min']
    },
    shim: {
        'angular': {exports: 'angular'},
        'pace': {deps: ['css!//cdn.bootcss.com/pace/1.0.2/themes/green/pace-theme-flash.min.css']},
        'sweetalert': {deps: ['css!//cdn.bootcss.com/sweetalert/1.1.3/sweetalert.min.css']},
        'ui.bootstrap': {deps: ['angular', 'css!//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css']},
        'layui': {deps: ['css!script/plugs/layui/css/layui.css', 'jquery']},
        'myDebug': {deps: ['jquery']},
        'myView': {deps: ['angular']},
        'myForm': {deps: ['angular', 'myDialog', 'jquery']},
        'myDialog': {deps: ['angular', 'sweetalert']},
        'ngRoute': {deps: ['angular']},
        'ngCookies': {deps: ['angular']},
        'ngSanitize': {deps: ['angular']},
    },
    deps: ['angular', 'css!theme/css/animate.css', 'css!theme/css/common.css'],
    urlArgs: "v=" + (new Date()).getTime()
});

/**
 * 加载进度显示
 * @returns {undefined}
 */
require(['pace'], function (pace) {
    pace.start({document: false});
});

/**
 * 应用启动器
 * @param {type} angular
 * @returns {undefined}
 */
require(['angular', 'ngRoute', 'myView', 'ui.bootstrap'], function (angular) {
    // 创建APP应用
    var app = angular.module('app', ['ngRoute', 'myView', 'ui.bootstrap']);
    // 应用启动配置
    app.config(['$routeProvider', '$viewProvider', function ($routeProvider, $viewProvider) {
        $viewProvider.registerView('/user/login.html');
        $routeProvider.otherwise('/user/login.html');
    }]);
    // 应用初始化动作
    app.run(['$location', '$view', '$rootScope', function ($location, $view, $rootScope) {
        // 页面全局属性定义
        $rootScope.app = {
            layout: {
                class: {body: 'login'}
            },
            site: {
                title: 'Angular.Admin',
                icon: 'http://static.cdn.cuci.cc/2016/0421/3586e898350c0890cf41a4828175d468.ico',
                copyright: '©版权所有 2016 楚才科技 | 粤ICP备14082924号'
            }
        };
        // 页面跳转前的处理
        $rootScope.$on("$locationChangeStart", function () {
            if ($location.$$path.length > 0) {
                $view.registerView($location.$$path);
            }
        });
    }]);
    // 启动应用
    // require(['layui'], function () {
    //     layui.config({dir: baseUrl + '/plugs/layui/'});
    //     angular.bootstrap(document, [app.name]);
    // });
    angular.bootstrap(document, [app.name]);
});