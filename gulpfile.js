var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var less = require('gulp-less');
var cleanCss = require("gulp-clean-css");
var minifyHtml = require("gulp-minify-html");
var jshint = require("gulp-jshint");
var imagemin = require('gulp-imagemin');
var connect = require('gulp-connect');
var gulpif = require('gulp-if');

gulp.task('watchs', function(){
    gulp.watch('src/*.html', gulp.series('html'));
    gulp.watch('src/images/*', gulp.series('image'));
    gulp.watch('src/css/*.css', gulp.series('css'));
    gulp.watch('src/js/*.js', gulp.series('js'));
});

gulp.task('connect', function(){
    connect.server({
        root: 'dev', 
        ip: 'localhost', 
        port: 8080,
        livereload: true
    });
});

gulp.task('html', function(){
    return gulp.src('src/*.html')
    .pipe(gulpif(env === 'dist', minifyHtml()))
    .pipe(gulp.dest(env))
    .pipe(connect.reload());
});

gulp.task('css', function(){
    return gulp.src('src/css/*.css')
    //.pipe(less())
    .pipe(gulpif(env === 'dist', cleanCss()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(env + '/css')) 
    .pipe(connect.reload());
});

gulp.task('image', function(){
    return gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest(env + '/images'))
});

gulp.task('js', function(){
    return gulp.src('src/js/*.js')
    	.pipe(jshint())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulpif(env === 'dist', uglify()))
        .pipe(gulp.dest(env + '/js')) 
        .pipe(connect.reload());
});

var env = 'dev';
gulp.task('setenv', function(done){
	env = 'dist';
	done();
});
gulp.task('run', gulp.series(gulp.parallel('connect','watchs', 'html', 'image', 'css', 'js')), function(done){
	done();
});
gulp.task('build', gulp.series('setenv', 'html', 'image', 'css', 'js'), function(done){
	done();
});