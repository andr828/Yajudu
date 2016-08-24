'use strict';

// Proposals controller
angular.module('proposals').controller('ProposalsController', ['$scope','$http','$state', '$stateParams', '$location' , '$modal' ,'Authentication', 'Proposals', 'Jobs', 'lodash',
	function($scope,$http, $state, $stateParams, $location, $modal, Authentication, Proposals, Jobs, lodash) {
		$scope.authentication = Authentication;

    $scope.authAdmin = function(){
            if ($scope.authentication.user.roles && $scope.authentication.user.roles[0] === 'admin' ) {
                //Allow user to view this page
            }else{
                $location.path('/');
                $location.replace();
            };
        };
		// Create new Proposal
	
		$scope.initForm = function() {
			$scope.proposal = new Proposals();
			$scope.proposalSubmit = 'notsubmit';
			$scope.job = Jobs.get({
                jobId: $stateParams.jobId
            });
		  if ($scope.authentication.user) {
            $http.get('/proposals/user/' + $scope.authentication.user._id +'/'+$stateParams.jobId)
                    .success(function(response) {
                       if(response.length === 0){
                            $scope.proposal = new Proposals();
                            $scope.proposalState = 'create';
                        }else{
                           $scope.proposalState = 'edit';
                           $scope.proposal = Proposals.get({ 
                              proposalId: response[0]._id
                            });
                        }
                        $scope.job.$promise.then(function(data){ 
                        $http.get('/messages/get/'+$scope.authentication.user._id+'/'+data.user._id+'/'+$scope.job._id)
                            .success(function(response) {
                            if(response.length > 0){
                              $scope.messages = response;
                              $scope.showChatUrl = true;           
                            }else{
                              $scope.showChatUrl = false;
                            }
                          }).error(function(response) {
                              
                             $scope.error = response.message;
                           });
                    });
                    });
      };

    };


		// Remove existing Proposal
		$scope.remove = function(proposal) {
			if ( proposal ) { 
				proposal.$remove();

				for (var i in $scope.proposals) {
					if ($scope.proposals [i] === proposal) {
						$scope.proposals.splice(i, 1);
					}
				}
			} else {
				$scope.proposal.$remove(function() {
					$location.path('proposals');
				});
			}
		};

		// Update existing Proposal
		$scope.update = function() {
			var proposal = $scope.proposal;

			proposal.$update(function() {
				$location.path('proposals/' + proposal._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Proposals
		$scope.find = function() {
			Proposals.query().$promise.then(function(proposals){
        $scope.proposals = proposals;
        $scope.rejectedProposals = lodash.filter($scope.proposals, {status : 'rejected'});
        $scope.noResponseProposals = lodash.filter($scope.proposals, {status : 'approved'});
        $scope.calculateResponseRate();
      });
      // $scope.approvedProposals = lodash.filter($scope.proposals, {status : 'Accepted'});
		};
     $scope.calculateResponseRate = function(){
      $http.get('/messages/count-all-senders/'+$scope.authentication.user._id)
          .success(function(response) {
            console.log(response);
          $scope.responseRateProposals = (response*100)/$scope.proposals.length;
      });
    };

		// Find existing Proposal
		$scope.findOne = function() {
			$http.get('/proposals/'+$stateParams.proposalId)
                    .success(function(response) {
                        $scope.proposal = response;                
                    	if(response.status === 'accepted' || response.status === 'rejected'){
                    		$scope.proposalStatusDefined = 'true';
                    	}else{
                    		$scope.proposalStatusDefined = 'false';
                    	}
                    });

		};
		$scope.acceptJobProposal = function(jobId) {
      var data = { "jobId" : jobId, 
                    "proposalId" : $scope.proposal._id, 
                    "byUser" : $scope.authentication.user._id, 
                    "forUser" : $scope.proposal.user._id };

			$http.post('/proposal/acceptByJobId', data)
                    .success(function(response) {
                      var data = {"jobId" : jobId, "proposalId" : $scope.proposal._id, "userId" : $scope.proposal.user._id};   
              		 $http.post('/jobs/acceptProposal/')
                      .success(function(response) {
              		          			  $scope.proposalStatusDefined = 'true';
     		 						});
            });

		};

		$scope.rejectJobProposal = function(jobId) {
			$http.post('/proposals/rejectByJobId/'+$scope.proposal._id+'/'+jobId)
                    .success(function(response) {
            				$scope.proposalStatusDefined = 'true';
            			});

		};
    $scope.withdrawProposal = function(proposal) {
      proposal.status = 'withdraw'
      $http.post('/proposals/withdrawProposal/'+proposal._id+'/'+proposal.job._id)
                    .success(function(response) {
                  });

    };
    $scope.sendReminder = function(proposal){
      proposal.canSendReminder = false;
      $http.post('/proposals/sendReminder/'+proposal._id+'/'+proposal.job._id)
                    .success(function(response) {
                  });
    };
		$scope.uploadFile1 = function(pId) {
            	$http.post('/proposals/upload/file', {
            	    file: $scope.file1,
            	    proposalId:pId
            	}).success(function(response) {
            	    console.log("File 1 Uploaded");
            	}).error(function(response) {

            	    $scope.error = response.message;
            	});
        	
        };

        $scope.uploadFile2 = function(pId) {
            	$http.post('/proposals/upload/file', {
            	    file: $scope.file2,
            	    proposalId:pId
            	}).success(function(response) {
            	    console.log("File 2 Uploaded");
            	}).error(function(response) {

            	    $scope.error = response.message;
            	});
        	
        };

        $scope.uploadFile3 = function(pId) {
            	$http.post('/proposals/upload/file', {
            	    file: $scope.file3,
            	    proposalId:pId
            	}).success(function(response) {
            	    console.log("File 3 Uploaded");
            	}).error(function(response) {

            	    $scope.error = response.message;
            	});
        	
        };
        $scope.loadProposalForModeration = function(){
        	$http.get('/proposals/moderations/list').
            success(function(data, status, headers, config) {
                $scope.proposals = data;
                $scope.proposalsCount = data.length;
            }).
            error(function(data, status, headers, config) {
            	
            });
        };

        $scope.openProposalForAdminApproval = function(proposal){
             var modalInstance = $modal.open({
                  animation: $scope.animationsEnabled,
                  templateUrl: 'modules/proposals/views/partials/proposal-view.client.view.html',
                  controller: 'AdminApproveProposalCtrl',
                  size: 'lg',
                  resolve: {
                    proposal: function () {
                      return proposal;
                    }
                  }
                });

        };
        $scope.openProposalForAdminEdit = function(proposal){
             var modalInstance = $modal.open({
                  animation: $scope.animationsEnabled,
                  templateUrl: 'modules/proposals/views/partials/edit-proposal-admin-view-client.html',
                  controller: 'AdminEditProposalCtrl',
                  size: 'lg',
                  resolve: {
                    proposal: function () {
                      return proposal;
                    }
                  }
                });

        };
         $scope.openChatWindowForClient = function(proposalId){
          console.log("sfef");
            $scope.thisProposalId = proposalId;
              $scope.job.$promise.then(function(data){ 
                //todo
              $http.get('/messages/get/'+$scope.authentication.user._id+'/'+data.user._id+'/'+$scope.job._id)
                      .success(function(response) {
                              var modalInstance = $modal.open({
                                   animation: $scope.animationsEnabled,
                                   templateUrl: 'modules/jobs/views/partials/chat-view.client.view.html',
                                   controller: 'ProposalChatInstanceCtrl',
                                   size: 'lg',
                                   resolve: {
                                     messages: function () {
                                        return response;
                                     },
                                     recieverId: function () {
                                       		return data.user._id;
                                   	 },
                                     senderId : function(){
                                         return $scope.authentication.user._id;
                                     },
                                     jobId : function(){
                                         return $scope.job._id;
                                     },
                                     currProposalId : function(){
                                         return $scope.thisProposalId;
                                     }
                                   }
                                 });

                      }).error(function(response) {
                           console.log("test");
                           $scope.error = response.message;
                      });         
              
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

angular.module('proposals').controller('AdminApproveProposalCtrl', function ($scope, $http, $modalInstance, $modal, proposal) {
  $scope.proposal = proposal;
   $scope.openProposalForAdminEdit = function(proposal){
            $modalInstance.close(null);
             var modalInstance = $modal.open({
                  animation: $scope.animationsEnabled,
                  templateUrl: 'modules/proposals/views/partials/edit-proposal-admin-view-client.html',
                  controller: 'AdminEditProposalCtrl',
                  size: 'lg',
                  resolve: {
                    proposal: function () {
                      return proposal;
                    }
                  }
                });

        };
  $scope.Approve = function (Id) {
  if(confirm('Are you sure you want to approve this proposal?')){
    $http.post('/proposals/approveById/'+Id).success(function(response) {
      location.reload();  
    });
     $modalInstance.close(null);
  }
 };

  $scope.Reject = function (Id) {
    if(confirm('Are you sure you want to reject this proposal?')){
      $http.post('/proposals/disapproveById/'+Id)
                      .success(function(response) {
                              location.reload();
                          });
      $modalInstance.close(null);
    }
  };

  $scope.ok = function () {
    // $modalInstance.close($scope.selected.item);
    $modalInstance.close(null);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
angular.module('proposals').controller('AdminEditProposalCtrl', function ($scope, $http, $modalInstance, Proposals, proposal) {
  $scope.proposal = proposal;
  
  $scope.save = function () {
  if(confirm('Are you sure you want to update this proposal?')){
    var newProposal = new Proposals($scope.proposal);
    newProposal.job = newProposal.job._id; 
    newProposal.$update(function(response) {
                  $scope.proposalSubmit = 'success';
                  $modalInstance.close(null);
              }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                $scope.proposalSubmit = 'error';
              }); 
  }
 };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
angular.module('proposals').controller('ProposalChatInstanceCtrl', function ($scope, $http, $modalInstance, messages, recieverId, senderId, jobId, currProposalId) {
  $scope.messagesList = messages;
  $scope.Accept = function (jobId) {
  };
  $scope.Reject = function (jobId) {
  };

  $scope.sendMessage = function () {
    // $modalInstance.close($scope.selected.item);
    $http.post('/messages/addMessage', {
                          sender: senderId,
                          reciever:recieverId,
                          job:jobId,
                          msg : $scope.typedMessage 
                      }).success(function(response1) {
                      $http.get('/messages/get/'+senderId+'/'+recieverId+'/'+jobId)
                      .success(function(response) {
                        $scope.messagesList = response;
                        $scope.typedMessage = '';
                        $http.post('/proposals/add-last-message/'+currProposalId+'/'+response1._id)
                            .success(function(response) {
                              console.log("here2");
                              console.log(response);
                          }).error(function(response) {
                               $scope.error = response.message;
                          });

                      }).error(function(response) {
                           $scope.error = response.message;
                      });
                      }).error(function(response) {
                           $scope.error = response.message;
                      });
     /*$http.post('/messages/addMessage', {
                          sender: senderId,
                          reciever:recieverId,
                          msg : $scope.typedMessage 
                      }).success(function(response) {
                              console.log(response);
                      }).error(function(response) {
                           $scope.error = response.message;
                      });
    $modalInstance.close(null);*/
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});