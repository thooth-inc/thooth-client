(function (angular) {
    angular.module('marriottEmailRoutes', ['ngRoute']).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "app/components/accounts/index.html"
            })
            .when("/addAccount", {
                templateUrl: "app/components/accounts/index.html"
            })
            .when("/brands", {
                templateUrl: "app/components/brands/index.html"
            })
            .when("/emails", {
                templateUrl: "app/components/emails/index.html"
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true).hashPrefix('*');

    }]);

})(window.angular);
