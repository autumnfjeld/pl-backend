
angular.module('myApp.service.userdata', ['firebase', 'myApp.service.firebase'])
  .factory('userDataService', ['$firebase', 'firebaseRef', '$q',
    function($firebase, firebaseRef, $q) {
      var usersRef = firebaseRef('users');
      var users = $firebase(usersRef);
      console.log('checking userDataService users:',users);

      return { 
        exists  : function(fbuser, callback) {
          firebaseRef('fireid_to_fbid/'+fbuser.id)
            .once('value', function(snap){
              if (snap.val() === null){
                callback(fbuser);
            }
          });
        },

        createfb : function(fbuser){
          var userObj = {
            displayname     : fbuser.first_name,
            createDump      : fbuser,
            homecity        : fbuser.hometown.name,
            locationHistory : {},       //https://www.firebase.com/docs/managing-lists.html
            fbAuthToken     : fbuser.accessToken,
            paymentData     : {'todo' : 'stripe?'},
            trustPoints     : {},
            merchantsSubs   : {},
            transactions    : {},
            dealsClicked    : {}
          };

          var id = firebaseRef('users').push(userObj).name();
          console.log('user added. id is', id);
          firebaseRef('fireid_to_authid/'+fbuser.id).set(id);  
        },

        create : function(pwuser){

        },

        get : function(userid, callback){
          var d = $q.defer();

          firebaseRef('users/'+userid)
            .once('value', function(snap){
              d.resolve(snap.val());
            }); 
          return d.promise;
        },

        getList : function(array, callback){
          // get = this.get;
          return $q.all(_.map(array, this.get)); // note map takes third param of context
        },

        update : function(id, userObj){
          //DENORMALIZE
          //update implies client already has 'full' user object, overwrites whatever,
          //then sends user object back, but what about id?
          //TODO: let user update phone and email
          firebaseRef('users/'+ userid).set(userObj);
        },

        updateLoc : function(){
          //will add to the  users/locationHistory
        },

        delete : function(){
          //TODO: delete user account
        }

      };

    }])
