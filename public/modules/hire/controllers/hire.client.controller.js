'use strict';

angular.module('hire').controller('HireController', ['$rootScope', '$scope','$http', '$stateParams', '$location', 'Categories', 'Subcategories','Skills',
	function($rootScope, $scope, $http, $stateParams, $location, Categories, Subcategories, Skills) {
		// Controller Logic
		// ...
        $scope.currentState = 'Everyone';
        $scope.pageSize = 10;
        $scope.defaultPage = 1;
        $scope.page = 1;
        $scope.totalUsers = 0;

        $scope.bcCategory = '';
        $scope.bcSubcategory = '';

        $scope.bcCity = '';
        $scope.bcLocation = '';

		$scope.loadInfo = function(){
            $scope.categories = Categories.query();
            $scope.skills = Skills.query();
            $scope.subcategories = Subcategories.query();
        };

		$scope.initList = function(){
            if($stateParams.query) {
                $http.post('/browse-freelancer', {
                    query: $stateParams.query
                }).
                success(function(data, status, headers, config) {
                    $scope.userList = data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }else if ($stateParams.skillId) {
                $scope.searchSkillById($stateParams.skillId);
            }else if ($stateParams.subcategoryId) {
                // $scope.searchBySubcategory($stateParams.subcategoryId);
                $scope.filterUsers('', $stateParams.subcategoryId, '', '', '', '', '', '', '', '', $scope.pageSize, $scope.page);
            }else {
                // $scope.loadAllFreelancers();
                $scope.filterUsers('', '', '', '', '', '', '', '', '', '', $scope.pageSize, $scope.page);
            };
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
        $scope.loadAllFreelancers = function(){
            $http.get('/users/search/freelancer').
                success(function(data) {
                   $scope.userList = data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
            });
        };
        $scope.searchBySkills = function(){
            $scope.searchSkillById($scope.selectedSkill.originalObject._id);    
        };
        $scope.searchSkillById = function(skillId){
            $http.get('/skill/users/'+skillId).
                success(function(data, status, headers, config) {
                    var userFromSkills = new Array();
                    for(var i = 0; i<data.length;i++){
                        userFromSkills.push(data[i].user);
                    }
                    $scope.userList = userFromSkills;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            $scope.querySkill = Skills.get({ 
                        skillId: skillId
                    });
        };
		$scope.search = function() {
           $http.post('/browse-freelancer', {
                query: this.query
            }).
            success(function(data, status, headers, config) {
                $scope.userList = data;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
        $scope.browseTalent = function(query){
            if(query){
                $location.path('/talent/'+query);
            }else{
                $location.path('/talent/');
            }            
            // $location.replace();
        }
        $scope.filterUsers = function(selectedCategory, selectedSubcategory, selectedCity, selectedLocation, atleastFeedback5, atleastFeedback4, atleastFeedback3, atleastReviews5, atleastReviews4, atleastReviews3, pageSize, page){
            console.log(pageSize);
            console.log(page);
            $scope.isloading= true;
           var selectedAtleasetFeedback = '0';
           var selectedAtleastReviews = '0';
           if(atleastFeedback3){
                selectedAtleasetFeedback = '3';
           }else if(atleastFeedback4){
                selectedAtleasetFeedback = '4';
           }else if(atleastFeedback5){
                selectedAtleasetFeedback = '5';
           };
           if(atleastReviews3){
                selectedAtleastReviews = '3';
           }else if(atleastReviews4){
                selectedAtleastReviews = '4';
           }else if(atleastReviews5){
                selectedAtleastReviews = '5';
           };

           $http.get('/user/filter-users',{
                        params: { categoryId: selectedCategory, subcategoryId:selectedSubcategory, city:selectedCity, location:selectedLocation, atleastFeedback:selectedAtleasetFeedback, atleastReviews: selectedAtleastReviews, pageSize: pageSize, page: page}
                }).
            success(function(data, status, headers, config) {
                $scope.userList = data.users;
                $scope.totalUsers = data.count; 
                $scope.isloading= false;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.isloading= false;
            });
        };

        $scope.searchFilter = function(searchType) {
            $http.get('/users/search/'+searchType).
                success(function(data, status, headers, config) {
                    console.log(data);
                    $scope.userList = data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
           
        };

        $scope.searchByCategory = function(catId) {
            $scope.selectedCategory = catId;
            $http.get('/users/search/category/'+catId).
            success(function(data, status, headers, config) {
                $scope.userList = data;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
           
        };
        $scope.searchBySubcategory = function(subCatId) {
                $http.get('/users/search/subcategory/'+subCatId).
                success(function(data, status, headers, config) {
                    $scope.userList = data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
           
        };

        $scope.searchByRating = function(requiredRating){
            $http.get('/user/search-by-rating/'+requiredRating).
                success(function(data, status, headers, config) {
                    $scope.userList = data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

        };

        $scope.searchByReviews = function(reviewCount){
            $http.get('/user/search-by-reviews/'+reviewCount).
                success(function(data, status, headers, config) {
                    $scope.userList = data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        };

        $scope.searchFreelancersByLocation = function(searchCity, searchLocation){
            $http.get('/user/search-by-location/'+searchCity+'/'+searchLocation).
            success(function(data, status, headers, config) {
                $scope.userList = data;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };

        $scope.loadSubcategories = function(){
            $http.get('/subcategories').
                success(function(data) {
                    console.log(data);
                    $scope.subcategories = data;
                }).
                error(function(data) {
                    console.log(data);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        };
         $scope.getSkillsByCategoryId = function(categoryId){
            if (categoryId) {
                $http.get('/skills/by-category-id/'+categoryId).
                success(function(response) {
                    $scope.skills = response;
                    // console.log(response);
                }).
                error(function(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }else{
                $scope.skills = Skills.query();
            };
          

        };
        $scope.setState = function(state){
            $scope.currentState = state;
        }
        $scope.listAllCities = function(){
            $http.get('/city/list')
                    .success(function(response) {
                        
                        $scope.searchCity = "0";
                        //$scope.listLocationsByCityId($scope.searchCity);
                        $scope.cities = response;
                    });
        };
        $scope.listLocationsByCityId = function(city){
            if(city !== "0"){
                $http.get('/city/getLocationsByCityId/' + city)
                    .success(function(response) {
                        $scope.searchLocation = "0";
                        $scope.locations = response;

                        
                        // console.log($scope.searchLocation);
                        // console.log($scope);
                    });
            };
        };
        
        $scope.getBcCategory = function(selectedCategory){
            for(var ind in $scope.categories){
                if($scope.categories[ind]._id === selectedCategory){
                    $scope.bcCategory = $scope.categories[ind].name;
                }
            }
        };
        $scope.getBcSubcategory= function(selectedSubcategory){
            for(var ind in $scope.subcategories){
                if($scope.subcategories[ind]._id === selectedSubcategory){
                    $scope.bcSubcategory = $scope.subcategories[ind].name;
                }
            }
        };
        $scope.getBcCity = function(city){

            $scope.bcCity = city;
        };
        $scope.getBcLocation = function(location){

            $scope.bcLocation = location;
        };
    }
]);

