var simple-storeSearchApp = angular.module('simple-storeSearchApp');

// simple-storeSearchApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
simple-storeSearchApp.config(function(){
}]);

simple-storeSearchApp.run(function(){

});

// simple-storeSearchApp.controller('SearchController', ['$scope', function SearchController($scope){
//
//     $scope.hej = "hejsan";
// }]);

simple-storeSearchApp.controller('SearchController', ['$scope', '$http', function SearchController($scope, $http){
    $scope.hej = "hejsan";

    var promise = $http.get('data/categories.json');

    promise.then(
      function successCallback(data){
        $scope.categories = data;
        console.log($scope.categories);
      },
      function errorCallback(data){
        $scope.categories = "ERROR";
        console.log($scope.categories);
      }
    );
}]);
