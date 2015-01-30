'use strict';

angular.module('terminalApp')
  .service('PipeService', function PipeService($http) {

    this.getAllPipes = function() {
      return $http.get('/api/pipe');
    };

    this.newPipe = function(pipe) {
      return $http.post('/api/pipe', pipe);
    };

    this.run = function(pipe, input) {
      var pipeArg = 'pipe=' + pipe;
      return $http.get('/api/pipe/run?' + pipeArg, input);
    };

    this.runPipeWithId = function(pipeId, input) {
      var PipeArg = 'id=' + pipeId;
      return $http.post('/api/pipe/run?' + PipeArg, input);
    };

  });
