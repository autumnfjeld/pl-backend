angular.module('myApp.service.merchantdata', ['firebase', 'myApp.service.firebase'])
  .factory('merchantDataService', ['$firebase', '$q', 'firebaseRef',
    function($firebase, $q, firebaseRef) {

  var merchantsRef = firebaseRef('merchants');

  var Merchant = {

    getAll: function() {
      var d = $q.defer();
      merchantsRef.once('value', function(snap) {
        d.resolve(snap.val());
      }, function(data) {
        d.reject(data);
      });
      return d.promise;
    },

    getById: function(merchantId) {
      var d = $q.defer();
      firebaseRef('merchants/' + merchantId).once('value', function(snap) {
        var obj = {};
        obj[merchantId] = snap.val();
        console.log('getById: ', obj);
        d.resolve( obj);
      }, function(data) {
        d.reject(data);
      });
      return d.promise;
    },

    create: function(merchant) {
      var d = $q.defer();
      var id = merchantsRef.push();
      id.set(merchant, function(err) {
        err ? d.reject() : d.resolve();
      });
      return d.promise;
    },

    update: function(merchantId, merchant) {
      var d = $q.defer();
      firebaseRef('merchants/' + merchantId).set(merchant, function(err) {
        err ? d.reject() : d.resolve();
      });
      return d.promise;
    },

    delete: function(merchantId) {
      var d = $q.defer();
      firebaseRef('merchants/' + merchantId).remove(function(err) {
        err ? d.reject() : d.resolve();
      });
      return d.promise;
    }

  };

  return Merchant;

}]);
