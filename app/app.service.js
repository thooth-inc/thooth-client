(function (angular) {
    'use strict';
    angular.module('appService',[]).factory('appFactory', ['$http', function ($http) {

        /**
         * @author : Amit Mahida
         * @type {{}}
         */
        var appFactory = {};

        /**
         * @author : Amit Mahida
         * @returns {*}
         */
        appFactory.getAccounts = function () {
            var req = {
                method: HTTP_GET,
                url: BASE_URL + '/accounts'
            };
            return $http(req);
        };

        return appFactory;
    }]);
})(window.angular);
