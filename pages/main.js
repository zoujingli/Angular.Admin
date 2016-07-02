define(['app'], function (app) {
    app.controller('sss', function ($scope) {
        $scope.a = ';111';
        app.layout.loaded = true;
    });
});