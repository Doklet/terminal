'use strict';

angular.module('terminalApp')
  .controller('PipeNewCtrl', function($scope, $location, PipeService, Client) {

    $scope.pipe = {
      pipe: Client.getCurrentCommands()
    };

    $scope.save = function() {
      $scope.info = 'Creating pipe, please wait';
      $scope.error = undefined;

      PipeService.newPipe($scope.pipe)
        .success(function(createdPipe) {
          Client.addPipe(createdPipe);
          $location.path('/');
        })
        .error(function(response) {
          $scope.info = undefined;
          if (response.error === 'invalid_name') {
            $scope.error = 'Then pipe name is not valid';
          } else if (response.error === 'invalid_pipe') {
            $scope.error = 'Then commands are not valid';
          } else if (response.error === 'invalid_description') {
            $scope.error = 'Then description is not valid';
          } else {
            $scope.error = 'Internal error please try again';
          }
        });
    };

    $scope.cancel = function() {
      $location.path('/');
    };

  });
