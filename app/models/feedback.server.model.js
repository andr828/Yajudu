'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Skill Schema
 */
var FeedBackSchema = new Schema({
	byUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	forUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	description: {
		type: String,
		default: '',
	},
	job: {
		type: Schema.ObjectId,
		ref: 'Job'
	},
	created: {
		type: Date,
		default: Date.now
	},
	totalPayment: {
		type: Number,
		default: 0
	},
	rating : {
		type: Number,
		default: 5,
	},
	friendliness : {
		type: Number,
		default: 1,
	},
	paidOnTime : {
		type: Number,
		default: 1,
	},
	goodClient : {
		type: Number,
		default: 1,
	},
	workAgain : {
		type: Number,
		default: 1,
	},
	isCompleted: {
		type: Boolean,
		default: false
	},
	isByClient: {
		type: Boolean,
		default: false
	}
});

mongoose.model('FeedBack', FeedBackSchema);