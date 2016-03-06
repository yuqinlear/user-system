/**
 * Created by paul on 2/10/16.
 */
(function () {
  'use strict';

  function LoginCtrl($scope, $rootScope, $location, FlashService, AuthenticationService) {

    AuthenticationService.clearCredentials();

    $scope.login = function () {
      $scope.dataLoading = true;
      AuthenticationService.login($scope.username, $scope.password)
        .then(
          function (response) {
            $rootScope.globals.currentUser = response.user;
            $location.path('/');
          },
          function (err) {
            FlashService.error(err.message);
            $scope.dataLoading = false;
          }
        );
    };
  }

  angular.module('myApp').controller('LoginCtrl', LoginCtrl);

})();
