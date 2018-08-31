var gulp = require("gulp"),
		concat = require('gulp-concat'),
		plumber = require("gulp-plumber"),
    rename = require('gulp-rename'),
    gulpsass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require("gulp-clean-css"),
    sourcemaps = require("gulp-sourcemaps"),
    notify = require("gulp-notify"),
    size = require('gulp-size'),
    browserSync = require('browser-sync').create();

// Define paths variables
var DEST = 'dist/';
var SRC = 'src/';
var PROY = 'macondoart-facturacion.css';

var onError = function(err){
	console.log("Se ha producido un error:", err.message);
	this.emit("end");
}

// TODO: Maybe we can simplify how sass compile the minify and unminify version
gulp.task("sass", function(){
  return gulp.src(SRC+"/sass/*.scss")
  	.pipe(plumber({errorHandler:onError}))
    .pipe(sourcemaps.init())
    .pipe(gulpsass())
    .pipe(autoprefixer('last 2 versions', '> 5%'))
    .pipe(concat(PROY))
    .pipe(gulp.dest(DEST+'css'))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(DEST+'css'))
    .pipe(notify({message:"Task SASS finalizado"}))
    .pipe(browserSync.stream());
});

gulp.task("css-min", function(){
  return gulp.src(DEST+"css/"+PROY)
  	.pipe(plumber({errorHandler:onError}))
    .pipe(sourcemaps.init())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(DEST+'css'))
    .pipe(cleanCss())
    .pipe(gulp.dest(DEST+'css'))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(DEST+'css'))
    .pipe(size())
    .pipe(notify({message:"Task CSS-MIN finalizado"}))
    .pipe(browserSync.stream());
}); 

gulp.task('directories', function () {
    return gulp.src('*.*', {read: false})
        .pipe(gulp.dest(DEST+'./css'))
        .pipe(gulp.dest(DEST+'./img'))
        .pipe(gulp.dest(DEST+'./fonts'))
        .pipe(gulp.dest(DEST+'./js'));
});

// Copy CSS Styles 
gulp.task('copy-css', function () {
  gulp.src([
            './node_modules/normalize.css/normalize.css',
            './node_modules/font-awesome/css/font-awesome.min.css',
            './node_modules/animate.css/animate.min.css',
            './node_modules/bootstrap/dist/css/bootstrap.min.css',
            './src/assets/css/cs-skin-elastic.css',
            ])
      .pipe(gulp.dest(DEST+'css/'));
        
});

// Copy Js
gulp.task('copy-js', function () {
  gulp.src([
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/jquery-slim/dist/jquery.slim.min.js',
            './node_modules/bootstrap/dist/js/bootstrap.min.js',
            './node_modules/popper.js/dist/popper.min.js',
            './src/assets/js/dashboard.js',
            './src/assets/js/main.js',
            './src/assets/js/plugins.js',
            './src/assets/js/widgets.js',
            ])
      .pipe(gulp.dest(DEST+'js/'));        
});

// Copy images
gulp.task('copy-img', function () {
  // gulp.src(SRC+'img/**/*')
  //     .pipe(gulp.dest(DEST+'img/'));
  return gulp.src(SRC+'assets/img/**/*')
        .pipe(gulp.dest(DEST+'img'))
        .pipe(size());
});

// FontAwesome
gulp.task('copy-fonts', function() {
  return gulp.src(['./node_modules/font-awesome/fonts/fontawesome-webfont.*'])
      .pipe(gulp.dest(DEST+'fonts/'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        // startPath: './production/index.html'
        startPath: DEST+'index.html'
    });
});

gulp.task('watch', function() {
  // Watch .html files
  gulp.watch(DEST + '*.html', browserSync.reload);

  // Watch .js files
  // gulp.watch('src/js/**/*.js', ['scripts']);

  // Watch .scss files
  gulp.watch(SRC+'sass/*.scss', ['sass', 'css-min']);
  gulp.watch(DEST+'css/*.css', ['css-min']);
});

// Build
gulp.task('build', ['copy-css', 'copy-js','copy-fonts', 'copy-img']);

// Default Task
gulp.task('default', ['browser-sync', 'watch']);
	