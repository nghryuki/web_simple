/* require */
const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const pug = require('gulp-pug')
const babel = require('gulp-babel')
const stylus = require('gulp-stylus')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const del = require('del')

/* startup server */
function browsersync (cb) {
  browserSync.init({
    server: {
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
  browserSync.watch(['./src/babel/**/*.es6'], gulp.series(jsTranspile, reload))
  browserSync.watch(['./src/stylus/**/*.styl'], gulp.series(cssTranspile, reload))
  browserSync.watch(['./src/pug/**/*.pug'], gulp.series(htmlCompile, reload))
  cb()
}

/*  */
function jsTranspile () {
  return gulp.src(['./src/babel/**/*.es6', '!' + './src/babel/**/_*.es6'])
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('./debug/js'))
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
    .pipe(pug())
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

function haha (cb) {
  console.log('hhh')
  cb()
}

/* exports */
exports.default = gulp.series(cleanDebug, jsTranspile, cssTranspile, htmlCompile, browsersync, watch, haha)
exports.release = gulp.series(cleanRelease, jsTranspile, cssTranspile, htmlCompile, haha)
