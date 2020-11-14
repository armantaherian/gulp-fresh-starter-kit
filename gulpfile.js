const { series, src, dest, watch, task } = require('gulp');
const path = require('path');
const rename = require('gulp-rename');
const notify = require("gulp-notify");
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const webpack = require('webpack-stream');
const twig = require('gulp-twig');

const config = {
  dist: path.join(__dirname, 'dist/'),
  src: './',
  cssin: 'src/css/**/*.css',
  jsin: 'src/js/**/*.js',
  imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
  htmlin: '*.html',
  templateDir: path.join(__dirname, 'templates/**/*.twig'),
  template: path.join(__dirname, 'templates/*.twig'),
  scssin: 'src/scss/**/*.scss',
  cssout: 'dist/css/',
  jsout: 'dist/js/',
  imgout: 'dist/img/',
  htmlout: 'dist/',
  scssout: 'src/css/',
  cssoutname: 'style.css',
  jsoutname: 'app.js',
  cssreplaceout: '/criticals.css',
  jsreplaceout: '/dist/js/app.js',
  htmlDir: path.join(__dirname, '**/*.html'),
  assetsDir: path.join(__dirname, 'src/assets/**'),
  assetsDist: path.join(__dirname, 'dist/assets/'),
};

task('clean', function () {
  return del([config.dist]);
});

task('copy', function () {
  return src(config.assetsDir)
    .pipe(dest(config.assetsDist));
});

task('sass', function () {
  return src(config.scssin)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', notify.onError({
      title: "Compiling Sass error",
      message: "\n\n<%= error.message %>",
    }))
    .pipe(sourcemaps.write())
    .pipe(cleanCSS())
    .pipe(dest(config.cssout))
    .pipe(browserSync.stream());
});

task('js', function () {
  return src(config.jsin)
    .pipe(sourcemaps.init())
    .pipe(webpack({
      mode: 'production',
      output: {
        filename: 'app.js',
      },
    }))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write())
    .pipe(dest(config.jsout))
    .pipe(browserSync.stream());
});

task('html', function () {
  return src(config.template)
    .pipe(twig())
    .pipe(dest(config.dist))
    .pipe(browserSync.stream())
});


task('serve', series('clean', 'copy', 'sass', 'js', 'html', function () {
  browserSync({
    server: config.dist,
    open: false,
    reloadOnRestart: true,
  });

  watch(config.scssin, series('sass'));
  watch(config.jsin, series('js'));
  // watch(config.templateDir, series('html'));

  watch(config.templateDir, function (aa) {
    console.log(aa)
    return series('html');
  });

  watch(config.assetsDir, series('copy'));
}));

task('build', series('clean', 'html', 'js', 'sass'));

task('default', series('serve'));
