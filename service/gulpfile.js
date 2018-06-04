const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('copy-package.json', function () {
    return gulp.src('./package.json').pipe(gulp.dest('./dist'));
});

gulp.task('copy-swagger.yaml', function () {
    return gulp.src('./src/swagger.yaml').pipe(gulp.dest('./dist'));
});

gulp.task('build', function () {
    runSequence(
        'copy-package.json',
        'copy-swagger.yaml',
    );
});