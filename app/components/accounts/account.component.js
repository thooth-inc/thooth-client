(function (angular) {

    accountsController.$inject = ['nx', 'accountsFactory', '$location', '$uibModal'];

    function accountsController(nx, accountsFactory, $location, $uibModal) {
        var ctrl = this;

        ctrl.initAccount = function () {
            if (localStorage.getItem("userDetails") === null)
                ctrl.userID = '_' + Math.random().toString(20).substr(2, 20) + Date.now();
            else {
                ctrl.userID = JSON.parse(localStorage.getItem("userDetails")).userID;
                var addnew = sessionStorage.getItem('addnew');
                if (addnew === null || addnew !== 'true') {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'app/components/accounts/modal-instance/model-content.html',
                        controller: 'ModalInstanceCtrl',
                        controllerAs: 'modalCtrl',
                        size: 'md',
                        backdrop: false,
                        keyboard  : false,
                        backdropClass: 'modal-backdrop',
                        resolve: {}
                    });

                    modalInstance.result.then(function () {
                        $location.path('/brands');
                    }, function () {
                        localStorage.clear();
                        ctrl.userID = '_' + Math.random().toString(20).substr(2, 20) + Date.now();
                    });
                }
            }
        };

        /**
         * @author : Amit Mahida
         */
        ctrl.addAccount = function () {
            nx.progress.start();
            sessionStorage.setItem('changeBrand', false);

            accountsFactory.addAccount(ctrl.email).then(function (data) {
                if (data.data.error) {
                    nx.message.error(data.data.message);
                    nx.progress.complete();
                } else {
                    var userDetails = {
                        userID: ctrl.userID,
                        primaryEmail: ''
                    };
                    if (localStorage.getItem("userDetails") === null){
                        localStorage.setItem('userDetails', JSON.stringify(userDetails));
                    }

                    nx.progress.complete();
                    window.location.replace(data.data.browser_redirect_url);
                }
            }, function (error) {
                nx.progress.complete();
                nx.message.error(error);
            });
        };

    }

    angular.module('accounts', ['ui.bootstrap'])
        .component('account', {
            templateUrl: 'app/components/accounts/account-component.html',
            controller: accountsController,
            controllerAs: 'vm'
        });

})(window.angular);