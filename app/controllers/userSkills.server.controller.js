'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    userSkill = mongoose.model('userSkill'),
    _ = require('lodash'),
    Skill = mongoose.model('Skill'),
    User = mongoose.model('User');

/**
 * Add user skills
 */
exports.addSkill = function(req, res) {
    // Init Variables
    var user = req.user;
    if (user) {
        // Merge existing user
        user = _.extend(user, req.body);
        // var newUserSkill = new userSkill({
        //     skill: req.body.skillId,
        //     user: user._id
        // });
        var skill = {
            skill: req.body.skillId,
            user: user._id
        };
        userSkill.create(skill, function(err, docs) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(docs);
            }
        });

        User.findByIdAndUpdate(
            skill.user,
            {$push: {"skills": skill.skill}},
            {safe: true, upsert: true},
            function(err, model) {
                console.log(err);
            }
        );
        Skill.findByIdAndUpdate(req.body.skillId, { $inc: { usersCount : 1} }, {safe: true, upsert: true},
            function(err, model) {
            });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};
/**
 * Delete user Skill
 */
exports.list = function(req, res) {
    // Init Variables    
    var user = req.user;
    var message = null;
    if (user) {
        // Merge existing user
        user = _.extend(user, req.body);
        var userId = user._id;
        if (req.param('userId') && req.param('userId') !== '') {
            userId = req.param('userId');
        }
        userSkill.find({
            user: userId
        }).populate('skill').exec(function(err, userSkills) {
            if (err) {
                console.log('error occured :'+err);
                res.status(400).send(err);
            } else {
                res.json(userSkills);
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};

/**
 * Delete user Skill
 */
exports.deleteSkill = function(req, res) {
    // Init Variables
    var user = req.user;
    var message = null;
    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    if (user) {
        // Merge existing user
        user = _.extend(user, req.body);
        userSkill.find({
            skill: req.param('skillId')
        }).remove().exec(function(err, deletedSkill) {
            if (err) {
                res.status(400).send(err);
            } else {
                req.user.skills.pull(req.param('skillId'));
                req.user.save();
                res.json(deletedSkill);
            }
        });
        Skill.findByIdAndUpdate(req.param('skillId'), { $inc: {usersCount : -1} }, {safe: true, upsert: true},
            function(err, model) {
            });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};

exports.findUsersBySkill = function(req, res) {
      
        userSkill.find({skill:req.param('skillId')}).sort('-created').populate('user').exec(function(err, userSkills) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            userSkill.populate(userSkills, { path: 'user.skills', model: 'Skill'},
                   function(err, data){
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.jsonp(userSkills);
                    }
                   }
             );   
        }
    });
    
};