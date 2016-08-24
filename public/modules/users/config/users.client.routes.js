'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('profile-first-visit', {
			url: '/settings/profile/:isFirstVisit',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('skills-edit', {
			url: '/profile/skills',
			templateUrl: 'modules/users/views/settings/edit-skills.client.view.html'
		}).
		state('profile-view', {
			url: '/profile/:userId',
			templateUrl: 'modules/users/views/profile/view-profile.client.view.html'
		}).
		state('specialities', {
			url: '/settings/specialities/:userId',
			templateUrl: 'modules/users/views/settings/view-specialities.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signup-freelancer', {
			url: '/signup-freelancer',
			templateUrl: 'modules/users/views/authentication/signup-freelancer.client.view.html'
		}).
		state('login', {
			url: '/login',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('choose-membership', {
			url: '/choose-membership',
			templateUrl: 'modules/users/views/authentication/set-role-social.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('email-verification', {
			url: '/user/email-verification',
			templateUrl: 'modules/users/views/authentication/email-verification.client.view.html'
		}).
		state('email-verification-error', {
			url: '/user/email-verification-error',
			templateUrl: 'modules/users/views/authentication/email-verification-error.client.view.html'
		}).
		state('email-verification-success', {
			url: '/user/email-verification-success',
			templateUrl: 'modules/users/views/authentication/email-verification-success.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		}).state('edit-company', {
			url: '/settings/edit/company',
			templateUrl: 'modules/users/views/settings/edit-company.client.view.html'
		}).state('portfolio', {
			url: '/settings/portfolio/:userId',
			templateUrl: 'modules/users/views/settings/edit-portfolio.client.view.html'
		}).state('privacy-settings', {
			url: '/settings/privacy',
			templateUrl: 'modules/users/views/settings/privacy.client.view.html'
		}).state('contact-Info', {
			url: '/profile/contact-Info/:userId',
			templateUrl: 'modules/users/views/settings/contact-info.client.view.html'
		}).
		state('job-history', {
			url: '/profile/job-history/:userId/:skillId',
			templateUrl: 'modules/users/views/profile/job-history.client.view.html'
		}).
		state('job-history-by-user-id', {
			url: '/profile/job-history-by-user-id/:userId',
			templateUrl: 'modules/users/views/profile/job-history.client.view.html'
		}).
		state('profile-reviews', {
			url: '/profile/reviews/:userId',
			templateUrl: 'modules/users/views/profile/reviews-client.view.html'
		}).
		state('users-moderation', {
			url: '/settings/users-moderation',
			templateUrl: 'modules/users/views/settings/users-moderation-client-view.html'
		}).
		state('interested-users', {
			url: '/settings/interested-users',
			templateUrl: 'modules/users/views/settings/interested-users-client-view.html'
		});
		
	}
]);