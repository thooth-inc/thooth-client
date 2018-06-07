(function (angular) {
    'use strict';
    angular.module('emails').factory('emailsFactory', ['$http', function ($http) {

        /**
         * @author : Maitree Kuria
         * @type {{}}
         */
        var emailsFactory = {};

        /**
         * @author : Maitree Kuria
         * @returns {*}
         */
        emailsFactory.getMails = function (email, accountId) {
            var req = {
                method: HTTP_GET,
                url: BASE_URL + '/emails?email=' + email + '&accountId=' + accountId
            };
            return $http(req);
        };

        /**
         * @author : Maitree Kuria
         * @returns {*}
         */
        emailsFactory.checkIfPrimary = function (emailObj) {
            var req = {
                method: HTTP_GET,
                url: BASE_URL + '/account?emailObj=' + emailObj
            };
            return $http(req);
        };


        /**
         * @author : Maitree Kuria
         * @returns {*}
         */
        emailsFactory.updateAccount = function (emailObj) {
            var req = {
                method: HTTP_GET,
                url: BASE_URL + '/account/update?emailObj=' + emailObj
            };
            return $http(req);
        };

        /**
         * @author Amit Mahida
         * @param userID
         * @param accountId
         * @param deletePrimary
         * @returns {*}
         */
        emailsFactory.deleteAccount = function (userID, accountId,emailId, deletePrimary) {
            var req = {
                method: HTTP_PUT,
                url: BASE_URL + '/account/delete',
                data: {
                    "userId": userID,
                    "accountId": accountId,
                    "deletePrimary": deletePrimary,
                    "emailId": emailId
                }
            };
            return $http(req);
        };

        /**
         * @author : Amit Mahida
         * @returns {*}
         */
        emailsFactory.getAccounts = function (userDetails) {
            var req = {
                method: HTTP_POST,
                url: BASE_URL + '/accounts',
                data: {userDetails: userDetails}
            };
            return $http(req);
        };

        /**
         * @author : Maitree Kuria
         * @returns {*}
         */
        emailsFactory.getMailBodies = function (msgId, accountId) {
            var req = {
                method: HTTP_GET,
                url: BASE_URL + '/emails/messagebody?msgId=' + msgId + '&accountId=' + accountId
            };
            return $http(req);
        };

        /**
         * @author : Maitree Kuria
         * @returns {*}
         */
        emailsFactory.getBrandEmailDetails = function (email) {
            var req = {
                method: HTTP_GET,
                url: BASE_URL + '/brandEmailDetails?email=' + email
            };
            return $http(req);
        };

        /**
         * @author: Amit Mahida
         * @param accountId
         * @param fileId
         * @returns {*}
         */
        emailsFactory.getFile = function (accountId, fileId) {

            var req = {
                method: HTTP_GET,
                url: BASE_URL + '/getFile?accountId=' + accountId + '&fileId=' + fileId
            };
            return $http(req);
        };

        /**
         * @author : Maitree Kuria
         * @returns {*}
         */
        emailsFactory.getSelectedBrandEmails = function (selectedBrandName) {
            var req = {
                method: HTTP_GET,
                url: BASE_URL + '/brand/details?brandName=' + selectedBrandName
            };
            return $http(req);
        };

        return emailsFactory;
    }]);
})(window.angular);
