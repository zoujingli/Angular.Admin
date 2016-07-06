define(['app.admin'], function (app) {
    app.controller('app.table', function ($scope, $http) {
        $scope.message = '表格';
        $http.get('server/table-data.json').success(function (ret) {
            console.log(ret);
            $scope.data = ret;
        })
    });

});