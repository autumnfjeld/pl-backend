'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp',
      ['myApp.config', 'myApp.routes','myApp.service.login', 'myApp.controllers',
      'waitForAuth', 'routeSecurity', 'myApp.controller.deal', 'myApp.service.dealdata',
      'myApp.controller.merchant', 'myApp.service.merchantdata'])

   .run(['loginService', '$rootScope', 'FBURL', 
      function(loginService, $rootScope, FBURL) {
      // establish authentication
      // with facebook login this returns an auth object of facebook data
      $rootScope.auth = loginService.init('/login');
      $rootScope.FBURL = FBURL;
   }]);
