//Подключение модулей
const gulp = require('gulp')
const less = require('gulp-less')
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');
const newer = require('gulp-newer');
const del = require('del')

//Пути к изначальным файлам и файлам назначения
const paths = {
	html: {
		src: 'src/*.html',
		dest: 'dist'
	},
	styles: {
		src: ['src/styles/**/*.sass', 'src/styles/**/*.scss', 'src/styles/**/*.less'],
		dest: 'dist/css/'
	},
	scripts: {
		src: 'src/scripts/**/*.js',
		dest: 'dist/js/'
	},
	images: {
		src: 'src/img/**',
		dest: 'dist/img/'
	}
}

//Очистка каталога
function clean() {
	return del(['dist/*', '!dist/img'])
}

//Минификация HTML
function html() {
	return gulp.src(paths.html.src)
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(size())
		.pipe(gulp.dest(paths.html.dest));
}

//Задача для обработки стилей
function styles() {
	return gulp.src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		//.pipe(less())
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(rename({
			basename: 'main',
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(size())
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(concat('style.min.css')) // Если что то пойдёт не так удалить
}

//Задача для обработки скриптов
function scripts() {
	return gulp.src(paths.scripts.src)
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(size())
		.pipe(gulp.dest(paths.scripts.dest))
}

//Задача для обработки картинок
function img() {
	return gulp.src(paths.images.src)
		.pipe(newer(paths.images.dest))
		.pipe(imagemin({
			progressive: true
		}))
		.pipe(size())
		.pipe(gulp.dest(paths.images.dest))
}

function watch() {
	gulp.watch(paths.styles.src, styles)
	gulp.watch(paths.scripts.src, scripts)
}

const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch)

exports.clean = clean
exports.img = img
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build