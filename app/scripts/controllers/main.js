'use strict';

angular.module('terminalApp')
  .controller('MainCtrl', function($scope, $http, PipeService) {

    $scope.info = undefined;
    $scope.error = undefined;

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
      $scope.content = undefined;

      PipeService.run($scope.pipe)
        .success(function(Response) {

          /*$scope.type = Response.headers('Content-Type');*/
          $scope.content = Response;
        })
        .error(function(Response) {
          $scope.info = undefined;
          $scope.error = 'Failed to execute command';
          $scope.content = Response;
        });
    };

  });
