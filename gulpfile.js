var gulp   = require('gulp'),
    $      = require('gulp-load-plugins')({ lazy: true }),
    env    = process.env.NODE_ENV || 'development',
    config = require('./config/gulp.config');

gulp.task('clean', function () {
    gulp.src(config.folders.dest)
        .pipe($.plumber())
        .pipe($.clean());
});

gulp.task('fonts', function () {
    gulp.src(config.files.fonts)
        .pipe($.plumber())
        .pipe(gulp.dest(config.fonts.destFolder))
        .pipe($.connect.reload());
});

gulp.task('images', function () {
    gulp.src(config.files.images)
        .pipe($.plumber())
        .pipe(gulp.dest(config.images.destFolder))
        .pipe($.connect.reload());
});

gulp.task('sounds', function () {
    gulp.src(config.files.sounds)
        .pipe($.plumber())
        .pipe(gulp.dest(config.sounds.destFolder))
        .pipe($.connect.reload());
});

gulp.task('json', function () {
    gulp.src(config.files.json)
        .pipe($.plumber())
        .pipe(gulp.dest(config.json.destFolder))
        .pipe($.connect.reload());
});

gulp.task('styles', function () {
    gulp.src(config.files.styles)
        .pipe($.plumber())
        .pipe($.concat(config.styles.outFile))
        .pipe($.if(env === 'production', $.minifyCss()))
        .pipe(gulp.dest(config.styles.destFolder))
        .pipe($.connect.reload());
});

gulp.task('templates', function () {
    gulp.src(config.files.templates)
        .pipe($.plumber())
        .pipe(gulp.dest(config.folders.dest))
        .pipe($.connect.reload());
});

gulp.task('libs', function () {
    gulp.src(config.files.libs)
        .pipe($.plumber())
        .pipe($.concat(config.libs.outFile))
        .pipe(gulp.dest(config.libs.destFolder))
        .pipe($.connect.reload());
});

gulp.task('scripts', function () {
    gulp.src(config.files.scripts)
        .pipe($.plumber())
        .pipe($.preprocess({
            context: {
                NODE_ENV: env
            }
        }))
        .pipe($.babel({
            modules: 'umd'
        }))
        .pipe($.concat(config.scripts.outFile))
        .pipe($.if(env === 'production', $.uglify()))
        .pipe($.if(env === 'production', $.stripDebug()))
        .pipe(gulp.dest(config.scripts.destFolder))
        .pipe($.connect.reload());
});

gulp.task('cname', function () {
    gulp.src(config.files.cname)
        .pipe($.plumber())
        .pipe(gulp.dest(config.folders.dest))
        .pipe($.connect.reload());
});


gulp.task('build', ['scripts', 'libs', 'templates', 'styles', 'images', 'sounds','json', 'fonts', 'cname']);

gulp.task('watch', ['build'], function () {
    gulp.watch(config.files.scripts, ['scripts']);
    gulp.watch(config.files.templates, ['templates']);
    gulp.watch(config.files.styles, ['styles']);
    gulp.watch(config.files.images, ['images']);
    gulp.watch(config.files.sounds, ['sounds']);
    gulp.watch(config.files.json, ['json']);
    gulp.watch(config.files.fonts, ['fonts']);
});

gulp.task('server', ['build'], function() {
    $.connect.server(config.server);
});

gulp.task('dev', ['watch', 'server']);

gulp.task('help', $.taskListing);

gulp.task('default', ['help']);
