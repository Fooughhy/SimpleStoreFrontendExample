var simple-storeSearchApp = angular.module('simple-storeSearchApp', ['ngRoute']);

// simple-storeSearchApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
simple-storeSearchApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $locationProvider.html5Mode(true).hashPrefix('!');
  console.log("HejsanConfig");

  $routeProvider
    .when('/search', {
      templateUrl: 'views/search.html',
      controller: 'SearchController',
    })
    .when('/product:id', {
      templateUrl: '/views/product.html',
      controller: 'ProductListController',
    })
    .when('/product-list', {
      templateUrl: 'views/product-list.html',
      controller: 'ProductListController',
    })
    .when('/category:id', {
      templateUrl: 'views/category.html',
      controller: 'CategoryListController',
    })
    .otherwise({
      redirectTo: '/search'
    });
}]);

simple-storeSearchApp.controller('MainController', ['$scope', '$http', '$location', '$log', '$routeParams', '$route',
function MainController($scope, $http, $location, $log, $routeParams, $route){
    console.log("HejMainController");
    $scope.message = "Takes it from Parent";
    $scope.debug = $route;
}]);

simple-storeSearchApp.controller('SearchController', ['$scope', '$http', '$location', '$log', '$routeParams', '$route',
function SearchController($scope, $http, $location, $log, $routeParams, $route){
    console.log("HejSearchController");
    $scope.hej = "hejsan";

    // $location.path("/search");

    // $scope.$route = $route;
    // $scope.$location = $location;
    //
    // $scope.currURL = $location.absUrl();
    // $scope.theProtocol = $location.protocol();
    // $scope.currHost = $location.host();
    // $scope.currPort = $location.port();
    // $scope.defaultPath = $location.path();
    // $location.path('#/search');
    // $scope.currPath = $location.path();

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

simple-storeSearchApp.controller('CategoryListController', ['$scope', '$http', function CategoryListController($scope, $http){
    console.log("HejCategoryController");
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

simple-storeSearchApp.controller('ProductListController', ['$scope', '$http', function ProductListController($scope, $http){
    console.log("HejProductController");
    var promise = $http.get('data/products.json');

    promise.then(
      function successCallback(data){
        $scope.products = data;
        console.log($scope.products);
      },
      function errorCallback(data){
        $scope.products = "ERROR";
        console.log($scope.products);
      }
    );
}]);
