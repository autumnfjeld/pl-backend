angular.module('myApp.service.merchantdata', ['firebase', 'myApp.service.firebase', 'myApp.service.geogoogle'])
  .factory('merchantDataService', ['$firebase', '$q', 'firebaseRef', 'geoGoogleService',
    function($firebase, $q, firebaseRef, geoGoogleService) {

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
      //var address = "1600+Amphitheatre+Parkway,+Mountain+View,+CA";
      var address = merchant.address1 + '+' + merchant.address2 + '+,'
        + merchant.city + ',+' + merchant.state + ',+' + merchant.zip;
      address = address.replace(/\s/g, '+');
      console.log('address', address);
      //CALL GOOGLE API AND GET THE LOCATION
      geoGoogleService.fetchData(address)
      .then(function(data) {
        merchant.location = [];
        merchant.location.push(data.results[0].geometry.location.lat);
        merchant.location.push(data.results[0].geometry.location.lng);

        var id = merchantsRef.push();
        id.set(merchant, function(err) {
          err ? d.reject() : d.resolve();
        });
      }, function() {
          console.log('Error getting lat/lng from Google API');
          d.reject();
      });

      return d.promise;
    },

    // update: function(merchantId, merchant) {
    //   var d = $q.defer();
    //   firebaseRef('merchants/' + merchantId).set(merchant, function(err) {
    //     err ? d.reject() : d.resolve();
    //   });
    //   return d.promise;
    // },

    update: function(merchantId, merchant) {
      var d = $q.defer();

      var address = merchant.address1 + '+' + merchant.address2 + '+,'
        + merchant.city + ',+' + merchant.state + ',+' + merchant.zip;
      address = address.replace(/\s/g, '+');
      console.log('address', address);
      //CALL GOOGLE API AND GET THE LOCATION
      geoService.fetchData(address)
      .then(function(data) {
        merchant.location = [];
        merchant.location.push(data.results[0].geometry.location.lat);
        merchant.location.push(data.results[0].geometry.location.lng);

        firebaseRef('merchants/' + merchantId).set(merchant, function(err) {
          err ? d.reject() : d.resolve();
        });

      }, function() {
          console.log('Error getting lat/lng from Google API');
          d.reject();
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
