'use strict';

//Setting up route
angular.module('skills').config(['$stateProvider',
	function($stateProvider) {
		// Skills state routing
		$stateProvider.
		state('listSkills', {
			url: '/skills',
			templateUrl: 'modules/skills/views/list-skills.client.view.html'
		}).
		state('createSkill', {
			url: '/skills/create',
			templateUrl: 'modules/skills/views/create-skill.client.view.html'
		}).
		state('editSkill', {
			url: '/skills/:skillId/edit',
			templateUrl: 'modules/skills/views/edit-skill.client.view.html'
		});
	}
]);