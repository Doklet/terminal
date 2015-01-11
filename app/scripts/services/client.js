'use strict';

angular.module('terminalApp')
  .service('Client', function Client() {

    var _sessionId;

    this.reset = function() {
      _sessionId = undefined;  
    };

    this.setSessionId = function(SessionId) {
      _sessionId = SessionId;
    };

    this.getSessionId = function() {
      return _sessionId;
    };
  });
