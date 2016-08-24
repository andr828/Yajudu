'use strict';

// Freelancer module config
angular.module('freelancer').run(['Menus',
	function(Menus) {
		// Config logic
		// ...
		Menus.addMenuItem('topbar', 'Find Work', 'freelancer', 'dropdown', '/contractors');
		Menus.addSubMenuItem('topbar', 'freelancer', 'Search jobs', 'jobs');
		Menus.addSubMenuItem('topbar', 'freelancer', 'Browse', 'browse-jobs');
		if(user.roles && user.roles[0] === 'freelancer'){
			Menus.addSubMenuItem('topbar', 'freelancer', 'Opportunities', 'job-opportunities');
		}
		// Menus.addSubMenuItem('topbar', 'freelancer', 'My Stats', '/client-profile');
		// Menus.addSubMenuItem('topbar', 'freelancer', 'Freelancer Profile', 'profile/');
		if(user.roles && user.roles[0] === 'freelancer'){
			// Menus.addSubMenuItem('topbar', 'freelancer', 'Proposal Requests', 'proposals');
		}
		// Menus.addSubMenuItem('topbar', 'freelancer', 'Watch List', '/watch-list');
	}
]);