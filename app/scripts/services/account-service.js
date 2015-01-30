'use strict';

angular.module('terminalApp')
  .service('AccountService', function AccountService($http) {

    this.getAll = function() {
      return $http.get('/api/account');
    };

    this.fetchFileinfo = function(accountId, path) {
      return $http.get('/api/' + accountId + '/file_info/' + path);
    };

  });
