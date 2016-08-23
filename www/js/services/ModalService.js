'user strict';
angular.module('app')
    .service('ModalService', function ($ionicModal) {

        /**
         * Registration
         */
        this.showRegistration = function () {
            var service = this;
            if (service.registrationModal) {
                service.registrationModal.show();
            } else {
                $ionicModal.fromTemplateUrl('templates/registration.html', {
                    scope: null
                }).then(function (modal) {
                    service.registrationModal = modal;
                    service.registrationModal.show();
                });
            }
        };

        this.hideRegistration = function () {
            this.registrationModal && this.registrationModal.hide();
        };


    });