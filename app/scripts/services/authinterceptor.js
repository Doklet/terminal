'use strict';

angular.module('terminalApp')
  .factory('AuthInterceptor', function($rootScope, $q, $log, $window, $location, Client) {

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
          if ($location.search().authUrl !== undefined) {

            // Fetch the authUrl from the parameters
            var authUrl = $window.unescape($location.search().authUrl);

            // redirect user to signin form 
            $window.top.location = authUrl;
          }
        }
        return $q.reject(response);
      }
    };
  });
