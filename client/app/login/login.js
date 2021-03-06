var liquidApp = angular.module('liquidAccessApp');

liquidApp.controller('loginController', ['$scope', '$window', 'AuthService', '$location', function($scope, $window, AuthService, $location) {
    var vm = this;

    this.login = function()  {
        if(vm.email && vm.password) {
            // initial values
            vm.error = false;
            vm.disabled = true;

            // call register from service
            AuthService.login(vm.email, vm.password)
            // handle success
                .then(function (response) {
                    console.log(response);
                    $location.path("/");
                    vm.disabled = false;

                })
                // handle error
                .catch(function (errResponse) {
                    vm.error = true;
                    vm.errorMessage = errResponse.msg;
                    vm.disabled = false;
                });
        }
        else {
            $window.alert("Enter username and password to login");
        }
    };
}]);
