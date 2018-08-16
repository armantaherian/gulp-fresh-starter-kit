var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReplace = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');
var twig = require('gulp-twig');

var config = {
  dist: 'dist/',
  src: './',
  cssin: 'src/css/**/*.css',
  jsin: 'src/js/**/*.js',
  imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
  htmlin: '*.html',
  templateDir: 'templates/**/*.twig',
  template: 'templates/*.twig',
  scssin: 'src/scss/**/*.scss',
  cssout: 'dist/css/',
  jsout: 'dist/js/',
  imgout: 'dist/img/',
  htmlout: 'dist/',
  scssout: 'src/css/',
  cssoutname: 'style.css',
  jsoutname: 'app.js',
  cssreplaceout: '/criticals.css',
  jsreplaceout: '/dist/js/app.js'
};

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('serve', ['sass'], function() {
  browserSync({
    server: config.src,
    open: false,
    reloadOnRestart: true,
  });

  // gulp.watch([config.htmlin], ['reload']);
  gulp.watch(config.scssin, ['sass']);
  gulp.watch(config.jsin, ['js']);
  gulp.watch(config.templateDir, ['html']);
});

gulp.task('sass', function() {
  return gulp.src(config.scssin)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.cssout))
    .pipe(browserSync.stream());
});

// gulp.task('css', function() {
//   console.log('hi')
//   return gulp.src(config.cssin)
//     // .pipe(concat(config.cssoutname))
//     .pipe(cleanCSS())
//     .pipe(gulp.dest(config.cssout))
//     .pipe(browserSync.stream());
// });

gulp.task('js', function() {
  return gulp.src(config.jsin)
    // .pipe(concat(config.jsoutname))
    // .pipe(uglify())
    // .pipe(babel())
    .pipe(webpack({
      mode: 'production',
      output: {
        filename: 'app.js',
      },
    }))
    .pipe(gulp.dest(config.jsout))
    .pipe(browserSync.stream());
});

// gulp.task('img', function() {
//   return gulp.src(config.imgin)
//     .pipe(changed(config.imgout))
//     .pipe(imagemin())
//     .pipe(gulp.dest(config.imgout));
// });

gulp.task('html', function() {
  // return gulp.src(config.htmlin)
  return gulp.src(config.template)
    .pipe(twig())
    // .pipe(htmlReplace({
    //   'css': config.cssreplaceout,
    //   'js': config.jsreplaceout
    // }))
    // .pipe(htmlMin({
    //   sortAttributes: true,
    //   sortClassName: true,
    //   collapseWhitespace: true
    // }))
    .pipe(gulp.dest(config.src))
    .pipe(browserSync.stream())
});

gulp.task('clean', function() {
  return del([config.dist]);
});

gulp.task('build', function() {
  // sequence('clean', ['html', 'js', 'css', 'img']);
  sequence('clean', ['html', 'js', 'sass']);
});

gulp.task('default', ['serve']);
