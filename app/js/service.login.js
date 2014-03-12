
angular.module('myApp.service.login', ['firebase', 'myApp.service.firebase', 'myApp.service.userdata',
   'myApp.services.helpers'])

   .factory('loginService', ['$rootScope', '$firebaseSimpleLogin', 'firebaseRef',
     'userDataService', '$timeout',
      function($rootScope, $firebaseSimpleLogin, firebaseRef, userDataService, $timeout) {
         var auth = null;
         return {
            init: function() {
              auth = $firebaseSimpleLogin(firebaseRef());  //create instance of FirebaseSimpleLogin object
              console.log('auth', auth);
              return auth;
            },

            login: function(email, pass) {
              console.log('in login');
               assertAuth();
               auth.$login('password', {
                  email: email,
                  password: pass,
                  rememberMe: true })
               .then(function(user) {
                  }, function(err){
                    console.log('Login validation error:', err);
                });
            },
   
            fblogin : function() {
              assertAuth();
                  auth.$login('facebook')
                    .then(function(user){
                      console.log('fblogin service. AFTER auth.$login user obj', user);
                      //$rootScope.userId = auth.user.provider + ":" + auth.user.id;
                      userDataService.exists(user); 
                      }, function(err){
                        console.log('Facebook vaildation error:', err);
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

            createAccount: function(obj, callback) {
              //callback can be used to call login after account creation
              console.log('createAccount', obj);
               assertAuth();
               auth.$createUser(obj.email, obj.password)  
                .then(function(user) { 
                    //set up obj for database storage
                    delete obj.password
                    obj.authDump = user;
                    obj.firebaseAuth = user.firebaseAuthToken;
                    userDataService.createByEmail(obj);
                    callback && callback(null, user) }, callback);
            }
         };

         function assertAuth() {
            if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
         }
      }])
