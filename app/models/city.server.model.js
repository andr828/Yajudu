'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Country Schema
 */
var CitySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill City name',
		trim: true
	}
});

mongoose.model('City', CitySchema);