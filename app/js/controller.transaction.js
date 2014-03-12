'use strict';

angular.module('myApp.controller.transactions', ['myApp.service.transactiondata'])
   .controller('TransactionCtrl', ['$scope', '$rootScope', 'transactionService',
    function($scope, $rootScope, transactionService) {

      $scope.userId = $rootScope.auth.user.provider + ":" + $rootScope.auth.user.id;

      transactionService.getByUserId($scope.userId).then(function(data){
        $scope.currUserTransactions = data;
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
        $scope.transaction.userBehavior   = {clicked : true};
        $scope.transaction.status         = 'clicked';
        transactionService.create($scope.transaction);
      };

      $scope.update = function(){
        //when a deal is claimed status, payment is updated
        var id = '-JHnFLQFH79uPVRgOxvI';
        //get
        transactionService.getByTransactionId(id)
          .then(function(data){
            $scope.getTrans = data[id];
            console.log('fresh $scope.getTrans', $scope.getTrans);
            console.log('userBehavior', $scope.getTrans.userBehavior);
            //update obj props
            $scope.getTrans.status      = 'claimed';    //could connect to button or toggle
            $scope.getTrans.payment     = 'cash'  ;     //link to payment button
            $scope.getTrans.userBehavior['claimed'] = true;
            console.log('after  $scope.getTrans', $scope.getTrans);
            //send back updated object
            transactionService.update(id, $scope.getTrans);
          });
        

      };

      $scope.delete = function(){
        //not finished in service
        
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
