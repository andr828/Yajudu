'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var jobs = require('../../app/controllers/jobs.server.controller');

	// Jobs Routes
	app.route('/jobs')
		.get(jobs.list)
		.post(users.requiresLogin, jobs.create);
	
	app.route('/browse-jobs')
		.post(jobs.browse);
	app.route('/jobs/jobs-by-user-id')
		.get(jobs.browseByUserId);
	app.route('/jobs/active-jobs-by-user-id')
		.get(jobs.activeJobsByUserId);
	app.route('/browse-jobs-category/:categoryId')
		.post(jobs.browseByCategory);
	// app.route('/browse-jobs-subcategory/:subcategoryId')
	// 	.post(jobs.browseBySubcategory);
	app.route('/browse-jobs-filter')
		.get(jobs.filterJobs);
	app.route('/recently-expired-jobs')
		.get(jobs.recentlyExpiredJobs);
	app.route('/browse-jobs-chargingType/:jobType')
		.post(jobs.browseByChargingType);
	app.route('/jobs/browse-jobs-location/:city/:location')
		.get(jobs.browseByLocation);		
	app.route('/job-moderations')
		.get(users.requiresLogin, users.isAdmin, jobs.moderationJobs);
	app.route('/job-moderations-count')
		.get(users.requiresLogin, users.isAdmin, jobs.moderationJobsCount);
	app.route('/jobs-approved')
		.get(jobs.approved);
	app.route('/job-opportunities')
		.get(users.requiresLogin, jobs.opportunities);
	app.route('/jobs-closed')
		.get(users.requiresLogin, users.isAdmin, jobs.closedJobs);
	app.route('/jobs-rated')
		.get(jobs.ratedJobs);
	app.route('/jobs-rejected')
		.get(jobs.rejectedJobs);	
	app.route('/jobs/:jobId')
		.get(jobs.read)
		.put(users.requiresLogin, jobs.hasAuthorization, jobs.update);
	app.route('/jobs-by-skillId/:skillId')
		.get(jobs.jobsBySkillId);
		// .delete(users.requiresLogin, jobs.hasAuthorization, jobs.delete);
	app.route('/jobs/acceptProposal')
		.post(users.requiresLogin, jobs.acceptJobProposal);
	app.route('/job/updateJobStatus/:jobId/:jobStatus/:validity')
		.post(users.requiresLogin, jobs.updateAdminJobStatus);
	app.route('/job/renewByJobId/:jobId/:visibilityDuration')
		.post(users.requiresLogin, jobs.renewByJobId);
	// Finish by binding the Job middleware
	app.param('jobId', jobs.jobByID);
};
