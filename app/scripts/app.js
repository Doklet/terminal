'use strict';

angular.module('terminalApp', [
    'apiMock',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
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
      //var millis = parseInt(milliseconds % 1000);
/*      var seconds = parseInt((milliseconds / 1000) % 60);
      var minutes = parseInt((milliseconds / (1000 * 60)) % 60);
      var hours = parseInt((milliseconds / (1000 * 60 * 60)) % 24);
      var out = '';

      minutes = (parseInt(minutes) + (60 * parseInt(hours)));
      minutes = (minutes < 10) ? '0' + minutes : minutes;
      seconds = (seconds < 10) ? '0' + seconds : seconds;

      out = minutes + ':' + seconds;

      if (withHour) {
        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;

        out = hours + ':' + minutes + ':' + seconds;
      }

      return out;*/
    };
  });
