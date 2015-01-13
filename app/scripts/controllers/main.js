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
      .success(function(response) {
        $scope.pipes = response;
      })
      .error(function() {
        $scope.info = undefined;
        $scope.error = 'Failed to fetch pipes';
      });

    /*    $scope.pipes = [{
          id: '0',
          userId: '0',
          name: 'Echo',
          description: 'Descadassad  sadasdas  s dasdasddsasdsd sadds   sadasdsadasdads sdasdasd sdsddddddddddsdsddsdsdsdsdsdsdssddsdsdsds  sddsdsd ',
          pipe: 'echo'
        }, {
          id: '1',
          userId: '0',
          name: 'Git',
          description: 'Git log to table',
          pipe: 'split -s commit | tokenize --key=commit --key=Author --key=Date --rest=Msg | trim --start=: -s whitespace -s eol | output -t table --name=git_log -c commit -c author -c date -c msg'
        }];*/

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

    $scope.pipeSelected = function(selectedPipe) {
      $scope.pipe = selectedPipe.name;
      $scope.selectedPipe = selectedPipe;
    };

    $scope.clearInput = function() {
      $scope.input = '';
    };

    $scope.submit = function() {
      $scope.info = undefined;
      $scope.error = undefined;
      $scope.output = undefined;
      $scope.executionTime = undefined;

      var start = new Date();

      switch ($scope.mode) {

        case $scope.Modes.CommandLine:
          PipeService.run($scope.commands, $scope.input)
            .success(function(response) {

              /*$scope.type = response.headers('Content-Type');*/
              $scope.output = response;
              $scope.selectedTab = 'output';

              var now = new Date();
              $scope.executionTime = now.getMilliseconds() - start.getMilliseconds();
            })
            .error(function(response) {
              $scope.info = undefined;
              $scope.error = 'Failed to execute command';
              $scope.output = response;
            });
          break;
          
        case $scope.Modes.SavedPipe:
          PipeService.runPipeWithId($scope.selectedPipe.id, $scope.input)
            .success(function(response) {

              $scope.output = response;
              $scope.selectedTab = 'output';

              var now = new Date();
              $scope.executionTime = now.getMilliseconds() - start.getMilliseconds();
            })
            .error(function(response) {
              $scope.info = undefined;
              $scope.error = 'Failed to execute pipe';
              $scope.output = response;
            });
          break;

      }
    };


  });
