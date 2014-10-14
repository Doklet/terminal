'use strict';

angular.module('terminalApp')
  .controller('MainCtrl', function($scope, $http, PipeService) {

    $scope.info = undefined;
    $scope.error = undefined;

    $scope.submit = function() {
      $scope.info = undefined;
      $scope.error = undefined;
      $scope.content = undefined;

      PipeService.run($scope.pipe)
        .success(function(Response) {

          /*$scope.type = Response.headers('Content-Type');*/
          $scope.content = Response;
        })
        .error(function() {
          $scope.info = undefined;
          $scope.error = 'Failed to execute command';
        });
    };

  });
