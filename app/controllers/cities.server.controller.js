'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	City = mongoose.model('City'),
    Location = mongoose.model('Location'),
	_ = require('lodash');

/**
 * List of Countries
 */

exports.list = function(req, res) { 
	City.find().sort('-created').exec(function(err, cities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cities);
		}
	});
};

exports.getLocationsByCityId = function(req, res){
City.findOne({name : req.param('city')}).sort('-created').exec(function(err, currentCity) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else if(currentCity){
             Location.find({
                city:currentCity._id
            }).sort('-created').exec(function(err, locations) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(locations);
                }
            });
        }else{
            res.jsonp('');
        }
    });
};

exports.seed = function(req, res) {
    var cities = ['Doha',
        'Abu az Zuluf',
        'Abu Thaylah',
        'Ad Dawhah al Jadidah',
        'Al Ghanim'
    ];
    var locations = [
        {city: 'Doha', name:'Al Sadd'},
        {city: 'Doha', name:'Al Waab'},
        {city: 'Doha', name:'The Pearl'},
        {city: 'Doha', name:'West Bay'},
        {city: 'Doha', name:'Madinat Khalifa'},
        {city: 'Doha', name:'Ain Khalid'},
        {city: 'Doha', name:'Abu Hamour'},
        {city: 'Doha', name:'Mamoura'},
        {city: 'Doha', name:'Old Airport Area'},
        {city: 'Abu az Zuluf', name:'Abu Al Dahdah'},
        {city: 'Abu az Zuluf', name:'location3'},
        {city: 'Abu az Zuluf', name:'location4'},
        {city: 'Abu az Zuluf', name:'location5'},
        {city: 'Abu Thaylah', name:'location6'},
        {city: 'Ad Dawhah al Jadidah', name:'location7'},
        {city: 'Al Ghanim', name:'location8'}
    ];
   var citiesData = [];
   var locationsData = [];

    for (var i = 0; i < cities.length; i++) {
        citiesData.push({
            name: cities[i]
        });

    }

    City.collection.insert(citiesData, function(err, docs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            for (var i = 0; i < locations.length; i++) {
                var currentCity = '';
                _.each(docs, function(data) { 
                               if (data.name == locations[i].city) {
                                currentCity = data._id;
                                return;
                               }
                            });
                locationsData.push({
                    name: locations[i].name,
                    city:  currentCity
                });

            }
            Location.collection.insert(locationsData, function(err, docs) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {

                    res.json(docs);
                }
            });
        }
    });
};
