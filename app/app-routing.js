var simple-storeSearchApp = angular.module('simple-storeSearchApp', ['ngRoute']);

simple-storeSearchApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider){
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider
          .when('/search', {
            templateUrl: '/views/search.html',
            controller: 'SearchController',
          })
          .when('/product-list', {
            templateUrl: '/views/product-list.html',
            controller: 'ProductListController',
          })
          .when('/product:id', {
            templateUrl: '/views/product.html',
            controller: 'ProductListController',
          })
          .when('/category-list', {
            templateUrl: '/views/category-list.html',
            controller: 'CategoryListController',
          })
          .when('/category:id', {
            templateUrl: 'views/category.html',
            controller: 'CategoryListController',
          })
          .otherwise({
            redirectTo: '/search'
          });
    }
]);

// simple-storeSearchApp.filter('search',
//     function(){
//         return function(input){
//             input = input || '';
//             var out = '';
//
//             return out;
//         };
//     }
// );

simple-storeSearchApp.run(
    function(){

    }
);

simple-storeSearchApp.controller('MainController', ['$scope', '$http', '$location', '$log', '$routeParams', '$route',
    function MainController($scope, $http, $location, $log, $routeParams, $route){

        $scope.message = "Takes it from Parent";
        $scope.debug = $route;
    }
]);

simple-storeSearchApp.controller('SearchController', ['$scope', '$http', '$location', '$log', '$routeParams', '$route', '$filter',
    function SearchController($scope, $http, $location, $log, $routeParams, $route, $filter){

        $scope.sortDir = false;
        $scope.sortColumn = 'sortByInStock';
        $scope.productData = [];

		// -----------    Create database from json file    ----------- //

        var promise = $http.get('data/categories.json');

        function initDataSuccess(response){
            createDataTree(response.data);
        }

        function initDataError(response){
            console.log($scope.products);
        }

        promise.then(initDataSuccess, initDataError);

        function createDataTree(json){
            $scope.productData = [];
            var productData = [];

            json.forEach(
                function(obj){
                    if(obj.id.startsWith('s')){
                        obj.children.map(
                            function(child){
                                if(!$scope.productData.some(product => product.id === child.id)){
                                    $scope.productData.push({'id': child.id, 'data': {}, 'categories': [obj]});
                                } else{
                                    $scope.productData.find(product => product.id === child.id).categories.push(obj);
                                }
                            }
                        )
                    } else if(!productData.some(product => product.id === obj.id)){
                        $scope.productData.push({'id': obj.id, 'data': {}, 'categories': []});
                    }
                }
            );

            setProductsData(productData);
        }







		// -----------    Create database from 'window' object    ----------- //

		// window.getCategories(createDataTree);




		// -----------    Combine 'categories' database with 'products' database    ----------- //

        function setProductsData(productData){
			// For each product found in categories, check that they have a defined 'data' value
			// and then get their product data from the 'window' call.
			// angular.forEach($scope.productData,
			// 	function(productDataItem){
			// 		if(!productDataItem.data === undefined){
			// 			window.getProduct(productDataItem.id,
			// 				function(productItem){
			// 					productDataItem.data = productItem;
			// 				}
			// 			);
			// 		}
			// 		productDataItem.data = (productDataItem.data === undefined ? {} : window.getProduct(productDataItem.id));
			// 	}
			// );

            var promise = $http.get('data/products.json');

            function successCallbackProducts(response){
                angular.forEach($scope.productData,
                    function(product){
                        product.data = (product.data === undefined ? {} : response.data.find(responseProduct => responseProduct.id === product.id));
                    }
                );
            }

            function errorCallbackProducts(response){
                console.log("ERROR: Http request failed " + response);
            }

            promise.then(successCallbackProducts, errorCallbackProducts);
        }

        // -----------    Get category data from file    ----------- //

        // var promise = $http.get('data/categories.json');
		//
        // function successCallbackCategories(response){
        //     $scope.categories = response.data;
        // }
		//
        // function errorCallbackCategories(response){
        //     $scope.categories = [];
        //     console.log("ERROR: Http request failed " + response);
        // }
		//
        // promise.then(successCallbackCategories, errorCallbackCategories);



        // -----------    Get product data from file    ----------- //

        // var promise = $http.get('data/products.json');
		//
        // function successCallbackProducts(response){
        //     $scope.products = response.data;
        // }
		//
        // function errorCallbackProducts(response){
        //     $scope.products = [];
        //     console.log("ERROR: Http request failed " + response);
        // }
		//
        // promise.then(successCallbackProducts, errorCallbackProducts);


		// -----------    Getters for frontend html    ----------- //

        $scope.getId = function (product){
            return product.data.id;
        }

        $scope.getName = function (product){
            return product.data.name;
        }

        $scope.inStock = function (product){
            return product.data.extra.AGA.LGA > 0 ? "I lager (" + parseInt(product.data.extra.AGA.LGA) + ")" : "Ej i lager";
        }

        $scope.getPrice = function (product){
            return parseFloat(parseFloat(product.data.extra.AGA.PRI).toFixed(2));
        }

        $scope.getVolume = function (product){
            return parseFloat(parseFloat(product.data.extra.AGA.VOL).toFixed(2));
        }

        $scope.getProductCategories = function(product){
            var retString = "";
            product.categories.forEach(
                function(obj){
                    retString += obj.name;
                }
            );
            return retString;
        }

        // -----------    Sorting area    ----------- //

        $scope.sortBy  = function(sortByProperty){
            if($scope.sortByProperty === sortByProperty){
                $scope.sortDir = !$scope.sortDir;
            } else{
                $scope.sortByProperty = sortByProperty;
                $scope.sortDir = true;
                switch (sortByProperty) {
                    case 'InStock':
                        $scope.sortColumn = "data.extra.AGA.LGA";
                        break;
                    case 'Volume':
                        $scope.sortColumn = "data.extra.AGA.VOL";
                        break;
                    case 'Categories':
                        $scope.sortColumn = "categories";
                        break;
                    default:
                }
            }
        }


		// -----------    Unused sorting algorithms    ----------- //

        $scope.sortById = function(firstObj, secondObj){
            if (firstObj.type !== 'float' || secondObj.type !== 'float') {
                return firstObj.index < secondObj.index ? -1 : 1;
            }
            return firstObj < secondObj ? -1 : 1;
        };

        $scope.sortByName = function(firstObj, secondObj){
            if (firstObj.type !== 'string' || secondObj.type !== 'string') {
                return firstObj.index < secondObj.index ? -1 : 1;
            }
            return firstObj.name.localeCompare(secondObj.name, undefined, { sensitivity: 'accent' });
        };

        $scope.sortByPrice = function(firstObj, secondObj){
            if (firstObj.type !== 'float' || secondObj.type !== 'float') {
                return firstObj.index < secondObj.index ? -1 : 1;
            }
            return firstObj < secondObj ? -1 : 1;
        };

        $scope.sortByInStock = function(firstObj, secondObj){
            return firstObj.extra.AGA.LGA < secondObj.extra.AGA.LGA ? -1 : 1;
        }

        $scope.sortByVolume = function(firstObj, secondObj){
            return firstObj.extra.LGA.VOL < secondObj.extra.LGA.VOL ? -1 : 1;
        };

        $scope.sortByCategories = function(firstObj, secondObj){
            return true;
        };
    }
]);

