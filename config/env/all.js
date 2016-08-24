'use strict';

module.exports = {
	app: {
		title: 'Yajidu',
		description: 'A marketplace for Students and Teachers',
		keywords: 'Marketplace, Students, Teachers, Photographer'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: 'MEAN',
	// The name of the MongoDB collection to store sessions in
	sessionCollection: 'sessions',
	// The session cookie settings
	sessionCookie: {
		path: '/',
		httpOnly: true,
		// If secure is set to true then it will cause the cookie to be set
		// only when SSL-enabled (HTTPS) is used, and otherwise it won't
		// set a cookie. 'true' is recommended yet it requires the above
		// mentioned pre-requisite.
		secure: false,
		// Only set the maxAge to null if the cookie shouldn't be expired
		// at all. The cookie will expunge when the browser is closed.
		maxAge: null,
		// To set the cookie in a specific domain uncomment the following
		// setting:
		// domain: 'yourdomain.com'
	},
	// The session cookie name
	sessionName: 'connect.sid',
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				// '//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css',
				'public/lib/bootstrap-material-design/dist/css/ripples.min.css',
				'public/lib/bootstrap-material-design/dist/css/material.css',
				'public/lib/bootstrap-material-design/dist/css/roboto.min.css',
				'public/lib/angular-datepicker/dist/index.css',
				'public/css/jquery-ui.css'

			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/angucomplete-alt/dist/angucomplete-alt.min.js',
				'public/lib/angular-base64-upload/dist/angular-base64-upload.min.js',
				'public/lib/ng-lodash/build/ng-lodash.min.js',
				'public/lib/moment/min/moment.min.js',
				'public/lib/angular-moment/angular-moment.min.js',
				// 'public/lib/angular-datepicker/app/scripts/datePicker.min.js',
				// 'public/lib/angular-datepicker/app/scripts/datePickerUtils.min.js',
				// 'public/lib/angular-datepicker/app/scripts/input.js',
				'public/lib/bootstrap-material-design/dist/js/ripples.min.js',
				'public/lib/bootstrap-material-design/dist/js/material.min.js',
				'public/js/jquery-ui.js',
				'public/js/validator.min.js',
				'public/lib/angular-paging/src/paging.js',
				'public/lib/angular-datetime/dist/datetime.js'
				// 'public/lib/bootstrap-material-design/dist/js/roboto.min.js'
				


			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
