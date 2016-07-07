var gulp = require('gulp');
var $ = require('gulp-load-plugins')();


/////////////////////

function done() {
    log('************');
    log('* All Done * You can start editing your code, BrowserSync will update your browser after any change..');
    log('************');
}

// Error handler
function handleError(err) {
    log(err.toString());
    this.emit('end');
}

// log to console using
function log(msg) {
    $.util.log($.util.colors.blue(msg));
}


// JADE
gulp.task('default', function () {
    log('Building jade');

    return gulp.src('./jade/*.jade')
            .pipe($.jade())
            .on('error', handleError)
            .pipe($.htmlPrettify({
                indent_char: ' ',
                indent_size: 4,
                unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u', 'pre', 'code']
            }))
            .pipe(gulp.dest('../'));
});