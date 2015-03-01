'use strict';

angular.module('terminalApp')
  .service('PipeService', function PipeService($http) {

    this.getAllPipes = function() {
      return $http.get('/api/pipe');
    };

    this.newPipe = function(pipe) {
      return $http.post('/api/pipe', pipe);
    };

    this.deletePipe = function(pipe) {
      return $http.delete('/api/pipe/' + pipe.id);
    };

    this.runPipe = function(commands, pipeId, text, filePath) {
      var args = '';
      var input = '';

      if (commands !== undefined){
        args += 'pipe=' + commands;
      }

      if (pipeId !== undefined){
        args += 'id=' + pipeId;
      }

      if (filePath !== undefined){
        args += '&input=' + filePath;
      }

      if (text !== undefined){
        input = text;
      }

      return $http.post('/api/pipe/run?' + args, input);
    };

  });
