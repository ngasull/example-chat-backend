var gulp = require('gulp')
var mocha = require('gulp-mocha')
var istanbul = require('gulp-istanbul')
var coveralls = require('gulp-coveralls');

gulp.task('test', function (cb) {

    var specs = 'src/**/*.spec.js'

    gulp.src(['src/**/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp
                .src(specs, {
                    read: false
                })
                .pipe(mocha())
                .pipe(istanbul.writeReports())
                .on('end', cb)
        })
})
