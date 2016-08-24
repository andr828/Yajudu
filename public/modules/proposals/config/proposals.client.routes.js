'use strict';

//Setting up route
angular.module('proposals').config(['$stateProvider',
	function($stateProvider) {
		// Proposals state routing
		$stateProvider.
		state('listProposals', {
			url: '/proposals',
			templateUrl: 'modules/proposals/views/list-proposals.client.view.html'
		}).state('proposalsModeration', {
			url: '/proposals-moderation',
			templateUrl: 'modules/proposals/views/proposal-moderation.client.view.html'
		});
		// state('createProposal', {
		// 	url: '/proposals/create',
		// 	templateUrl: 'modules/proposals/views/create-proposal.client.view.html'
		// }).
		// state('viewProposal', {
		// 	url: '/proposals/:proposalId',
		// 	templateUrl: 'modules/proposals/views/view-proposal.client.view.html'
		// }).
		// state('editProposal', {
		// 	url: '/proposals/:proposalId/edit',
		// 	templateUrl: 'modules/proposals/views/edit-proposal.client.view.html'
		// });
	}
]);