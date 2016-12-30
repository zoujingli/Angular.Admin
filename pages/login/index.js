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
                $scope.hideEye = false;
                // 登录状态检查
                if (angular.$cookies.get('token')) {
                    $form.$dialog.tips('检测到登录信息，正在验证...');
                    $form.post('user/api/token/check.html', {}, function (ret) {
                        if (ret.code === 'SUCCESS') {
                            angular.$dialog.tips('自动登录成功');
                            window.location.href = 'admin.html';
                            return false;
                        }
                        angular.$dialog.tips(ret.info || '验证登录失败，请重新登录！');
                        return angular.$cookies.remove('token'), false;
                    });
                }
                // 表单默认值
                $scope.user = {username: 'admin', password: 'admin', sysname: 'system'};
                // 提交表单
                $scope.submit = function () {
                    var index = angular.$dialog.loading();
                    // 请求数据
                    $form.post('user/api/login.html', $scope.user, function (ret) {
                        angular.$dialog.close(index);
                        if (ret.code === 'SUCCESS' && ret.data.token) {
                            $form.$dialog.tips(ret.info, 2);
                            angular.$cookies.put('token', ret.data.token);
                            return window.location.href = 'admin.html';
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
