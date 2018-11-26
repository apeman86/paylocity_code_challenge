module.exports = function(config) {
  var appBase    = 'src/app/';
  var appAssets  = '/base/src/app/';
  var mockAssets  = '/test-dist/app/mock/';
  config.set({

    basePath: '.', //web_root

    frameworks: ['jasmine'],

    files: [
      // Polyfills
      'node_modules/core-js/client/shim.min.js',
      'node_modules/reflect-metadata/Reflect.js',

      // System.js
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',

      // Zone.js
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',

      // RxJs
      {pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false},
      {pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false},

      // Karma shim
      {pattern: 'angular-2-karma-test-shim.js', included: true, watched: true}, /* This is the thing that kicks off the angular js unit tests.*/

      // Angular
      {pattern: 'node_modules/@angular/**/*.js', included: false, watched: true},
      {pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: true},
      //Angular 2 modules
      {pattern: 'test-dist/{src,test}/app/**/*.js', included: false, watched: true},
      {pattern: 'test-dist/{src,test}/app/**/*.js.map', included: false, watched: true},
      {pattern: 'test-dist/{src,test}/app/**/*.ts', included: false, watched: true} /* All other tests need to be executed using the lazy loader. (included: false) */
    ],

    // proxied base paths
    proxies: {
      // required for component assets fetched by Angular's compiler
      '/app/': appAssets
    },

    port: 9876,

    logLevel: config.LOG_INFO,

    colors: true,

    autoWatch: false,

    //Using PhantomJS because it doesn't pop the Chrome browser each build.
    browsers: ['PhantomJS'], //'Chrome'

    // Karma plugins loaded
    plugins: [
      'karma-jasmine',
			'karma-coverage',
      'karma-htmlfile-reporter',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher'
    ],

		coverageReporter: {
			dir : 'coverage/',
      includeAllSources: true,
      reporters: [
        {type: 'json', subdir: './', file: 'coverage-app.json'},
        {type: 'in-memory'}
      ]
    },

    htmlReporter: {
      outputFile: 'coverage/report/units.html'
    },
    // Coverage reporter generates the coverage
    reporters: ['progress', 'coverage', 'html'],

    preprocessors: {
      'test-dist/src/app/**/*.js': ['coverage']
    },

    singleRun: true
  });
};
