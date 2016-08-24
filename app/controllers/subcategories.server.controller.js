'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Subcategory = mongoose.model('Subcategory'),
	_ = require('lodash');

/**
 * Create a Subcategory
 */
exports.create = function(req, res) {
	var subcategory = new Subcategory(req.body);
	subcategory.user = req.user;

	subcategory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subcategory);
		}
	});
};

/**
 * Show the current Subcategory
 */
exports.read = function(req, res) {
	res.jsonp(req.subcategory);
};

/**
 * Update a Subcategory
 */
exports.update = function(req, res) {
	var subcategory = req.subcategory ;
	console.log(subcategory);
	subcategory = _.extend(subcategory , req.body);

	subcategory.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subcategory);
		}
	});
};

/**
 * Delete an Subcategory
 */
exports.delete = function(req, res) {
	var subcategory = req.subcategory ;

	subcategory.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subcategory);
		}
	});
};

/**
 * List of Subcategories
 */
exports.list = function(req, res) {
	if (req.user && req.user.roles[0] === 'admin') {
		Subcategory.find().sort('-created').populate('category', 'name').exec(function(err, subcategories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subcategories);
		}
		});
	}else{
		Subcategory.find({isActive:true}).sort('-created').populate('category', 'name').exec(function(err, subcategories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subcategories);
		}
		});
	}; 
};

/**
* Get Subcategory By ID
*/
exports.subcategoryByCategoryID = function(req, res) {
	if (req.user && req.user.roles[0] === 'admin') {
		var id = req.param('categoryId');
		Subcategory.find({category : id}).sort('-created').populate('category', 'name').exec(function(err, subcategories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subcategories);
		}
		});
	}else{
		var id = req.param('categoryId');
		Subcategory.find({category : id , isActive : true }).sort('-created').populate('category', 'name').exec(function(err, subcategories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subcategories);
		}
		});
	}; 
};
/**
 * Subcategory middleware
 */
exports.subcategoryByID = function(req, res, next, id) { 
	Subcategory.findById(id).populate('user').populate('category').exec(function(err, subcategory) {
		if (err) return next(err);
		if (! subcategory) return next(new Error('Failed to load Subcategory ' + id));
		req.subcategory = subcategory ;
		next();
	});
};

/**
 * Subcategory authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// all allowed 
	next();
};

exports.isAdmin = function(req, res, next) {
	if (req.user.roles[0] !== 'admin') {
		return res.status(403).send('User is not authorized');
	}
	next();
};