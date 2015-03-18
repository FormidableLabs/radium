var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('eslint', function () {
  gulp.src('./modules/**/*.js')
    .pipe(eslint())
    .pipe(eslint.formatEach('stylish', process.stderr))
    .pipe(eslint.failAfterError());
});

gulp.task('check', ['eslint']);
