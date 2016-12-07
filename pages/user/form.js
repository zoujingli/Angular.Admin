define(['require', 'angular', 'jquery', 'myView', 'myForm'], function (require, angular, $) {

    /**
     * 定义模块函数
     * @param {string} module 默认模块名
     * @param {string} controller 默认模块控制器
     * @return {function}
     */
    return function (module, controller) {
        /*! 创建默认模块及默认控制器 */
        angular.module(module, ['myView', 'myForm']).controller(controller, ['$scope', '$location', '$view', function ($scope, $location, $view) {
                $scope.app.layout.class.body = 'body';
                $scope.form = {};
                $scope.form.username = '';
                $scope.form.title = '默认值-只能在 controller 中定义哦！';
                $scope.form.username = '';
                $scope.form.open = true;
            }
        ]);
    };
});
