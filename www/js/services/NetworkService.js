'user strict';
angular.module('app')
    .service('NetworkService', function ($rootScope, $cordovaNetwork) {

        var device = {};
        device.isOnline = true; //osetreni kvuli prohlizeci

        var obj = {};
        /**
         * Overi mi to zda jsem pripojenej k internetu
         */
        obj.init = function () {
            device.isOnline = $cordovaNetwork.isOnline();
            // listen for Online event
            $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                device.isOnline = false;
            });
            // listen for Offline event
            $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                device.isOnline = true;
            });
        }

        obj.checkOnline = function () {
            return device.isOnline;
        }
        return obj;
    });

