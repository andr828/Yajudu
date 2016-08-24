'use strict';

//Setting up route
angular.module('hire').config(['$stateProvider',
	function($stateProvider) {
		// Hire state routing
		$stateProvider.
		state('hire', {
			url: '/talent',
			templateUrl: 'modules/hire/views/contractors.client.view.html',
			resolve: { //Here we would use all the hardwork we have done
                //above and make call to the authorization Service
                //resolve is a great feature in angular, which ensures that a route
                //controller (in this case superUserController ) is invoked for a route
                //only after the promises mentioned under it are resolved.
                permission: function() {
                	// console.log();
                    return false;//user && user.roles && user.roles[0] !== 'client';
                },
            }
		}).state('hire-query', {
			url: '/talent/:query',
			templateUrl: 'modules/hire/views/contractors.client.view.html'
		}).state('hire-by-skill', {
			url: '/talent/bySkillId/:skillId',
			templateUrl: 'modules/hire/views/contractors.client.view.html'
		}).state('hire-by-subcategory-id', {
			url: '/talent/by-subcategory-id/:subcategoryId',
			templateUrl: 'modules/hire/views/contractors.client.view.html'
		}).
		state('browseContractors', {
			url: '/browse-talent',
			templateUrl: 'modules/hire/views/browse.contractors.client.view.html'
		});
	}
]);