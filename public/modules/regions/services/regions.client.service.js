'use strict';

//Regions service used to communicate Regions REST endpoints
angular.module('regions').factory('Regions', ['$resource',
	function($resource) {
		return $resource('regions/:regionId', { regionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);