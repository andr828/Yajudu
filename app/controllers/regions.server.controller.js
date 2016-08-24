'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Region = mongoose.model('Region'),
	_ = require('lodash');

/**
 * Create a Region
 */
exports.create = function(req, res) {
	var region = new Region(req.body);
	// region.user = req.user;

	region.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(region);
		}
	});
};

/**
 * Show the current Region
 */
exports.read = function(req, res) {
	res.jsonp(req.region);
};

/**
 * Update a Region
 */
exports.update = function(req, res) {
	var region = req.region ;

	region = _.extend(region , req.body);

	region.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(region);
		}
	});
};

/**
 * Delete an Region
 */
exports.delete = function(req, res) {
	var region = req.region ;

	region.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(region);
		}
	});
};

/**
 * List of Regions
 */
exports.list = function(req, res) { 
	Region.find().sort('-created').exec(function(err, regions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(regions);
		}
	});
};

/**
 * Region middleware
 */
exports.regionByID = function(req, res, next, id) { 
	Region.findById(id).exec(function(err, region) {
		if (err) return next(err);
		if (! region) return next(new Error('Failed to load Region ' + id));
		req.region = region ;
		next();
	});
};

/**
 * Region authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.region.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.seed = function(req, res) {
    var regions = ['North America',
        'Western Europe',
        'Eastern Europe',
        'India/Southern Asia',
        'Eastern Asia',
        'Middle East and Central Asia',
        'Central and South America',
        'Africa',
        'Australia/Oceana',
        
    ];
    
   var RegionData = [];

    for (var i = 0; i < regions.length; i++) {
        RegionData.push({
            name: regions[i]
        });

    }

    Region.collection.insert(RegionData, function(err, docs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(docs);
        }
    });
};
