'use strict';

angular.module('terminalApp')
  .controller('HelpCtrl', function($scope, $location, Client) {

    $scope.commands = Client.getAvailableCommands();

    $scope.done = function() {
      $location.path('/');
    };

  });
