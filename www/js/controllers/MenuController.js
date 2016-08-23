'user strict';
angular.module('app')
    .controller('MenuController', function ($scope, ModalService, UserFactory, NetworkService) {

        /**
         * Controller pro stránku menu.html
         */

        /**
         * Propisu si ModalService abych nemusel metody implementovat v kontroleru MenuController.js
         */
        $scope.network = NetworkService;


        $scope.$on("$ionicView.beforeEnter", function () {
            if (localStorage.getItem('user') !== "login") {
                $scope.userFactory =  JSON.parse(localStorage.getItem('user'));
                //console.log("menu");
            }
        });


        //$scope.$on("$ionicView.enter", function () {
        //    console.log("cekam1");
        //});
        //$scope.$on("$ionicView.afterEnter", function () {
        //    console.log("cekam5");
        //});
        //$scope.$on("$ionicView.beforeLeave", function () {
        //    console.log("cekam4");
        //});
        //$scope.$on("$ionicView.leave", function () {
        //    console.log("cekam2");
        //});
        //$scope.$on("$ionicView.afterLeave", function () {
        //    console.log("cekam6");
        //});
        //
        //$scope.$on("$ionicView.unloaded", function () {
        //    console.log("cekam7");
        //});
        //$scope.$on("$ionicView.loaded", function () {
        //    console.log("cekam");
        //});

    });
