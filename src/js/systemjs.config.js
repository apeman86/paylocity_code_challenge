/**
 * System configuration for Angular 2.
 */
(function(global) {
    // map tells the System loader where to look for things
    var map = {
        'app': 'app', // 'dist',

        // angular
        '@angular/core': 'js/lib/@angular/core/bundles/core.umd.js',
        '@angular/common': 'js/lib/@angular/common/bundles/common.umd.js',
        '@angular/compiler': 'js/lib/@angular/compiler/bundles/compiler.umd.js',
        '@angular/platform-browser': 'js/lib/@angular/platform-browser/bundles/platform-browser.umd.js',
        '@angular/platform-browser-dynamic': 'js/lib/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
        '@angular/http': 'js/lib/@angular/http/bundles/http.umd.js',
        '@angular/router': 'js/lib/@angular/router/bundles/router.umd.js',
        '@angular/forms': 'js/lib/@angular/forms/bundles/forms.umd.js',

        // other libraries
        'rxjs': 'js/lib/rxjs',
        'angular2-in-memory-web-api': 'js/lib/angular2-in-memory-web-api'
    };
    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app': { main: 'bootstrap.js',  defaultExtension: 'js' },
        'rxjs': { main: 'Rx.js', defaultExtension: 'js' },
        'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' }
    };


    var config = {
        map: map,
        packages: packages
    };
    System.config(config);
})(this);
