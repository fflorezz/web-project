// const sass = require("gulp-sass");
// const gulp = require("gulp");
// const browserSync = require("browser-sync").create();
// sass.compiler = require("node-sass");

// function style() {
// 	return gulp
// 		.src("./sass/**/*.scss")
// 		.pipe(sass().on("error", sass.logError))
// 		.pipe(gulp.dest("./css"))
// 		.pipe(browserSync.stream());
// }

// function watch() {
// 	browserSync.init({
// 		server: {
// 			baseDir: "./"
// 		}
// 	});
// 	gulp.watch("./sass/**/*.scss", style);
// 	gulp.watch("./*.html").on("change", browserSync.reload);
// 	gulp.watch("./js/**/*.js").on("change", browserSync.reload);
// }

// exports.style = style;
// exports.watch = watch;

//************* */ Initialize modules*****************
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require("gulp");
// Importing all the Gulp-related packages we want to use
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const replace = require("gulp-replace");
const browserSync = require("browser-sync").create();

// File paths
const files = {
	scssPath: "./src/scss/**/*.scss",
	jsPath: "./src/js/**/*.js",
	htmlPath: "./dist/*.html"
};

// Sass task: compiles the style.scss file into style.css
function scssTask() {
	return src(files.scssPath)
		.pipe(sourcemaps.init()) // initialize sourcemaps first
		.pipe(sass()) // compile SCSS to CSS
		.pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
		.pipe(sourcemaps.write(".")) // write sourcemaps file in current directory
		.pipe(dest("dist")); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
	return src([
		files.jsPath
		//,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
	])
		.pipe(sourcemaps.init()) // initialize sourcemaps first
		.pipe(concat("index-min.js"))
		.pipe(uglify())
		.pipe(sourcemaps.write()) // write sourcemaps file in current directory
		.pipe(dest("dist"));
}

// Cachebust
function cacheBustTask() {
	var cbString = new Date().getTime();
	return src([ files.htmlPath ]).pipe(replace(/cb=\d+/g, "cb=" + cbString)).pipe(dest("./dist"));
}

// Watch task: init browser-sync, watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask() {
	browserSync.init({
		server: {
			baseDir: "./dist"
		},
		browser: [ "C:Program Files (x86)/Google/Chrome Dev/Application/chrome.exe" ]
	});
	watch(
		[ files.scssPath, files.jsPath ],
		{ interval: 1000, usePolling: true }, //Makes docker work
		series(parallel(scssTask, jsTask), cacheBustTask)
	);
	watch([ files.scssPath, files.jsPath, files.htmlPath ]).on("change", browserSync.reload);
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(parallel(scssTask, jsTask), cacheBustTask, watchTask);
