var gulp = require('gulp');
var postcss = require('gulp-postcss');
var postcssPresetEnv = require('postcss-preset-env');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var babel = require('gulp-babel');
var watch = require('gulp-watch');

// Laravel Paths
var paths = {
    styles: {
        src: 'resources/sass/*.scss',
        dest: 'public/css/'
    },
    scripts: {
        src: 'resources/js/*.js',
        dest: 'public/js/'
    }
};
// using the preset-env plugin to get latest JS support
gulp.task('js', function() {
    return gulp.src(paths.scripts.src)
        .pipe(babel({
            "presets": ["@babel/preset-env"]
        }))
        .pipe(gulp.dest(paths.scripts.dest));
});

//using PostCSS to user modern CSS but also support antiques like IE11 or the new IE -> Safari
gulp.task('css', function() {
    gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(
            postcss([
                postcssPresetEnv({
                    stage: 2,
                    browsers: 'last 2 versions'
                })
            ])
        )
        .pipe(cssnano())
        .pipe(gulp.dest(paths.styles.dest))
});

// in Gulp 4 a function must be provided as second argument,
// therefore as a workaround a series with just one entry is used - gulp3 syntax will result in error
gulp.task('watch',function() {
    gulp.watch(paths.styles.src, gulp.series('css'));
    gulp.watch(paths.scripts.src, gulp.series('js'));
});

// same here but completely different,
// the 'watch' task is run before the 'default' task which shouldn't be, gulp requires you to have the default task always run first
// to achieve this deferral we need the series() method again
gulp.task('default', gulp.series('watch'));
