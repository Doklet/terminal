'use strict';

angular.module('terminalApp')
  .service('Client', function Client() {

    var _pipes = [];
    var _sessionId;

    this.reset = function() {
      _sessionId = undefined;
    };

    this.setSessionId = function(sessionId) {
      _sessionId = sessionId;
    };

    this.getSessionId = function() {
      return _sessionId;
    };

    this.setPipes = function(pipes) {
      _pipes = pipes;
    };

    this.getPipes = function() {
      return _pipes;
    };

    this.addPipe = function(pipe) {
      _pipes.push(pipe);
    };

  });
