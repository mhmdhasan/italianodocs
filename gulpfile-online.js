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
var cdnizer = require("gulp-cdnizer");
var autoprefixer = require('gulp-autoprefixer');
var npmDist = require('gulp-npm-dist');
var rename = require('gulp-rename');

var sass = require('gulp-sass');

var bs = require('browser-sync').create();

var path = require('path');

var srcMarkupFiles = 'src/**/*.jade'
var srcSassFiles = 'src/scss/style.*.scss'

var distMainDir = 'online/'
var distStyleDir = 'online/css/'

var srcImageFiles = 'src/img/**'
var distImageDir = 'online/img/'
var distVendorDir = 'online/vendor/'


var copy = ['js/**', 'img/**', 'css/**', 'fonts/**', 'favicon.png']

var config = {
    autoprefixer: {
        cascade: false
    },
    browserSync: {
        enabled: true
    },
    cdnizer: {
        enabled: false,
        defaultCDNBase: "https://d19m59y37dris4.cloudfront.net/places/1-0",
        files: ['img/*', 'js/*', 'css/*', 'vendor/**']
    },
    sass: {
        outputStyle: 'compressed',
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
            styleSwitcher: true
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
        .pipe(sass(config.sass).on('error', sass.logError))
        .pipe(autoprefixer(config.autoprefixer))
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

        //filter out partials (in jade includes)
        .pipe(filter(['**', '!src/_jade-includes/*']))

        //process jade templates
        .pipe(jade({
            pretty: true,
            locals: config.jade.locals
        }))

        .pipe(gulpif(config.cdnizer.enabled, cdnizer(config.cdnizer)))

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