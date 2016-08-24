'use strict';

//Setting up route
angular.module('subcategories').config(['$stateProvider',
	function($stateProvider) {
		// Subcategories state routing
		$stateProvider.
		state('listSubcategories', {
			url: '/subcategories',
			templateUrl: 'modules/subcategories/views/list-subcategories.client.view.html'
		}).
		state('createSubcategory', {
			url: '/subcategories/create',
			templateUrl: 'modules/subcategories/views/create-subcategory.client.view.html'
		}).
		state('editSubcategory', {
			url: '/subcategories/:subcategoryId/edit',
			templateUrl: 'modules/subcategories/views/edit-subcategory.client.view.html'
		});
	}
]);