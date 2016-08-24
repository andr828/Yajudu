'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	var emailService = require('../../app/controllers/emailNotification.server.controller');
	app.route('/').get(core.index);
	app.route('/countries').get(core.countries);
	// app.route('/sendEmail').get(emailService.sendEmail);
};
