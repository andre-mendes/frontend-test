var gulp = require('gulp');
var stylus = require('gulp-stylus');
var poststylus = require('poststylus');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var lost = require('lost');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var gcmq = require('gulp-group-css-media-queries');
var rupture = require('rupture');



var reload = browserSync.reload;

function refresh() {
  setTimeout(function () {
    reload();
  }, 500);
}

//Src paths
var srcPaths = {
  css:  '_src/styl/**/*.styl',
  styl: '_src/styl/main.styl',
  js:   '_src/js/**/*.js',
  html: '_src/*.html',
  img:  '_src/img/**/*'
};

//Build patchs
var buildPaths = {
  build: 'assets/**/*',
  css:   'assets/css/',
  js:    'assets/js/',
  html:  'assets/',
  img:   'assets/img',
};


//compress Stylus
gulp.task('css', function () {
  gulp.src(srcPaths.styl)
    .pipe(stylus({
      use: [ rupture(), poststylus([lost(), autoprefixer()]) ],
      compress: true
    }))
    .pipe(gcmq())
    .pipe(gulp.dest(buildPaths.css));
});


//Minify and concat JS
gulp.task('scripts', function() {
  return gulp.src(srcPaths.js)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(buildPaths.js))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(buildPaths.js));
});


//Minify images
gulp.task('imageMin', function() {
  gulp.src(srcPaths.img)
    .pipe(imagemin())
    .pipe(gulp.dest(buildPaths.img));
});


// Minify html
gulp.task('minify', function() {
  return gulp.src(srcPaths.html)
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(buildPaths.html));
});


//Watch for changes
gulp.task('watch', function() {
  gulp.watch('_src/*.html', { debounceDelay: 300 }, ['minify']);
  gulp.watch(srcPaths.styl, ['css']);
  gulp.watch(srcPaths.js, ['scripts']);
})


gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: 'assets/',
      proxy: 'localhost'
    },
  });
  gulp.watch('_src/*.html', function () { reload(); });
  gulp.watch(srcPaths.css, ['css']);
  gulp.watch(srcPaths.js, ['scripts']);
});


// Default gulp task to watch
gulp.task('default', [
  'css',
  'minify',
  'imageMin',
  'scripts',
  'watch',
  'serve'
]);


//Default gulp task to run
gulp.task('build', [
  'css',
  'minify',
  'imageMin',
  'scripts',
]);
