'user strict';
angular.module('app')
    .factory('UserFactory', function () {

        /**
         * Factory pro obsloužení uživatele
         */
        var user = {};

        user.isLoggedIn = false;

        user.loginType = null;
        user.loginTypeData = null;
        user.idUser = null;
        user.firstName = null;
        user.lastName = null;
        user.nick = null;
        user.email = null;
        user.phone = null;
        user.birthdate = null;

        user.permissions = null;
        user.xAccessToken = null;

        var obj = {};

        obj.logIn = function (idUser, firstName, lastName, nick, email, phone, birthdate, loginType, loginTypeData, permissions, xAccessToken) {
            if (!user.isLoggedIn) {
                user.isLoggedIn = true;

                user.idUser = idUser;
                user.firstName = firstName;
                user.lastName = lastName;
                user.nick = nick;
                user.email = email;
                user.phone = phone;
                user.birthdate = birthdate;
                user.loginType = loginType; //'facebook', 'google', 'account'
                user.loginTypeData = loginTypeData; //dalsi data napr ze socialnich siti id, age_range, locale, link atd
                user.permissions = permissions;
                user.xAccessToken = xAccessToken;

                localStorage.setItem("user", JSON.stringify(user));
            }
        };
        obj.logOut = function () {
            user.isLoggedIn = false;

            user.loginType = null;
            user.loginTypeData = null;
            user.idUser = null;
            user.firstName = null;
            user.lastName = null;
            user.nick = null;
            user.email = null;
            user.phone = null;
            user.birthdate = null;

            user.permissions = null;
            user.xAccessToken = null;

            //smazani informaci o uctu
            //localStorage.removeItem('user');
            localStorage.setItem("user", JSON.stringify('login'))
        };
        obj.isLoggedIn = function () {
            return user.isLoggedIn;
        };

        obj.getLoginType = function () {
            return user.loginType;
        };

        obj.isPossibleChangePassword = function () {
            if (user.loginType === 'account')
                return true;

            return false;
        };

        obj.getLoginTypeData = function () {
            return user.loginTypeData;
        };

        obj.getIdUser = function () {
            return user.idUser;
        };

        obj.getFirstName = function () {
            return user.firstName;
        };

        obj.getLastName = function () {
            return user.lastName;
        };

        obj.getNick = function () {
            return user.nick;
        };

        obj.getEmail = function () {
            return user.email;
        };

        obj.getPhone = function () {
            return user.phone;
        };

        obj.getBirthdate = function () {
            return user.birthdate;
        };

        obj.getPermissions = function (){
            return user.permissions;
        }

        obj.getXAccessToken = function (){
            return user.xAccessToken;
        }

        obj.getDataToServer = function () {
            return {idUser: obj.getIdUser(), firstName: obj.getFirstName(), lastName: obj.getLastName(), nick: obj.getNick(), email: obj.getEmail(), phone: obj.getPhone(), birthdate: obj.getBirthdate(), xAccessToken:obj.getXAccessToken()};
        };

        return obj;
    });