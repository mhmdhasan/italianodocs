var gulp = require('gulp');

var jadeInheritance = require('gulp-jade-inheritance');
var jade = require('gulp-jade');
var changed = require('gulp-changed');
var cached = require('gulp-cached');
var gulpif = require('gulp-if');
var htmlmin = require('gulp-htmlmin')
var filter = require('gulp-filter');
var del = require('del');
var runSequence = require('run-sequence');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var npmDist = require('gulp-npm-dist');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var fs = require('fs');

var sass = require('gulp-sass');

var bs = require('browser-sync').create();

var path = require('path');

var srcMarkupFiles = 'src/**/*.jade'
var srcSassFiles = 'src/scss/style.*.scss'

var distMainDir = 'distribution/'
var distStyleDir = 'distribution/css/'

var srcImageFiles = 'src/img/**'
var distImageDir = 'distribution/img/'
var distVendorDir = 'distribution/vendor/'


var copy = ['js/**', 'css/**', 'scss/**', 'img/**', 'docs/**', 'fonts/**', 'favicon.png', 'readme.txt', 'license.txt', 'credits.txt', 'custom-icons/**']


var config = {
    autoprefixer: {
        cascade: false
    },
    browserSync: {
        enabled: false
    },
    sass: {
        outputStyle: 'expanded',
        includePaths: ['src/scss', 'src/scss/modules']
    },
    htmlmin: {
        enabled: false,
        collapseWhitespace: true,
        removeComments: true,
        keepClosingSlash: true
    },
    jade: {
        locals: {
            styleSwitcher: false
        }
    }
}

gulp.task('browser-sync', function () {
    bs.init({
        server: {
            baseDir: distMainDir
        }
    });
});

gulp.task('clean', function () {
    return del([
        distMainDir + '**/*'
    ]);
});


gulp.task('sass', function () {
    return gulp.src(srcSassFiles)
        .pipe(sourcemaps.init())
        .pipe(sass(config.sass).on('error', sass.logError))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulp.dest(distStyleDir))
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distStyleDir));
});

gulp.task('images', function () {
    return gulp.src(srcImageFiles)
        .pipe(imagemin())
        .pipe(gulp.dest(distImageDir))
});

gulp.task('jade', function () {
    return gulp.src(srcMarkupFiles)

        //only pass unchanged *main* files and *all* the partials
        .pipe(changed(distMainDir, { extension: '.html' }))

        //filter out unchanged partials, but it only works when watching
        .pipe(gulpif(global.isWatching, cached('jade')))

        //find files that depend on the files that have changed
        .pipe(jadeInheritance({ basedir: 'src' }))

        //filter out partials (in jade includes)
        .pipe(filter(['**', '!src/_jade-includes/*']))

        //process jade templates
        .pipe(jade({
            pretty: true,
            locals: config.jade.locals
        }))

        //save all the files
        .pipe(gulp.dest(distMainDir));

});

gulp.task('copy', function () {
    return getFoldersSrc('src', copy)
        .pipe(changed(distMainDir))
        //save all the files
        .pipe(gulp.dest(distMainDir));

});

gulp.task('vendor', function () {
    gulp.src(npmDist({ copyUnminified: true }), { base: './node_modules/' })
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace(/\/distribute/, '').replace(/\\distribute/, '').replace(/\/dist/, '').replace(/\\dist/, ''); 
        }))
        .pipe(gulp.dest(distVendorDir));
});


gulp.task('build', function () {
    runSequence('clean',
        ['vendor', 'jade', 'sass', 'copy']
    );
});

var getFoldersSrc = function (base, folders) {
    return gulp.src(folders.map(function (item) {
        return path.join(base, item);
    }), { base: base });
};

var getFolders = function (base, folders) {
    return folders.map(function (item) {
        return path.join(base, item);
    });
};