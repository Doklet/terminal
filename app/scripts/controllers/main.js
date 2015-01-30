'use strict';

angular.module('terminalApp')
  .controller('MainCtrl', function($scope, $location, $http, $window, PipeService, AccountService, Client) {

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

    PipeService.getAllPipes()
      .success(function(pipes) {
        Client.setPipes(pipes);
        $scope.pipes = Client.getPipes();
      })
      .error(function() {
        $scope.info = undefined;
        $scope.error = 'Failed to fetch pipes';
      });

    AccountService.getAll()
      .success(function(accounts) {
        Client.setAccounts(accounts);
        $scope.accounts = Client.getAccounts();
      })
      .error(function() {
        $scope.info = undefined;
        $scope.error = 'Failed to fetch accounts';
      });

    // TODO should be fetch from a service
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

    $scope.hideSuggestions = true;

    $scope.in = {
      commandMode: $scope.Modes.CommandLine,
      mode: $scope.InputModes.Text,
      text: undefined,
      file: undefined
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
      name: 'Home',
      accountId: undefined,
      path: undefined
    }];

    $scope.keys = function(obj) {
      return obj ? Object.keys(obj) : [];
    };

    $scope.keyDownCommandLine = function(event) {
      switch (event.keyCode) {
        case 27: // escape
          $scope.visibleSuggestions = false;
          break;
        case 13: // return
          $scope.submit();
          break;
        default:
          $scope.visibleSuggestions = true;
          break;
      }
    };

    $scope.pipeSelected = function(selectedPipe) {
      $scope.pipe = selectedPipe.name;
      $scope.selected.pipe = selectedPipe;
      $scope.visibleSuggestions = false;
    };

    $scope.breadcrumbPathSelected = function(breadcrumbPath) {
      // If the accountId is not set we go to Home
      if (breadcrumbPath.accountId === undefined) {

        $scope.breadcrumbPath = [{
          name: 'Home',
          accountId: undefined,
          path: undefined
        }];

      } else {
        // Load the fileinfo for the account and path
        AccountService.fetchFileinfo(breadcrumbPath.accountId, breadcrumbPath.path)
          .success(function(result) {
            $scope.fileinfos = result.files;
          })
          .error(function() {
            $scope.info = undefined;
            $scope.error = 'Failed to fetch fileinfo';
          });
      }

    };

    $scope.accountSelected = function(selectedAccount) {
      $scope.selectedAccount = selectedAccount;
      // Set the breadcrumb to account view
      $scope.breadcrumbPath = [{
        name: 'Home',
        accountId: undefined,
        path: undefined
      }, {
        name: selectedAccount.name,
        accountId: selectedAccount.id,
        path: '/test'
      }];
    };

    $scope.fileSelected = function(selectedFile) {
      $scope.selectedFile = selectedFile;
      if (selectedFile.is_dir === true) {
        // Load the fileinfo for the account and path
        AccountService.fetchFileinfo($scope.selectedAccount.id, selectedFile.path)
          .success(function(result) {
            $scope.fileinfos = result.files;

            $scope.breadcrumbPath.push({
              name: selectedFile.name,
              accountId: $scope.selectedAccount.id,
              path: selectedFile.path
            });

          })
          .error(function() {
            $scope.info = undefined;
            $scope.error = 'Failed to fetch fileinfo';
          });
      }

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
      Client.setCurrentCommands($scope.commands);
      $location.path('/pipe-new');
    };

    $scope.submit = function() {
      $scope.info = undefined;
      $scope.error = undefined;
      $scope.out.output = undefined;
      $scope.out.executionTime = undefined;
      $scope.out.format = $scope.OutputFormats.Processing;
      $scope.out.processing = true;
      $scope.visibleSuggestions = false;

      var start = new Date();
      $scope.selected.tab = $scope.TabModes.Output;

      switch ($scope.in.commandMode) {

        case $scope.Modes.CommandLine:
          PipeService.run($scope.in.commands, $scope.in.text)
            .success(function(response) {
              /*$scope.type = response.headers('Content-Type');*/

              $scope.out.format = $scope.OutputFormats.Raw;
              $scope.out.processing = false;
              $scope.out.output = response;
              $scope.selected.tab = $scope.TabModes.Output;

              var now = new Date();
              $scope.out.executionTime = now.getMilliseconds() - start.getMilliseconds();
            })
            .error(function(response) {
              $scope.out.format = $scope.OutputFormats.Raw;
              $scope.out.processing = false;
              $scope.out.output = response;
              $scope.selected.tab = $scope.TabModes.Output;

              $scope.info = undefined;
              $scope.error = 'Failed to execute command';
            });
          break;

        case $scope.Modes.SavedPipe:
          PipeService.runPipeWithId($scope.in.pipe.id, $scope.in.text)
            .success(function(response) {

              $scope.out.format = $scope.OutputFormats.Raw;
              $scope.out.processing = false;
              $scope.out.output = response;

              $scope.selected.tab = $scope.TabModes.Output;

              var now = new Date();
              $scope.out.executionTime = now.getMilliseconds() - start.getMilliseconds();
            })
            .error(function(response) {
              $scope.out.format = $scope.OutputFormats.Raw;
              $scope.out.processing = false;
              $scope.out.output = response;

              $scope.selected.tab = $scope.TabModes.Output;

              $scope.info = undefined;
              $scope.error = 'Failed to execute pipe';
            });
          break;
      }

    };


  });
