'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	Schema = mongoose.Schema;

/**
 * A Validation function for local strategy properties
 */
var validatePositiveNumberProperty = function(property) {
    return (property > -1);
};
/**
 * Proposal Schema
 */
var ProposalSchema = new Schema({
	bidId: {
		type: Number,
		default: 0
	},
	jobApproach: {
		type: String,
		default: '',
		required: 'Please fill in your job Approach',
	},
	experience: {
		type: String,
		default: '',
		required: 'Please fill in your Experience'
	},
	hours: {
		type: Number,
		default: 0,
		validate: [validatePositiveNumberProperty, 'Please fill in hours with a valid number']
	},
	myEarnings: {
		type: Number,
		default: 0,
		validate: [validatePositiveNumberProperty, 'Please fill Bid for job with a valid number']
	},
	estimatedDuration: {
		type: String,
		default: '',
		required: 'Please give duration and timings'
	},
	created: {
		type: Date,
		default: Date.now
	},
	acceptanceDate: {
		type: Date,
		default: ''
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	job: {
		type: Schema.ObjectId,
		ref: 'Job'
	},
	status: {
		type: String,
		default: 'pending'	
	},
	files: [{
        type: String
    }],
    feedback: {
    	type: Schema.ObjectId,
    	ref	: 'FeedBack'
    },
    canSendReminder: {
    	type: Boolean,
    	default: true
    },
    lastMessage: {
    	type: Schema.ObjectId,
    	ref	: 'Message'
    }
});
ProposalSchema.plugin(deepPopulate, {
  whitelist: [
    'user',
    'user.skills'
  ]
});
mongoose.model('Proposal', ProposalSchema);