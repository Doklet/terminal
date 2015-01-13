'use strict';

angular.module('terminalApp')
  .factory('AuthInterceptor', function($rootScope, $q, $log, $location, Client) {

    return {
      request: function(config) {
        config.headers = config.headers || {};
        var token = Client.getSessionId('Token');
        if (token) {
          config.headers.Authorization = 'Token ' + token;
        }
        return config;
      },

      responseError: function(response) {
        if (response.status === 401) {
          // handle the case where the user is not authenticated
          //$location.path('www.google.com');
        }
        return $q.reject(response);
      }
    };
  });
