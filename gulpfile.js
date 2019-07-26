/* require */
const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const pug = require('gulp-pug')
const stylus = require('gulp-stylus')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const uglify = require('gulp-uglify')

/* startup server */
function browsersync (cb) {
  browserSync.init({
    server: {
      https: true,
      baseDir: './debug'
    }
  }, cb)
}

/*  */
function reload (cb) {
  browserSync.reload()
  cb()
}

function watch (cb) {
  browserSync.watch(['./src/babel/**/*.es6'], gulp.series(jsTranspileDebug, reload))
  browserSync.watch(['./src/stylus/**/*.styl'], gulp.series(cssTranspile, reload))
  browserSync.watch(['./src/pug/**/*.pug'], gulp.series(htmlCompile, reload))
  cb()
}

/*  */
function jsTranspileDebug () {
  return browserify('./src/babel/main.es6', {
    debug: true
  })
    .transform('babelify', {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react'
      ]
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./debug/js'))
}
function jsTranspileRelease () {
  return browserify('./src/babel/main.es6')
    .transform('babelify', { presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./release/js'))
}

/*  */
function cssTranspile () {
  return gulp.src(['./src/stylus/**/*.styl', '!' + './src/stylus/**/_*.styl'])
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(stylus())
    .pipe(gulp.dest('./debug/css'))
}

/*  */
function htmlCompile () {
  return gulp.src(['./src/pug/**/*.pug', '!' + './src/pug/**/_*.pug'])
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./debug'))
}

/* clean debug directory */
function cleanDebug () {
  return del([
    './debug/**/*'
  ])
}

/* clean release directory */
function cleanRelease () {
  return del([
    './release/**/*'
  ])
}

/* exports */
exports.OutJS = gulp.series(jsTranspileDebug)
exports.OutCSS = gulp.series(cssTranspile)
exports.OutHTML = gulp.series(htmlCompile)
exports.default = gulp.series(cleanDebug, jsTranspileDebug, cssTranspile, htmlCompile, browsersync, watch)
exports.release = gulp.series(cleanRelease, jsTranspileRelease, cssTranspile, htmlCompile)
