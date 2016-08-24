'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Message Schema
 */
var messageSchema = new Schema({
	sender: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	reciever: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	job: {
		type: Schema.ObjectId,
		ref: 'Job'
	},
	created: {
		type: Date,
		default: Date.now
	},
	msg: {
		type: String,
		default: ' '
	}
});

mongoose.model('Message', messageSchema);