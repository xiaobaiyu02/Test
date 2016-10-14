var gulp =require("gulp");
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var path = require('path');
 
gulp.task('sass', function () {
  return gulp.src('sass/**/*.scss')
    .pipe(sass({
      paths: [ path.join(__dirname, 'sass') ]
    }))
    .pipe(autoprefixer({
    	browsers: ['last 2 version', 'safari 5', 'ie 6', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
	}))
    .pipe(gulp.dest('css'));
});

gulp.task('watch', function () {
    return gulp.watch('sass/**/*.scss', ['sass']);
});
gulp.task("default",['watch'])