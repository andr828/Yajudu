'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    Job = mongoose.model('Job'),
    User = mongoose.model('User'),
    config = require('../../../config/config'),
    ses = require('../emailNotification.server.controller'),
    InterestedTalents = mongoose.model('interestedTalents'),
    InterestedClients = mongoose.model('interestedClients');

/**
 * Update user details
 */
exports.update = function(req, res) {
    // Init Variables
    var user = req.user;
    var message = null;
    console.log(user.roles);
    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    if (user) {
        // Merge existing user
        user = _.extend(user, req.body);
        user.updated = Date.now();
        if(!user.displayName || user.displayName == ''){
            user.displayName = user.firstName + ' ' + user.lastName;
        };
        user.save(function(err) {
            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                req.login(user, function(err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.json(user);
                    }
                });
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};
exports.updateUserByAdmin = function(req, res) {
    // Init Variables
    var user = req.body.userToUpdate;
    if(!user.displayName || user.displayName == ''){
            user.displayName = user.firstName + ' ' + user.lastName;
    };
    if (user) {
        // User.findOne({_id : user._id}, function(err, userObject){
        //     userObject.firstName = user.firstName;
        //     userObject.lastName = user.lastName; 
        //     userObject.displayName = user.displayName
        //     userObject.shortProfile = user.shortProfile
        //     userObject.educationAndExperience = user.educationAndExperience;
        //     userObject.isActive = user.isActive;
        //     userObject.save(function(err) {
        //         if (err) {
        //             return res.status(400).send({
        //                 message: errorHandler.getErrorMessage(err)
        //             });
        //         } else {
        //                 res.json(user);
        //             }
        //     });
        // });

        User.findOneAndUpdate( {_id : user._id}, { $set: {
            firstName : user.firstName,
            lastName : user.lastName,
            displayName : user.displayName,
            shortProfile : user.shortProfile,
            educationAndExperience : user.educationAndExperience,
            isActive : user.isActive
        }},function(err, user){
             if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                        res.json(user);
                    }
            } );

    } else {
        res.status(400).send({
            message: 'User not exist'
        });
    }
};

/**
 * Add files
 */
exports.uploadFile = function(req, res) {
    // Init Variables
    var user = req.user;
    var message = null;

    if (user) {
        // Merge existing user
         if(req.body.file.filesize > 10000000){
            return res.status(400).send({
                            message: 'File size is larger then 10MB'
                        });
        }
        user = _.extend(user, req.body);
        user.updated = Date.now();
        user.displayName = user.firstName + ' ' + user.lastName;
        var file = new Buffer(req.body.file.base64, 'base64');
        var fs = require('fs');
        var ext = req.body.file.filetype.split('/');
        var filename = user._id + user.files.length + '.' + ext[1];
        fs.writeFile('./public/uploads/' + filename, file, function(err) {
            if (err) {
                res.send(err);
            } else {
                user.files.push(filename);

                user.save(function(err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        req.login(user, function(err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                });


            }
        });

    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }



};
exports.deleteFile = function(req, res){
    User.findOneAndUpdate( {_id: req.user._id}, { $pull: {files: req.param('fileName') } },function(err, result){
         if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
        }
    } );
};

exports.searchByCompany = function(req, res) {
    User.findOne({
        companyName: req.param('companyname'),
        isActive : true,
        isVerified : true
    }, function(err, _user) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json(_user);
        }

    });



};
exports.searchByName = function(req, res) {
    User.findOne({
        username: req.param('username')
    }, function(err, _user) {
        if (err) {
            res.status(400).send(err);
        } else {

            res.json(_user);
        }

    });


};

exports.searchByFreelancer = function(req, res) {
    User.find({
    roles: { $elemMatch: { $in : ['freelancer']}},
    isActive : true,
    isVerified : true     
    }).sort('-created').populate('skills').populate('categories').populate('subcategories').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};
exports.loadAllUsers = function(req, res) {
    User.find({
    roles: { $elemMatch: { $in : ['freelancer','client']} } 
    }).sort('-created').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};

exports.loadInterestedUsers = function(req, res) {
    InterestedClients.find({
    
    }).sort('-created').exec(function(err, clients) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            InterestedTalents.find({
    
                }).sort('-created').exec(function(err, talents) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        var users = {};
                        users.clients = clients;
                        users.talents = talents;
                        res.jsonp(users);
                    }
                });
            // res.jsonp(users);
        }
    });
};

exports.searchByHaveCompany = function(req, res) {
    User.find({
        companyName:{$ne : ''},
        isActive : true,
        isVerified : true
    }).sort('-created').populate('skills').populate('categories').populate('subcategories').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var _users = _.filter(users, function(u){
                console.log(u.roles[0]);
                return u.roles[0] !== 'admin';
            });
            res.jsonp(_users);
        }
    });
};

