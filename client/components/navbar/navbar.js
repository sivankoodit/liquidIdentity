/**
 * Created by siva on 23/02/2017.
 */
var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('navBarController', ['AuthService', function(AuthService) {
    var vm = this;

    this.isActive = function (viewLocation) {
    	this.updateUser();
        return viewLocation === $location.path();
    };

    this.updateUser = function() {

    	// call register from service
        AuthService.getUserInfo()
        // handle success
            .then(function (response) {
                console.log(response);
                vm.welcomeMsg = "Welcome " + response.user.firstname + " " + response.user.lastname;
            })
            // handle error
            .catch(function (errResponse) {
                vm.welcomeMsg = "Welcome! Login to access subscriber contents";
            });
    };

    this.updateUser();

}]);