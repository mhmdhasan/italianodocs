var gulp = require('gulp');

var jadeInheritance = require('gulp-jade-inheritance');
var jade = require('gulp-jade');
var changed = require('gulp-changed');
var cached = require('gulp-cached');
var gulpif = require('gulp-if');
var filter = require('gulp-filter');
var del = require('del');
var npmDist = require('gulp-npm-dist');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var bs = require('browser-sync').create();
var path = require('path');

var srcMarkupFiles = 'src/**/*.jade'
var srcSassFiles = 'src/scss/style.default.scss'

var distMainDir = 'dist/'
var distStyleDir = 'dist/css/'
var distVendorDir = 'dist/vendor/'

var copy = ['js/**', 'img/**', 'css/**', 'fonts/**', 'favicon.png']

var config = {
    browserSync: {
        enabled: true
    },
    sass: {
        outputStyle: 'nested',
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

function reload(done) {
    bs.reload();
    done();
}

function serve(done) {
    bs.init({
        server: {
            baseDir: distMainDir
        }
    });
    done();
}

gulp.task('clean', function () {
    return del([
        distMainDir + '**/*'
    ]);
});

gulp.task('sass', function () {
    return gulp.src(srcSassFiles)
        .pipe(sass(config.sass).on('error', sass.logError))
        .pipe(gulp.dest(distStyleDir))
        .pipe(bs.reload({
            stream: true
        }));
});

gulp.task('jade', function () {
    return gulp.src(srcMarkupFiles)

        //only pass unchanged *main* files and *all* the partials
        .pipe(changed(distMainDir, {
            extension: '.html'
        }))

        //filter out unchanged partials, but it only works when watching
        .pipe(gulpif(global.isWatching, cached('jade')))

        //find files that depend on the files that have changed
        .pipe(jadeInheritance({
            basedir: 'src'
        }))

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
    return gulp.src(npmDist({
            copyUnminified: true
        }), {
            base: './node_modules/'
        })
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace(/\/distribute/, '').replace(/\\distribute/, '').replace(/\/dist/, '').replace(/\\dist/, ''); 
        }))
        .pipe(gulp.dest(distVendorDir));
});

gulp.task('set-watch', function (done) {
    global.isWatching = true;
    done();
});

function watch(done) {

    gulp.watch("src/scss/**/*.scss", gulp.series('sass'));
    gulp.watch("src/**/*.jade", gulp.series('jade', reload));

    gulp.watch(getFolders('src', copy), gulp.series('copy', reload));

    console.log('Watching...');

    done();
}

gulp.task('watch', gulp.series(gulp.parallel('set-watch', 'jade', 'copy', 'vendor'), serve, watch));

var getFoldersSrc = function (base, folders) {
    return gulp.src(folders.map(function (item) {
        return path.join(base, item);
    }), {
        base: base,
        allowEmpty: true
    });
};

var getFolders = function (base, folders) {
    return folders.map(function (item) {
        return path.join(base, item);
    });
};