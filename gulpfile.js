const sass = require("gulp-sass");
const gulp = require("gulp");
sass.compiler = require("node-sass");

function style() {
	return gulp.src("./sass/**/*.scss").pipe(sass().on("error", sass.logError)).pipe(gulp.dest("./css"));
}

function watch() {
	gulp.watch("./sass/**/*.scss", style);
}

exports.style = style;
exports.watch = watch;
