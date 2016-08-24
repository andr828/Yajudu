'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Message = mongoose.model('Message'),
    _ = require('lodash');

/**
 * Add user skills
 */
exports.addMessage = function(req, res) {
    var message = {
            sender: req.body.sender,
            reciever: req.body.reciever,
            msg : req.body.msg,
            job : req.body.job
        };
        Message.create(message, function(err, docs) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(docs);
            }
        });
};
/**
 * Delete user Skill
 */
exports.list = function(req, res) {
    // Init Variables
    console.log(req.body);
    Message.find({
         $or: [
         {
            $and: [{
                'sender': req.param('sender')
            }, {
                'reciever': req.param('reciever')
            }, {
                'job': req.param('job')
            }]
        },
            {
                $and: [{
                    'sender': req.param('reciever')
                }, {
                    'reciever': req.param('sender')
                }, {
                'job': req.param('job')
            }]
            }
        ]
    }).sort('created').populate('sender').exec(function(err, messages) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
           res.jsonp(messages);
        }
    });
};

exports.countAllSenders = function(req, res){
    Message.find({
        'reciever': req.param('userId')
    }).distinct('sender').exec(function (err, messages) {
        console.log('The number of unique users is: %d', messages.length);
        res.jsonp(messages.length);
    });
};


