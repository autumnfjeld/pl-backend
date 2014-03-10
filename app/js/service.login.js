
angular.module('myApp.service.login', ['firebase', 'myApp.service.firebase', 'myApp.service.userdata',
   'myApp.services.helpers'])

   .factory('loginService', ['$rootScope', '$firebaseSimpleLogin', 'firebaseRef',
     'userDataService', '$timeout',
      function($rootScope, $firebaseSimpleLogin, firebaseRef, userDataService, $timeout) {
         var auth = null;
         return {
            init: function() {
              auth = $firebaseSimpleLogin(firebaseRef());  //create instance of FirebaseSimpleLogin object
              return auth;
            },

            /**
             * @param {string} email
             * @param {string} pass
             * @param {Function} [callback]
             * @returns {*}
             */
            login: function(email, pass, callback) {
              console.log('in login');
               assertAuth();
               auth.$login('password', {
                  email: email,
                  password: pass,
                  rememberMe: true
               }).then(function(user) {
                     if( callback ) {
                        //todo-bug https://github.com/firebase/angularFire/issues/199
                        $timeout(function() {
                           callback(null, user);
                        });
                     }
                  }, callback);
            },
   
            fblogin : function(callback) {
              assertAuth();
                console.log('fblogin service. auth', auth);
                  auth.$login('facebook')
                    .then(function(user){
                        //$rootScope.fbAuthToken = user.accessToken;
                        console.log('Facebook validation success:', user);
                        userDataService.exists(user) 
                      }, function(error){
                        console.log('Facebook vaildation error:', error);
                      });
            },

            logout: function() {
               assertAuth();
               auth.$logout();
            },

            // changePassword: function(opts) {
            //    assertAuth();
            //    var cb = opts.callback || function() {};
            //    if( !opts.oldpass || !opts.newpass ) {
            //       $timeout(function(){ cb('Please enter a password'); });
            //    }
            //    else if( opts.newpass !== opts.confirm ) {
            //       $timeout(function() { cb('Passwords do not match'); });
            //    }
            //    else {
            //       auth.$changePassword(opts.email, opts.oldpass, opts.newpass).then(function() { cb && cb(null) }, cb);
            //    }
            // },

            createAccount: function(email, pass, callback) {
              console.log('createAccount');
               assertAuth();
               auth.$createUser(email, pass)  //returns a promise that is resolved when acnt successfully created
                .then(function(user) { 
                    console.log('$createUser arguments', arguments);
                    userDataService.createByEmail(user);
                    callback && callback(null, user) }, callback);
            }

         };

         function assertAuth() {
            if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
         }
      }])
