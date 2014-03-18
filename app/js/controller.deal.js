'use strict';

/* Controllers */

angular.module('myApp.controller.deal', [])
   .controller('DealsCtrl', ['$scope', 'loginService', 'syncData',
    '$location', 'userDataService', 'dealDataService', 'geoGoogleService',
    function($scope, loginService, syncData, $location, userDataService,
      dealDataService, geoGoogleService) {

      dealDataService.getAll()
      .then(function(data) {
        $scope.deals = data;
      });

      $scope.deal = {
        title: '',
        description: ''
      };

      $scope.user = {
        id: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        radius: 5
      };

      $scope.refineByLocation = function() {
        var user = $scope.user;
        var address = user.address1 + '+' + user.address2 + '+,'
          + user.city + ',+' + user.state + ',+' + user.zip;
        address = address.replace(/\s/g, '+');
        console.log('address', address);
        //Call Google API and get the location
        geoGoogleService.fetchData(address)
        .then(function(data) {
          user.location = [];
          user.location.push(data.results[0].geometry.location.lat);
          user.location.push(data.results[0].geometry.location.lng);

          dealDataService.getActiveByUserLocation(user.location, user.radius)
          .then(function(deals) {
            $scope.deals = deals;
          });

        }, function() {
            console.log('Error getting lat/lng from Google API');
            d.reject();
        });
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

      // $scope.deleteDeal = function(dealId, merchantId) {
      //   dealDataService.delete(dealId, merchantId)
      //   .then(function() {
      //     console.log('Success delete deal');
      //     //Refetch the data
      //     dealDataService.getAll()
      //     .then(function(data) {
      //       $scope.deals = data;
      //     });
      //   }), function() {
      //     console.log('Error delete deal');
      //   };
      // };

   }])

   .controller('DealUpdateCtrl', ['$scope', 'loginService', 'syncData',
    '$location', 'userDataService', 'dealDataService', '$routeParams',
    function($scope, loginService, syncData, $location, userDataService, dealDataService, $routeParams) {

      dealDataService.getById($routeParams.dealId)
      .then(function(data) {
        console.log('Success get deal by id');
        //Define the possible statuses
        $scope.statuses = [{name: 'Inactive'}, {name: 'Active'}];

        $scope.dealId = $routeParams.dealId;
        $scope.deal = data[$routeParams.dealId];
        for (var i = 0; i < $scope.statuses.length; i++) {
          if($scope.statuses[i].name === $scope.deal.status.name) {
            $scope.deal.status = $scope.statuses[i];
          }
        };

      }, function() {
        console.log('Error get deal by id');
      });

      $scope.updateDeal = function(dealId, deal) {
        dealDataService.update(dealId, deal)
        .then(function() {
          console.log('Success update deal');
        }), function() {
          console.log('Error update deal');
        };
      };

      $scope.activate = function(dealId, deal) {
        dealDataService.geoInsertByLocWithId(dealId, deal)
        .then(function() {
          console.log('Activation done');
          $scope.deal.status = {name: 'Active'};
          $scope.updateDeal(dealId, $scope.deal);
        }, function() {
          console.log('Activation failed');
        });

      };

      $scope.deactivate = function(dealId, deal) {
        dealDataService.geoRemoveById(dealId)
        .then(function() {
          console.log('Deactivation done');
          $scope.deal.status = {name: 'Inactive'};
          $scope.updateDeal(dealId, $scope.deal);
        }, function() {
          console.log('Deactivation failed');
        });

      };

   }]);
