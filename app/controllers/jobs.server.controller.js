'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Job = mongoose.model('Job'),
    Subcategory = mongoose.model('Subcategory'),
    Skill = mongoose.model('Skill'),
    User = mongoose.model('User'),
    config = require('../../config/config'),
    ses = require('./emailNotification.server.controller'),
    moment = require('moment'),
    _ = require('lodash');

/**
 * Create a Job
 */
exports.create = function(req, res) {
    var job = new Job(req.body);
    job.user = req.user;
    console.log('saving job');
    console.log(job);
    job.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log('job created');
            res.jsonp(job);
        }
    });
};

/**
 * Show the current Job
 */
exports.read = function(req, res) {
    res.jsonp(req.job);
};

/**
 * Update a Job
 */
exports.update = function(req, res) {
    var job = req.job;

    job = _.extend(job, req.body);

    job.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (job.status === 'Pending') {
                User.findOne({ _id: job.user }).populate('category').populate('subcategory').exec(function (err, person) {
                if (err){
                   
                }else if(person){
                        var mailOptions = {
                            to: person.email,
                            from: config.mailer.from,
                            subject: 'Job Posted',
                            html: 'Hi Mr. \''+person.displayName+'\' <br> Your job \''+job.name+'\' has posted for admin approval.'
                        };
                        ses.sendEmail(mailOptions);
                        //send to 
                        var mailBody = "Hi Mr. Admin, <br> A job recently posted, please have a look at <a href='http://yajidu.com:3000/#!/jobs/"+ job._id +"/edit'. <br />";
                        mailBody += "<strong>Job Name:</strong>" + job.name + "<br />";
                        mailBody += "<strong>Job Desciption:</strong> " + job.description + "<br />";
                        mailBody += "<strong>Category:</strong> " + job.category.name + ", "+ job.subcategory.name +"<br />";
                        mailBody += "<strong>Job Type:</strong> " + job.chargingType + "<br />";
                        mailBody += "<strong>Budget:</strong> " + job.budget + "<br />";
                        var mailOptions = {
                            to: "jobposted@yajidu.com",
                            from: config.mailer.from,
                            subject: 'Job posted and waiting for approval',
                            html: mailBody
                        };
                        ses.sendEmail(mailOptions);
                        res.jsonp(job);
                    };
                });
            }else{
                res.jsonp(job);
            };
        }
    });
};

/**
 * Delete an Job
 */
exports.delete = function(req, res) {
    var job = req.job;

    job.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(job);
        }
    });
};

/**
 * List of Jobs
 */
exports.list = function(req, res) {
    Job.find().sort('-created').populate('user', 'displayName').populate('category').populate('subcategory').exec(function(err, jobs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });
};

/**
 * Job Browse
 */
exports.browse = function(req, res) {
    var query = req.param('query');
    var regex = new RegExp(query, 'i');
    // ,   query = { description: regex };

    Job.find({
        $and: [{
            $or: [{
                'name': regex
            }, {
                'description': regex
            }],
            status : 'Approved',
            ValidTill : {$gte : Date.now()}
        }]
    }).sort('-created').populate('user', 'displayName').populate('skills').populate('category').populate('subcategory').exec(function(err, jobs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log(jobs);
            res.jsonp(jobs);
        }
    });
};

exports.moderationJobs = function(req, res) {
    Job.find({
        'status': 'Pending'
    }).sort('-created').populate('user').populate('skills').populate('category').populate('subcategory').exec(function(err, jobs) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });
};

exports.moderationJobsCount = function(req, res) {
    Job.count({
        'status': 'Pending'
    },function(err, jobs) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    })
};

