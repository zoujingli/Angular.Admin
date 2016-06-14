define(["angular", 'jquery', 'jquerySupersized', 'angularRoute', 'angularCookies'], function (angular, $) {
    $('form .username, .page-container form .password').keyup(function () {
        $(this).parent().find('.error').fadeOut('fast');
    });
    $.supersized({
        // Functionality
        slide_interval: 4000, // Length between transitions
        transition: 1, // 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
        transition_speed: 1000, // Speed of transition
        performance: 1, // 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
        // Size & Position
        min_width: 0, // Min width allowed (in pixels)
        min_height: 0, // Min height allowed (in pixels)
        vertical_center: 1, // Vertically center background
        horizontal_center: 1, // Horizontally center background
        fit_always: 0, // Image will never exceed browser width or height (Ignores min. dimensions)
        fit_portrait: 1, // Portrait images will not exceed browser height
        fit_landscape: 0, // Landscape images will not exceed browser width
        // Components
        slide_links: 'blank', // Individual links for each slide (Options: false, 'num', 'name', 'blank')
        slides: [// Slideshow Images
            {image: 'module/login/img/backgrounds/1.jpg'},
            {image: 'module/login/img/backgrounds/2.jpg'},
            {image: 'module/login/img/backgrounds/3.jpg'}
        ]
    });
    return angular.module('Login', ['ngCookies', 'ngRoute']).controller('app', function ($scope, $cookies) {
        $scope.ptitle = '后台登录';
        $scope.username = $cookies.get('username') || '';
        $scope.password = $cookies.get('password') || '';
        if ($scope.username && $scope.password) {
            window.location.href = './index.html';
        }
        $scope.dologin = function () {
            if ($scope.username && $scope.password) {
                $cookies.put('username', $scope.username);
                $cookies.put('password', $scope.password);
                window.location.href = './index.html';
            }
            if (!$scope.username) {
                $('.page-container form').find('.error').fadeOut('fast', function () {
                    $(this).css('top', '27px');
                });
                $('.page-container form').find('.error').fadeIn('fast', function () {
                    $(this).parent().find('.username').focus();
                });
                return;
            }
            if (!$scope.password) {
                $('.page-container form').find('.error').fadeOut('fast', function () {
                    $(this).css('top', '96px');
                });
                $('.page-container form').find('.error').fadeIn('fast', function () {
                    $(this).parent().find('.password').focus();
                });
                return;
            }
        };

    }).config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'module/login/template/index.html',
            controller: 'app'
        }).otherwise({
            redirectTo: '/'
        });
    });
});