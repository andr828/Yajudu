'use strict';

//Setting up route
angular.module('regions').config(['$stateProvider',
	function($stateProvider) {
		// Regions state routing
		$stateProvider.
		state('listRegions', {
			url: '/regions',
			templateUrl: 'modules/regions/views/list-regions.client.view.html'
		}).
		state('createRegion', {
			url: '/regions/create',
			templateUrl: 'modules/regions/views/create-region.client.view.html'
		}).
		state('viewRegion', {
			url: '/regions/:regionId',
			templateUrl: 'modules/regions/views/view-region.client.view.html'
		}).
		state('editRegion', {
			url: '/regions/:regionId/edit',
			templateUrl: 'modules/regions/views/edit-region.client.view.html'
		});
	}
]);