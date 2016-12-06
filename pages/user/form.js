define(['require', 'angular', 'jquery', 'myView', 'myForm'], function (require, angular, $) {

    layui.use(['form', 'layedit', 'laydate', 'element'], function () {

    });

    /**
     * 定义模块函数
     * @param {string} module 默认模块名
     * @param {string} controller 默认模块控制器
     * @return {function}
     */
    return function (module, controller) {
        /*! 创建默认模块及默认控制器 */
        angular.module(module, ['myView']).controller(controller, [
            '$scope',
            '$location',
            function ($scope, $location) {
                $scope.app.layout.class.body = 'body';
            }
        ]);
    };
});
