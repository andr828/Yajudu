'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$stateParams', '$location', '$state','$modal', 'Users', 'Authentication', 'lodash', 'Skills', 'Categories', 'Subcategories',
    function($scope, $http, $stateParams, $location, $state, $modal, Users, Authentication, lodash, Skills, Categories, Subcategories) {
        $scope.user = Authentication.user;
        $scope.authentication = Authentication;
        $scope.skills = null;
        $scope.selectedSkill = null;
        $scope.userSkills = [];
        $scope.$state = $state;
        $scope.isVisitor = false;
        
        if ($stateParams.userId && $stateParams.userId!=='') {
            if ($stateParams.userId !== Authentication.user._id) {
                $scope.user = {};
            };
        };        
        // If user is not signed in then redirect back home
        // if (!$scope.user) $location.path('/');
        $scope.authAdmin = function(){
            if (Authentication.user && Authentication.user.roles && Authentication.user.roles[0] === 'admin' ) {
                //Allow user to view this page
            }else{
                $location.path('/');
                $location.replace();
            };
        };
         $scope.auth = function(){
            if (Authentication.user && Authentication.user.roles && Authentication.user.roles[0] === 'admin' ) {
                //Allow user to view this page
            }
            else if ($scope.authentication.user.roles && $scope.authentication.user.roles[0] === 'client' ) {
                //Allow user to view this page
            }
            else if($scope.authentication.user.roles && $scope.authentication.user.roles[0] === 'freelancer'){
                //Allow admin to view this page   
            }
            else{
                $location.path('/');
                $location.replace();
            };
        };
        $scope.initForm = function(){
            $scope.categories = Categories.query();
            // $scope.loadSubcategories($scope.user.subcategory);
            $scope.subcategories = Subcategories.query();
            $scope.getListOfCities();
            $scope.displayName = $scope.user.displayName;
            if ($stateParams.isFirstVisit === 'true') {
                $scope.isFirstVisit = true;
            }else{
                $scope.isFirstVisit = false;
            };
        };
        $scope.loadAllUsersForModeration = function(){
             $http.get('/users/load/allusers').
                success(function(data) {
                   $scope.userList = data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
            });
        };

        $scope.loadAllInterestedUsers = function(){
             $http.get('/users/load/interested-users').
                success(function(data) {
                    console.log(data);
                   $scope.interestedUserList = data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
            });
        };
        $scope.initUserProfile = function(){
            if ($stateParams.userId && $stateParams.userId!=='') {
                    
            }else{
                $stateParams.userId = $scope.user._id;
            };
            $scope.getHistory($stateParams.userId);
            $scope.loadSkills($stateParams.userId);
            if($scope.user && $stateParams.userId === $scope.user._id){
                $scope.isVisitor = false;
                $scope.user = Authentication.user;
            }else{
                $scope.isVisitor = true;
                $scope.getUserById($stateParams.userId);
                $scope.checkRelation($scope.user._id, $stateParams.userId);
            };
        };
        $scope.initEditSkill = function(){
            $scope.loadSkills($scope.user._id);
        };
        $scope.initSpecialities = function(){
            $scope.categories = Categories.query();
            $scope.subcategories = Subcategories.query();
        };
        $scope.loadCountries = function(){
            $http.get('/countries/').
              then(function(response) {
                $scope.countries = response.data;
              }, function(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              
            });
        };
         $scope.getUserById = function(userId){
            $http.get('/users/getUserById/'+userId).success(function(response) {
                $scope.user = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
        $scope.getHistory = function(userId){
            $http.get('/feedback/history/'+userId).success(function(response){
                  $scope.history = response;  
                  $scope.getCountClients(userId);
            }).error(function(response){
                $scope.error = response.message;
            });
        };
        $scope.getCountClients = function(userId){
            $http.get('/feedback/clients-count/'+ userId).
              then(function(response) {
                    $scope.totalClients = response.data;
                    $scope.repeatRate = (($scope.history.length-$scope.totalClients)/$scope.history.length)*100;
                
              }, function(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
        }
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

        // Update a user profile
        $scope.updateUserProfile = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                var user = new Users($scope.user);
                user.displayName = $scope.displayName;
                user.$update(function(response) {
                    if($scope.file != null){
                        $http.post('/users/upload/profilepicture', {
                            file: $scope.file,
                            userId:response._id
                        }).success(function(profilePictureName) {
                            $scope.success = true;
                            response.profilePicture = profilePictureName.filename;
                            Authentication.user = response;
                            $scope.user = Authentication.user;

                            location.reload();

                        }).error(function(response) {
                            $scope.error = response.message;
                        });
                    }else{
                        $scope.success = true;
                        Authentication.user = response;
                        $scope.user = Authentication.user;
                    }
                }, function(response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };
        $scope.saveSkill = function() {
            $scope.success = $scope.error = null;
            var idx = lodash.findIndex($scope.userSkills, function(obj) {
                return obj._id === $scope.selectedSkill.originalObject._id;
            });
            if (idx < 0) {
                $scope.userSkills.push($scope.selectedSkill.originalObject);
                $http.put('/users/skills', {
                    skillId: $scope.selectedSkill.originalObject._id
                }).success(function(response) {
                    $scope.success = true;
                    lodash.remove($scope.skills, function(obj) {
                        return obj._id === $scope.selectedSkill.originalObject._id;
                    });
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }

        };
        $scope.loadSkills = function(userId) {
            $scope.skills = Skills.query();    
            $http.get('/users/skills/'+userId).success(function(response) {
                $scope.success = true;
                $scope.userSkills = [];
                for (var i = 0; i < response.length; i++) {
                    if (response[i].skill !== null) {
                        $scope.userSkills.push(response[i].skill);
                    }
                }
                lodash.remove($scope.skills, function(obj) {
                    for (i = 0; i < $scope.userSkills.length; i++) {
                        if ($scope.userSkills[i]._id === obj._id) {
                            return true;
                        }
                    }
                    return false;
                });
                // $scope.userSkills = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
           
        };

        // $scope.loadFeedbacksBySkill = function(skillId){
        //     $scope.feedbacks = [];
        //     $http.get('/feedback/history/'+ $scope.user._id).
        //       then(function(response) {
        //         var allFeedbacks = response.data;
        //         for(var feedback in allFeedbacks){
        //             console.log(feedback);
        //             if(feedback.job && feedback.job.skills.indexOf(skillId)){
        //                 $scope.feedbacks.push(feedback);
        //             }
        //         }
        //         console.log($scope.feedbacks);
        //       }, function(response) {
        //         console.log(response);
        //         // called asynchronously if an error occurs
        //         // or server returns response with an error status.
        //       });
        // };

        $scope.SavePrivacy = function(){
            var user = new Users($scope.user);
            user.showProfile = this.showProfile;
            user.enableIndexing = this.enableIndexing;
            user.enableJobPostIndexing = this.enableJobPostIndexing;
            user.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;
                }, function(response) {
                    $scope.error = response.data.message;
                });
        };
        // Uplaod files.
        $scope.uploadFile = function() {
            $scope.isloading= true;
            $http.post('/users/upload/file', {
                file: $scope.file
            }).success(function(response) {
                $scope.isloading= false;
                location.reload();
                // $scope.user=response;
                $scope.success = true;
            }).error(function(response) {
                $scope.isloading= false;
                $scope.error = response.message;
            });
        };
        $scope.deleteFile = function(fileNameTodelete) {
            $scope.isloading= true;
            $http.put('/users/delete/file/'+fileNameTodelete).success(function(response) {
                $scope.isloading= false;
                location.reload();
                // $scope.user=response;
            }).error(function(response) {

                // $scope.error = response.message;
            });
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
        // Remove skills
        $scope.removeCurrentSkill = function(skill){
            console.log(skill._id);
            $http.delete('/users/skills', {
               params: {skillId : skill._id}

            }).success(function(response) {
                // If successful show success message and clear form
                lodash.remove($scope.userSkills, function(obj) {
                        return obj._id === skill._id;
                    });
                console.log(response);
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
        $scope.loadSubcategories = function(subcategory) {
            // var cat_id = this.category ? this.category : $scope.job.category;
            if (this.user.category) {
                $http.get('/subcategories/category/' + this.user.category)
                    .success(function(response) {
                        if(response.length === 0){
                            $scope.user.subcategory = null;   
                        }else{
                            if (subcategory == '') {
                                $scope.user.subcategory = response[0]._id;
                            };
                        } 
                        $scope.subcategories = response;
                    });
            }
        };
        $scope.getListOfCities = function(){
            $http.get('/city/list')
                    .success(function(response) {
                        if(!$scope.user.city || $scope.user.city == '')
                        {
                            $scope.user.city = response[0].name;
                        }
                        $scope.getLocationsByCityId($scope.user.location);
                        $scope.cities = response;
                    });
        };
        $scope.getLocationsByCityId = function(location){
            $http.get('/city/getLocationsByCityId/' + $scope.user.city)
                    .success(function(response) {
                        if(!location || location === '')
                        {
                            if(response[0]){
                                // $scope.user.location = response[0].name;
                            };
                        }
                        $scope.locations = response;
                    });
        };
        $scope.checkRelation = function(userId, visitorId){
            if(!userId || userId ==='' || !visitorId || visitorId===''){
                return false;
            };
            $http.get('/users/check-relation/'+userId+'/'+visitorId).success(function(response) {
                if(response && response.length){
                    $scope.hasRelation = true;
                }else{
                    $scope.hasRelation = false;
                };
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
        $scope.openChooseSpecialities = function(){
             var modalInstance = $modal.open({
                  animation: $scope.animationsEnabled,
                  templateUrl: 'modules/users/views/partials/choose-specialities-popup-client-view.html',
                  controller: 'chooseSpecialitiesCtrl',
                  size: 'lg',
                  resolve: {
                    user: function () {
                      return $scope.user;
                    }
                  }
                });
             modalInstance.result.then(function (returnedInput) {
                     location.reload();  
                   }, function() {
                     // dismissed with cancel button
                   });

        };
        $scope.openInviteUser = function(){
             var modalInstance = $modal.open({
                  animation: $scope.animationsEnabled,
                  templateUrl: 'modules/users/views/partials/invite-user-view-popup-client.html',
                  controller: 'InviteUserCtrl',
                  size: 'lg',
                  resolve: {
                    user: function () {
                      return $scope.user;
                    }
                  }
                });
             modalInstance.result.then(function (returnedInput) {
                     location.reload();  
                   }, function() {
                     // dismissed with cancel button
                   });

        };
        $scope.setState = function(state){
            $scope.currentState = state;
        };
        $scope.openEditUserForAdminApproval = function(user){
             var modalInstance = $modal.open({
                  animation: $scope.animationsEnabled,
                  templateUrl: 'modules/users/views/partials/profile-edit-admin-view-popup-client.html',
                  controller: 'AdminEditUserCtrl',
                  size: 'lg',
                  resolve: {
                    currUser: function () {
                      return user;
                    }
                  }
                });
             modalInstance.result.then(function (returnedInput) {
                     location.reload();  
                   }, function() {
                     // dismissed with cancel button
                   });

        };
        $scope.openSelectAvatar = function(user){
             var modalInstance = $modal.open({
                  animation: $scope.animationsEnabled,
                  templateUrl: 'modules/users/views/partials/select-avatar-popup-client-view.html',
                  controller: 'SelectAvatarCtrl',
                  size: 'lg',
                  resolve: {
                    currUser: function () {
                      return user;
                    }
                  }
                });
             modalInstance.result.then(function (returnedInput) {
                     location.reload();  
                   }, function() {
                     // dismissed with cancel button
                   });

        };
    }
]);
angular.module('users').controller('SelectAvatarCtrl', function ($scope, $http, $modalInstance, Authentication, Users, currUser) {
    $scope.selectedAvatar = "";
    $scope.avatars = [];

    for (var i = 1; i < 25; i++) {
        $scope.avatars.push("avatars/avatar"+i+".png");
    };
    $scope.selectCurrentAvatar = function(avatar){
        $scope.selectedAvatar = avatar;
    };
  $scope.user = currUser;
  $scope.select = function () {
    if(confirm('Are you sure you want to select this avatar?')){
        $scope.user.profilePicture = $scope.selectedAvatar;
        $modalInstance.dismiss('cancel');
        location.reload();
          var user = new Users($scope.user);
                user.$update(function(response) {
                        $scope.success = true;
                        Authentication.user = response;
                        $scope.user = Authentication.user;
                }, function(response) {

                });
   }
 };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
angular.module('users').controller('AdminEditUserCtrl', function ($scope, $http, $modalInstance, Users, currUser) {
  
  $scope.user = currUser;
  $scope.save = function () {
    if(confirm('Are you sure you want to save this?')){
       $scope.success = $scope.error = null;
       var user = new Users($scope.user);
       $http.put('/users/update-by-admin', {
                userToUpdate: $scope.user
            }).success(function(response1) {
            if($scope.file != null){
                $http.post('/users/upload/profilepicture', {
                    file: $scope.file,
                    userId:response1._id
                }).success(function(response1) {
                    $scope.success = true;
                    $modalInstance.dismiss('cancel');
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }else{
                $scope.success = true;
                $modalInstance.dismiss('cancel');
            }
            }).error(function(response) {
                $scope.error = response.message;
            });
   }
 };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

angular.module('users').controller('chooseSpecialitiesCtrl', function ($scope, $http, $modalInstance, $modal, Users, lodash, Categories, Subcategories, user) {
  

  $scope.categoriesSelection=[];
  $scope.subcategoriesSelection=[];
  Categories.query().$promise.then(function(categories) {
            $scope.categories = categories;
            for(var userCategory of user.categories){
                for(var value of $scope.categories){
                    if (userCategory === value._id) {
                        $scope.categoriesSelection.push(value);
                    };
                }
              }
           });
  Subcategories.query().$promise.then(function(subcategories) {
            $scope.subcategories = subcategories;
            for(var userSubcategory of user.subcategories){
            for(var value of $scope.subcategories){
                    console.log(userSubcategory+"  ::  "+value);
                    if (userSubcategory === value._id) {
                        $scope.subcategoriesSelection.push(value);
                    };
                }
              }
           });
  $scope.user = user;
  $scope.toggleSubcategoriesSelection = function toggleSelection(subcategory, category) {
     var subcatergoryIdx = $scope.subcategoriesSelection.indexOf(subcategory);

     var catergoryIdx = lodash.findIndex($scope.categoriesSelection, function(obj) {
                return obj._id === subcategory.category._id;
            });

     // is currently selected
     if (subcatergoryIdx > -1) {
       $scope.subcategoriesSelection.splice(subcatergoryIdx, 1);
       var idx = lodash.findIndex($scope.subcategoriesSelection, function(obj) {
                return obj.category._id === subcategory.category._id;
            });
       if(idx<0){
            $scope.categoriesSelection.splice(catergoryIdx, 1);
       };
     }
     // is newly selected
     else {
       $scope.subcategoriesSelection.push(subcategory);
       if(catergoryIdx === -1){
            $scope.categoriesSelection.push(category);
       }
     }
   };

   $scope.addAllSubcategories = function(thisCheckBox, category){
        if(thisCheckBox){
            // Add all subcategories
            for(var subcategory of $scope.subcategories) {
                if(category._id === subcategory.category._id && $scope.subcategoriesSelection.indexOf(subcategory)<0){
                    $scope.subcategoriesSelection.push(subcategory);           
                }
            };
            if($scope.categoriesSelection.indexOf(category)<0){
                $scope.categoriesSelection.push(category);
            }
        }else{
            // Remove all subcategories
            for(var subcategory of $scope.subcategories) {
                if(category._id === subcategory.category._id && $scope.subcategoriesSelection.indexOf(subcategory)>-1){
                    $scope.subcategoriesSelection.splice($scope.subcategoriesSelection.indexOf(subcategory), 1);          
                }
            };
            if($scope.categoriesSelection.indexOf(category)>-1){
                $scope.categoriesSelection.splice($scope.categoriesSelection.indexOf(category), 1);
            }
        };
   };

   $scope.save = function () {
    $scope.user.categories = [];
    $scope.user.subcategories = [];
    for(var category of $scope.categoriesSelection) {
        $scope.user.categories.push(category._id);
    };
    for(var subcategory of $scope.subcategoriesSelection) {
        $scope.user.subcategories.push(subcategory._id);
    };
    var user = new Users($scope.user);
                user.$update(function(response) {
                    location.reload();
                }, function(response) {
                    $scope.error = response.data.message;
                });
    $modalInstance.dismiss('cancel');
  };
  $scope.cancel = function () {
    $scope.categoriesSelection = [];
    $scope.subcategoriesSelection = [];    
    $modalInstance.dismiss('cancel');
  };
});




angular.module('users').controller('InviteUserCtrl', function ($scope, $http, $modalInstance, $modal, Users, lodash, user) {
  $scope.user = user;
  $scope.selectedJobId ='';
 $http.get('/jobs/active-jobs-by-user-id').
                success(function(data) {
                   $scope.approvedJobs = data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
            });
  $scope.invite = function (selectedJobId) {
    if (selectedJobId !== '') {
        $http.post('/user/send-invite', {
                            invitedUserId: $scope.user._id,
                            jobId: selectedJobId
                        }).success(function(response) {
                            

                        }).error(function(response) {
                            $scope.error = response.message;
                        });
        $modalInstance.dismiss('cancel');
    };
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});