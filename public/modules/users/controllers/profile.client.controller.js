'use strict';

angular.module('users').controller('ProfileController', ['$scope', '$http', '$stateParams', '$location', '$state', 'Users', 'Authentication', 'lodash', 'Skills', 'Categories', 'Subcategories',
	function($scope, $http, $stateParams, $location, $state, Users, Authentication, lodash, Skills, Categories, Subcategories) {
		$scope.user = Authentication.user;
		$scope.isVisitor = false;
		$scope.$state = $state;

		// If user is not signed in then redirect back home
		// if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		  $scope.initUserProfile = function(){
            if ($stateParams.userId && $stateParams.userId!=='') {
                    $scope.loadFeedbacks($stateParams.userId);
                if($stateParams.userId === $scope.user._id){
                    $scope.isVisitor = false;
                    // $scope.user = Authentication.user;
                    $scope.getUserById(Authentication.user._id);
                }else{
                    $scope.isVisitor = true;
                    $scope.getUserById($stateParams.userId);
                };
            };
        };
        $scope.getUserById = function(userId){
            $http.get('/users/getUserById/'+userId).success(function(response) {
                $scope.user = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

		$scope.loadFeedbacks = function(userId){
			$http.get('/feedback/history/'+ userId).
			  then(function(response) {
			  	if ($stateParams.skillId) {
                    $scope.feedbacks = [];
                    var allJobs = response.data;
                    for(var job in allJobs){
                    	if (allJobs[job].job) {
                    		var skillExist = lodash.filter(allJobs[job].job.skills, function(obj){
                        		return obj == $stateParams.skillId;
                        	});
                        	if(allJobs[job].job && skillExist.length){
                            	$scope.feedbacks.push(allJobs[job]);
                        	};	
                    	};
                    	
                    }
                    $scope.getCountClients(userId);
                    $scope.querySkill = Skills.get({ 
						skillId: $stateParams.skillId
					});
                }else{
                	$scope.feedbacks = response.data;
                	$scope.getCountClients(userId);
                }
			  }, function(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });
		};
		$scope.getCountClients = function(userId){
			$http.get('/feedback/clients-count/'+ userId).
			  then(function(response) {
                	$scope.totalClients = response.data;
                	$scope.repeatRate = (($scope.feedbacks.length-$scope.totalClients)/$scope.feedbacks.length)*100;
                	console.log(response.data);
                
			  }, function(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });
		}

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					location.reload();
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
