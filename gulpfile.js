var gulp   = require('gulp'),
    $      = require('gulp-load-plugins')({ lazy: true }),
    env    = process.env.NODE_ENV || 'development',
    config = require('./config/gulp.config');

gulp.task('templates', function () {
    gulp.src(config.files.templates)
        .pipe(gulp.dest(config.folders.dest))
        .pipe($.connect.reload());
});

gulp.task('libs', function () {
    gulp.src(config.files.libs)
        .pipe($.concat(config.libs.outFile))
        .pipe(gulp.dest(config.libs.destFolder))
        .pipe($.connect.reload());
});

gulp.task('scripts', function () {
    gulp.src(config.files.scripts)
        .pipe($.babel({
            modules: 'umd'
        }))
        .pipe($.concat(config.scripts.outFile))
        .pipe($.if(env === 'production', $.uglify()))
        .pipe(gulp.dest(config.scripts.destFolder))
        .pipe($.connect.reload());
});

gulp.task('build', ['scripts', 'libs', 'templates']);

gulp.task('watch', ['build'], function () {
    gulp.watch(config.files.scripts, ['scripts']);
    gulp.watch(config.files.templates, ['templates']);
});

gulp.task('server', ['build'], function() {
    $.connect.server(config.server);
});

gulp.task('dev', ['watch', 'server']);

gulp.task('help', $.taskListing);

gulp.task('default', ['help']);
