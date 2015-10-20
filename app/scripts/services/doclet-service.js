'use strict';


angular.module('terminalApp')
  .service('DocletService', function($http) {

    this.list = function() {
      return $http.get('/api/doclet');
    };

  });
