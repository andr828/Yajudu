'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
    // Message Routes
    var messages = require('../../app/controllers/message.server.controller');
    var users = require('../../app/controllers/users.server.controller');
    app.route('/messages/addMessage').post(users.requiresLogin, messages.addMessage);
    app.route('/messages/get/:sender/:reciever/:job').get(users.requiresLogin, messages.list);
    app.route('/messages/count-all-senders/:userId').get(users.requiresLogin, messages.countAllSenders);

};
