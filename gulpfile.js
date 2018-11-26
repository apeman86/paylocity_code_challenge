"use strict";

let gulp = require('gulp');
let sequence = require('gulp-sequence');
let exit = require('gulp-exit');
let tslint = require('gulp-tslint');
let util = require('gulp-util');
let mocha = require('gulp-mocha');
let nodemon = require('gulp-nodemon');
let ts = require('gulp-typescript');
let sourcemaps = require('gulp-sourcemaps');
let karma = require('karma');
let Promise = require("bluebird");
let concatJSON = require("gulp-concat-json");
let istanbul = require('gulp-istanbul');
let remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
let watch = require('gulp-watch');
let del = require('del');
let _ = require('lodash');
let merge = require('merge-stream');

/**
* Paths.
*/

const BUILD_PATH = 'dist';
// const BUILD_PATH = BUILD_PATH + '/src';
const TEST_BUILD_PATH = '/test-dist';
const UNIT_TEST_BUILD_PATH = TEST_BUILD_PATH + '/unit';
const HELPERS_TEST_BUILD_PATH = TEST_BUILD_PATH + '/helpers';
const COVERAGE = 'coverage';

/**
* Globs.
*/

const STATIC_APP_GLOB = ['src/**/*.html', 'src/**/*.js', 'src/**/*.css'];
const SRC_FILE_GLOB = ['src/**/*.ts', 'typings/index.d.ts'];
const UNIT_TEST_GLOB = ['test/unit/**/*.spec.ts', 'typings/index.d.ts'];
const TEST_GLOB = _.union(UNIT_TEST_GLOB);

const APP_PROJECT = ts.createProject('tsconfig.json');
const TEST_APP_PROJECT = ts.createProject('tsconfig.test.json');

gulp.task('default', ['server', 'watch']);


gulp.task('clean', () => {
    del.sync(BUILD_PATH + '/**/*');
});

/**
 * TSLint options
 */

const TSLINT_REPORT_OPTIONS = {
    emitError: true,
    summarizeFailureOutput: true
};

var copyLibTask = function () {
  var assets = [
      // Libs
      {
          src: 'node_modules/core-js/client/shim.min*.{js,map}',
          dest: 'js/lib'
      }, {
          src: 'node_modules/zone.js/dist/zone*.{js,map}',
          dest: 'js/lib'
      }, {
          src: 'node_modules/reflect-metadata/Reflect*.{js,map}',
          dest: 'js/lib'
      }, {
          src: 'node_modules/systemjs/dist/system*.{js,map}',
          dest: 'js/lib'
      }, {
          src: 'node_modules/@angular/**/*',
          dest: 'js/lib/@angular'
      }, {
          src: 'node_modules/angular2-in-memory-web-api/**/*',
          dest: 'js/lib/angular2-in-memory-web-api'
      }, {
          src: 'node_modules/rxjs/**/*',
          dest: 'js/lib/rxjs'
      }, {
        src: 'node_modules/es5-shim/**/*',
        dest: 'js/lib/es5-shim'
      }, {
        src: 'node_modules/es6-shim/**/*',
        dest: 'js/lib/es6-shim'
      }
  ];

  var mergedStreams = merge();

  assets.forEach(function(asset) {
      mergedStreams.add(gulp.src(asset.src)
          .pipe(gulp.dest('dist/' + asset.dest))
          .on('error', handleError)
      );
  });

  return mergedStreams;
};

gulp.task('copy-libraries', copyLibTask);

  /**
 * Build application.
 */
