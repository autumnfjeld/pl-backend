'use strict';

angular.module('myApp.controller.transactions', ['myApp.service.transactiondata'])
   .controller('TransactionCtrl', ['$scope', '$rootScope', 'transactionService',
    function($scope, $rootScope, transactionService) {

      $scope.transaction = {
        dealId      : null,
        startTime   : null,
        amount      : 97,
        quantity    : 3
      };

      $scope.initTransaction = function(){
        //$getCurrentUser.then(function(data){console.log(data)});

        $scope.transaction.startTime = new Date();
        $scope.transaction.dealId = Math.random(100);
        console.log('initTransaction. :', $scope.transaction);

        transactionService.create($scope.transaction);

      };

   }]);
