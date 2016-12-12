define(['angular', 'myView', 'myForm'], function (angular) {


    /**
     * 定义模块函数
     * @param {string} module 默认模块名
     * @param {string} controller 默认模块控制器
     * @return {function}
     */
    return function (module, controller) {
        /*! 创建默认模块及默认控制器 */
        angular.module(module, ['myView', 'myForm']).controller(controller, ['$scope', '$form', '$view', function ($scope, $form, $view) {

                $scope.app.layout.class.body = 'login';
                $scope.hideEye = false;

                if (angular.$cookies.get('token')) {
                    $form.post('user/api/check.html', {}, function (ret) {
                        console.log(ret);
                    });
                    $form.$dialog.tips('已经登录过了！');
//                    return $view.goto('user/index.html'), false;
                }
                // 表单默认值
                $scope.user = {username: 'admin', password: 'admin'};
                // 提交表单
                $scope.submit = function () {
                    var index = angular.$dialog.loading();
                    // 请求数据
                    $form.post('user/api/login.html', $scope.user, function (ret) {
                        angular.$dialog.close(index);
                        if (ret.code === 'SUCCESS' && ret.data.token) {
                            $form.$dialog.tips(ret.info, 2);
                            angular.$cookies.put('token', ret.data.token);
                            return $view.goto('user/index.html'), false;
                        }
                        $form.$dialog.tips(ret.info);
                        return false;
                    });
                    return false;
                };
            }
        ]);
    };
});
