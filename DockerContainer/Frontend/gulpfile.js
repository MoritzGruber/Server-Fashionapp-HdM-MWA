'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    runSequence = require('run-sequence'),
    livereload = require('gulp-livereload');


// watch changes in php or scss files
gulp.task('default', ['watch']);

// compress css and images
gulp.task('watch', function (done) {
    runSequence('sass:watch', 'html:watch', 'js:watch', function () {
        done();
    });
});

gulp.task('sass', function () {
    return gulp.src('./app/resources/scss/styles.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./app/resources/css'))
        .pipe(livereload());
});

gulp.task('sass:watch', function () {
    livereload.listen();
    gulp.watch('./app/resources/scss/**/*.scss', ['sass']);
});

gulp.task('html', function () {
    return gulp.src('./app/components/views/**/*.html')
        .pipe(livereload());
});

gulp.task('html:watch', function () {
    livereload.listen();
    gulp.watch('./app/components/views/**/*.html', ['html']);
});

gulp.task('js', function () {
    return gulp.src('./app/components/controllers/**/*.js')
        .pipe(livereload());
});

gulp.task('js:watch', function () {
    livereload.listen();
    gulp.watch('./app/components/controllers/**/*.js', ['js']);
});