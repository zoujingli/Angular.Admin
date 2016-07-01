define(['app'], function (app) {
    app.$controllerProvider.register('OtherCtrl', function ($scope) {
        $scope.message = "别着急嘛 ... ^_^ ... Angluar.Admin 正在工厂加班加点进行拼装...";
    });
});