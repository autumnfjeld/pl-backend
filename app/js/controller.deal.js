'use strict';

/* Controllers */

angular.module('myApp.controller.deal', [])


   .controller('DealsCtrl', ['$scope', 'loginService', 'syncData',
    '$location', 'userDataService', 'dealDataService',
    function($scope, loginService, syncData, $location, userDataService, dealDataService) {

      dealDataService.getAll()
      .then(function(data) {
        $scope.deals = data;
      });

      $scope.deal = {
        title: '',
        description: ''
      };

      // $scope.submitDeal = function() {
      //   dealDataService.create($scope.deal)
      //   .then(function() {
      //     console.log('Success create deal');

      //     //Reset the scope deal object
      //     $scope.deal = {
      //       title: '',
      //       description: ''
      //     };

      //     //Refetch the data
      //     dealDataService.getAll()
      //     .then(function(data) {
      //       $scope.deals = data;
      //     });

      //   }, function() {
      //     console.log('Error create deal');
      //   });

      // };

      $scope.deleteDeal = function(dealId, merchantId) {
        dealDataService.delete(dealId, merchantId)
        .then(function() {
          console.log('Success delete deal');
          //Refetch the data
          dealDataService.getAll()
          .then(function(data) {
            $scope.deals = data;
          });
        }), function() {
          console.log('Error delete deal');
        };
      };

   }])

   .controller('DealUpdateCtrl', ['$scope', 'loginService', 'syncData',
    '$location', 'userDataService', 'dealDataService', '$routeParams',
    function($scope, loginService, syncData, $location, userDataService, dealDataService, $routeParams) {

      dealDataService.getById($routeParams.dealId)
      .then(function(data) {
        console.log('Success get deal by id');
        $scope.deal = data;
        $scope.dealId = $routeParams.dealId;
      }, function() {
        console.log('Error get deal by id');
      });

      $scope.updateDeal = function() {
        dealDataService.update($scope.dealId, $scope.deal)
        .then(function() {
          console.log('Success update deal');
          $location.path('/deals');
        }), function() {
          console.log('Error update deal');
        };
      };

   }]);
