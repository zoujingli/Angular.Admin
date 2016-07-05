/* global require */

/**
 * 配置require文件位置
 * @param {type} param
 */
require.config({
    baseUrl: './',
    paths: {
        'spin': 'node_modules/spin/dist/spin.min',
        'app': 'script/application',
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
    deps: ['angular', 'app'],
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

/**
 * 载入并启动 Angluar 模块
 * @param {type} angular
 * @returns {undefined}
 */
require(['app', 'angular-ui-bootstrap'], function (app) {
    app.bootstrap();
});

