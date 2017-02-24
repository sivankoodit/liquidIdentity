/**
 * Created by siva on 23/02/2017.
 */
var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('homeController', ['$scope', '$window', 'AuthService', '$location', function($scope, $window, AuthService, $location) {
    var vm = this;

    this.isLoggedIn = function() {

        var user = AuthService.getCurrentUser();
        // call register from service
        if(user)
        {
            $location.path("/newsitem");
        }
        else
        {
            window.alert("Login to access subscriber content");
        }
    };

}]);
