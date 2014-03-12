
angular.module('myApp.service.userdata', ['firebase', 'myApp.service.firebase', 'myApp.services.helpers'])
  .factory('userDataService', ['$firebase', 'firebaseRef', '$q', '$rootScope', 'helpers',
    function($firebase, firebaseRef, $q, $rootScope, helpers) {
      var usersRef = firebaseRef('users');
      var users = $firebase(usersRef);

      return { 
        exists  : function(auth) {
          var self = this;
          var d = $q.defer();

          firebaseRef('users/' + 'facebook:' + auth.id)
            .once('value', function(snap){
              d.resolve(snap.val());
          });
         
          d.promise
            .then(function(data){
              if(!data) {
                console.log('did not find data', data);
                self.createByFacebook(auth);
              }else{
                console.log('found data', data);
              }
            });
        },

        createByFacebook : function(auth){
          var userObj = {
            displayname     : auth.first_name,
            authDump        : auth,
            homecity        : auth.hometown.name,
            fbAuthToken     : auth.accessToken,
            locationHistory : {},       //https://www.firebase.com/docs/managing-lists.html
          };

          var d = $q.defer;
          firebaseRef('users').child('facebook:'+auth.id)
            .set(userObj, function(err){
              err ? d.reject() : d.resolve();
            });
          return d.promise;
 
        },

        createByEmail : function(auth){
          var userObj = {
            displayname : firstPartOfEmail(auth.email),
            email       : auth.email,
            firebaseAuth: auth.firebaseAuthToken,
            authDump    : auth
          };

          var d = $q.defer;
          firebaseRef('users').child('password:'+ auth.id)
            .set(userObj, function(err){
              err ? d.reject() : d.resolve();
            });
          return d.promise;

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

        getById : function(id){
          console.log('getById', id);
          var d = $q.defer();
          firebaseRef('users/'+ id)
            .once('value', function(snap){
              d.resolve(snap.val());
            }, function(data){
              d.reject(data);
            }); 
          return d.promise;
        },

        getList : function(array){
          // get = this.get;
          return $q.all(_.map(array, this.getById)); // note map takes third param of context
        },

        getAll : function() {
          var d = $q.defer();
          usersRef.once('value', function(snap) {
            d.resolve(snap.val());
          }, function(data) {
            d.reject(data);
          });
          return d.promise;
        },


        update : function(id, userObj){
          //DENORMALIZE
          //update implies client already has 'full' user object, overwrites whatever,
          //then sends user object back, but what about id?
          //TODO: let user update phone and email
          firebaseRef('users/'+ id).set(userObj);
        },

        updateLoc : function(){
          //will add to the  users/locationHistory
        },

        delete : function(){
          //TODO: delete user account
        }

      };

    }])
