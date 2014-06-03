/**
 * Created by Jim Sangwine on 14/05/2014.
 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Require dependencies (defined in www/packages.json)
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var gulp = require('gulp');

var clean = require('gulp-clean');
var sass = require('gulp-sass');  
var browserSync = require('browser-sync');
var concat = require('gulp-concat');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Setup paths and file lists
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var paths = {
    source :    './source/',
    sass :      './source/sass/screen.scss',
    css :       './source/css',
    js :        './source/js/*.js',
    vendor :        './source/js/vendor/*.js',
    resources : './source/resources/**/*',
    html :      './source/index.html',
    dist :      {
        main:       './deploy/', 
        css :       './deploy/css',
        js  :       './deploy/js',
        html:       './deploy/',
        resources:  './deploy/resources'
    }
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Aggregated tasks
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
gulp.task('clean', function() {
 return gulp.src(paths.dist.main)
 .pipe(clean());
});

gulp.task('sass', function () {  
    gulp.src('./source/sass/screen.scss')
        .pipe(sass({includePaths: ['scss']}))
        .pipe(gulp.dest('./source/css'));
});

gulp.task('browser-sync', function() {  
    browserSync.init(["./source/css/*.css", "./source/js/*.js"], {
        server: {
            baseDir: "./source"
        }
    });
});


gulp.task('copy', ['clean'], function() {
    gulp.src(paths.html)
        .pipe(gulp.dest(paths.dist.html));

    gulp.src(paths.js)
        .pipe(concat('all.js'))
        .pipe(gulp.dest(paths.dist.js));

    gulp.src(paths.vendor)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.dist.js));
});

// Reload all Browsers
gulp.task('reloadnow', function () {
    browserSync.reload();
});



gulp.task('default', ['sass', 'browser-sync'], function () {  
    gulp.watch("./source/sass/*.scss", ['sass']);
    gulp.watch("./source/*.html", ['reloadnow']);
    gulp.watch("./source/js/*.js", ['reloadnow']);
});