exports.searchByCategory = function(req, res) {
    User.find({
        categories: {$in : [req.param('categoryId')]},
        roles: { $elemMatch: { $in : ['freelancer']}},
        isActive : true,
        isVerified : true
    }).sort('-created').populate('skills').populate('categories').populate('subcategories').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};
exports.searchBySubcategory = function(req, res) {
    User.find({
        subcategories: {$in : [req.param('subCategoryId')]},
        roles: { $elemMatch: { $in : ['freelancer']}},
        isActive : true,
        isVerified : true
    }).sort('-created').populate('skills').populate('categories').populate('subcategories').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};
exports.searchBySkills = function(req, res) {
    User.find({
        skills: {$in : [req.param('skillId')]},
        roles: { $elemMatch: { $in : ['freelancer']}},
    }).sort('-created').populate('skills').populate('categories').populate('subcategories').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};
exports.uploadProfilePicture = function(req, res) {
    console.log(req.body.userId);
    
    User.find({_id : req.body.userId}).exec(function(err, userToUpdate) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        if(req.body.file.filesize > 10000000){
                                return res.status(400).send({
                                                message: 'File size is larger then 10MB'
                                            });
                            }
                        var fs = require('fs');
                        var message = null;
                        var file = new Buffer(req.body.file.base64, 'base64');
                        var ext = req.body.file.filetype.split('/');
                        var filename = userToUpdate[0]._id + '.' + ext[1];
                        fs.writeFile('./public/uploads/' + filename, file, function(err) {
                            if (err) {
                                res.send(err);
                            } else {
                                    User.update({_id:req.body.userId}, {$set:{profilePicture : filename}}, function(err, result) {
                                    if (err) {
                                            return res.status(400).send({
                                                message: errorHandler.getErrorMessage(err)
                                            });
                                        } else {
                                            res.jsonp({ "filename": filename});                 
                                        }
                                    });    

                            }
                        });
            }
                });

        

     
};

exports.browseFreelancer = function(req, res) {
    var query = req.param('query');
    var regex = new RegExp(query, 'i');
    // ,   query = { description: regex };

    User.find({
        $and: [{
            $or: [{
                'displayName': regex
            }, {
                'firstName': regex
            }, {
                'lastName': regex
            }
            ],
            companyName : '',
            roles: { $elemMatch: { $in : ['freelancer']}},
            isActive : true,
            isVerified : true
        }]
    }).sort('-created').populate('categories').populate('subcategories').populate('skills').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};
/**
 * Send User
 */
exports.me = function(req, res) {
    res.json(req.user || null);
};

exports.searchByRating = function(req, res){
    var rating = parseInt( req.param('rating'));
      User.find({
        $and : [{averageRating : { $gte : rating}}, {averageRating : { $lt : rating+1}}],
        isActive : true,
        isVerified : true,
        roles: { $elemMatch: { $in : ['freelancer']}}
    }).sort('-created').populate('categories').populate('subcategories').populate('skills').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};

exports.searchByReviews = function(req, res){
    var reviewCount = parseInt( req.param('reviewCount'));
    if (reviewCount<5) {
        User.find({
        history : {$size:reviewCount},
        roles: { $elemMatch: { $in : ['freelancer']}},
        isActive : true,
        isVerified : true
            }).sort('-created').populate('categories').populate('subcategories').populate('skills').exec(function(err, users) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(users);
                }
            });
    }else{
        User.find({
        history : {$exists:true}, $where:'this.history.length >= '+reviewCount,
        isActive : true,
        roles: { $elemMatch: { $in : ['freelancer']}},
        isVerified : true
            }).sort('-created').populate('categories').populate('subcategories').populate('skills').exec(function(err, users) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(users);
                }
            });
    };
};

exports.searchByLocation = function(req, res){
    var searchCriteria = {};
    if(req.param('city') && req.param('city') !== '0' && req.param('city') !== ''){
        searchCriteria.city = req.param('city');
    };
    if(req.param('location') != 'undefined' && req.param('location') !== '0' && req.param('location') !== ''){
        searchCriteria.location = req.param('location');
    };
    searchCriteria.isActive = true;
    searchCriteria.isVerified = true;
    searchCriteria.roles = {$elemMatch: { $in : ['freelancer']}};
    User.find(searchCriteria).sort('-created').populate('categories').populate('subcategories').populate('skills').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};
