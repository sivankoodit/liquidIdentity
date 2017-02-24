/**
 * Created by siva on 23/02/2017.
 */
var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('homeController', ['$scope', '$window', 'AuthService', '$location', function($scope, $window, AuthService, $location) {
    var vm = this;

    this.getUser = function() {

        var user = AuthService.getCurrentUser();
        // call register from service
        if(user)
        {
            vm.welcomeMsg = "Welcome " + user.firstname + " " + user.lastname;
        }
        else
        {
            vm.welcomeMsg = "Welcome! Login to access subscriber contents"
        }
    };

}]);
