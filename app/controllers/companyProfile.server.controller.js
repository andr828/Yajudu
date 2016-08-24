'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	CompanyProfile = mongoose.model('CompanyProfile'),
	_ = require('lodash');

/**
 * Create a article
 */
exports.create = function(req, res) {
	var companyProfile = new CompanyProfile(req.body);
	companyProfile.user = req.user;

	companyProfile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(companyProfile);
		}
	});
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.json(req.companyProfile);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
	var companyProfile = req.companyProfile;

	companyProfile = _.extend(companyProfile, req.body);

	companyProfile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(companyProfile);
		}
	});
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var companyProfile = req.companyProfile;

	companyProfile.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(companyProfile);
		}
	});
};

/**
 * List of Articles
 */
// exports.list = function(req, res) {
// 	CompanyProfile.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
// 		if (err) {
// 			return res.status(400).send({
// 				message: errorHandler.getErrorMessage(err)
// 			});
// 		} else {
// 			res.json(articles);
// 		}
// 	});
// };

/**
 * Article middleware
 */
exports.companyProfileByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Article is invalid'
		});
	}

	CompanyProfile.findById(id).populate('user').exec(function(err, companyProfile) {
		if (err) return next(err);
		if (!companyProfile) {
			return res.status(404).send({
				message: 'Company not found'
			});
		}
		req.companyProfile = companyProfile;
		next();
	});
};

/**
 * Company Profile authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.companyProfile.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
