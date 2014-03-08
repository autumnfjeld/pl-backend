
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

        create : function(fbuser){
          var userObj = {
            displayname     : fbuser.first_name,
            fbDump          : fbuser,
            homecity        : fbuser.hometown.name,
            locationHistory : {},       //https://www.firebase.com/docs/managing-lists.html
            fbAuthToken     : fbuser.accessToken,
            paymentData     : {'todo' : 'stripe?'},
            trustPoints     : {},
            merchants       : {},
            transactions    : {}

          };

          var id = firebaseRef('users').push(userObj).name();
          console.log('user added. id is', id);
          firebaseRef('fireid_to_fbid/'+fbuser.id).set(id);  
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
          console.log('incomingarray', array);
          get = this.get;
          return $q.all([
              _.map(array, function(userid){
                  return get(userid);
                })
            ]).then(function (results){
              console.log('results', results);
              var userList = [];
              _.each(results, function (result){
                  console.log('listing....', result.data)
                  userList.push(result.data);
              });
              return userList;
            });


          ////USE promises
          // var deferred = $q.defer();

          // $timeout(function(){
          //   defered.resolve(
          //    _.map(array, function(userid){
          //     firebaseRef('users/'+userid)
          //       .once('value', function(snap){
          //         console.log('check', userid, snap.val());
          //         return snap.val();
          //         //return function get
          //       });
          //   })
          // );
        },

        update : function(){
          //TODO: let user update phone and email
        },

        delete : function(){
          //TODO: delete user account
        }

      };

    }])
