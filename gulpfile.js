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
let istanbul = require('gulp-istanbul');
let remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
let del = require('del');
let _ = require('lodash');

/**
* Paths.
*/

const BUILD_PATH = 'dist';
// const BUILD_PATH = BUILD_PATH + '/src';
const TEST_BUILD_PATH = BUILD_PATH + '/test';
const UNIT_TEST_BUILD_PATH = TEST_BUILD_PATH + '/unit';
const HELPERS_TEST_BUILD_PATH = TEST_BUILD_PATH + '/helpers';
const INTEGRATION_TEST_BUILD_PATH = TEST_BUILD_PATH + '/integration';
const COVERAGE = 'coverage';

/**
* Globs.
*/

const STATIC_APP_GLOB = ['src/**/*.html'];
const SRC_FILE_GLOB = ['src/**/*.ts', 'typings/index.d.ts', 'custom_typings/index.d.ts'];
const UNIT_TEST_GLOB = ['test/unit/**/*.spec.ts', 'typings/index.d.ts', 'custom_typings/index.d.ts']
const INTEGRATION_TEST_GLOB = ['test/integration/**/*.spec.ts'];
const TEST_GLOB = _.union(UNIT_TEST_GLOB, INTEGRATION_TEST_GLOB);

const APP_PROJECT = ts.createProject('tsconfig.json');

gulp.task('default', ['server']);


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

  /**
 * Build application.
 */
