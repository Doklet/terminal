'use strict';

angular.module('terminalApp')
  .service('PipeService', function PipeService($http) {

    this.run = function(Pipe, Input) {
      var PipeArg = 'pipe=' + Pipe;
      return $http.post('/api/pipe/run?' + PipeArg, Input);
    };

  });
