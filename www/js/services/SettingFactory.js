'user strict';
angular.module('app')
    .factory('SettingFactory', function () {

        /**
         * Factory pro nastavení aplikace
         */

        var setting = {
                partyboard: {
                    id_partyboard: null,
                    name: null,
                    sms_key: null
                },
                nick: null,
                type_message: null
            };

        return {
            get: function () {
                return setting;
            },
            del: function () {
                setting = {
                    partyboard: {
                        id_partyboard: null,
                        name: null,
                        sms_key: null
                    },
                    nick: null,
                    type_message: null
                };
            },
            setPartyboard: function (pos) {
                setting.partyboard.id_partyboard = pos.id_partyboard;
                setting.partyboard.name = pos.name;
                setting.partyboard.sms_key = pos.sms_key;
            },
            getPartyboard: function(){
                return setting.partyboard;
            },
            setNick: function (pos) {
                setting.nick = pos;
            },
            getNick: function(){
                return setting.nick;
            },
            setTypeMessage: function (pos) {
                setting.type_message = pos;
            },
            getTypeMessage: function(){
                return setting.type_message;
            }
        }
    });