exports.filterUsers = function(req, res){
    var searchCriteria = {};
    var categoryId = req.param('categoryId');
    var subcategoryId = req.param('subcategoryId');
    var city = req.param('city');
    var location = req.param('location');
    var atleastFeedback = parseInt(req.param('atleastFeedback'));
    var atleastReviews = parseInt(req.param('atleastReviews'));
    var skip = 0;
    var limit = 1000;
    if(parseInt(req.param('pageSize')) && parseInt(req.param('page'))){
        skip = parseInt(req.param('pageSize')) * (parseInt(req.param('page'))-1);
    };
    if(parseInt(req.param('pageSize'))){
        limit = parseInt(req.param('pageSize'));
    };
    if(categoryId && categoryId!=='' && categoryId!=='undefined'){
        searchCriteria.categories = {$in : [categoryId]};
    };
    if(subcategoryId && subcategoryId!=='' && subcategoryId!=='undefined'){
        searchCriteria.subcategories = {$in : [subcategoryId]};
    };
    if(location && location!=='' && location!=='undefined'){
        searchCriteria.location = location;
    };
    if(city && city!=='' && city!=='undefined'){
        searchCriteria.city = city;
    };
    if(atleastFeedback && atleastFeedback!=='' && atleastFeedback!=='0'){
        searchCriteria.averageRating = {$gte : atleastFeedback};
    };
    if(atleastReviews && atleastReviews!=='' && atleastReviews!=='undefined'){
        searchCriteria.history = {$exists:true};
        searchCriteria.$where = 'this.history.length >= '+atleastReviews;
    };


    console.log(searchCriteria);
    searchCriteria.isActive = true;
    searchCriteria.isVerified = true;
    searchCriteria.roles = {$elemMatch: { $in : ['freelancer']}};
    User.find(searchCriteria).skip(skip).limit(limit).sort('-created').populate('categories').populate('subcategories').populate('skills').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
             User.count(searchCriteria, function(err, count) {
                var data = {
                    users: users,
                    count: count
                }
                res.jsonp(data);
              });
        }
    });
};
exports.checkRelation = function(req, res){
    Job.find({$and:[{user: req.param('userId')}, {awardedTo: req.param('visitorId')}]}).exec(function(err, job){
        if(err){
               return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });     
        }else if(job && job.length){
            res.jsonp(job);
        }else{
            Job.find({$and:[{user: req.param('visitorId')}, {awardedTo: req.param('userId')}]}).exec(function(err, job){
                if(err){
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }else{
                        res.jsonp(job);
                };
            });
        };
    });
};

exports.getUserById = function(req, res){
    User.findOne({
        _id:req.param('userId'),
        isActive : true,
        isVerified : true

    }).sort('-created').populate('skills').exec(function(err, user) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(user);
        }
    });    
};

exports.emailVerification = function(req, res) {
    User.findOneAndUpdate( {emailVerificationToken: req.params.token}, { $set: {isVerified: true}},function(err, user){
             if (err || !user) {
                return res.redirect('/#!/user/email-verification-error');
            } else {
                user.password = undefined;
                user.salt = undefined;
                req.login(user, function(err) {
                    if (err) {
                            res.status(400).send(err);
                        } else {
                            if (user.roles[0] === 'client') {
                                return res.redirect('/#!/contractors/');
                            } else if (user.roles[0] === 'freelancer') {
                                return res.redirect('/#!/settings/profile/true');
                            } else if (user.roles[0] === 'admin') {
                                return res.redirect('/#!/categories');
                            } else{
                                return res.redirect('/');
                            };
                        }
                    });
            }
        });
};

exports.sendInvite = function(req, res) {
   var jobId = req.param('jobId');
   var userId = req.param('invitedUserId');
   User.findOne({ _id: userId }, function (err, person) {
                if (err){
                   
                }else if(person){
                        var emailSubject = 'Job Invite';
                        var emailHtml = 'Hi Mr. \''+person.displayName+'\',  <br><br> Your have been invited for a job.'
                                            + '<br>Click on the link to view it. '+'http://' + req.headers.host+ '/#!/jobs/' + jobId;
                    var mailOptions = {
                        to: person.email,
                        from: config.mailer.from,
                        subject: emailSubject,
                        html: emailHtml
                    };
                    ses.sendEmail(mailOptions);
                };
            });

   console.log(jobId + userId);
};

exports.updateRole = function(req, res){
    var role = req.param('membership');
    var username = req.param('username');
    var updateData = {};
    updateData.roles = [role];
    if(req.param('username') && req.param('username')!== 'undefined'){
            updateData.username = username;
    }
    if(role === 'freelancer'){
        if(req.param('country') && req.param('country')!== 'undefined'){
            updateData.country = req.param('country');
        }
        if(req.param('city') && req.param('city')!== 'city'){
            updateData.city = req.param('city');   
        }
        if(req.param('location') && req.param('location')!== 'undefined'){
            updateData.location = req.param('location');
        }
    }

    var userId = req.param('userId');
    var role = req.param('role');
        User.findOneAndUpdate( {_id: userId}, { $set: updateData},function(err, user){
             if (err) {
            } else {
                res.jsonp(user);
            }
        });
    // var userId = req.param('userId');
    // var role = req.param('role');
    //     User.findOneAndUpdate( {_id: userId}, { $set: {roles: [role]}},function(err, user){
    //          if (err) {
    //         } else {
    //             res.jsonp(user);
    //         }
    //     });
};

