'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
   .controller('HomeCtrl', ['$scope', 'syncData',
    function($scope, syncData) {
      syncData('syncedValueToFirebase').$bind($scope, 'syncedValue');

   }])

  // .controller('ChatCtrl', ['$scope', 'syncData', function($scope, syncData) {
  //     $scope.newMessage = null;

  //     // constrain number of messages by limit into syncData
  //     // add the array into $scope.messages
  //     $scope.messages = syncData('messages', 10);

  //     // add new messages to the list
  //     $scope.addMessage = function() {
  //        if( $scope.newMessage ) {So 
  //           $scope.messages.$add({text: $scope.newMessage});
  //           $scope.newMessage = null;
  //        }
  //     };
  //  }])

   .controller('LoginCtrl', ['$scope', 'loginService', '$location', 'userDataService',
      function($scope, loginService, $location, userDataService) {
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.login = function(cb) {
         $scope.err = null;
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else {
            loginService.login($scope.email, $scope.pass, function(err, user) {
               $scope.err = err? err + '' : null;
               if( !err ) {
                  cb && cb(user);
               }
            });
         }
      };

      $scope.fblogin = function() {
        loginService.fblogin();
      }

      $scope.createAccount = function() {
         $scope.err = null;

         if( assertValidLoginAttempt() ) {
            loginService.createAccount($scope.email, $scope.pass, function(err, user) {
               if( err ) {
                  $scope.err = err ? err + '' : null;
               }
               else {
                  // must be logged in before profile is written to
                  $scope.login(function() {
                     $location.path('/account');
                  });
               }
            });
         }
      };

      function assertValidLoginAttempt() {
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.pass !== $scope.confirm ) {
            $scope.err = 'Passwords do not match';
         }
         return !$scope.err;
      }
   }])

   .controller('AccountCtrl', ['$scope', 'loginService', 'syncData', '$location', 'userDataService',
    function($scope, loginService, syncData, $location, userDataService) {

      //syncData(['users', $scope.auth.user.uid]).$bind($scope, 'user');

      //get firebase data to populate fields
      
      //$scope.user = $rootScope.auth;
      
      $scope.logout = function() {
        console.log()
         loginService.logout();
      };

      $scope.getList = function(){
        userDataService.getList(['-JHUNvVCQkH7w99_Et8W', '12345'])
          .then(function(data){
            console.log('got list', data);
          });
      };

      $scope.getOne = function(){
        // console.log(userDataService.get('-JHUNvVCQkH7w99_Et8W'));
        userDataService.get('-JHUNvVCQkH7w99_Et8W')
          .then(function(data){
            console.log('got one user', data);
          });
      };

      $scope.updateStuff = function() {
         $scope.reset();
         // update user object
         loginService.update(id, userObj);
      };

      $scope.oldpass = null;
      $scope.newpass = null;
      $scope.confirm = null;

      $scope.reset = function() {
         $scope.err = null;
         $scope.msg = null;
      };


      function buildPwdParms() {
         return {
            email: $scope.auth.user.email,
            oldpass: $scope.oldpass,
            newpass: $scope.newpass,
            confirm: $scope.confirm,
            callback: function(err) {
               if( err ) {
                  $scope.err = err;
               }
               else {
                  $scope.oldpass = null;
                  $scope.newpass = null;
                  $scope.confirm = null;
                  $scope.msg = 'Password updated!';
               }
            }
         }
      }

}]);
