'use strict';

angular.module('terminalApp')
  .controller('MainCtrl', function($scope, $http, PipeService) {

    $scope.info = undefined;
    $scope.error = undefined;

    $scope.selectedTab = 'input';

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
        .success(function(Response) {

          /*$scope.type = Response.headers('Content-Type');*/
          $scope.output = Response;
          $scope.selectedTab = 'output';
        })
        .error(function(Response) {
          $scope.info = undefined;
          $scope.error = 'Failed to execute command';
          $scope.output = Response;
        });
    };

  });
