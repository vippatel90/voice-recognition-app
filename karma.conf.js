// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-mocha-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    // A list of reporters to use for printing testcase in console/browser. default is 'progress'
    // for other than 'dots' and 'progress' report, have to install NPM module
    //like for below 'kjhtml' we need  'karma-jasmine-html-reporter' plugin
    //khtml prints in browser only when use normal chrome
    //mocha prints in console itself, used with phantomjs browser and chrome headless browser
    reporters: ['mocha', 'kjhtml'], 
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    // toggle whether to watch files and rerun tests upon incurring changes
    autoWatch: true,
    browsers: ['ChromeHeadlessCustom'],
    customLaunchers: {
        ChromeHeadlessCustom: {
            base: 'ChromeHeadless', // browser
            flags: [
                '--no-sandbox', // needed to run test  case in windows also
            ],
        },
    },
    // if true, Karma runs tests once and exits
    singleRun: false
  });
};
