'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Feedback = mongoose.model('FeedBack'),
	User = mongoose.model('User'),
	_ = require('lodash'),
	config = require('../../config/config'),
	ses = require('./emailNotification.server.controller'),
	Job = mongoose.model('Job');

/**
 * Create a FeedBack
 */

function updateJobRatingStatus(feedback){
	Job.findOneAndUpdate({ '_id' : feedback.job} , { isRated : 'true' },true,function(err){
		if (err) {

		};
	});
	Feedback.aggregate([
		{$match: { forUser: feedback.forUser }},
        { $group: {
        	_id : feedback.forUser,
            totalEarnings: { $sum: '$totalPayment'}
        }}
    ], function (err, results) {
        if (err) {
            console.error(err);
        } else if (results.length){
            User.update({_id:results[0]._id}, {$set:{totalEarnings:results[0].totalEarnings}}, function(err, result) {
		    if (err) {

		        } else {
		            
		        }
		    });
        }
    }
	);

	Feedback.aggregate([
		{$match: { forUser: feedback.forUser }},
        { $group: {
        	_id : feedback.forUser,
            ratingAvg: { $avg: '$rating'}
        }}
    ], function (err, results) {
        if (err) {
            console.error(err);
        } else  if (results.length){
            User.update({_id:results[0]._id}, {$set:{averageRating:results[0].ratingAvg}}, function(err, result) {
		    if (err) {

		        } else {
		            
		        }
		    });
        }
    }
	);


};

exports.create = function(req, res) {
	Feedback.findOne({
		_id : req.body._id
	}).exec(function(err, feedback){
		if(err){
			return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
		}else{
			if(feedback){
				feedback.rating = req.body.rating;
				feedback.totalPayment = req.body.totalPayment;
				feedback.description = req.body.description;
				feedback.isCompleted = req.body.isCompleted;
				feedback.save(function(err, feedback){
					if(err){
						return res.status(400).send({
			                message: errorHandler.getErrorMessage(err)
			            });
					}else{
						updateJobRatingStatus(feedback);
						res.jsonp(feedback);
					}
				});
			}else{
				
				var feedback = new Feedback(req.body);
				updateJobRatingStatus(feedback);
				feedback.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						console.log('new Feedback added');
						User.findOneAndUpdate({_id : feedback.forUser},
							{$push : {history : feedback._id }},function(err, user){
						        if(err){
						                console.log(err);
						        }else{
					                Job.findOne({_id:feedback.job}).exec(function (err, job) {
										  if (err){

										  }else{
										  	var mailOptions = {
								                to: user.email,
								                from: config.mailer.from,
								                subject: 'Feedback Received',
								                html: 'Hi Mr. \''+user.displayName+'\'  you received a feedback for job \''+job.name+'\'.'
								                + '<br>View Job: '+'http://' + req.headers.host+ '/#!/jobs/' +job._id
								                };
									        ses.sendEmail(mailOptions);
										  };
										});
					                res.jsonp(feedback);
						        }
						});
						// User.findOne({
						// 	_id : feedback.forUser
						// }).exec(function(err, user){
						// 	if(err){
						// 		return res.status(400).send({
					 //                message: errorHandler.getErrorMessage(err)
					 //            });
						// 	}else{

						// 		user.jobHistory.push(feedback._id);

						// 		console.log('user modifications');
						// 		console.log(user.salt);
						// 		user.password = undefined;
      //       					user.salt = undefined;

						// 		user.save(function(err, user){
						// 			if(err){
						// 				return res.status(400).send({
						// 	                message: errorHandler.getErrorMessage(err)
						// 	            });
						// 			}else{
						// 				console.log("after modifications");
						// 				console.log(user.salt);
						// 				res.jsonp(feedback);		
						// 			}
						// 		});
								
						// 	}
						// });
						
					}
				});
			}
		}
	});
	
};
exports.getFeedback = function(req, res) {
    Feedback.findOne({
        'byUser': req.param('byUser'),
        'forUser': req.param('forUser'),
        'job' : req.param('jobId')
    }).sort('-created').populate('forUser').exec(function(err, feedback) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
        	if(feedback){
        		res.jsonp(feedback);
        	}
        	else{
        		var feedback = new Feedback({
        			'byUser': req.param('byUser'),
			        'forUser': req.param('forUser'),
			        'job' : req.param('jobId'),
			        'rating' : 1,
			        'totalPayment' : 0,
			        'isCompleted' : false
        		});
        		res.jsonp(feedback);
        	}
        }
    });
};
exports.getHistory = function(req,res){    
	var userId = req.param('userId');
	if(!userId){
		userId = req.user._id;
		console.log('loggedin Userid: '+userId);
	}
    Feedback.find({
    	'forUser' : userId }).populate('byUser').populate('forUser').populate('job').exec(function(err, feedbacks){
    	if(err){
    		return res.status(400).send({
    			message: errorHandler.getErrorMessage(err)
    		});
    	}else{
    		 Job.populate(feedbacks, {path:'job.subcategory', model : 'Subcategory'},
                   function(err, data){
                        Job.populate(feedbacks, {path:'job.category', model : 'Category'},
		                   function(err, data){
		                        Job.populate(feedbacks, {path:'job.acceptedProposal', model : 'Proposal'},
					                   function(err, data){
					                        res.jsonp(feedbacks);
					                   }
					             );
		                   }
		             );
                   }
             );
    		
    	}
    });
};
exports.getClientsCount = function(req,res){    
	var userId = req.param('userId');
	if(!userId){
		userId = req.user._id;
	}
    Feedback.find({
    	'forUser' : userId }).distinct('byUser', function(err, feedbacks){
    	if(err){
    		return res.status(400).send({
    			message: errorHandler.getErrorMessage(err)
    		});
    	}else{
   //  		Feedback.aggregate([
   //  			{ $match: { 'forUser': userId }},
   //  			{$group: {
   //  				_id:'$forUser',
   //  				 count: {$sum:1}
   //  				}
   //  			}], function(err, orders) {
			//     console.log(orders);
			// });
    		 
    		 res.jsonp(feedbacks.length);
    		
    	}
    });
};
/**
 * feeback authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};

