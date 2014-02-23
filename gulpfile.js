var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var typescript = require('gulp-tsc');

gulp.task('compile', function(cb) {
  return gulp.src(['src/okay.ts'])
    .pipe(typescript({out: 'okay.js', module: 'AMD', target: 'ES5', declaration: true}))
    .pipe(gulp.dest('release'));
});

gulp.task('amd', ['compile'], function() {
  gulp.src(['src/amd.head', 'release/okay.js', 'src/amd.foot'])
    .pipe(concat('okay.js'))
    .pipe(gulp.dest('amd'));
});

gulp.task('commonjs', ['compile'], function() {
  gulp.src(['release/okay.js', 'src/common.foot'])
    .pipe(concat('okay.js'))
    .pipe(gulp.dest('commonjs'));
});

gulp.task('angular', ['compile'], function() {
  gulp.src(['src/angular.head', 'release/okay.js', 'src/angular.foot'])
    .pipe(concat('okay.js'))
    .pipe(gulp.dest('angular'));
});

gulp.task('watch', function() {
  gulp.watch('src/okay.ts', ['default']);
});

gulp.task('default', function() {
  gulp.start('compile', 'amd', 'commonjs', 'angular');
});