exports.approved = function(req, res) {
    Job.find({
        'status': 'Approved'
    }).sort('-created').populate('user').populate('category').populate('subcategory').populate('skills').exec(function(err, jobs) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });

};
exports.opportunities = function(req, res) {
    Job.find({
        'status' : 'Approved',
        'skills': { $elemMatch: { $in : req.user.skills } } 
    }).sort('-created').populate('user').populate('category').populate('subcategory').populate('skills').exec(function(err, jobs) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });
};
exports.closedJobs = function(req, res) {
    Job.find({
        'isAwarded': 'true'
    }).sort('-created').populate('user').populate('category').populate('subcategory').exec(function(err, jobs) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });

};
exports.ratedJobs = function(req, res) {
    Job.find({
        'isRated' : 'true'
    }).sort('-created').populate('user').populate('category').populate('subcategory').exec(function(err, jobs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });

};
exports.rejectedJobs = function(req, res) {
    Job.find({
        'status': 'Reject'
    }).sort('-created').populate('user').populate('category').populate('subcategory').exec(function(err, jobs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });

};
exports.jobByID = function(req, res, next, id) {
    Job.findById(id).populate('user').populate('subcategory').populate('acceptedProposal').populate('skills').populate('awardedTo').exec(function(err, job) {
        if (err) return next(err);
        if (!job) return next(new Error('Failed to load Job ' + id));
        Subcategory.populate(job.subcategory, { path :  'category'}, function(err, data){
            req.job = job;
            next();
        });
    });
};
exports.jobsBySkillId = function(req, res){
    var skillId = req.param('skillId');
    Job.find({
        'skills': skillId
    }).sort('-created').populate('user').populate('subcategory').populate('skills').exec(function(err, jobs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });
};

exports.acceptJobProposal = function(req, res) {
    var proposal = req.body.proposalId;
    var userId = req.body.awardedTo;
    var jobId = req.body.jobId;
    Job.update({_id:jobId}, {$set:{isAwarded:true,acceptedProposal:proposal,awardedTo:userId}}, function(err, result) {
    if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
        }
    });
};

exports.browseByCategory = function(req, res) {
    var categoryId = req.param('categoryId');
    // ,   query = { description: regex };

    Job.find({
        category:categoryId,
        status : 'Approved',
        ValidTill : {$gte : Date.now()}
    }).sort('-created').populate('user', 'displayName').populate('subcategory').populate('skills').exec(function(err, jobs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });
};
exports.browseByUserId = function(req, res){
    Job.find({
       user : req.user._id
    }).sort('-created').populate('user', 'displayName').populate('category').populate('subcategory').populate('skills').exec(function(err, jobs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });  
};
exports.activeJobsByUserId = function(req, res){
    Job.find({
       user : req.user._id,
       status : 'Approved',
       isAwarded : false,
       ValidTill : {$gte : Date.now()}
    }).sort('-created').populate('user', 'displayName').populate('subcategory').populate('skills').exec(function(err, jobs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });  
};
exports.browseBySubcategory = function(req, res) {
    var subcategoryId = req.param('subcategoryId');
    // ,   query = { description: regex };

    Job.find({
        subcategory:subcategoryId,
        status : 'Approved',
        ValidTill : {$gte : Date.now()}
    }).sort('-created').populate('user', 'displayName').populate('subcategory').populate('skills').exec(function(err, jobs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });
};
exports.browseByChargingType = function(req, res) {
    var jobType = req.param('jobType');
    // ,   query = { description: regex };

    Job.find({
        chargingType:jobType,
        status : 'Approved'
    }).sort('-created').populate('user', 'displayName').populate('subcategory').populate('skills').exec(function(err, jobs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });
};
exports.browseByLocation = function(req, res){
    var searchCriteria = {};
    if(req.param('city') && req.param('city') !== '0' && req.param('city') !== ''){
        searchCriteria.city = req.param('city');
    };
    if(req.param('location') != 'undefined' && req.param('location') !== '0' && req.param('location') !== ''){
        searchCriteria.location = req.param('location');
    };
    Job.find(searchCriteria).sort('-created').populate('user', 'displayName').populate('subcategory').populate('skills').exec(function(err, jobs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });
};

