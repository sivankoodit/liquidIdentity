var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('signupController', ['$scope', '$window', 'AuthService', 'fileReader', '$location', function($scope, $window, AuthService, fileReader, $location) {
	var vm = this;
	var formData = new FormData();

    $scope.getFile = function () {
        $scope.progress = 0;
        formData.append('profilepic', $scope.file);
        fileReader.readAsDataUrl($scope.file, $scope)
            .then(function(result) {
                $scope.imageSrc = result;
            });
    };

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
            AuthService.register(vm.firstname, vm.lastname, vm.password, vm.email, formData)
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
