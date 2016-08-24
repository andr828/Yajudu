'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Proposal = mongoose.model('Proposal'),
	Skill = mongoose.model('Skill'),
	User = mongoose.model('User'),
	Job = mongoose.model('Job'),
    config = require('../../config/config'),
    ses = require('./emailNotification.server.controller'),
	_ = require('lodash');

/**
 * Create a Proposal
 */
exports.create = function(req, res) {
	var proposal = new Proposal(req.body);
	proposal.user = req.user;
	Proposal.find({}, function(err, proposals) {
		proposal.bidId = proposals.length+1;
		proposal.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				Job.update({_id: proposal.job},{$push: {proposals:proposal._id}},{upsert:true},function(err){
				        if(err){
				        }else{
				        	res.jsonp(proposal);
				        }
				});

			}
		});
    });
};

/**
 * Show the current Proposal
 */
exports.read = function(req, res) {
	res.jsonp(req.proposal);
};

/**
 * Update a Proposal
 */
exports.update = function(req, res) {
	var proposal = req.proposal ;
	proposal = _.extend(proposal , req.body);
	proposal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proposal);
		}
	});
};

/**
 * Delete an Proposal
 */
exports.delete = function(req, res) {
	var proposal = req.proposal ;

	proposal.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proposal);
		}
	});
};

/**
 * List of Proposals
 */
exports.list = function(req, res) { 
	Proposal.find({user : req.user._id}).sort('-created').populate('user').populate('skills').populate('job').exec(function(err, proposals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proposals);
		}
	});
};
exports.listByJobId = function(req, res) { 
	var jobId =  req.param('jobId');
	var accepted = 'accepted';
	var approved = 'approved';
	var rejected = 'rejected';
	var pending  = 'pending';
	Proposal.find({
	     $and: [{
            $or: [{
                'status': accepted
            }, {
                'status': approved
            }, {
                'status': rejected
            }, {
                'status': pending
            }],
            job : jobId
        }]
	}).sort('status').populate('lastMessage').exec(function(err, proposals) {
	    if (err) {
	        return res.status(400).send({
	            message: errorHandler.getErrorMessage(err)
	        });
	    } else {
	        Proposal.deepPopulate(proposals, 'user.skills', function(err, _proposals) {
	            res.jsonp(_proposals);
	            
	        });


	    }
	});

};
/**
 * Proposal middleware
 */
exports.proposalByID = function(req, res, next, id) { 
	Proposal.findById(id).populate('user').exec(function(err, proposal) {
		if (err) return next(err);
		if (! proposal) return next(new Error('Failed to load Proposal ' + id));
		req.proposal = proposal ;
		next();
	});
};

exports.proposalByUserId = function(req, res) { 
	var userId = req.param('userId');
	var jobId = req.param('jobId');
	
	Proposal.find({user : userId, job : jobId }).sort('-created').populate('category', 'name').exec(function(err, proposals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proposals);
		}
	});
};

exports.acceptProposalByJobId = function(req, res) { 
	var jobId = req.body.jobId;
	var proposalId = req.body.proposalId;
	Proposal.update({_id:proposalId, job:jobId}, {$set:{status:'accepted', acceptanceDate:Date.now()}}, function(err, result) {
	    if (err) {
	            return res.status(400).send({
	                message: errorHandler.getErrorMessage(err)
	            });
	    } else {
				Proposal.update({_id:{$ne :proposalId}, job:jobId}, {$set:{status:'rejected'}}, function(err, updatedResult) {
			    	if (err) {
			            return res.status(400).send({
			                message: errorHandler.getErrorMessage(err)
			            });
			        } else {
			        	Proposal.findOne({_id:proposalId}).populate('user').populate('job').exec(function (err, porposal) {
						  if (err){

						  }else{
						  	var mailOptions = {
				                to: porposal.user.email,
				                from: config.mailer.from,
				                subject: 'Proposal Accepted',
				                html: 'Hi Mr. \''+porposal.user.displayName+'\'  your proposal for \''+porposal.job.name+'\' Has been accepted by client.'
				                + '<br>View Job: '+'http://' + req.headers.host+ '/#!/jobs/' + porposal.job._id
				                };
					        ses.sendEmail(mailOptions);
						  };
						});
						res.jsonp(updatedResult);		
			        }
				}); 		       
	    }
	});   	
};

exports.rejectProposalByJobId = function(req, res) { 
	var jobId = req.body.jobId;
	var proposalId = req.body.proposalId;
	Proposal.update({_id:proposalId, job:jobId}, {$set:{status:'rejected'}}, function(err, result) {
    if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
    		res.jsonp(result);			       
        }
	});    
};
exports.withdrawProposal = function(req, res) { 
	var proposalId = req.param('proposalId');
	var jobId = req.param('jobId');
	Proposal.update({_id:proposalId, job:jobId}, {$set:{status:'withdraw'}}, function(err, result) {
    if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
    		res.jsonp(result);			       
        }
	});    
};
exports.sendReminder = function(req, res) { 
	var proposalId = req.param('proposalId');
	var jobId = req.param('jobId');
	Proposal.update({_id:proposalId, job:jobId}, {$set:{canSendReminder:false}}, function(err, result) {
    if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
        	Job.findOne({_id:jobId}).populate('user').exec(function (err, job) {
			  if (err){

			  }else{
			  	var mailOptions = {
	                to: 'alizaib.meti@gmail.com',
	                from: config.mailer.from,
	                subject: 'Reminder!!!',
	                html: 'Hi Mr. \''+job.user.displayName+'\'  please select a proposal for your job \''+job.name+'\''
	                };
		        ses.sendEmail(mailOptions);
			  };
			});
    		res.jsonp(result);			       
        }
	});    
};

