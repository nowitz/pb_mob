'user strict';
angular.module('app')
    .factory('SendInternetFactory', function () {

        var typeMessages = [
            {name: 'internet', key: 'int'},
            {name: 'sms', key: 'sms'}
            //{name: '5 sms win', key: '5smsWin'}
        ];

        var typeMessage = typeMessages[0];

        return {
            all: function () {
                return typeMessages;
            },
            setTypeMessage: function (tmp) {
                typeMessage = tmp;
            },
            getTypeMessager: function(){
                return typeMessage;
            }
        }
    });

