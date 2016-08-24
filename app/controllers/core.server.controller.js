'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	console.log("index page");
	// res.render('homepage', {
		
	// });
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.countries = function(req, res){
var countries        = require('country-data').countries;
res.jsonp(countries.all);
};