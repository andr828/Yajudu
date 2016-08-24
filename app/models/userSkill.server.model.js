'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * userSkill Schema
 */
var userSkillSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    skill: {
        type: Schema.ObjectId,
        ref: 'Skill'
    },
    display: {
        type: Boolean,
        default: true
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },

});
userSkillSchema.index({ user: 1, skill: 1 }, { unique: true });

mongoose.model('userSkill', userSkillSchema);
