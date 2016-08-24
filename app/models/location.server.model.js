'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Country Schema
 */
var LocationSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Location name',
		trim: true
	},
	city: {
		type: Schema.ObjectId,
		ref: 'City'
	}
});

mongoose.model('Location', LocationSchema);