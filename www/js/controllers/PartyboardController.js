'user strict';
angular.module('app')
    .controller('PartyboardController', function ($scope, $state, $timeout, $translate, $ionicLoading, ColorsFactory, SendSMSService, UserFactory,
                                                  SendInternetFactory, $ionicPopup, MessageService, BanService, RestService,
                                                  $ionicScrollDelegate, SettingFactory, BackButtonFactory) {

        /**
         * Controller pro stránku partyboard.html
         */

        $scope.setting = SettingFactory;
        $scope.colors = ColorsFactory;
        $scope.userFactory = null;
        BackButtonFactory.backButtonCancel();

        /**
         * Ciselnik s poctem hodin pro nastaveni banu
         * @type {*[]}
         */
        $scope.times = [
            { hour: 1 },
            { hour: 2 },
            { hour: 4 },
            { hour: 6 },
            { hour: 12 },
            { hour: 24 },
            { hour: 48 },
            { hour: 96 }
        ];
        /**
         * Přenáší data do view
         * @type {{showAdministration: boolean, message: string}}
         */
        $scope.data = {
            showAdministration: true, // Nastaveni pro tlacitka administrace
            message: "", //Zprava z texboxu (obsah zpravy)
            timeSelected: $scope.times[5],//Defaultni nastaveni banu na 24 hodin
            text:"Zablokování odesílaní zpráv z důvodu neslušného chování." //Defaultni messages banu
        };

        /**
         * Základni nastaveni pro stahovani zprav
         * @type {number}
         * @private
         */
        var _limit = 20;
        var params = {
            limit: _limit
            //offset: 0
        };

        /**
         * Formát struktury pro odeslaní právy
         * @type {{id_partyboard: null, key_word: null, nick: null, text: null}}
         */
        var sendData = {
            "id_partyboard": null,
            "id_user": null,
            "phone": null,
            "key_word": null,
            "nick": null,
            "text": null
        };

        /**
         * Uchovava vybranou zpravu z listu
         * @type {{}}
         */
        var objMessage = null;

        $scope.loadingHistory = false;

        $scope.$watch(function () {
                return $scope.data.message;
            },
            function (newValue, oldValue) {
                if (newValue == oldValue) {
                    return;
                }
                $scope.data.message = newValue;
            }, true);

        $scope.send = function (message) {
            //todo bude se tu nacitat mobilni cislo, message, atd..
            //console.log($scope.userFactory);
            sendData.nick = $scope.userFactory.nick;
            sendData.text = message;
            sendData.phone = $scope.userFactory.phone;
            if (SendInternetFactory.getTypeMessager().key == "int") {
                sendData.id_partyboard = $scope.setting.getPartyboard().id_partyboard;
                sendData.id_user = $scope.userFactory.idUser;
                //console.log($scope.userFactory.idUser);
                MessageService.sendMessage(sendData, $scope);
            } else if (SendInternetFactory.getTypeMessager().key == "sms") {
                sendData.key_word = $scope.setting.getPartyboard().sms_key;
                SendSMSService.init(736300202, sendData.key_word + " " + sendData.nick + " " + message);
            } else {
                //todo doresit vyherni sms
                alert("vyherni sms");
            }
            $scope.data.message = "";
            //console.log(sendData);
        };


        //pred nactenim kontroleru se zavola takhle funkce a overi se zda je vybranej nejaky PB
        $scope.$on("$ionicView.beforeEnter", function () {
            //console.log(JSON.parse(localStorage.getItem('user')));
            if (JSON.parse(localStorage.getItem('user')) === "login") {
                $state.go('app.login');
            } else if ($scope.setting.getPartyboard().id_partyboard === null) {
                $state.go('app.show');
            }
            else {
                $scope.userFactory = JSON.parse(localStorage.getItem('user'));
                $scope.loadMore();
            }
        });

        /**
         * Stáhne nejnovější zpravy
         */
        $scope.loadMore = function () {
            //console.log(params.limit);
            $scope.loadingHistory = true;
            MessageService.loadBlogs(params, $scope.setting.getPartyboard().id_partyboard,function () {
                $scope.$broadcast("scroll.infiniteScrollComplete");
                $scope.loadingHistory = false;
                params.limit = _limit;
                $ionicScrollDelegate.scrollBottom(); //soupnu list dolu
            }, $scope);

        };

        /**
         * Stahne historické zprávy
         * @param param
         */
        $scope.historyData = function (param) {
            //console.log(param.gesture);
            if (param.gesture.direction == 'down' && params.limit < 100) {
                params.limit = params.limit + 10;
                MessageService.loadBlogs(params,  $scope.setting.getPartyboard().id_partyboard, function () {
                    $scope.$broadcast("scroll.infiniteScrollComplete");
                }, $scope);
            }
        };


        /**
         * Skryje notifikaci
         */
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        /**
         * Notifikace s výberem tlacitek
         * @param msg
         */
        $scope.administration = function (msg) {
            //console.log(msg);
            // console.log(UserFactory.getPermissions().admin);
            objMessage = msg;

            $translate('cancel').then(
                function (translate) {
                    $ionicLoading.show({
                        template: '<div >' +
                        '<a style="margin-right: 2ch" ng-click="setBan()"><img src="img/ban.png"></a>' +
                        '<a ng-click="delMessage()"><img src="img/del.png"></a>' +
                        '<br>' +
                        '<button class="button button-stable loadingClose" ng-click="hide()">' + translate + '</button>' +
                        '</div>',
                        scope: $scope
                    });
                });
        };


        /**
         * Funkce ktera resi zmenu casu pro ban
         * @param timeSelected
         */
        $scope.changeTime = function(timeSelected){
            $scope.data.timeSelected = timeSelected ;
        };

        /**
         * Nastavi ban uzivateli/telefonimu cislu
         */
        $scope.setBan = function () {
            $scope.hide();
            var myPopup = null;
            $translate(['cancel', 'send']).then(function (translation) {
                myPopup = $ionicPopup.show({
                    template: '<input class="popup-input" type="text" ng-model="data.text">' +
                              '</br>' + '<select style="width: 100%" required ng-change="changeTime(data.timeSelected)" ng-model="data.timeSelected" ng-options="time.hour for time in times"></select>',//'<input class="popup-input" type="text" ng-model="data.time" ng-init="data.time">',
                    title: 'BAN',
                    scope: $scope,
                    buttons: [
                        {text: translation.cancel},
                        {
                            text: '<b>' + translation.send + '</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.data.text && ! $scope.data.timeSelected) {
                                    e.preventDefault();
                                } else {
                                    return $scope.data;
                                }
                            }
                        }
                    ]
                });
                myPopup.then(function (data) {
                    BanService.setBan(objMessage, data, function (response){
                        if(response.status === -1){
                            $translate('error').then(
                                function (translate) {
                                    $ionicPopup.alert({
                                        title: translate,
                                        template: '{{"serverDisconnect" | translate}}'
                                    });
                                });
                        }
                        else if(response === 201){
                            $ionicLoading.show({
                                template: '{{ "banMessage" | translate }}',
                                duration: 1500,
                                scope: $scope
                            });
                        }else{
                            $ionicLoading.show({
                                template: '{{ "banErrorMessage" | translate }}',
                                duration: 1500,
                                scope: $scope
                            });
                        }
                    });
                });
            });
        };

        /**
         * Slouži pro odstranění zprávy
         */
        $scope.delMessage = function () {
            RestService.delete("incommingMessages", objMessage.id_incomming_message).then(function (response) {
                if (response.status == 200) {
                    $ionicLoading.show({
                        template: '{{ "delMessage" | translate }}',
                        scope: $scope
                    });
                } else {
                    $ionicLoading.show({
                        template: '{{ "delErrorMessage" | translate }}',
                        scope: $scope
                    });
                }
                $timeout(function () {
                    $scope.hide();
                    $scope.loadMore();
                }, 1500);
            });

        };

    });
