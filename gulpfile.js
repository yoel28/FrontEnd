const gulp = require('gulp'),
      $ = require('gulp-load-plugins')({ lazy: true }),
      del = require('del'),
      lite = require('lite-server'),
      image = require('gulp-image'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer')
      ;

const config = {
    build: './dist/build.js',
    plugins: [
        'node_modules/core-js/client/shim.min.js',
        'node_modules/zone.js/dist/zone.min.js'
    ],
    index: {
        run: 'index.html',
        aot: 'index-aot.html',
        aotgz: 'index-aot-gzip.html',
        jit: 'index-jit.html'
    },
    dest: './dist',
    root: './'
};

const sassConfig = {
    src:'./theme/application.scss',
    dest:'dist',
    params:{
        outputStyle:'expanded',
        sourceComents:false,
    },
    autoprefixer:{
        browsers: ['last 2 versions'],
            cascade: false
    }
}

//TASKS
gulp.task('help',$.taskListing);

gulp.task('default', ['help']);

gulp.task('gzip',()=>{
  log('gzipping');
  var source = [].concat(config.plugins, config.build);

  return gulp.src(source)
    .pipe($.gzip())
    .pipe(gulp.dest(config.dest));
});

gulp.task('copy-aot-gzip', ['gzip', 'clean'],()=>{
  log('copy aot gzip');
  return copyIndex(config.index.aotgz);
});

gulp.task('copy-aot', ['clean'],()=>{
  log('copy aot');
  return copyIndex(config.index.aot);
});

gulp.task('copy-jit', ['clean','watchers'],()=>{
  log('copy jit');
  return copyIndex(config.index.jit);
});

gulp.task('clean',(done)=>{
  log('clean');
  del([config.index.run]).then(function(paths){
    done();
  });
});

gulp.task('image',()=>{
    gulp.src('./fixtures/*')
        .pipe(image())
        .pipe(gulp.dest('./dist'));
});

gulp.task('sass',()=>{
    gulp.src(sassConfig.src)
        .pipe(sass(sassConfig.params).on('error',sass.logError()))
        .pipe(autoprefixer(sassConfig.autoprefixer))
        .pipe(gulp.dest(sassConfig.dest))
});

gulp.task('watchers',()=>{
   //gulp.watch(sassConfig.src,['sass']);
});

//FUNCTIONS
function copyIndex(source) {
    return gulp.src(source)
        .pipe($.rename(config.index.run))
        .pipe(gulp.dest(config.root));
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

module.exports = gulp;

