angular.module('myApp.service.transactiondata', ['firebase', 'myApp.service.firebase', 'myApp.services.helpers','waitForAuth'])
  .factory('transactionService', ['$firebase', 'firebaseRef', '$q', '$rootScope', 'helpers', 'waitForAuth',
    function($firebase, firebaseRef, $q, $rootScope, helpers, waitForAuth) {
      
      var transRef = firebaseRef('transactions');
      var root = firebaseRef();
      //var userid = $rootScope.auth.provider + ":" + $rootScope.auth.id;

      return {

        create : function(obj){
        console.log('createTransaction. ', obj);

          var d = $q.defer();
          var id = root.child('/transactions').push();
          id.set(obj, function(err) {
            if (!err){
              d.resolve();
              var transId = id.name();
              //add transaction data to user database
              root.child('users/'+ obj.userId+ '/transactions/')
                  .child(transId + '/status/').set('clicked');
              root.child('users/'+ obj.userId+ '/liveTransactions/').child(transId);
              //add transaction data to merchant database
              root.child('merchants/'+ obj.merchantId+ '/transactions/')
                  .child(transId + '/status/').set('clicked');
              //add transaction data to merchant database
              root.child('deals/'+ obj.dealId + '/transactions/')
                  .child(transId + '/status/').set('clicked');
            }else{
              d.reject();
            }
          });
          return d.promise;
        },

        getByTransactionId : function(id){
          var d = $q.defer();
          firebaseRef('transactions/'+ id)
            .once('value', function(snap){
              var obj = {};
              obj[id] = snap.val();
              d.resolve( obj);
            }, function(data){
              d.reject(data);
            }); 
          // data returned is {id : {stuff} }
          return d.promise;
        },

        getByUserId : function(userId){
          var self = this;
          var d1 = $q.defer();
          //first get array of a user's transactionIds
          root.child('users/'+ userId + '/transactions/')
            .once('value', function(snap){
              d1.resolve( snap.val() );
            }, function(data){
              d1.reject(data);
            });

          var d2 = $q.defer();
           
          d1.promise.then(function(list){
            // console.log('transactionIds', list);
            $q.all(_.map(list, function(val,key){
              return self.getByTransactionId(key);
            }, self))
            .then(function(data){
              //convert array of items into object of objects
              var obj = {};
              _.each(data, function(item){
                _.extend(obj, item)
              })
              d2.resolve(obj);
            });
          });

          return d2.promise;
        },


        getByMerchantId : function(merchId){
         var self = this;
          var d1 = $q.defer();
          //first get array of a merchant's transactionIds
          root.child('merchants/'+ merchId + '/transactions/')
            .once('value', function(snap){
              d1.resolve( snap.val() );
            }, function(data){
              d1.reject(data);
            });

          var d2 = $q.defer();
           
          d1.promise.then(function(list){
            // console.log('transactionIds', list);
            $q.all(_.map(list, function(val,key){
              return self.getByTransactionId(key);
            }, self))
            .then(function(data){
              //convert array of items into object of objects
              var obj = {};
              _.each(data, function(item){
                _.extend(obj, item)
              })
              d2.resolve(obj);
            });
          });

          return d2.promise;
        },

        getAll : function(){
         var d = $q.defer();
          transRef.once('value', function(snap) {
            d.resolve(snap.val());
          }, function(data) {
            d.reject(data);
          });
          return d.promise;
        },

        updateStatus : function(id, obj){
          var d = $q.defer();
          firebaseRef('transactions/' + id).set(obj, function(err) {
            err ? d.reject() : d.resolve();
          });
          return d.promise;
        }

      };   

   }])
