angular.module('myApp.service.dealdata', ['firebase', 'myApp.service.firebase'])
  .factory('dealDataService', ['$firebase', '$q', 'firebaseRef',
    function($firebase, $q, firebaseRef) {

  var dealsRef = firebaseRef('deals');

  var Deal = {

    getAll: function() {
      var d = $q.defer();
      dealsRef.once('value', function(snap) {
        d.resolve(snap.val());
      }, function(data) {
        d.reject(data);
      });
      return d.promise;
    },

    getById: function(dealId) {
      var d = $q.defer();
      firebaseRef('deals/' + dealId).once('value', function(snap) {
        console.log('getById: snap.val()', snap.val());
        d.resolve(snap.val());
      }, function(data) {
        d.reject(data);
      });
      return d.promise;
    },

    getByMerchantId: function(merchantId) {

      var d = $q.defer();

      var root = firebaseRef();
      var merchantDealsRef = root.child('merchants/' + merchantId + '/deals');
      var self = this;
 
      merchantDealsRef.once('value', function(snap) {
        var listOfDeals = snap.val();
        console.log('listOfDeals', listOfDeals);
        $q.all(_.map(listOfDeals, function(value, key) {
          return self.getById(key);
        }, self))
        .then(function(data) { //Array of deal objects
          var i = 0;
          for (var prop in listOfDeals) {
            listOfDeals[prop] = data[i];
            i++;
          }
          d.resolve(listOfDeals);
        });
      }, function(data) {
        d.reject(data);
      });
      return d.promise;
    },


    create: function(deal) {
      var d = $q.defer();

      var root = firebaseRef();
      var id = root.child('/deals').push();
      //Creating the deal in the Firebase deals object
      id.set(deal, function(err) {
        if(!err) {
          //Adding a deal key in the merchant / deals object
          var name = id.name();
          root.child('/merchants/' + deal.merchantId + '/deals/' + name).set(true);
          d.resolve();
        } else {
          d.reject();
        }
      });
      return d.promise;
    },

    update: function(dealId, deal) {
      var d = $q.defer();
      firebaseRef('deals/' + dealId).set(deal, function(err) {
        err ? d.reject() : d.resolve();
      });
      return d.promise;
    },

    delete: function(dealId, merchantId) {
      var d = $q.defer();
      var root = firebaseRef();
      //Deleting the deal in the deals object
      firebaseRef('deals/' + dealId).remove(function(err) {
        if(!err) {
          //Deleting the deal key in the merchants/deals object
          root.child('/merchants/' + merchantId + '/deals/' + dealId).remove(function(err) {
            err ? d.reject() : d.resolve();
          });
        } else {
          d.reject();
        }
      });
      return d.promise;
    }

  };

  return Deal;

}]);
