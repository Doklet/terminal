'use strict';

angular.module('terminalApp')
  .service('Client', function Client() {

    var _pipes = [];
    var _accounts = [];
    var _doclets = [];
    var _sessionId;
    var _availableCommands = [];
    var _currentCommands;

    this.reset = function() {
      _sessionId = undefined;
    };

    this.setSessionId = function(sessionId) {
      if (sessionId !== undefined) {
        _sessionId = sessionId;
      }
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

    this.deletePipe = function(index) {
      _pipes.splice(index, 1);
    };

    this.setAccounts = function(accounts) {
      _accounts = accounts;
    };

    this.getAccounts = function() {
      return _accounts;
    };

    this.setDoclets = function(doclets) {
      _doclets = doclets;
    };

    this.getDoclets = function() {
      return _doclets;
    };

    this.setAvailableCommands = function(availableCommands) {
      _availableCommands = availableCommands;
    };

    this.getAvailableCommands = function() {
      return _availableCommands;
    };

    this.setCurrentCommands = function(commands) {
      _currentCommands = commands;
    };

    this.getCurrentCommands = function() {
      return _currentCommands;
    };

  });
