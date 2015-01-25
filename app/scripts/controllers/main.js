'use strict';

angular.module('terminalApp')
  .controller('MainCtrl', function($scope, $location, $http, $window, PipeService, Client) {

    $scope.info = undefined;
    $scope.error = undefined;

    Client.setSessionId($window.unescape($location.search().token));

    $scope.token = Client.getSessionId();

    $scope.selectedTab = 'input';
    $scope.outputFormat = 'raw';

    PipeService.getAllPipes()
      .success(function(pipes) {
        Client.setPipes(pipes);
        $scope.pipes = Client.getPipes();
      })
      .error(function() {
        $scope.info = undefined;
        $scope.error = 'Failed to fetch pipes';
      });

    $scope.suggestions = [{
      name: 'split',
      desc: 'Split a file into chunks',
      example: 'split --rows',
    }, {
      name: 'tokenize',
      desc: 'Tokenize chunks usually after a split command'
    }, {
      name: 'cat',
      desc: 'Concatenate files'
    }, {
      name: 'cpy',
      desc: 'Copy files'
    }];

    $scope.Modes = {
      CommandLine: 0,
      SavedPipe: 1
    };

    $scope.mode = $scope.Modes.CommandLine;

    $scope.OutputFormats = {
      Processing: 0,
      Raw: 1,
      Json: 2,
      Table: 3
    };

    $scope.outputFormat = $scope.OutputFormats.Raw;

    $scope.hideSuggestions = true;
    $scope.processingPipe = false;

    $scope.keys = function(obj) {
      return obj ? Object.keys(obj) : [];
    };

    $scope.keyDownCommandLine = function(event) {
      switch (event.keyCode) {
        case 27: // escape
          $scope.visibleSuggestions = false;
          break;
        case 13: // return
          $scope.submit();
          break;
        default:
          $scope.visibleSuggestions = true;
          break;
      }
    };

    $scope.pipeSelected = function(selectedPipe) {
      $scope.pipe = selectedPipe.name;
      $scope.selectedPipe = selectedPipe;
      $scope.visibleSuggestions = false;
    };

    $scope.clearInput = function() {
      $scope.input = '';
    };

    $scope.isJsonOutput = function() {
      // If the output is a array it's invalid
      if ($scope.output instanceof Array) {
        return true;
      }
      // otherwise it's a not a valid json output
      return false;
    };

    $scope.savePipe = function() {
      Client.setCurrentCommands($scope.commands);
      $location.path('/pipe-new');
    };

    $scope.submit = function() {
      $scope.info = undefined;
      $scope.error = undefined;
      $scope.output = undefined;
      $scope.executionTime = undefined;
      $scope.visibleSuggestions = false;
      $scope.processingPipe = true;
      $scope.outputFormat = $scope.OutputFormats.Processing;

      var start = new Date();
      $scope.selectedTab = 'output';

      switch ($scope.mode) {

        case $scope.Modes.CommandLine:
          PipeService.run($scope.commands, $scope.input)
            .success(function(response) {
              /*$scope.type = response.headers('Content-Type');*/

              $scope.outputFormat = $scope.OutputFormats.Raw;
              $scope.processingPipe = false;
              $scope.output = response;
              $scope.selectedTab = 'output';

              var now = new Date();
              $scope.executionTime = now.getMilliseconds() - start.getMilliseconds();
            })
            .error(function(response) {
              $scope.outputFormat = $scope.OutputFormats.Raw;
              $scope.processingPipe = false;
              $scope.info = undefined;
              $scope.error = 'Failed to execute command';
              $scope.output = response;
            });
          break;

        case $scope.Modes.SavedPipe:
          PipeService.runPipeWithId($scope.selectedPipe.id, $scope.input)
            .success(function(response) {

              $scope.outputFormat = $scope.OutputFormats.Raw;
              $scope.processingPipe = false;
              $scope.output = response;
              $scope.selectedTab = 'output';

              var now = new Date();
              $scope.executionTime = now.getMilliseconds() - start.getMilliseconds();
            })
            .error(function(response) {
              $scope.outputFormat = $scope.OutputFormats.Raw;
              $scope.processingPipe = false;
              $scope.info = undefined;
              $scope.error = 'Failed to execute pipe';
              $scope.output = response;
            });
          break;
      }

    };


  });
