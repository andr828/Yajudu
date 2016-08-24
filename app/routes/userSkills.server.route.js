'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
    // Skill Routes
    var users = require('../../app/controllers/users.server.controller');
    var skills = require('../../app/controllers/userSkills.server.controller');

    // skills seed
    app.route('/users/skills/:userId').get(skills.list);
    app.route('/skill/users/:skillId').get(skills.findUsersBySkill);
    app.route('/users/skills').put(users.requiresLogin, skills.addSkill);
    app.route('/users/skills').delete(users.requiresLogin, skills.deleteSkill);
};
