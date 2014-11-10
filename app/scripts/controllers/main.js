'use strict';

angular.module('terminalApp')
  .controller('MainCtrl', function($scope, $http, PipeService) {

    $scope.info = undefined;
    $scope.error = undefined;

    $scope.selectedTab = 'input';
    $scope.outputFormat = 'grid';

    $scope.gridOptions = {
      enableColumnResize: true
    };

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


    $scope.submit = function() {
      $scope.info = undefined;
      $scope.error = undefined;
      $scope.output = undefined;

      PipeService.run($scope.pipe, $scope.input)
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