exports.updateAdminJobStatus = function(req, res) {
    var jobStatus = req.param('jobStatus');
    var jobId = req.param('jobId');
    var jobValidation = req.param('validity');  //X number of days
    var validTill = moment().add('days', jobValidation).format('YYYY-MM-DD HH:mm:ss');
    // res.jsonp({validTill : validTill});
    Job.findOneAndUpdate({_id:jobId}, {$set:{status : jobStatus, ValidTill : validTill}}, function(err, result) {
    if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Skill.update({_id : {"$in" : result.skills}}, { $inc: { jobsCount : 1} }, {safe: true, upsert: true, multi: true},
            function(err, model) {
            });
            User.findOne({ _id: result.user }, function (err, person) {
                if (err){
                   
                }else if(person){
                    if(result.status === 'Approved'){
                        var emailSubject = 'Job Approved';
                        var emailHtml = 'Hi Mr. \''+person.displayName+'\',  <br><br> Your job \''+result.name+'\' Has been approved by admin.'
                                            + '<br>share job on social media: '+'http://' + req.headers.host+ '/#!/jobs/' + result._id
                                            + '<br>Edit your job: '+'http://' + req.headers.host+ '/#!/jobs/' + result._id + '/edit'
                                            + '<br>invite other freelancers: '+'http://' + req.headers.host+ '/#!/jobs/' + result._id;
                    }else if(result.status === 'Reject'){
                        var emailSubject = 'Job Rejected';
                        var emailHtml = 'Hi Mr. \''+person.displayName+'\',  <br><br> Your job \''+result.name+'\' Has been rejected by admin.'
                                            + '<br>Edit your job: '+'http://' + req.headers.host+ '/#!/jobs/' + result._id + '/edit';
                    };
                    var mailOptions = {
                        to: person.email,
                        from: config.mailer.from,
                        subject: emailSubject,
                        html: emailHtml
                    };
                    ses.sendEmail(mailOptions);
                };
            });
            res.jsonp(result);

        }
    });
};


exports.renewByJobId = function(req, res) {
    var jobId = req.param('jobId');
    var jobValidation = req.param('visibilityDuration');  //X number of days
    var validTill = moment().add(jobValidation, 'days').format('YYYY-MM-DD HH:mm:ss');
    // res.jsonp({validTill : validTill});
    Job.findOneAndUpdate({_id:jobId}, {ValidTill : validTill}, function(err, result) {
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
 * Job authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

    if (req.job.user.id !== req.user.id && req.user.roles[0] !== 'admin') {
        return res.status(403).send('User is not authorized');
    }
    next();
};

exports.filterJobs = function(req, res) {
    var categoryId = req.param('categoryId');
    var subcategoryId = req.param('subcategoryId');
    // var country = req.param('country');
    var city = req.param('city');
    var location = req.param('location');
    var searchCriteria = {};
    var skip = 0;
    var limit = 1000;
    if(parseInt(req.param('pageSize')) && parseInt(req.param('page'))){
        skip = parseInt(req.param('pageSize')) * (parseInt(req.param('page'))-1);
    };
    if(parseInt(req.param('pageSize'))){
        limit = parseInt(req.param('pageSize'));
    };
    if(categoryId && categoryId!=='' && categoryId!=='undefined'){
        searchCriteria.category = categoryId;
    };
    if(subcategoryId && subcategoryId!=='' && subcategoryId!=='undefined'){
        searchCriteria.subcategory = subcategoryId;
    };
    // if(country && country!=='' && country!=='undefined'){
    //     searchCriteria.country = country;
    // };
    if(location && location!=='' && location!=='undefined'){
        searchCriteria.location = location;
    };
    if(city && city!=='' && city!=='undefined'){
        searchCriteria.city = city;
    };
    searchCriteria.status = 'Approved';
    searchCriteria.ValidTill = {$gte : Date.now()};

    // ,   query = { description: regex };

    Job.find(
        searchCriteria
    ).skip(skip).limit(limit).sort('-created').populate('user', 'displayName').populate('category').populate('subcategory').populate('skills').exec(function(err, jobs) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                Job.count(searchCriteria, function(err, count) {
                    var data = {
                        jobs: jobs,
                        count: count
                    }
                    res.jsonp(data);
                  });
            
        }
    });
};

exports.recentlyExpiredJobs = function(req, res) {
    var fiveDaysAgo = moment().subtract('6', 'days').format('YYYY-MM-DD HH:mm:ss');
    var lastDay = moment().subtract('1', 'days').format('YYYY-MM-DD HH:mm:ss');
    Job.find({ 
        ValidTill : {$gte : fiveDaysAgo, $lte:lastDay},
        isAwarded : false,
        status : 'Approved'
    }).sort('-created').populate('user', 'displayName').populate('subcategory').populate('skills').exec(function(err, jobs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(jobs);
        }
    });
};