'use strict';

// Jobs controller
angular.module('jobs').controller('JobsController', ['$scope', '$http', '$stateParams', '$location', '$modal', 'Authentication', 'Jobs', 'Categories', 'Subcategories', 'Skills', 'Proposals', 'lodash',
    function($scope, $http, $stateParams, $location, $modal, Authentication, Jobs, Category, SubCategory, Skills, Proposals, lodash) {
        $scope.authentication = Authentication;
        $scope.subcategories = null;
        $scope.categories = null;
        $scope.selectedSkill = null;
        $scope.selectedSkills = [];
        $scope.query = '';
        //$scope.currentState = 'All Categories';
        /****Temp***/
        $scope.rating1 = 5;
        $scope.rating2 = 2;
        $scope.isReadonly = true;
        $scope.searchText = '';
        $scope.pageSize = 10;
        $scope.defaultPage = 1;
        $scope.page = 1;
        $scope.totalJobs = 0;

        $scope.bcCategory = '';
        $scope.bcSubcategory = '';

        $scope.bcCity = '';
        $scope.bcLocation = '';

        $scope.sortBy = "Asc";
        /*
        PostedOnDesc
        */
        $scope.auth = function() {
            if ($scope.authentication.user.roles && $scope.authentication.user.roles[0] === 'client') {
                //Allow user to view this page
            } else if ($scope.authentication.user.roles && $scope.authentication.user.roles[0] === 'admin') {
                //Allow admin to view this page   
            } else {
                $location.path('/');
                $location.replace();
            };
        };
        $scope.authAdmin = function() {
            if ($scope.authentication.user.roles && $scope.authentication.user.roles[0] === 'admin') {
                //Allow user to view this page
            } else {
                $location.path('/');
                $location.replace();
            };
        };
        $scope.rateFunction = function(rating) {
            console.log('Rating selected: ' + rating);
        };
        // Create new Job
        $scope.loadCountries = function() {
            $http.get('/countries/').
            then(function(response) {
                $scope.countries = response.data;
            }, function(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.

            });
        };
        $scope.save = function() {
            console.log("saving....");
            if (!$scope.job.hoursRequired) {
                $scope.job.hoursRequired = 0;
            }
            if (!$scope.job.category || $scope.job.category === "") {
                $scope.error = "Please select a Category that best describes your need.";
            } else if (!$scope.job.subcategory || $scope.job.subcategory === "") {
                $scope.error = "Please select a Sub Category that best describes your need";
            } else {
                var job = $scope.job;
                job.status = 'Draft';
                job.isPublicPosting = job.isPublicPosting === 'public';
                job.visibilityDuration = parseInt(job.visibilityDuration);
                // Redirect after save
                if ($stateParams.jobId) {
                    job.$update(function() {
                        if ($stateParams.action && $stateParams.action === 'renew') {
                            $location.path('jobs-review/' + job._id + '/renew');
                        } else {
                            $location.path('jobs-review/' + job._id);
                        }
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                } else {
                    job.$save(function(response) {
                        $location.path('jobs-review/' + response._id);
                        $scope.name = '';
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                }
            }


        };


        $scope.remove = function(job) {
            if (job) {
                job.$remove();

                for (var i in $scope.jobs) {
                    if ($scope.jobs[i] === job) {
                        $scope.jobs.splice(i, 1);
                    }
                }
            } else {
                $scope.job.$remove(function() {
                    $location.path('jobs');
                });
            }
        };



        // Find a list of Jobs
        $scope.find = function() {
            $scope.jobs = Jobs.query();
        };
        $scope.caculateStats = function() {

            $http.get('/jobs/jobs-by-user-id')
                .success(function(jobs) {
                    $scope.awardedJobs = lodash.filter(jobs, { isAwarded: true });
                    $scope.jobs = jobs;
                    $scope.awardRatio = ($scope.awardedJobs.length * 100) / $scope.jobs.length;
                    $scope.ratedJobs = lodash.filter(jobs, { isRated: true });
                    $scope.getReceivedFeedbacks();
                }).error(function(response) {
                    $scope.error = response.message;
                });
        };
        $scope.getReceivedFeedbacks = function() {
            $http.get('/feedback/list')
                .success(function(response) {
                    $scope.receivedFeedbacks = lodash.filter(response, { isByClient: false });
                }).error(function(response) {
                    $scope.error = response.message;
                });
        };
        $scope.search = function() {
            $http.post('/browse-jobs', {
                query: this.query
            }).
            success(function(data, status, headers, config) {
                $scope.jobs = lodash.sortByOrder(data, ['created'], [true]);
                // $scope.jobs = data;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
        $scope.ToggleSearch = function() {
            if ($scope.sortBy == "Asc") {
                $scope.sortBy = "Desc";
                $scope.jobs = lodash.sortByOrder($scope.jobs, ['created'], [false]);
            } else {
                $scope.sortBy = "Asc";
                $scope.jobs = lodash.sortByOrder(data, ['created'], [true]);
            }
        }
        $scope.browseJobsSearch = function(query) {
            if (query) {
                $location.path('/searchJob/' + query);
            } else {
                $location.path('/searchJob/');
            };
        };
        // Find existing Job
        $scope.findOne = function() {

            $scope.isAdmin = $scope.authentication.user && $scope.authentication.user.roles[0] === 'admin';
            $scope.job = Jobs.get({
                jobId: $stateParams.jobId
            });

            $scope.job.$promise.then(function(data) {
                if ($stateParams.action && $stateParams.action === 'renew') {
                    $scope.actionHeading = 'Renew';
                }
                if (!$scope.authentication.user && !$scope.job.isSearchable) {
                    $location.path('/');
                    $location.replace();
                } else {
                    $scope.addedskills = [];
                    for (var i = 0; i < $scope.job.skills.length; i++) {
                        $scope.addedskills.push($scope.job.skills[i]);
                    }
                    $scope.getSkillsByCategoryId($scope.job.category);
                    // Checking is job expirted
                    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    console.log(data)
                    var firstDate = new Date(data.ValidTill);
                    var secondDate = new Date(firstDate);
                    secondDate.setDate(secondDate.getDate());
                    var currentDate = new Date();
                    var dayToExpire = Math.round((secondDate.getTime() - currentDate.getTime()) / (oneDay));
                    if (dayToExpire < 0) {
                        $scope.isJobExpired = true;
                    } else {
                        $scope.isJobExpired = false;
                    }
                    $scope.daysToExpire = Math.abs(dayToExpire);
                    $scope.job.isPublicPosting = data.isPublicPosting ? 'public' : 'private';
                    if (data.isSearchable) {
                        $scope.isSearchable = true;
                    } else {
                        $scope.isSearchable = false;
                    }
                    if (data.user._id === $scope.authentication.user._id) {
                        $scope.canApproveProposal = true;
                    } else {
                        $scope.canApproveProposal = false;
                    }
                    $scope.job.visibilityDuration = data.visibilityDuration.toString();
                    if (data.category) {
                        $http.get('/subcategories/category/' + data.category)
                            .success(function(response) {
                                if (response.length === 0) {
                                    $scope.job.subcategory = null;
                                }
                                $scope.subcategories = response;
                            });
                    }
                    if ($scope.authentication.user) {
                        $http.get('/feedback/get/' + $scope.job.user._id + '/' + $scope.authentication.user._id + '/' + $scope.job._id)
                            .success(function(response) {
                                $scope.givenFeedback = response;
                            }).error(function(response) {
                                $scope.error = response.message;
                            });
                    };

                    $scope.getListOfCities();
                };

            });
            $http.get('/proposals/listByJobId/' + $stateParams.jobId)
                .success(function(response) {
                    if (response.length > 0) {
                        $scope.proposals = response;
                    }
                });



        };
        $scope.initForm = function() {
            $scope.categories = Category.query();
            if ($stateParams.jobId) {
                if ($stateParams.action && $stateParams.action === 'renew') {
                    $scope.actionHeading = 'Renew';
                }
                $scope.findOne();
            } else {
                $scope.job = new Jobs();
                $scope.job.skills = [];
                $scope.addedskills = [];

                //$scope.skills = Skills.query();
                $scope.job.chargingType = 'Fixed Price';
                $scope.job.isPublicPosting = 'public';
                $scope.job.visibilityDuration = 15;
                $scope.job.jobStartOn = 'Immediate';
                $scope.isSearchable = 'true';
                $scope.isFormInit = 'true';
                $scope.job.country = 'Qatar';
                $scope.getListOfCities();
            }

        };

        $scope.initMenu = function() {
            $scope.categories = Category.query();
            $scope.allSubcategories = SubCategory.query();
            $scope.skills = Skills.query();
        };

        $scope.loadSubcategories = function() {
            // var cat_id = this.category ? this.category : $scope.job.category;
            if (this.job.category) {
                $http.get('/subcategories/category/' + this.job.category)
                    .success(function(response) {
                        if (response.length === 0) {
                            $scope.job.subcategory = null;
                        } else {
                            // $scope.job.subcategory = response[0]._id;
                            $scope.job.subcategory = null;
                        }
                        $scope.subcategories = response;
                    });
            } else {
                $scope.job.subcategory = null;
            }
        };
        $scope.loadAllSubcategories = function() {
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
        $scope.addSkill = function() {

            // if ($scope.job.skills.length < 5) {
            //     if ($scope.selectedSkill) {
            //         console.log($scope.selectedSkill.originalObject);
            //         $scope.job.skills.push($scope.selectedSkill.originalObject._id);
            //         $scope.addedskills.push($scope.selectedSkill.originalObject);
            //     }
            // }
            if ($scope.job.skills.length < 5) {
                if ($scope.selectedSkill) {
                    var id = $scope.selectedSkill[0];
                    var selectedSkill = lodash.filter($scope.skills, { _id: id });
                    if (selectedSkill && selectedSkill.length > 0) {
                        selectedSkill = selectedSkill[0];

                        $scope.job.skills.push(selectedSkill._id);
                        $scope.addedskills.push(selectedSkill);
                        //console.log($scope.selectedSkill[0]);
                        console.log(selectedSkill.name);

                    }

                }
            }

        };
        $scope.getSkillsByCategoryId = function(categoryId) {
            $http.get('/skills/by-category-id/' + categoryId).
            success(function(response) {
                $scope.skills = response;
                // console.log(response);
            }).
            error(function(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

        };
        $scope.updateJobStatus = function(status) {
            var job = $scope.job;
            job.status = status;
            job.created = Date.now();
            job.$update(function() {
                if (status === 'Approved' || status === 'Reject') {
                    $location.path('jobs-moderation');
                }
                $scope.success = 'Job posted successfully.';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.postedSince = function(dt) {
            // console.log("1-" + moment(dt).fromNow());
            // console.log("2-" + moment(dt).fromNow());
            return moment(dt).fromNow();
        }
        $scope.validTill = function(dt) {
            return moment(dt).fromNow();
        }
        $scope.loadApprovedJobs = function(currentState) {
            $scope.currentState = currentState;
            var a = moment([2007, 0, 29]);
            var b = moment([2007, 0, 28]);
            if ($stateParams.searchText !== undefined && $stateParams.searchText !== '') {
                $scope.query = $stateParams.searchText;
                $scope.search();
            } else if ($stateParams.skillId !== undefined && $stateParams.skillId !== '') {
                $scope.jobsBySkillId($stateParams.skillId);
            } else if ($stateParams.subcategoryId !== undefined && $stateParams.subcategoryId !== '') {
                // $scope.searchJobBySubcategory($stateParams.subcategoryId);
                $scope.filterJobs('', $stateParams.subcategoryId, '', '', $scope.pageSize, $scope.defaultPage);
            } else if ($stateParams.categoryId !== undefined && $stateParams.categoryId !== '') {
                // $scope.searchJobByCategory($stateParams.categoryId);
                $scope.filterJobs($stateParams.categoryId, '', '', '', $scope.pageSize, $scope.defaultPage);
            } else {
                // $http.get('/jobs-approved').
                // success(function(data, status, headers, config) {
                //     $scope.jobs = data;
                // }).
                // error(function(data, status, headers, config) {

                //     // called asynchronously if an error occurs
                //     // or server returns response with an error status.
                // });
                $scope.filterJobs('', '', '', '', $scope.pageSize, $scope.defaultPage);
            }
        };
        $scope.loadJobOpportunities = function() {
            var a = moment([2007, 0, 29]);
            var b = moment([2007, 0, 28]);
            $http.get('/job-opportunities').
            success(function(data, status, headers, config) {
                $scope.jobs = data;
            }).
            error(function(data, status, headers, config) {

                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
        $scope.jobsBySkillId = function(skillId) {
            $http.get('/jobs-by-skillId/' + skillId)
                .success(function(response) {
                    $scope.jobs = response;
                }).error(function(response) {

                });
            $scope.querySkill = Skills.get({
                skillId: $stateParams.skillId
            });
        };
        $scope.loadJobsForModeration = function() {
            // $scope.jobs = Jobs.query();


            $http.get('/job-moderations').
            success(function(data, status, headers, config) {
                $scope.modejobs = data;
                $scope.modejobsCount = data.length;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

            $http.get('/jobs-approved').
            success(function(data, status, headers, config) {
                $scope.livejobs = data;
                for (var i = 0; i < $scope.livejobs.length; i++) {
                    $scope.livejobs[i].created = new Date($scope.livejobs[i].created);
                    $scope.livejobs[i].created.setDate($scope.livejobs[i].created.getDate() + $scope.livejobs[i].visibilityDuration);
                }
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

            $http.get('/jobs-closed').
            success(function(data, status, headers, config) {
                $scope.closedjobs = data;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

            $http.get('/jobs-rated').
            success(function(data, status, headers, config) {
                $scope.ratedJobs = data;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

            $http.get('/jobs-rejected').
            success(function(data, status, headers, config) {
                $scope.rejectedJobs = data;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

        };

        $scope.removeSkill = function(skill) {
            $scope.addedskills.splice($scope.addedskills.indexOf(skill), 1);
            $scope.job.skills.splice($scope.job.skills.indexOf(skill._id), 1);
        };

        //Toggle Is SearchAble CheckBox
        $scope.toggleIsSearchAble = function() {
            if ($scope.isSearchable === 'true') {
                $scope.isSearchable = 'false';
                $scope.job.isSearchable = false;
            } else {
                $scope.isSearchable = 'true';
                $scope.job.isSearchable = true;
            }
        };
        $scope.toggleIsSearchAbleToFalse = function() {
            $scope.isSearchable = 'false';
            $scope.job.isSearchable = false;
        };
        $scope.redirectToProposalDetails = function(proposalId) {
            $location.path('job-proposal-review/' + proposalId);
        };
        $scope.searchJobByCategory = function(categoryId) {
            $scope.currentState = categoryId;
            $scope.selectedCategory = categoryId;
            $http.post('/browse-jobs-category/' + categoryId).
            success(function(data, status, headers, config) {
                $scope.jobs = data;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
        // $scope.searchJobBySubcategory = function(subcategoryId){
        //     $scope.currentState = subcategoryId;
        //    $http.post('/browse-jobs-subcategory/'+subcategoryId).
        //     success(function(data, status, headers, config) {
        //         $scope.jobs = data;
        //     }).
        //     error(function(data, status, headers, config) {
        //         // called asynchronously if an error occurs
        //         // or server returns response with an error status.
        //     });
        // };
        $scope.filterJobs = function(selectedCategory, selectedSubcategory, selectedCity, selectedLocation, pageSize, page) {
            $scope.query = '';
            $scope.isloading = true;
            $http.get('/browse-jobs-filter', {
                params: { categoryId: selectedCategory, subcategoryId: selectedSubcategory, city: selectedCity, location: selectedLocation, pageSize: pageSize, page: page }
            }).
            success(function(data, status, headers, config) {
                $scope.jobs = data.jobs;
                $scope.totalJobs = data.count;
                $scope.isloading = false;

            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.isloading = false;
            });
        };
        $scope.recentlyExpiredJobs = function() {
            $scope.bcCategory = '';
            $scope.bcSubcategory = '';

            $scope.bcCity = '';
            $scope.bcLocation = '';
            $http.get('/recently-expired-jobs').
            success(function(data, status, headers, config) {
                $scope.jobs = data;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
        $scope.searchJobBychargingType = function(jobType) {
            $scope.currentState = jobType;
            $http.post('/browse-jobs-chargingType/' + jobType).
            success(function(data, status, headers, config) {
                $scope.jobs = data;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
        $scope.searchJobsByLocation = function(searchCity, searchLocation) {
            console.log(searchCity);
            console.log(searchLocation);
            $http.get('/jobs/browse-jobs-location/' + searchCity + '/' + searchLocation).
            success(function(data, status, headers, config) {
                console.log(data);
                $scope.jobs = data;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
        $scope.openProposal = function(proposal) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/jobs/views/partials/proposal-view.client.view.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    proposal: function() {
                        return proposal;
                    }
                }
            });

        };

        $scope.openChatWindow = function(proposal) {
            $http.get('/messages/get/' + $scope.authentication.user._id + '/' + proposal.user._id + '/' + proposal.job)
                .success(function(response) {
                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'modules/jobs/views/partials/chat-view.client.view.html',
                        controller: 'ChatInstanceCtrl',
                        size: 'lg',
                        resolve: {
                            messages: function() {
                                return response;
                            },
                            recieverId: function() {
                                return proposal.user._id;
                            },
                            senderId: function() {
                                return $scope.authentication.user._id;
                            },
                            jobId: function() {
                                return proposal.job;
                            },
                            currProposalId: function() {
                                return proposal._id;
                            }
                        }
                    });

                }).error(function(response) {
                    $scope.error = response.message;
                });

        };

        $scope.openJobForAdminApproval = function(job) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/jobs/views/partials/jobs-review-popup-view.client.view.html',
                controller: 'AdminApproveJobCtrl',
                size: 'lg',
                resolve: {
                    job: function() {
                        return job;
                    }
                }
            });
            modalInstance.result.then(function(returnedInput) {
                location.reload();
            }, function() {
                // dismissed with cancel button
            });

        };

        $scope.giveFeedBack = function(proposal) {
            $http.get('/feedback/get/' + $scope.authentication.user._id + '/' + proposal.user._id + '/' + proposal.job)
                .success(function(response) {
                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'modules/jobs/views/partials/feedback-view-popup-view.client.view.html',
                        controller: 'GiveFeedBackCtrl',
                        size: 'lg',
                        resolve: {
                            proposal: function() {
                                return proposal;
                            },
                            byUser: function() {
                                return $scope.authentication.user;
                            },
                            givenFeedback: function() {
                                response.isByClient = true;
                                console.log(response);
                                return response;
                            },
                            jobBy: function() {
                                return $scope.job.user;
                            }
                        }
                    });
                    modalInstance.result.then(function(returnedInput) {
                        location.reload();
                    }, function() {
                        // dismissed with cancel button
                    });
                }).error(function(response) {
                    $scope.error = response.message;
                });

        };

        $scope.giveFeedBackToClient = function(proposal) {

            $http.get('/feedback/get/' + $scope.authentication.user._id + '/' + $scope.job.user._id + '/' + proposal.job)
                .success(function(response) {
                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'modules/jobs/views/partials/feedback-view-popup-view.client.view.html',
                        controller: 'GiveFeedBackCtrl',
                        size: 'lg',
                        resolve: {
                            proposal: function() {
                                return proposal;
                            },
                            byUser: function() {
                                return $scope.authentication.user;
                            },
                            givenFeedback: function() {
                                response.isByClient = false;
                                return response;
                            },
                            jobBy: function() {
                                return $scope.job.user;
                            }
                        }
                    });
                    modalInstance.result.then(function(returnedInput) {
                        location.reload();
                    }, function() {
                        // dismissed with cancel button
                    });
                }).error(function(response) {
                    $scope.error = response.message;
                });

        };

        $scope.viewHistory = function(proposal) {

            $http.get('/feedback/history/' + proposal.user._id)
                .success(function(response) {
                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'modules/jobs/views/partials/job-history-view-popup-view.client.view.html',
                        controller: 'viewHistoryCtrl',
                        size: 'lg',
                        resolve: {
                            history: function() {
                                console.log('Job History');
                                console.log(response);
                                return response;
                            },
                            proposal: function() {
                                return proposal;
                            }
                        }
                    });
                    modalInstance.result.then(function(returnedInput) {
                        location.reload();
                    }, function() {
                        // dismissed with cancel button
                    });
                }).error(function(response) {
                    $scope.error = response.message;
                });

        };

        $scope.showPortfolio = function(_user) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/jobs/views/partials/portfolio-view-popup-view.client.view.html',
                controller: 'portfolioCtrl',
                size: 'lg',
                resolve: {
                    User: function() {
                        return _user;
                    }
                }
            });
            modalInstance.result.then(function(returnedInput) {
                location.reload();
            }, function() {
                // dismissed with cancel button
            });

        };
        $scope.setState = function(state) {
            $scope.currentState = state;
        };
        $scope.loadCountForBadge = function() {
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
        $scope.countryChanged = function() {
            if ($scope.job.country === 'Qatar') {
                $scope.job.city = 'Doha';
                $scope.getLocationsByCityId('');
            } else {
                $scope.job.city = '';
                $scope.job.location = '';
            };
        };
        $scope.getListOfCities = function() {
            $http.get('/city/list')
                .success(function(response) {
                    if (!$scope.job.city || $scope.job.city == '') {
                        $scope.job.city = 'Doha';
                    }
                    $scope.getLocationsByCityId($scope.job.location);
                    $scope.cities = response;
                });
        };
        $scope.getLocationsByCityId = function(location) {
            $http.get('/city/getLocationsByCityId/' + $scope.job.city)
                .success(function(response) {
                    if (!location || location === '') {
                        if (response[0]) {
                            // $scope.job.location = response[0].name;
                            $scope.job.location = '';
                        };
                    }
                    $scope.locations = response;
                });
        };
        $scope.listAllCities = function() {
            $http.get('/city/list')
                .success(function(response) {

                    $scope.searchCity = "0";
                    //$scope.listLocationsByCityId($scope.searchCity);
                    $scope.cities = response;
                });
        };
        $scope.listLocationsByCityId = function(city) {
            if (city !== "0") {
                $http.get('/city/getLocationsByCityId/' + city)
                    .success(function(response) {
                        $scope.searchLocation = "0";
                        $scope.locations = response;


                        // console.log($scope.searchLocation);
                        // console.log($scope);
                    });
            };
        };

        $scope.renewJob = function(job) {
            $http.post('/job/renewByJobId/' + job._id + '/' + job.visibilityDuration)
                .success(function(response) {
                    location.reload();
                });
        };

        $scope.getBcCategory = function(selectedCategory) {
            for (var ind in $scope.categories) {
                if ($scope.categories[ind]._id === selectedCategory) {
                    $scope.bcCategory = $scope.categories[ind].name;
                }
            }
        };
        $scope.getBcSubcategory = function(selectedSubcategory) {
            for (var ind in $scope.allSubcategories) {
                if ($scope.allSubcategories[ind]._id === selectedSubcategory) {
                    $scope.bcSubcategory = $scope.allSubcategories[ind].name;
                }
            }
        };
        $scope.setBcCity = function(city) {

            $scope.bcCity = city;
        };
        $scope.setBcLocation = function(location) {

            $scope.bcLocation = location;
        };

        $scope.applyJob = function(job) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/jobs/views/partials/proposal.client.view.html',
                controller: 'ProposalInstanceCtrl',
                size: 'lg',
                resolve: {
                    job: function() {
                        return job;
                    },
                    user: function(){
                        return $scope.authentication.user;
                    }
                }
            });

        };




    }
]);

angular.module('jobs').controller('ModalInstanceCtrl', function($scope, $http, $modalInstance, proposal) {

    $scope.proposal = proposal;
    // $scope.items = items;
    // $scope.selected = {
    //   item: $scope.items[0]
    // };

    $scope.Accept = function(jobId) {
        if (confirm('Are you sure to award this job? \n this action cannot be undo')) {
            var data = { proposalId: $scope.proposal._id, jobId: jobId };
            $http.post('/proposals/acceptByJobId/', data)
                .success(function(response) {
                    var data = { proposalId: $scope.proposal._id, jobId: jobId, awardedTo: $scope.proposal.user._id };
                    $http.post('/jobs/acceptProposal/', data)
                        .success(function(response) {
                            location.reload();
                        });
                });
            $modalInstance.close(null);
        }
    };

    $scope.Reject = function(jobId) {
        if (confirm('Are you sure to reject this job? \n this action cannot be undo')) {
            var data = { proposalId: $scope.proposal._id, jobId: jobId };
            $http.post('/proposals/rejectByJobId/', data)
                .success(function(response) {
                    location.reload();
                });
            $modalInstance.close(null);
        }
    };

    $scope.ok = function() {
        // $modalInstance.close($scope.selected.item);
        $modalInstance.close(null);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

angular.module('jobs').controller('ProposalInstanceCtrl', function($scope, $http, $modalInstance, Proposals, job, user) {

    // $scope.items = items;
    // $scope.selected = {
    //   item: $scope.items[0]
    // };
    $scope.job = job;
    $scope.user = user;
    $scope.proposal = new Proposals();
    $scope.proposalSubmit = 'notsubmit';
    $scope.create = function() {
        // Create new Proposal object
        $scope.proposal.job = $scope.job._id;
        $scope.proposal.user = $scope.user._id;
        var proposal = $scope.proposal;
        // Redirect after save
        if ($scope.proposalState === 'edit') {
            proposal.status = 'pending';
            proposal.$update(function() {
                $scope.proposal.$promise.then(function(data) {
                    if ($scope.file1 != null) {
                        $scope.uploadFile1(data._id);
                    }
                    if ($scope.file2 != null) {
                        $scope.uploadFile2(data._id);
                    }
                    if ($scope.file3 != null) {
                        $scope.uploadFile3(data._id);
                    }
                });
                $scope.proposalSubmit = 'success';

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                $scope.proposalSubmit = 'error';
            });
        } else {
            proposal.$save(function(response) {
                if ($scope.file1 != null) {
                    $scope.uploadFile1(response._id);
                }
                if ($scope.file2 != null) {
                    $scope.uploadFile2(response._id);
                }
                if ($scope.file3 != null) {
                    $scope.uploadFile3(response._id);
                }
                $scope.proposalSubmit = 'success';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                $scope.proposalSubmit = 'error';
            });
        }
        $modalInstance.dismiss('cancel');
    };




    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    };
});


angular.module('jobs').controller('ChatInstanceCtrl', function($scope, $http, $modalInstance, messages, recieverId, senderId, jobId, currProposalId) {
    console.log(messages);
    $scope.messagesList = messages;

    $scope.Accept = function(jobId) {

    };

    $scope.Reject = function(jobId) {};

    $scope.sendMessage = function() {
        // $modalInstance.close($scope.selected.item);
        $http.post('/messages/addMessage', {
            sender: senderId,
            reciever: recieverId,
            job: jobId,
            msg: $scope.typedMessage
        }).success(function(response1) {
            $http.get('/messages/get/' + senderId + '/' + recieverId + '/' + jobId)
                .success(function(response) {
                    $scope.messagesList = response;
                    $scope.typedMessage = '';
                    $http.post('/proposals/add-last-message/' + currProposalId + '/' + response1._id)
                        .success(function(response) {}).error(function(response) {
                            $scope.error = response.message;
                        });
                }).error(function(response) {
                    $scope.error = response.message;
                });
        }).error(function(response) {
            $scope.error = response.message;
        });

    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

angular.module('jobs').controller('AdminApproveJobCtrl', function($scope, $http, $modalInstance, job) {

    $scope.jobToApprove = job;
    $scope.Approve = function() {
        if (confirm('Are you sure you want to approve this job?')) {
            $http.post('/job/updateJobStatus/' + $scope.jobToApprove._id + '/Approved/' + job.visibilityDuration)
                .success(function(response) {
                    $modalInstance.close(null);
                });
        }
    };

    $scope.Reject = function() {
        if (confirm('Are you sure you want to reject this job?')) {
            $http.post('/job/updateJobStatus/' + $scope.jobToApprove._id + '/Reject/' + job.visibilityDuration)
                .success(function(response) {
                    $modalInstance.close(null);

                });
        }
    };

    $scope.ok = function() {
        // $modalInstance.close($scope.selected.item);
        $modalInstance.close(null);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

angular.module('jobs').controller('GiveFeedBackCtrl', function($scope, $http, $modalInstance, proposal, byUser, givenFeedback, jobBy) {
    $scope.proposal = proposal;
    $scope.givenFeedback = givenFeedback;
    console.log(Date.now());
    $scope.givenFeedback.created = Date.now();
    $scope.jobBy = jobBy;
    $scope.feedbackByUser = byUser;
    $scope.post = function(proposal) {
        $http.post('/feedback/create', givenFeedback).
        success(function(data, status, headers, config) {
            location.reload();
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

angular.module('jobs').controller('viewHistoryCtrl', function($scope, $http, $modalInstance, history, proposal) {
    $scope.history = history;
    $scope.proposal = proposal;
    // $scope.post = function (proposal) {
    //   $http.post('/feedback/create', givenFeedback).
    //           success(function(data, status, headers, config) {
    //               location.reload();
    //           }).
    //           error(function(data, status, headers, config) {
    //               // called asynchronously if an error occurs
    //               // or server returns response with an error status.
    //           });
    // };

    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    };
});

angular.module('jobs').controller('portfolioCtrl', function($scope, $http, $modalInstance, User) {
    $scope.user = User;
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;

    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    };
});