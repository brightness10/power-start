// To Do
// add jpg, svg and gif to compress-img task
// add resize img task
// Solve browserSync external url problem
// check if possible to convert to scss

// Steps
// Change browserSync proxy
// Change sass to scss if needed
// verify paths are correct


// --------------------------------------------
// Dependencies
// --------------------------------------------
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    postcss = require('gulp-postcss'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    imageminWebp = require('imagemin-webp'),
    imageminPngquant = require('imagemin-pngquant');


// paths
var styleSrc = 'src/style/**/*.sass',
    styleDest = 'build/css/',
    imgSrc = 'src/img/*',
    picSrc = imgSrc.concat('*/*.{png,jpg,jpeg}'),
    imgDest = 'build/img/'
    scriptSrc = 'src/js/**/*.js',
    scriptDest = 'build/js/';



// --------------------------------------------
// Stand Alone Tasks
// --------------------------------------------


// Style tasks

// Compile the main.sass file, compress and prefix
gulp.task('css', function() {
    gulp.src(styleSrc)
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
          }))
        .pipe(autoprefixer({browsers: ['last 2 versions']}))
        .pipe(gulp.dest(styleDest));
});

// Img tasks

// Compress media - png/jpg/gif/svg
gulp.task('compress-img', function() {
    gulp.src(imgSrc)
        .pipe(plumber())
        .pipe(imagemin([imageminPngquant({
            quality: '70-90', // When used more then 70 the image wasn't saved
            speed: 1, // The lowest speed of optimization with the highest quality
            floyd: 1 // Controls level of dithering (0 = none, 1 = full).
        })]))
        .pipe(gulp.dest(imgDest));
});

// Convert png & jpg to webp
gulp.task('convert-img', function(){
    gulp.src(picSrc)
    .pipe(imagemin([imageminWebp({
        quality: 100,
        method: 6 // slowest speed for optimal quality and size
    })]))
    .pipe(rename({
        extname: '.webp'
    }))
    .pipe(gulp.dest(imgDest));
});

// Run all img related tasks
gulp.task('img', ['compress-img', 'convert-img']);

// Script tasks

// Concatinate and compress js files
gulp.task('js', function() {
    gulp.src(scriptSrc)
        .pipe(plumber())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(scriptDest));
});

// Watch task
gulp.task('watch', function(){

    // Serve files from the root of this project
    browserSync.init({
        // server: {
        //     baseDir: "./build"
        // },
        proxy: 'localhost'
    });

    gulp.watch(styleSrc,['css']);
    gulp.watch(scriptSrc,['js']);
    gulp.watch(imgSrc,['compress-img']);
    gulp.watch(['build/*.php', 'build/css/*.css', 'build/js/*.js', 'build/img/*']).on('change', browserSync.reload);
});


// Default task
gulp.task('default', ['css', 'img', 'js', 'watch']);
