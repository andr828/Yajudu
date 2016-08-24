'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	company = require('../../app/controllers/companyProfile.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/company')
		// .get(company.list)
		.post(users.requiresLogin, company.create);

	app.route('/company/:companyId')
		.get(company.read)
		.put(users.requiresLogin, company.hasAuthorization, company.update)
		.delete(users.requiresLogin, company.hasAuthorization, company.delete);

	// Finish by binding the article middleware
	app.param('companyId', company.companyProfileByID);
};
