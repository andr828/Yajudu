var gulp = require('gulp');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint')
var gls = require('gulp-live-server');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
// gulp.task('default', function(cb) {
//     runSequence('serve', 'lint', 'test', 'watch');
// });


gulp.task('lint', function() {
    gulp.src('app/*/*.js')
        .pipe(jshint())
});

// gulp.task('test', function() {
//     setTimeout(function() {

//         gulp.src('app/tests/*.js')
//             .pipe(mocha({
//                 reporter: "nyan",
//             }));
//     }, 6000);

// });

gulp.task('serve', function() {
    // Start the server at the beginning of the task 
    var server = gls.new('server.js');
    server.start();
    gulp.watch(['server.js', 'app/routes/*.js', 'app/models/*.js', 'app/controllers/*.js', 'app/controllers/users/*.js'], server);
    livereload.listen(35732, function(err) {
        if(err) return console.log(err);
    });
});


// gulp.task('less', function () {	
// 	console.log("inside gulp less");
//   return gulp.src('./public/lib/bootstrap-material-design/less/material.less')
//     .pipe(less())
//     .pipe(gulp.dest('./public/lib/bootstrap-material-design/dist/css'))
//     .pipe(livereload());
// });

// {
//       paths: [ path.join(__dirname, 'less', 'includes') ]
//     }
// gulp.task('watch', function() {

    // gulp.watch('app/tests/*.js', ['test']);
// });


gulp.task('default', ['serve']);