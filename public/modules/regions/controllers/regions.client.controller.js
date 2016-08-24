'use strict';

// Regions controller
angular.module('regions').controller('RegionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Regions',
	function($scope, $stateParams, $location, Authentication, Regions) {
		$scope.authentication = Authentication;

		// Create new Region
		$scope.create = function() {
			// Create new Region object
			var region = new Regions ({
				name: this.name
			});

			// Redirect after save
			region.$save(function(response) {
				$location.path('regions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Region
		$scope.remove = function(region) {
			if ( region ) { 
				region.$remove();

				for (var i in $scope.regions) {
					if ($scope.regions [i] === region) {
						$scope.regions.splice(i, 1);
					}
				}
			} else {
				$scope.region.$remove(function() {
					$location.path('regions');
				});
			}
		};

		// Update existing Region
		$scope.update = function() {
			var region = $scope.region;

			region.$update(function() {
				$location.path('regions/' + region._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Regions
		$scope.find = function() {
			$scope.regions = Regions.query();
		};

		// Find existing Region
		$scope.findOne = function() {
			$scope.region = Regions.get({ 
				regionId: $stateParams.regionId
			});
		};
	}
]);