'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
    // User Routes
    var users = require('../../app/controllers/users.server.controller');

    // Setting up the users profile api
    app.route('/users/me').get(users.me);
    app.route('/users').put(users.update);
    app.route('/users/update-by-admin').put(users.updateUserByAdmin);
    app.route('/users/getUserById/:userId').get(users.getUserById);
    app.route('/users/upload/file').post(users.uploadFile);
    app.route('/users/delete/file/:fileName').put(users.requiresLogin, users.deleteFile);
    app.route('/users/search/company').get(users.searchByCompany);
    app.route('/users/search/username').get(users.searchByName);
    app.route('/users/seed/admin').get(users.seedAdmin);
    app.route('/users/upload/profilepicture').post(users.uploadProfilePicture);
    app.route('/users/search/freelancer').get(users.searchByFreelancer);
    app.route('/users/load/allusers').get(users.loadAllUsers);
    app.route('/users/search/incompany').get(users.searchByHaveCompany);
    app.route('/users/search/category/:categoryId').get(users.searchByCategory);
    app.route('/users/search/subcategory/:subCategoryId').get(users.searchBySubcategory);
    app.route('/users/search/skill/:skillId').get(users.searchBySkills);
    app.route('/user/search-by-rating/:rating').get(users.searchByRating);
    app.route('/user/search-by-reviews/:reviewCount').get(users.searchByReviews);
    app.route('/user/search-by-location/:city/:location').get(users.searchByLocation);
    app.route('/user/filter-users').get(users.filterUsers);
    app.route('/users/check-relation/:userId/:visitorId').get(users.checkRelation);
    app.route('/browse-freelancer').post(users.browseFreelancer);
    app.route('/user/send-invite').post(users.sendInvite);
    app.route('/user/update-role/:userId/:username/:membership/:country/:city/:location').post(users.updateRole);
    app.route('/users/load/interested-users').get(users.loadInterestedUsers);
    
    // setting up the users password api
    app.route('/users/password').post(users.changePassword);
    app.route('/auth/forgot').post(users.forgot);
    app.route('/auth/reset/:token').get(users.validateResetToken);
    app.route('/auth/email-verification/:token').get(users.emailVerification);
    app.route('/auth/reset/:token').post(users.reset);

    // Setting up the users authentication api
    app.route('/auth/signup/client').post(users.signupClient);
    app.route('/auth/signup/freelancer').post(users.signupFreelancer);
	app.route('/auth/signin').post(users.signin);
    app.route('/auth/signout').get(users.signout);

    // Setting the facebook oauth routes
    app.route('/auth/facebook').get(passport.authenticate('facebook', {
        scope: ['email']
    }));
    app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));

    // Setting the twitter oauth routes
    app.route('/auth/twitter').get(passport.authenticate('twitter'));
    app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));

    // Setting the google oauth routes
    app.route('/auth/google').get(passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));
    app.route('/auth/google/callback').get(users.oauthCallback('google'));

    // Setting the linkedin oauth routes
    app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
    app.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

    // Setting the github oauth routes
    app.route('/auth/github').get(passport.authenticate('github'));
    app.route('/auth/github/callback').get(users.oauthCallback('github'));

    // Finish by binding the user middleware
    app.param('userId', users.userByID);
};
