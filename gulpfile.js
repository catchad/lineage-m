var gulp = require('gulp');
// var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var compass = require('gulp-compass');
var jade = require('gulp-jade');
var webserver = require('gulp-webserver');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');

// image
gulp.task('clean-images', function() {
    gulp.src('build/assets/images/*', {
            read: false
        })
        .pipe(clean());
});
gulp.task('images', ['clean-images'], function() {
    gulp.src('src/assets/images/**')
        .pipe(plumber())
        .pipe(gulp.dest('build/assets/images/'));
});

// SCSS to CSS
gulp.task('clean-css', function() {
    gulp.src('build/assets/styles/*', {
            read: false
        })
        .pipe(clean());
});
gulp.task('css', ['clean-css'], function() {
    gulp.src('src/assets/styles/*.scss')
        .pipe(plumber())
        .pipe(compass({
            css: 'src/assets/styles/',
            sass: 'src/assets/styles/',
            image: 'src/assets/images/',
            sourcemap: false,
            style: 'nested', // nested, expanded, compact, compressed
            comments: false
        }))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        // .pipe(uglifycss())
        .pipe(gulp.dest('build/assets/styles/'))
});

// js
gulp.task('clean-js', function() {
    gulp.src('build/assets/scripts/*', {
            read: false
        })
        .pipe(clean());
});
gulp.task('concat-js', function() {
    // return gulp.src(['src/assets/scripts/lib/jquery-3.0.0.min.js', 'src/assets/scripts/lib/TweenMax.min.js', 'src/assets/scripts/lib/device.min.js', 'src/assets/scripts/lib/imagesloaded.pkgd.min.js', 'src/assets/scripts/lib/slick.min.js', 'src/assets/scripts/lib/easeljs-0.8.2.min.js', 'src/assets/scripts/lib/preloadjs-0.6.2.min.js'])
    //   .pipe(concat('lib.js'))
    //   .pipe(gulp.dest('build/assets/scripts/'));
});

gulp.task('js', ['clean-js', 'concat-js'], function() {
    gulp.src('src/assets/scripts/*.js')
        .pipe(plumber())
        // .pipe(babel({
        //     presets: ['es2015']
        // }))
        // .pipe(uglify())
        .pipe(gulp.dest('build/assets/scripts/'));
});

// JADE to HTML
gulp.task('clean-html', function() {
    gulp.src('build/*.html', {
            read: false
        })
        .pipe(clean());
});
gulp.task('html', ['clean-html'], function() {
    gulp.src('src/[^_]*.jade')
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('build/'))
})

// 監聽檔案
gulp.task('watch', function() {
    gulp.watch('src/assets/styles/*.scss', ['css']);
    gulp.watch('src/assets/scripts/*', ['js']);
    gulp.watch('src/assets/images/**', ['images']);
    gulp.watch('src/*', ['html']);
});

// 本機伺服器
gulp.task('webserver', function() {
    gulp.src('build/')
        .pipe(webserver({
            // host: '0.0.0.0',
            port: 9527,
            livereload: true,
            directoryListing: false,
            open: true,
            fallback: 'index.html'
        }));
});

gulp.task('default', ['html', 'css', 'js', 'images', 'webserver', 'watch']);