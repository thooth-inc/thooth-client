(function (angular) {
    'use strict';
    angular.module('brands').factory('brandsFactory', ['$http', function ($http) {

        /**
         * @author : Maitree Kuria
         * @type {{}}
         */
        var brandsFactory = {};

        /**
         * @author : Maitree Kuria
         * @returns {*}
         */
        brandsFactory.getBrands = function () {
            var req = {
                method: HTTP_GET,
                url: BASE_URL + '/brands'
            };
            return $http(req);
        };


        /**
         * @author Amit Mahida
         * @description Used to get details about most recently added account
         * @param token
         * @returns {*}
         */
        brandsFactory.getCurrentAccount = function (token) {
            var req = {
                method: HTTP_GET,
                url: BASE_URL + '/getCurrentAccount?token='+token
            };
            return $http(req);
        };


        /**
         * @author Amit Mahida
         * @description Used to create new user in application database
         * @param token
         * @param userDetails
         * @returns {*}
         */
        brandsFactory.createNewUserFromToken = function (token,userDetails) {
            var req = {
                method: HTTP_POST,
                url: BASE_URL + '/addLocalAccount',
                data:{
                    token: token,
                    userDetails: userDetails
                }
            };
            return $http(req);
        };

        return brandsFactory;
    }]);
})(window.angular);
