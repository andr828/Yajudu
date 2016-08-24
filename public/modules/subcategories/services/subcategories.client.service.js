'use strict';

//Subcategories service used to communicate Subcategories REST endpoints
angular.module('subcategories').factory('Subcategories', ['$resource',
	function($resource) {
		return $resource('subcategories/:subcategoryId', { subcategoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);