gulp.task('build', ['clean', 'copy-libraries', 'lint' ], () => {
    // Copy static content.
    gulp.src(STATIC_APP_GLOB)
        .pipe(gulp.dest(BUILD_PATH));
    // Build source.
    return gulp.src(SRC_FILE_GLOB)
        .pipe(sourcemaps.init())
        .pipe(APP_PROJECT())
        .js.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(BUILD_PATH));
  });
  
  /**
   * Start server for development purposes.
   * Build and restart if changes are detected in the source.
   */
  
  gulp.task('server', ['build'], () => {
    process.env.NODE_ENV = process.argv.env || 'development';
    nodemon({
      script: 'dist/server/server.js',
      watch: ['src/'],
      ext: 'ts json',
      tasks: ['build'],
      env: { 'NODE_ENV': process.env.NODE_ENV || 'development' },
      legacyWatch: true
    });
  });

  /**
   * Clean unit tests build directory.
   */

  gulp.task('clean-unit-tests', () => {
      del.sync(UNIT_TEST_BUILD_PATH + '/**/*');
    });

  /**
   * Build unit tests.
   */
  
  gulp.task('build-unit-tests', (done) => {
    del('test-dist').then(() => {
      gulp.src('src/**/*.ts').pipe(gulp.dest('test-dist/src'));
      TEST_APP_PROJECT.src()
        .pipe(sourcemaps.init())
        .pipe(TEST_APP_PROJECT())
        .pipe(sourcemaps.write('.', {
          includeContent: true
        }))
        .pipe(gulp.dest('test-dist'))
        .on('end', done)
        .on('error', handleError);
    });
  });
  
  /**
   * Build all tests.
   */
  
  gulp.task('build-tests', (done) => {
    sequence('lint-tests', 'build-unit-tests', done);
  });
  
  
  /**
   * Run all tests.
   */
  
  gulp.task('test', ['build-tests'], function(done) {
    if (process.argv.indexOf('-s') > -1) {
      console.log('Skipping Unit Tests!!!');
      done();
    } else {
      runAppTests()
        .then(runServerTests)
        .catch(handleError)
        .finally(() => done());
    }
  });

  gulp.task('app-test', ['build-tests'], function(done) {
    runAppTests()
      .catch(handleError)
      .finally(() => done());
  });
  
  gulp.task('server-test', ['build-tests'], function(done) {
    runServerTests()
      .catch(handleError)
      .finally(() => done());
  });
  
  /***
   * Run coverage tests against compiled JS then remaps to show coverage against source TS.
   */

  gulp.task('coverage', function() {
    sequence('app-test','run-server-coverage', function() {
      gulp.src(['coverage/coverage-app.json','coverage/coverage-server.json'])
        .pipe(concatJSON('coverage/coverage-final.json'))
        .pipe(remapIstanbul({
          reports: {
            'text': '',
            'json': './coverage/coverage-final.json',
            'html': './coverage/html'
          }
        }))
        .pipe(exit())
        .on('error', handleError);
    });
  });

  gulp.task('app-coverage', ['app-test'], function() {
    return gulp.src('coverage/coverage-app.json')
      .pipe(remapIstanbul({
        reports: {
          'text': ''
        }
      }))
      .pipe(exit())
      .on('error', handleError);
  });

  gulp.task('server-coverage', ['run-server-coverage'], function() {
    return gulp.src('coverage/coverage-server.json')
      .pipe(remapIstanbul({
        reports: {
          'text': '',
          'json': './coverage/coverage-server.json',
          'html': './coverage/html'
        }
      }))
      .pipe(exit())
      .on('error', handleError);
  });

  gulp.task('pre-server-coverage', ['build-tests'], function() {
    return gulp.src('test-dist/src/server/**/*.js')
      .pipe(istanbul({
        includeUntested: true
      }))
      .pipe(istanbul.hookRequire());
  });

  gulp.task('run-server-coverage', ['pre-server-coverage'], function() {
    return gulp.src(['test-dist/test/server/**/*.spec.js'])
      .pipe(mocha({ reporter: 'spec' }))
      .pipe(istanbul.writeReports({
        reporters: ['json'],
        reportOpts: {
          json: { dir: './coverage', file: 'coverage-server.json' }
        }
      }));
  });
  
  /**
   * Handle errors.
   */
  
  function handleError(err) {
    util.log(util.colors.red('ERROR...'));
    util.log(err);
    process.exit(1);
  }
  
  /**
   * Handle code coverage threshold failures.
   */
  
  function handleThresholdError(err) {
    if (err.message === 'Coverage failed') {
      util.log(util.colors.yellow('Coverage below threshold!!!'));
    } else {
      throw err;
    }
  }
  
  /**
   * Run typescript linter on code
   */
  gulp.task('lint', () => {
    return gulp.src('src/**/*.ts')
        .pipe(tslint({
            configuration: './tslint.json'
        }))
        .pipe(tslint.report(TSLINT_REPORT_OPTIONS))
        .on('error', handleError);
  });
  
  /**
   * Run typescript linter on tests
   */
  
  gulp.task('lint-tests', () => {
    return gulp.src(['test/**/*.ts'])
      .pipe(tslint({
        configuration: './tslint.json'
      }))
      .pipe(tslint.report(TSLINT_REPORT_OPTIONS));
  });

  gulp.task('watch', function () {
    return watch(STATIC_APP_GLOB.concat(SRC_FILE_GLOB))
        .pipe(gulp.dest(BUILD_PATH));
  });
  
  /**
   * Gracefully exit.
   */
  
  process.once('SIGINT', function () {
    process.exit(0);
  });

  function runAppTests() {
    return new Promise((resolve, reject) => {
      new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: process.argv.indexOf('-d') <= -1,
        browsers: process.argv.indexOf('-d') > -1 ? ['Chrome'] : ['PhantomJS']
      }, function (results) {
        if (results === 1) {
          let hardFail = process.argv.indexOf('-h');
          if (hardFail > -1) {
            reject(new Error('App unit tests failed. Please Fix.'));
          } else {
            console.error('App unit tests failed. Please Fix.');
          }
        }
        resolve();
      }).start();
    });
  }
  
  function runServerTests() {
    return new Promise((resolve, reject) => {
      gulp.src(['test-dist/test/server/**/*.spec.js'], { read: false })
        .pipe(mocha({reporter: 'spec'}))
        .on('end', resolve())
        .on('error', (err) => reject(err));
    });
  }
  