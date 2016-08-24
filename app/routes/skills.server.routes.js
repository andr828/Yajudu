'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var skills = require('../../app/controllers/skills.server.controller');

	// Skills Routes
	app.route('/skills')
		.get(skills.list)
		.post(users.requiresLogin, skills.create);

	app.route('/skills/:skillId')
		.get(skills.read)
		.put(users.requiresLogin, skills.hasAuthorization, skills.update);
		// .delete(users.requiresLogin, skills.hasAuthorization, skills.delete);

	app.route('/skills/by-category-id/:categoryId')
	.get(skills.getSkillsByCategoryId);

	// Finish by binding the Skill middleware
	app.param('skillId', skills.skillByID);
};
