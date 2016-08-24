'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Subcategory Schema
 */
var SubcategorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Subcategory name',
		unique : true,
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	category: {
		type: Schema.ObjectId,
		ref: 'Category',
		required: 'Please select Category',
	},
	isActive: {
		type: Boolean,
		default: true
	}
});

mongoose.model('Subcategory', SubcategorySchema);