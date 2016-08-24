'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Category = mongoose.model('Category'),
	_ = require('lodash');

/**
 * Create a Category
 */
exports.create = function(req, res) {
	var category = new Category(req.body);
	category.user = req.user;

	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * Show the current Category
 */
exports.read = function(req, res) {
	res.jsonp(req.category);
};

/**
 * Update a Category
 */
exports.update = function(req, res) {
	var category = req.category ;

	category = _.extend(category , req.body);

	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

exports.updateCategory = function(req, res) {
	Category.update({_id:req.param('categoryId')}, {$set:{name:req.param('categoryName')}}, function(err, result) {
    if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
    		res.jsonp(result);			       
        }
	});    
};
/**
 * Delete an Category
 */
exports.delete = function(req, res) {
	var category = req.category ;

	category.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * List of Categories
 */
exports.list = function(req, res) {
	var condition = {};
	if (req.user && req.user.roles[0] !== 'admin') {
		condition = {isActive:true};	
	};
		Category.find(condition).sort('-created').populate('user', 'displayName').exec(function(err, categories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(categories);
		}
		});
};

/**
 * Category middleware
 */
exports.categoryByID = function(req, res, next, id) {
	Category.findById(id).populate('user', 'displayName').exec(function(err, category) {
		if (err) return next(err);
		if (! category) return next(new Error('Failed to load Category ' + id));
		req.category = category ;
		next();
	});
};

/**
 * Category authorization middleware
 */
// exports.hasAuthorization = function(req, res, next) {
// 	if (req.category.user.id !== req.user.id) {
// 		return res.status(403).send('User is not authorized');
// 	}
// 	next();
// };

