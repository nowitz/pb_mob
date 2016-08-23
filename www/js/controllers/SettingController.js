'user strict';
angular.module('app')
    .controller('SettingController', function ($scope, $state, $ionicLoading, $ionicPopup, $translate, ColorsFactory, SendInternetFactory, SettingFactory, RestService) {

        /**
         * Controller pro stránku setting.html
         */

       // $scope.userFactory = JSON.parse(localStorage.getItem('user'));
        $scope.setting = SettingFactory;

        /**
         * Seznam Partyboardu stazeny z DB
         * @type {null}
         */
        $scope.partyboards = null;

        // PRIPRAVA TLACITKA PRO IPHONE NA BACK
        //$scope.doSomething = function(){
        //    console.log("jsemtu");
        //}

        $scope.$on("$ionicView.beforeEnter", function () {
            //console.log($scope.setting.getPartyboard().id_partyboard);
            if ($scope.setting.getPartyboard().id_partyboard === null) {
                RestService.get("partyboards","").then(function (response) {
                    //console.log("stahuju partyboardy " + data);
                    if(response.status === -1){
                        $translate('error').then(
                            function (translate) {
                                $ionicPopup.alert({
                                    title: translate,
                                    template: '{{"serverDisconnect" | translate}}'
                                });
                            });
                    }else {
                        $scope.partyboards = response.data;
                    }
                });
            }
        });

        /**
         * Prepinani jazyka
         * @type {*[]}
         */
        $scope.languages = [
            {name: 'English', shade: 'en'},
            {name: 'Česky', shade: 'cs'}
        ];
        if (localStorage.getItem("language") === "en") {
            $scope.language = $scope.languages[0];
        } else {
            $scope.language = $scope.languages[1];
        }
        $scope.changeLanguage = function (language) {
            $translate.use(language);
            localStorage.setItem("language",language);
        };

        /**
         * Prepinani Partyboardu
         * @param partyboard
         */
        $scope.selectionPartyboard = function (partyboard) {
            if (partyboard !== null) {
                var tmp = {
                    id_partyboard: partyboard.id_partyboard,
                    name: partyboard.name,
                    sms_key: partyboard.sms_key
                }
                $scope.setting.setPartyboard(tmp);


                RestService.get("rolesUsersPartyboards","/"+$scope.userFactory.idUser+"/"+partyboard.id_partyboard).then(function (response) {

                    if(response.status === -1){
                        $translate('error').then(
                            function (translate) {
                                $ionicPopup.alert({
                                    title: translate,
                                    template: '{{"serverDisconnect" | translate}}'
                                });
                            });
                    }
                    else if(response.status === 200){
                        $scope.userFactory.permissions = response.data[0].roles_partyboard.permissions;
                        localStorage.setItem("user", JSON.stringify($scope.userFactory));
                    }else{
                        $scope.userFactory.permissions = null;
                        localStorage.setItem("user", JSON.stringify($scope.userFactory));
                    }
                    //REFRESHNE MI TO MENU !!! POUZIVAM TO PRO SKRYTI A ZOBRAZENI TLACITEK
                    $state.go('app.setting', {}, { reload: true, inherit: true, notify: true });
                });


            }
            //console.log( $scope.setting.getPartyboard());
        }


        /**
         * Nastaveni barvy
         */
       $scope.colors = ColorsFactory.all();
       $scope.color = $scope.colors[6];
        $scope.colorChange = function (rgb) {
            ColorsFactory.setRgbColor(rgb);
            $scope.color = rgb;
            $scope.hide();
        }


        $scope.setColor = function(){
            $translate('cancel').then(
                function (translate) {
                    $ionicLoading.show({
                        template: '<div >' +
                        '<button class="button" style="margin-right: 2ch; background-color: {{colors[0].color}};" ng-click="colorChange({{colors[0]}})"></button>' +
                        '<button class="button" style="margin-right: 2ch; background-color: {{colors[1].color}};" ng-click="colorChange({{colors[1]}})" ></button>' +
                        '<button class="button" style="background-color: {{colors[2].color}};" ng-click="colorChange({{colors[2]}})"></button>' +
                        '<div style="margin-top: 2ch;"></div>' +
                        '<button class="button" style="margin-right: 2ch; background-color: {{colors[3].color}};" ng-click="colorChange({{colors[3]}})"></button>' +
                        '<button class="button" style="margin-right: 2ch; background-color: {{colors[4].color}};" ng-click="colorChange({{colors[4]}})" ></button>' +
                        '<button class="button" style="background-color: {{colors[5].color}};" ng-click="colorChange({{colors[5]}})"></button>' +
                        '<div style="margin-top: 2ch;"></div>' +
                        '<button class="button" style="margin-right: 2ch; background-color: {{colors[6].color}};" ng-click="colorChange({{colors[6]}})"></button>' +
                        '<button class="button" style="margin-right: 2ch; background-color: {{colors[7].color}};" ng-click="colorChange({{colors[7]}})" ></button>' +
                        '<button class="button" style="background-color: {{colors[8].color}};" ng-click="colorChange({{colors[8]}})"></button>' +
                        '</br>' +
                        '<button class="button button-stable loadingClose" ng-click="hide()">' + translate + '</button>' +
                        '</div>',
                        scope: $scope
                    });
                });
        };
        /**
         * Nastaveni typu zpravy
         */
        $scope.typeMessages = SendInternetFactory.all();
        $scope.typeMessage = $scope.typeMessages[0];

        $scope.selectionTypeMessage = function (typeMessage) {
            SendInternetFactory.setTypeMessage(typeMessage);
        }


        /**
         * Skryje notifikaci
         */
        $scope.hide = function () {
            $ionicLoading.hide();
        };

    });
