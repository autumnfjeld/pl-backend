angular.module('myApp.service.transactiondata', ['firebase', 'myApp.service.firebase', 'myApp.services.helpers','waitForAuth'])
  .factory('transactionService', ['$firebase', 'firebaseRef', '$q', '$rootScope', 'helpers', 'waitForAuth',
    function($firebase, firebaseRef, $q, $rootScope, helpers, waitForAuth) {
      
      var transRef = firebaseRef('transactions');

      return {

        create : function(obj){
       
          var d = $q.defer();
          var id = transRef.push();
          id.set(obj, function(err) {
            if (!err){
              d.resolve();
              //$getCurrentUser.then(function(data){console.log(data)});
              //firebaseRef('users' + userid);
            }else{
              d.reject();
            }
          });
          return d.promise;
        },

        getAll : function(){

        },

        getByUserId : function(){

        },

        getByMerchantId : function(){

        },

        updateStatus : function(){

        }



      };   

   }])
