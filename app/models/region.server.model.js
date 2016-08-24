'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Region Schema
 */
var RegionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Region name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Region', RegionSchema);