'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Skill Schema
 */
var SkillSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Skill name',
		unique : true,
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	category: {
		type: Schema.ObjectId,
		required: 'Please select a category',
		ref: 'Category'
	},
	isActive: {
		type: Boolean,
		default: true
	},
	usersCount: {
		type: Number,
		min: 0,
		default: 0
	},
	jobsCount: {
		type: Number,
		min: 0,
		default: 0
	}
});

mongoose.model('Skill', SkillSchema);