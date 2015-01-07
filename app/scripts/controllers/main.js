'use strict';

angular.module('terminalApp')
  .controller('MainCtrl', function($scope, $http, PipeService) {

    $scope.info = undefined;
    $scope.error = undefined;

    $scope.selectedTab = 'input';
    $scope.outputFormat = 'raw';

    $scope.testData = [{
      name: 'Adam',
      age: 12
    }, {
      name: 'Adam',
      age: 12
    }, {
      name: 'Adam',
      age: 12
    }];

    $scope.pipes = [{
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
    }];

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

    $scope.mode=$scope.Modes.CommandLine;

    $scope.pipeSelected = function(selectedPipe) {
      $scope.pipe = selectedPipe.name;
      $scope.selectedPipe = selectedPipe.selectedPipe;
    };

    $scope.clearInput = function() {
      $scope.input = '';
    };

    $scope.submit = function() {
      $scope.info = undefined;
      $scope.error = undefined;
      $scope.output = undefined;

      PipeService.run($scope.commands, $scope.input)
        .success(function(response) {

          /*$scope.type = response.headers('Content-Type');*/
          $scope.output = response;
          $scope.selectedTab = 'output';
          $scope.gridOptions.data = response;
        })
        .error(function(response) {
          $scope.info = undefined;
          $scope.error = 'Failed to execute command';
          $scope.output = response;
        });
    };

  });
