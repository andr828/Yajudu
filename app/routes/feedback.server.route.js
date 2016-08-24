'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
    var feedback = require('../../app/controllers/feedback.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/feedback/create').post(users.requiresLogin, feedback.create);
    app.route('/feedback/get/:byUser/:forUser/:jobId').get(feedback.getFeedback);
    app.route('/feedback/list').get(users.requiresLogin, feedback.getHistory);
    app.route('/feedback/history/:userId').get(feedback.getHistory);
    app.route('/feedback/clients-count/:userId').get(feedback.getClientsCount);
};