exports.uploadFile = function(req, res) {
	console.log(req.body.proposalId);
	
	Proposal.find({_id : req.body.proposalId}).exec(function(err, proposalToUpdate) {
	            	if (err) {
	            		return res.status(400).send({
	            			message: errorHandler.getErrorMessage(err)
	            		});
	            	} else {
	            		console.log(proposalToUpdate);
	            		var message = null;
	            		var file = new Buffer(req.body.file.base64, 'base64');
        		        var fs = require('fs');
        		        var ext = req.body.file.filetype.split('/');
        		        var filename = proposalToUpdate[0]._id + proposalToUpdate[0].files.length + '.' + ext[1];
        		        fs.writeFile('./public/uploads/' + filename, file, function(err) {
        		            if (err) {
        		                res.send(err);
        		            } else {
        		                proposalToUpdate[0].files.push(filename);
        		                console.log(proposalToUpdate[0]);
        		                	Proposal.update({_id:req.body.proposalId}, {$set:{files: proposalToUpdate[0].files}}, function(err, result) {
        		                    if (err) {
        		                            return res.status(400).send({
        		                                message: errorHandler.getErrorMessage(err)
        		                            });
        		                        } else {
        		                    		res.jsonp(result);			       
        		                        }
        		                	});    

        		            }
        		        });
        	}
	            });

    	

     
};
exports.moderationProposals = function(req, res) {
  	Proposal.find({
        'status': 'pending'
    }).sort('-created').populate('job').populate('user').exec(function(err, proposals) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
        	Proposal.populate(proposals, { path: 'user.skills', model: 'Skill'}, function (err, proposals) {
		      res.jsonp(proposals);
		    });
            
        }
    });
};

exports.moderationProposalsCount = function(req, res) {
  	Proposal.count({
        'status': 'pending'
    }, function(err, proposals) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
		      res.jsonp(proposals);
            
        }
    });
};

exports.approveProposalById = function(req, res) { 
	var proposalId = req.param('proposalId');
	Proposal.findOneAndUpdate({_id:proposalId}, {$set:{status:'approved'}}, function(err, result) {
    if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
        	Proposal.findOne({_id:proposalId}).populate('user').populate('job').exec(function (err, porposal) {
			  if (err){

			  }else{
			  	var mailOptions = {
	                to: porposal.user.email,
	                from: config.mailer.from,
	                subject: 'Proposal Approved',
	                html: 'Hi Mr. \''+porposal.user.displayName+'\'  your proposal for \''+porposal.job.name+'\' has been approved by admin.'
	                + '<br>View Job: '+'http://' + req.headers.host+ '/#!/jobs/' + porposal.job._id
	                };
		        ses.sendEmail(mailOptions);

		        User.findOne({ _id: porposal.job.user }, function (err, person) {
		                if (err){
		                   
		                }else if(person){
		                        var emailSubject = 'New Proposal';
		                        var emailHtml = 'Hi Mr. \''+person.displayName+'\',  <br><br> Your job \''+porposal.job.name+'\' has a new proposal.'
		                                            + '<br>View Job: '+'http://' + req.headers.host+ '/#!/jobs/' + porposal.job._id;
		                    var mailOptions = {
		                        to: person.email,
		                        from: config.mailer.from,
		                        subject: emailSubject,
		                        html: emailHtml
		                    };
		                    ses.sendEmail(mailOptions);
		                };
		            });


			  };
			});
    		res.jsonp(result);			       
        }
	});    
};
exports.disapproveProposalById = function(req, res) { 
	var proposalId = req.param('proposalId');
	Proposal.update({_id:proposalId}, {$set:{status:'disapprove'}}, function(err, result) {
    if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
        	Proposal.findOne({_id:proposalId}).populate('user').populate('job').exec(function (err, porposal) {
			  if (err){

			  }else{
			  	var mailOptions = {
	                to: porposal.user.email,
	                from: config.mailer.from,
	                subject: 'Proposal Rejected',
	                html: 'Hi Mr. \''+porposal.user.displayName+'\'  your proposal for \''+porposal.job.name+'\' has rejected by admin.'
	                + '<br>View Job: '+'http://' + req.headers.host+ '/#!/jobs/' + porposal.job._id
	                };
		        ses.sendEmail(mailOptions);
			  };
			});
    		res.jsonp(result);			       
        }
	});    
};
exports.addLastMessage = function(req, res) { 
	var proposalId = req.param('proposalId');
	var messageId = req.param('messageId');
	Proposal.update({_id:proposalId}, {$set:{lastMessage:messageId}}, function(err, result) {
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
 * Proposal authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.proposal.user.id !== req.user.id && req.user.roles[0]!== 'admin') {
		return res.status(403).send('User is not authorized');
	}
	next();
};
