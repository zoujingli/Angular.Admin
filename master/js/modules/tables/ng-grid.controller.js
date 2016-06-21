/**=========================================================
 * Module: ng-grid.js
 * ngGrid demo
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.tables')
        .controller('NGGridController', NGGridController);

    NGGridController.$inject = ['$scope', '$http', '$timeout'];
    function NGGridController($scope, $http, $timeout) {

        activate();

        ////////////////

        function activate() {

          $scope.filterOptions = {
              filterText: '',
              useExternalFilter: true
          };
          $scope.totalServerItems = 0;
          $scope.pagingOptions = {
              pageSizes:   [250, 500, 1000],  // page size options
              pageSize:    250,              // default page size
              currentPage: 1                 // initial page
          };

          $scope.gridOptions = {
              data:             'myData',
              enablePaging:     true,
              showFooter:       true,
              rowHeight:        36,
              headerRowHeight:  38,
              totalServerItems: 'totalServerItems',
              pagingOptions:    $scope.pagingOptions,
              filterOptions:    $scope.filterOptions
          };

          $scope.setPagingData = function(data, page, pageSize){
              // calc for pager
              var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
              // Store data from server
              $scope.myData = pagedData;
              // Update server side data length
              $scope.totalServerItems = data.length;

              if (!$scope.$$phase) {
                  $scope.$apply();
              }

          };

          $scope.getPagedDataAsync = function (pageSize, page, searchText) {
            var ngGridResourcePath = 'server/ng-grid-data.json';

            $timeout(function () {

                if (searchText) {
                    var ft = searchText.toLowerCase();
                    $http.get(ngGridResourcePath).success(function (largeLoad) {
                        var data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) !== -1;
                        });
                        $scope.setPagingData(data,page,pageSize);
                    });
                } else {
                    $http.get(ngGridResourcePath).success(function (largeLoad) {
                        $scope.setPagingData(largeLoad,page,pageSize);
                    });
                }
            }, 100);
          };


          $scope.$watch('pagingOptions', function (newVal, oldVal) {
              if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
              }
          }, true);
          $scope.$watch('filterOptions', function (newVal, oldVal) {
              if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
              }
          }, true);

          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    }
})();
