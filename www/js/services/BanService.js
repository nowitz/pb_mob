'user strict';
angular.module('app')
    .service('BanService', function (RestService, $translate, $ionicPopup) {


        var obj = {};
        /**
         * Nastaví ban uživateli
         */
        obj.setBan = function (msg, data, callback) {
            var obj = {
                "id_partyboard": msg.id_partyboard,
                "phone": msg.phone,
                "id_user": msg.id_user,
                "length_hour": data.timeSelected.hour,
                "description": data.text
            };
            //console.log(msg, data, obj);
            RestService.post("banUserPartyboard",obj).then(function(response) {
                if(response.status === -1){
                    $translate('error').then(
                        function (translate) {
                            $ionicPopup.alert({
                                title: translate,
                                template: '{{"serverDisconnect" | translate}}'
                            });
                        });
                }else {
                    typeof callback === 'function' && callback(response.status);
                }
            });
        };

        /**
         * Získání zabanovaných uživatelù k pøíslušnému Partyboardu
         * @param $scope
         * @param id
         */
        obj.getBan = function ($scope,id){
            RestService.get("banUserPartyboard","/partyboard/"+id).then(function (response) {
                if(response.status === -1){
                    $translate('error').then(
                        function (translate) {
                            $ionicPopup.alert({
                                title: translate,
                                template: '{{"serverDisconnect" | translate}}'
                            });
                        });
                }else {
                    $scope.items = response.data;
                }
            });
        };

        /**
         * Zruší ban uživateli
        */
        obj.unBan = function (id,data, callback) {
            var obj = {
                "id_partyboard": data.partyboards.id_partyboard,
                "phone": data.phone,
                "id_user": data.users.id_user,
                "length_hour": data.length_hour,
                "ongoing": false,
                "description": data.description
            };
            RestService.put("banUserPartyboard",id, obj).then(function (response) {
                if(response.status === -1){
                    $translate('error').then(
                        function (translate) {
                            $ionicPopup.alert({
                                title: translate,
                                template: '{{"serverDisconnect" | translate}}'
                            });
                        });
                }else {
                    typeof callback === 'function' && callback(response.status);
                }
            });
        };
        return obj;
    });

