'user strict';
angular.module('app')
    .controller('ShowController', function ($scope, $state, $ionicPopup, BackButtonFactory, NetworkService) {

        /**
         * Controller pro stránku show.html
         */

        $scope.hideGo = function (){
            if (NetworkService.checkOnline()) {
                BackButtonFactory.backButtonDisable();
                $state.go('app.setting');
            }else{
                $ionicPopup.alert({
                    title: 'Internet',
                    template: '{{"connection" | translate}}'
                });
            }

        };

    });
