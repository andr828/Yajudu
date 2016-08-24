'use strict';

//Proposals service used to communicate Proposals REST endpoints
angular.module('proposals').factory('Proposals', ['$resource',
	function($resource) {
		return $resource('proposals/:proposalId', { proposalId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);