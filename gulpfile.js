'use strict';

var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    browserSync    = require('browser-sync'),
    concat         = require('gulp-concat'),
    uglify         = require('gulp-uglify'),
    cleanCSS       = require('gulp-clean-css'),
    rename         = require('gulp-rename'),
    del            = require('del'),
    cache          = require('gulp-cache'),
    autoprefixer   = require('gulp-autoprefixer'),
    fileinclude    = require('gulp-file-include'),
    gulpRemoveHtml = require('gulp-remove-html'),
    bourbon        = require('node-bourbon'),
    ftp            = require('vinyl-ftp');

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'public'
        }
    });
});

gulp.task('sass', ['headersass'], function () {
    return gulp.src('public/sass/**/*.sass')
        .pipe(sass({
            includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/styles/'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('headersass', function () {
    return gulp.src('public/sass/header.sass')
        .pipe(sass({
            includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/styles/'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('libs', function () {
    return gulp.src([
        'public/libs/jquery/dist/jquery.min.js',
        // 'app/libs/magnific-popup/magnific-popup.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js/src'));
});

gulp.task('watch', ['sass', 'libs', 'browser-sync'], function () {
    gulp.watch('public/styles/header.sass', ['headersass']);
    gulp.watch('public/sass/**/*.sass', ['sass']);
    gulp.watch('public/index.html', browserSync.reload);
    gulp.watch('public/js/**/*.js', browserSync.reload);
});


gulp.task('buildhtml', function () {
    gulp.src(['public/index.html'])
        .pipe(fileinclude({
            prefix: '@@'
        }))
        .pipe(gulpRemoveHtml())
        .pipe(gulp.dest('dist/'));
});

gulp.task('removedist', function () {
    return del.sync('dist');
});

gulp.task('build', ['removedist', 'buildhtml', 'sass', 'libs'], function () {

    var buildCss = gulp.src([
        'public/css/fonts.min.css',
        'public/css/main.min.css'
    ]).pipe(gulp.dest('dist/css'));

    var buildJs = gulp.src('public/js/**/*')
        .pipe(gulp.dest('dist/js'));

});

gulp.task('clearcache', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);
