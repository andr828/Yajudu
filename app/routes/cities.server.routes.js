'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var cities = require('../../app/controllers/cities.server.controller');

	
	app.route('/city-location/seed')
		.get(cities.seed);
	app.route('/city/list')
		.get(cities.list);
	app.route('/city/getLocationsByCityId/:city')
		.get(cities.getLocationsByCityId);

};
