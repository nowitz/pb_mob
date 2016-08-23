'user strict';
angular.module('app')
    .controller('UsersBanController', function ($scope, $ionicLoading, SettingFactory, BanService) {

        /**
         * Controller pro stránku usersBan.html
         */

        $scope.setting = SettingFactory;

        $scope.data = {
            showButton: true
        };

        $scope.$on("$ionicView.beforeEnter", function () {
            //console.log($scope.setting.getPartyboard().id_partyboard, $scope.setting.getPartyboard().id_partyboard !== null);
            if ($scope.setting.getPartyboard().id_partyboard !== null) {
                BanService.getBan($scope, $scope.setting.getPartyboard().id_partyboard);
            }
        });


        $scope.unBan = function(item) {
            BanService.unBan(item.id_ban_user_partyboard, item, function (status){
                if(status === 200){
                    BanService.getBan($scope, $scope.setting.getPartyboard().id_partyboard);
                    $ionicLoading.show({
                        template: '{{ "unBanMessage" | translate }}',
                        duration: 1500,
                        scope: $scope
                    });
                }else{
                    $ionicLoading.show({
                        template: '{{ "unBanErrorMessage" | translate }}',
                        duration: 1500,
                        scope: $scope
                    });
                }

            });
        };

    });
