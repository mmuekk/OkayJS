var gulp = require('gulp');
var gutil = require('gulp-util');
var typescript = require('gulp-tsc');

gulp.task('compile', function() {
  gulp.src(['src/okay.ts'])
    .pipe(typescript({out: 'okay.js', module: 'AMD', target: 'ES5'}))
    .pipe(gulp.dest('release'));
});

gulp.task('watch', function() {
  gulp.watch('src/*.ts', function() {
    gulp.run('compile');
  });
});