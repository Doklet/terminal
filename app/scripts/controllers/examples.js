'use strict';

angular.module('terminalApp')
  .controller('ExamplesCtrl', function ($scope, $location) {

  	$scope.examples = [{
  		name: 'Echo',
  		description: 'One of the simplest and also most useful command is echo. The command will only send the input stright through to the output',
  		commands: 'echo',
  		text: 'Hello world'
  	},{
  		name: 'Tail of csv file',
  		description: 'Extract the last row of a csv file',
  		commands: 'csv | tail --rows=1',
  		text: 'Name;Age\nJohn;39\nVera;19\nBo;31'
  	},{
  		name: 'Reverse a list',
  		description: 'Reverse the orders of the rows in a list',
  		commands: 'csv | reverse',
  		text: 'Key;Value\nA;1\nB;2\nC;3'
  	}];

    $scope.use = function(example) {
    	$location.path('/').search({commands: example.commands, text: example.text});
    };

    $scope.done = function() {
      $location.path('/');
    };

  });
