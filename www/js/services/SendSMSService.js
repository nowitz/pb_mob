'user strict';
angular.module('app')
    .service('SendSMSService', function ($cordovaSms, $translate) {

        /**
         * Service pro odesílání SMS zpráv
         */

        var device = {};
        device.options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: 'INTENT'  // send SMS with the native android SMS messaging
            }
        };

        var obj = {};
        obj.init = function (phone, text) {
            $cordovaSms
                .send(phone, text, device.options)
                .then(function () {
                    $translate('smsSuccess').then(
                        function (translate) {//prelozeno
                           // alert(translate);
                        });
                }, function (error) {
                    $translate('smsError').then(
                        function (translate) {
                            //alert(translate + error);
                        });
                });
        }
        return obj;
    });

