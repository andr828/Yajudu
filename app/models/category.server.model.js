'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Category name',
		unique : true,
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	isActive: {
		type: Boolean,
		default: true
	}
});

mongoose.model('Category', CategorySchema);


var interestedTalentsSchema = new Schema({
	name: String,
	email: String,
	serviceDescription: String,
	educationExperience: String,
	category: String
});

mongoose.model('interestedTalents', interestedTalentsSchema);

var interestedClientsSchema = new Schema({
	name: String,
	email: String,
	serviceDescription: String,
	targetCategories: String
});

mongoose.model('interestedClients', interestedClientsSchema);