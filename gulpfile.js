var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
// var concat = require('gulp-concat');
// var bowerFiles    = require('bower-files')();

var pkg = require('./package.json');
var jsFiles = ['*.js', 'src/**/*.js'];

var banner = [
    '/*\n',
    ' * Wiernypies.pl - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2017-' + (new Date()).getFullYear(), ' Hadron Design (http://hadron.design)\n',
    ' */\n',
    ''
].join('');

gulp.task('inject', ['minify-css', 'minify-js'], function () {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');

    var injectSrc = gulp.src(['./public/css/*.css',
                              './public/js/*.js'], {
        read: false
    });

    var injectOptions = {
        ignorePath: '/public'
    };

    var options = {
        bowerJson: require('./bower.json'),
        directory: './public/lib',
        ignorePath: '../../public'
    };

    return gulp.src('./src/views/*.pug')
        .pipe(wiredep(options))
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./src/views'));

});

gulp.task('less', function() {
    return gulp.src('src/less/faithful.less')
        .pipe(less())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('minify-css', ['less'], function() {
    return gulp.src('src/css/faithful.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('minify-js', function() {
    return gulp.src('src/js/faithfulClient.js')
        .pipe(uglify())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// gulp.task('bundle', function () {
//     gulp.src(bowerFiles.ext('js').files)
//       .pipe(concat('libs.min.js'))
//       .pipe(uglify())
//       .pipe(gulp.dest('public/js'));
// });

gulp.task('style', function () {
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs());
});

gulp.task('browserSync', function() {
    browserSync.init({
        proxy: 'localhost:8888',
        notify: false,
        // ws: true,
    });
});

var options = {
        script: 'faithful.js',
        delayTime: 1,
        env: {
            'PORT': 8888,
            'NODE_ENV': 'development'
        },
        watch: jsFiles
    };

gulp.task('nobs', ['less', 'minify-css', 'minify-js', 'style', 'inject',], function () {
    gulp.watch('src/less/*.less', ['less']);
    gulp.watch('src/css/*.css', ['minify-css']);
    gulp.watch('src/js/*.js', ['minify-js']);
    gulp.watch('src/views/*.pug');
    gulp.watch('public/js/*.js');
    gulp.watch('public/css/*.css');
    return nodemon(options)
        .on('restart', function (ev) {
            console.log('Restarting...');
        });
});

gulp.task('default', ['browserSync', 'less', 'minify-css', 'minify-js', 'style', 'inject'], function() {
    gulp.watch('src/less/*.less', ['less']);
    gulp.watch('src/css/*.css', ['minify-css']);
    gulp.watch('src/js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('src/views/*.pug', browserSync.reload);
    gulp.watch('public/js/*.js', browserSync.reload);
    gulp.watch('public/css/*.css', browserSync.reload);
    return nodemon(options)
        .on('restart', function (ev) {
            console.log('Restarting...');
        });
});