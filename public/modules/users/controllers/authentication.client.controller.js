'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$modal', 'Authentication', 'Users',
    function($scope, $http, $location, $modal, Authentication, Users) {
        $scope.authentication = Authentication;
        $scope.isIndividual = true;
        $scope.isCompany = false;
        $scope.hire = true;
        $scope.work = false;
        $scope.chooseMembership = {};
        $scope.credentials = {};
        // for Signup screen
        $scope.selectedRole = "client";


        // If user is signed in then redirect back home
        if ($scope.authentication.user && $scope.authentication.user.roles[0] !== 'social') {
            document.body.className = "";
            if ($scope.authentication.user.roles[0] === 'client') {
                $location.path('/talent/');
            } else if ($scope.authentication.user.roles[0] === 'freelancer') {
                $location.path('/searchJob/');
            } else if ($scope.authentication.user.roles[0] === 'admin') {
                $location.path('/categories');
            } else {
                $location.path('/');
            };
        };

        $scope.loadCountries = function() {
            $http.get('/countries/').
            then(function(response) {

                // console.log(response.data);
                $scope.countries = response.data;
            }, function(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.

            });
        };
        $scope.signup = function() {
            if ($scope.selectedRole == "client") {
                signupClient();
            } else {
                signupFreelancer();
            }
        };

        function signupClient() {
            if ($scope.credentials && $scope.credentials.password === $scope.credentials.confirmPassword) {
                $http.post('/auth/signup/client', $scope.credentials).success(function(response) {
                    // If successful we assign the response to the global user model

                    //without enail verification
                    resetBackgroundImage();
                    $scope.authentication.user = response;
                    if (response.roles[0] === 'client') {
                        $location.path('/talent/');
                    } else if (response.roles[0] === 'freelancer') {
                        $location.path('/searchJob/');
                    } else if (response.roles[0] === 'admin') {
                        $location.path('/categories');
                    } else {
                        $location.path('/');
                    };

                    // redirect to the email verification page
                    // $location.path('/user/email-verification');
                }).error(function(response) {
                    $scope.error = response.message;
                });
            } else {
                $scope.error = 'Password mismatch';
            };
        };

        function signupFreelancer() {
            if ($scope.credentials.password === $scope.credentials.confirmPassword) {
                $http.post('/auth/signup/freelancer', $scope.credentials).success(function(response) {
                    // If successful we assign the response to the global user model

                    //without enail verification
                    resetBackgroundImage();
                    $scope.authentication.user = response;
                    if (response.roles[0] === 'client') {
                        // console.log(response.roles[0]);
                        $location.path('/talent/');
                    } else if (response.roles[0] === 'freelancer') {
                        $location.path('/settings/profile/true');
                    } else if (response.roles[0] === 'admin') {
                        $location.path('/categories');
                    } else {
                        $location.path('/');
                    };

                    // redirect to the email verification page
                    // $location.path('/user/email-verification');

                }).error(function(response) {
                    $scope.error = response.message;
                });
            } else {
                $scope.error = 'Password mismatch';
            };
        };
        $scope.signin = function() {
            $http.post('/auth/signin', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;
                // And redirect to the index page
                if (response.roles[0] === 'client') {
                    $location.path('/talent/');
                    location.reload();
                } else if (response.roles[0] === 'freelancer') {
                    $location.path('/searchJob/');
                    location.reload();
                } else if (response.roles[0] === 'admin') {
                    $location.path('/categories');
                    location.reload();
                } else {
                    $location.path('/');
                };
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
        $scope.showIndividual = function() {
            $scope.isIndividual = true;
            $scope.isCompany = false;

        };
        $scope.showCompany = function() {
            $scope.isIndividual = false;
            $scope.isCompany = true;

        };
        $scope.wantToHire = function() {

            $scope.hire = true;
            $scope.work = false;

        };
        $scope.wantToWork = function() {
            $scope.hire = false;
            $scope.work = true;

        };
        $scope.getListOfCities = function() {
            $http.get('/city/list')
                .success(function(response) {
                    if (!$scope.credentials.city || $scope.credentials.city == '') {
                        $scope.credentials.city = response[0].name;
                    }
                    $scope.getLocationsByCityId($scope.credentials.location);
                    $scope.cities = response;
                });
        };

        $scope.getLocationsByCityId = function(location) {
            $http.get('/city/getLocationsByCityId/' + $scope.credentials.city)
                .success(function(response) {
                    if (!location || location === '') {
                        if (response[0]) {
                            // $scope.credentials.location = response[0].name;
                        };
                    }
                    $scope.locations = response;
                });
        };

        $scope.updateUserRoles = function(chooseMembership) {
            $scope.user = $scope.authentication.user;
            $scope.user.roles = [chooseMembership.membership];
            $http.post('/user/update-role/' + $scope.user._id + '/' + chooseMembership.username + '/' + chooseMembership.membership + '/' + chooseMembership.country + '/' + chooseMembership.city + '/' + chooseMembership.location).success(function(response) {
                $scope.authentication.user = response;
                if (response.roles[0] == 'freelancer') {
                    $location.path('/searchJob/');
                } else if (response.roles[0] == 'client') {
                    $location.path('/talent/');
                };
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.openForgotPassword = function() {
            // console.log("asfd");
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/users/views/partials/forgot-password-popup-client-view.html',
                controller: 'ForgotPasswordCtrl',
                size: 'lg',
                resolve: {
                    Authentication: function() {
                        return Authentication;
                    }
                }
            });
            modalInstance.result.then(function(returnedInput) {
                location.reload();
            }, function() {
                // dismissed with cancel button
            });

        };



    }
]);

angular.module('users').controller('ForgotPasswordCtrl', function($scope, $http, $modalInstance, $modal, Authentication) {
    $scope.askForPasswordReset = function() {
        $scope.success = $scope.error = null;

        $http.post('/auth/forgot', $scope.credentials).success(function(response) {
            // Show user success message and clear form
            $scope.credentials = null;
            $scope.success = response.message;

        }).error(function(response) {
            // Show user error message and clear form
            $scope.credentials = null;
            $scope.error = response.message;
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});