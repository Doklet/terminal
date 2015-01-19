'use strict';

angular.module('terminalApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'jsonFormatter',
    'apiMock'
  ])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/pipe-new', {
        templateUrl: 'views/pipe-new.html',
        controller: 'PipeNewCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .filter('bytes', function() {
    return function(bytes, precision) {
      if (bytes === undefined || bytes === '' || isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
        return '-';
      }
      if (typeof precision === 'undefined') {
        precision = 1;
      }
      var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
        number = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };
  })
  .filter('time', function() {
    return function(milliseconds) {
      if (milliseconds === undefined) {
        return '';
      }
      return milliseconds + ' ms';
    };
  });

angular.module('terminalApp').config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
