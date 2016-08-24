'use strict';

angular.module('core').controller('HeaderController', ['$scope','$location','$http', 'Authentication', 'Menus',
	function($scope, $location, $http, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		console.log($scope.authentication);
		$scope.searchOption = 'Job';
		if ($scope.authentication.user && $scope.authentication.user.roles[0] === 'client' ) {
			$scope.searchOption = 'Talent';
		};
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};
		$scope.init = function() {
			$scope.searchText = '';
		};
		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.searchJob = function() {
			if($scope.searchText !== ''){ 
				$location.path('/searchJob/'+$scope.searchText);
			}
			/*$http.post('/browse-jobs', {
                query: $scope.searchText
            }).
            success(function(data, status, headers, config) {
                console.log(data);
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });*/
		};
		$scope.search = function(){
			if($scope.searchText && $scope.searchText.length > 0){
				var newPath = "searchJob/" + $scope.searchText;
				if($scope.searchOption == 'Talent'){
					newPath = "talent/" + $scope.searchText;
				}
				$location.path(newPath);
				$location.replace();
				$scope.searchText = '';		
			}
		};

	}
]);