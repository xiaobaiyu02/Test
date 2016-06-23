var gulp =require("gulp");
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var path = require('path');
 
gulp.task('less', function () {
  return gulp.src('less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less') ]
    }))
    .pipe(autoprefixer({
    	browsers: ['last 2 version', 'safari 5', 'ie 6', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
	}))
    .pipe(gulp.dest('css'));
});

gulp.task('watch', function () {
    return gulp.watch('less/**/*.less', ['less']);
});
gulp.task("default",['watch'])