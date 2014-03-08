'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp',
      ['myApp.config', 'myApp.routes', 'myApp.filters', 'myApp.services', 'myApp.directives', 
      'myApp.controllers', 'waitForAuth', 'routeSecurity'])

   .run(['loginService', '$rootScope', 'FBURL', 
      function(loginService, $rootScope, FBURL) {
      // establish authentication
      // with facebook login this returns an auth object of facebook data
      $rootScope.auth = loginService.init('/login');
      $rootScope.FBURL = FBURL;
      $rootScope.fbAuthToken = null;  
   }]);
