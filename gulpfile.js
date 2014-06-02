/**
 * Created by Jim Sangwine on 14/05/2014.
 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Require dependencies (defined in www/packages.json)
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var gulp = require('gulp');
var sass = require('gulp-sass')
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var autowatch = require('gulp-autowatch');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var jsdoc = require('gulp-jsdoc');
var jasminePhantomJs = require('gulp-jasmine2-phantomjs');
var clean = require('gulp-clean');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Wrap some operations to allow the to gracefully handle
 * and log errors so as not to disrupt the watch task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var _uglify = uglify({});
_uglify.on('error', function(e) {
    gutil.log(e);
    _uglify.end();
});

var _minifyCSS = minifyCSS({});
_minifyCSS.on('error', function(e) {
    gutil.log(e);
    _minifyCSS.end();
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Setup paths and file lists
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var paths = {
    in : {
        sass : [
            './source/sass/screen.scss',
            './source/sass/print.scss'
        ],
        js : [
            './source/js/myApp.js'
        ],
        jsvendor : [
            './source/js/vendor/vendor.lib.min.js'
        ],
        resources : './source/resources/**/*',
        html : './source/html/**/*'
    },
    out : {
        css : './deploy/css',
        css_modules : [
            './source/sass/screen.css',
            './source/sass/print.css'
        ],
        js : './deploy/js',
        resources : './deploy/resources',
        html : './deploy'
    },
    jasmine : {
        reports : {
            in : 'TEST-*.xml',
            out : './test/js/reports'
        },
        specrunner : './test/js/specrunner.html'
    },
    jsdoc : {
        template : './documentation/lib/jsdoctemplate/docstrap-master/template',
        output : './documentation/js'
    },
    watch : {
        // key = task name to run
        // value = glob or array of globs to watch
        js : [
            './source/js/*.js',
            './source/js/vendor/*/js'
        ],
        css : [
            './source/sass/*.scss'
        ],
        html : [
            './source/html/*.html'
        ],
        resources : [
            './source/resources/**/*'
        ]
    }
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Aggregated tasks
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Default task
gulp.task('default', ['test', 'js', 'css', 'html', 'resources', 'jsdoc']);

// Grouped tasks
gulp.task('js', function(callback) {
    runSequence('jshint', 'concat_js', 'concat_js_vendor', 'minify_js', callback);
});
gulp.task('css', function(callback) {
    runSequence('sass', 'autoprefix', 'concat_css', 'minify_css', callback);
});
gulp.task('test', function(callback) {
    runSequence('test_js', 'move_jasmine_reports', callback);
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Watch task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('watch', function(cb) {
    autowatch(gulp, paths.watch);
    return cb();
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * SASS compilation task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('sass', function () {
    return gulp.src(paths.in.sass)
        .pipe(sass({ outputStyle : 'compact', errLogToConsole: true }))
        .pipe(gulp.dest(paths.out.css));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Auto vendor-prefixer task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('autoprefix', function() {
    return gulp.src(paths.out.css_modules)
        .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7", { cascade: true }))
        .pipe(gulp.dest(paths.out.css));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * CSS concatenation task - only useful if you have multiple css files
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('concat_css', function() {
    return gulp.src(paths.out.css_modules)
        .pipe(concat('myApp.css'))
        .pipe(gulp.dest(paths.out.css));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * CSS minification task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('minify_css', function() {
    return gulp.src(paths.out.css+'/myApp.css')
        .pipe(_minifyCSS)
        .pipe(rename(function (path) {
            path.extname = ".min.css"
        }))
        .pipe(gulp.dest(paths.out.css));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * JSHint task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('jshint', function() {
    return gulp.src(paths.in.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * JS concatenation task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('concat_js', function() {
    return gulp.src(paths.in.js)
        .pipe(concat('myApp.js'))
        .pipe(gulp.dest(paths.out.js));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * JS vendor concatenation task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('concat_js_vendor', function() {
    return gulp.src(paths.in.jsvendor)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.out.js));
});


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * JS minification task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('minify_js', function() {
    return gulp.src([paths.out.js+'/myApp.js', paths.out.js+'/vendor.js'])
        .pipe(_uglify)
        .pipe(rename(function (path) {
            path.extname = ".min.js"
        }))
        .pipe(gulp.dest(paths.out.js));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * JS documentation task
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

jsdocConf = {
    destination : paths.jsdoc.output,
    template : {
        path : paths.jsdoc.template,
        systemName : 'myApp',
        copyright : new Date().getFullYear() + ' myApp',
        theme : 'spacelab',
        linenums : true,
        collapseSymbols : true,
        outputSourceFiles : true
    },
    infos : {
        name : 'myApp',
        description : 'The JS codebase for myApp.nl',
        version : '1.0.1',
        licenses : ''
    },
    options: {
        'private': true,
        monospaceLinks: false,
        cleverLinks: false,
        outputSourceFiles: true
    }
};

gulp.task('jsdoc', function() {
    return gulp.src(paths.in.js)
        .pipe(jsdoc(jsdocConf.destination, jsdocConf.template, jsdocConf.infos, jsdocConf.options))
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Jasmine BDD JS unit testing task
 * - don't run directly - use "gulp test" instead
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('test_js', function() {
    return gulp.src(paths.jasmine.specrunner)
        .pipe(jasminePhantomJs());
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Task for moving Jasmine reports to the
 * test/js/reports directory
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('move_jasmine_reports', function() {
    return gulp.src(paths.jasmine.reports.in)
        .pipe(clean())
        .pipe(gulp.dest(paths.jasmine.reports.out));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Task for copying resources to the deploy directory
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('resources', function() {
    return gulp.src(paths.in.resources)
        .pipe(gulp.dest(paths.out.resources));
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Task for copying HTML to the deploy directory
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

gulp.task('html', function() {
    return gulp.src(paths.in.html)
        .pipe(gulp.dest(paths.out.html));
});