'use strict';

//Setting up route
angular.module('jobs').config(['$stateProvider',
	function($stateProvider) {
		// Jobs state routing
		$stateProvider.
		state('listJobs', {
			url: '/jobs',
			templateUrl: 'modules/jobs/views/list-jobs.client.view.html'
		}).
		state('listJobOpportunities', {
			url: '/job-opportunities',
			templateUrl: 'modules/jobs/views/opportunities-list-jobs.client.view.html'
		}).
		state('createJob', {
			url: '/post-a-job',
			templateUrl: 'modules/jobs/views/create-job.client.view.html'
		}).
		state('editJob', {
			url: '/jobs/:jobId/edit',
			templateUrl: 'modules/jobs/views/create-job.client.view.html'
		}).
		state('renewJob', {
			url: '/jobs/:jobId/:action/edit',
			templateUrl: 'modules/jobs/views/create-job.client.view.html'
		}).
		state('viewJob', {
			url: '/jobs/:jobId',
			templateUrl: 'modules/jobs/views/view-job.client.view.html'
		}).
		state('Jobs', {
			url: '/jobs',
			templateUrl: 'modules/jobs/views/list-jobs.client.view.html'
		}).
		state('JobsBySkillId', {
			url: '/jobs/by-skill-id/:skillId',
			templateUrl: 'modules/jobs/views/list-jobs.client.view.html'
		}).
		state('JobsBySubcategoryId', {
			url: '/jobs/by-subcategory-id/:subcategoryId',
			templateUrl: 'modules/jobs/views/list-jobs.client.view.html'
		}).
		state('JobsByCategoryId', {
			url: '/jobs/by-category-id/:categoryId',
			templateUrl: 'modules/jobs/views/list-jobs.client.view.html'
		}).state('browseJobs', {
			url: '/browse-jobs',
			templateUrl: 'modules/jobs/views/browse-list-jobs.client.view.html'
		}).
		state('review-renew-job',{
			url: '/jobs-review/:jobId/:action',
			templateUrl: 'modules/jobs/views/review-job.client.view.html'
		}).
		state('reviewjob',{
			url: '/jobs-review/:jobId',
			templateUrl: 'modules/jobs/views/review-job.client.view.html'
		}).
		state('jobsModeration', {
			url: '/jobs-moderation',
			templateUrl: 'modules/jobs/views/jobs-moderation.client.view.html'
		}).
		state('clientProfile', {
			url: '/client-profile',
			templateUrl: 'modules/jobs/views/my-jobs.client.view.html'
		}).
		state('reviewJobProposal',{
			url: '/job-proposal-review/:proposalId',
			templateUrl: 'modules/proposals/views/review-proposal.client.view.html'
		}).
		state('searchJob',{
			url: '/searchJob/:searchText',
			templateUrl: 'modules/jobs/views/list-jobs.client.view.html'
		});
	}
]);