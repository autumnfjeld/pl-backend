(function() {
   'use strict';

   angular.module('myApp.services.helpers', ['myApp.service.login', 'myApp.service.firebase'])
      .factory('helpers', [ function() {
        return {
          emailStrip :function(email) {
            var pos1 = email.indexOf('@');
            var pos2 = email.indexOf('.');
            return email.slice(0,pos1) + email.slice(pos1+1, pos2)+ email.slice(pos2+1);
          }
        };
      }]);
})();

