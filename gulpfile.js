var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var concatCSS = require('gulp-concat-css');
var rename = require('gulp-rename');
var pug = require('gulp-pug');
var inject = require('gulp-inject');
var lib = require('bower-files')();
var rimraf = require('gulp-rimraf');
var runSequence = require('run-sequence');
var merge = require('merge2');
var replace = require('gulp-replace');
var gulpif = require('gulp-if');

//package.json variables
var fs = require('fs');
var package = JSON.parse(fs.readFileSync('./package.json'));
var name = package.name;

// environment variable
var env = 'development';

// ===============================
// JS BEGIN

gulp.task('style', function () {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs());
});

gulp.task('js-libs', function () {
    return gulp.src(lib.ext('js').files)
        .pipe(gulpif(env === 'development', gulp.dest('temp/js'))) // raw lib .js output
        .pipe(concat('lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));
});

gulp.task('js-custom', ['style'], function() {
    return gulp.src(['src/js/custom_lib/*.js', 'src/js/*.js'])
        .pipe(concat(name + '.min.js'))
        .pipe(gulpif(env === 'production', uglify())) // minimize javascript if production
        .pipe(gulp.dest('public/js'))
        .pipe(browserSync.stream());
});

// JS END
// ===============================

// ===============================
// CSS BEGIN

// wrong directory "../images"
gulp.task('lightbox2', function() {
    return gulp.src('src/lib/lightbox2/dist/css/lightbox.css')
        .pipe(replace('../images/', '../img/'))
        .pipe(gulp.dest('src/lib/lightbox2/dist/css'));
});

gulp.task('css-libs', ['lightbox2'], function() {
    return merge(
        gulp.src(lib.ext('less').files)
            .pipe(less()),
        gulp.src(lib.ext('css').files)
        )
        .pipe(gulpif(env === 'development', gulp.dest('temp/css'))) // raw lib .css output
        .pipe(cleanCSS({compatibility: 'ie8', rebase: false}))
        .pipe(concatCSS('lib.min.css', {rebaseUrls: false}))
        .pipe(gulp.dest('public/css'));
});

gulp.task('css-custom', function() {
    return merge(
            gulp.src('src/css/custom_lib/*.css'),
            gulp.src('src/less/' + name + '.less')
                .pipe(less())
                .pipe(gulpif(env === 'development', gulp.dest('src/css'))) // development CSS output
        )
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concatCSS(name + '.min.css', {rebaseUrls: false}))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream());
});

// CSS END
// ===============================

// ===============================
// INJECT BEGIN

gulp.task('images', function () {
    return merge(
            gulp.src(lib.ext('gif').files),
            gulp.src(lib.ext('png').files),
            gulp.src(lib.ext('jpg').files)
        )
        .pipe(gulp.dest('public/img'));
});

gulp.task('inject', ['js-libs', 'js-custom', 'css-libs', 'css-custom', 'images'], function () {
    var injectSrc = gulp.src([
                            'public/css/lib.min.css',
                            'public/css/*.css',
                            'public/js/lib.min.js',
                            'public/js/*.js',], {
        read: false
    });
    var injectOptions = {
        ignorePath: '/public/',
        addRootSlash: false
    };
    return gulp.src('src/pug/*.pug')
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('src/pug'));
});

// INJECT END
// ===============================

gulp.task('cleanup', function() {
    return gulp.src(['public/js/*.js','public/css/*.css', 'public/*.html'], {read: false})
        .pipe(rimraf());
});

gulp.task('pug-init', ['inject'], function() {
    return gulp.src('src/pug/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('public'));
});

gulp.task('pug', function() {
    return gulp.src('src/pug/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('public'))
        .pipe(browserSync.stream());
});

gulp.task('browserSync', ['pug-init'], function() {

    browserSync.init({
        server: {
            baseDir: 'public'
        }
    });

    gulp.watch('src/less/*.less', ['css-custom']);
    gulp.watch('src/js/*.js', ['js-custom']);
    gulp.watch('src/pug/*.pug', ['pug']);
    // gulp.watch('public/*.html').on('change', browserSync.reload);
    gulp.watch('public/locales/*/*.json').on('change', browserSync.reload);
    // gulp.watch('public/js/*.js').on('change', browserSync.reload);
    // gulp.watch('public/css/*.css').on('change', browserSync.reload);
});

gulp.task('default', function(cb) {
    runSequence('cleanup',
                'browserSync',
                cb);
});

