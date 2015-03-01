'use strict';

angular.module('terminalApp')
  .controller('PipeListCtrl', function($scope, $location, PipeService, Client) {
    $scope.pipes = Client.getPipes();

    $scope.delete = function(index) {
      var pipe = $scope.pipes[index];

      PipeService.deletePipe(pipe)
        .success(function() {
          Client.deletePipe(index);
        })
        .error(function() {
          $scope.info = undefined;
          $scope.error = 'Internal error please try again';
        });
    };

    $scope.done = function() {
      $location.path('/');
    };

  });
