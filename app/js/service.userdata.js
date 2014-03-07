
angular.module('myApp.service.userdata', ['firebase', 'myApp.service.firebase'])
  .factory('userDataService', ['$firebase', 'firebaseRef', 
    function($firebase, firebaseRef) {

      return { 
        exists  : function(fbuser, callback) {
          firebaseRef('fireid_to_fbid/'+fbuser.id)
            .once('value', function(snap){
              console.log('snap.val', snap.val());
              if (snap.val() === null){
                console.log('user does not exist');
                callback(fbuser);
            }
          });
        },

        create : function(fbuser){
          var userObj = {
            fbDump          : fbuser,
            locationHistory : [],
            fbAuthToken     : fbuser.accessToken,
            paymentData     : {'todo' : 'stripe?'},
            trustPoints     : [],
            merchants       : [],
            transactions    : []

          };

          var id = firebaseRef('users').push(userObj).name();
          console.log('added, id is', id);
          firebaseRef('fireid_to_fbid/'+fbuser.id).set(id);  
        },

        get : function(){

        },

        update : function(){

        },

        delete : function(){

        }
      };

    }])
