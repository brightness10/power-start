// To Do
// Add resize img task
// Solve browserSync external url problem
// fix convert to scss

// Steps
// Change browserSync proxy
// Change sass to scss if needed
// להוסיף יו גדולה אחרי הפי הגדולה בסוף של המפתח של הטייני אם אין
// verify paths are correct
// Decide wether jpeg should be interlaced (progressive: true) or baselined


// --------------------------------------------
// Dependencies
// --------------------------------------------
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync').create(),
    rename = require('gulp-rename'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    sassConvert = require('sass-convert'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    tinify = require('gulp-tinify'),
    imagemin = require('gulp-imagemin'),
    imageminWebp = require('imagemin-webp'),
    imageminPngquant = require('imagemin-pngquant'),
    imageminSvgo = require('imagemin-svgo'),
    imageminGifsicle = require('imagemin-gifsicle'),
    imageminMozjpeg = require('imagemin-mozjpeg');


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

// Convert sass to scss
gulp.task('convert-scss', function(){
    gulp.src(styleSrc)
    .pipe(plumber())
    .pipe(sassConvert({
        from: 'sass',
        to: 'scss'
    }))
    .pipe(rename({
        extname: '.scss'
    }))
    .pipe(gulp.dest('test/'));
});

// Img tasks

// tinypng, limited amount of compressions so only use before deployment! 
gulp.task('tiny', function(){
    gulp.src(picSrc)
    .pipe(tinify('Q3QHK5qkFewGcF0GCEPiG2WFXNWB7dPU'))
    .pipe(gulp.dest(imgDest));
});

// Compress media - png/jpg/gif/svg
gulp.task('compress-img', function() {
    gulp.src(imgSrc)
        .pipe(plumber())
        .pipe(imagemin([
            imageminPngquant({
            quality: '70-90', // When used more then 70 the image wasn't saved
            speed: 1, // The lowest speed of optimization with the highest quality
            floyd: 1 // Controls level of dithering (0 = none, 1 = full).
            }),
            imageminMozjpeg({
                quality: 90
            }),
            imageminSvgo({
                removeViewBox: false
            }),
            imageminGifsicle({
                interlaced: true,
                optimizationLevel: 3
            })
        ]))
        .pipe(gulp.dest(imgDest));
});

// Convert png & jpg to webp
gulp.task('convert-img', function(){
    gulp.src(picSrc)
    .pipe(imagemin([
        imageminWebp({
        quality: 100,
        method: 6 // slowest speed for optimal quality and size
        })
    ]))
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
