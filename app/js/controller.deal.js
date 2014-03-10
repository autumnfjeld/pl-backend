'use strict';

/* Controllers */

angular.module('myApp.controller.deal', [])


   .controller('DealsCtrl', ['$scope', 'loginService', 'syncData',
    '$location', 'userDataService', 'dealDataService',
    function($scope, loginService, syncData, $location, userDataService, dealDataService) {

      dealDataService.getDeals()
      .then(function(data) {
        $scope.deals = data;
      });

      $scope.deal = {
        title: '',
        description: ''
      };

      $scope.submitDeal = function() {
        dealDataService.createDeal($scope.deal)
        .then(function() {
          console.log('Success create');

          //Reset the scope deal object
          $scope.deal = {
            title: '',
            description: ''
          };

          //Refetch the data
          dealDataService.getDeals()
          .then(function(data) {
            $scope.deals = data;
          });

        }, function() {
          console.log('Error create');
        });

      };

      $scope.deleteDeal = function(dealId) {
        dealDataService.deleteDeal(dealId)
        .then(function() {
          console.log('Success delete');
          //Refetch the data
          dealDataService.getDeals()
          .then(function(data) {
            $scope.deals = data;
          });
        }), function() {
          console.log('Error delete');
        };
      };

   }])

   .controller('DealUpdateCtrl', ['$scope', 'loginService', 'syncData',
    '$location', 'userDataService', 'dealDataService', '$routeParams',
    function($scope, loginService, syncData, $location, userDataService, dealDataService, $routeParams) {

      dealDataService.findDeal($routeParams.dealId)
      .then(function(data) {
        console.log('Success find deal');
        console.log('data', data);
        console.log('$routeParams.dealId', $routeParams.dealId);
        $scope.deal = data;
        $scope.dealId = $routeParams.dealId;
      }, function() {
        console.log('Error find deal');
      });

      $scope.updateDeal = function() {
        dealDataService.updateDeal($scope.dealId, $scope.deal)
        .then(function() {
          console.log('Success update');
          $location.path('/deals');
        }), function() {
          console.log('Error update');
        };
      };

      $scope.cancelDeal = function() {
        console.log('called');
        $location.path('/deals');
      };


   }]);
