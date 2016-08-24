'use strict';

// Subcategories controller
angular.module('subcategories').controller('SubcategoriesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Subcategories', 'Categories',
	function($scope, $http, $stateParams, $location, Authentication, Subcategories, Categories) {
		$scope.authentication = Authentication;

		$scope.auth = function(){
			if ($scope.authentication.user.roles && $scope.authentication.user.roles[0] === 'admin' ) {
                //Allow user to view this page
            }else{
                $location.path('/');
                $location.replace();
            };
		};
		// Create new Subcategory
		$scope.create = function() {
			// Create new Subcategory object

			var subcategory = new Subcategories ({
				name: this.name	,
				category : this.category
			});
			// Redirect after save
			subcategory.$save(function(response) {
				$location.path('subcategories');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Subcategory
		$scope.remove = function(subcategory) {
			if ( subcategory ) { 
				subcategory.$remove();

				for (var i in $scope.subcategories) {
					if ($scope.subcategories [i] === subcategory) {
						$scope.subcategories.splice(i, 1);
					}
				}
			} else {
				$scope.subcategory.$remove(function() {
					$location.path('subcategories');
				});
			}
		};

		// Update existing Subcategory
		$scope.update = function() {
			var subcategory = $scope.subcategory;
			// subcategory.category = this.category._id;
			subcategory.$update(function() {
				$location.path('subcategories');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.loadSeed = function(){
			$scope.categories = Categories.query();
			
		};
		// Find a list of Subcategories
		$scope.find = function() {
			$scope.subcategories = Subcategories.query();
		};

		// Find existing Subcategory
		$scope.findOne = function() {
			$scope.subcategory = Subcategories.get({ 
				subcategoryId: $stateParams.subcategoryId
			});
			
			// $scope.category = $scope.subcategory.category;

		};
		$scope.setState = function(state){
            $scope.currentState = state;
        };
        $scope.loadCountForBadge = function(){
            $http.get('/job-moderations-count').
            success(function(data, status, headers, config) {
                $scope.modejobsCount = data;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

            $http.get('/proposals/moderations/list-count').
            success(function(data, status, headers, config) {
                $scope.proposalsCount = data;
            }).
            error(function(data, status, headers, config) {
                
            });            
        };
	}
]);