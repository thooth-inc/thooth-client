(function (angular) {
    angular.module('accounts').factory('accountsFactory', ['$http', function ($http) {

        /**
         * @author : Amit Mahida
         * @type {{}}
         */
        var accountsFactory = {};

        /**
         * @author : Amit Mahida
         * @param email
         * @param userDetails
         * @returns {*}
         */
        accountsFactory.addAccount = function (email,userDetails) {
            var req = {
                method: HTTP_POST,
                url: BASE_URL + '/account/add',
                data: {
                    email: email,
                    callback_url: window.location.origin + '/brands',
                    userDetails: userDetails
                }
            };
            return $http(req);
        };

        return accountsFactory;
    }]);
})(window.angular);
