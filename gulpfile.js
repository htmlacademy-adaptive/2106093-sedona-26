import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import {deleteAsync}  from "del";

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML
const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

//Scripts
const scripts = () => {
  return gulp.src(['source/js/*.js', '!source/js/scripts.js'])
    .pipe(terser())
    .pipe(gulp.dest('build/js'));
}

const scriptsRename = () => {
  return gulp.src('source/js/scripts.js')
    .pipe(terser())
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest('build/js'));
}


//Images
const optimazeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'));
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'));
}

//Webp
const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh({
      webp:{}
    }))
    .pipe(gulp.dest('build/img'));
}

//SVG
const svg = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/sprites/**/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));
}

const sprites = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/sprites/sprites.svg'])
    .pipe(svgo ({
      plugins: [
        {
          removeUnknownsAndDefaults: false,
          removeViewBox: false,
          removeUselessStrokeAndFill: false,
          }
      ]
    }))
    .pipe(svgstore({
      inLineSvg: true
    }))
    .pipe(rename('sprites.min.svg'))
    .pipe(gulp.dest('build/img/sprites'));
}

//Copy
const copy = (done) => {
  gulp.src([
  'source/fonts/*.{woff2,woff}',
  'source/*.ico',
  'source/*.webmanifest'], {
  base: 'source' })
  .pipe(gulp.dest('build'))
  done();
}

//Clean
export const clean = () => {
  return deleteAsync('build');
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

//Reload
const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/**/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html)).on('change', browser.reload);
}

//Build
export const build = gulp.series(
  clean,
  copy,
  optimazeImages,
  createWebp,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprites,
    scriptsRename
    )
);

//Default
export default gulp.series(
  clean,
  copy,
  copyImages,
  createWebp,
  gulp.parallel(
    styles,
    html,
    scripts,
    scriptsRename,
    svg,
    sprites),
    gulp.series(
    server,
    watcher)
)
;
