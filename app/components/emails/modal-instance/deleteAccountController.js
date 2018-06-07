angular.module('emails').controller('deleteAccountCtrl', ['$uibModalInstance', 'deletePrimary', function ($uibModalInstance, deletePrimary) {
    var modalCtrl = this;

    modalCtrl.deletePrimary = deletePrimary;
    modalCtrl.deletePrimary = false;
    //modalCtrl.userDetails = JSON.parse(localStorage.getItem('userDetails'));

    modalCtrl.ok = function () {
        $uibModalInstance.close();
    };

    modalCtrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
