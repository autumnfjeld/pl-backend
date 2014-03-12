'use strict';

angular.module('myApp.controller.transactions', ['myApp.service.transactiondata'])
   .controller('TransactionCtrl', ['$scope', '$rootScope', 'transactionService',
    function($scope, $rootScope, transactionService) {

      $scope.userId = $rootScope.auth.user.provider + ":" + $rootScope.auth.user.id;

      transactionService.getByUserId($scope.userId).then(function(data){
        $scope.currUserTransactions = data;
        console.log('hmmm?', $scope.currUserTransactions);
      });


      $scope.transaction = {
        userId      : $scope.userId,
        merchantId  : '-JHhq88dothCQ3JYWMhM',
        dealId      : '-JHjIBnPzEL7FqEe1Apy',
        startTime   : null,
        amount      : Math.floor(Math.random()*100),
        quantity    : 1 + Math.floor(Math.random()*10)
      };

      $scope.createTransaction = function(){
        $scope.transaction.startTimestamp = new Date().getTime();
        $scope.transaction.user_behavior = {clicked : true};
        transactionService.create($scope.transaction);
      };

      $scope.claimTransaction = function(){

      };

      $scope.cancelTransaction = function(){

      };

      $scope.getCurrUserTransactions = function(){
        transactionService.getByUserId($scope.userId);

      };

      $scope.getAll = function(){
        transactionService.getAll($scope.userId).then(function(data){
          $scope.allTransactions = data;
          console.log('got All', $scope.allTransactions);
       });
      };

   }]);
