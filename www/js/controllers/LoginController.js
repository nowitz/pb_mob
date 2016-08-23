'user strict';
angular.module('app')
    .controller('LoginController', function ($scope, $ionicPopup, $state, $translate, UserFactory, ModalService, SettingFactory, NetworkService, RestService, BackButtonFactory) {


        /**
         * Controller pro stránku login.html
         */

        $scope.user = UserFactory;
        $scope.modalService = ModalService;
        BackButtonFactory.backButtonCancel();

        $scope.loginData = {};

        //login
        $scope.doLogin = function () {

            /**
             * Pokud nebude online tak me to nenecha skryt prihlaseni
             */
            if (NetworkService.checkOnline()) {
                //TODO kdyz localstorage nastavena tak zadnej dotaz a rovnou presmeruj - OVERIT PRES MOBIL V CONSOLE LG
                var logData = {
                    "email": $scope.loginData.email,
                    "password": CryptoJS.SHA1($scope.loginData.password).toString()
                };
                RestService.post("auth", logData).then(function (response) {
                    //console.log(response);
                    if(response.status === -1){
                        $translate('error').then(
                            function (translate) {
                                $ionicPopup.alert({
                                    title: translate,
                                    template: '{{"serverDisconnect" | translate}}'
                                });
                            });
                    }else if (response.status === 404) {
                        $translate('loginError').then(
                            function (translate) {
                                $ionicPopup.alert({
                                    title: translate,
                                    template: '{{"emailError" | translate}}'
                                });
                            });
                    } else if (response.status === 403) {
                        $translate('loginError').then(
                            function (translate) {
                                $ionicPopup.alert({
                                    title: translate,
                                    template: '{{"passwordError" | translate}}'
                                });
                            });
                    } else {
                        var user = response.data[0];
                        UserFactory.logIn(user.id_user, user.firstname, user.lastname, user.nick, user.email, user.phone, //.slice(5, 14)
                            user.birthdate, 'account', null, null, response.headers("x-access-token"));
                        // console.log(UserFactory.getDataToServer());
                        BackButtonFactory.backButtonDisable();
                        $state.go('app.partyboard');
                    }
                });

            } else {
                $ionicPopup.alert({
                    title: 'Internet',
                    template: '{{"connection" | translate}}'
                });
            }

        };

        $scope.logout = function () {
            //odhlaseni pres facebook
            //facebookConnectPlugin.logout(function(){
            //    alert("Odhlaseni");
            //}, function(){
            //    alert("error - Odhlaseni")
            //});

            delete($scope.loginData);
            $state.go('app.login');
            SettingFactory.del();
            //console.log(SettingFactory.get());
            UserFactory.logOut();
        }


        //forgot password
        $scope.forgotPassword = function () {
            var myPopup = null;
            $translate(['emailExample', 'forgotPasswordButton', 'forgotPasswordText', 'cancel', 'send']).then(function (translation) {
                myPopup = $ionicPopup.show({
                    template: '<input class="popup-input" type="email" placeholder="' + translation.emailExample + '" ng-model="loginData.email" ng-pattern="/^[_a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,4})$/">',
                    title: translation.forgotPasswordButton,
                    subTitle: translation.forgotPasswordText,
                    scope: $scope,
                    buttons: [
                        {text: translation.cancel},
                        {
                            text: '<b>' + translation.send + '</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.loginData.email) {
                                    e.preventDefault();
                                } else {
                                    return $scope.loginData.email;
                                }
                            }
                        }
                    ]
                });
                myPopup.then(function (email) {
                    console.log(email);
                    if (email) {
                        //Alert.show({loading: true});
                        //$http.post(SERVER_URL + "/forgottenpassword", {email: email}, {timeout: SERVER_TIMEOUT})
                        //    .success(function (data, status, header, config) {
                        //        if (data.success)
                        //            Alert.show({msg: 'NEW_PASSWORD_SENT', time: 3000}); //heslo se nemaze z loginData.email aby zustalo v Emailu pro prihlaseni
                        //        else
                        //            Alert.show({msg: data.msg, time: 3000});
                        //    })
                        //    .error(function (data, status, header, config) {
                        //        Device.isOnline() ? Alert.show({
                        //            msg: "AN_ERROR_CONNECTION",
                        //            time: 3000
                        //        }) : Alert.show({msg: "AN_ERROR_NOT_CONNECTED", time: 3000});
                        //    });
                    }
                });
            });
        };

        // todo doresit prihlaseni uzivatele
        var permisions = ["public_profile", "email", "user_friends"];
        $scope.loginFacebook = function () {
            facebookConnectPlugin.login(permisions, function (success) {
                facebookConnectPlugin.api("/me?fields=id,first_name,last_name,age_range", permisions, function (data) {
                    ModalService.hideLogin();
                    alert(JSON.stringify(data));
                }, function (error) {
                    alert("error data - " + JSON.stringify(error));
                });
            }, function (error) {
                alert("login error - " + +JSON.stringify(error));
            });
        }
    });