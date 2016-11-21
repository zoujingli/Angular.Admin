define(['angular', 'jquery', 'supersized', 'myView', 'myForm'], function (angular, $) {
    $.supersized({
        // Functionality
        slide_interval: 6000,    // Length between transitions
        transition: 1,    // 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
        transition_speed: 3000,    // Speed of transition
        performance: 1,    // 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
        // Size & Position
        min_width: 0,    // Min width allowed (in pixels)
        min_height: 0,    // Min height allowed (in pixels)
        vertical_center: 1,    // Vertically center background
        horizontal_center: 1,    // Horizontally center background
        fit_always: 0,    // Image will never exceed browser width or height (Ignores min. dimensions)
        fit_portrait: 1,    // Portrait images will not exceed browser height
        fit_landscape: 0,    // Landscape images will not exceed browser width
        // Components
        slide_links: 'blank',    // Individual links for each slide (Options: false, 'num', 'name', 'blank')
        slides: [    // Slideshow Images
            {image: 'http://www.jq22.com/demo/jquery-login-20150514/img/3.jpg'},
            {image: 'http://www.jq22.com/demo/jquery-login-20150514/img/2.jpg'},
            {image: 'http://www.jq22.com/demo/jquery-login-20150514/img/1.jpg'}
        ]
    });
    /**
     * 定义模块函数
     * @param {type} moduleName 默认模块名
     * @param {type} controllerName 默认模块控制器
     * @returns {undefined}
     */
    return function (moduleName, controllerName) {
        /*! 创建默认模块及默认控制器 */
        angular.module(moduleName, ['myView', 'myForm']).controller(controllerName, ['$scope', '$location', '$view',
            function ($scope, $location, $view) {
                $scope.$on("$destroy", function () {

                });
            }
        ]);
    };
});
