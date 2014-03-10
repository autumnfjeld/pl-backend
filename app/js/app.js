'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp',
      ['myApp.config', 'myApp.routes','myApp.service.login', 'myApp.controllers',
      'waitForAuth', 'routeSecurity', 'myApp.service.dealdata', 'myApp.controller.deal'])

//TO DO: Autumn, don't you have to add your myApp.service.userdata in the list of dependancies?

   .run(['loginService', '$rootScope', 'FBURL', 
      function(loginService, $rootScope, FBURL) {
      // establish authentication
      // with facebook login this returns an auth object of facebook data
      $rootScope.auth = loginService.init('/login');
      $rootScope.FBURL = FBURL;
   }]);
