'use strict';

angular.module('terminalApp')
  .controller('MainCtrl', function($scope, $location, $http, $window, $timeout, PipeService, AccountService, Client) {

    // The tab's the user can choose from
    $scope.TabModes = {
      Input: 0,
      Output: 1
    };

    // The output format's the user can choose from
    $scope.OutputFormats = {
      Processing: 0,
      Raw: 1,
      Json: 2,
      Table: 3
    };

    // The command modes the user can choose from
    $scope.Modes = {
      CommandLine: 0,
      SavedPipe: 1
    };

    // The input modes the user can choose from
    $scope.InputModes = {
      Text: 0,
      Account: 1
    };

    // Alert info
    $scope.info = undefined;
    $scope.error = undefined;

    // Init 
    Client.setSessionId($window.unescape($location.search().token));
    $scope.token = Client.getSessionId();

    $scope.hideSuggestions = true;

    $scope.in = {
      commandMode: $scope.Modes.CommandLine,
      mode: $scope.InputModes.Text,
      commands: undefined,
      pipe: undefined,
      text: undefined,
      file: undefined,
      fileinfos: undefined
    };

    $scope.out = {
      format: $scope.OutputFormats.Raw,
      output: undefined,
      processing: false,
      executionTime: undefined
    };

    $scope.selected = {
      tab: $scope.TabModes.Input,
      pipe: undefined,
      account: undefined,
      file: undefined
    };

    $scope.breadcrumbPath = [{
      name: 'Account',
      accountId: undefined,
      path: undefined
    }];

    $scope.init = function() {

      AccountService.getAll()
        .success(function(accounts) {
          Client.setAccounts(accounts);
          $scope.accounts = Client.getAccounts();
        })
        .error(function() {
          $scope.info = undefined;
          $scope.error = 'Failed to fetch accounts';
        });

      PipeService.getAllPipes()
        .success(function(pipes) {
          Client.setPipes(pipes);
          $scope.pipes = Client.getPipes();
        })
        .error(function() {
          $scope.info = undefined;
          $scope.error = 'Failed to fetch pipes';
        });

      PipeService.getAllCommands()
        .success(function(commands) {
          Client.setAvailableCommands(commands);
          $scope.availableCommands = Client.getAvailableCommands();
        })
        .error(function() {
          $scope.info = undefined;
          $scope.error = 'Failed to fetch commands';
        });
    };

    // Invoke init to fetch needed data 
    $scope.init();

    $scope.keys = function(obj) {
      return obj ? Object.keys(obj) : [];
    };

    $scope.keyDownCommandLine = function(event) {
      switch (event.keyCode) {
        case 27: // escape
          $scope.visibleSuggestions = false;
          break;
        case 13: // return
          $scope.runPipe();
          break;
        default:
          $scope.visibleSuggestions = true;
          break;
      }
    };

    $scope.commandSelected = function(command) {

      if ($scope.in.commands === undefined || $scope.in.commands.length === 0) {
        $scope.in.commands = command.name;
      } else {
        // Trim the end if the command string
        //$scope.in.commands = $scope.in.commands.trimRight(command.name);
        if ($scope.in.commands.length === 0) {
          $scope.in.commands = command.name;
        } else {
          $scope.in.commands += ' | ' + command.name;
        }
      }
    };

    $scope.pipeSelected = function(selectedPipe) {
      $scope.pipeFilter = selectedPipe.name;
      $scope.in.pipe = selectedPipe;
      $scope.selected.pipe = selectedPipe;
      $scope.visibleSuggestions = false;
    };

    $scope.breadcrumbPathSelected = function(breadcrumbPath) {

      // If the accountId is not set we go to Home
      if (breadcrumbPath.accountId === undefined) {

        $scope.breadcrumbPath = [{
          name: 'Account',
          accountId: undefined,
          path: undefined
        }];

      } else {
        // Set correct breadcrumb path
        var index = $scope.breadcrumbPath.indexOf(breadcrumbPath);
        $scope.breadcrumbPath = $scope.breadcrumbPath.splice(0, index + 1);
        // Clear the current fileinfos list
        $scope.in.fileinfos = undefined;
        // Load the fileinfo for the account and path
        AccountService.fetchFileinfo(breadcrumbPath.accountId, breadcrumbPath.path)
          .success(function(files) {
            $scope.in.fileinfos = files;
          })
          .error(function() {
            $scope.in.fileinfos = [];
            $scope.info = undefined;
            $scope.error = 'Failed to fetch fileinfo';
          });
      }

    };

    $scope.accountSelected = function(selectedAccount) {
      $scope.selected.account = selectedAccount;

      var part = {
        name: selectedAccount.name,
        accountId: selectedAccount.id,
        path: '/'
      };

      $scope.breadcrumbPath = [{
        name: 'Account',
        accountId: undefined,
        path: undefined
      }, part];

      $scope.breadcrumbPathSelected(part);

    };

    $scope.fileSelected = function(selectedFile) {
      if (selectedFile.isDir === true) {
        // Clear the current fileinfos list
        $scope.in.fileinfos = undefined;
        // Load the fileinfo for the account and path
        AccountService.fetchFileinfo($scope.selected.account.id, selectedFile.path)
          .success(function(files) {
            $scope.in.fileinfos = files;

            $scope.breadcrumbPath.push({
              name: selectedFile.name,
              accountId: $scope.selected.account.id,
              path: selectedFile.path
            });
          })
          .error(function() {
            $scope.info = undefined;
            $scope.error = 'Failed to fetch fileinfo';
          });
      } else {
        $scope.in.file = selectedFile;
        $scope.selected.file = selectedFile;
      }

    };

    $scope.computeSelectedFilePath = function() {
      if ($scope.selected.account !== undefined && $scope.in.file !== undefined) {
        return $scope.selected.account.name + $scope.in.file.path;
      }
    };

    $scope.inputBlur = function() {
      $timeout(function() {
          $scope.visibleSuggestions = false;
        },
        300
      );
    };

    $scope.clearInput = function() {
      $scope.in.text = '';
    };

    $scope.isJsonOutput = function() {
      // If the output is a array it's invalid
      if ($scope.out.output instanceof Array) {
        return true;
      }
      // otherwise it's a not a valid json output
      return false;
    };

    $scope.savePipe = function() {
      Client.setCurrentCommands($scope.in.commands);
      $location.path('/pipe-new');
    };

    $scope.editPipe = function() {
      $location.path('/pipe-list');
    };

    $scope.runPipe = function() {
      $scope.info = undefined;
      $scope.error = undefined;
      $scope.out.output = undefined;
      $scope.out.executionTime = undefined;
      $scope.out.format = $scope.OutputFormats.Processing;
      $scope.out.processing = true;
      $scope.visibleSuggestions = false;

      $scope.selected.tab = $scope.TabModes.Output;

      var commands;
      var pipeId;
      var textInput;
      var filePathInput;

      // Set commands or the pipeId to execute
      switch ($scope.in.commandMode) {
        case $scope.Modes.CommandLine:
          commands = $scope.in.commands;
          break;
        case $scope.Modes.SavedPipe:
          pipeId = $scope.in.pipe.id;
          break;
      }

      // Set the input, text or a file from the accounts
      switch ($scope.in.mode) {
        case $scope.InputModes.Text:
          textInput = $scope.in.text;
          break;
        case $scope.InputModes.Account:
          filePathInput = $scope.computeSelectedFilePath();
          break;
      }

      // Execute the pipe with the provided parameters
      PipeService.runPipe(commands, pipeId, textInput, filePathInput)
        .success(function(response) {
          /*$scope.type = response.headers('Content-Type');*/

          $scope.out.format = $scope.OutputFormats.Raw;
          $scope.out.processing = false;
          $scope.out.output = response;
          $scope.selected.tab = $scope.TabModes.Output;
        })
        .error(function(response) {
          $scope.out.format = $scope.OutputFormats.Raw;
          $scope.out.processing = false;
          $scope.out.output = response;
          $scope.selected.tab = $scope.TabModes.Output;

          $scope.info = undefined;
          $scope.error = 'Failed to execute command';
        });

    };

  });

String.prototype.trimRight = function(charlist) {
  if (charlist === undefined) {
    charlist = '\\s';
  }

  return this.replace(new RegExp('[' + charlist + ']+$'), '');
};
