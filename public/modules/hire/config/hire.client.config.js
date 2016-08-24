'use strict';

// Hire module config
angular.module('hire').run(['Menus',
	function(Menus) {
		// Config logic
		// ...
		Menus.addMenuItem('topbar', 'Find Talent', 'hire', 'dropdown', 'contractors');
		Menus.addSubMenuItem('topbar', 'hire', 'Search Talent', 'talent');
		Menus.addSubMenuItem('topbar', 'hire', 'Browse', 'browse-talent');
		// if(user.roles && user.roles[0] === 'client'){
				// Menus.addSubMenuItem('topbar', 'hire', 'Post a Job', 'post-a-job');
		// }
		// Menus.addSubMenuItem('topbar', 'hire', 'Client Profile', 'client-profile');
		// Menus.addSubMenuItem('topbar', 'hire', 'Watch List', 'watch-list');
	}
]);