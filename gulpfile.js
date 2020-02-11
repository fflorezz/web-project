const sass = require("gulp-sass");
const gulp = require("gulp");
const browserSync = require("browser-sync").create();
sass.compiler = require("node-sass");

function style() {
	return gulp
		.src("./sass/**/*.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(gulp.dest("./css"))
		.pipe(browserSync.stream());
}

function watch() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
	gulp.watch("./sass/**/*.scss", style);
	gulp.watch("./*.html").on("change", browserSync.reload);
	gulp.watch("./js/**/*.js").on("change", browserSync.reload);
}

exports.style = style;
exports.watch = watch;
