'use strict';

// Skills controller
angular.module('skills').controller('SkillsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Skills','Categories',
	function($scope, $http, $stateParams, $location, Authentication, Skills, Categories) {
		$scope.authentication = Authentication;

		$scope.auth = function(){
			if ($scope.authentication.user.roles && $scope.authentication.user.roles[0] === 'admin' ) {
                //Allow user to view this page
            }else{
                $location.path('/');
                $location.replace();
            };
		};
		// Create new Skill
		$scope.create = function() {
			// Create new Skill object
			var skill = new Skills ({
				name: this.name,
				category : this.category
			});

			// Redirect after save
			skill.$save(function(response) {
				$location.path('skills');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Skill
		$scope.remove = function(skill) {
			if ( skill ) { 
				skill.$remove();

				for (var i in $scope.skills) {
					if ($scope.skills [i] === skill) {
						$scope.skills.splice(i, 1);
					}
				}
			} else {
				$scope.skill.$remove(function() {
					$location.path('skills');
				});
			}
		};

		// Update existing Skill
		$scope.update = function() {
			var skill = $scope.skill;
			// skill.category = this.category._id;
			skill.$update(function() {
				$location.path('skills');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.loadSeed = function(){
			$scope.categories = Categories.query();
			
		};

		// Find a list of Skills
		$scope.find = function() {
			$scope.skills = Skills.query();
		};

		// Find existing Skill
		$scope.findOne = function() {
			$scope.skill = Skills.get({ 
				skillId: $stateParams.skillId
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