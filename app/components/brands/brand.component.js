(function (angular) {
    'use strict';

    BrandsController.$inject = ['nx', 'brandsFactory', '$location', '$routeParams', 'nxProgress'];
    function BrandsController(nx, brandsFactory, $location, $routeParams, nxProgress) {
        var ctrl = this;

        ctrl.scrollConfigBrands = {
            autoHideScrollbar: true,
            theme: SCROLLBAR_TYPE,
            scrollInertia: 10,
            axis: 'y',
            setHeight: 550,
            advanced:{
                updateOnContentResize: true
            }
        };

        function getAccountType(email) {
            var emailType = email.substring(email.lastIndexOf("@") + 1, email.lastIndexOf("."));
            return emailType;
        }

        function getCurrentAccount() {
            nxProgress.start();
            brandsFactory.getCurrentAccount($routeParams.contextio_token).then(function (currentAccountDetails) {
                var curruntAccount = {
                    email: currentAccountDetails.data.email,
                    accountId: currentAccountDetails.data.account.id,
                    provider: getAccountType(currentAccountDetails.data.email)
                };
                sessionStorage.setItem('currentAccountDetails', JSON.stringify(curruntAccount));
                nxProgress.complete();
            });
        }

        ctrl.createNewUserAccount = function () {
            var requestParams = {
                token: $routeParams.contextio_token,
                userDetails: JSON.parse(localStorage.getItem("userDetails"))
            };
            nxProgress.start();
            brandsFactory.createNewUserFromToken(requestParams.token, requestParams.userDetails).then(function (success) {
                if (success.status === 200) {
                    if (typeof success.data == "undefined" && success.data != null || success.data != '') {
                        var userDetails = {
                            userID: JSON.parse(localStorage.getItem("userDetails")).userID,
                            primaryEmail: success.data.primaryEmail,
                            accountId: success.data.accountId
                        };
                        localStorage.setItem('userDetails', JSON.stringify(userDetails));
                    } else {
                        nx.message.error("Error storing primary email");
                    }
                }
                getCurrentAccount();
                ctrl.findBrands();
            }, function (error) {
                nx.message.error(error);
            });
        };

        ctrl.contextio_token = $location.search().contextio_token;
        ctrl.brandDetails = [];
        ctrl.selectedBrandObj = [];

        /**
         * @author : Maitree Kuria
         *
         * used to get imageId based on email type from subject line keywords
         */
        ctrl.getBrandImageId = function () {
            angular.forEach(ctrl.brandDetails, function (value, key) {
                ctrl.brandDetails[key].brand_image = BASE_URL + API_BRANDIMAGE_URL + value.brandIcon;
            });
        };
        /**
         * @author : Maitree Kuria
         */
        ctrl.findBrands = function () {
            nxProgress.start();
            brandsFactory.getBrands().then(function (success) {
                if (success.status === 200) {
                    if (typeof success.data != "undefined" && success.data.length != 0) {
                        ctrl.brandDetails = success.data;
                        ctrl.getBrandImageId();
                    } else {
                        nx.message.error("No brands available");
                    }
                }
                nxProgress.complete();
            }, function (error) {
                nx.message.error(error);
            });
        };

        /**
         * Method which will be excuted first
         * @author : Amit Mahida
         */
        ctrl.init = function () {
            if ($routeParams.contextio_token && sessionStorage.getItem('changeBrand') == 'false') {
                ctrl.createNewUserAccount();
            } else {
                var user = JSON.parse(localStorage.getItem('userDetails'));
                var curruntAccount = {
                    email: user.primaryEmail,
                    accountId: user.accountId,
                    provider: getAccountType(user.primaryEmail)
                };
                if(sessionStorage.getItem('currentAccountDetails') == null)
                    sessionStorage.setItem('currentAccountDetails', JSON.stringify(curruntAccount));
                ctrl.findBrands();
            }
        };

        /**
         * @author : Maitree Kuria
         */
        ctrl.redirectToViewMails = function (brand) {
            ctrl.selectedBrandObj = brand;
            localStorage.setItem('selectedBrand', JSON.stringify(ctrl.selectedBrandObj));
            $location.url($location.path());
            $location.path('/emails');
        };
    }

    angular.module('brands', ['nxLibrary', 'ngScrollbars'])
        .component('brandComponent', {
            templateUrl: 'app/components/brands/brand-component.html',
            controller: BrandsController,
            controllerAs: 'BrandsCtrl'
        })

})(window.angular);
