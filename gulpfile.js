//Пакеты
var gulp = require('gulp');
var scss = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
// Пути к файлам
var appDir = 'app';
var prodDir = 'prod';
var path = {
    scss: appDir + '/scss/**/*.scss',
    css: appDir + '/css',
    html: appDir + '/*.html',
    js: appDir + '/js/**/*.js',
    fonts: appDir + '/fonts/**/*',
    images: appDir + '/images/**/*',
}
//Компиляция scss в css
gulp.task('scss', function () {
    return gulp.src(path.scss)
        .pipe(scss())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 10'], {cascade: true}))
        .pipe(gulp.dest(path.css))
        .pipe(browserSync.reload({stream: true}));
});
//Browser Sync
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: appDir
        },
        notify: false
    });
});
//Клинеры
gulp.task('clean', function () {
    return del.sync(prodDir);
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
        .pipe(gulp.dest(prodDir + '/images'));
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
        .pipe(gulp.dest(prodDir));
    var buildCss = gulp.src(path.css + '/**/*')
        .pipe(gulp.dest(prodDir + '/css'));
    var buildJs = gulp.src(path.js)
        .pipe(gulp.dest(prodDir + '/js'));
    var buildFonts = gulp.src(path.fonts)
        .pipe(gulp.dest(prodDir + '/fonts'));
});

gulp.task('default', ['watch']);
