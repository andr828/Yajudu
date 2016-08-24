'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope','$http', '$stateParams', '$location', 'Authentication', 'Categories',
	function($scope, $http, $stateParams, $location, Authentication, Categories) {
		$scope.authentication = Authentication;

		$scope.auth = function(){
			if ($scope.authentication.user.roles && $scope.authentication.user.roles[0] === 'admin' ) {
                //Allow user to view this page
            }else{
                $location.path('/');
                $location.replace();
            };
		};
		// Create new Category
		$scope.create = function() {
			// Create new Category object
			var category = new Categories ({
				name: this.name,
				isActive: this.isActive
			});

			// Redirect after save
			category.$save(function(response) {
				$location.path('categories');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Category
		$scope.remove = function(category) {
			if ( category ) { 
				category.$remove();

				for (var i in $scope.categories) {
					if ($scope.categories [i] === category) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}
		};

		// Update existing Category
		$scope.update = function() {
			// var category = $scope.category;
			// $scope.category.$promise.then(function(data){ 
			// $http.post('/category/update/'+data._id+'/'+data.name)
   //                  .success(function(response) {
   //              		$location.path('categories');
   //                  });
   //          });
			var category = $scope.category;
			category.$update(function() {
				$location.path('categories');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categories
		$scope.find = function() {
			$scope.categories = Categories.query();
		};

		// Find existing Category
		$scope.findOne = function() {
			$scope.category = Categories.get({ 
				categoryId: $stateParams.categoryId
			});
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