(function (angular) {

    angular.module('marriottEmail', ['marriottEmailRoutes','accounts', 'brands', 'emails', 'nxLibrary'])
        .component('app', {
            templateUrl: 'app/app-component.html'
        });

})(window.angular);