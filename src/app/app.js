(function () {
  'use strict';

  // Declare app level module which depends on views, and components
  angular.module('myApp', [
    'ngRoute',
    'ngAnimate',
    'ngCookies',
    'ui.bootstrap',
    'blockUI'
  ]).
    config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          controller: 'HomeCtrl',
          templateUrl: 'user/home/app-user-home-tmpl.html'
        })
        .when('/login', {
          controller: 'LoginCtrl',
          templateUrl: 'user/login/app-user-login-tmpl.html'

        })
        .when('/register', {
          controller: 'RegisterCtrl',
          templateUrl: 'user/register/app-user-register-tmpl.html'

        })
        .when('/upload-pdf', {
          controller: 'UploadPDFCtrl',
          templateUrl: 'document/document-upload-tmpl.html'
        })
        .otherwise({ redirectTo: '/login' });
    }]).run(
    function ($rootScope, $location, $cookies, $http, FlashService) {
      $rootScope.globals = {};
      $rootScope.$on('$locationChangeStart', function (event, next, current) {
        FlashService.clearFlashMessage();
      });
    }
  );
})();
