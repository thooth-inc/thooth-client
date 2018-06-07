(function (angular) {

    angular.module('accounts').controller('ModalInstanceCtrl', ['$uibModalInstance', function ($uibModalInstance) {
        var modalCtrl = this;

        modalCtrl.userDetails = JSON.parse(localStorage.getItem('userDetails'));

        modalCtrl.ok = function () {
            $uibModalInstance.close();
        };
        modalCtrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
})(window.angular);
