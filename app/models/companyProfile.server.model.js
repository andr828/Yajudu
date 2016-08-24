'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * CompanyProfileSchema Schema
 */
var CompanyProfileSchema = new Schema({
    name: {
        type: String,
        unique: 'Company name already exists',
        required: 'Please fill in a name',
        trim: true,
        default: ''
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    tagLine: {
        type: String,
        required: 'Please fill in a Tagline',
        default: ''
    },
    numberOfEmployees: {
        type: String,
        required: 'Please provide number of employees',
    },
    displayName: {
        type: String,
        trim: true
    },
    hourlyRate: {
        type: Number,
    },
    youtubeVideoUrl: {
        type: String,
    },
    shortProfile: {
        type: String,
        default: '',
        required: 'Please provide short profile description',
    },
    educationAndExperience: {
        type: String,
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },

});

mongoose.model('CompanyProfile', CompanyProfileSchema);
