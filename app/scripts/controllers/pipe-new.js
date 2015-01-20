'use strict';

angular.module('terminalApp')
  .controller('PipeNewCtrl', function($scope, $location, PipeService, Client) {

    $scope.save = function() {

      PipeService.newPipe($scope.pipe)
        .success(function(createdPipe) {
          Client.addPipe(createdPipe);
          $location.path('/');
        })
        .error(function(response) {
          $scope.info = undefined;
          $scope.error = 'Failed to save pipe';
          $scope.output = response;
        });
    };

    $scope.cancel = function() {
      $location.path('/');
    };

  });
