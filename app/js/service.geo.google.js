angular.module('myApp.service.geogoogle', ['ngResource'])
  .factory('geoGoogleService', ['$http', '$q',
    function($http, $q) {

  var apiKey ='AIzaSyD6ta21eMx5Nxi4PDozFSKta3fkMZh06TM';
  var url ="https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=true"; 

  var fetchData = function(address) {
    var d = $q.defer();


    $http.get(url)
    .success(function(data, status, headers){

      var data = data;
      var lat = data.results[0].geometry.location.lat;
      d.resolve(data);
    })
    .error(function(data, status, headers) {
      console.log('error')
      d.reject(data);
    });
    return d.promise;
  };

  // var getDurations(userLocation, dealLocation) {

  // }

  return {
    fetchData: fetchData
  }



}]);

// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=true_or_false&key=API_KEY


	// .constant('apiKey', 'AIzaSyCTMxNH5qf9VYlAueWbCo7sxGZxxuUKDv8')