//Пакеты
var gulp = require('gulp');
var notify = require('gulp-notify');
var scss = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var gcmq = require('gulp-group-css-media-queries');
var csso = require('gulp-csso');
// Пути к файлам
var sourceDir = 'source';
var publicDir = 'public';
var path = {
    scss: sourceDir + '/scss/**/*.scss',
    css: sourceDir + '/css',
    html: sourceDir + '/*.html',
    js: sourceDir + '/js/**/*.js',
    fonts: sourceDir + '/fonts/**/*',
    images: sourceDir + '/images/**/*',
    pug: sourceDir + '/pages/*.pug'
}
//Компиляция scss в css
gulp.task('scss', function () {
    return gulp.src(path.scss).on('error', notify.onError())
        .pipe(scss().on('error', scss.logError)).on('error', notify.onError())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 10'], {cascade: true}))
        .pipe(gulp.dest(path.css)).pipe(gcmq()).on('error', notify.onError())
        .pipe(browserSync.reload({stream: true})).on('error', notify.onError());
});
//Browser Sync
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: sourceDir
        },
        notify: false
    });
});
//Клинеры
gulp.task('clean', function () {
    return del.sync(publicDir);
});
gulp.task('clear', function () {
    return cache.clearAll();
});
//Сжатие картинок
gulp.task('images', function () {
    return gulp.src(path.images)
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
        })))
        .pipe(gulp.dest(publicDir + '/images'));
});
//Ватчер
gulp.task('watch', ['browser-sync', 'scss'], function () {
    gulp.watch(path.scss, ['scss']);
    gulp.watch(path.html, browserSync.reload);
    gulp.watch(path.js, browserSync.reload);
});

//Билд проекта для продакшена
gulp.task('build', ['clean', 'images', 'scss'], function () {
    var buildHtml = gulp.src(path.html)
        .pipe(gulp.dest(publicDir));
    var buildCss = gulp.src(path.css + '/**/*')
        .pipe(gcmq())
        .pipe(csso())
        .pipe(gulp.dest(publicDir + '/css'));
    var buildJs = gulp.src(path.js)
        .pipe(gulp.dest(publicDir + '/js'));
    var buildFonts = gulp.src(path.fonts)
        .pipe(gulp.dest(publicDir + '/fonts'));
});

gulp.task('default', ['watch']);
