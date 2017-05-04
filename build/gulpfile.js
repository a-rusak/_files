'use strict';

var gulp                = require('gulp'),
    angularFilesort     = require('gulp-angular-filesort'),
    cleanCSS            = require('gulp-clean-css'),
    concat              = require('gulp-concat'),
    del                 = require('del'),
    environments        = require('gulp-environments'),
    inject              = require('gulp-inject'),
    gulpif              = require('gulp-if'),
    htmlmin             = require('gulp-htmlmin'),
    minifyhtml          = require('gulp-minify-html'),
    less                = require('gulp-less'),
    prefixer            = require('gulp-autoprefixer'),
    runSequence         = require('run-sequence'),
    sourcemaps          = require('gulp-sourcemaps'),
    uglify              = require('gulp-uglify'),
    watch               = require('gulp-watch'),
    wiredep             = require('wiredep').stream,
    templatecache       = require('gulp-angular-templatecache'),
    useref              = require('gulp-useref'),
    rev                 = require('gulp-rev-orig');

// NODE_ENV environment variables
var development = environments.development,
    production = environments.production,
    staging = environments.make('staging'),
    test = environments.make('test');

var output_folder = 'dist';

var configFiles = [];

if(development()) {
    console.log(development());
    output_folder = '.';
    configFiles = [
        'app/services/config.js',
        'js/ga-tracking.dev.js'
    ];
}
if(production()) {
    configFiles = [
        'app/services/config.js',
        'js/ga-tracking.production.js'
    ];
}
if(staging()) {
    configFiles = [
        'app/services/config.js',
        'js/ga-tracking.staging.js'
    ];
}
if(test()) {
    configFiles = [
        'app/services/config.js',
        'js/ga-tracking.test.js'
    ];
}

var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

var path = {
    src: {

        less: 'less/main.less',

        css: [
            'fonts/fonts.css',

            'css/reset.css',
            'css/common.css',

            'css/magnific-popup.css',
            'css/jquery.datetimepicker.css',
            'css/jquery.mCustomScrollbar.min.css',

            'css/spinner.css',
            'css/style.css',
            'css/intro.css',
            'css/intro-menu-guide.css',

            'css/style-980.css',
            'css/style-800.css',
            'css/style-550.css',
            'css/style-400.css',

            'css/pmc.css',
            'css/main.css',

            'css/unsemantic-grid-responsive-tablet.css'
        ],

        app_js: [
            'app/**/*.js',
            '!app/services/config*',
            'app.tpls.js'
        ],

        app_config: configFiles,

        utils_js: [
            'js/*.js',
            '!js/ga-tracking*'
        ]
    },
    watch: {
        js: ['js/**/*.js', 'app/**/*.js'],
        html: ['src/index.html', 'app/**/*.html'],
        css: ['css/**/*.css'],
        less: ['**/*.less']
    }
};

/////////////////////////////

gulp.task('less:build', function () {
    return gulp.src(path.src.less)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('.', { addComment: true }))
        .pipe(gulp.dest('./css'));
});

gulp.task('index:build', function () {
    return gulp.src('./index.html') // useref has to have relative paths

        // attach css
        .pipe( inject(gulp.src(path.src.css, {read: false})))

        // attach bower components
        .pipe( wiredep({
            fileTypes: {
                html: {
                    replace: {
                        js: function (filePath) {
                            var newPath = filePath.replace(/\.\./, '');
                            return '<script src="' + newPath + '"></script>';
                        }
                    }
                }
            }
        }) )

        // attach config files
        .pipe( inject(gulp.src(path.src.app_config, {read: false}), {name: 'config'}))

        // attach files from app folder
        .pipe( inject(gulp.src(path.src.app_js).pipe(angularFilesort()), {name: 'app'}))

        // attach files from js folder
        .pipe( inject(gulp.src(path.src.utils_js, {read: false}), {name: 'utils'}))

        .pipe( test( useref() ))
        .pipe( staging( useref() ))
        .pipe( production( useref()) )

        .pipe( test( gulpif( '*.js', uglify() ) ) )
        .pipe( staging( gulpif( '*.js', uglify() ) ) )
        .pipe( production( gulpif( '*.js', uglify() ) ) )

        .pipe( gulp.dest(output_folder) );
});

