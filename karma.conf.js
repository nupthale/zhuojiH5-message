module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    // list of files / patterns to load in the browser
    files: [
      'javascript/common.js',
      'javascript/index.js',
      'test/sinon-1.12.1.js',
      'test/specs/*Spec.js'
    ],
    plugins: [
          'karma-jasmine',
          'karma-chrome-launcher'
    ],
    exclude: [],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};