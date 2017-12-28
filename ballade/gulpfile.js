const gulp = require('gulp')
const replace = require('gulp-replace-task')
const rename = require('gulp-rename')
const del = require('del')
const through2 = require('through2');
const routes = require('./src/routes')

gulp.task('entries', function () {
    for (let key in routes) {
        gulp.src('./entry/entry.js')
            .pipe(replace({
                patterns: [
                    {
                        match: /<%=Page%>/g,
                        replacement: `../../src/views/${routes[key].path}${routes[key].view}`
                    }
                ]
            }))
            .pipe(rename(`entries/${routes[key].view}.js`))
            .pipe(gulp.dest('./entry/'))
    }
})

gulp.task('stamps', function () {
    for (let key in routes) {
        let stamp = '';
        let view = routes[key].view;
        let path = routes[key].path;
        gulp.src(`../dist/static/${view}.*.js`)
            .pipe(through2.obj(function (chunk, enc, callback) {
                stamp = chunk.path.split(`${view}.`)[1].split('.js')[0];
                callback();
            }))
            .on('finish', function () {
                gulp.src(`../dist/${path}${view}.html`)
                    .pipe(rename(`${view}.${stamp}.html`))
                    .pipe(gulp.dest(`../dist/${path}`))
                return del([`../dist/${path}${view}.html`], {force: true})
            })
    }
})

gulp.task('delete', function () {
    return del(['../dist/*'], {force: true})
})

gulp.task('clear', function () {
    return del(['../dist/static/*', '!../dist/static/vendor.*.js'], {force: true})
})
