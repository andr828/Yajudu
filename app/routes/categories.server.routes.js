'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var categories = require('../../app/controllers/categories.server.controller');

	// Categories Routes
	app.route('/categories')
		.get(categories.list)
		.post(users.requiresLogin, categories.create);

	app.route('/categories/:categoryId')
		.get(users.requiresLogin, users.isAdmin, categories.read)
		.put(users.requiresLogin, users.isAdmin, categories.update);
		// .delete(users.requiresLogin, categories.hasAuthorization, categories.delete);
	app.route('/category/update/:categoryId/:categoryName')
		.post(categories.updateCategory);
	// Finish by binding the Category middleware
	app.param('categoryId', categories.categoryByID);
};