gulp.task('rev', function() {
    return gulp.src(output_folder + '/index.html')
        .pipe( rev({ revType: 'date', dateFormat: 'yymmddHHmm', suffix: 'd', fileTypes: ['css', 'js'] }) )
        .pipe( gulp.dest(output_folder) );
});

gulp.task('copyIndex', function() {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest(output_folder))
        .pipe(gulp.dest('.'));  // Temporary for useref, which has to have relative paths
});

gulp.task('fonts', function() {
    return gulp.src('fonts/**/*')
        .pipe( gulp.dest(output_folder + '/fonts') );
});

gulp.task('images', function() {
    return gulp.src('images/**/*')
        .pipe( gulp.dest(output_folder + '/images') );
});

gulp.task('css', function() {
    return gulp.src('css/**/*')
        .pipe( gulp.dest(output_folder + '/css') );
});

gulp.task('cssbundle', function() {
    return gulp.src(path.src.css)
        .pipe(prefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulpif('!**/*.min.css', cleanCSS()))
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(output_folder) );
});

gulp.task('app', function() {
    return gulp.src('app/**/*')
        .pipe( gulp.dest(output_folder + '/app') );
});

gulp.task('deps', function() {
    return gulp.src('bower_components/**/*')
        .pipe( gulp.dest(output_folder + '/bower_components') );
});

gulp.task('utils', function() {
    return gulp.src('js/**/*')
        .pipe( gulp.dest(output_folder + '/js') );
});

gulp.task('i18n', function() {
    return gulp.src('i18n/**/*')
        .pipe( gulp.dest(output_folder + '/i18n') );
});

gulp.task('templates:build', function () {
    var tplOpts = {
        root: 'app',
        filename: 'app.tpls.js',
        standalone: true
    };

    return gulp.src(['app/**/*.html'])
        .pipe( production( minifyhtml({ quotes: false })))
        .pipe( templatecache(tplOpts) )
        .pipe( gulp.dest(output_folder) )
        .pipe( gulp.dest('.') ); // This path is needed by the injection process
});

gulp.task('clean', function () {
    return del([
        'dist/**/*',
        'index.html',
        'app.tpls.js',
        'css/main.css',
        'css/main.css.map'
    ]);
});

// We have to temporarily keep these files in the source/ folder
// so that relative paths can be found during the injection, useref,
// and other tasks.
gulp.task('removeTemp', function () {
    return del([
        'index.html',
        'app.tpls.js',
        'css/main.css',
        'css/main.css.map'
    ]);
});

gulp.task('watch', function() {

    watch(path.watch.js, function() {
        gulp.start('index:build');
    });

    watch(path.watch.html, function() {
        gulp.start('index:build');
    });

    /*watch(path.watch.css, function() {
     gulp.start('index:build');
     });*/

    watch(path.watch.less, function() {
        gulp.start('less:build');
    });
});

gulp.task('log', function() {
    return console.info('===== ', environments.current().$name, ' environment ready =====');
});

gulp.task('default', function(callback) {
    if(development()) {

        runSequence(
            'clean',
            'copyIndex',
            ['less:build', 'templates:build'],
            'index:build',
            'rev',
            'log',
            'watch'
        );
    }
    if(production() || staging() || test()) {

        runSequence(
            'clean',
            'copyIndex',
            'images',
            'fonts',
            'i18n',
            ['less:build', 'templates:build'],
            'cssbundle',
            'index:build',
            'removeTemp',
            'rev',
            'log'
        );
    }

});
