'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var proposals = require('../../app/controllers/proposals.server.controller');

	// Proposals Routes
	app.route('/proposals')
		.get(proposals.list)
		.post(users.requiresLogin, proposals.create);

	app.route('/proposals/:proposalId')
		.get(proposals.read)
		.put(users.requiresLogin, proposals.hasAuthorization, proposals.update);
		// .delete(users.requiresLogin, proposals.hasAuthorization, proposals.delete);
	app.route('/proposals/upload/file').post(users.requiresLogin, proposals.uploadFile);
    app.route('/proposals/user/:userId/:jobId')
		.get(proposals.proposalByUserId);
	app.route('/proposals/listByJobId/:jobId')
		.get(proposals.listByJobId);	
	// Finish by binding the Proposal 
	app.route('/proposals/acceptByJobId')
		.post(users.requiresLogin, proposals.acceptProposalByJobId);	
	app.route('/proposals/rejectByJobId')
		.post(users.requiresLogin, proposals.rejectProposalByJobId);
	app.route('/proposals/withdrawProposal/:proposalId/:jobId')
		.post(users.requiresLogin, proposals.withdrawProposal);
	app.route('/proposals/sendReminder/:proposalId/:jobId')
		.post(users.requiresLogin, proposals.sendReminder);	
	app.route('/proposals/moderations/list')
		.get(users.requiresLogin, users.isAdmin, proposals.moderationProposals);
	app.route('/proposals/moderations/list-count')
		.get(users.requiresLogin, users.isAdmin, proposals.moderationProposalsCount);
	app.route('/proposals/approveById/:proposalId')
		.post(users.requiresLogin, users.isAdmin, proposals.approveProposalById);
	app.route('/proposals/disapproveById/:proposalId')
		.post(users.requiresLogin, proposals.disapproveProposalById);
	app.route('/proposals/add-last-message/:proposalId/:messageId')
		.post(users.requiresLogin, proposals.addLastMessage);
	app.param('proposalId', proposals.proposalByID);
};
