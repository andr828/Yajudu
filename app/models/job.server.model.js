'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * A Validation function
 */

var validateBudget= function(property) {
	if(this.chargingType === 'Hourly'){
		return true;
	}else{
		return property.length;
	};
};
var validateHourlyType= function(property) {
	if(this.chargingType === 'Fixed Price'){
		return true;
	}else{
		return property.length;
	};
};
var validateHourlyTypeNumber= function(property) {
	if(this.chargingType === 'Fixed Price'){
		return true;
	}else{
		return (property >= 0);
	};
};

/**
 * Job Schema
 */
var JobSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please name your job!',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please describe your job in the Describe It section',
		trim: true
	},	
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	category: {
		type: Schema.ObjectId,
		required: 'Please select a category',
		ref: 'Category'
	},
	subcategory: {
		type: Schema.ObjectId,
		required: 'Please select a subcategory',
		ref: 'Subcategory'
	},
	skills: [{
		type: Schema.ObjectId,
		ref: 'Skill'
	}],
	chargingType: {
		type: String,
		default: 'Hourly',
		required: 'please select charging type'
	},
	hourlyRate: {
		type: String,
		default: 'Decide later',
		// validate: [validateHourlyType, 'Please select a hourly rate']
	},
	hoursRequired: {
		type: Number,
		default: 0,
		validate: [validateHourlyTypeNumber, 'please select number of hour per week']	
	},
	duration: {
		type: String,
		default: 'Decide Later',
		// validate: [validateHourlyType, 'Please select duration']
	},
	budget: {
		type: String,
		default: 'Decide later',
		// validate: [validateBudget, 'Please select a budget']
	},
	isPublicPosting: {
		type: Boolean,
		default: true
	},
	isSearchable: {
		type : Boolean,
		default: true
	},
	visibilityDuration: {
		type: Number,
		default : 15
	},
	ValidTill: {
		type : Date,
		default: Date.now
	},
	jobStartOn: {
		type: String,
		default: 'Immediate'
	},
	jobStartOnDate: {
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		default: 'Draft'
	},
	proposals: [{
		type: Schema.ObjectId,
		ref: 'Proposal'
	}],
	isAwarded: {
		type : Boolean,
		default: false
	},
	awardedTo: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	acceptedProposal: {
		type: Schema.ObjectId,
		ref: 'Proposal'
	},
	isRated: {
		type: Boolean,
		default: false
	},
	experienceLevel: {
		type: String,
		default: 'Starter'
	},
	minJobsCompleted: {
		type: String,
		default: '0',
		required: 'please select minimum number of jobs completed'
	},
	country: {
		type: String,
		default: '',
		required: 'please select a country'
	},
	city: {
		type: String,
		default: '',
		required: 'please add city'
	},
	location: {
		type: String,
		default: '',
		required: 'please add location'
	}
});
JobSchema.set('toObject', { virtuals: true });
JobSchema.set('toJSON', { virtuals: true });
JobSchema.virtual('isExpired')
.get(function () {
	var now = new Date();
	if(this.ValidTill){
		return now >= this.ValidTill;
	}else{
		return false;
	};
});
JobSchema.virtual('cityStateCountry').get(function () {
    return this.location+', '+this.city+', '+this.country;
});
mongoose.model('Job', JobSchema);