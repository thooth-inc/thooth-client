(function (angular) {
    'use strict';

    EmailsController.$inject = ['nx', 'emailsFactory', '$routeParams', '$sce', 'nxProgress', '$location', '$uibModal'];
    function EmailsController(nx, emailsFactory, $routeParams, $sce, nxProgress, $location, $uibModal) {
        var vm = this;
        vm.selectedBrandEmailDetails = {};
        vm.selectedBrandEmails = [];
        vm.emailsResultSet = [];
        vm.accountId = "";
        vm.dataloaded = false;
        vm.selectedBrandName = $routeParams.brand;
        vm.token = $routeParams.contextio_token;
        vm.toggleMailPreview = false;
        vm.toggleLSideBar = false;
        vm.marriotAccountId = MARRIOTT_ID;
        vm.isMarriotMailRequest = false;
        vm.emails = [];
        vm.selectedAccount = '';
        vm.seeAttach = false;
        vm.switchAccount = false;
        vm.defaultImage = BASE_URL + API_EMAILIMAGE_URL + 'email_img_3';
        vm.getEmailTypeImage = function (imageid) {
            return BASE_URL + API_EMAILIMAGE_URL + imageid;
        };

        vm.deleteAccountRequest = false;
        vm.deletePrimary = false;
        vm.firstMail = "";
        vm.googleOpen = false;
        vm.yahooOpen = false;
        vm.outlookOpen = false;

        vm.scrollConfigEmailList = {
            autoHideScrollbar: true,
            theme: SCROLLBAR_TYPE,
            scrollInertia: 100,
            axis: 'y',
            setHeight: 590,
            advanced:{
                updateOnContentResize: true
            }
        };

        vm.scrollConfigEmailPreview = {
            autoHideScrollbar: true,
            theme: SCROLLBAR_TYPE,
            scrollInertia: 100,
            axis: 'xy',
            setHeight: 600,
            advanced:{
                updateOnContentResize: true
            }
        };

        vm.openSidebarIfNotExpanded = function () {
            if (!vm.toggleLSideBar)
                vm.toggleLSideBar = true;
        };


        /**
         * @author : Maitree Kuria, Amit Mahida
         *
         * used to get emails associated with selected brand
         */
        vm.init = function () {
            if (sessionStorage.getItem('currentAccountDetails') === null) {
                $location.path('addAccount');
            } else {
                vm.isMarriotMailRequest = false;
                var currentAccount = JSON.parse(sessionStorage.getItem('currentAccountDetails'));

                vm.currentlySelected = currentAccount.email;
                if (currentAccount.provider === 'gmail')
                    vm.googleOpen = true;
                if (currentAccount.provider === 'yahoo')
                    vm.yahooOpen = true;
                if (currentAccount.provider === 'outlook')
                    vm.outlookOpen = true;

                vm.getAccounts();
                vm.getSelectedBrandEmails();
            }
        };

        function getAccountType(email) {
            var emailType = email.substring(email.lastIndexOf("@") + 1, email.lastIndexOf("."));
            return emailType;
        }

        /**
         * @author : Maitree Kuria, Amit Mahida
         *
         * used to get emails when switching mail acocunts
         */
        vm.switchMailAccount = function (emailObj) {
            vm.currentlySelected = emailObj.emailId;
            nxProgress.start();
            vm.emails = [];
            vm.emailsResultSet = [];
            vm.accountId = emailObj.accountId;
            vm.switchAccount = true;
            vm.isMarriotMailRequest = false;
            var currentAccount = {
                email: emailObj.emailId,
                accountId: emailObj.accountId,
                provider: getAccountType(emailObj.emailId)
            };

            if (emailObj.provider === 'gmail') {
                vm.googleOpen = true;
            }
            else if (emailObj.provider === 'yahoo') {
                vm.yahooOpen = true;
            }
            else if (emailObj.provider === 'outlook') {
                vm.outlookOpen = true;
            }
            sessionStorage.setItem('currentAccountDetails', JSON.stringify(currentAccount));
            vm.getSelectedBrandEmails();
        };

        /**
         * @author : Maitree Kuria
         *
         * used to get emails associated with selected brand from marriott account
         */
        vm.fetchMarriottMails = function () {
            vm.isMarriotMailRequest = true;
            vm.getSelectedBrandEmails();
        };

        /**
         * @author : Maitree Kuria
         *
         * used to get change css of selected mail
         */
        vm.setClickedMail = function (index) {  //function that sets the value of selectedMail to current index
            vm.selectedMail = index;
        };

        /**
         * @author : Maitree Kuria, Amit Mahida
         *
         * used to get emails associated with selected brand
         */
        vm.getSelectedBrandEmails = function () {
            
            nxProgress.start();
            vm.selectedBrandName = JSON.parse(localStorage.getItem('selectedBrand')).brandName;
            emailsFactory.getSelectedBrandEmails(vm.selectedBrandName).then(function (success) {
                if (success.status === 200) {
                    if (typeof success.data !== "undefined" && success.data.length !== 0) {
                        vm.selectedBrandEmailDetails = success.data;
                        vm.getMails();
                    } else {
                        nx.message.error("No details are avaliable for the selected brand");
                    }
                }
                nxProgress.complete();
            }, function (error) {
                nx.message.error(error);
                nxProgress.complete();
            });
        };

        /**
         * @author : Maitree Kuria
         *
         * used to get mails from the connected account recieved from the brand email
         */
        vm.getMails = function () {
            vm.selectedMail = null;
            angular.forEach(vm.selectedBrandEmailDetails, function (value, key) {
                angular.forEach(value.emailDetails, function (val, ky) {
                    if (vm.isMarriotMailRequest) {
                        vm.accountId = vm.marriotAccountId;
                    } else {
                        if (!vm.switchAccount) {
                            var currentAccountDetails = JSON.parse(sessionStorage.getItem('currentAccountDetails'));
                            vm.accountId = currentAccountDetails.accountId;
                        }
                    }
                    vm.getMailsServiceCall(val.brandEmailId, vm.accountId, val.emailType, val.imageId);
                });
            });
        };

        /**
         * @author : Maitree Kuria
         *
         * used to get mails via service call
         */
        vm.getMailsServiceCall = function (brandEmailId, accountId, emailType, imageId) {
            if (vm.switchAccount) {
                vm.dataloaded = false;
            }

            nxProgress.start();

            emailsFactory.getMails(brandEmailId, accountId).then(function (success) {
                if (success.status === 200) {
                    if (typeof success.data !== "undefined" && success.data.length !== 0) {
                        vm.emails = success.data;
                        vm.emailsResultSet = vm.emailsResultSet.concat(vm.emails);
                        var emailType = emailType;
                        angular.forEach(vm.emails, function (v, k) {
                            //if (v.subject.indexOf(emailType) !== -1) {
                                vm.emailsResultSet[k].email_image = BASE_URL + API_EMAILIMAGE_URL + imageId;
                            //}
                        });
                        vm.dataloaded = true;
                        vm.getFirstMailBody();
                    } else {
                        nx.message.error("No mails are avaliable for selected brand");
                    }
                }
                nxProgress.complete();
            }, function (error) {
                nx.message.error(error);
            });
        };

        vm.getFirstMailBody = function () {
            vm.firstMail = vm.emailsResultSet[0].message_id;
            vm.setClickedMail(0);
            vm.getMailBodies(vm.firstMail,0);
        };

        /**
         * @author : Maitree Kuria
         *
         * used to get body of selected mail
         */
        vm.getMailBodies = function (message_id,index) {
            vm.setClickedMail(index);
            nxProgress.start();
            emailsFactory.getMailBodies(message_id, vm.accountId).then(function (success) {
                if (success.status === 200) {
                    if (typeof success.data !== "undefined" && success.data.length !== 0 && !success.data.hasOwnProperty('error')) {
                        vm.emails = success.data;
                        angular.forEach(vm.emails.body, function (value, key) {
                            vm.emails.message_content = $sce.trustAsHtml(value.content);
                        });
                    } else {
                        nx.message.error("Having issue with displaying mail body. Please try again later!");
                    }
                }
                nxProgress.complete();
            }, function (error) {
                nx.message.error(error);
            });
        };


        /**
         * @author : Maitree Kuria
         *
         * used to get emails associated with selected brand
         */
        vm.changeBrand = function () {
            sessionStorage.setItem('changeBrand', true);
            $location.path('/brands');
        };

        /**
         * @author : Maitree Kuria
         *
         * used to delete account from context.io
         */
        vm.deleteAccount = function (accountId,emailId) {
            vm.deleteAccountRequest = true;
            vm.emails = [];
            vm.emailsResultSet = [];
            var deletePrimary = vm.deletePrimary;
            vm.emailIdToDelete = emailId;
            var userid = JSON.parse(localStorage.getItem('userDetails')).userID;
            emailsFactory.deleteAccount(userid, accountId, emailId, deletePrimary).then(function (success) {
                if (success.data.status === 200 && success.data.primary) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'app/components/emails/modal-instance/model-content.html',
                        controller: 'deleteAccountCtrl',
                        controllerAs: 'modalCtrl',
                        size: 'md',
                        resolve: {
                            deletePrimary: vm.deletePrimary
                        }
                    });

                    modalInstance.result.then(function () {
                        deletePrimary = true;
                        emailsFactory.deleteAccount(userid, accountId, vm.emailIdToDelete, deletePrimary).then(function (success) {
                            localStorage.clear();
                            sessionStorage.clear();
                            $location.path('addAccount');
                        }, function (error) {
                            nx.message.error(error);
                        });
                    });
                } else {
                    nx.message.success('Account deleted successfully');
                    vm.getAccounts();
                }

            }, function (error) {
                console.log(error);
            });
        };

        /**
         * @author : Amit Mahida
         */
        vm.getAccounts = function () {
            nxProgress.start();
            if (vm.deleteAccountRequest) {
                vm.gmailAccounts = [];
                vm.yahooAccounts = [];
                vm.outlookAccounts = [];
            }
            vm.deleteAccountRequest = false;
            var userDetails = localStorage.getItem("userDetails");
            if (userDetails === null) {
                $location.path('addAccount');
            } else {
                emailsFactory.getAccounts(userDetails).then(function (data) {
                    if (data.status === 200) {
                        if (data.data.length === 0) {
                            localStorage.clear();
                            sessionStorage.clear();
                            $location.path('addAccount');
                        } else {
                            if (data.data.gmail) {
                                vm.gmailAccounts = data.data.gmail;
                            }

                            if (data.data.yahoo) {
                                vm.yahooAccounts = data.data.yahoo;
                            }

                            if (data.data.outlook) {
                                vm.outlookAccounts = data.data.outlook;
                            }
                        }
                    }
                    nxProgress.complete();
                }, function (error) {
                    nx.message.error(error);
                });
            }
        };

        vm.addAnotherAccount = function () {
            sessionStorage.setItem('addnew', true);
            $location.path('addAccount');
        };

        /**
         * @author: Amit Mahida
         * @param fileId
         */
        vm.getImageUrl = function (fileId) {
            vm.seeAttach = true;
            nxProgress.start();
            emailsFactory.getFile(vm.accountId, fileId).then(function (data) {
                nxProgress.complete();
                console.log("++++++++++++++++++++");
                // console.log(data);
                if (data.status === 200) {
                    if (typeof data.data !== "undefined" && data.data.length !== 0 && data.data.error !== true) {
                        vm.fileUrl = data.data.fileUrl;
                        window.open(vm.fileUrl, '_blank', 'toolbar=1,location=0,menubar=0');
                    } else if (data.data.status === 404 && data.data.error === true) {
                        nx.message.error(data.data.message);
                    } else {
                        nx.message.error("Image URL not found");
                    }
                }
            }, function (error) {
                nx.message.error(error);
            });
        };
    }

    angular.module('emails', ['ngSanitize', 'ui.bootstrap', 'ngAnimate', 'nxLibrary', 'ngScrollbars'])
        .component('emailComponent', {
            templateUrl: 'app/components/emails/email-component.html',
            controller: EmailsController,
            controllerAs: 'vm'
        })
})(window.angular);