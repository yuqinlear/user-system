/**
 * Created by paul on 2/10/16.
 */
(function () {
  'use strict';

  function UserService($q, $http) {

    function getCurrentUser() {
      return $http.get('/api/current-user').then(_handleSuccess, _handleError('Error getting currentUser'));
    }

    function create(user) {
      return $http.post('/api/current-user', user).then(_handleSuccess, _handleError('Error creating user'));
    }

    function _handleSuccess(res) {
      return res.data;
    }

    function _handleError(errMsg) {
      return function (err) {
        return $q.reject({ err: err, message: errMsg + ': ' + err.data.message });
      };
    }

    return {
      getCurrentUser: getCurrentUser,
      create: create
    };
  }
  angular.module('myApp').factory('UserService', UserService);

})();