simple-storeSearchApp.filter('searchFilter',
    function(){
        return function(items, $scope){
            var filtered = [];

            angular.forEach(items,
                function(item){
                    var lowerCaseSearch = ($scope.currentSearch === undefined ? "" : $scope.currentSearch.toLowerCase());
                    var lowerCaseId = ($scope.idFilterValue === undefined ? "" : $scope.idFilterValue.toLowerCase());
                    var lowerCaseCategoriesFilter = ($scope.categoryFilterValue === undefined ? "" : $scope.categoryFilterValue.toLowerCase());

                    var priceFromFilterValue = (!$scope.priceFromFilterValue) ? 0 : parseFloat(parseFloat($scope.priceFromFilterValue).toFixed(2));
                    var priceToFilterValue = (!$scope.priceToFilterValue) ? Infinity : parseFloat(parseFloat($scope.priceToFilterValue).toFixed(2));
                    var volumeFromFilterValue = (!$scope.volumeFromFilterValue) ? 0 : parseFloat(parseFloat($scope.volumeFromFilterValue).toFixed(2));
                    var volumeToFilterValue = (!$scope.volumeToFilterValue) ? Infinity : parseFloat(parseFloat($scope.volumeToFilterValue).toFixed(2));

                    var parsedInStock = parseFloat(item.data.extra.AGA.LGA);
                    var parsedVolume = parseFloat(parseFloat(item.data.extra.AGA.VOL).toFixed(2));
                    var parsedPrice = parseFloat(parseFloat(item.data.extra.AGA.PRI).toFixed(2));

                    var nameFilter = item.data.name.toLowerCase().includes(lowerCaseSearch);
                    var idSearchFilter = item.id.toLowerCase().includes(lowerCaseSearch);
                    var searchFilter = nameFilter || idSearchFilter;
                    var idValueFilter = item.id.toLowerCase().includes(lowerCaseId);
                    var inStockFilter = $scope.inStockFilterValue ? (parsedInStock > 0) : true;
                    var volumeFilter = (parsedVolume >= volumeFromFilterValue) && (parsedVolume <= volumeToFilterValue);
                    var priceFilter = (parsedPrice >= priceFromFilterValue) && (parsedPrice <= priceToFilterValue);
                    var categoryFilter = (lowerCaseCategoriesFilter.length > 0 ? item.categories.some(cat => cat.name.toLowerCase().includes(lowerCaseCategoriesFilter)) : true);
                    if(searchFilter && idValueFilter && inStockFilter && priceFilter && volumeFilter && categoryFilter){
                        filtered.push(item);
						// console.log("Volume: " + parsedVolume);
						console.log("Price: " + parsedPrice);
						console.log("Filtered to: " + priceToFilterValue);
						console.log("Filtered ok? " + (parsedPrice <= priceToFilterValue));
					}
                }
            );

            return filtered;
        }
    }
);

simple-storeSearchApp.controller('CategoryListController', ['$scope', '$http',
    function CategoryListController($scope, $http){

        var promise = $http.get('data/categories.json');

        promise.then(
            function successCallback(response){
                $scope.categories = response.data;
                console.log($scope.categories);
            },
            function errorCallback(response){
                $scope.categories = "ERROR";
                console.log($scope.categories);
            }
        );
    }
]);

simple-storeSearchApp.controller('ProductListController', ['$scope', '$http',
    function ProductListController($scope, $http){
        console.log("ProdController");
        var promise = $http.get('data/products.json');

        promise.then(
            function successCallback(response){
                $scope.products = response.data;
                console.log($scope.products[0]);
            },
            function errorCallback(response){
                $scope.products = "ERROR";
                console.log($scope.products);
            }
        );

        function initProducts(jsonData){

        };
    }
]);

simple-storeSearchApp.controller('NavBarController', ['$scope', '$location',
    function NavBarController($scope, $location){
        console.log($(".nav a"));
        $(".nav a").on("click",
            function(){
                $(".nav").find(".active").removeClass("active");
                $(this).parent().addClass("active");
            }
        );
    }
]);
