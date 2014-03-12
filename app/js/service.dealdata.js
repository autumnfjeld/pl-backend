angular.module('myApp.service.dealdata', ['firebase', 'myApp.service.firebase'])
  .factory('dealDataService', ['$firebase', '$q', 'firebaseRef',
    function($firebase, $q, firebaseRef) {

  var root = firebaseRef();
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
        var obj = {};
        obj[dealId] = snap.val();
        console.log('getById: ', obj);
        d.resolve( obj);
      }, function(data) {
        d.reject(data);
      });
      return d.promise;
    },

    getByMerchantId : function(merchantId){
     var self = this;
      var d1 = $q.defer();
      //first get array of a merchant's dealsIds
      root.child('merchants/'+ merchantId + '/deals/')
        .once('value', function(snap){
          d1.resolve( snap.val() );
        }, function(data){
          d1.reject(data);
        });

      var d2 = $q.defer();
       
      d1.promise.then(function(list){
        $q.all(_.map(list, function(val,key){
          return self.getById(key);
        }, self))
        .then(function(data){
          //convert array of items into object of objects
          var obj = {};
          _.each(data, function(item){
            _.extend(obj, item)
          })
          d2.resolve(obj);
        });
      });

      return d2.promise;
    },

    create: function(deal) {
      var d = $q.defer();

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
