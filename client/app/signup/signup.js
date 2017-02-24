var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('signupController', ['$scope', '$window', 'AuthService', '$location', function($scope, $window, AuthService, $location) {
	var vm = this;

	this.signup = function()  {
		if(vm.password && vm.password !== vm.confirmpwd) {
			$window.alert("Password and cofirm password fields should match");
		} else if(!vm.agreeToTerms) {
            $window.alert("You have to read and agree to the terms and privacy");
		}
		else {
            // initial values
            vm.error = false;
            vm.disabled = true;

            // call register from service
            AuthService.register(vm.firstname, vm.lastname, vm.password, vm.email)
            // handle success
                .then(function (response) {
                    console.log(response);
                	$location.path("/");
                    vm.disabled = false;
                })
                // handle error
                .catch(function () {
                    vm.error = true;
                    vm.errorMessage = "Something went wrong!";
                    vm.disabled = false;
                });
		}
	};		
}]);
