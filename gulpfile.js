require('es6-promise').polyfill();
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var imagemin    = require('gulp-imagemin');
var cssmin      = require('gulp-cssmin');
var htmlmin     = require('gulp-htmlmin');
var uglify      = require('gulp-uglify');



var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('_scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(sourcemaps.write())
        .pipe(prefix(['last 2 versions'], { cascade: false }))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('_scss/*.scss', ['sass']);
    gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html', '_includes/*.liquid', '_posts/*', '_stories/*', '_data/*.json', 'scripts/*.js'], ['jekyll-rebuild']);
});

gulp.task('compress', ['jekyll-build', 'sass'], function() {

    gulp.src('_site/assets/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('_site/assets/'))

    gulp.src('_site/scripts/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('_site/scripts/'))

    gulp.src('_site/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('_site/css/'))

    gulp.src('_site/**/*.html')
        .pipe(htmlmin())
        .pipe(gulp.dest('_site/'))
})

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
gulp.task('build', ['jekyll-build', 'sass', 'compress']);
