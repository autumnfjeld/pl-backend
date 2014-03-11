"use strict";

angular.module('myApp.routes', ['ngRoute'])

   // configure views; the authRequired parameter is used for specifying pages
   // which should only be available while logged in
   .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/home', {
         templateUrl: 'partials/home.html',
         controller: 'HomeCtrl'
      });

      // $routeProvider.when('/chat', {
      //    templateUrl: 'partials/chat.html',
      //    controller: 'ChatCtrl'
      // });

      //ACCOUNTS
      $routeProvider.when('/account', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'partials/account.html',
         controller: 'AccountCtrl'
      });

      //DEALS
      $routeProvider.when('/deals', {
         templateUrl: 'partials/deals.html',
         controller: 'DealsCtrl'
      });

      $routeProvider.when('/deals/:dealId', {
         templateUrl: 'partials/dealUpdate.html',
         controller: 'DealUpdateCtrl'
      });

      //MERCHANTS
      $routeProvider.when('/merchants', {
         templateUrl: 'partials/merchants.html',
         controller: 'MerchantsCtrl'
      });

      $routeProvider.when('/merchants/:merchantId', {
         templateUrl: 'partials/merchantUpdate.html',
         controller: 'MerchantUpdateCtrl'
      });

      //LOGIN
      $routeProvider.when('/login', {
         templateUrl: 'partials/login.html',
         controller: 'LoginCtrl'
      });

      $routeProvider.otherwise({redirectTo: '/home'});
   }]);
