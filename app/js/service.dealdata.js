angular.module('myApp.service.dealdata', ['firebase', 'myApp.service.firebase'])
  .factory('dealDataService', ['$firebase', '$q', 'firebaseRef',
    function($firebase, $q, firebaseRef) {

  var dealsRef = firebaseRef('deals');

  var Deal = {

    getDeals: function() {
      var d = $q.defer();
      dealsRef.once('value', function(snap) {
        d.resolve(snap.val());
      }, function(data) {
        d.reject(data);
      });
      return d.promise;
    },

    findDeal: function(dealId) {
      var d = $q.defer();
      firebaseRef('deals/' + dealId).once('value', function(snap) {
        d.resolve(snap.val());
      }, function(data) {
        d.reject(data);
      });
      return d.promise;
    },

    createDeal: function(deal) {
      var d = $q.defer();
      var id = dealsRef.push();
      id.set(deal, function(err) {
        err ? d.reject() : d.resolve();
      });
      return d.promise;
    },

    updateDeal: function(dealId, deal) {
      var d = $q.defer();
      firebaseRef('deals/' + dealId).set(deal, function(err) {
        err ? d.reject() : d.resolve();
      });
      return d.promise;
    },

    deleteDeal: function(dealId) {
      var d = $q.defer();
      firebaseRef('deals/' + dealId).remove(function(err) {
        err ? d.reject() : d.resolve();
      });
      return d.promise;
    }

  };

  return Deal;

}]);
