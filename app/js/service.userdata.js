
angular.module('myApp.service.userdata', ['firebase', 'myApp.service.firebase', 'myApp.services.helpers'])
  .factory('userDataService', ['$firebase', 'firebaseRef', '$q', '$rootScope', 'helpers',
    function($firebase, firebaseRef, $q, $rootScope, helpers) {
      var usersRef = firebaseRef('users');
      var users = $firebase(usersRef);

      return { 
        exists  : function(user, callback) {
          var self = this;
          var d = $q.defer();

          firebaseRef('fireid_to_authid/' + user.id)
            .once('value', function(snap){
              d.resolve(snap.val());
          });
         
          d.promise
            .then(function(id){
              if(!id) {
                console.log('did not find id', id);
                self.createByFacebook(user);
              }
              console.log('found id', id);
            });

          //return d.promise  
        },

        createByFacebook : function(fbuser){
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
          firebaseRef('fireid_to_authid/'+ fbuser.id).set(id);  
        },

        createByEmail : function(user){
          console.log('createByEmail: checking auth object', $rootScope.auth, 'and incomiing user', user);
          var userObj = {
            displayname : firstPartOfEmail(user.email),
            createDump  : user
          };
          var id = firebaseRef('users').push(userObj).name();
          console.log('email/pw user added. id is', id, 'user.email', user.email);
          firebaseRef('fireid_to_authid/'+ helpers.emailStrip(user.email)).set(id);  

           function firstPartOfEmail(email) {
              return ucfirst(email.substr(0, email.indexOf('@'))||'');
           }

           function ucfirst (str) {
              // credits: http://kevin.vanzonneveld.net
              str += '';
              var f = str.charAt(0).toUpperCase();
              return f + str.substr(1);
           }
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
