'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Country Schema
 */
var CountrySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Country name',
		trim: true
	},
	code: {
		type: String,
		default: '',
		required: 'Please fill Country code',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Country', CountrySchema);