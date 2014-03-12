'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp',
      ['myApp.config', 'myApp.routes','myApp.service.login', 'myApp.controllers',
      'waitForAuth', 'routeSecurity', 'myApp.controller.deal', 'myApp.service.dealdata',
      'myApp.controller.merchant', 'myApp.service.merchantdata', 'myApp.services.helpers', 'myApp.controller.transactions'])


   .run(['loginService', '$rootScope', 'FBURL', 
      function(loginService, $rootScope, FBURL) {
      // with facebook login this returns an auth object of facebook data
      $rootScope.auth = loginService.init('/login');
      $rootScope.FBURL = FBURL;
      //$rootScope.userId = $rootScope.auth.user.provider + ":" + $rootScope.auth.user.id;
   }]);