gulp.task('build', ['clean', 'lint'], () => {
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
   * Clean integation tests build directory.
   */
  
  gulp.task('clean-integration-tests', () => {
    del.sync(INTEGRATION_TEST_BUILD_PATH + '/**/*');
  });
  
  /**
   * Build unit tests.
   */
  
  gulp.task('build-unit-tests', ['build-test-helpers'], () => {
      process.env.NODE_ENV = process.env.NODE_ENV || 'localtest';
      return gulp.src(UNIT_TEST_GLOB)
        .pipe(APP_PROJECT())
        .js.pipe(sourcemaps.mapSources((sourcePath, file) => {
          let depth = sourcePath.split('/').length + 2;
          return `../`.repeat(depth) + 'test/unit/' + sourcePath;
        }))
        .pipe(sourcemaps.write('.', {
            includeContent: false
        }))
        .pipe(gulp.dest(UNIT_TEST_BUILD_PATH));
    });
  
  gulp.task('build-test-helpers', ['build', 'clean-unit-tests', 'lint-tests'], () => {
    var tsResult = gulp.src('test/helpers/**/*.ts')
        .pipe(ts({
          target: 'ES6', module: 'commonjs', strictNullChecks: true,
          lib: ["es2016", "dom", "es6", "scripthost"]
        }));
  
    return tsResult.js
        .pipe(gulp.dest(TEST_BUILD_PATH + '/helpers'));
  });
  
  /**
   * Build integration tests.
   */
  
  gulp.task('build-integration-tests', ['clean-integration-tests'], () => {
    return gulp.src(INTEGRATION_TEST_GLOB)
      .pipe(ts({ target: 'ES6', module: 'commonjs' }))
      .js.pipe(sourcemaps.write('./', { 
        includeContent: false,
        mapSources: sourcePath => '../../../test/' + sourcePath
      }))
      .pipe(gulp.dest(INTEGRATION_TEST_BUILD_PATH));
  
  
  });
  
  /**
   * Build all tests.
   */
  
  gulp.task('build-tests', (done) => {
    sequence('build-unit-tests', 'build-integration-tests', 'lint-tests', done);
  });
  
  /**
   * Run unit tests.
   */
  
  gulp.task('unit', ['build', 'build-unit-tests'], () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'localtest';
    return gulp.src([UNIT_TEST_BUILD_PATH + '/**/*.spec.js',HELPERS_TEST_BUILD_PATH + '/**/*.ts'], { read: false })
      .pipe(mocha({ reporter: 'spec' }))
      .on('error', handleError);
  });
  
  /**
   * Run integration tests.
   */
  
  gulp.task('integration', ['build', 'build-integration-tests'], () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'localtest';
    return gulp.src(INTEGRATION_TEST_BUILD_PATH + '/**/*.spec.js', { read: false })
      .pipe(mocha({ reporter: 'spec' }))
      .on('error', handleError)
      .pipe(exit());
  });
  
  /**
   * Run all tests.
   */
  
  gulp.task('test', (done) => {
    sequence('unit', 'integration', done);
  });
  
  /**
   * Run single test.
   * gulp single-test -test-file-name.spec
   */
  
  gulp.task('single-test', ['build','build-integration-tests', 'build-unit-tests'], () => {
    let testName = process.argv[3];
    if (!testName) {
      console.log('no test name found. Usage: gulp single-test -test-file-name.spec');
    }
    // trim leading dashes
    let nameStart = 0;
    while (testName.charAt(nameStart) === '-') {
      nameStart++;
    }
    testName = testName.substring(nameStart);
    console.log('running tests for "' + testName + '"');
    process.env.NODE_ENV = process.env.NODE_ENV || 'localtest';
    return gulp.src([INTEGRATION_TEST_BUILD_PATH + '/**/' + testName + '.js',
      UNIT_TEST_BUILD_PATH + '/**/' + testName + '.js',
      INTEGRATION_TEST_BUILD_PATH + '/init.spec.js'])
      .pipe(mocha({ reporter: 'spec' }))
      .on('error', handleError)
      .pipe(exit());
  });
  
  /**
   * Clean the coverage folder.
   */
  
  gulp.task('clean-coverage', () => {
    return del.sync(COVERAGE + '/**/*');
  });
  
  /**
   * Prepare istanbul for coverage.
   */
  
  gulp.task('pre-coverage', ['clean-coverage', 'build-tests'], () => {
      return gulp.src(BUILD_PATH + '/**/*.js')
          .pipe(istanbul({
              includeUntested: true
          }))
          .pipe(istanbul.hookRequire());
  });
  
  /**
   * Run tests under istanbul coverage. Report to console and produce json for later remapping.
   */
  
  gulp.task('run-coverage', ['clean-coverage', 'pre-coverage'], () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'localtest';
    //return gulp.src([INTEGRATION_TEST_BUILD_PATH + '/**/*.spec.js', UNIT_TEST_BUILD_PATH + '/**/*.spec.js'])
    return gulp.src(UNIT_TEST_BUILD_PATH + '/**/*.spec.js')
      .pipe(mocha({ reporter: 'spec' }))
      .pipe(istanbul.writeReports({
        reporters: ['json'],
        reportOpts: {
          json: { dir: './coverage', file: 'coverage-js.json' }
        }
      }));
  });
  
  gulp.task('showenv', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'localtest';
    util.log('Environment is ' + process.env.NODE_ENV);
  });
  
  /**
   * Run coverage tests against compiled JS then remaps to show coverage against source TS.
   */
  
  gulp.task('coverage', ['clean-coverage', 'pre-coverage', 'run-coverage'], () => {
    return gulp.src('coverage/coverage-js.json')
      .pipe(remapIstanbul({
        reports: {
          'text': '',
          'json': './coverage/coverage-final.json',
          'html': './coverage/html-report'
        }
      })).pipe(exit());;
  })
  
  /**
   * Handle errors.
   */
  
  function handleError(err) {
    util.log(util.colors.red('ERROR...'));
    util.log(err);
    this.emit('end');
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
        .pipe(tslint(TSLINT_OPTIONS))
        .pipe(tslint.report(TSLINT_REPORT_OPTIONS));
  });
  
  /**
   * Gracefully exit.
   */
  
  process.once('SIGINT', function () {
    process.exit(0);
  });
  