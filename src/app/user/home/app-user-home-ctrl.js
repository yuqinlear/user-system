/**
 * Created by paul on 2/10/16.
 */
(function () {
  'use strict';

  function HomeCtrl($scope, $rootScope, $location, $log, UserService, AuthenticationService, blockUI) {

    if ($rootScope.globals.currentUser) {
      $scope.user = $rootScope.globals.currentUser;
    } else {
      loadCurrentUser();
    }

    function loadCurrentUser() {
      blockUI.start();

      UserService.getCurrentUser()
        .then(
          function (user) {
            $scope.user = user;
          },
          function (err) {
            $log.error(err);
            $location.path('/login');
          }
      ).finally(
        function () {
          blockUI.stop();
        }
      );
    }

    $scope.logout = function () {
      $scope.dataLoading = true;
      AuthenticationService.logout()
        .then(
        function (response) {
          $log.log('the user logged out successfully');
        },
        function (err) {
          $log.log('error occurred during logout');
        }
      ).finally(
        function () {
          $scope.dataLoading = false;
          $location.path('/login');
        }
      );
    };

  }

  angular.module('myApp').controller('HomeCtrl', HomeCtrl);

})();
