// ? ------------------------------------------------------------------------ Déclaration des variables
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;
const image = require('gulp-image');
const autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');

sass.compiler = require('node-sass');

// ? ------------------------------------------------------------------------- FUN 

// Moulinette SCSS
gulp.task('moulinette-sass', function() {
    return gulp.src('./src/css/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(gulp.dest('./dist/css'));
});
// Moulinette html
gulp.task('moulinette-html', function() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'));
});

// Moulinette JS (Uglify > minify JS)
gulp.task('moulinette-js', function() {
    return pipeline(
        gulp.src('./src/js/*.js'),
        babel({ presets: ['@babel/env'] }),
        uglify(),
        rename({
            extname: ".min.js"
        }),
        gulp.dest('./dist/js')
    );
});
// Uglify sans pipeline
// gulp.task('moulinette-js', function() {
//     return gulp.src('./src/js/*.js')
//         .pipe(uglify())
//         .pipe(rename({
//             extname: ".min.js"
//         }))
//         .pipe(gulp.dest('./dist/js'));
// });

// BrowserSync - Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});
// gulp image
// with compressing options
gulp.task('compress-img', function() {
    gulp.src('./src/img/*')
        .pipe(image({
            pngquant: true,
            optipng: true,
            zopflipng: true,
            jpegRecompress: true,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: false // compressed size gain indicator
        }))
        .pipe(gulp.dest('./dist/img'));
});

// ? -------------------------------------------------------------------------EXECUTION
gulp.task('execute',
    gulp.parallel('moulinette-sass', 'moulinette-html', 'moulinette-js', 'browser-sync',
        function() {
            // gulp update dist files from src changment 
            gulp.watch('./src/*.html', gulp.task('moulinette-html'));
            gulp.watch('./src/css/**/*.scss', gulp.task('moulinette-sass'));
            gulp.watch('./src/js/*.js', gulp.task('moulinette-js'));
            // browser sync watch dist changments
            gulp.watch("./dist/*.html").on('change', browserSync.reload);
            gulp.watch("./dist/css/*.css").on('change', browserSync.reload);
            gulp.watch("./dist/js/*.js").on('change', browserSync.reload);
        }));

// makes command gulp + enter do execute code
gulp.task('default', gulp.parallel('execute'));

// todo: on terminal: "gulp compress-img" > pour compresser les images, htrown error but do the job so it s ok (maybe see async signal completion doc on gulpjs.com)