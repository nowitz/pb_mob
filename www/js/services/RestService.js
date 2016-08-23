'user strict';
angular.module('app')
    .service('RestService', function ($http) {
        var baseURL = 'http://students.kiv.zcu.cz:8088/~nowitz/';

        /**
         * Service pro obslouzeni GET, POST, PUT, DELETE pozadavku
         */

        var url = {
            groupSettings: "group_settings",
            settings: "settings",
            partyboards: "partyboards",
            towns: "towns",
            incommingMessages: "incomming_messages",
            users: "users",
            auth: "auth",
            rolesUsersPartyboards:"roles_users_partyboards",
            banUserPartyboard: "ban_user_partyboard"
        };

        return {
            get: function (param, parFilter) {
                //console.log(param);
                var headers = {'Content-Type': 'application/json'};
                if (param !== "auth" && param !== "users") {
                    //console.log(JSON.parse(localStorage.getItem('user')));
                    headers['X-Access-Token'] = JSON.parse(localStorage.getItem('user')).xAccessToken;
                }
                return $http.get(baseURL + url[param]+parFilter, {
                    headers: headers
                }).then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    return response;
                });
            },
            post: function (param, obj) {
                //console.log(obj);
                var headers = {'Content-Type': 'application/json'};
                if (param !== "auth" && param !== "users") {
                    headers['X-Access-Token'] = JSON.parse(localStorage.getItem('user')).xAccessToken;
                }
                //  console.log(headers);
                return $http.post(baseURL + url[param], obj, {
                    headers: headers
                }).then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    return response;
                });
            },
            put: function (param, id, obj) {
                //console.log(param);
                var headers = {'Content-Type': 'application/json'};
                if (param !== "auth" && param !== "users") {
                    headers['X-Access-Token'] = JSON.parse(localStorage.getItem('user')).xAccessToken;
                }
                // console.log(header);
                return $http.put(baseURL + url[param]+"/"+id, obj, {
                    headers: headers
                }).then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    return response;
                });
            },
            delete: function (param, id) {
                var headers = {'Content-Type': 'application/json'};
                if (param !== "auth" && param !== "users") {
                    headers['X-Access-Token'] = JSON.parse(localStorage.getItem('user')).xAccessToken;
                }
                return $http.delete(baseURL + url[param] + "/" + id, {
                    headers: headers
                }).then(function (response) {
                    return response;
                });
            }
        };
    });

