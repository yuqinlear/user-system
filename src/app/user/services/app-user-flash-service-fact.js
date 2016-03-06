/**
 * Created by paul on 2/10/16.
 */
(function () {
  'use strict';

  function FlashService($rootScope) {

    function clearFlashMessage() {
      var flash = $rootScope.flash;
      if (flash) {
        if (!flash.keepAfterLocationChange) {
          delete $rootScope.flash;
        } else {
          // only keep for a single location change
          flash.keepAfterLocationChange = false;
        }
      }
    }

    function success(message, keepAfterLocationChange) {
      $rootScope.flash = {
        message: message,
        type: 'success',
        keepAfterLocationChange: keepAfterLocationChange
      };
    }

    function error(message, keepAfterLocationChange) {
      $rootScope.flash = {
        message: message,
        type: 'error',
        keepAfterLocationChange: keepAfterLocationChange
      };
    }

    return {
      clearFlashMessage: clearFlashMessage,
      success: success,
      error: error
    };
  }

  angular.module('myApp').factory('FlashService', FlashService);

})();
