var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('sharedAccessController', ['$scope', '$window', 'AuthService', 'fileReader', '$location', function($scope, $window, AuthService, fileReader, $location) {
	var vm = this;
    vm.userProfiles = null;
    vm.selectedProfile = null;

	this.init = function(){
        // Get the current logged in user
        AuthService.getUserInfo()
        // handle success
            .then(function (response) {
                console.log(response);
                vm.userProfiles = response.user.sharedAccessTo;
            })
            // handle error
            .catch(function (errResponse) {
                console.log("Error in init: "+ errResponse.msg);
            });
    };

	this.shareAccess = function()  {
		if(!vm.selectedProfile) {
			$window.alert("Select a profile to share access");
		}
		else {
            // initial values
            vm.error = false;
            vm.disabled = true;

            // call register from service
            AuthService.shareAccess(vm.selectedProfile.email, vm.extendAccessValidUntil)
            // handle success
                .then(function (response) {
                    console.log(response);
                    vm.info = true;
                	vm.extendedAccessURL = "http://localhost:8899/#/?info=" + response.token;
                    vm.disabled = false;
                })
                // handle error
                .catch(function (err) {
                    vm.error = true;
                    vm.extendAccessErrorMessage = err.msg;
                    vm.disabled = false;
                });
		}
	};

    this.createProfile = function()  {
        if(!vm.email) {
            $window.alert("Provide email to send shared access information to");
        } else if(!vm.agreeToTerms) {
            $window.alert("You have to read and agree to the terms and privacy");
        }
        else {
            // initial values
            vm.error = false;
            vm.disabled = true;

            // call register from service
            AuthService.createProfile(vm.firstname, vm.lastname, vm.email, vm.accessValidUntil)
            // handle success
                .then(function (response) {
                    console.log(response);
                    vm.info = true;
                    vm.sharedURL = "http://localhost:8899/#/?info=" + response.token;
                    vm.disabled = false;
                })
                // handle error
                .catch(function (err) {
                    vm.error = true;
                    vm.errorMessage = err.msg;
                    vm.disabled = false;
                });
        }
    };

	this.init();
}]);
